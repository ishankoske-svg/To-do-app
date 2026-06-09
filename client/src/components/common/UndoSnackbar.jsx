// d:\projects\personal-projects\to-do-list\client\src\components\common\UndoSnackbar.jsx
// A toast-like notification that appears at the bottom of the screen after deleting a task.
// It shows a countdown timer and an "Undo" button.
// Undo is frontend-only — we restore the task from a cached copy before the API delete finishes.
import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const UNDO_TIMEOUT = 5000; // 5 seconds to undo

const UndoSnackbar = ({ deletedTodo, onUndo, onDismiss }) => {
  const [timeLeft, setTimeLeft] = useState(UNDO_TIMEOUT / 1000);

  useEffect(() => {
    if (!deletedTodo) return;

    // Reset countdown when a new deletion happens
    setTimeLeft(UNDO_TIMEOUT / 1000);

    // Countdown timer — ticks every second
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onDismiss?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [deletedTodo]);

  const handleUndo = useCallback(() => {
    onUndo?.(deletedTodo);
  }, [deletedTodo, onUndo]);

  return (
    <AnimatePresence>
      {deletedTodo && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-4 min-w-[300px]">
            <span className="text-sm font-medium flex-1">
              Task deleted ({timeLeft}s)
            </span>
            <button
              onClick={handleUndo}
              className="text-indigo-400 dark:text-indigo-600 font-bold text-sm hover:text-indigo-300 dark:hover:text-indigo-500 transition-colors uppercase tracking-wide"
            >
              Undo
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UndoSnackbar;

// ✅ DONE
