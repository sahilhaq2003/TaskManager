import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { PRIORITY_DATA } from "../../utils/data";
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { LuTrash2 } from 'react-icons/lu';
import { API_PATHS } from '../../utils/apiPaths';
import SelectUsers from '../../components/layouts/Inputs/SelectUsers';

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
    setTaskData(prevData => ({ ...prevData, [key]: value }));
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
      toast.error("Please fill in required fields.");
      return;
    }
    const cleanedData = sanitizeTaskData();
    taskId ? await updateTask(cleanedData) : await createTask(cleanedData);
  };

  const createTask = async (data) => {
    setLoading(true);
    try {
      await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, data);
      toast.success("Task created successfully!");
      navigate("/tasks");
    } catch (error) {
      toast.error(error.response?.data?.message || "Task creation failed");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (data) => {
    setLoading(true);
    try {
      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), data);
      toast.success("Task updated successfully!");
      navigate("/tasks");
    } catch (error) {
      toast.error(error.response?.data?.message || "Task update failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async () => {
    setLoading(true);
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
      toast.success("Task deleted successfully!");
      navigate("/tasks");
    } catch (error) {
      toast.error(error.response?.data?.message || "Task deletion failed");
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
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load task data");
    }
  };

  useEffect(() => {
    if (taskId) getTaskDetailsById();
  }, [taskId]);

  const handleChecklistChange = (index, value) => {
    const updated = [...taskData.todoChecklist];
    updated[index].text = value;
    handleValueChange('todoChecklist', updated);
  };

  const handleChecklistRemove = (index) => {
    const updated = taskData.todoChecklist.filter((_, i) => i !== index);
    handleValueChange('todoChecklist', updated);
  };

  return (
    <DashboardLayout activeMenu="create-task">
      <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-white rounded-xl shadow-md mt-6 sm:mt-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
          {taskId ? 'Update Task' : 'Create Task'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
            <input
              type="text"
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter task title"
              value={taskData.title}
              onChange={(e) => handleValueChange('title', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={4}
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
              placeholder="Enter task description"
              value={taskData.description}
              onChange={(e) => handleValueChange('description', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={taskData.priority}
                onChange={(e) => handleValueChange('priority', e.target.value)}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                {PRIORITY_DATA.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={taskData.dueDate}
                onChange={(e) => handleValueChange('dueDate', e.target.value)}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
            <SelectUsers
              selectedUsers={taskData.assignedTo}
              setSelectedUsers={(users) => handleValueChange('assignedTo', users)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
            <input
              type="text"
              placeholder="Enter comma-separated URLs"
              value={taskData.attachments.join(',')}
              onChange={(e) =>
                handleValueChange('attachments', e.target.value.split(',').map(i => i.trim()))
              }
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Checklist</label>
            <div className="space-y-3">
              {taskData.todoChecklist.map((item, idx) => (
                <div key={item.id || idx} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={item.text || ''}
                    onChange={(e) => handleChecklistChange(idx, e.target.value)}
                    className="flex-grow border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Enter checklist item"
                  />
                  <button 
                    type="button" 
                    onClick={() => handleChecklistRemove(idx)}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <LuTrash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  handleValueChange('todoChecklist', [...taskData.todoChecklist, { id: Date.now(), text: '', completed: false }])
                }
                className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Item
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg shadow-sm font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex-1 sm:flex-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  taskId ? 'Update Task' : 'Create Task'
                )}
              </button>

              <button
                type="button"
                onClick={clearData}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-medium transition-colors flex-1 sm:flex-none"
              >
                Clear
              </button>
            </div>

            {taskId && (
              <button
                type="button"
                onClick={() => setOpenDeleteAlert(true)}
                className="bg-red-50 hover:bg-red-100 text-red-600 px-6 py-2.5 rounded-lg font-medium transition-colors flex-1 sm:flex-none"
              >
                Delete Task
              </button>
            )}
          </div>

          {openDeleteAlert && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium mb-3">Are you sure you want to delete this task?</p>
              <div className="flex gap-3">
                <button
                  onClick={deleteTask}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setOpenDeleteAlert(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </DashboardLayout>
  );
}