use std::collections::HashMap;
use std::env;
use std::net::{IpAddr, SocketAddr};
use std::process::Stdio;
use std::sync::Arc;
use std::time::{Duration, Instant};

use anyhow::{Context, Result};
use rand::rngs::OsRng;
use russh::keys::{Algorithm, PrivateKey};
use russh::server::{Auth, Msg, Session};
use russh::{Channel, ChannelId, CryptoVec};
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::process::{ChildStdin, Command};
use tokio::sync::{Mutex, OwnedSemaphorePermit, Semaphore};

const DEFAULT_PORT: u16 = 2222;
const DEFAULT_MAX_SESSIONS: usize = 40;
const DEFAULT_RATE_LIMIT_PER_MIN: usize = 30;
const DEFAULT_IDLE_TIMEOUT_SECS: u64 = 180;
const DEFAULT_MAX_SESSION_SECS: u64 = 900;

#[derive(Clone)]
struct ServerState {
    max_sessions: Arc<Semaphore>,
    per_ip_window: Arc<Mutex<HashMap<IpAddr, Vec<Instant>>>>,
    per_ip_rate_limit_per_min: usize,
    idle_timeout: Duration,
    max_session_duration: Duration,
}

impl ServerState {
    fn allow_connection(&self, peer: Option<SocketAddr>) -> bool {
        let Some(ip) = peer.map(|p| p.ip()) else {
            return true;
        };

        let now = Instant::now();
        let cutoff = now - Duration::from_secs(60);

        let mut guard = self.per_ip_window.blocking_lock();
        let bucket = guard.entry(ip).or_default();
        bucket.retain(|t| *t >= cutoff);

        if bucket.len() >= self.per_ip_rate_limit_per_min {
            return false;
        }

        bucket.push(now);
        true
    }
}

struct SshServer {
    state: ServerState,
}

impl russh::server::Server for SshServer {
    type Handler = ClientHandler;

    fn new_client(&mut self, peer_addr: Option<SocketAddr>) -> Self::Handler {
        ClientHandler {
            state: self.state.clone(),
            peer_addr,
            session_permit: None,
            child_stdin: None,
            started_at: Instant::now(),
            last_activity: Arc::new(Mutex::new(Instant::now())),
            active_channel: None,
        }
    }
}

struct ClientHandler {
    state: ServerState,
    peer_addr: Option<SocketAddr>,
    session_permit: Option<OwnedSemaphorePermit>,
    child_stdin: Option<ChildStdin>,
    started_at: Instant,
    last_activity: Arc<Mutex<Instant>>,
    active_channel: Option<ChannelId>,
}

impl ClientHandler {
    async fn spawn_tui_process(
        &mut self,
        channel: Channel<Msg>,
        session: &mut Session,
    ) -> Result<(), anyhow::Error> {
        if self.child_stdin.is_some() {
            return Ok(());
        }

        let exe = std::env::current_exe().context("resolve current executable path")?;
        let mut child = Command::new(exe)
            .arg("--child-session")
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::null())
            .spawn()
            .context("spawn child TUI session process")?;

        let stdin = child.stdin.take().context("capture child stdin")?;
        let mut stdout = child.stdout.take().context("capture child stdout")?;

        let handle = session.handle();
        let channel_id = channel.id();
        let idle_timeout = self.state.idle_timeout;
        let max_session_duration = self.state.max_session_duration;
        let last_activity = Arc::clone(&self.last_activity);
        let started_at = self.started_at;

        tokio::spawn(async move {
            let mut buf = vec![0_u8; 8192];
            loop {
                {
                    let last = *last_activity.lock().await;
                    if last.elapsed() > idle_timeout || started_at.elapsed() > max_session_duration {
                        let _ = handle.eof(channel_id).await;
                        let _ = handle.close(channel_id).await;
                        break;
                    }
                }

                match stdout.read(&mut buf).await {
                    Ok(0) => {
                        let _ = handle.eof(channel_id).await;
                        let _ = handle.close(channel_id).await;
                        break;
                    }
                    Ok(read) => {
                        if handle
                            .data(channel_id, CryptoVec::from_slice(&buf[..read]))
                            .await
                            .is_err()
                        {
                            break;
                        }
                    }
                    Err(_) => {
                        let _ = handle.eof(channel_id).await;
                        let _ = handle.close(channel_id).await;
                        break;
                    }
                }
            }
        });

