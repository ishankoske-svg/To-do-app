// d:\projects\personal-projects\to-do-list\client\src\components\layout\PageWrapper.jsx
// A simple wrapper that centers page content and gives it consistent padding.
// Using this in every page means we only need to change the layout in ONE place later.
import React from 'react';

const PageWrapper = ({ children }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 pb-12">
      {children}
    </div>
  );
};

export default PageWrapper;

// ✅ DONE
