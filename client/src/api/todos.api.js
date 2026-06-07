// d:\projects\personal-projects\to-do-list\client\src\api\todos.api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api/todos',
});

export const fetchTodos = () => api.get('/').then(res => res.data.data);
export const createTodo = (data) => api.post('/', data).then(res => res.data.data);
export const updateTodo = (id, data) => api.put(`/${id}`, data).then(res => res.data.data);
export const deleteTodo = (id) => api.delete(`/${id}`).then(res => res.data);
export const toggleComplete = (id) => api.patch(`/${id}/complete`).then(res => res.data.data);
