// d:\projects\personal-projects\to-do-list\client\src\components\common\EmptyState.jsx
import React from 'react';

const EmptyState = () => {
  return (
    <div className="text-center p-10 bg-white rounded-xl shadow-sm border border-gray-100 mt-4 transition-all hover:shadow-md">
      <div className="text-4xl mb-3">🎉</div>
      <p className="text-gray-800 font-medium text-lg">No todos yet!</p>
      <p className="text-gray-500 text-sm mt-1">Add a task above to get started.</p>
    </div>
  );
};

export default EmptyState;
