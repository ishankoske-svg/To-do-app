// d:\projects\personal-projects\to-do-list\client\src\hooks\useConfetti.js
// Fires confetti exactly ONCE when all todos are completed.
// Uses a ref to prevent re-firing on subsequent renders.
import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useTodoStore } from '../store/todoStore';

export const useConfetti = () => {
  const todos = useTodoStore(state => state.todos);
  const hasFiredRef = useRef(false);

  useEffect(() => {
    // Guard: need at least 1 todo, all must be completed, and we haven't fired yet
    if (todos.length > 0 && todos.every(t => t.completed) && !hasFiredRef.current) {
      hasFiredRef.current = true;

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f59e0b']
      });
    }

    // Reset the flag when not all todos are completed anymore
    // so confetti can fire again next time
    if (todos.length > 0 && !todos.every(t => t.completed)) {
      hasFiredRef.current = false;
    }
  }, [todos]);
};

// ✅ DONE
