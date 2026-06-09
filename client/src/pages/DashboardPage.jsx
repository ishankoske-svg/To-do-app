// d:\projects\personal-projects\to-do-list\client\src\pages\DashboardPage.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTodoStore } from '../store/todoStore';
import TodoForm from '../components/todos/TodoForm';
import TodoList from '../components/todos/TodoList';
import TodoFilters from '../components/todos/TodoFilters';
import TodoStats from '../components/todos/TodoStats';
import PageWrapper from '../components/layout/PageWrapper';
import UndoSnackbar from '../components/common/UndoSnackbar';
import { useConfetti } from '../hooks/useConfetti';
import { useDarkMode } from '../hooks/useDarkMode';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

const DashboardPage = () => {
  const loadTodos = useTodoStore(state => state.loadTodos);
  const loadTags = useTodoStore(state => state.loadTags);
  const filters = useTodoStore(state => state.filters);
  const error = useTodoStore(state => state.error);
  const undoDelete = useTodoStore(state => state.undoDelete);

  // Refs for keyboard shortcuts
  const todoFormRef = useRef(null);
  const filtersRef = useRef(null);

  // Undo snackbar state
  const [deletedTodo, setDeletedTodo] = useState(null);

  // Dark mode (needed for keyboard shortcut Ctrl+D)
  const [, toggleDarkMode] = useDarkMode();

  // 🎉 Confetti when all tasks are completed
  useConfetti();

  // ⌨️ Keyboard shortcuts
  useKeyboardShortcuts({
    onNewTask: () => todoFormRef.current?.focus(),
    onToggleDarkMode: toggleDarkMode,
    onFocusSearch: () => filtersRef.current?.focusSearch(),
  });

  // Load tags once on mount (they don't change with filters)
  useEffect(() => {
    loadTags();
  }, []);

  // Re-fetch todos whenever any filter changes
  useEffect(() => {
    loadTodos();
  }, [filters]);

  // Handle undo
  const handleUndo = useCallback(async (todo) => {
    await undoDelete(todo);
    setDeletedTodo(null);
  }, [undoDelete]);

  return (
    <PageWrapper>
      <div className="text-center mt-8 mb-6">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 tracking-tight">
          My Tasks
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Stay organized, get things done.</p>
        {/* Keyboard shortcut hints */}
        <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
          <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px] font-mono">Ctrl+N</kbd> new task
          {' · '}
          <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px] font-mono">/</kbd> search
          {' · '}
          <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px] font-mono">Ctrl+D</kbd> dark mode
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 p-4 rounded-xl mb-4 shadow-sm">
          <p className="text-red-600 dark:text-red-400 font-medium text-center text-sm">{error}</p>
        </div>
      )}

      <TodoForm ref={todoFormRef} />
      <TodoFilters ref={filtersRef} />
      <TodoStats />
      <TodoList onDeletedTodo={setDeletedTodo} />

      {/* Undo snackbar — appears at the bottom after a delete */}
      <UndoSnackbar
        deletedTodo={deletedTodo}
        onUndo={handleUndo}
        onDismiss={() => setDeletedTodo(null)}
      />
    </PageWrapper>
  );
};

export default DashboardPage;

// ✅ DONE

