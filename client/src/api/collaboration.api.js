// d:\projects\personal-projects\to-do-list\client\src\api\collaboration.api.js
import api from './axios';

export const inviteCollaborator = (email) => api.post('/collaborate/invite', { email }).then(res => res.data.data);
export const getCollaborators = () => api.get('/collaborate/members').then(res => res.data.data);
export const removeCollaborator = (memberId) => api.delete(`/collaborate/members/${memberId}`).then(res => res.data);

// ✅ DONE
