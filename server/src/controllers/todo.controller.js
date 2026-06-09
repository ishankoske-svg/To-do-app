// d:\projects\personal-projects\to-do-list\server\src\controllers\todo.controller.js
const prisma = require('../config/db');


const emitToCollaborators = async (req, eventName, payload) => {
  const io = req.app.get('io');
  if (!io) return;

  // We need to know the original owner of the todo to find all collaborators
  // If payload has userId, that's the owner.
  const ownerId = payload.userId || req.user.id;

  const sharedLists = await prisma.sharedList.findMany({ where: { ownerId } });
  const roomIds = [ownerId, ...sharedLists.map(s => s.memberId)];
  
  roomIds.forEach(roomId => {
    io.to(roomId).emit(eventName, payload);
  });
};

const getAllTodos = async (req, res, next) => {
  try {
    const { completed, priority, tag, search, sortBy, order } = req.query;

    // Find all users who have shared their lists with the current user
    const sharedWithMe = await prisma.sharedList.findMany({
      where: { memberId: req.user.id }
    });
    const ownerIds = sharedWithMe.map(s => s.ownerId);
    const allValidUserIds = [req.user.id, ...ownerIds];

    // Build the WHERE clause
    const where = { userId: { in: allValidUserIds } };

    // ?completed=true or ?completed=false
    if (completed !== undefined) {
      where.completed = completed === 'true';
    }

    // ?priority=HIGH, MEDIUM, or LOW
    if (priority) {
      where.priority = priority.toUpperCase();
    }

    // ?tag=<tagId> — find todos that have this tag in their tags array
    if (tag) {
      where.tags = { some: { id: tag } };
    }

    // ?search=keyword — case-insensitive search in title OR description
    // 'contains' with mode:'insensitive' means "anywhere in the string, ignore case"
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // ─── Build the ORDER BY clause ───────────────────────────────────
    // Default: newest first
    const sortDirection = order === 'asc' ? 'asc' : 'desc';

    let orderBy;
    if (sortBy === 'dueDate') {
      // Todos without a due date will appear last
      orderBy = { dueDate: sortDirection };
    } else if (sortBy === 'priority') {
      // ⚠️ Prisma sorts enums alphabetically: HIGH → LOW → MEDIUM
      // This is a known limitation — in Phase 4 we can use a raw query for perfect ordering.
      // For now, HIGH comes first (asc) or MEDIUM comes first (desc).
      orderBy = { priority: sortDirection };
    } else {
      // Default: sort by createdAt
      orderBy = { createdAt: sortDirection };
    }

    const todos = await prisma.todo.findMany({
      where,
      orderBy,
      include: {
        subtasks: { orderBy: { createdAt: 'asc' } },
        tags: true
      }
    });

    res.json({ success: true, data: todos });
  } catch (error) {
    next(error);
  }
};

