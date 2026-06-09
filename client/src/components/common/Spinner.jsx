// d:\projects\personal-projects\to-do-list\client\src\components\common\Spinner.jsx
// A pure Tailwind CSS animated loading spinner — no library needed.
// It works by making a circle where only one "border" side is visible, then rotating it.
import React from 'react';

const Spinner = ({ size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'w-4 h-4 border-2' : 'w-8 h-8 border-[3px]';
  
  return (
    <div className="flex items-center justify-center py-10">
      <div
        className={`${sizeClass} border-indigo-200 dark:border-indigo-900/30 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin`}
      />
    </div>
  );
};

export default Spinner;

// ✅ DONE
