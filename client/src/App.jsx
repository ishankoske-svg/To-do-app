// d:\projects\personal-projects\to-do-list\client\src\App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import StatsPage from './pages/StatsPage';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import { EtheralShadow } from './components/ui/etheral-shadow';

function App() {
  const loadUser = useAuthStore(state => state.loadUser);

  // Read token from localStorage on first load
  useEffect(() => {
    loadUser();
  }, []);

  return (
    <BrowserRouter>
      {/* 
        We use relative overflow-x-hidden to prevent horizontal scrolling from animations.
        The dark:bg-transparent ensures the gray-900 doesn't hide the EtheralShadow.
        We'll use a solid dark background on the HTML/Body in index.css so there's a base color,
        but for the app wrapper, we let the shadow show through.
      */}
      <div className="relative min-h-screen bg-slate-50 text-slate-900 dark:bg-gray-950 dark:text-gray-100 font-sans selection:bg-indigo-100 selection:text-indigo-900 dark:selection:bg-indigo-900 dark:selection:text-indigo-100 transition-colors duration-200 overflow-x-hidden">
        
        {/* Etheral Shadow Background - Only visible in dark mode */}
        <div className="hidden dark:block fixed inset-0 z-0 opacity-60">
          <EtheralShadow color="rgba(99, 102, 241, 0.15)" />
        </div>

        {/* Content wrapper with z-10 so it sits above the background */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />

              <Route path="/stats" element={
                <ProtectedRoute>
                  <StatsPage />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

// ✅ DONE