const getTodoById = async (req, res, next) => {
  try {
    const todo = await prisma.todo.findUnique({
      where: { id: req.params.id },
      include: {
        subtasks: { orderBy: { createdAt: 'asc' } },
        tags: true
      }
    });
    
    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    const sharedWithMe = await prisma.sharedList.findFirst({
      where: { memberId: req.user.id, ownerId: todo.userId }
    });

    if (todo.userId !== req.user.id && !sharedWithMe) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    res.json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
};

const createTodo = async (req, res, next) => {
  try {
    const todo = await prisma.todo.create({
      data: {
        ...req.body,
        userId: req.user.id
      },
      include: {
        subtasks: true,
        tags: true
      }
    });

    await emitToCollaborators(req, 'todo:created', todo);

    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
};

const updateTodo = async (req, res, next) => {
  try {
    const todoCheck = await prisma.todo.findUnique({ where: { id: req.params.id } });
    if (!todoCheck) return res.status(404).json({ success: false, message: 'Todo not found' });

    const sharedWithMe = await prisma.sharedList.findFirst({
      where: { memberId: req.user.id, ownerId: todoCheck.userId }
    });

    if (todoCheck.userId !== req.user.id && !sharedWithMe) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    await prisma.todo.update({
      where: { id: req.params.id },
      data: req.body
    });
    
    const updatedTodo = await prisma.todo.findUnique({ 
      where: { id: req.params.id },
      include: {
        subtasks: { orderBy: { createdAt: 'asc' } },
        tags: true
      }
    });

    await emitToCollaborators(req, 'todo:updated', updatedTodo);

    res.json({ success: true, data: updatedTodo });
  } catch (error) {
    next(error);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    const todoCheck = await prisma.todo.findUnique({ where: { id: req.params.id } });
    if (!todoCheck) return res.status(404).json({ success: false, message: 'Todo not found' });

    const sharedWithMe = await prisma.sharedList.findFirst({
      where: { memberId: req.user.id, ownerId: todoCheck.userId }
    });

    if (todoCheck.userId !== req.user.id && !sharedWithMe) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    await prisma.todo.delete({
      where: { id: req.params.id }
    });
    
    await emitToCollaborators(req, 'todo:deleted', { id: req.params.id, userId: todoCheck.userId });

    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    next(error);
  }
};

const toggleComplete = async (req, res, next) => {
  try {
    const todo = await prisma.todo.findUnique({ where: { id: req.params.id } });
    if (!todo) return res.status(404).json({ success: false, message: 'Todo not found' });

    const sharedWithMe = await prisma.sharedList.findFirst({
      where: { memberId: req.user.id, ownerId: todo.userId }
    });

    if (todo.userId !== req.user.id && !sharedWithMe) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    
    const updatedTodo = await prisma.todo.update({
      where: { id: req.params.id },
      data: { completed: !todo.completed },
      include: {
        subtasks: { orderBy: { createdAt: 'asc' } },
        tags: true
      }
    });

    let nextTodo = null;
    // Phase 6.2: Auto-create next recurring task if we are marking it as completed
    if (updatedTodo.completed && todo.recurring !== 'NONE') {
      let newDueDate = new Date(todo.dueDate || new Date());
      if (todo.recurring === 'DAILY') {
        newDueDate.setDate(newDueDate.getDate() + 1);
      } else if (todo.recurring === 'WEEKLY') {
        newDueDate.setDate(newDueDate.getDate() + 7);
      } else if (todo.recurring === 'MONTHLY') {
        newDueDate.setMonth(newDueDate.getMonth() + 1);
      }

      nextTodo = await prisma.todo.create({
        data: {
          title: todo.title,
          description: todo.description,
          priority: todo.priority,
          recurring: todo.recurring,
          dueDate: newDueDate,
          userId: req.user.id,
          completed: false,
          // We can link tags too but let's keep it simple for now or connect existing tags
          tags: {
            connect: updatedTodo.tags.map(tag => ({ id: tag.id }))
          }
        },
        include: {
          subtasks: true,
          tags: true
        }
      });
    }
    
    // Emit events
    await emitToCollaborators(req, 'todo:updated', updatedTodo);
    if (nextTodo) {
      await emitToCollaborators(req, 'todo:created', nextTodo);
    }
    
    // Return both the completed todo and the newly created next one (if any)
    res.json({ success: true, data: { completed: updatedTodo, next: nextTodo } });
  } catch (error) {
    next(error);
  }
};

const reorderTodos = async (req, res, next) => {
  try {
    const { orderedIds } = req.body;
    if (!orderedIds || !Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, message: 'Invalid orderedIds array' });
    }

    // Promise.all runs all these updates in parallel, which is much faster than awaiting each one sequentially
    await Promise.all(
      orderedIds.map((id, index) =>
        prisma.todo.updateMany({
          where: { id, userId: req.user.id },
          data: { order: index }
        })
      )
    );

    res.json({ success: true, message: 'Reordered successfully' });
  } catch (error) {
    next(error);
  }
};

const getTodoStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get all todos for user to calculate stats
    const allTodos = await prisma.todo.findMany({
      where: { userId }
    });
    
    const totalTodos = allTodos.length;
    const completedTodos = allTodos.filter(t => t.completed).length;
    const activeTodos = totalTodos - completedTodos;
    const completionRate = totalTodos === 0 ? 0 : Math.round((completedTodos / totalTodos) * 100);
    
    const byPriority = {
      HIGH: allTodos.filter(t => t.priority === 'HIGH').length,
      MEDIUM: allTodos.filter(t => t.priority === 'MEDIUM').length,
      LOW: allTodos.filter(t => t.priority === 'LOW').length,
    };
    
    const now = new Date();
    const overdueCount = allTodos.filter(t => t.dueDate && new Date(t.dueDate) < now && !t.completed).length;
    
    const sevenDaysFromNow = new Date(now);
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const upcomingCount = allTodos.filter(t => t.dueDate && new Date(t.dueDate) >= now && new Date(t.dueDate) <= sevenDaysFromNow && !t.completed).length;

    // Calculate completed by day (last 7 days)
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const completedLast7Days = allTodos.filter(t => t.completed && new Date(t.updatedAt) >= sevenDaysAgo);
    
    const completedByDayMap = {};
    // Initialize last 7 days with 0
    for(let i=6; i>=0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      completedByDayMap[dateString] = 0;
    }
    
    completedLast7Days.forEach(t => {
      const dateString = new Date(t.updatedAt).toISOString().split('T')[0];
      if (completedByDayMap[dateString] !== undefined) {
        completedByDayMap[dateString]++;
      }
    });
    
    const completedByDay = Object.keys(completedByDayMap).map(date => ({
      date,
      count: completedByDayMap[date]
    }));

    res.json({
      success: true,
      data: {
        totalTodos,
        completedTodos,
        activeTodos,
        completionRate,
        byPriority,
        completedByDay,
        overdueCount,
        upcomingCount
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleComplete,
  reorderTodos,
  getTodoStats
};
// ✅ DONE