        self.active_channel = Some(channel_id);
        self.child_stdin = Some(stdin);
        Ok(())
    }
}

impl russh::server::Handler for ClientHandler {
    type Error = anyhow::Error;

    async fn auth_none(&mut self, _user: &str) -> Result<Auth, Self::Error> {
        if !self.state.allow_connection(self.peer_addr) {
            return Ok(Auth::Reject);
        }

        match Arc::clone(&self.state.max_sessions).try_acquire_owned() {
            Ok(permit) => {
                self.session_permit = Some(permit);
                Ok(Auth::Accept)
            }
            Err(_) => Ok(Auth::Reject),
        }
    }

    async fn channel_open_session(
        &mut self,
        channel: Channel<Msg>,
        session: &mut Session,
    ) -> Result<bool, Self::Error> {
        self.spawn_tui_process(channel, session).await?;
        Ok(true)
    }

    async fn data(
        &mut self,
        channel: ChannelId,
        data: &[u8],
        _session: &mut Session,
    ) -> Result<(), Self::Error> {
        if self.active_channel != Some(channel) {
            return Ok(());
        }

        if let Some(stdin) = &mut self.child_stdin {
            stdin.write_all(data).await?;
            *self.last_activity.lock().await = Instant::now();
        }
        Ok(())
    }
}

fn parse_env_u16(key: &str, default: u16) -> u16 {
    env::var(key)
        .ok()
        .and_then(|v| v.parse::<u16>().ok())
        .unwrap_or(default)
}

fn parse_env_usize(key: &str, default: usize) -> usize {
    env::var(key)
        .ok()
        .and_then(|v| v.parse::<usize>().ok())
        .unwrap_or(default)
}

fn parse_env_u64(key: &str, default: u64) -> u64 {
    env::var(key)
        .ok()
        .and_then(|v| v.parse::<u64>().ok())
        .unwrap_or(default)
}

fn host_key() -> Result<PrivateKey> {
    let key = PrivateKey::random(&mut OsRng, Algorithm::Ed25519)
        .context("generate ephemeral ed25519 host key")?;
    Ok(key)
}

#[tokio::main]
async fn main() -> Result<()> {
    if env::args().any(|arg| arg == "--child-session") {
        return whoami_tui::runtime::run_stdio_tui().map_err(Into::into);
    }

    let port = parse_env_u16("PORT", DEFAULT_PORT);
    let max_sessions = parse_env_usize("SSH_MAX_SESSIONS", DEFAULT_MAX_SESSIONS);
    let per_ip_rate = parse_env_usize("SSH_RATE_LIMIT_PER_MIN", DEFAULT_RATE_LIMIT_PER_MIN);
    let idle_timeout = Duration::from_secs(parse_env_u64(
        "SSH_IDLE_TIMEOUT_SECS",
        DEFAULT_IDLE_TIMEOUT_SECS,
    ));
    let max_session_duration = Duration::from_secs(parse_env_u64(
        "SSH_MAX_SESSION_SECS",
        DEFAULT_MAX_SESSION_SECS,
    ));

    let state = ServerState {
        max_sessions: Arc::new(Semaphore::new(max_sessions)),
        per_ip_window: Arc::new(Mutex::new(HashMap::new())),
        per_ip_rate_limit_per_min: per_ip_rate,
        idle_timeout,
        max_session_duration,
    };

    let mut config = russh::server::Config {
        auth_rejection_time: Duration::from_millis(200),
        auth_rejection_time_initial: Some(Duration::from_millis(50)),
        inactivity_timeout: Some(idle_timeout),
        ..Default::default()
    };
    config.keys.push(host_key()?);

    let addr = format!("0.0.0.0:{port}");
    let server = SshServer { state };
    russh::server::run(Arc::new(config), addr, server)
        .await
        .context("run ssh server")?;
    Ok(())
}
