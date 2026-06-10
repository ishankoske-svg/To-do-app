// d:\projects\personal-projects\to-do-list\client\src\pages\LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import PageWrapper from '../components/layout/PageWrapper';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showReset, setShowReset] = useState(false);

  // Reset form state
  const [resetEmail, setResetEmail] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirm, setResetConfirm] = useState('');
  const [resetStatus, setResetStatus] = useState(null); // { type: 'success'|'error', msg }
  const [resetLoading, setResetLoading] = useState(false);

  const login = useAuthStore(state => state.login);
  const error = useAuthStore(state => state.error);
  const isLoading = useAuthStore(state => state.isLoading);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      // Error handled in store
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (resetNewPassword !== resetConfirm) {
      setResetStatus({ type: 'error', msg: 'Passwords do not match' });
      return;
    }
    if (resetNewPassword.length < 8) {
      setResetStatus({ type: 'error', msg: 'Password must be at least 8 characters' });
      return;
    }
    setResetLoading(true);
    setResetStatus(null);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
        { email: resetEmail, newPassword: resetNewPassword }
      );
      setResetStatus({ type: 'success', msg: data.message });
      // Pre-fill the login form with the reset email
      setEmail(resetEmail);
      setPassword('');
      setTimeout(() => {
        setShowReset(false);
        setResetStatus(null);
      }, 2500);
    } catch (err) {
      setResetStatus({ type: 'error', msg: err.response?.data?.message || 'Something went wrong' });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-md mx-auto mt-20 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">

        {!showReset ? (
          <>
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-2">Welcome Back</h1>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Log in to manage your tasks</p>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm font-medium mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                  <button
                    type="button"
                    onClick={() => { setShowReset(true); setResetEmail(email); }}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
              Don't have an account?{' '}
              <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </>
        ) : (
          <>
            <button
              onClick={() => { setShowReset(false); setResetStatus(null); }}
              className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-4 transition-colors"
            >
              ← Back to login
            </button>

            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Reset Password</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Enter your email and choose a new password.</p>

            {resetStatus && (
              <div className={`p-3 rounded-lg text-sm font-medium mb-4 ${
                resetStatus.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
              }`}>
                {resetStatus.msg}
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                <input
                  type="password"
                  value={resetNewPassword}
                  onChange={(e) => setResetNewPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="At least 8 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={resetConfirm}
                  onChange={(e) => setResetConfirm(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={resetLoading}
                className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {resetLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </PageWrapper>
  );
};

export default LoginPage;

// ✅ DONE
