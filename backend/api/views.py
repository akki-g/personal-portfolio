from django.http import FileResponse
from django.contrib.sites.shortcuts import get_current_site
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.throttling import ScopedRateThrottle, SimpleRateThrottle
from django.shortcuts import get_object_or_404
from .models import Project, Contact, About, Experience
from .serializers import ProjectSerializer, ContactSerializer, AboutSerializer, ExperienceSerializer
from .permissions import ReadOnlyOrStaff, allowed_remote_hosts
import os
from pathlib import Path
from dotenv import load_dotenv
import paramiko
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken


BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(os.path.join(BASE_DIR, ".env"))

# Create your views here.

class ProjectListView(APIView):
    permission_classes = [ReadOnlyOrStaff]

    def get(self, request):
        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)
    def post(self, request):
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class ContactView(APIView):
    throttle_scope = 'contact'

    def get_permissions(self):
        return [AllowAny()] if self.request.method == 'POST' else [IsAdminUser()]

    def get_throttles(self):
        return [ScopedRateThrottle()] if self.request.method == 'POST' else []

    def get(self, request):
        contacts = Contact.objects.all()
        serializer = ContactSerializer(contacts, many=True)
        return Response(serializer.data)
    def post(self, request):
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
class AboutView(APIView):
    permission_classes = [ReadOnlyOrStaff]

    def get(self, request):
        about = About.objects.all()
        serializer = AboutSerializer(about, many=True)
        return Response(serializer.data)
    def post(self, request):
        serializer = AboutSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
class ExperiencesListView(APIView):
    permission_classes = [ReadOnlyOrStaff]

    def get(self, request):
        projects = Experience.objects.all()
        serializer = ExperienceSerializer(projects, many=True)
        return Response(serializer.data)
    def post(self, request):
        serializer = ExperienceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
def download_resume(request):
    about = About.objects.first()
    if not about or not about.resume:
        return Response({'error': 'Resume not found'}, status=404)

    return FileResponse(about.resume, as_attachment=True, filename='AkshatGuduru_Resume.pdf')

@api_view(['GET'])
def get_images(request):
    about = About.objects.first()
    if not about:
        return Response({'error': 'No About record found'}, status=404)
    
    current_site = get_current_site(request)
    domain = f"{request.scheme}://{current_site.domain}"
    
    result = {}
    if about.image1:
        result['image_1'] = domain + about.image1.url
    if about.image2:
        result['image_2'] = domain + about.image2.url
    if about.image3:
        result['image_3'] = domain + about.image3.url
    if about.image4:
        result['image_4'] = domain + about.image4.url
    
    return Response(result)


# Remote Access Views with Security
BLACKLISTED_COMMANDS = [
    'rm -rf', 'sudo rm', 'dd if=', 'mkfs', 'fdisk', 'parted',
    'shutdown', 'reboot', 'halt', 'poweroff', 'init 0', 'init 6',
    'killall', 'pkill -9', 'kill -9', 'chmod 777', 'passwd',
    'userdel', 'usermod', 'groupdel', 'groupmod', 'su -',
    'sudo su', 'sudo -i', 'format', 'del /f', 'rmdir /s'
]

def is_command_safe(command):
    """Check if command is safe to execute"""
    command_lower = command.lower().strip()
    for blocked in BLACKLISTED_COMMANDS:
        if blocked in command_lower:
            return False
    return True

class RemoteLoginThrottle(SimpleRateThrottle):
    """Limits password attempts per client IP."""
    scope = 'remote-login'

    def get_cache_key(self, request, view):
        return self.cache_format % {'scope': self.scope, 'ident': self.get_ident(request)}


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([RemoteLoginThrottle])
def remote_login(request):
    """Exchange a staff account's Django username/password for a JWT for remote access."""
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password required'}, status=400)

    user = authenticate(username=username, password=password)
    if user is None or not user.is_staff:
        return Response({'error': 'Invalid credentials'}, status=401)

    refresh = RefreshToken.for_user(user)
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'message': 'Login successful'
    })


def remote_host_error(host):
    """Return an error response unless `host` is on the REMOTE_SSH_HOSTS allow-list."""
    if host not in allowed_remote_hosts():
        return Response({'error': 'That host is not allowed for remote access.'}, status=403)
    return None

