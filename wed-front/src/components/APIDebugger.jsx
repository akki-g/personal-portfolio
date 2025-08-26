import React, { useState, useEffect } from 'react';
import apiLogger from '../utils/logger.js';
import './APIDebugger.css';

const APIDebugger = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({});

  useEffect(() => {
    if (isOpen) {
      const updateLogs = () => {
        setLogs(apiLogger.getLogs());
        setStats(apiLogger.getStats());
      };
      
      updateLogs();
      const interval = setInterval(updateLogs, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'all' || log.type === filter;
    const matchesSearch = searchTerm === '' || 
      log.url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.caller?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.error?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getLogIcon = (log) => {
    if (log.type === 'request') return '🚀';
    if (log.type === 'response') return log.status < 400 ? '✅' : '❌';
    if (log.type === 'error') return '🚨';
    return '📝';
  };

  const getLogColor = (log) => {
    if (log.type === 'request') return '#3498db';
    if (log.type === 'response') return log.status < 400 ? '#27ae60' : '#e74c3c';
    if (log.type === 'error') return '#e74c3c';
    return '#95a5a6';
  };

  if (!isOpen) return null;

  return (
    <div className="api-debugger-overlay">
      <div className="api-debugger">
        <div className="debugger-header">
          <h3>API Logger</h3>
          <div className="debugger-stats">
            <span className="stat">Total: {stats.total}</span>
            <span className="stat">Success: {stats.success}</span>
            <span className="stat">Errors: {stats.errors}</span>
          </div>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
        
        <div className="debugger-controls">
          <div className="filter-group">
            <label>Filter:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="request">Requests</option>
              <option value="response">Responses</option>
              <option value="error">Errors</option>
            </select>
          </div>
          
          <div className="search-group">
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button onClick={() => apiLogger.clearLogs()} className="clear-btn">
            Clear Logs
          </button>
        </div>
        
        <div className="logs-container">
          {filteredLogs.length === 0 ? (
            <div className="no-logs">No logs match your criteria</div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="log-entry" style={{ borderLeft: `4px solid ${getLogColor(log)}` }}>
                <div className="log-header">
                  <span className="log-icon">{getLogIcon(log)}</span>
                  <span className="log-time">{formatTimestamp(log.timestamp)}</span>
                  <span className="log-type">{log.type.toUpperCase()}</span>
                  {log.method && <span className="log-method">{log.method.toUpperCase()}</span>}
                  {log.status && <span className="log-status">{log.status}</span>}
                  {log.duration && <span className="log-duration">{log.duration}ms</span>}
                </div>
                
                <div className="log-details">
                  {log.url && <div className="log-url">URL: {log.fullURL || log.url}</div>}
                  {log.caller && <div className="log-caller">From: {log.caller}</div>}
                  {log.error && <div className="log-error">Error: {log.error}</div>}
                  {log.dataSize && <div className="log-data-size">Response Size: {log.dataSize} bytes</div>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default APIDebugger;