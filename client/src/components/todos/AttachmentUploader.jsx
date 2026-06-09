// d:\projects\personal-projects\to-do-list\client\src\components\todos\AttachmentUploader.jsx
import React, { useState, useRef, useEffect } from 'react';
import { uploadAttachment, getAttachments, deleteAttachment } from '../../api/todos.api';

const AttachmentUploader = ({ todoId, initialAttachments = [] }) => {
  const [attachments, setAttachments] = useState(initialAttachments);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // We fetch attachments on mount to ensure we have the latest (including signed URLs)
  useEffect(() => {
    const fetchAttachments = async () => {
      try {
        const data = await getAttachments(todoId);
        setAttachments(data);
      } catch (err) {
        console.error('Failed to load attachments', err);
      }
    };
    fetchAttachments();
  }, [todoId]);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const newAttachment = await uploadAttachment(todoId, file);
      setAttachments([...attachments, newAttachment]);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Check Supabase config.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
    }
  };

  const handleDelete = async (attachId) => {
    try {
      await deleteAttachment(todoId, attachId);
      setAttachments(attachments.filter(a => a.id !== attachId));
    } catch (err) {
      setError('Failed to delete attachment');
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          📎 Attach file
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
        />
        {isUploading && <span className="text-sm text-gray-500 animate-pulse">Uploading...</span>}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {attachments.length > 0 && (
        <ul className="space-y-2">
          {attachments.map(att => (
            <li key={att.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-2 rounded border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 overflow-hidden">
                {att.mimeType.startsWith('image/') ? (
                  <img src={att.fileUrl} alt="preview" className="w-8 h-8 object-cover rounded" />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xs">📄</div>
                )}
                <div className="flex flex-col min-w-0">
                  <a 
                    href={att.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline truncate"
                  >
                    {att.fileName}
                  </a>
                  <span className="text-xs text-gray-500">{formatSize(att.fileSize)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(att.id)}
                className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                title="Delete attachment"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AttachmentUploader;

// ✅ DONE
