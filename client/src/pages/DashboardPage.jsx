import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTodoStore } from '../store/todoStore';
import TodoForm from '../components/todos/TodoForm';
import TodoList from '../components/todos/TodoList';
import TodoFilters from '../components/todos/TodoFilters';
import PageWrapper from '../components/layout/PageWrapper';
import NotificationBanner from '../components/common/NotificationBanner';
import UndoSnackbar from '../components/common/UndoSnackbar';
import CollaboratorModal from '../components/common/CollaboratorModal';
import TodoStats from '../components/todos/TodoStats';
import { useConfetti } from '../hooks/useConfetti';
import { useDarkMode } from '../hooks/useDarkMode';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useNotifications } from '../hooks/useNotifications';

const DashboardPage = () => {
  const loadTodos = useTodoStore(state => state.loadTodos);
  const loadTags = useTodoStore(state => state.loadTags);
  const initSocket = useTodoStore(state => state.initSocket);
  const filters = useTodoStore(state => state.filters);
  const todos = useTodoStore(state => state.todos);
  const error = useTodoStore(state => state.error);
  const undoDelete = useTodoStore(state => state.undoDelete);

  // Refs for keyboard shortcuts
  const todoFormRef = useRef(null);
  const filtersRef = useRef(null);

  // Undo snackbar state
  const [deletedTodo, setDeletedTodo] = useState(null);
  
  // Collaborator modal state
  const [showCollabModal, setShowCollabModal] = useState(false);

  // Dark mode (needed for keyboard shortcut Ctrl+D)
  const [, toggleDarkMode] = useDarkMode();

  // 🎉 Confetti when all tasks are completed
  useConfetti();

  // 🔔 Push notifications
  const { permission, requestPermission, scheduleNotification, cancelNotification } = useNotifications();

  // ⌨️ Keyboard shortcuts
  useKeyboardShortcuts({
    onNewTask: () => todoFormRef.current?.focus(),
    onToggleDarkMode: toggleDarkMode,
    onFocusSearch: () => filtersRef.current?.focusSearch(),
  });

  // Init socket and load tags once on mount
  useEffect(() => {
    initSocket();
    loadTags();
  }, []);

  // Re-fetch todos whenever any filter changes
  useEffect(() => {
    loadTodos();
  }, [filters]);

  // Schedule or cancel notifications when todos change
  useEffect(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        cancelNotification(todo.id);
      } else if (todo.dueDate) {
        scheduleNotification(todo);
      }
    });
  }, [todos, scheduleNotification, cancelNotification]);

  // Handle undo
  const handleUndo = useCallback(async (todo) => {
    await undoDelete(todo);
    setDeletedTodo(null);
  }, [undoDelete]);

  // Cancel notification on delete wrapper
  const handleDeletedTodo = useCallback((todo) => {
    cancelNotification(todo.id);
    setDeletedTodo(todo);
  }, [cancelNotification]);

  return (
    <PageWrapper>
      <NotificationBanner permission={permission} onRequestPermission={requestPermission} />
      
      <div className="text-center mt-6 sm:mt-8 mb-6">
        {/* Title row with Share button on same line */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 tracking-tight">
            My Tasks
          </h1>
          <button 
            onClick={() => setShowCollabModal(true)}
            className="flex-shrink-0 px-3 py-1.5 bg-white dark:bg-[#111111]/80 backdrop-blur-md text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-white/10 rounded-full text-sm font-medium hover:bg-indigo-50 dark:hover:bg-white/10 transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span>👥</span>
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>

        <p className="text-gray-500 dark:text-gray-400">Stay organized, get things done.</p>

        {/* Keyboard shortcut hints — only shown on devices with a keyboard */}
        <p className="hidden md:block text-xs text-gray-400 dark:text-gray-600 mt-1">
          <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-black/50 dark:border dark:border-white/10 rounded text-[10px] font-mono">Ctrl+N</kbd> new task
          {' · '}
          <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-black/50 dark:border dark:border-white/10 rounded text-[10px] font-mono">/</kbd> search
          {' · '}
          <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-black/50 dark:border dark:border-white/10 rounded text-[10px] font-mono">Ctrl+D</kbd> dark mode
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
      <TodoList onDeletedTodo={handleDeletedTodo} />

      {/* Undo snackbar — appears at the bottom after a delete */}
      <UndoSnackbar
        deletedTodo={deletedTodo}
        onUndo={handleUndo}
        onDismiss={() => setDeletedTodo(null)}
      />

      {showCollabModal && <CollaboratorModal onClose={() => setShowCollabModal(false)} />}
    </PageWrapper>
  );
};

export default DashboardPage;

// ✅ DONE

