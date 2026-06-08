// d:\projects\personal-projects\to-do-list\client\src\utils\priorityHelpers.js
export const getPriorityDetails = (priority) => {
  switch (priority) {
    case 'HIGH':
      return { label: 'High Priority', colorClass: 'bg-red-100 text-red-700 border-red-200' };
    case 'MEDIUM':
      return { label: 'Medium Priority', colorClass: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
    case 'LOW':
      return { label: 'Low Priority', colorClass: 'bg-blue-100 text-blue-700 border-blue-200' };
    default:
      return { label: 'No Priority', colorClass: 'bg-gray-100 text-gray-700 border-gray-200' };
  }
};
