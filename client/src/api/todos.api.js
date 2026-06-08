// d:\projects\personal-projects\to-do-list\client\src\api\todos.api.js
import api from './axios';

// Build query string from filters object, skipping null/empty values
export const fetchTodos = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.completed !== null && filters.completed !== undefined) params.append('completed', filters.completed);
  if (filters.priority) params.append('priority', filters.priority);
  if (filters.tag) params.append('tag', filters.tag);
  if (filters.search) params.append('search', filters.search);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.order) params.append('order', filters.order);
  const queryString = params.toString();
  return api.get(queryString ? `/todos?${queryString}` : '/todos').then(res => res.data.data);
};
export const createTodo = (data) => api.post('/todos', data).then(res => res.data.data);
export const updateTodo = (id, data) => api.put(`/todos/${id}`, data).then(res => res.data.data);
export const deleteTodo = (id) => api.delete(`/todos/${id}`).then(res => res.data);
export const toggleComplete = (id) => api.patch(`/todos/${id}/complete`).then(res => res.data.data);

// Subtasks
export const addSubtask = (todoId, data) => api.post(`/todos/${todoId}/subtasks`, data).then(res => res.data.data);
export const toggleSubtask = (todoId, subId) => api.patch(`/todos/${todoId}/subtasks/${subId}`).then(res => res.data.data);
export const deleteSubtask = (todoId, subId) => api.delete(`/todos/${todoId}/subtasks/${subId}`).then(res => res.data);
