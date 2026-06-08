// d:\projects\personal-projects\to-do-list\client\src\components\common\Badge.jsx
import React from 'react';

const Badge = ({ children, className = '', colorCode }) => {
  // If colorCode is provided (like #ef4444), use inline styles. Otherwise expect tailwind classes in className
  const style = colorCode 
    ? { backgroundColor: `${colorCode}20`, color: colorCode, borderColor: `${colorCode}40` } 
    : {};
  
  return (
    <span 
      className={`px-2 py-1 rounded text-xs font-semibold border ${className}`}
      style={style}
    >
      {children}
    </span>
  );
};

export default Badge;
