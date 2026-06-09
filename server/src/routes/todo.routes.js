const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate.middleware');
const { createTodoSchema, updateTodoSchema } = require('../schemas/todo.schema');
const {
  getAllTodos,
  createTodo,
  getTodoById,
  updateTodo,
  deleteTodo,
  toggleComplete,
  reorderTodos,
  getTodoStats
} = require('../controllers/todo.controller');
const {
  addSubtask,
  toggleSubtask,
  deleteSubtask
} = require('../controllers/subtask.controller');

router.route('/')
  .get(getAllTodos)
  .post(validate(createTodoSchema), createTodo);

// ⚠️ MUST BE BEFORE /:id because otherwise "reorder" and "stats" are treated as an ID
router.patch('/reorder', reorderTodos);
router.get('/stats', getTodoStats);

router.route('/:id')
  .get(getTodoById)
  .put(validate(updateTodoSchema), updateTodo)
  .delete(deleteTodo);

router.patch('/:id/complete', toggleComplete);

const attachmentRoutes = require('./attachment.routes');

// Subtask Routes
router.post('/:id/subtasks', addSubtask);
router.patch('/:id/subtasks/:subId', toggleSubtask);
router.delete('/:id/subtasks/:subId', deleteSubtask);

// Attachment Routes
router.use('/:id/attachments', attachmentRoutes);

module.exports = router;

// ✅ DONE
