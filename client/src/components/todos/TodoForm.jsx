// d:\projects\personal-projects\to-do-list\client\src\components\todos\TodoForm.jsx
import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { useTodoStore } from '../../store/todoStore';

const TodoForm = forwardRef((props, ref) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [recurring, setRecurring] = useState('NONE');
  const [isExpanded, setIsExpanded] = useState(false);
  
  const addTodo = useTodoStore(state => state.addTodo);
  const titleInputRef = useRef(null);

  // Expose a .focus() method so parent can call it via ref
  useImperativeHandle(ref, () => ({
    focus: () => {
      titleInputRef.current?.focus();
      setIsExpanded(true);
    }
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    addTodo({ 
      title,
      description: description.trim() || undefined,
      priority,
      recurring: dueDate ? recurring : 'NONE', // only allow recurring if there's a due date
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined
    });
    
    // Reset form
    setTitle('');
    setDescription('');
    setPriority('MEDIUM');
    setDueDate('');
    setRecurring('NONE');
    setIsExpanded(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mt-8 bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 dark:focus-within:ring-indigo-900 dark:focus-within:border-indigo-500">
      <div className="flex gap-3">
        <input 
          ref={titleInputRef}
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onClick={() => setIsExpanded(true)}
          placeholder="What needs to be done?"
          className="flex-1 px-3 py-2 bg-transparent focus:outline-none text-lg dark:text-gray-100 dark:placeholder-gray-400"
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
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description (optional)"
            rows="2"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-600 dark:text-gray-200 dark:placeholder-gray-400 text-sm"
          />
          
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200"
              >
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
              </select>

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-700 dark:text-gray-200"
              />

              {dueDate && (
                <select
                  value={recurring}
                  onChange={(e) => setRecurring(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200"
                >
                  <option value="NONE">Does not repeat</option>
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                </select>
              )}
            </div>
            
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => setIsExpanded(false)}
                className="px-4 py-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-medium text-sm transition-colors"
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
});

export default TodoForm;

// ✅ DONE
