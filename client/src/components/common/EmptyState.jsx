// d:\projects\personal-projects\to-do-list\client\src\components\common\EmptyState.jsx
import React from 'react';
import { useTodoStore } from '../../store/todoStore';

// isFiltered = true means filters are active but returned no results
// isFiltered = false (default) means the user has zero todos at all
const EmptyState = ({ isFiltered = false }) => {
  const resetFilters = useTodoStore(state => state.resetFilters);

  return (
    <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mt-4 transition-all hover:shadow-md">
      <div className="text-4xl mb-3">{isFiltered ? '🔍' : '🎉'}</div>
      <p className="text-gray-800 dark:text-gray-200 font-medium text-lg">
        {isFiltered ? 'No tasks match your filters.' : 'No tasks yet!'}
      </p>
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
        {isFiltered ? 'Try adjusting your search or filters.' : 'Add a task above to get started.'}
      </p>
      {isFiltered && (
        <button
          onClick={resetFilters}
          className="mt-4 px-5 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default EmptyState;

// ✅ DONE
