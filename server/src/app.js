// d:\projects\personal-projects\to-do-list\server\src\app.js
const express = require('express');
const cors = require('cors');

const errorHandler = require('./middleware/error.middleware');
const authMiddleware = require('./middleware/auth.middleware');

const authRoutes = require('./routes/auth.routes');
const todoRoutes = require('./routes/todo.routes');
const tagRoutes = require('./routes/tag.routes');
const collaborationRoutes = require('./routes/collaboration.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);

// Protected routes — require valid JWT
app.use('/api/todos', authMiddleware, todoRoutes);
app.use('/api/tags', authMiddleware, tagRoutes);
app.use('/api/collaborate', authMiddleware, collaborationRoutes);

// Error handling middleware MUST be added after all routes
app.use(errorHandler);

module.exports = app;

// ✅ DONE
