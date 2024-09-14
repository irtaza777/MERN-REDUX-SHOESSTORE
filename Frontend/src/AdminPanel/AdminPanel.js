// src/adminpanel/AdminPanel.js

import React from 'react';
import AdminNavbar from './AdminNavbar';
import { Outlet } from 'react-router-dom';

const AdminPanel = () => {
  return (
    <div>
      <AdminNavbar />
      <div className="container mx-auto p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPanel;
