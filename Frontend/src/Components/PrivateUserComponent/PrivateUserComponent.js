import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateUserComponent = () => {
  const isAuthenticated = !!localStorage.getItem('user'); // Check if user is logged in

  return isAuthenticated ? <Outlet /> : <Navigate to="/UserAuthentication" />;
};

export default PrivateUserComponent;
