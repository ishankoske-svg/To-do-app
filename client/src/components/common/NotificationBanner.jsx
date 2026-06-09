// d:\projects\personal-projects\to-do-list\client\src\components\common\NotificationBanner.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationBanner = ({ permission, onRequestPermission }) => {
  const [dismissed, setDismissed] = useState(false);

  // Only show if the browser supports it, we haven't asked yet ('default'), and it hasn't been dismissed
  if (permission !== 'default' || dismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-indigo-50 border-b border-indigo-100 dark:bg-indigo-900/30 dark:border-indigo-800/50"
      >
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🔔</span>
            <span className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
              Enable reminders to get notified when tasks are due soon
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDismissed(true)}
              className="text-xs font-medium px-3 py-1.5 text-indigo-600 hover:text-indigo-800 dark:text-indigo-300 dark:hover:text-indigo-100 transition-colors"
            >
              Dismiss
            </button>
            <button
              onClick={async () => {
                await onRequestPermission();
                setDismissed(true);
              }}
              className="text-xs font-semibold px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
            >
              Enable
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationBanner;

// ✅ DONE
