# Docker deployment

The whole portfolio runs as a docker-compose stack behind an nginx edge proxy.
Each project you add later is its own container that the proxy routes to under a
path (`its-akki.com/apps/<slug>/`).

```
proxy (nginx, TLS)
 ├── its-akki.com/            → frontend  (React SPA in nginx)
 ├── its-akki.com/apps/<slug> → <project> (future containers)
 └── api.its-akki.com/        → backend   (Django + gunicorn)  + /media/ from volume
```

Services live in `docker-compose.yml`; `deploy/nginx/conf.d/portfolio.conf` is the
routing config; SQLite (`backend/db.sqlite3`) and uploads (`backend/media/`) are
bind-mounted so data persists on the host.

## Local development

Local development does not use TLS or the edge proxy. Services are published
directly. The easiest option is the `Makefile` (`make up`, `make logs`,
`make shell-backend`, `make manage ARGS="..."`; run `make help` for the full
list), or you can use Compose directly:

```sh
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

- Frontend → http://localhost:8082
- Backend  → http://localhost:8010 (e.g. http://localhost:8010/api/projects/)

Ports collide with another project's stack? Override them:
`BACKEND_PORT=9010 FRONTEND_PORT=9082 make up` (or export the same vars before
a raw `docker compose` call).

`backend/.env` must contain `ANTHROPIC_API_KEY` for the chat box to work. The
backend runs with `DJANGO_DEBUG=True` in this overlay.

## Production (single VPS)

Prereqs: Docker + compose on the VPS, DNS A-records for `its-akki.com`,
`www.its-akki.com`, `api.its-akki.com` pointing at it, and this repo checked out.

1. Put production secrets in `backend/.env`:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   DJANGO_SECRET_KEY=<fresh 50-char secret>
   ```
   (`DJANGO_DEBUG=False`, `ALLOWED_HOSTS`, and CSRF origins are already set for
   prod in `docker-compose.yml`.) Optionally set `VITE_API_TOKEN` in a root `.env`.

2. Issue TLS certs **once**:
   ```sh
   ./deploy/init-letsencrypt.sh
   ```
   (Or, if the host already has Let's Encrypt certs, skip the script and point the
   proxy's `/etc/letsencrypt` mount at the host's `/etc/letsencrypt` instead.)

3. Bring everything up:
   ```sh
   docker compose up -d --build
   ```
   The `certbot` service auto-renews; the `backend` entrypoint runs `migrate` and
   `collectstatic` on every start.

Sanity check: `docker compose exec backend python manage.py check --deploy`.

## Add a project (the repeatable pattern)

1. Give the project a `Dockerfile` that serves on a known internal port. Build
   it to work under the `/apps/<slug>/` sub-path by setting its base href or
   router basename. An app that assumes the root path will return 404s for its assets.
2. Add it to `docker-compose.yml` (same network, **no** published ports):
   ```yaml
   trading:
     build: ./projects/trading
     restart: unless-stopped
     expose: ["8080"]
   ```
3. Add one block to `deploy/nginx/conf.d/portfolio.conf` inside the
   `its-akki.com` server (there's a commented template there):
   ```nginx
   location /apps/trading/ {
       proxy_pass http://trading:8080/;   # trailing slash strips the prefix
   }
   ```
4. Apply it:
   ```sh
   docker compose up -d trading
   docker compose exec proxy nginx -s reload
   ```

`/apps/` is used (not `/projects/`) because the SPA already owns the `/projects`
client-side route.
