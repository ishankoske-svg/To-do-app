// d:\projects\personal-projects\to-do-list\client\src\components\todos\TodoForm.jsx
import React, { useState } from 'react';
import { useTodoStore } from '../../store/todoStore';

const TodoForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const addTodo = useTodoStore(state => state.addTodo);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    addTodo({ 
      title,
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined
    });
    
    // Reset form
    setTitle('');
    setDescription('');
    setPriority('MEDIUM');
    setDueDate('');
    setIsExpanded(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mt-8 bg-white p-3 rounded-xl shadow-sm border border-gray-200 transition-all focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300">
      <div className="flex gap-3">
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onClick={() => setIsExpanded(true)}
          placeholder="What needs to be done?"
          className="flex-1 px-3 py-2 bg-transparent focus:outline-none text-lg"
        />
        {!isExpanded && (
          <button 
            type="submit" 
            disabled={!title.trim()}
            className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all"
          >
            Add
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description (optional)"
            rows="2"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-600 text-sm"
          />
          
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex gap-3">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm text-gray-700"
              >
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
              </select>

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-700"
              />
            </div>
            
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => setIsExpanded(false)}
                className="px-4 py-2 text-gray-500 hover:text-gray-800 font-medium text-sm transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={!title.trim()}
                className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all text-sm"
              >
                Save Task
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default TodoForm;
