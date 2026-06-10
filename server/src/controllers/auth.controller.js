// d:\projects\personal-projects\to-do-list\server\src\controllers\auth.controller.js
// Handles user signup, login, and fetching the current user
const prisma = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

// Generates a JWT token valid for 7 days
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
};

const signup = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Check if email is already registered
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already in use' });
    }

    // Hash the password securely (salt rounds = 10)
    // ⚠️ Security rule: NEVER store plain text passwords
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      },
      // ⚠️ Security rule: Omit the password from the response
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });

    const token = generateToken(user.id);
    res.status(201).json({ success: true, data: { user, token } });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password in the DB
    // ⚠️ Security rule: ALWAYS use bcrypt.compare, never compare strings directly
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    
    // Format the response to omit the password
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    };

    res.json({ success: true, data: { user: userResponse, token } });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    // req.user is set by the auth middleware
    // We fetch a fresh copy of the user to ensure data is up to date
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// Simple password reset — no email token needed for this project.
// User provides their email + new password. Works directly (no SMTP required).
const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email and newPassword are required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Return generic message so we don't leak whether the email exists
      return res.json({ success: true, message: 'If that email exists, the password has been reset.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { email }, data: { password: hashedPassword } });

    res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  getMe,
  resetPassword
};

// ✅ DONE
