import React from 'react';
import moment from 'moment';

const TaskListTable = ({ tableData }) => {
  if (!tableData.length) {
    return (
      <div className="text-gray-500 text-center py-8 select-none">
        No recent tasks available.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
      <table className="min-w-full text-sm text-gray-800">
        <thead>
          <tr>
            <th className="text-left px-5 py-4 font-semibold text-gray-600 uppercase tracking-wide text-xs">
              Task Name
            </th>
            <th className="text-left px-5 py-4 font-semibold text-gray-600 uppercase tracking-wide text-xs">
              Status
            </th>
            <th className="text-left px-5 py-4 font-semibold text-gray-600 uppercase tracking-wide text-xs">
              Due Date
            </th>
          </tr>
        </thead>

        <tbody>
          {tableData.map((task) => (
            <tr
              key={task.id}
              className="hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <td className="px-5 py-4 font-medium truncate">{task.title}</td>
              <td className="px-5 py-4">
                <span
                  className={`
                    inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold
                    ${
                      task.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                      task.status === 'Pending' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }
                  `}
                >
                  {task.status}
                </span>
              </td>
              <td className="px-5 py-4 text-gray-500 text-sm">
                {moment(task.dueDate).format('MMMM D, YYYY')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskListTable;
