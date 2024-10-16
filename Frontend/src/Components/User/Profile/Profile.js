import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null); // State to hold user data
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [formData, setFormData] = useState({}); // State to hold form data
  const userId = JSON.parse(localStorage.getItem('user'))?.id; // Get user ID from local storage
  const navigate = useNavigate();
  
  useEffect(() => {
    // Fetch user data from the API when the component mounts
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/users/${userId}`);
        setUser(response.data);
        setFormData(response.data); // Initialize form data with fetched user data
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    //e.preventDefault();
    try {
      await axios.put(`http://localhost:4000/UpdateUser/${userId}`, formData);
      setUser(formData); // Update local user state
     // setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 mt-10">
      <h1 className="text-3xl font-bold text-center mb-6">User Profile</h1>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        {user ? (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-semibold">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className={`mt-2 w-full bg-gray-50 border ${isEditing ? 'border-gray-300' : 'border-transparent'} rounded-md shadow-sm p-3`}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-semibold">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={`mt-2 w-full bg-gray-50 border ${isEditing ? 'border-gray-300' : 'border-transparent'} rounded-md shadow-sm p-3`}
              />
            </div>

            {/* Province */}
            <div>
              <label className="block text-gray-700 font-semibold">Province:</label>
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleChange}
                disabled={!isEditing}
                className={`mt-2 w-full bg-gray-50 border ${isEditing ? 'border-gray-300' : 'border-transparent'} rounded-md shadow-sm p-3`}
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-gray-700 font-semibold">City:</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={!isEditing}
                className={`mt-2 w-full bg-gray-50 border ${isEditing ? 'border-gray-300' : 'border-transparent'} rounded-md shadow-sm p-3`}
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-gray-700 font-semibold">Mobile:</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                disabled={!isEditing}
                className={`mt-2 w-full bg-gray-50 border ${isEditing ? 'border-gray-300' : 'border-transparent'} rounded-md shadow-sm p-3`}
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold">Address:</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                className={`mt-2 w-full bg-gray-50 border ${isEditing ? 'border-gray-300' : 'border-transparent'} rounded-md shadow-sm p-3`}
              />
            </div>

            {/* Buttons */}
            <div className="md:col-span-2 flex justify-end space-x-4">
              {isEditing ? (
                <>
                  <button
                    type="submit"

                    className="p-3 bg-blue-600 text-white rounded-md hover:bg-blue-500"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="p-3 bg-red-600 text-white rounded-md hover:bg-red-500"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="p-3 bg-green-600 text-white rounded-md hover:bg-green-500"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
