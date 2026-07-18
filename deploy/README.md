# Docker deployment

The portfolio runs behind its own nginx edge proxy. Independently deployed
project stacks join the external `portfolio-edge` Docker network, and the proxy
routes a project subdomain to that stack's web gateway.

```
proxy (nginx, TLS)
 ├── its-akki.com/            → frontend  (React SPA in nginx)
 ├── citepilot.its-akki.com/  → citepilot-web:8080
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

3. Create the shared edge network and bring the portfolio up:
   ```sh
   make prod-up
   ```
   `make prod-up` creates `portfolio-edge` and the ignored SQLite/media runtime
   paths if they do not exist, then starts the stack. Only the `proxy` service
   joins the shared network.
   The `certbot` service auto-renews; the `backend` entrypoint runs `migrate` and
   `collectstatic` on every start.

Sanity check: `docker compose exec backend python manage.py check --deploy`.

## CitePilot connection

CitePilot's production Compose stack joins its `web` service to
`portfolio-edge` with the DNS alias `citepilot-web`. It does not publish a host
port. The portfolio proxy resolves that alias through Docker and forwards
`citepilot.its-akki.com` to port 8080. If CitePilot is stopped, the portfolio
stays online and the CitePilot subdomain returns a gateway error until its web
container returns.

On EC2:

1. Add an `A` record for `citepilot.its-akki.com` pointing to the instance.
2. Set CitePilot's `FRONTEND_URL` and `BACKEND_URL` to
   `https://citepilot.its-akki.com` in `/opt/citepilot/.env.production`.
3. Start the portfolio first with `make prod-up`, then deploy CitePilot. Both
   commands safely create the same external network.
4. Set the CitePilot project's `live_link` in the portfolio admin to
   `https://citepilot.its-akki.com`. Project cards already read this value from
   the API, so the demo link is data-driven rather than hardcoded in React.

For an existing certificate, expand its SAN list once after DNS resolves:

```sh
docker compose run --rm certbot certonly --webroot -w /var/www/certbot \
  --cert-name its-akki.com --expand \
  -d its-akki.com -d www.its-akki.com -d api.its-akki.com \
  -d citepilot.its-akki.com
docker compose exec proxy nginx -s reload
```

Fresh installations automatically include the CitePilot hostname through
`deploy/init-letsencrypt.sh`.

## Add another project (the repeatable pattern)

1. Give the project a production web gateway that serves on a known internal
   port.
2. Attach only that gateway to the external `portfolio-edge` network, with a
   unique network alias and no published host port:
   ```yaml
   services:
     web:
       networks:
         portfolio_edge:
           aliases: [trading-web]

   networks:
     portfolio_edge:
       name: portfolio-edge
       external: true
   ```
3. Add a subdomain server to `deploy/nginx/conf.d/portfolio.conf` that uses
   Docker's `127.0.0.11` resolver and proxies to the alias:
   ```nginx
   resolver 127.0.0.11 valid=30s ipv6=off;
   set $trading_upstream http://trading-web:8080;
   location / {
       proxy_pass $trading_upstream;
   }
   ```
4. Add the DNS record and hostname to the TLS certificate, deploy the project,
   then reload the portfolio proxy.
