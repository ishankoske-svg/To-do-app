// d:\projects\personal-projects\to-do-list\client\src\components\todos\TodoList.jsx
import React from 'react';
import TodoItem from './TodoItem';
import EmptyState from '../common/EmptyState';
import { useTodoStore } from '../../store/todoStore';

const TodoList = () => {
  const todos = useTodoStore(state => state.todos);
  const isLoading = useTodoStore(state => state.isLoading);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500 flex justify-center items-center gap-2 mt-4">
        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        Loading todos...
      </div>
    );
  }
  
  if (todos.length === 0) return <EmptyState />;

  return (
    <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
};

export default TodoList;
