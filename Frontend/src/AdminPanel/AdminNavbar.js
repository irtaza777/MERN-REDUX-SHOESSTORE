// AdminNavbar.js

import React, { useState } from 'react'; // Import React and useState for managing component state
import { useNavigate, Link } from 'react-router-dom'; // Import hooks for navigation and links
import { clearAdmin } from '../Store/adminslice'; // Import action to clear admin from Redux store
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to track whether the mobile menu is open or closed
  const navigate = useNavigate(); // Hook to programmatically navigate between routes
  const dispatch = useDispatch(); // Hook to dispatch actions to the Redux store

  // Use useSelector to get the admin data from the Redux state
  const admin = useSelector((state) => state.admin.admin);
console.log(admin)
  // Function to toggle the mobile menu's open/close state
  const toggleMenu = () => {
    setIsOpen(!isOpen); // Toggle the state
  };

  // Function to handle admin logout
  const logout = () => {
    dispatch(clearAdmin()); // Dispatch action to clear admin from Redux store
    navigate("/adminpanel"); // Navigate to the admin panel after logout
  };

  return (
    <nav className="bg-gray-800 p-4 z-50"> {/* Navbar background and padding, z-index to overlay */}
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/adminpanel" className="text-white text-lg font-bold">Admin Panel</Link>
        <div className="block md:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            {/* Hamburger Icon for mobile menu */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
        {/* Desktop Menu */}
        <ul className={`hidden md:flex md:items-center md:space-x-4 ${isOpen ? 'block' : 'hidden'}`}>
          <li>
            <Link to="/adminpanel/dashboard" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
          </li>
          <li>
            <Link to="/adminpanel/categories" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Categories</Link>
          </li>
          <li>
            <Link to="/adminpanel/products" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Products</Link>
          </li>
          <li>
            <Link to="/adminpanel/orders" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Orders</Link>
          </li>
          <li>
            <Link to="/adminpanel/users" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Users</Link>
          </li>
          <li className="nav-item">
            {admin ? ( // Check if admin is logged in
              <div className="nav-item-content">
                <button onClick={logout} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Logout ({admin.name}) {/* Display logout button with admin name */}
                </button>
              </div>
            ) : (
              <Link className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" to="/adminpanel">Login</Link> // Display login link if not logged in
            )}
          </li>
        </ul>
      </div>

      {/* Responsive Menu for mobile view */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} absolute top-16 left-0 right-0 bg-gray-800 z-40`}> {/* Mobile menu with absolute positioning and lower z-index */}
        <ul className="text-white rounded-md mt-2">
          <li>
            <Link to="/adminpanel/dashboard" className="block px-4 py-2 hover:bg-gray-700">Dashboard</Link>
          </li>
          <li>
            <Link to="/adminpanel/categories" className="block px-4 py-2 hover:bg-gray-700">Categories</Link>
          </li>
          <li>
            <Link to="/adminpanel/products" className="block px-4 py-2 hover:bg-gray-700">Products</Link>
          </li>
          <li>
            <Link to="/adminpanel/orders" className="block px-4 py-2 hover:bg-gray-700">Orders</Link>
          </li>
          <li>
            <Link to="/adminpanel/users" className="block px-4 py-2 hover:bg-gray-700">Users</Link>
          </li>
          <li className="nav-item">
            {admin ? ( // Check if admin is logged in
              <div className="nav-item-content">
                <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-gray-700">
                  LogOut ({admin.name}) {/* Display logout button with admin name */}
                </button>
              </div>
            ) : (
              <Link className="block px-4 py-2 hover:bg-gray-700" to="/adminpanel">Login</Link> // Display login link if not logged in
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminNavbar;
