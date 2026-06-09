// d:\projects\personal-projects\to-do-list\client\src\components\todos\TodoList.jsx
import React from 'react';
import TodoItem from './TodoItem';
import EmptyState from '../common/EmptyState';
import Spinner from '../common/Spinner';
import { useTodoStore } from '../../store/todoStore';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';

// Sortable Wrapper Component
const SortableTodoItem = ({ todo, isDragDisabled, onDeletedTodo }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: todo.id, disabled: isDragDisabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`relative ${isDragging ? 'shadow-2xl ring-2 ring-indigo-500 rounded-lg' : ''}`}
    >
      <TodoItem 
        todo={todo} 
        dragHandleProps={{ ...attributes, ...listeners, disabled: isDragDisabled }}
        onDeletedTodo={onDeletedTodo}
      />
    </motion.div>
  );
};

const TodoList = ({ onDeletedTodo }) => {
  const todos = useTodoStore(state => state.todos);
  const isLoading = useTodoStore(state => state.isLoading);
  const filters = useTodoStore(state => state.filters);
  const reorderTodos = useTodoStore(state => state.reorderTodos);

  // Check if any filter is actively applied — sorting a filtered list would be confusing!
  const hasActiveFilters =
    filters.completed !== null ||
    filters.priority !== null ||
    filters.tag !== null ||
    filters.search !== '';

  const isDragDisabled = hasActiveFilters;

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex(t => t.id === active.id);
      const newIndex = todos.findIndex(t => t.id === over.id);
      
      const newTodosArray = arrayMove(todos, oldIndex, newIndex);
      const newOrderedIds = newTodosArray.map(t => t.id);
      
      reorderTodos(newOrderedIds);
    }
  };

  if (isLoading) return <Spinner />;

  if (todos.length === 0) return <EmptyState isFiltered={hasActiveFilters} />;

  return (
    <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={todos.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence mode="popLayout">
            {todos.map(todo => (
              <SortableTodoItem key={todo.id} todo={todo} isDragDisabled={isDragDisabled} onDeletedTodo={onDeletedTodo} />
            ))}
          </AnimatePresence>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default TodoList;

// ✅ DONE
