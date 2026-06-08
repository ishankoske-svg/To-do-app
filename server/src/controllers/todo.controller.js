// d:\projects\personal-projects\to-do-list\server\src\controllers\todo.controller.js
const prisma = require('../config/db');


const getAllTodos = async (req, res, next) => {
  try {
    const { completed, priority, tag, search, sortBy, order } = req.query;

    // ─── Build the WHERE clause ─────────────────────────────────────
    // We start with just the userId, then add optional filters
    const where = { userId: req.user.id };

    // ?completed=true or ?completed=false
    if (completed !== undefined) {
      where.completed = completed === 'true';
    }

    // ?priority=HIGH, MEDIUM, or LOW
    if (priority) {
      where.priority = priority.toUpperCase();
    }

    // ?tag=<tagId> — find todos that have this tag in their tags array
    if (tag) {
      where.tags = { some: { id: tag } };
    }

    // ?search=keyword — case-insensitive search in title OR description
    // 'contains' with mode:'insensitive' means "anywhere in the string, ignore case"
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // ─── Build the ORDER BY clause ───────────────────────────────────
    // Default: newest first
    const sortDirection = order === 'asc' ? 'asc' : 'desc';

    let orderBy;
    if (sortBy === 'dueDate') {
      // Todos without a due date will appear last
      orderBy = { dueDate: sortDirection };
    } else if (sortBy === 'priority') {
      // ⚠️ Prisma sorts enums alphabetically: HIGH → LOW → MEDIUM
      // This is a known limitation — in Phase 4 we can use a raw query for perfect ordering.
      // For now, HIGH comes first (asc) or MEDIUM comes first (desc).
      orderBy = { priority: sortDirection };
    } else {
      // Default: sort by createdAt
      orderBy = { createdAt: sortDirection };
    }

    const todos = await prisma.todo.findMany({
      where,
      orderBy,
      include: {
        subtasks: { orderBy: { createdAt: 'asc' } },
        tags: true
      }
    });

    res.json({ success: true, data: todos });
  } catch (error) {
    next(error);
  }
};

const getTodoById = async (req, res, next) => {
  try {
    const todo = await prisma.todo.findUnique({
      where: { id: req.params.id },
      include: {
        subtasks: { orderBy: { createdAt: 'asc' } },
        tags: true
      }
    });
    if (!todo || todo.userId !== req.user.id) {
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
        userId: req.user.id
      },
      include: {
        subtasks: true,
        tags: true
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
      where: { id: req.params.id, userId: req.user.id },
      data: req.body
    });
    if (todo.count === 0) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    const updatedTodo = await prisma.todo.findUnique({ 
      where: { id: req.params.id },
      include: {
        subtasks: { orderBy: { createdAt: 'asc' } },
        tags: true
      }
    });
    res.json({ success: true, data: updatedTodo });
  } catch (error) {
    next(error);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    const todo = await prisma.todo.deleteMany({
      where: { id: req.params.id, userId: req.user.id }
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
    if (!todo || todo.userId !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    
    const updatedTodo = await prisma.todo.update({
      where: { id: req.params.id },
      data: { completed: !todo.completed },
      include: {
        subtasks: { orderBy: { createdAt: 'asc' } },
        tags: true
      }
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
