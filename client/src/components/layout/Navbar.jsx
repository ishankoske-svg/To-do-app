// d:\projects\personal-projects\to-do-list\client\src\components\layout\Navbar.jsx
// Sticky navigation bar showing user initials and logout
import React from 'react';
import { useAuthStore } from '../../store/authStore';

const Navbar = () => {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  // Derive initial from name or email
  const initial = user?.name 
    ? user.name.charAt(0).toUpperCase() 
    : user?.email.charAt(0).toUpperCase() || 'U';

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        
        <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          TodoFlow
        </span>

        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold flex items-center justify-center border border-indigo-200 select-none"
                title={user.email}
              >
                {initial}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user.name || user.email.split('@')[0]}
              </span>
            </div>
            
            <button
              onClick={logout}
              className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
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
