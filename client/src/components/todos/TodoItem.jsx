// d:\projects\personal-projects\to-do-list\client\src\components\todos\TodoItem.jsx
import React, { useState } from 'react';
import { useTodoStore } from '../../store/todoStore';
import { getPriorityDetails } from '../../utils/priorityHelpers';
import { formatDate } from '../../utils/dateHelpers';
import Badge from '../common/Badge';
import AttachmentUploader from './AttachmentUploader';
import { motion } from 'framer-motion';

const TodoItem = ({ todo, dragHandleProps, onDeletedTodo }) => {
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
    <motion.div 
      whileHover={{ scale: 1.005 }}
      className="flex flex-col p-3 sm:p-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
    >
      {/* Top Row: Drag Handle, Checkbox, Title, Delete */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 sm:gap-4 flex-1 min-w-0">
          {/* Drag Handle — hidden on mobile, shown on sm+ */}
          <div 
            {...dragHandleProps} 
            className={`hidden sm:block mt-1 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 ${dragHandleProps?.disabled ? 'cursor-not-allowed opacity-30' : 'cursor-grab active:cursor-grabbing'}`}
            title={dragHandleProps?.disabled ? "Sorting disabled while filtered" : "Drag to reorder"}
          >
            ⠿
          </div>

          {/* Checkbox */}
          <motion.input 
            whileTap={{ scale: 0.9 }}
            type="checkbox" 
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
            className="mt-1 w-5 h-5 flex-shrink-0 cursor-pointer accent-indigo-600 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-indigo-500 transition-all"
          />

          {/* Title + badges block — tappable to expand */}
          <div className="flex flex-col flex-1 min-w-0" onClick={() => setIsExpanded(!isExpanded)}>
            {/* Title row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span 
                className={`text-base sm:text-lg transition-all duration-300 cursor-pointer leading-snug ${todo.completed ? 'line-through text-gray-400 dark:text-gray-500 opacity-50' : 'text-gray-800 dark:text-gray-100'}`}
              >
                {todo.title}
              </span>
              {todo.recurring && todo.recurring !== 'NONE' && (
                <span className="text-sm flex-shrink-0" title={`Repeats ${todo.recurring.toLowerCase()}`}>🔁</span>
              )}
            </div>

            {/* Badges row — wraps naturally on small screens */}
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <Badge className={priorityDetails.colorClass}>{priorityDetails.label}</Badge>
              
              {todo.dueDate && (
                <Badge className="bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/30">
                  Due {formatDate(todo.dueDate)}
                </Badge>
              )}

              {todo.recurring && todo.recurring !== 'NONE' && (
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/30">
                  {todo.recurring.charAt(0) + todo.recurring.slice(1).toLowerCase()}
                </Badge>
              )}
              
              {todo.attachments && todo.attachments.length > 0 && (
                <Badge className="bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                  📎 {todo.attachments.length}
                </Badge>
              )}

              {/* Tags */}
              {todo.tags && todo.tags.map(tag => (
                <Badge key={tag.id} colorCode={tag.color}>{tag.name}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Delete button — always visible on mobile, hover-only on desktop */}
        <button 
          onClick={async (e) => {
            e.stopPropagation();
            const deleted = await removeTodo(todo.id);
            if (deleted) onDeletedTodo?.(deleted);
          }}
          className="flex-shrink-0 text-red-400 dark:text-red-500 
            opacity-100 sm:opacity-0 sm:group-hover:opacity-100 
            hover:text-red-600 dark:hover:text-red-400 
            hover:bg-red-50 dark:hover:bg-red-900/20 
            px-2 sm:px-3 py-1 rounded-md font-medium text-sm transition-all"
          title="Delete"
        >
          <span className="sm:hidden">🗑</span>
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>

      {/* Expanded section: Description & Subtasks */}
      {isExpanded && (
        <div className="ml-7 sm:ml-9 mt-4 pl-3 sm:pl-4 border-l-2 border-gray-100 dark:border-gray-700 space-y-4">
          {todo.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-wrap">{todo.description}</p>
          )}
          
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subtasks</h4>
            
            {todo.subtasks && todo.subtasks.map(subtask => (
              <div key={subtask.id} className="flex items-center justify-between group/sub">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => toggleSubtask(todo.id, subtask.id)}
                    className="w-4 h-4 flex-shrink-0 cursor-pointer accent-indigo-600 rounded"
                  />
                  <span className={`text-sm truncate ${subtask.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                    {subtask.title}
                  </span>
                </div>
                {/* Subtask delete — always visible on mobile */}
                <button
                  onClick={() => deleteSubtask(todo.id, subtask.id)}
                  className="flex-shrink-0 text-gray-300 hover:text-red-500 
                    opacity-100 sm:opacity-0 sm:group-hover/sub:opacity-100 
                    text-xs px-2 transition-all"
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
                className="flex-1 min-w-0 px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!subtaskTitle.trim()}
                className="flex-shrink-0 px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                Add
              </button>
            </form>
          </div>

          {/* File Attachments */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Attachments</h4>
            <AttachmentUploader todoId={todo.id} initialAttachments={todo.attachments} />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TodoItem;

// ✅ DONE
