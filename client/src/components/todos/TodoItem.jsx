// d:\projects\personal-projects\to-do-list\client\src\components\todos\TodoItem.jsx
import React, { useState } from 'react';
import { useTodoStore } from '../../store/todoStore';
import { getPriorityDetails } from '../../utils/priorityHelpers';
import { formatDate } from '../../utils/dateHelpers';
import Badge from '../common/Badge';

const TodoItem = ({ todo }) => {
  const toggleTodo = useTodoStore(state => state.toggleTodo);
  const removeTodo = useTodoStore(state => state.removeTodo);
  const addSubtask = useTodoStore(state => state.addSubtask);
  const toggleSubtask = useTodoStore(state => state.toggleSubtask);
  const deleteSubtask = useTodoStore(state => state.deleteSubtask);

  const [isExpanded, setIsExpanded] = useState(false);
  const [subtaskTitle, setSubtaskTitle] = useState('');

  const priorityDetails = getPriorityDetails(todo.priority);

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!subtaskTitle.trim()) return;
    addSubtask(todo.id, { title: subtaskTitle });
    setSubtaskTitle('');
  };

  return (
    <div className="flex flex-col p-4 bg-white border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors group">
      
      {/* Top Row: Checkbox, Title, Badges, Delete */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <input 
            type="checkbox" 
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
            className="w-5 h-5 cursor-pointer accent-indigo-600 rounded border-gray-300 focus:ring-indigo-500 transition-all"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <span 
                className={`text-lg transition-all cursor-pointer ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {todo.title}
              </span>
              
              <Badge className={priorityDetails.colorClass}>{priorityDetails.label}</Badge>
              
              {todo.dueDate && (
                <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                  Due {formatDate(todo.dueDate)}
                </Badge>
              )}
            </div>
            
            {/* Tags preview */}
            {todo.tags && todo.tags.length > 0 && (
              <div className="flex gap-1 mt-1">
                {todo.tags.map(tag => (
                  <Badge key={tag.id} colorCode={tag.color}>{tag.name}</Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={() => removeTodo(todo.id)}
          className="text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600 hover:bg-red-50 px-3 py-1 rounded-md font-medium text-sm transition-all"
        >
          Delete
        </button>
      </div>

      {/* Expanded section: Description & Subtasks */}
      {isExpanded && (
        <div className="ml-9 mt-4 pl-4 border-l-2 border-gray-100 space-y-4 animate-in fade-in slide-in-from-top-2">
          {todo.description && (
            <p className="text-gray-600 text-sm whitespace-pre-wrap">{todo.description}</p>
          )}
          
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Subtasks</h4>
            
            {todo.subtasks && todo.subtasks.map(subtask => (
              <div key={subtask.id} className="flex items-center justify-between group/sub">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => toggleSubtask(todo.id, subtask.id)}
                    className="w-4 h-4 cursor-pointer accent-indigo-600 rounded"
                  />
                  <span className={`text-sm ${subtask.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {subtask.title}
                  </span>
                </div>
                <button
                  onClick={() => deleteSubtask(todo.id, subtask.id)}
                  className="text-gray-300 hover:text-red-500 opacity-0 group-hover/sub:opacity-100 text-xs px-2 transition-all"
                >
                  ✕
                </button>
              </div>
            ))}

            <form onSubmit={handleAddSubtask} className="flex gap-2 mt-2">
              <input
                type="text"
                value={subtaskTitle}
                onChange={(e) => setSubtaskTitle(e.target.value)}
                placeholder="Add a subtask..."
                className="flex-1 px-3 py-1 text-sm bg-gray-50 rounded border border-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!subtaskTitle.trim()}
                className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
