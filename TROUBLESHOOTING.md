# Remote Access Troubleshooting Guide

## Current Issues & Solutions

### 1. 🔒 **Directory Permission Errors (Desktop, Documents, etc.)**

**Problem**: Getting "Permission denied [Errno 13]" when accessing certain directories.

**Cause**: macOS privacy and security features restrict SSH access to user folders like Desktop, Documents, Downloads.

**Solutions**:

#### Option A: Grant Full Disk Access (Recommended)
1. Open **System Preferences** → **Security & Privacy** → **Privacy** tab
2. Select **Full Disk Access** from the left sidebar
3. Click the lock icon and enter your password
4. Click the **+** button and add:
   - `/usr/sbin/sshd` (SSH daemon)
   - Your terminal application (if using Terminal.app)

#### Option B: Use Alternative Directories
Instead of accessing restricted folders, navigate to:
- `/Users/akshatguduru/Public/` - Public folder (usually accessible)
- `/Users/akshatguduru/Projects/` - Create your own project folder
- `/tmp/` - Temporary folder
- `/usr/local/` - Local applications folder

#### Option C: Test SSH Access Manually
```bash
# Test SSH connection from terminal
ssh akshatguduru@192.168.4.196 -p 2222

# Once connected, test directory access
ls -la ~/Desktop
ls -la ~/Documents
```

### 2. 🖥️ **Terminal "Not Connected" Issue**

**Problem**: Terminal shows "Not connected to SSH server" even after successful SSH connection.

**Debug Steps**:

#### Step 1: Check SSH Connection Status
1. Open browser developer console (F12)
2. Go to **Network** tab
3. Try connecting SSH and look for:
   - `POST /api/remote/connect/` - Should return 200 status
   - Check response body for success message

#### Step 2: Check Authentication
1. Verify you're logged in with `admin/secure_password`
2. Check if JWT token is valid (look in Local Storage)
3. Try refreshing the page and re-authenticating

#### Step 3: Test SSH Credentials
Run the SSH test script:
```bash
cd /path/to/project
python3 test-ssh.py
```

#### Step 4: Manual API Testing
```bash
# Get JWT token
curl -X POST http://localhost:8000/api/remote/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"secure_password"}'

# Test SSH connection (replace TOKEN with actual token)
curl -X POST http://localhost:8000/api/remote/connect/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"host":"192.168.4.196","port":2222,"username":"akshatguduru","password":"YOUR_SSH_PASSWORD"}'
```

### 3. 🐛 **Debug Mode Setup**

Enable verbose logging to see what's happening:

#### Django Debug Logs
```bash
# Run Django server in foreground to see logs
cd backend
python manage.py runserver 8000
```

#### Browser Console Logs
1. Open Developer Tools (F12)
2. Go to **Console** tab
3. Try the actions that are failing
4. Look for error messages

### 4. 🔧 **Common Fixes**

#### Fix 1: Reset Connection State
```javascript
// In browser console, clear connection state
localStorage.removeItem('remoteAccessToken');
localStorage.removeItem('remoteAccessRefreshToken');
// Then refresh page
```

#### Fix 2: Restart Servers
```bash
# Use the restart script
./start-servers.sh restart

# Or manually restart both
killall python3
killall node
./quick-start.sh
```

#### Fix 3: Check Network Connectivity
```bash
# Test if Mac Mini is reachable
ping 192.168.4.196

# Test if SSH port is open
nc -zv 192.168.4.196 2222

# Test SSH directly
ssh akshatguduru@192.168.4.196 -p 2222
```

### 5. 📋 **System Requirements Checklist**

- [ ] Django server running on port 8000
- [ ] React server running on port 5173  
- [ ] SSH service enabled on Mac Mini
- [ ] Port 2222 open on Mac Mini
- [ ] User `akshatguduru` has SSH access
- [ ] Full Disk Access granted (for restricted folders)
- [ ] Correct SSH password

### 6. 🔍 **Diagnostic Commands**

```bash
# Check server status
lsof -i :8000  # Django
lsof -i :5173  # React

# Check SSH connectivity
ssh-keyscan -p 2222 192.168.4.196

# Test SFTP access
sftp -P 2222 akshatguduru@192.168.4.196

# Check Django logs
tail -f backend/server.log
```

### 7. 📱 **Expected Behavior**

**Successful Flow**:
1. Login with `admin/secure_password` → JWT token received
2. Enter SSH credentials → "SSH Connection established successfully!"
3. File browser shows home directory contents
4. Terminal shows `$` prompt and accepts commands
5. Directory navigation works (except restricted folders)

**Error Indicators**:
- Red error messages in UI
- "Permission denied" for macOS protected folders
- "Not connected" in terminal
- 401/403/500 errors in Network tab

## Getting Help

If issues persist:
1. Check all items in the System Requirements Checklist
2. Run the diagnostic commands
3. Try the SSH test script: `python3 test-ssh.py`
4. Check browser console and Django logs for specific errors
5. Test SSH connection manually from terminal

The system is designed to be robust, but macOS security features and SSH configuration can cause issues that require system-level fixes.