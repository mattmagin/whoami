# Manual Deploy Guide (Railway)

This project is currently deployed manually in Railway. Use this checklist to keep deploys consistent.

## Prerequisites

- Railway workspace with project access
- GitHub repo connected in Railway (if using source deploys)
- Latest code merged to `main`

## Services

Ensure these services exist in the Railway project:

- `web` (root directory: `web`)
- `tui` (root directory: `tui`)
- `postgres` (Railway Postgres image/service)

If creating from scratch:

1. Create `postgres` first.
2. Create `web` and `tui`.
3. Attach repo/source and set each service root directory.

## Environment Variables

### `web` service

- `NODE_ENV=production`
- `DATABASE_URL=${{postgres.DATABASE_URL}}` (Railway variable reference)

Optional (if contact email is enabled):

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `CONTACT_NOTIFICATION_EMAIL`

### `tui` service

- `PORT=2222`
- `SSH_MAX_SESSIONS=40`
- `SSH_RATE_LIMIT_PER_MIN=30`
- `SSH_IDLE_TIMEOUT_SECS=180`
- `SSH_MAX_SESSION_SECS=900`

## Networking / SSH

1. In Railway, expose the `tui` service over TCP.
2. Use the provided TCP endpoint and port for SSH.
3. Connect with:

```bash
ssh -p <railway-tcp-port> <railway-generated-host>
```

## Deploy Steps

1. Trigger deploy for `web` from latest `main`.
2. Trigger deploy for `tui` from latest `main`.
3. Confirm both deployments are healthy in Railway.

## Smoke Tests

### Web

- Open the site URL
- Verify API health endpoint responds:

```bash
curl -fsSL https://<web-domain>/api/version
```

### TUI

- SSH into the endpoint
- Verify app loads, can navigate, and exits cleanly

## Troubleshooting

- **Repo access errors (`serviceConnect`)**  
  Confirm Railway GitHub app access for the repo and workspace membership of the token owner.

- **Rate-limit on variable updates (`serviceInstanceRedeploy`)**  
  Wait a few minutes, then retry updates one service at a time.

- **Database connection issues**  
  Confirm `web` uses Railway reference `DATABASE_URL=${{postgres.DATABASE_URL}}` and Postgres service is healthy.

## Rollback

- Redeploy previous successful commit in Railway for affected service(s).
- If only env var changes caused breakage, revert env vars in Railway and redeploy.
