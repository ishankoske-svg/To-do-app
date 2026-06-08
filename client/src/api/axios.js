// d:\projects\personal-projects\to-do-list\client\src\api\axios.js
// Shared Axios instance used by all API files. It automatically attaches the JWT.
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
});

// Interceptor: runs BEFORE every request is sent
api.interceptors.request.use(
  (config) => {
    // Read the token directly from our Zustand store
    const token = useAuthStore.getState().token;
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor: runs AFTER every response is received
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the backend says the token is invalid (401), automatically log the user out
    if (error.response && error.response.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;

// ✅ DONE
