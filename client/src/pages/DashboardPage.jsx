// d:\projects\personal-projects\to-do-list\client\src\pages\DashboardPage.jsx
import React, { useEffect } from 'react';
import { useTodoStore } from '../store/todoStore';
import TodoForm from '../components/todos/TodoForm';
import TodoList from '../components/todos/TodoList';
import TodoFilters from '../components/todos/TodoFilters';
import TodoStats from '../components/todos/TodoStats';
import PageWrapper from '../components/layout/PageWrapper';

const DashboardPage = () => {
  const loadTodos = useTodoStore(state => state.loadTodos);
  const loadTags = useTodoStore(state => state.loadTags);
  const filters = useTodoStore(state => state.filters);
  const error = useTodoStore(state => state.error);

  // Load tags once on mount (they don't change with filters)
  useEffect(() => {
    loadTags();
  }, []);

  // Re-fetch todos whenever any filter changes
  // useEffect watches the entire filters object — any change triggers a new API call
  useEffect(() => {
    loadTodos();
  }, [filters]);

  return (
    <PageWrapper>
      <div className="text-center mt-8 mb-6">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">
          My Tasks
        </h1>
        <p className="text-gray-500 mt-2">Stay organized, get things done.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-4 shadow-sm">
          <p className="text-red-600 font-medium text-center text-sm">{error}</p>
        </div>
      )}

      <TodoForm />
      <TodoFilters />
      <TodoStats />
      <TodoList />
    </PageWrapper>
  );
};

export default DashboardPage;

// ✅ DONE
