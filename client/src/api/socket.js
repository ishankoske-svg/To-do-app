// d:\projects\personal-projects\to-do-list\client\src\api\socket.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  autoConnect: false, // We'll connect manually when we have a token
});

export default socket;

// ✅ DONE
