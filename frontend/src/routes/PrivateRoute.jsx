import React from 'react'
import { Outlet } from 'react-router-dom'

const PrivateRoute = ({allowedRoles}) => {
  return<Outlet/>
}

export default PrivateRoute




/*
import React from 'react';

const Unauthorized = () => {
  return (
    <div className="text-center p-5">
      <h1>🚫 Unauthorized</h1>
      <p>You do not have permission to view this page.</p>
    </div>
  );
};

export default Unauthorized;
*/