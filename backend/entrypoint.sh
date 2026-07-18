#!/bin/sh
set -e

# Apply migrations and gather static files (WhiteNoise serves them from gunicorn).
python manage.py migrate --noinput
python manage.py collectstatic --noinput

# Hand off to the container CMD (gunicorn).
exec "$@"
