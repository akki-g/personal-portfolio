import { useState, useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import axios from 'axios';
import './RemoteAccess.css';

const RemoteAccess = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentDirectory, setCurrentDirectory] = useState('.');
    const [files, setFiles] = useState([]);
    const [commandHistory, setCommandHistory] = useState([]);
    
    // Auth form state
    const [credentials, setCredentials] = useState({
        username: 'admin',
        password: '',
        sshHost: '192.168.4.196',
        sshPort: '2222',
        sshUsername: 'akshatguduru',
        sshPassword: ''
    });

    // Terminal and JWT token
    const terminalRef = useRef(null);
    const terminal = useRef(null);
    const fitAddon = useRef(null);
    const [token, setToken] = useState(localStorage.getItem('remoteAccessToken'));
    const [tokenTimeout, setTokenTimeout] = useState(null);

    // API Base URL
    const API_BASE = 'http://localhost:8000/api';

    // Token refresh every 25 minutes (before 30min expiry)
    useEffect(() => {
        if (token) {
            setIsAuthenticated(true);
            const refreshInterval = setInterval(() => {
                refreshToken();
            }, 25 * 60 * 1000); // 25 minutes

            setTokenTimeout(refreshInterval);
            
            return () => clearInterval(refreshInterval);
        }
    }, [token]);

    // Initialize terminal
    useEffect(() => {
        if (isAuthenticated && terminalRef.current) {
            terminal.current = new Terminal({
                cursorBlink: true,
                theme: {
                    background: '#1e1e1e',
                    foreground: '#ffffff',
                    cursor: '#ffffff'
                },
                fontSize: 14,
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace'
            });

            fitAddon.current = new FitAddon();
            terminal.current.loadAddon(fitAddon.current);
            
            terminal.current.open(terminalRef.current);
            fitAddon.current.fit();

            let commandBuffer = '';

            terminal.current.writeln('Remote Access Terminal');
            terminal.current.writeln('Type commands and press Enter to execute');
            terminal.current.write('\r\n$ ');

            terminal.current.onData((data) => {
                const code = data.charCodeAt(0);
                
                if (code === 13) { // Enter
                    if (commandBuffer.trim()) {
                        executeCommand(commandBuffer.trim());
                        setCommandHistory(prev => [...prev, commandBuffer.trim()]);
                    }
                    commandBuffer = '';
                    terminal.current.write('\r\n');
                } else if (code === 127) { // Backspace
                    if (commandBuffer.length > 0) {
                        commandBuffer = commandBuffer.slice(0, -1);
                        terminal.current.write('\b \b');
                    }
                } else if (code === 27) { // Arrow keys (escape sequences)
                    // Handle arrow key navigation through history
                    return;
                } else if (code >= 32) { // Printable characters
                    commandBuffer += data;
                    terminal.current.write(data);
                }
            });

            return () => {
                if (terminal.current) {
                    terminal.current.dispose();
                }
            };
        }
    }, [isAuthenticated]);

    const refreshToken = async () => {
        try {
            const refreshToken = localStorage.getItem('remoteAccessRefreshToken');
            if (!refreshToken) {
                logout();
                return;
            }

            const response = await axios.post(`${API_BASE}/token/refresh/`, {
                refresh: refreshToken
            });

            const newToken = response.data.access;
            setToken(newToken);
            localStorage.setItem('remoteAccessToken', newToken);
        } catch (error) {
            console.error('Token refresh failed:', error);
            logout();
        }
    };

    const login = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(`${API_BASE}/remote/login/`, {
                username: credentials.username,
                password: credentials.password
            });

            const { access, refresh } = response.data;
            setToken(access);
            localStorage.setItem('remoteAccessToken', access);
            localStorage.setItem('remoteAccessRefreshToken', refresh);
            setIsAuthenticated(true);
            
        } catch (error) {
            alert('Login failed: ' + (error.response?.data?.error || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setIsConnected(false);
        setToken(null);
        localStorage.removeItem('remoteAccessToken');
        localStorage.removeItem('remoteAccessRefreshToken');
        if (tokenTimeout) {
            clearInterval(tokenTimeout);
        }
    };

    const connectSSH = async () => {
        setLoading(true);
        try {
            await axios.post(`${API_BASE}/remote/connect/`, {
                host: credentials.sshHost,
                port: parseInt(credentials.sshPort),
                username: credentials.sshUsername,
                password: credentials.sshPassword
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setIsConnected(true);
            loadFiles();
            if (terminal.current) {
                terminal.current.writeln('\r\nSSH Connection established successfully!');
                terminal.current.write('$ ');
            }
        } catch (error) {
            console.error('SSH connection error:', error);
            const errorMessage = error.response?.data?.error || 'Unknown error';
            alert('SSH connection failed: ' + errorMessage);
            setIsConnected(false);
        } finally {
            setLoading(false);
        }
    };

    const executeCommand = async (command) => {
        // Check if we have SSH credentials instead of connection state
        if (!credentials.sshPassword) {
            if (terminal.current) {
                terminal.current.writeln('\r\nError: SSH credentials not provided. Please connect first.');
                terminal.current.write('$ ');
            }
            return;
        }

        try {
            const response = await axios.post(`${API_BASE}/remote/execute/`, {
                host: credentials.sshHost,
                port: parseInt(credentials.sshPort),
                username: credentials.sshUsername,
                password: credentials.sshPassword,
                command: command
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (terminal.current) {
                if (response.data.output) {
                    terminal.current.writeln(response.data.output);
                }
                if (response.data.error) {
                    terminal.current.writeln(`Error: ${response.data.error}`);
                }
                terminal.current.write('$ ');
            }

            // Update file list if it's a directory command
            if (command.startsWith('cd ') || command === 'ls' || command === 'pwd') {
                setTimeout(loadFiles, 500);
            }

        } catch (error) {
            if (terminal.current) {
                terminal.current.writeln(`\r\nCommand failed: ${error.response?.data?.error || 'Unknown error'}`);
                terminal.current.write('$ ');
            }
        }
    };

    const loadFiles = async () => {
        try {
            const response = await axios.post(`${API_BASE}/remote/files/`, {
                host: credentials.sshHost,
                port: parseInt(credentials.sshPort),
                username: credentials.sshUsername,
                password: credentials.sshPassword,
                directory: currentDirectory
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setFiles(response.data.files);
            setCurrentDirectory(response.data.directory);
        } catch (error) {
            console.error('Failed to load files:', error);
        }
    };

    const navigateToDirectory = async (dirName) => {
        try {
            let newDir;
            if (dirName === '..') {
                // Navigate up one directory
                if (currentDirectory === '.' || currentDirectory === '') {
                    newDir = '.';
                } else {
                    const pathParts = currentDirectory.split('/');
                    pathParts.pop();
                    newDir = pathParts.length === 0 ? '.' : pathParts.join('/');
                }
            } else {
                // Navigate into subdirectory
                newDir = currentDirectory === '.' ? dirName : `${currentDirectory}/${dirName}`;
            }

            // Load files for the new directory first
            const response = await axios.post(`${API_BASE}/remote/files/`, {
                host: credentials.sshHost,
                port: parseInt(credentials.sshPort),
                username: credentials.sshUsername,
                password: credentials.sshPassword,
                directory: newDir
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Only update state if the request was successful
            setFiles(response.data.files);
            setCurrentDirectory(response.data.directory);
        } catch (error) {
            console.error('Failed to navigate to directory:', error);
            const errorMessage = error.response?.data?.error || 'Unknown error';
            
            // Show more user-friendly error message for permission issues
            if (error.response?.status === 403 || errorMessage.includes('Permission denied')) {
                alert(`Cannot access "${dirName}" directory:\n\n${errorMessage}\n\nTip: On macOS, directories like Desktop, Documents, and Downloads require special permissions. Try accessing subdirectories within your home folder instead.`);
            } else {
                alert('Failed to navigate to directory: ' + errorMessage);
            }
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="remote-access-container">
                <div className="auth-form">
                    <h2>Remote Access Authentication</h2>
                    <form onSubmit={login}>
                        <div className="form-group">
                            <label>Username:</label>
                            <input
                                type="text"
                                value={credentials.username}
                                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password:</label>
                            <input
                                type="password"
                                value={credentials.password}
                                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                                required
                            />
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Authenticating...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="remote-access-container">
            <div className="remote-header">
                <h2>Remote Access Dashboard</h2>
                <div className="connection-controls">
                    {!isConnected ? (
                        <div className="ssh-form">
                            <input
                                type="text"
                                placeholder="SSH Host"
                                value={credentials.sshHost}
                                onChange={(e) => setCredentials({...credentials, sshHost: e.target.value})}
                            />
                            <input
                                type="text"
                                placeholder="SSH Port"
                                value={credentials.sshPort}
                                onChange={(e) => setCredentials({...credentials, sshPort: e.target.value})}
                            />
                            <input
                                type="text"
                                placeholder="SSH Username"
                                value={credentials.sshUsername}
                                onChange={(e) => setCredentials({...credentials, sshUsername: e.target.value})}
                            />
                            <input
                                type="password"
                                placeholder="SSH Password"
                                value={credentials.sshPassword}
                                onChange={(e) => setCredentials({...credentials, sshPassword: e.target.value})}
                            />
                            <button onClick={connectSSH} disabled={loading}>
                                {loading ? 'Connecting...' : 'Connect SSH'}
                            </button>
                        </div>
                    ) : (
                        <div className="connection-status">
                            <span className="status-indicator connected">
                                ● {credentials.sshPassword ? 'SSH Ready' : 'SSH Credentials Needed'} ({credentials.sshHost})
                            </span>
                            <button onClick={loadFiles}>Refresh Files</button>
                        </div>
                    )}
                    <button onClick={logout} className="logout-btn">Logout</button>
                </div>
            </div>

            <div className="remote-content">
                <div className="file-browser">
                    <h3>File Browser - {currentDirectory}</h3>
                    <div className="file-list">
                        {currentDirectory !== '.' && (
                            <div 
                                className="file-item directory"
                                onClick={() => navigateToDirectory('..')}
                            >
                                📁 ..
                            </div>
                        )}
                        {files.map((file, index) => (
                            <div 
                                key={index}
                                className={`file-item ${file.is_dir ? 'directory' : 'file'}`}
                                onClick={() => file.is_dir && navigateToDirectory(file.name)}
                            >
                                {file.is_dir ? '📁' : '📄'} {file.name}
                                <span className="file-size">
                                    {!file.is_dir && `(${(file.size / 1024).toFixed(1)}KB)`}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="terminal-container">
                    <h3>Terminal</h3>
                    <div ref={terminalRef} className="terminal"></div>
                </div>
            </div>
        </div>
    );
};

export default RemoteAccess;