import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { PRIORITY_DATA } from '../../utils/data';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { LuTrash2 } from 'react-icons/lu';
import { API_PATHS } from '../../utils/apiPaths';
import SelectUsers from '../../components/layouts/Inputs/SelectUsers';

/**
 * Task creation and update page component.
 * Handles both creating and editing tasks.
 */
export default function CreateTask() {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    dueDate: '',
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setTaskData(prev => ({ ...prev, [key]: value }));
  };

  const clearData = () => {
    setTaskData({
      title: '',
      description: '',
      priority: 'Low',
      dueDate: '',
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };

  const sanitizeTaskData = () => ({
    ...taskData,
    assignedTo: Array.isArray(taskData.assignedTo) ? taskData.assignedTo : [taskData.assignedTo],
    todoChecklist: taskData.todoChecklist.filter(item => item.text?.trim() !== ''),
    attachments: taskData.attachments || [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskData.title || !taskData.description) {
      toast.error('Please fill in required fields.');
      return;
    }
    const cleanedData = sanitizeTaskData();
    taskId ? await updateTask(cleanedData) : await createTask(cleanedData);
  };

  const createTask = async (data) => {
    setLoading(true);
    try {
      await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, data);
      toast.success('Task created successfully!');
      navigate('/tasks');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Task creation failed');
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (data) => {
    setLoading(true);
    try {
      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), data);
      toast.success('Task updated successfully!');
      navigate('/tasks');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Task update failed');
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async () => {
    setLoading(true);
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
      toast.success('Task deleted successfully!');
      navigate('/tasks');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Task deletion failed');
    } finally {
      setLoading(false);
    }
  };

  const getTaskDetailsById = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));
      const task = res.data;
      setTaskData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate ? moment(task.dueDate).format('YYYY-MM-DD') : '',
        assignedTo: task.assignedTo.map(user => user._id),
        todoChecklist: task.todoChecklist,
        attachments: task.attachments || [],
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load task data');
    }
  };

  const handleChecklistChange = (index, value) => {
    const updated = [...taskData.todoChecklist];
    updated[index].text = value;
    handleValueChange('todoChecklist', updated);
  };

  const handleChecklistRemove = (index) => {
    const updated = taskData.todoChecklist.filter((_, i) => i !== index);
    handleValueChange('todoChecklist', updated);
  };

  useEffect(() => {
    if (taskId) getTaskDetailsById();
  }, [taskId]);

  return (
    <DashboardLayout activeMenu="create-task">
      <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 rounded-xl shadow-xl mt-6 sm:mt-10">
        <h2 className="text-3xl font-semibold text-center text-gray-900">
          {taskId ? 'Update Task' : 'Create Task'}
        </h2>
        <br />
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Task Info Section */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Task Information</h3>
            <div className="space-y-6">
              <InputField
                label="Task Title"
                value={taskData.title}
                onChange={(e) => handleValueChange('title', e.target.value)}
                required
                placeholder="Enter task title"
              />
              <TextAreaField
                label="Description"
                value={taskData.description}
                onChange={(e) => handleValueChange('description', e.target.value)}
                required
                placeholder="Enter task description"
              />
            </div>
          </div>

          {/* Task Settings Section */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Task Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <SelectField
                label="Priority"
                value={taskData.priority}
                onChange={(e) => handleValueChange('priority', e.target.value)}
                options={PRIORITY_DATA}
              />
              <InputField
                type="date"
                label="Due Date"
                value={taskData.dueDate}
                onChange={(e) => handleValueChange('dueDate', e.target.value)}
              />
            </div>

            {/* Assign To Users Section */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">Assign To</label>
              <div className="border border-gray-300 rounded-lg shadow-sm p-3 hover:shadow-md transition cursor-pointer bg-white">
                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(users) => handleValueChange('assignedTo', users)}
                />
              </div>
            </div>
          </div>

          {/* Attachments Section */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Attachments</h3>
            <InputField
              label="Attachments"
              value={taskData.attachments.join(',')}
              onChange={(e) =>
                handleValueChange('attachments', e.target.value.split(',').map(i => i.trim()))
              }
              placeholder="Enter comma-separated URLs"
            />
          </div>

          {/* Checklist Section */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-4">TODO Checklist</h3>
            <div className="space-y-3">
              {taskData.todoChecklist.map((item, idx) => (
                <ChecklistItem
                  key={item.id || idx}
                  value={item.text || ''}
                  onChange={(e) => handleChecklistChange(idx, e.target.value)}
                  onRemove={() => handleChecklistRemove(idx)}
                />
              ))}
              <button
                type="button"
                onClick={() =>
                  handleValueChange('todoChecklist', [...taskData.todoChecklist, { id: Date.now(), text: '', completed: false }])
                }
                className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Task
              </button>
            </div>
          </div>

          {/* Buttons Section */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-3">
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Processing...' : taskId ? 'Update Task' : 'Create Task'}
              </Button>
              <Button
                type="button"
                onClick={clearData}
                color="gray"
              >
                Clear
              </Button>
            </div>
            {taskId && (
              <Button
                type="button"
                onClick={() => setOpenDeleteAlert(true)}
                color="red"
              >
                Delete Task
              </Button>
            )}
          </div>

          {/* Delete Alert */}
          {openDeleteAlert && (
            <DeleteAlert
              onConfirm={deleteTask}
              onCancel={() => setOpenDeleteAlert(false)}
            />
          )}
        </form>
      </div>
    </DashboardLayout>
  );
}

// Reusable Input Field Component
const InputField = ({ label, type = 'text', value, onChange, required, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full border border-gray-300 px-5 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      placeholder={placeholder}
    />
  </div>
);

// Reusable Text Area Component
const TextAreaField = ({ label, value, onChange, required, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <textarea
      rows={4}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full border border-gray-300 px-5 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
      placeholder={placeholder}
    />
  </div>
);

// Reusable Select Field Component
const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 px-5 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
    >
      {options.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
    </select>
  </div>
);

// Reusable Checklist Item Component
const ChecklistItem = ({ value, onChange, onRemove }) => (
  <div className="flex items-center gap-3">
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="flex-grow border border-gray-300 px-5 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      placeholder="Enter checklist item"
    />
    <button type="button" onClick={onRemove} className="p-3 text-gray-500 hover:text-red-500 transition-all">
      <LuTrash2 className="w-6 h-6" />
    </button>
  </div>
);

// Reusable Delete Alert Component
const DeleteAlert = ({ onConfirm, onCancel }) => (
  <div className="mt-6 p-6 bg-red-100 border border-red-300 rounded-xl">
    <p className="text-red-800 font-medium mb-4">Are you sure you want to delete this task?</p>
    <div className="flex gap-4 flex-wrap">
      <button onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium text-sm">
        Yes, Delete
      </button>
      <button onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium text-sm">
        Cancel
      </button>
    </div>
  </div>
);

// Button Component for reusable button styles
const Button = ({ children, type = 'button', color = 'blue', ...props }) => (
  <button
    type={type}
    {...props}
    className={`px-6 py-3 rounded-lg font-semibold shadow-md transition-all text-sm sm:text-base ${
      color === 'blue' ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white' : ''
    } ${color === 'gray' ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' : ''} ${color === 'red' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}`}
  >
    {children}
  </button>
);
