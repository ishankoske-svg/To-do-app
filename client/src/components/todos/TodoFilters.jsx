// d:\projects\personal-projects\to-do-list\client\src\components\todos\TodoFilters.jsx
// This component holds all the filter controls. Each control calls setFilter() in the store,
// which triggers a re-fetch via useEffect in DashboardPage.
import React, { useState, useEffect } from 'react';
import { useTodoStore } from '../../store/todoStore';

const TodoFilters = () => {
  const filters = useTodoStore(state => state.filters);
  const setFilter = useTodoStore(state => state.setFilter);
  const resetFilters = useTodoStore(state => state.resetFilters);
  const tags = useTodoStore(state => state.tags);

  // Local state for the search input — we debounce this before sending to the store.
  // "Debounce" means: wait until the user STOPS typing for 400ms before actually filtering.
  // Without this, we'd fire an API request on every single keystroke, which is wasteful.
  const [searchInput, setSearchInput] = useState(filters.search || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilter('search', searchInput);
    }, 400);
    return () => clearTimeout(timer); // Reset timer if user types again before 400ms
  }, [searchInput]);

  const hasActiveFilters =
    filters.completed !== null ||
    filters.priority !== null ||
    filters.tag !== null ||
    filters.search !== '';

  const handleReset = () => {
    setSearchInput('');
    resetFilters();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mt-4 space-y-4">
      
      {/* Completion Tabs */}
      <div className="flex border border-gray-200 rounded-lg overflow-hidden text-sm font-medium">
        {[
          { label: 'All', value: null },
          { label: 'Active', value: false },
          { label: 'Completed', value: true },
        ].map(tab => (
          <button
            key={String(tab.value)}
            onClick={() => setFilter('completed', tab.value)}
            className={`flex-1 py-2 transition-colors ${
              filters.completed === tab.value
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Row 2: Priority, Tag, Sort dropdowns + Search */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filters.priority || ''}
          onChange={(e) => setFilter('priority', e.target.value || null)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Priorities</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        <select
          value={filters.tag || ''}
          onChange={(e) => setFilter('tag', e.target.value || null)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Tags</option>
          {tags.map(tag => (
            <option key={tag.id} value={tag.id}>{tag.name}</option>
          ))}
        </select>

        <select
          value={`${filters.sortBy}_${filters.order}`}
          onChange={(e) => {
            const [sortBy, order] = e.target.value.split('_');
            setFilter('sortBy', sortBy);
            setFilter('order', order);
          }}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="createdAt_desc">Newest First</option>
          <option value="createdAt_asc">Oldest First</option>
          <option value="dueDate_asc">Due Date (Soonest)</option>
          <option value="priority_asc">Priority (High first)</option>
        </select>

        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search tasks..."
          className="flex-1 min-w-[150px] px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg font-medium transition-colors border border-red-200"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default TodoFilters;

// ✅ DONE
