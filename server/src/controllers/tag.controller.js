// d:\projects\personal-projects\to-do-list\server\src\controllers\tag.controller.js
const prisma = require('../config/db');

// Hardcoded user ID for Phase 2
const TEMP_USER_ID = "temp-user-123";

const getAllTags = async (req, res, next) => {
  try {
    const tags = await prisma.tag.findMany({
      where: { userId: TEMP_USER_ID }
    });
    res.json({ success: true, data: tags });
  } catch (error) {
    next(error);
  }
};

const createTag = async (req, res, next) => {
  try {
    const { name, color } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Tag name is required' });
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        color: color || '#6366f1',
        userId: TEMP_USER_ID
      }
    });

    res.status(201).json({ success: true, data: tag });
  } catch (error) {
    next(error);
  }
};

const deleteTag = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tag = await prisma.tag.deleteMany({
      where: {
        id,
        userId: TEMP_USER_ID
      }
    });

    if (tag.count === 0) {
      return res.status(404).json({ success: false, message: 'Tag not found' });
    }

    res.json({ success: true, message: 'Tag deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTags,
  createTag,
  deleteTag
};
