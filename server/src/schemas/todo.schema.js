// d:\projects\personal-projects\to-do-list\server\src\schemas\todo.schema.js
const { z } = require('zod');

const createTodoSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }).min(1, 'Title cannot be empty'),
    description: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    dueDate: z.string().datetime().optional().nullable(),
  })
});

const updateTodoSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title cannot be empty').optional(),
    description: z.string().optional().nullable(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    dueDate: z.string().datetime().optional().nullable(),
    completed: z.boolean().optional(),
    order: z.number().optional()
  })
});

module.exports = {
  createTodoSchema,
  updateTodoSchema
};
