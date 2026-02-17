//! Shared runtime for running the interactive TUI.

use std::io;
use std::time::Duration;

use ratatui::Terminal;
use ratatui::backend::CrosstermBackend;
use tuirealm::application::PollStrategy;
use tuirealm::{Application, EventListenerCfg, Update};

use crate::model::Model;
use crate::msg::{Msg, ViewId};
use crate::ui::{App, mount_view};

/// Run the portfolio TUI using process stdio.
pub fn run_stdio_tui() -> io::Result<()> {
    crossterm::terminal::enable_raw_mode()?;
    let mut stdout = io::stdout();
    crossterm::execute!(
        stdout,
        crossterm::terminal::EnterAlternateScreen,
        crossterm::event::EnableMouseCapture
    )?;
    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend)?;

    let result = run_app(&mut terminal);

    crossterm::terminal::disable_raw_mode()?;
    crossterm::execute!(
        terminal.backend_mut(),
        crossterm::terminal::LeaveAlternateScreen,
        crossterm::event::DisableMouseCapture
    )?;
    terminal.show_cursor()?;

    if let Err(err) = result {
        eprintln!("Error: {err:?}");
    }

    Ok(())
}

fn run_app<B: ratatui::backend::Backend>(
    terminal: &mut Terminal<B>,
) -> Result<(), Box<dyn std::error::Error>> {
    let mut model = Model::new();

    let mut app: App = Application::init(
        EventListenerCfg::default()
            .crossterm_input_listener(Duration::from_millis(50), 3)
            .poll_timeout(Duration::from_millis(50))
            .tick_interval(Duration::from_millis(50)),
    );

    mount_view(&mut app, ViewId::Loading)?;
    let mut current_view = ViewId::Loading;

    while !model.quit {
        terminal.draw(|frame| {
            let area = frame.area();
            app.view(&current_view, frame, area);
        })?;

        let messages = match app.tick(PollStrategy::UpTo(3)) {
            Ok(msgs) => msgs,
            Err(_) => vec![],
        };

        for msg in messages {
            let new_view = match &msg {
                Msg::NavigateTo(view_id) => Some(*view_id),
                Msg::GoBack => Some(ViewId::Home),
                _ => None,
            };

            model.update(Some(msg));

            if let Some(view_id) = new_view {
                if view_id != current_view {
                    mount_view(&mut app, view_id)?;
                    current_view = view_id;
                }
            }
        }
    }

    Ok(())
}
