// src/lib/axios.ts (optional, for interceptors)
import axios from 'axios';

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Import this in components if needed, but I used inline in code.