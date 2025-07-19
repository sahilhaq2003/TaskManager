// src/api/axiosInstance.js

import axios from 'axios';
import { BASE_URL } from './apiPaths';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000, // optional: adds request timeout (10s)
});

// Add token to every request if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses and errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401:
          console.error('Unauthorized - redirecting to login');
          // Optional: window.location.href = '/login';
          break;
        case 403:
          console.error('Forbidden - you do not have permission');
          break;
        case 404:
          console.error('Not Found - the resource does not exist');
          break;
        case 500:
          console.error('Internal Server Error');
          break;
        default:
          console.error('API Error:', error.response.data);
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    } else {
      console.error('Network error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
