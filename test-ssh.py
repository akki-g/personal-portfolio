#!/usr/bin/env python3

import paramiko
import sys

def test_ssh_connection():
    """Test SSH connection to the Mac Mini"""
    
    host = "192.168.4.196"
    port = 2222
    username = "akshatguduru"
    
    print(f"Testing SSH connection to {host}:{port} with user {username}")
    
    # Get password from user
    import getpass
    password = getpass.getpass("Enter SSH password: ")
    
    try:
        # Test SSH connection
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        
        print("Connecting...")
        ssh.connect(hostname=host, port=port, username=username, password=password, timeout=10)
        print("✅ SSH connection successful!")
        
        # Test command execution
        print("\nTesting command execution...")
        stdin, stdout, stderr = ssh.exec_command('pwd', timeout=10)
        output = stdout.read().decode('utf-8').strip()
        error = stderr.read().decode('utf-8').strip()
        
        if output:
            print(f"✅ Command output: {output}")
        if error:
            print(f"⚠️ Command error: {error}")
            
        # Test SFTP
        print("\nTesting SFTP file listing...")
        sftp = ssh.open_sftp()
        files = sftp.listdir('.')
        print(f"✅ Found {len(files)} files in home directory:")
        for f in files[:5]:  # Show first 5 files
            print(f"  - {f}")
        if len(files) > 5:
            print(f"  ... and {len(files) - 5} more")
            
        sftp.close()
        ssh.close()
        print("\n✅ All tests passed! SSH connection is working properly.")
        
    except paramiko.AuthenticationException:
        print("❌ Authentication failed. Check username/password.")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Connection failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    test_ssh_connection()