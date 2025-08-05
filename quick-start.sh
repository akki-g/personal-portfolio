#!/bin/bash

# Quick Start Script - Simple server startup without dependency updates
# Use this for daily development when dependencies are already installed

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to kill process on port
kill_port() {
    local port=$1
    local pid=$(lsof -ti:$port)
    if [ -n "$pid" ]; then
        echo -e "${YELLOW}Killing existing process on port $port...${NC}"
        kill -9 $pid
        sleep 2
    fi
}

echo -e "${BLUE}🚀 Quick Starting Personal Portfolio Servers...${NC}"
echo

# Kill existing processes
kill_port 8000
kill_port 5173

# Start backend
echo -e "${BLUE}Starting Django backend...${NC}"
cd "$PROJECT_ROOT/backend"
python manage.py runserver 8000 &
BACKEND_PID=$!

# Wait a moment
sleep 3

# Start frontend
echo -e "${BLUE}Starting React frontend...${NC}"
cd "$PROJECT_ROOT/wed-front"
npm run dev &
FRONTEND_PID=$!

# Wait a moment
sleep 5

echo
echo -e "${GREEN}✅ Servers Started!${NC}"
echo -e "${GREEN}Frontend:${NC} http://localhost:5173"
echo -e "${GREEN}Backend:${NC} http://localhost:8000"
echo -e "${GREEN}Remote Access:${NC} http://localhost:5173/remote"
echo
echo -e "${YELLOW}Credentials:${NC}"
echo "Web Login: admin / secure_password"
echo "SSH: 192.168.4.196:2222 (akshatguduru)"
echo
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"

# Wait for Ctrl+C
trap 'echo; echo "Stopping servers..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit' INT
wait