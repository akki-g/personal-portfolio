# gunicorn.conf.py

# Server Socket
bind = 'unix:/run/gunicorn.sock'

# Secure Scheme Headers
secure_scheme_headers = {
    'X-FORWARDED-PROTO': 'https',
}