@api_view(['POST'])
@permission_classes([IsAdminUser])
def ssh_connect(request):
    """Establish SSH connection to remote server"""
    try:
        host = request.data.get('host', '192.168.4.196')
        host_error = remote_host_error(host)
        if host_error:
            return host_error
        port = request.data.get('port', 2222)
        username = request.data.get('username', 'akshatguduru')
        password = request.data.get('password')
        
        print(f"DEBUG: SSH connect request - Host: {host}, Port: {port}, User: {username}")
        
        if not password:
            print("DEBUG: No password provided")
            return Response({'error': 'Password required'}, status=400)
        
        # Test SSH connection
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        
        try:
            print(f"DEBUG: Attempting SSH connection to {host}:{port}")
            ssh.connect(hostname=host, port=port, username=username, password=password, timeout=10)
            print("DEBUG: SSH connection successful, closing connection")
            ssh.close()
            return Response({'message': 'SSH connection successful', 'connected': True})
        except paramiko.AuthenticationException as e:
            print(f"DEBUG: SSH Authentication failed: {str(e)}")
            return Response({'error': 'SSH authentication failed. Check your credentials.'}, status=401)
        except Exception as e:
            print(f"DEBUG: SSH Connection failed: {str(e)}")
            return Response({'error': f'Connection failed: {str(e)}'}, status=500)
            
    except Exception as e:
        print(f"DEBUG: SSH connection error: {str(e)}")
        return Response({'error': f'SSH connection error: {str(e)}'}, status=500)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def execute_command(request):
    """Execute command on remote server via SSH"""
    try:
        host = request.data.get('host', '192.168.4.196')
        host_error = remote_host_error(host)
        if host_error:
            return host_error
        port = request.data.get('port', 2222)
        username = request.data.get('username', 'akshatguduru')
        password = request.data.get('password')
        command = request.data.get('command', '')
        
        if not password or not command:
            return Response({'error': 'Password and command required'}, status=400)
        
        # Security check
        if not is_command_safe(command):
            return Response({'error': 'Command not allowed for security reasons'}, status=403)
        
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        
        try:
            ssh.connect(hostname=host, port=port, username=username, password=password, timeout=10)
            _, stdout, stderr = ssh.exec_command(command, timeout=30)
            
            output = stdout.read().decode('utf-8')
            error = stderr.read().decode('utf-8')
            exit_code = stdout.channel.recv_exit_status()
            
            ssh.close()
            
            return Response({
                'output': output,
                'error': error,
                'exit_code': exit_code,
                'command': command
            })
            
        except paramiko.AuthenticationException:
            return Response({'error': 'Authentication failed'}, status=401)
        except Exception as e:
            ssh.close()
            return Response({'error': f'Command execution failed: {str(e)}'}, status=500)
            
    except Exception as e:
        return Response({'error': f'Command execution error: {str(e)}'}, status=500)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def list_files(request):
    """List files in directory via SFTP"""
    try:
        host = request.data.get('host', '192.168.4.196')
        host_error = remote_host_error(host)
        if host_error:
            return host_error
        port = request.data.get('port', 2222)
        username = request.data.get('username', 'akshatguduru')
        password = request.data.get('password')
        directory = request.data.get('directory', '.')
        
        print(f"DEBUG: Listing files in directory: {directory}")  # Debug log
        
        if not password:
            return Response({'error': 'Password required'}, status=400)
        
        # Security: limit directory access
        # Block absolute paths to sensitive directories and path traversal attempts
        forbidden_paths = ['/etc', '/sys', '/root', '/boot', '/proc', '/dev']
        if (any(directory.startswith(path) for path in forbidden_paths) or
            '../' in directory or directory.startswith('../')):
            print(f"DEBUG: Directory access blocked for: {directory}")  # Debug log
            return Response({'error': 'Directory access not allowed'}, status=403)
        
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        
        try:
            print(f"DEBUG: Connecting to {host}:{port} as {username}")  # Debug log
            ssh.connect(hostname=host, port=port, username=username, password=password, timeout=10)
            sftp = ssh.open_sftp()
            
            print(f"DEBUG: Opening SFTP and listing directory: {directory}")  # Debug log
            files = []
            file_list = sftp.listdir_attr(directory)
            
            for file_attr in file_list:
                files.append({
                    'name': file_attr.filename,
                    'size': file_attr.st_size or 0,
                    'is_dir': file_attr.st_mode & 0o040000 != 0,
                    'permissions': oct(file_attr.st_mode)[-3:] if file_attr.st_mode else '000',
                    'modified': file_attr.st_mtime or 0
                })
            
            sftp.close()
            ssh.close()
            
            print(f"DEBUG: Successfully listed {len(files)} files")  # Debug log
            return Response({
                'files': files,
                'directory': directory,
                'count': len(files)
            })
            
        except paramiko.AuthenticationException as e:
            print(f"DEBUG: Authentication failed: {str(e)}")  # Debug log
            ssh.close()
            return Response({'error': 'SSH authentication failed'}, status=401)
        except FileNotFoundError as e:
            print(f"DEBUG: Directory not found: {str(e)}")  # Debug log
            ssh.close()
            return Response({'error': f'Directory not found: {directory}'}, status=404)
        except PermissionError as e:
            print(f"DEBUG: Permission denied: {str(e)}")  # Debug log
            ssh.close()
            return Response({'error': f'Permission denied. Directory "{directory}" requires special access permissions on macOS.'}, status=403)
        except Exception as e:
            print(f"DEBUG: SFTP error: {str(e)}")  # Debug log
            ssh.close()
            # Check if it's a permission error in the exception message
            if "Permission denied" in str(e) or "[Errno 13]" in str(e):
                return Response({'error': f'Permission denied. Directory "{directory}" may require special access permissions.'}, status=403)
            return Response({'error': f'File listing failed: {str(e)}'}, status=500)
            
    except Exception as e:
        print(f"DEBUG: General error: {str(e)}")  # Debug log
        return Response({'error': f'File listing error: {str(e)}'}, status=500)
