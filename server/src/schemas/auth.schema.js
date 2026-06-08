// d:\projects\personal-projects\to-do-list\server\src\schemas\auth.schema.js
// Zod schemas for validating auth requests
const { z } = require('zod');

const signupSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    name: z.string().optional()
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(1, { message: 'Password is required' })
  })
});

module.exports = {
  signupSchema,
  loginSchema
};

// ✅ DONE
