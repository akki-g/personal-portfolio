# Convenience wrapper around docker compose for local testing.
# Prod commands (no DEV_FILES overlay) are prefixed `prod-`.
#
# Usage: make <target>        e.g. `make up`, `make logs`, `make manage ARGS="createsuperuser"`
#
# Dev ports default to 8010 (backend) / 8082 (frontend). Override if they
# collide with another project's stack:  BACKEND_PORT=9010 FRONTEND_PORT=9082 make up

DEV_FILES := -f docker-compose.yml -f docker-compose.dev.yml
COMPOSE   := docker compose $(DEV_FILES)
PROD      := docker compose

.PHONY: help build up down restart logs ps shell-backend shell-frontend edge-network prepare-runtime \
        migrate manage test clean \
        prod-build prod-up prod-down prod-logs prod-ps

help: ## Show available targets
	@grep -E '^[a-zA-Z0-9_-]+:.*## ' $(MAKEFILE_LIST) | sed 's/:.*## /|/' | sort | awk -F'|' '{printf "  %-16s %s\n", $$1, $$2}'

## --- Local dev (docker-compose.yml + docker-compose.dev.yml) -------------

build: ## Build backend + frontend images
	$(COMPOSE) build

up: ## Build and start the dev stack in the background (frontend :8082, backend :8010)
	$(COMPOSE) up --build -d

down: ## Stop the dev stack
	$(COMPOSE) down

restart: ## Restart the dev stack
	$(COMPOSE) restart

logs: ## Follow logs for all dev services
	$(COMPOSE) logs -f

ps: ## Show dev container status
	$(COMPOSE) ps

shell-backend: ## Open a shell in the running backend container
	$(COMPOSE) exec backend sh

shell-frontend: ## Open a shell in the running frontend container
	$(COMPOSE) exec frontend sh

migrate: ## Run Django migrations inside the backend container
	$(COMPOSE) exec backend python manage.py migrate

manage: ## Run an arbitrary manage.py command, e.g. make manage ARGS="createsuperuser"
	$(COMPOSE) exec backend python manage.py $(ARGS)

test: ## Run the Django test suite inside the backend container
	$(COMPOSE) exec backend python manage.py test

clean: ## Stop the dev stack and remove its containers/volumes/networks
	$(COMPOSE) down -v --remove-orphans

## --- Production (docker-compose.yml only) --------------------------------

prod-build: ## Build production images
	$(PROD) build

edge-network: ## Create the shared network used by project containers
	@docker network inspect portfolio-edge >/dev/null 2>&1 || docker network create portfolio-edge

prepare-runtime: ## Create ignored host paths required by production mounts
	@mkdir -p backend/media deploy/certbot/conf deploy/certbot/www
	@test ! -d backend/db.sqlite3 || { echo "backend/db.sqlite3 is a directory; remove it and rerun make prod-up" >&2; exit 1; }
	@touch backend/db.sqlite3

prod-up: edge-network prepare-runtime ## Start the production stack (proxy + certbot included)
	$(PROD) up --build -d

prod-down: ## Stop the production stack
	$(PROD) down

prod-logs: ## Follow production logs
	$(PROD) logs -f

prod-ps: ## Show production container status
	$(PROD) ps
