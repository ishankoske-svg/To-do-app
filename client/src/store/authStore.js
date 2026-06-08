// d:\projects\personal-projects\to-do-list\client\src\store\authStore.js
// Zustand store for managing the user's authentication state globally
import { create } from 'zustand';
import * as authApi from '../api/auth.api';

export const useAuthStore = create((set) => ({
  user: null,           // { id, email, name }
  token: null,          // JWT string
  isAuthenticated: false,
  isLoading: true,      // Starts true so we can check localStorage on initial load
  error: null,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authApi.signupApi(email, password, name);
      localStorage.setItem('todoflow_token', data.token); // Save token for page refreshes
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to sign up',
        isLoading: false
      });
      throw error; // Re-throw so the UI can catch it
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authApi.loginApi(email, password);
      localStorage.setItem('todoflow_token', data.token);
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to log in',
        isLoading: false
      });
      throw error;
    }
  },

  logout: () => {
    // Clear token from browser storage
    localStorage.removeItem('todoflow_token');
    // Reset state
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null
    });
  },

  loadUser: async () => {
    const token = localStorage.getItem('todoflow_token');
    
    // If no token exists, they are not logged in
    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }

    // Set the token first so our Axios interceptor can use it
    set({ token });

    try {
      const user = await authApi.getMeApi();
      set({
        user,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      // Token is invalid or expired
      localStorage.removeItem('todoflow_token');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  }
}));

// ✅ DONE
