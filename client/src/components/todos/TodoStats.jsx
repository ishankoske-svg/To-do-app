// d:\projects\personal-projects\to-do-list\client\src\components\todos\TodoStats.jsx
// Shows X of Y completed + a progress bar. Uses only Tailwind CSS for the bar (no library).
import React from 'react';
import { useTodoStore } from '../../store/todoStore';

const TodoStats = () => {
  const todos = useTodoStore(state => state.todos);

  if (todos.length === 0) return null;

  const completed = todos.filter(t => t.completed).length;
  const total = todos.length;
  // Calculate percentage for the progress bar width
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="mt-4 mb-2 px-1">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-gray-500">
          <span className="font-semibold text-indigo-600">{completed}</span> of{' '}
          <span className="font-semibold text-gray-800">{total}</span> tasks completed
        </span>
        <span className="text-sm font-medium text-gray-400">{percentage}%</span>
      </div>

      {/* The "progress bar" is a gray container with an inner div that has a dynamic width */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default TodoStats;

// ✅ DONE
