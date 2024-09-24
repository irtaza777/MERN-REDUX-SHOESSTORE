import React, { useState } from 'react'; // Import React and useState hook for state management
import axios from 'axios'; // Import axios for making HTTP requests
import { useDispatch } from 'react-redux'; // Import useDispatch for Redux
import { useNavigate } from 'react-router-dom';

const UserAuthentication = () => {
  // States for registration form
  const [registerFormData, setRegisterFormData] = useState({
    name: '', // State to hold the name
    email: '', // State to hold the email
    password: '', // State to hold the password
    province: '', // State to hold the province
    city: '', // State to hold the city
    mobile: '', // State to hold the mobile number
    address: '', // State to hold the address
  });
  const [registerMessage, setRegisterMessage] = useState(''); // State to hold messages related to registration
  const [registerLoading, setRegisterLoading] = useState(false); // State to manage loading state during registration

  // States for login form
  const [loginFormData, setLoginFormData] = useState({
    email: '', // State to hold the email for login
    password: '', // State to hold the password for login
    showPassword: false, // Toggle for showing/hiding password
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
      const response = await axios.post('http://localhost:4000/user/create', registerFormData);

      if (response.status === 201) {
        setRegisterMessage('Registration successful! Please login.'); // Success message
        setRegisterFormData({ // Reset form fields
          name: '',
          email: '',
          password: '',
          province: '',
          city: '',
          mobile: '',
          address: '',
        });
      } else {
        setRegisterMessage('Error registering user. Please try again.'); // Error message
      }
    } catch (error) {
      console.error('Error during registration:', error); // Log error
      if (error.response && error.response.status === 409) {
        setRegisterMessage('This email is already registered. Use another email.'); // Email duplicate error
      } else {
        setRegisterMessage('Internal server error. Try later.'); // General error message
      }
    } finally {
      setRegisterLoading(false); // Reset loading state
    }
  };

  // Handle login submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    setLoginLoading(true); // Set loading state to true
    setLoginMessage(''); // Clear any previous messages

    try {
      const response = await axios.post('http://localhost:4000/user/login', loginFormData);

      if (response.status === 200) {
        const { Sectoken, user } = response.data;
        setLoginMessage('Login successful!'); // Success message
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', Sectoken);
        //navigate('/adminpanel/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setLoginMessage('Invalid credentials. Try again.'); // Error message for invalid credentials
      } else {
        setLoginMessage('Server error. Try again later.'); // General error
      }
      console.error('Error during login:', error); // Log error
    } finally {
      setLoginLoading(false); // Reset loading state
    }
  };

  // Toggle password visibility
  const toggleShowPassword = () => {
    setLoginFormData((prevData) => ({ ...prevData, showPassword: !prevData.showPassword }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl">
        {/* Registration Form */}
        <div className="w-1/2 pr-8 border-r">
          <h2 className="text-3xl font-bold mb-6 text-blue-600">User Registration</h2>
          {registerMessage && <div className="mb-4 text-center text-red-500">{registerMessage}</div>}
          <form onSubmit={handleRegisterSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="registerName">Name</label>
              <input id="registerName" type="text" name="name" value={registerFormData.name} onChange={(e) => handleChange(e, 'register')} required className="w-full px-3 py-2 border rounded-md" placeholder="Enter your name" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="registerEmail">Email</label>
              <input id="registerEmail" type="email" name="email" value={registerFormData.email} onChange={(e) => handleChange(e, 'register')} required className="w-full px-3 py-2 border rounded-md" placeholder="Enter your email" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="registerPassword">Password</label>
              <input id="registerPassword" type="password" name="password" value={registerFormData.password} onChange={(e) => handleChange(e, 'register')} required className="w-full px-3 py-2 border rounded-md" placeholder="Enter your password" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="province">Province</label>
              <input id="province" type="text" name="province" value={registerFormData.province} onChange={(e) => handleChange(e, 'register')} required className="w-full px-3 py-2 border rounded-md" placeholder="Enter your province" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="city">City</label>
              <input id="city" type="text" name="city" value={registerFormData.city} onChange={(e) => handleChange(e, 'register')} required className="w-full px-3 py-2 border rounded-md" placeholder="Enter your city" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="mobile">Mobile Number</label>
              <input id="mobile" type="tel" name="mobile" value={registerFormData.mobile} onChange={(e) => handleChange(e, 'register')} required className="w-full px-3 py-2 border rounded-md" placeholder="Enter your mobile number" />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="address">Address</label>
              <textarea id="address" name="address" value={registerFormData.address} onChange={(e) => handleChange(e, 'register')} required className="w-full px-3 py-2 border rounded-md" placeholder="Enter your address"></textarea>
            </div>
            <button type="submit" disabled={registerLoading} className={`w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md ${registerLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {registerLoading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>

        {/* Login Form */}
        <div className="w-1/2 pl-8">
          <h2 className="text-3xl font-bold mb-6 text-green-600">User Login</h2>
          {loginMessage && <div className="mb-4 text-center text-red-500">{loginMessage}</div>}
          <form onSubmit={handleLoginSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="loginEmail">Email</label>
              <input id="loginEmail" type="email" name="email" value={loginFormData.email} onChange={(e) => handleChange(e, 'login')} required className="w-full px-3 py-2 border rounded-md" placeholder="Enter your email" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2" htmlFor="loginPassword">Password</label>
              <div className="relative">
                <input id="loginPassword" type={loginFormData.showPassword ? 'text' : 'password'} name="password" value={loginFormData.password} onChange={(e) => handleChange(e, 'login')} required className="w-full px-3 py-2 border rounded-md" placeholder="Enter your password" />
                <button type="button" onClick={toggleShowPassword} className="absolute inset-y-0 right-0 px-3 py-2 text-gray-600 focus:outline-none">
                  {loginFormData.showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loginLoading} className={`w-full bg-green-500 text-white font-bold py-2 px-4 rounded-md ${loginLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {loginLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className='text-red-950 text-center'>Register,if you are not a member.</p>
        </div>
      </div>
    </div>
  );
};

export default UserAuthentication;
