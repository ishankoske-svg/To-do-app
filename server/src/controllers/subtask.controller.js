// d:\projects\personal-projects\to-do-list\server\src\controllers\subtask.controller.js
const prisma = require('../config/db');

// Hardcoded user ID for Phase 2
const TEMP_USER_ID = "temp-user-123";

const addSubtask = async (req, res, next) => {
  try {
    const { title } = req.body;
    const todoId = req.params.id;

    if (!title || title.trim() === '') {
      return res.status(400).json({ success: false, message: 'Subtask title is required' });
    }

    // First check if the todo exists and belongs to the user
    const todo = await prisma.todo.findUnique({
      where: { id: todoId }
    });

    if (!todo || todo.userId !== TEMP_USER_ID) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    const subtask = await prisma.subtask.create({
      data: {
        title,
        todoId
      }
    });

    res.status(201).json({ success: true, data: subtask });
  } catch (error) {
    next(error); // Passes the error to our global error middleware
  }
};

const toggleSubtask = async (req, res, next) => {
  try {
    const { subId } = req.params;

    // We include the parent todo so we can verify the user owns it
    const subtask = await prisma.subtask.findUnique({
      where: { id: subId },
      include: { todo: true }
    });

    if (!subtask || subtask.todo.userId !== TEMP_USER_ID) {
      return res.status(404).json({ success: false, message: 'Subtask not found' });
    }

    const updatedSubtask = await prisma.subtask.update({
      where: { id: subId },
      data: { completed: !subtask.completed }
    });

    res.json({ success: true, data: updatedSubtask });
  } catch (error) {
    next(error);
  }
};

const deleteSubtask = async (req, res, next) => {
  try {
    const { subId } = req.params;

    const subtask = await prisma.subtask.findUnique({
      where: { id: subId },
      include: { todo: true }
    });

    if (!subtask || subtask.todo.userId !== TEMP_USER_ID) {
      return res.status(404).json({ success: false, message: 'Subtask not found' });
    }

    await prisma.subtask.delete({
      where: { id: subId }
    });

    res.json({ success: true, message: 'Subtask deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addSubtask,
  toggleSubtask,
  deleteSubtask
};
