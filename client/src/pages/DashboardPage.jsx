// d:\projects\personal-projects\to-do-list\client\src\pages\DashboardPage.jsx
import React, { useEffect } from 'react';
import { useTodoStore } from '../store/todoStore';
import TodoForm from '../components/todos/TodoForm';
import TodoList from '../components/todos/TodoList';

const DashboardPage = () => {
  const loadTodos = useTodoStore(state => state.loadTodos);
  const error = useTodoStore(state => state.error);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  return (
    <div className="max-w-3xl mx-auto w-full p-6">
      <div className="text-center mt-10 mb-8">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">
          TodoFlow
        </h1>
        <p className="text-gray-500 mt-3 text-lg">Get things done, beautifully.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-6 shadow-sm">
          <p className="text-red-600 font-medium text-center">{error}</p>
        </div>
      )}

      <TodoForm />
      <TodoList />
    </div>
  );
};

export default DashboardPage;
