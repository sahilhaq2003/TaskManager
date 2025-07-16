import React from 'react';
import UI_IMG from '../../assets/images/auth-img.png';

const AuthLayout = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen overflow-y-auto bg-gray-50">
      {/* Left section (form) */}
      <div className="w-full md:w-[60%] px-6 sm:px-10 py-8 bg-white flex flex-col">
        <h2 className="text-lg font-semibold text-black mb-4">Task Manager</h2>
        <div className="flex-grow">{children}</div>
      </div>

      {/* Right section (image) */}
      <div
        className="hidden md:flex md:w-[40%] h-[300px] md:h-auto bg-cover bg-center"
        style={{ backgroundImage: `url(${UI_IMG})` }}
      >
        {/* Optional overlay or content here */}
      </div>
    </div>
  );
};

export default AuthLayout;
