const express = require('express');
const cors = require('cors');

const errorHandler = require('./middleware/error.middleware');

const todoRoutes = require('./routes/todo.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/todos', todoRoutes);
app.use('/api/tags', require('./routes/tag.routes'));

// Error handling middleware MUST be added after all routes
app.use(errorHandler);

module.exports = app;
