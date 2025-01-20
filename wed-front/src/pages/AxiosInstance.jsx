import axios from 'axios';

const token = import.meta.env.VITE_API_TOKEN;

const apiClient = axios.create({
  baseURL: 'https://api.its-akki.com/api/',
  headers: {
    Authorization: `Token ${token}`,
  },
});

export default apiClient;