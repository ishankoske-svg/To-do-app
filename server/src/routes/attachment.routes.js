// d:\projects\personal-projects\to-do-list\server\src\routes\attachment.routes.js
const express = require('express');
const router = express.Router({ mergeParams: true }); // Merge params to get :id from parent router
const {
  uploadAttachment,
  getAttachments,
  deleteAttachment
} = require('../controllers/attachment.controller');

// Routes are mounted at /api/todos/:id/attachments
router.route('/')
  .get(getAttachments)
  .post(uploadAttachment);

router.delete('/:attachId', deleteAttachment);

module.exports = router;

// ✅ DONE
