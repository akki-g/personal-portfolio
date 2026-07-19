#!/bin/sh
# One-time TLS bootstrap for a fresh VPS: stands up a dummy cert so nginx can
# start, then swaps it for a real Let's Encrypt cert via the webroot challenge.
# Run once from the project root:  ./deploy/init-letsencrypt.sh
#
# Skip this entirely if you already have certificates on the host. Point the
# proxy's /etc/letsencrypt mount at your existing /etc/letsencrypt instead.
set -e

DOMAINS="its-akki.com www.its-akki.com api.its-akki.com citepilot.its-akki.com"
EMAIL="akshat.guduru@gmail.com"          # Let's Encrypt expiry notices
PRIMARY="its-akki.com"                    # cert lineage name (live/its-akki.com)
CONF="./deploy/certbot/conf"
LIVE="$CONF/live/$PRIMARY"

mkdir -p "$LIVE" ./deploy/certbot/www
docker network inspect portfolio-edge >/dev/null 2>&1 \
  || docker network create portfolio-edge >/dev/null

echo "### Creating a temporary self-signed cert so nginx can start ..."
docker run --rm --entrypoint sh \
  -v "$(pwd)/deploy/certbot/conf:/etc/letsencrypt" certbot/certbot \
  -c "openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout /etc/letsencrypt/live/$PRIMARY/privkey.pem \
    -out /etc/letsencrypt/live/$PRIMARY/fullchain.pem \
    -subj '/CN=localhost'"

echo "### Starting the proxy ..."
docker compose up -d proxy

echo "### Deleting the dummy cert and requesting the real one ..."
docker compose run --rm --entrypoint "\
  rm -rf /etc/letsencrypt/live/$PRIMARY \
         /etc/letsencrypt/archive/$PRIMARY \
         /etc/letsencrypt/renewal/$PRIMARY.conf" certbot

DOMAIN_ARGS=""
for d in $DOMAINS; do DOMAIN_ARGS="$DOMAIN_ARGS -d $d"; done

docker compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    --email $EMAIL --agree-tos --no-eff-email \
    --cert-name $PRIMARY $DOMAIN_ARGS" certbot

echo "### Reloading nginx with the real cert ..."
docker compose exec proxy nginx -s reload
echo "### Done. Bring the full stack up with: docker compose up -d --build"
