// d:\projects\personal-projects\to-do-list\client\src\components\todos\TodoList.jsx
import React from 'react';
import TodoItem from './TodoItem';
import EmptyState from '../common/EmptyState';
import Spinner from '../common/Spinner';
import { useTodoStore } from '../../store/todoStore';

const TodoList = () => {
  const todos = useTodoStore(state => state.todos);
  const isLoading = useTodoStore(state => state.isLoading);
  const filters = useTodoStore(state => state.filters);

  // Check if any filter is actively applied — helps EmptyState show the right message
  const hasActiveFilters =
    filters.completed !== null ||
    filters.priority !== null ||
    filters.tag !== null ||
    filters.search !== '';

  if (isLoading) return <Spinner />;

  if (todos.length === 0) return <EmptyState isFiltered={hasActiveFilters} />;

  return (
    <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
};

export default TodoList;

// ✅ DONE
