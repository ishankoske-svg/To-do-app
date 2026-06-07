// d:\projects\personal-projects\to-do-list\server\src\controllers\todo.controller.js
const prisma = require('../config/db');

// Hardcoded user ID for Phase 1
const TEMP_USER_ID = "temp-user-123";

const getAllTodos = async (req, res, next) => {
  try {
    const todos = await prisma.todo.findMany({
      where: { userId: TEMP_USER_ID },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: todos });
  } catch (error) {
    next(error);
  }
};

const getTodoById = async (req, res, next) => {
  try {
    const todo = await prisma.todo.findUnique({
      where: { id: req.params.id }
    });
    if (!todo || todo.userId !== TEMP_USER_ID) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    res.json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
};

const createTodo = async (req, res, next) => {
  try {
    const todo = await prisma.todo.create({
      data: {
        ...req.body,
        userId: TEMP_USER_ID
      }
    });
    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
};

const updateTodo = async (req, res, next) => {
  try {
    const todo = await prisma.todo.updateMany({
      where: { id: req.params.id, userId: TEMP_USER_ID },
      data: req.body
    });
    if (todo.count === 0) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    const updatedTodo = await prisma.todo.findUnique({ where: { id: req.params.id } });
    res.json({ success: true, data: updatedTodo });
  } catch (error) {
    next(error);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    const todo = await prisma.todo.deleteMany({
      where: { id: req.params.id, userId: TEMP_USER_ID }
    });
    if (todo.count === 0) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    next(error);
  }
};

const toggleComplete = async (req, res, next) => {
  try {
    const todo = await prisma.todo.findUnique({ where: { id: req.params.id } });
    if (!todo || todo.userId !== TEMP_USER_ID) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    
    const updatedTodo = await prisma.todo.update({
      where: { id: req.params.id },
      data: { completed: !todo.completed }
    });
    
    res.json({ success: true, data: updatedTodo });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleComplete
};
