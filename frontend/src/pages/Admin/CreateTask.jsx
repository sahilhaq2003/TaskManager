import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { PRIORITY_DATA } from "../../utils/data";
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { LuTrash2 } from 'react-icons/lu';
import { API_PATHS } from '../../utils/apiPaths';

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
    setTaskData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: "",
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };

  const createTask = async () => {
    setLoading(true);
    try {
      await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, taskData);
      toast.success("Task created successfully!");
      navigate("/tasks");
    } catch (error) {
      toast.error(error.response?.data?.message || "Task creation failed");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async () => {
    setLoading(true);
    try {
      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), taskData);
      toast.success("Task updated successfully!");
      navigate("/tasks");
    } catch (error) {
      toast.error(error.response?.data?.message || "Task update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskData.title || !taskData.description) {
      toast.error("Please fill in required fields.");
      return;
    }

    taskId ? await updateTask() : await createTask();
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

  useEffect(() => {
    if (taskId) {
      getTaskDetailsById();
    }
  }, [taskId]);

  return (
    <DashboardLayout activeMenu="create-task">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-10 transition-all">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {taskId ? 'Update Task' : 'Create Task'}
          </h2>

          {taskId && (
            <button
              onClick={() => setOpenDeleteAlert(true)}
              className="flex items-center gap-2 mt-4 sm:mt-0 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-sm transition"
            >
              <LuTrash2 size={18} />
              Delete Task
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter task title"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              value={taskData.title}
              onChange={({ target }) => handleValueChange('title', target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Enter task description"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base resize-none"
              value={taskData.description}
              onChange={({ target }) => handleValueChange('description', target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Priority</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                value={taskData.priority}
                onChange={({ target }) => handleValueChange('priority', target.value)}
              >
                {PRIORITY_DATA.map(({ label, value }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Due Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                value={taskData.dueDate}
                onChange={({ target }) => handleValueChange('dueDate', target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Checklist</label>
            {taskData.todoChecklist.length === 0 && (
              <p className="text-gray-500 italic mb-3">No checklist items added.</p>
            )}
            <div className="space-y-3">
              {taskData.todoChecklist.map((item, idx) => (
                <div key={item.id || idx} className="flex items-center gap-3">
                  <input
                    type="text"
                    className="flex-grow border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={item.text || ''}
                    onChange={({ target }) => {
                      const newChecklist = [...taskData.todoChecklist];
                      newChecklist[idx].text = target.value;
                      handleValueChange('todoChecklist', newChecklist);
                    }}
                    placeholder="Checklist item"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newChecklist = taskData.todoChecklist.filter((_, i) => i !== idx);
                      handleValueChange('todoChecklist', newChecklist);
                    }}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <LuTrash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                handleValueChange('todoChecklist', [
                  ...taskData.todoChecklist,
                  { id: Date.now(), text: '', completed: false },
                ]);
              }}
              className="mt-4 inline-block text-blue-600 hover:underline text-sm"
            >
              + Add Checklist Item
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-3 rounded-lg shadow-md text-sm sm:text-base transition"
            >
              {loading ? (taskId ? 'Updating...' : 'Creating...') : (taskId ? 'Update Task' : 'Create Task')}
            </button>

            <button
              type="button"
              onClick={clearData}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg text-sm sm:text-base transition"
            >
              Clear
            </button>
          </div>

          {openDeleteAlert && (
            <div className="mt-8 p-5 bg-red-50 border border-red-200 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <p className="text-red-700 font-medium mb-4 sm:mb-0">Are you sure you want to delete this task?</p>
              <div className="flex gap-3">
                <button
                  onClick={deleteTask}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setOpenDeleteAlert(false)}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-sm"
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
