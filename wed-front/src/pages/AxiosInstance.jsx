import axios from 'axios';
import apiLogger from '../utils/logger.js';

const token = import.meta.env.VITE_API_TOKEN;

const apiClient = axios.create({
  baseURL: 'https://api.its-akki.com/api/',
  headers: {
    Authorization: `Token ${token}`,
  },
});

// Request interceptor - log outgoing requests
apiClient.interceptors.request.use(
  (config) => {
    const startTime = Date.now();
    config.metadata = { startTime };
    
    apiLogger.log('request', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: config.headers,
      data: config.data
    });
    
    return config;
  },
  (error) => {
    apiLogger.log('error', {
      type: 'request_error',
      error: error.message,
      config: error.config
    });
    return Promise.reject(error);
  }
);

// Response interceptor - log responses and errors
apiClient.interceptors.response.use(
  (response) => {
    const duration = Date.now() - response.config.metadata.startTime;
    
    apiLogger.log('response', {
      method: response.config.method,
      url: response.config.url,
      fullURL: `${response.config.baseURL}${response.config.url}`,
      status: response.status,
      statusText: response.statusText,
      duration,
      dataSize: JSON.stringify(response.data).length,
      responseHeaders: response.headers
    });
    
    return response;
  },
  (error) => {
    const duration = error.config?.metadata?.startTime 
      ? Date.now() - error.config.metadata.startTime 
      : 0;
    
    apiLogger.log('error', {
      method: error.config?.method,
      url: error.config?.url,
      fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : 'Unknown',
      status: error.response?.status,
      statusText: error.response?.statusText,
      duration,
      error: error.message,
      responseData: error.response?.data
    });
    
    return Promise.reject(error);
  }
);

export default apiClient;