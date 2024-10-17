import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Adminuser = () => {
  const [users, setUsers] = useState([]); // State to hold all users' data

  useEffect(() => {
    // Fetch all users data from the API when the component mounts
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/Adminusers'); // Update to your actual API route
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users data:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto px-4 mt-10">
      <h1 className="text-3xl font-bold text-center mb-6">All Users</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
              <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
              <p className="text-gray-700"><strong>Province:</strong> {user.province}</p>
              <p className="text-gray-700"><strong>City:</strong> {user.city}</p>
              <p className="text-gray-700"><strong>Mobile:</strong> {user.mobile}</p>
              <p className="text-gray-700"><strong>Address:</strong> {user.address}</p>
              <p className="text-gray-700"><strong>Register on:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>

            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Adminuser;
