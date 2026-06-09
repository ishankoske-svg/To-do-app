// d:\projects\personal-projects\to-do-list\client\src\components\layout\Navbar.jsx
// Sticky navigation bar showing user initials and logout
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useDarkMode } from '../../hooks/useDarkMode';

const Navbar = () => {
  const location = useLocation();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const [isDark, toggleDarkMode] = useDarkMode();

  // Derive initial from name or email
  const initial = user?.name 
    ? user.name.charAt(0).toUpperCase() 
    : user?.email.charAt(0).toUpperCase() || 'U';

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-200">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            TodoFlow
          </Link>

          {user && (
            <Link 
              to="/stats"
              className={`text-sm font-medium transition-colors ${location.pathname === '/stats' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'}`}
            >
              Stats
            </Link>
          )}

          <button 
            onClick={toggleDarkMode}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Toggle dark mode"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-bold flex items-center justify-center border border-indigo-200 dark:border-indigo-700/50 select-none"
                title={user.email}
              >
                {initial}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                {user.name || user.email.split('@')[0]}
              </span>
            </div>
            
            <button
              onClick={logout}
              className="text-sm font-medium text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

// ✅ DONE
