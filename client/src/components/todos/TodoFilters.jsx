// d:\projects\personal-projects\to-do-list\client\src\components\todos\TodoFilters.jsx
// This component holds all the filter controls. Each control calls setFilter() in the store,
// which triggers a re-fetch via useEffect in DashboardPage.
import React, { useState, useEffect, forwardRef, useRef, useImperativeHandle } from 'react';
import { useTodoStore } from '../../store/todoStore';

const TodoFilters = forwardRef((props, ref) => {
  const searchRef = useRef(null);

  // Expose a .focusSearch() method to parent via ref
  useImperativeHandle(ref, () => ({
    focusSearch: () => searchRef.current?.focus()
  }));
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
    <div className="bg-white dark:bg-[#111111]/80 backdrop-blur-md rounded-xl border border-gray-200 dark:border-white/10 shadow-sm p-4 mt-4 space-y-4">
      
      {/* Completion Tabs */}
      <div className="flex border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden text-sm font-medium">
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
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Row 2: Priority, Tag, Sort dropdowns + Search */}
      {/* On mobile: 2-column grid. On sm+: flex-wrap */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
        <select
          value={filters.priority || ''}
          onChange={(e) => setFilter('priority', e.target.value || null)}
          className="w-full sm:w-auto px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-[#1a1a1a]/80 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Priorities</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        <select
          value={filters.tag || ''}
          onChange={(e) => setFilter('tag', e.target.value || null)}
          className="w-full sm:w-auto px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-[#1a1a1a]/80 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          className="w-full sm:w-auto px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-[#1a1a1a]/80 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="createdAt_desc">Newest First</option>
          <option value="createdAt_asc">Oldest First</option>
          <option value="dueDate_asc">Due Soon</option>
          <option value="priority_asc">Priority ↑</option>
        </select>

        {/* Search — full width on mobile */}
        <div className="col-span-2 sm:flex-1 flex gap-2">
          <input
            ref={searchRef}
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search tasks..."
            className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 dark:bg-[#1a1a1a]/80 text-sm text-gray-700 dark:text-gray-200 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="flex-shrink-0 px-3 py-2 text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors border border-red-200 dark:border-red-800/30"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default TodoFilters;

// ✅ DONE
