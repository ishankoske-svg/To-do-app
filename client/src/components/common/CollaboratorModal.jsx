// d:\projects\personal-projects\to-do-list\client\src\components\common\CollaboratorModal.jsx
import React, { useState, useEffect } from 'react';
import { inviteCollaborator, getCollaborators, removeCollaborator } from '../../api/collaboration.api';
import Spinner from './Spinner';

const CollaboratorModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchCollabs = async () => {
      try {
        const data = await getCollaborators();
        setCollaborators(data);
      } catch (err) {
        setError('Failed to load collaborators');
      } finally {
        setLoading(false);
      }
    };
    fetchCollabs();
  }, []);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setInviteLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = await inviteCollaborator(email);
      setCollaborators([...collaborators, data]);
      setSuccess(`Invited ${email} successfully!`);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to invite user');
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRemove = async (memberId) => {
    try {
      await removeCollaborator(memberId);
      setCollaborators(collaborators.filter(c => c.memberId !== memberId));
    } catch (err) {
      setError('Failed to remove collaborator');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Share List</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">✕</button>
        </div>

        <div className="p-4 space-y-4">
          <form onSubmit={handleInvite} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Friend's email address"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-700 dark:text-gray-200"
            />
            <button
              type="submit"
              disabled={!email.trim() || inviteLoading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {inviteLoading ? 'Sending...' : 'Invite'}
            </button>
          </form>

          {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</p>}
          {success && <p className="text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded">{success}</p>}

          <div>
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Current Collaborators</h3>
            {loading ? (
              <div className="flex justify-center p-4"><Spinner /></div>
            ) : collaborators.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                Your list is private.
              </p>
            ) : (
              <ul className="space-y-2">
                {collaborators.map(c => (
                  <li key={c.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{c.member?.name || c.member?.email}</span>
                      <span className="text-xs text-gray-500 truncate">{c.member?.email}</span>
                    </div>
                    <button
                      onClick={() => handleRemove(c.memberId)}
                      className="text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 px-2 py-1 rounded transition-colors"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaboratorModal;

// ✅ DONE
