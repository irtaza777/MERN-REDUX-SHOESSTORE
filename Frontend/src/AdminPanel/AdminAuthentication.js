import React, { useState } from 'react'; // Import React and useState hook for state management
import axios from 'axios'; // Import axios for making HTTP requests
import { useDispatch, useSelector } from 'react-redux'; // Import useDispatch and useSelector for Redux
import { setAdmin } from '../Store/adminslice'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';

const AdminAuthentication = () => {
  // States for registration form
  const [registerFormData, setRegisterFormData] = useState({
    name: '', // State to hold the admin's name
    email: '', // State to hold the admin's email
    password: '', // State to hold the admin's password
  });
  const [registerMessage, setRegisterMessage] = useState(''); // State to hold messages related to registration
  const [registerLoading, setRegisterLoading] = useState(false); // State to manage loading state during registration

  // States for login form
  const [loginFormData, setLoginFormData] = useState({
    email: '', // State to hold the email for login
    password: '', // State to hold the password for login
  });
  const [loginMessage, setLoginMessage] = useState(''); // State to hold messages related to login
  const [loginLoading, setLoginLoading] = useState(false); // State to manage loading state during login

  const dispatch = useDispatch(); // Initialize dispatch from Redux
  const navigate = useNavigate(); // Initialize navigate for navigation

  // Handle change for both forms
  const handleChange = (e, formType) => {
    const { name, value } = e.target; // Destructure the event target to get name and value
    formType === 'register'
      ? setRegisterFormData({ ...registerFormData, [name]: value }) // Update registration form data
      : setLoginFormData({ ...loginFormData, [name]: value }); // Update login form data
  };

  // Handle registration submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    setRegisterLoading(true); // Set loading state to true
    setRegisterMessage(''); // Clear any previous messages

    try {
      // Send POST request to the registration endpoint
      const response = await axios.post('http://localhost:4000/admin/create', registerFormData);

      if (response.status === 201) {
        setRegisterMessage('Admin registered successfully. Now login yourself.'); // Success message
        setRegisterFormData({ // Reset the form fields after successful registration
          name: '',
          email: '',
          password: '',
        });
      } else {
        setRegisterMessage('Error registering admin. Please try again.'); // Error message for non-201 status
      }
    } catch (error) {
      console.error('Error during admin registration:', error); // Log error for debugging
      if (error.response && error.response.status === 409) {
        setRegisterMessage('This email is already registered. Please use a different email.'); // Specific error message for duplicate email
      } else {
        setRegisterMessage('Internal server error. Please try again later.'); // Display generic error message
      }
    } finally {
      setRegisterLoading(false); // Set loading state back to false
    }
  };

  // Handle login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    setLoginLoading(true); // Set loading state to true
    setLoginMessage(''); // Clear any previous messages
  
    try {
      // Send POST request to the login endpoint
      const response = await axios.post('http://localhost:4000/admin/login', loginFormData, {
        headers: {
          'Content-Type': 'application/json', // Set content type for the request
        },
      });
      
      // Check if the request was successful (200 OK)
      if (response.status === 200) {
        const { token, admin } = response.data; // Destructure the token and admin from the response
  
        setLoginMessage('Login successful!'); // Success message
        localStorage.setItem('admin', JSON.stringify(admin)); // Store admin data in localStorage
        localStorage.setItem('token', token); // Store token in localStorage
        dispatch(setAdmin(admin)); // Dispatch action to set admin in Redux store
        navigate('/adminpanel/dashboard'); // Navigate to the dashboard
      }
    } catch (error) {
      // Check if error is due to invalid credentials (401 status)
      if (error.response && error.response.status === 401) {
        setLoginMessage(error.response.data.error); // Display specific error message from backend
      } 
      // Handle internal server error (500 status)
      else if (error.response && error.response.status === 500) {
        setLoginMessage('Internal server error. Please try again later.');
      } 
      // Handle other possible errors
      else {
        setLoginMessage('An unknown error occurred. Please try again.');
      }
      console.error('Error during login:', error); // Log error for debugging
    } finally {
      setLoginLoading(false); // Set loading state back to false
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        {/* Registration Form */}
        <div className="w-1/2 pr-4 border-r">
          <h2 className="text-2xl font-bold mb-6">Admin Registration</h2>
          {registerMessage && <div className="mb-4 text-center text-red-500">{registerMessage}</div>} {/* Display registration message */}
          <form onSubmit={handleRegisterSubmit}> {/* Registration form submission handler */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="registerName">
                Name
              </label>
              <input
                id="registerName"
                type="text"
                name="name"
                value={registerFormData.name} // Bind input value to state
                onChange={(e) => handleChange(e, 'register')} // Handle change for registration
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="registerEmail">
                Email
              </label>
              <input
                id="registerEmail"
                type="email"
                name="email"
                value={registerFormData.email} // Bind input value to state
                onChange={(e) => handleChange(e, 'register')} // Handle change for registration
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="registerPassword">
                Password
              </label>
              <input
                id="registerPassword"
                type="password"
                name="password"
                value={registerFormData.password} // Bind input value to state
                onChange={(e) => handleChange(e, 'register')} // Handle change for registration
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              disabled={registerLoading} // Disable button while loading
              className={`w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ${registerLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {registerLoading ? 'Registering...' : 'Register'} {/* Conditional button text based on loading state */}
            </button>
          </form>
        </div>

        {/* Login Form */}
        <div className="w-1/2 pl-4">
          <h2 className="text-2xl font-bold mb-6">Admin Login</h2>
          {loginMessage && <div className="mb-4 text-center text-red-500">{loginMessage}</div>} {/* Display login message */}
          <form onSubmit={handleLoginSubmit}> {/* Login form submission handler */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="loginEmail">
                Email
              </label>
              <input
                id="loginEmail"
                type="email"
                name="email"
                value={loginFormData.email} // Bind input value to state
                onChange={(e) => handleChange(e, 'login')} // Handle change for login
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="loginPassword">
                Password
              </label>
              <input
                id="loginPassword"
                type="password"
                name="password"
                value={loginFormData.password} // Bind input value to state
                onChange={(e) => handleChange(e, 'login')} // Handle change for login
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              disabled={loginLoading} // Disable button while loading
              className={`w-full bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ${loginLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loginLoading ? 'Logging in...' : 'Login'} {/* Conditional button text based on loading state */}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAuthentication; // Export the component for use in other parts of the application
