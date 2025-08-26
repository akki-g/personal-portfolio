/**
 * Frontend API Logger
 * Tracks API calls with source information and timing
 */

class APILogger {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000; // Keep last 1000 logs
  }

  log(type, data) {
    const timestamp = new Date().toISOString();
    const stack = new Error().stack;
    
    // Extract calling component/file from stack trace
    const caller = this.extractCaller(stack);
    
    const logEntry = {
      id: Date.now() + Math.random(),
      timestamp,
      type,
      caller,
      ...data
    };

    this.logs.unshift(logEntry);
    
    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Console output with styling
    this.consoleLog(logEntry);
    
    return logEntry;
  }

  extractCaller(stack) {
    const lines = stack.split('\n');
    
    // Look for the first line that contains our app files (skip logger lines)
    for (let i = 2; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('/src/') && !line.includes('logger.js') && !line.includes('AxiosInstance')) {
        const match = line.match(/\/src\/([^:)]+)/);
        return match ? match[1] : 'Unknown';
      }
    }
    
    return 'Unknown';
  }

  consoleLog(entry) {
    const { type, timestamp, caller, method, url, status, duration } = entry;
    
    const timeStr = new Date(timestamp).toLocaleTimeString();
    const styles = this.getLogStyles(type, status);
    
    if (type === 'request') {
      console.log(
        `%c[${timeStr}] 🚀 ${method?.toUpperCase()} %c${url} %cfrom ${caller}`,
        styles.timestamp,
        styles.url,
        styles.caller
      );
    } else if (type === 'response') {
      const statusText = status < 400 ? '✅' : '❌';
      console.log(
        `%c[${timeStr}] ${statusText} ${status} %c${url} %c${duration}ms %cfrom ${caller}`,
        styles.timestamp,
        styles.url,
        styles.duration,
        styles.caller
      );
    } else if (type === 'error') {
      console.error(
        `%c[${timeStr}] ❌ ERROR %c${url} %cfrom ${caller}`,
        styles.timestamp,
        styles.url,
        styles.caller,
        entry.error
      );
    }
  }

  getLogStyles(type, status) {
    return {
      timestamp: 'color: #666; font-size: 0.9em',
      url: status && status >= 400 ? 'color: #e74c3c; font-weight: bold' : 'color: #3498db; font-weight: bold',
      caller: 'color: #9b59b6; font-style: italic',
      duration: 'color: #27ae60; font-weight: bold'
    };
  }

  // Public methods for accessing logs
  getLogs() {
    return [...this.logs];
  }

  getLogsByType(type) {
    return this.logs.filter(log => log.type === type);
  }

  getLogsByCaller(caller) {
    return this.logs.filter(log => log.caller.includes(caller));
  }

  clearLogs() {
    this.logs = [];
    console.log('🧹 API logs cleared');
  }

  // Get stats
  getStats() {
    const total = this.logs.length;
    const requests = this.logs.filter(l => l.type === 'request').length;
    const responses = this.logs.filter(l => l.type === 'response').length;
    const errors = this.logs.filter(l => l.type === 'error').length;
    const success = this.logs.filter(l => l.type === 'response' && l.status < 400).length;
    
    return { total, requests, responses, errors, success };
  }
}

// Create singleton instance
const apiLogger = new APILogger();

// Expose globally for debugging
if (typeof window !== 'undefined') {
  window.apiLogger = apiLogger;
}

export default apiLogger;