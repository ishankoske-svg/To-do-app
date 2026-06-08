// d:\projects\personal-projects\to-do-list\client\src\api\tags.api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api/tags',
});

export const fetchTags = () => api.get('/').then(res => res.data.data);
export const createTag = (data) => api.post('/', data).then(res => res.data.data);
export const deleteTag = (id) => api.delete(`/${id}`).then(res => res.data);
