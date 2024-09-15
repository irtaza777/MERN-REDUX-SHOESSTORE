// src/adminpanel/OtherAdminComponent.js

import React from 'react';
import { useSelector } from 'react-redux';

const AdminDashboard = () => {
  // Get admin's name from Redux store
  const admin = useSelector((state) => state.admin.admin);

  return (
    <div className="p-8 max-w-6xl mx-auto bg-gray-100 shadow-lg rounded-lg">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {admin.name}!</h1>

      <p className="mb-8 text-lg text-gray-700">
        This admin panel provides a comprehensive set of tools to manage your application efficiently. 
        Here are some of the key features:
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Categories Box */}
        <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:scale-105">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <p>Manage your categories here.</p>
        </div>

        {/* Projects Box */}
        <div className="bg-green-600 text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:scale-105">
          <h2 className="text-xl font-semibold mb-4">Projects</h2>
          <p>View and manage projects.</p>
        </div>

        {/* Users Box */}
        <div className="bg-red-600 text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:scale-105">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <p>Manage users and permissions.</p>
        </div>

        {/* Reports Box */}
        <div className="bg-yellow-600 text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:scale-105">
          <h2 className="text-xl font-semibold mb-4">Reports</h2>
          <p>View performance reports.</p>
        </div>

        {/* Settings Box */}
        <div className="bg-purple-600 text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:scale-105">
          <h2 className="text-xl font-semibold mb-4">Settings</h2>
          <p>Adjust your dashboard settings.</p>
        </div>
        
        {/* Analytics Box */}
        <div className="bg-teal-600 text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:scale-105">
          <h2 className="text-xl font-semibold mb-4">Analytics</h2>
          <p>Check your analytics data.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
