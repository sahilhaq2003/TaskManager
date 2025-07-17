// src/components/layouts/DashboardLayout.jsx
import React, { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import Navbar from './Navbar';
import SlideMenu from './SlideMenu';

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top navigation */}
      <Navbar activeMenu={activeMenu} />

      <div className="flex flex-1">
        {/* Sidebar */}
        {user && (
          <div className="w-64 bg-white shadow-md hidden md:block">
            <SlideMenu activeMenu={activeMenu} />
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
