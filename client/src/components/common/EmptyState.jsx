// d:\projects\personal-projects\to-do-list\client\src\components\common\EmptyState.jsx
import React from 'react';
import { useTodoStore } from '../../store/todoStore';

// isFiltered = true means filters are active but returned no results
// isFiltered = false (default) means the user has zero todos at all
const EmptyState = ({ isFiltered = false }) => {
  const resetFilters = useTodoStore(state => state.resetFilters);

  return (
    <div className="text-center p-10 bg-white rounded-xl shadow-sm border border-gray-100 mt-4 transition-all hover:shadow-md">
      <div className="text-4xl mb-3">{isFiltered ? '🔍' : '🎉'}</div>
      <p className="text-gray-800 font-medium text-lg">
        {isFiltered ? 'No tasks match your filters.' : 'No tasks yet!'}
      </p>
      <p className="text-gray-500 text-sm mt-1">
        {isFiltered ? 'Try adjusting your search or filters.' : 'Add a task above to get started.'}
      </p>
      {isFiltered && (
        <button
          onClick={resetFilters}
          className="mt-4 px-5 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default EmptyState;

// ✅ DONE
