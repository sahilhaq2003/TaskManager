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
      {/* Assigned users display */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedUsers.map((id) => {
          const user = getUserInfo(id);
          return (
            <div
              key={id}
              className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm space-x-1"
            >
              <img
                src={user.avatar || 'https://via.placeholder.com/24'}
                alt={user.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span>{user.name || 'Unknown'}</span>
              <button
                type="button"
                onClick={() => removeUser(id)}
                className="ml-1 text-blue-600 hover:text-blue-900 font-bold"
                aria-label={`Remove ${user.name}`}
              >
                &times;
              </button>
            </div>
          );
        })}
      </div>

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => {
          setTempSelected(selectedUsers);
          setOpen(true);
        }}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {selectedUsers.length === 0 ? 'Assign Users' : 'Edit Assigned Users'}
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 mx-4 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Select Users</h2>

            {loading ? (
              <p className="text-gray-500">Loading users...</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4 max-h-80 overflow-y-auto">
                {users.map((user) => (
                  <label
                    key={user._id}
                    className="flex items-center gap-3 p-2 border rounded-lg hover:bg-blue-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={tempSelected.includes(user._id)}
                      onChange={() => toggleUser(user._id)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <img
                      src={user.avatar || 'https://via.placeholder.com/40'}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmSelection}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
              >
                Assign Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SelectUsers;
