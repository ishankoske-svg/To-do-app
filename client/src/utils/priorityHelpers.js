// d:\projects\personal-projects\to-do-list\client\src\utils\priorityHelpers.js
export const getPriorityDetails = (priority) => {
  switch (priority) {
    case 'HIGH':
      return { label: 'High Priority', colorClass: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/30' };
    case 'MEDIUM':
      return { label: 'Medium Priority', colorClass: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800/30' };
    case 'LOW':
      return { label: 'Low Priority', colorClass: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/30' };
    default:
      return { label: 'No Priority', colorClass: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700' };
  }
};
