import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import { toast } from 'react-toastify';

const SelectUsers = ({ selectedUsers, setSelectedUsers }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [tempSelected, setTempSelected] = useState([...selectedUsers]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get('/api/users');
        setUsers(res.data || []);
      } catch {
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const toggleUser = (userId) => {
    setTempSelected((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const confirmSelection = () => {
    setSelectedUsers(tempSelected);
    setOpen(false);
  };

  const removeUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    setTempSelected(tempSelected.filter((id) => id !== userId));
  };

  const getUserInfo = (id) => users.find((u) => u._id === id) || {};

  return (
    <>
      {/* Selected Users Display */}
      <div className="flex flex-wrap gap-3 mb-4">
        {selectedUsers.length === 0 && (
          <span className="text-gray-500 italic text-sm">No users assigned</span>
        )}
        {selectedUsers.map((id) => {
          const user = getUserInfo(id);
          return (
            <div
              key={id}
              className="flex items-center bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-sm font-semibold shadow-sm select-none"
            >
              <img
                src={user.avatar || 'https://via.placeholder.com/24'}
                alt={user.name}
                className="w-6 h-6 rounded-full object-cover border border-blue-300"
                loading="lazy"
              />
              <span className="mx-2">{user.name || 'Unknown'}</span>
              <button
                type="button"
                onClick={() => removeUser(id)}
                className="flex items-center justify-center w-5 h-5 text-blue-700 hover:text-blue-900 rounded-full transition"
                aria-label={`Remove ${user.name}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setTempSelected(selectedUsers);
          setOpen(true);
        }}
        className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        {selectedUsers.length === 0 ? 'Assign Users' : 'Edit Assigned Users'}
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
          aria-modal="true"
          role="dialog"
          aria-labelledby="select-users-title"
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2
                id="select-users-title"
                className="text-xl font-semibold text-gray-900"
              >
                Select Users
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
                aria-label="Close user selection modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </header>

            <main className="flex-1 overflow-y-auto px-6 py-4">
              {loading ? (
                <p className="text-gray-500 text-center">Loading users...</p>
              ) : users.length === 0 ? (
                <p className="text-gray-500 text-center">No users available.</p>
              ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
                  {users.map((user) => (
                    <li
                      key={user._id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-300 hover:bg-blue-50 cursor-pointer select-none transition-all"
                      onClick={() => toggleUser(user._id)}
                      role="checkbox"
                      aria-checked={tempSelected.includes(user._id)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault();
                          toggleUser(user._id);
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={tempSelected.includes(user._id)}
                        onChange={() => toggleUser(user._id)}
                        className="hidden"
                        tabIndex={-1}
                        aria-hidden="true"
                      />
                      <img
                        src={user.avatar || 'https://via.placeholder.com/40'}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-300"
                        loading="lazy"
                      />
                      <div className="flex flex-col flex-grow">
                        <span className="font-medium text-gray-900">{user.name}</span>
                        <span className="text-xs text-gray-500 truncate">{user.email}</span>
                      </div>
                      {tempSelected.includes(user._id) && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </main>

            {/* Action buttons */}
            <footer className="px-6 py-4 border-t border-gray-200 flex justify-end gap-4">
              <button
                onClick={() => setOpen(false)}
                className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmSelection}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Assign Selected
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
};

export default SelectUsers;
