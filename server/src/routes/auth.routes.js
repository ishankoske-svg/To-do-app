// d:\projects\personal-projects\to-do-list\server\src\routes\auth.routes.js
// Routes for authentication endpoints
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validate.middleware');
const { signupSchema, loginSchema } = require('../schemas/auth.schema');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);

// Protected route — requires a valid JWT
router.get('/me', authMiddleware, authController.getMe);

// Public password reset — email + newPassword (no SMTP needed)
router.post('/reset-password', authController.resetPassword);

module.exports = router;

// ✅ DONE
