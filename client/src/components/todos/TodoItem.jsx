// d:\projects\personal-projects\to-do-list\client\src\components\todos\TodoItem.jsx
import React from 'react';
import { useTodoStore } from '../../store/todoStore';

const TodoItem = ({ todo }) => {
  const toggleTodo = useTodoStore(state => state.toggleTodo);
  const removeTodo = useTodoStore(state => state.removeTodo);

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors group">
      <div className="flex items-center gap-4">
        <input 
          type="checkbox" 
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
          className="w-5 h-5 cursor-pointer accent-indigo-600 rounded border-gray-300 focus:ring-indigo-500 transition-all"
        />
        <span className={`text-lg transition-all ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {todo.title}
        </span>
      </div>
      <button 
        onClick={() => removeTodo(todo.id)}
        className="text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600 hover:bg-red-50 px-3 py-1 rounded-md font-medium text-sm transition-all"
      >
        Delete
      </button>
    </div>
  );
};

export default TodoItem;
