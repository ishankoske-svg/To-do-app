// d:\projects\personal-projects\to-do-list\server\src\controllers\collaboration.controller.js
const prisma = require('../config/db');

const inviteUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    const ownerId = req.user.id;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const memberToInvite = await prisma.user.findUnique({ where: { email } });
    if (!memberToInvite) {
      return res.status(404).json({ success: false, message: 'User with this email not found' });
    }

    if (memberToInvite.id === ownerId) {
      return res.status(400).json({ success: false, message: 'You cannot invite yourself' });
    }

    // Check if already shared
    const existing = await prisma.sharedList.findFirst({
      where: { ownerId, memberId: memberToInvite.id }
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'List already shared with this user' });
    }

    const sharedList = await prisma.sharedList.create({
      data: {
        ownerId,
        memberId: memberToInvite.id
      },
      include: {
        member: { select: { id: true, name: true, email: true } }
      }
    });

    res.status(201).json({ success: true, data: sharedList });
  } catch (error) {
    next(error);
  }
};

const getSharedUsers = async (req, res, next) => {
  try {
    const ownerId = req.user.id;

    // Users I've invited
    const sharedWithMe = await prisma.sharedList.findMany({
      where: { ownerId },
      include: {
        member: { select: { id: true, name: true, email: true } }
      }
    });

    res.json({ success: true, data: sharedWithMe });
  } catch (error) {
    next(error);
  }
};

const removeSharedUser = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const { memberId } = req.params;

    const sharedList = await prisma.sharedList.findFirst({
      where: { ownerId, memberId }
    });

    if (!sharedList) {
      return res.status(404).json({ success: false, message: 'Collaborator not found' });
    }

    await prisma.sharedList.delete({ where: { id: sharedList.id } });

    res.json({ success: true, message: 'Collaborator removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  inviteUser,
  getSharedUsers,
  removeSharedUser
};

// ✅ DONE
