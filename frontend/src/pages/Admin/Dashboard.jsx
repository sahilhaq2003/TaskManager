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

const Dashboard = () => {
  useUserAuth();

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD_TASKS);
        if (response.data) {
          setDashboardData(response.data);
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
      <main className="mx-auto p-6 sm:p-8 space-y-12" style={{ maxWidth: '960px' }}>

        {/* Greeting Section */}
        <section className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl shadow-md p-5 sm:p-6 space-y-5">
          <div>
            <h1 className="text-gray-800 font-semibold leading-tight"
              style={{ fontSize: 'clamp(1.125rem, 2vw, 1.75rem)' }}>
              Good Morning, {user?.name || 'User'}!
            </h1>
            <p className="text-gray-600 mt-1" style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)' }}>
              {moment().format('dddd, MMMM Do YYYY')}
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 w-full">
            <InfoCard
              icon={<IoMdCard className="text-white" />}
              label="Total Tasks"
              value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.All || 0)}
              color="blue"
            />
            <InfoCard
              icon={<IoMdCard className="text-white" />}
              label="Pending Tasks"
              value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.Pending || 0)}
              color="red"
            />
            <InfoCard
              icon={<IoMdCard className="text-white" />}
              label="In Progress Tasks"
              value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.InProgress || 0)}
              color="yellow"
            />
            <InfoCard
              icon={<IoMdCard className="text-white" />}
              label="Completed Tasks"
              value={addThousandsSeparator(dashboardData?.charts?.taskDistribution?.Completed || 0)}
              color="green"
            />
          </div>
        </section>

        {/* Recent Tasks Section */}
        <section className="bg-white rounded-2xl shadow-md p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
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
