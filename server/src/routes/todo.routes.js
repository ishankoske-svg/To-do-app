// d:\projects\personal-projects\to-do-list\server\src\routes\todo.routes.js
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
  toggleComplete
} = require('../controllers/todo.controller');

router.route('/')
  .get(getAllTodos)
  .post(validate(createTodoSchema), createTodo);

router.route('/:id')
  .get(getTodoById)
  .put(validate(updateTodoSchema), updateTodo)
  .delete(deleteTodo);

router.patch('/:id/complete', toggleComplete);

module.exports = router;
