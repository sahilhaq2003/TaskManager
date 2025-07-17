import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../hooks/useUserAuth';
import { UserContext } from '../../context/userContext';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import moment from 'moment';
import { IoMdCard } from 'react-icons/io';
import { LuArrowRight } from 'react-icons/lu';
import InfoCard from '../../components/Cards/InfoCard';
import TaskListTable from '../../components/TaskListTable';
import { addThousandsSeparator } from '../../utils/helper';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#FF8042', '#FFD700', '#0088FE'];
const PRIORITY_COLORS = ['#82ca9d', '#8884d8', '#ffbb28'];

const Dashboard = () => {
  useUserAuth();

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [chartsData, setChartsData] = useState({
    taskDistribution: {},
    taskPriorityLevels: {},
  });
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  const prepareChartData = (data) => {
    const taskDistribution = data?.charts?.taskDistribution || {};
    const taskPriorityLevels = data?.charts?.taskPriorityLevels || {};

    const preparedPieData = [
      { name: 'Pending', value: taskDistribution.Pending || 0 },
      { name: 'In Progress', value: taskDistribution.InProgress || 0 },
      { name: 'Completed', value: taskDistribution.Completed || 0 },
    ];

    const preparedBarData = [
      { name: 'Low', value: taskPriorityLevels.Low || 0 },
      { name: 'Medium', value: taskPriorityLevels.Medium || 0 },
      { name: 'High', value: taskPriorityLevels.High || 0 },
    ];

    return {
      taskDistribution,
      taskPriorityLevels,
      pieChartData: preparedPieData,
      barChartData: preparedBarData,
    };
  };

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD_TASKS);
        if (response.data) {
          setDashboardData(response.data);

          const preparedData = prepareChartData(response.data);
          setChartsData({
            taskDistribution: preparedData.taskDistribution,
            taskPriorityLevels: preparedData.taskPriorityLevels,
          });
          setPieChartData(preparedData.pieChartData);
          setBarChartData(preparedData.barChartData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    getDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout activeMenu="dashboard">
        <div className="flex items-center justify-center h-64 text-gray-500 text-lg select-none">
          Loading dashboard data...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="dashboard">
      <main className="mx-auto px-4 sm:px-6 lg:px-8 space-y-12 max-w-7xl">
        {/* Greeting Section */}
        <section
          className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl shadow-md p-6 sm:p-8 space-y-6"
          aria-label="Greeting and task summary"
        >
          <div>
            <h1
              className="text-gray-800 font-semibold leading-tight"
              style={{ fontSize: 'clamp(1rem, 2vw, 1.75rem)' }}
            >
              Good Morning, {user?.name || 'User'}!
            </h1>
            <p
              className="text-gray-600 mt-2"
              style={{ fontSize: 'clamp(0.8rem, 1.3vw, 1.125rem)' }}
            >
              {moment().format('dddd, MMMM Do YYYY')}
            </p>
          </div>

          {/* Info Cards */}
          <div
            className="
              flex flex-wrap justify-center gap-4
              px-2 sm:px-4
              max-w-full
            "
            style={{ overflowWrap: 'break-word' }}
          >
            <InfoCard
              icon={<IoMdCard className="text-white" size={20} />}
              label="Total Tasks"
              value={addThousandsSeparator(chartsData.taskDistribution?.All || 0)}
              color="blue"
              className="flex-grow min-w-[160px] max-w-[220px]"
            />
            <InfoCard
              icon={<IoMdCard className="text-white" size={20} />}
              label="Pending Tasks"
              value={addThousandsSeparator(chartsData.taskDistribution?.Pending || 0)}
              color="red"
              className="flex-grow min-w-[160px] max-w-[220px]"
            />
            <InfoCard
              icon={<IoMdCard className="text-white" size={20} />}
              label="In Progress Tasks"
              value={addThousandsSeparator(chartsData.taskDistribution?.InProgress || 0)}
              color="yellow"
              className="flex-grow min-w-[160px] max-w-[220px]"
            />
            <InfoCard
              icon={<IoMdCard className="text-white" size={20} />}
              label="Completed Tasks"
              value={addThousandsSeparator(chartsData.taskDistribution?.Completed || 0)}
              color="green"
              className="flex-grow min-w-[160px] max-w-[220px]"
            />
          </div>
        </section>

        {/* Charts Section */}
        <section className="flex flex-col md:flex-row md:space-x-8 space-y-10 md:space-y-0">
          {/* Pie Chart */}
          <div className="flex-1 bg-white rounded-2xl shadow-md p-5 min-w-[320px] max-w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 text-center md:text-left">
              Task Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="flex-1 bg-white rounded-2xl shadow-md p-5 min-w-[320px] max-w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 text-center md:text-left">
              Task Priority Levels
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barChartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <ReTooltip />
                <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]}>
                  {barChartData.map((entry, index) => (
                    <Cell
                      key={`bar-cell-${index}`}
                      fill={PRIORITY_COLORS[index % PRIORITY_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Recent Tasks Section */}
        <section className="bg-white rounded-2xl shadow-md p-5 sm:p-6 space-y-5 overflow-x-auto">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 whitespace-nowrap">
              Recent Tasks
            </h2>
            <button
              onClick={() => navigate('/admin/tasks')}
              className="flex items-center text-sm sm:text-base text-blue-600 hover:text-blue-800 transition-colors font-medium"
            >
              See All <LuArrowRight className="ml-1 text-base" />
            </button>
          </div>

          <TaskListTable tableData={dashboardData?.recentTasks || []} />
        </section>
      </main>
    </DashboardLayout>
  );
};

export default Dashboard;
