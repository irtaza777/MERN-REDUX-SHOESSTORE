import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Create an instance of axios
const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000',
});
// Intercept requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sectoken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercept responses
axiosInstance.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.clear();
  
        window.location.href = '/';
      }
      return Promise.reject(error);
    }
  );
  

export default axiosInstance;
