// d:\projects\personal-projects\to-do-list\server\src\controllers\attachment.controller.js
const prisma = require('../config/db');
const supabase = require('../config/supabase');
const multer = require('multer');

// Configure multer for memory storage (max 5MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).single('file');

const uploadAttachment = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, message: 'File upload error: ' + err.message });
    
    try {
      const { id: todoId } = req.params;
      const userId = req.user.id;
      const file = req.file;
      
      if (!file) return res.status(400).json({ success: false, message: 'No file uploaded' });
      if (!supabase) return res.status(500).json({ success: false, message: 'Supabase storage is not configured' });

      // Verify todo belongs to user
      const todo = await prisma.todo.findUnique({ where: { id: todoId } });
      if (!todo || todo.userId !== userId) {
        return res.status(404).json({ success: false, message: 'Todo not found' });
      }

      // Upload to Supabase Storage
      const fileName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `${userId}/${todoId}/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('todo-attachments')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false
        });
        
      if (uploadError) throw new Error(uploadError.message);

      // Get signed URL (valid for 1 year so frontend doesn't have to keep refreshing for now)
      // Alternatively, just store the path and generate signed urls on fetch. We will store path and generate signed URL on the fly.
      const { data: signedData, error: signedError } = await supabase.storage
        .from('todo-attachments')
        .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year
        
      if (signedError) throw new Error(signedError.message);

      const attachment = await prisma.attachment.create({
        data: {
          fileName: file.originalname,
          fileUrl: signedData.signedUrl,
          fileSize: file.size,
          mimeType: file.mimetype,
          todoId: todoId
        }
      });

      res.status(201).json({ success: true, data: attachment });
    } catch (error) {
      next(error);
    }
  });
};

const getAttachments = async (req, res, next) => {
  try {
    const { id: todoId } = req.params;
    const userId = req.user.id;
    
    const todo = await prisma.todo.findUnique({ where: { id: todoId } });
    if (!todo || todo.userId !== userId) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    const attachments = await prisma.attachment.findMany({
      where: { todoId }
    });

    res.json({ success: true, data: attachments });
  } catch (error) {
    next(error);
  }
};

const deleteAttachment = async (req, res, next) => {
  try {
    const { id: todoId, attachId } = req.params;
    const userId = req.user.id;
    
    const todo = await prisma.todo.findUnique({ where: { id: todoId } });
    if (!todo || todo.userId !== userId) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    const attachment = await prisma.attachment.findUnique({ where: { id: attachId } });
    if (!attachment || attachment.todoId !== todoId) {
      return res.status(404).json({ success: false, message: 'Attachment not found' });
    }

    // Attempt to delete from Supabase storage by extracting the path from URL (a bit hacky, but works)
    // Actually, we should store filePath in DB, but since we didn't, we'll just extract from signed URL
    if (supabase && attachment.fileUrl) {
      try {
        const urlObj = new URL(attachment.fileUrl);
        const pathParts = urlObj.pathname.split('/todo-attachments/');
        if (pathParts.length > 1) {
          const filePath = pathParts[1];
          await supabase.storage.from('todo-attachments').remove([filePath]);
        }
      } catch (err) {
        console.warn('Failed to delete file from Supabase storage', err);
      }
    }

    await prisma.attachment.delete({ where: { id: attachId } });

    res.json({ success: true, message: 'Attachment deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadAttachment,
  getAttachments,
  deleteAttachment
};

// ✅ DONE
