# Remote Access Setup Guide

## Overview
This guide explains how to set up and use the remote access functionality that provides SSH terminal access and file browsing through a web interface with JWT authentication and 30-minute session timeout.

## ✅ Installation Complete
The remote access system has been successfully installed and configured with:
- JWT authentication with 30-minute token expiry
- SSH terminal interface using @xterm/xterm
- File browser with SFTP integration
- Security command filtering and access controls
- Production-ready configuration

## Features Implemented
- JWT-based authentication with 30-minute access token lifetime
- Password-protected access with secure login
- SSH terminal with command execution
- File browser with directory navigation
- Security measures including command blacklisting
- Responsive web interface

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
pip install -r req.txt
```

### 2. Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 3. Create Superuser (Optional)
```bash
python manage.py createsuperuser
```

### 4. Start Django Server
```bash
python manage.py runserver
```

## Frontend Setup

### 1. Install Dependencies
```bash
cd wed-front
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

## Access the Remote Interface

1. Navigate to `http://localhost:5173/remote` (or your domain/remote)
2. Login with credentials:
   - Username: `admin`
   - Password: `secure_password` (change in backend/api/views.py line 142)

3. SSH Connection:
   - Host: `192.168.4.196` (your Mac Mini IP)
   - Port: `2222`
   - Username: `akshatguduru`
   - Password: (your SSH password)

## Security Features

### Command Blacklisting
The following commands are blocked for security:
- `rm -rf`, `sudo rm`, `dd if=`
- `shutdown`, `reboot`, `halt`
- `chmod 777`, `passwd`
- System manipulation commands

### JWT Token Management
- Access tokens expire after 30 minutes
- Automatic token refresh every 25 minutes
- Secure token storage in localStorage
- Logout clears all authentication data

### SSH Security
- Limited to specific hosts and ports
- Connection timeout: 30 seconds
- Command execution timeout: 30 seconds
- Directory access restrictions (no /etc, /sys access)

## Production Deployment

### 1. Update Settings
- Change `DEBUG = False` in settings.py
- Update `SECRET_KEY` to a secure random value
- Configure proper database (PostgreSQL recommended)
- Set up proper SSL certificates

### 2. Environment Variables
Create `.env` file in backend directory:
```
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=its-akki.com,api.its-akki.com
```

### 3. Web Server Configuration
Configure Nginx/Apache to serve the React build and proxy API requests:

```nginx
# Nginx configuration example
server {
    listen 80;
    server_name its-akki.com;
    
    location / {
        root /path/to/wed-front/dist;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4. SSL Certificate
Set up SSL certificate for HTTPS:
```bash
certbot --nginx -d its-akki.com -d api.its-akki.com
```

## Usage Instructions

### Terminal Commands
- Type commands and press Enter to execute
- Use standard Linux commands (ls, cd, pwd, etc.)
- Commands are executed on the remote server
- Output is displayed in real-time

### File Browser
- Click on directories to navigate
- View file sizes and permissions
- Click ".." to go back to parent directory
- Automatically updates when using `cd` commands in terminal

### Session Management
- Sessions automatically expire after 30 minutes of inactivity
- Tokens are refreshed automatically
- Manual logout button available
- Connection status is displayed

## Security Considerations

1. **Change Default Credentials**: Update the hardcoded credentials in `backend/api/views.py`
2. **Network Security**: Ensure SSH server is properly configured
3. **Firewall Rules**: Configure firewall to allow only necessary connections
4. **Regular Updates**: Keep all dependencies updated
5. **Monitoring**: Set up logging and monitoring for suspicious activities

## Troubleshooting

### Common Issues
1. **Connection Failed**: Check SSH credentials and network connectivity
2. **Authentication Error**: Verify login credentials
3. **Token Expired**: Refresh the page or login again
4. **Command Blocked**: Check if command is in blacklist

### Debug Mode
Enable debug mode by setting `DEBUG = True` in Django settings for detailed error messages.

## API Endpoints

- `POST /api/remote/login/` - Authentication
- `POST /api/remote/connect/` - SSH connection test
- `POST /api/remote/execute/` - Command execution
- `POST /api/remote/files/` - File listing
- `POST /api/token/refresh/` - JWT token refresh

## Files Modified/Created

### Backend
- `req.txt` - Added dependencies
- `backend/settings.py` - JWT and security configuration
- `backend/urls.py` - JWT token endpoints
- `api/views.py` - Remote access endpoints
- `api/urls.py` - API routes

### Frontend
- `package.json` - Added xterm dependencies
- `src/App.jsx` - Added /remote route
- `src/pages/RemoteAccess.jsx` - Main component
- `src/pages/RemoteAccess.css` - Styling

## Support
For issues or questions, check the implementation files or modify the security settings as needed for your specific environment.