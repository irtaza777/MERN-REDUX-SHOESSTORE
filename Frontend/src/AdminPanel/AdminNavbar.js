import React, { useState } from 'react'; // Import React and useState for managing component state
import { useNavigate, Link } from 'react-router-dom'; // Import hooks for navigation and links
import { clearAdmin } from '../Store/adminslice'; // Import action to clear admin from Redux store
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to track whether the mobile menu is open or closed
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false); // State to track categories dropdown open/close
  const [isBrandsOpen, setIsBrandsOpen] = useState(false); // State to track brands dropdown open/close
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false); // State for mobile categories dropdown
  const [isMobileBrandsOpen, setIsMobileBrandsOpen] = useState(false); // State for mobile brands dropdown
  const navigate = useNavigate(); // Hook to programmatically navigate between routes
  const dispatch = useDispatch(); // Hook to dispatch actions to the Redux store

  // Use useSelector to get the admin data from the Redux state
  const admin = useSelector((state) => state.admin.admin);
  
  // Function to toggle the mobile menu's open/close state
  const toggleMenu = () => {
    setIsOpen(!isOpen); // Toggle the state
  };

  // Function to handle admin logout
  const logout = () => {
    dispatch(clearAdmin()); // Dispatch action to clear admin from Redux store
    navigate("/adminpanel"); // Navigate to the admin panel after logout
  };

  // Function to toggle Categories dropdown
  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen); // Toggle categories dropdown open/close
  };

  // Function to toggle Brands dropdown
  const toggleBrands = () => {
    setIsBrandsOpen(!isBrandsOpen); // Toggle brands dropdown open/close
  };

  // Function to toggle mobile Categories dropdown
  const toggleMobileCategories = () => {
    setIsMobileCategoriesOpen(!isMobileCategoriesOpen); // Toggle mobile categories dropdown open/close
  };

  // Function to toggle mobile Brands dropdown
  const toggleMobileBrands = () => {
    setIsMobileBrandsOpen(!isMobileBrandsOpen); // Toggle mobile brands dropdown open/close
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

          {/* Categories Dropdown */}
          <li className="relative">
            <button onClick={toggleCategories} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium focus:outline-none">
              Categories
            </button>
            {isCategoriesOpen && (
              <ul className="absolute bg-gray-700 text-white rounded-md mt-2 shadow-lg">
                <li>
                  <Link to="/adminpanel/AddCategory" className="block px-4 py-2 hover:bg-gray-600">Add Category</Link>
                </li>
                <li>
                  <Link to="/adminpanel/ManageCategories" className="block px-4 py-2 hover:bg-gray-600">Manage Categories</Link>
                </li>
              </ul>
            )}
          </li>

          {/* Brands Dropdown */}
          <li className="relative">
            <button onClick={toggleBrands} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium focus:outline-none">
              Brands
            </button>
            {isBrandsOpen && (
              <ul className="absolute bg-gray-700 text-white rounded-md mt-2 shadow-lg">
                <li>
                  <Link to="/adminpanel/AddBrands" className="block px-4 py-2 hover:bg-gray-600">Add Brand</Link>
                </li>
                <li>
                  <Link to="/adminpanel/ManageBrands" className="block px-4 py-2 hover:bg-gray-600">Manage Brands</Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <Link to="/adminpanel/AddProduct"  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Products</Link>
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
          
          {/* Mobile Categories Dropdown */}
          <li>
            <button onClick={toggleMobileCategories} className="w-full text-left px-4 py-2 hover:bg-gray-700 focus:outline-none">
              Categories
            </button>
            {isMobileCategoriesOpen && (
              <ul className="pl-4">
                <li>
                  <Link to="/adminpanel/AddCategory" className="block px-4 py-2 hover:bg-gray-700">Add Category</Link>
                </li>
                <li>
                  <Link to="/adminpanel/ManageCategories" className="block px-4 py-2 hover:bg-gray-700">Manage Categories</Link>
                </li>
              </ul>
            )}
          </li>

          {/* Mobile Brands Dropdown */}
          <li>
            <button onClick={toggleMobileBrands} className="w-full text-left px-4 py-2 hover:bg-gray-700 focus:outline-none">
              Brands
            </button>
            {isMobileBrandsOpen && (
              <ul className="pl-4">
                <li>
                  <Link to="/adminpanel/AddBrands" className="block px-4 py-2 hover:bg-gray-700">Add Brand</Link>
                </li>
                <li>
                  <Link to="/adminpanel/ManageBrands" className="block px-4 py-2 hover:bg-gray-700">Manage Brands</Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <Link to="/adminpanel/AddProduct" className="block px-4 py-2 hover:bg-gray-700">Products</Link>
          </li>
          <li>
            <Link to="/adminpanel/orders" className="block px-4 py-2 hover:bg-gray-700">Orders</Link>
          </li>
          <li>
            <Link to="/adminpanel/users" className="block px-4 py-2 hover:bg-gray-700">Users</Link>
          </li>
          <li>
            {admin ? (
              <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-gray-700">
                Logout ({admin.name})
              </button>
            ) : (
              <Link to="/adminpanel" className="block px-4 py-2 hover:bg-gray-700">Login</Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminNavbar;
