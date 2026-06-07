// d:\projects\personal-projects\to-do-list\client\src\components\todos\TodoForm.jsx
import React, { useState } from 'react';
import { useTodoStore } from '../../store/todoStore';

const TodoForm = () => {
  const [title, setTitle] = useState('');
  const addTodo = useTodoStore(state => state.addTodo);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTodo({ title });
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full mt-8">
      <input 
        type="text" 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        className="flex-1 px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-lg transition-all"
      />
      <button 
        type="submit" 
        disabled={!title.trim()}
        className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-indigo-200"
      >
        Add
      </button>
    </form>
  );
};

export default TodoForm;
