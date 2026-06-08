// d:\projects\personal-projects\to-do-list\server\src\controllers\tag.controller.js
const prisma = require('../config/db');



const getAllTags = async (req, res, next) => {
  try {
    const tags = await prisma.tag.findMany({
      where: { userId: req.user.id }
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
        userId: req.user.id
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
        userId: req.user.id
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
