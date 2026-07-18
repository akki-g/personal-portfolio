FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Dependencies. Pillow / cryptography / paramiko ship self-contained manylinux
# wheels, so no system build tools are needed on top of python:3.12-slim.
COPY req.txt ./
RUN pip install --no-cache-dir -r req.txt

# Application code (db.sqlite3, media, .env, webenv are excluded via .dockerignore
# and provided at runtime via volumes / env_file).
COPY . .

RUN chmod +x /app/entrypoint.sh

EXPOSE 8000

# entrypoint runs migrate + collectstatic, then execs the CMD.
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3", "--timeout", "120"]
