// d:\projects\personal-projects\to-do-list\client\src\hooks\useNotifications.js
import { useState, useRef, useCallback, useEffect } from 'react';

export const useNotifications = () => {
  const [permission, setPermission] = useState(
    'Notification' in window ? Notification.permission : 'denied'
  );
  
  // Keep track of timeouts so we can cancel them
  const timeoutsRef = useRef(new Map());

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notification');
      return;
    }
    const perm = await Notification.requestPermission();
    setPermission(perm);
    return perm;
  }, []);

  const scheduleNotification = useCallback((todo) => {
    if (permission !== 'granted' || !todo.dueDate || todo.completed) return;

    const dueTime = new Date(todo.dueDate).getTime();
    const now = Date.now();
    
    // We want to notify 1 hour before the due date
    const oneHour = 60 * 60 * 1000;
    const notifyTime = dueTime - oneHour;
    
    const timeUntilNotify = notifyTime - now;

    // If it's already past the notify time, or it's more than 24h away, don't schedule it in memory
    // (In a real app, a Service Worker would handle this better for background tasks)
    if (timeUntilNotify <= 0 || timeUntilNotify > 24 * 60 * 60 * 1000) return;

    // Clear existing timeout for this todo if any
    cancelNotification(todo.id);

    const timeoutId = setTimeout(() => {
      new Notification('⏰ TodoFlow Reminder', {
        body: `"${todo.title}" is due in less than an hour!`,
        icon: '/vite.svg' // Placeholder icon
      });
    }, timeUntilNotify);

    timeoutsRef.current.set(todo.id, timeoutId);
  }, [permission]);

  const cancelNotification = useCallback((todoId) => {
    if (timeoutsRef.current.has(todoId)) {
      clearTimeout(timeoutsRef.current.get(todoId));
      timeoutsRef.current.delete(todoId);
    }
  }, []);

  // Cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
      timeoutsRef.current.clear();
    };
  }, []);

  return {
    permission,
    requestPermission,
    scheduleNotification,
    cancelNotification
  };
};

// ✅ DONE
