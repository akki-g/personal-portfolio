#!/bin/bash

# Personal Portfolio Development Server Startup Script
# This script handles dependency installation, updates, and server startup for both frontend and backend

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project paths
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/wed-front"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if port is in use
port_in_use() {
    lsof -i:$1 >/dev/null 2>&1
}

# Function to kill process on port
kill_port() {
    local port=$1
    local pid=$(lsof -ti:$port)
    if [ -n "$pid" ]; then
        print_warning "Killing existing process on port $port (PID: $pid)"
        kill -9 $pid
        sleep 2
    fi
}

# Function to wait for user input
wait_for_input() {
    echo
    read -p "Press Enter to continue or Ctrl+C to exit..."
    echo
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists python3; then
        print_error "Python 3 is not installed. Please install Python 3."
        exit 1
    fi
    
    if ! command_exists pip; then
        print_error "pip is not installed. Please install pip."
        exit 1
    fi
    
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js."
        exit 1
    fi
    
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    print_success "All prerequisites are installed"
}

# Update and install backend dependencies
setup_backend() {
    print_status "Setting up backend..."
    
    if [ ! -d "$BACKEND_DIR" ]; then
        print_error "Backend directory not found: $BACKEND_DIR"
        exit 1
    fi
    
    cd "$BACKEND_DIR"
    
    # Update pip
    print_status "Updating pip..."
    pip install --upgrade pip
    
    # Install/update requirements
    if [ -f "req.txt" ]; then
        print_status "Installing/updating Python dependencies..."
        pip install -r req.txt
    else
        print_error "req.txt not found in backend directory"
        exit 1
    fi
    
    # Run migrations
    print_status "Running Django migrations..."
    python manage.py makemigrations
    python manage.py migrate
    
    print_success "Backend setup complete"
}

# Update and install frontend dependencies
setup_frontend() {
    print_status "Setting up frontend..."
    
    if [ ! -d "$FRONTEND_DIR" ]; then
        print_error "Frontend directory not found: $FRONTEND_DIR"
        exit 1
    fi
    
    cd "$FRONTEND_DIR"
    
    # Update npm
    print_status "Updating npm..."
    npm install -g npm@latest
    
    # Install/update dependencies
    if [ -f "package.json" ]; then
        print_status "Installing/updating Node.js dependencies..."
        npm install
        
        # Fix any vulnerabilities
        print_status "Checking for security vulnerabilities..."
        npm audit fix --force
    else
        print_error "package.json not found in frontend directory"
        exit 1
    fi
    
    print_success "Frontend setup complete"
}

# Start backend server
start_backend() {
    print_status "Starting Django backend server..."
    
    cd "$BACKEND_DIR"
    
    # Check if port 8000 is in use
    if port_in_use 8000; then
        print_warning "Port 8000 is already in use - restarting to apply settings"
        kill_port 8000
    fi
    
    # Start Django server in background
    print_status "Starting Django development server on port 8000..."
    nohup python manage.py runserver 8000 > ../backend.log 2>&1 &
    BACKEND_PID=$!
    
    # Wait a moment and check if server started
    sleep 3
    if port_in_use 8000; then
        print_success "Backend server started successfully (PID: $BACKEND_PID)"
        echo "Backend logs: $PROJECT_ROOT/backend.log"
        return 0
    else
        print_error "Failed to start backend server"
        return 1
    fi
}

# Start frontend server
start_frontend() {
    print_status "Starting React frontend server..."
    
    cd "$FRONTEND_DIR"
    
    # Check if port 5173 is in use
    if port_in_use 5173; then
        print_warning "Port 5173 is already in use"
        read -p "Kill existing process and restart? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            kill_port 5173
        else
            print_warning "Skipping frontend server startup"
            return 1
        fi
    fi
    
    # Start Vite server in background
    print_status "Starting Vite development server on port 5173..."
    nohup npm run dev > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    
    # Wait a moment and check if server started
    sleep 5
    if port_in_use 5173; then
        print_success "Frontend server started successfully (PID: $FRONTEND_PID)"
        echo "Frontend logs: $PROJECT_ROOT/frontend.log"
        return 0
    else
        print_error "Failed to start frontend server"
        return 1
    fi
}

# Display server status
show_status() {
    echo
    print_status "=== Server Status ==="
    
    if port_in_use 8000; then
        print_success "✓ Backend (Django): http://localhost:8000"
        print_success "✓ API Endpoints: http://localhost:8000/api/"
        print_success "✓ Admin Panel: http://localhost:8000/admin/"
    else
        print_error "✗ Backend server is not running"
    fi
    
    if port_in_use 5173; then
        print_success "✓ Frontend (React): http://localhost:5173"
        print_success "✓ Remote Access: http://localhost:5173/remote"
    else
        print_error "✗ Frontend server is not running"
    fi
    
    echo
    print_status "=== Remote Access Credentials ==="
    echo "Web Login: admin / secure_password"
    echo "SSH Target: 192.168.4.196:2222 (akshatguduru)"
    echo
}

# Stop servers function
stop_servers() {
    print_status "Stopping servers..."
    
    if port_in_use 8000; then
        kill_port 8000
        print_success "Backend server stopped"
    fi
    
    if port_in_use 5173; then
        kill_port 5173
        print_success "Frontend server stopped"
    fi
}

# Show usage
show_usage() {
    echo "Usage: $0 [OPTION]"
    echo
    echo "Options:"
    echo "  start     Start both frontend and backend servers (default)"
    echo "  stop      Stop both servers"
    echo "  restart   Restart both servers"
    echo "  status    Show server status"
    echo "  setup     Install/update dependencies only"
    echo "  backend   Start only backend server"
    echo "  frontend  Start only frontend server"
    echo "  help      Show this help message"
    echo
}

# Main script logic
main() {
    local action=${1:-start}
    
    echo
    print_status "Personal Portfolio Development Server Manager"
    print_status "Project: $PROJECT_ROOT"
    echo
    
    case $action in
        "start")
            check_prerequisites
            setup_backend
            setup_frontend
            start_backend
            start_frontend
            show_status
            ;;
        "stop")
            stop_servers
            ;;
        "restart")
            stop_servers
            sleep 2
            check_prerequisites
            setup_backend
            setup_frontend
            start_backend
            start_frontend
            show_status
            ;;
        "status")
            show_status
            ;;
        "setup")
            check_prerequisites
            setup_backend
            setup_frontend
            print_success "Setup complete! Run '$0 start' to start servers."
            ;;
        "backend")
            check_prerequisites
            setup_backend
            start_backend
            show_status
            ;;
        "frontend")
            check_prerequisites
            setup_frontend
            start_frontend
            show_status
            ;;
        "help"|"-h"|"--help")
            show_usage
            ;;
        *)
            print_error "Unknown option: $action"
            show_usage
            exit 1
            ;;
    esac
}

# Trap to handle script interruption
trap 'echo; print_warning "Script interrupted. Servers may still be running."; exit 1' INT

# Run main function
main "$@"