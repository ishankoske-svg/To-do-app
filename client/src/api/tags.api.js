// d:\projects\personal-projects\to-do-list\client\src\api\tags.api.js
import api from './axios';

export const fetchTags = () => api.get('/tags').then(res => res.data.data);
export const createTag = (data) => api.post('/tags', data).then(res => res.data.data);
export const deleteTag = (id) => api.delete(`/tags/${id}`).then(res => res.data);
