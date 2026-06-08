// d:\projects\personal-projects\to-do-list\client\src\components\layout\Navbar.jsx
// Sticky navigation bar. "Sticky" means it stays at the top of the screen even when you scroll.
import React from 'react';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        
        {/* Left: App name */}
        <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          TodoFlow
        </span>

        {/* Right: Placeholder avatar — will be replaced with real user in Phase 4 */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 text-sm font-bold flex items-center justify-center border-2 border-indigo-200 select-none cursor-pointer hover:ring-2 hover:ring-indigo-300 transition-all"
            title="User avatar (login coming in Phase 4)"
          >
            U
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

// ✅ DONE
