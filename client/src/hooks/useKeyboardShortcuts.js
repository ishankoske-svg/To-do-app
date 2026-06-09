// d:\projects\personal-projects\to-do-list\client\src\hooks\useKeyboardShortcuts.js
// Global keyboard shortcuts for power users.
// All shortcuts use Ctrl (or Cmd on Mac) as a modifier to avoid conflicts with typing.
import { useEffect } from 'react';

export const useKeyboardShortcuts = ({ onNewTask, onToggleDarkMode, onFocusSearch }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input/textarea
      const tag = e.target.tagName.toLowerCase();
      const isTyping = tag === 'input' || tag === 'textarea' || tag === 'select';

      // Ctrl+N or Cmd+N → Focus the "Add task" input
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        onNewTask?.();
      }

      // Ctrl+D or Cmd+D → Toggle dark mode
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        onToggleDarkMode?.();
      }

      // "/" → Focus the search input (only when NOT already typing)
      if (e.key === '/' && !isTyping) {
        e.preventDefault();
        onFocusSearch?.();
      }

      // "Escape" → Blur the currently focused element
      if (e.key === 'Escape') {
        document.activeElement?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNewTask, onToggleDarkMode, onFocusSearch]);
};

// ✅ DONE
