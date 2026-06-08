// d:\projects\personal-projects\to-do-list\server\src\routes\tag.routes.js
const express = require('express');
const router = express.Router();
const {
  getAllTags,
  createTag,
  deleteTag
} = require('../controllers/tag.controller');

router.route('/')
  .get(getAllTags)
  .post(createTag);

router.route('/:id')
  .delete(deleteTag);

module.exports = router;
