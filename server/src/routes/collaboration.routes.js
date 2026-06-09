// d:\projects\personal-projects\to-do-list\server\src\routes\collaboration.routes.js
const express = require('express');
const router = express.Router();
const {
  inviteUser,
  getSharedUsers,
  removeSharedUser
} = require('../controllers/collaboration.controller');

router.post('/invite', inviteUser);
router.get('/members', getSharedUsers);
router.delete('/members/:memberId', removeSharedUser);

module.exports = router;

// ✅ DONE
