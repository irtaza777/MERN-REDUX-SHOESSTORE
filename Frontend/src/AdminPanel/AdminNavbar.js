import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { clearAdmin } from '../Store/adminslice';
import { useDispatch, useSelector } from 'react-redux';

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false); // New state for Products dropdown
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [isMobileBrandsOpen, setIsMobileBrandsOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false); // New state for mobile Products dropdown

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const admin = useSelector((state) => state.admin.admin);

  const toggleMenu = () => setIsOpen(!isOpen);
  const logout = () => {
    dispatch(clearAdmin());
    navigate("/adminpanel");
  };

  // Toggle functions for dropdowns
  const toggleCategories = () => setIsCategoriesOpen(!isCategoriesOpen);
  const toggleBrands = () => setIsBrandsOpen(!isBrandsOpen);
  const toggleProducts = () => setIsProductsOpen(!isProductsOpen); // Toggle Products dropdown
  const toggleMobileCategories = () => setIsMobileCategoriesOpen(!isMobileCategoriesOpen);
  const toggleMobileBrands = () => setIsMobileBrandsOpen(!isMobileBrandsOpen);
  const toggleMobileProducts = () => setIsMobileProductsOpen(!isMobileProductsOpen); // Toggle mobile Products dropdown

  return (
    <nav className="bg-gray-800 p-4 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/adminpanel" className="text-white text-lg font-bold">Admin Panel</Link>
        <div className="block md:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
        <ul className={`hidden md:flex md:items-center md:space-x-4 ${isOpen ? 'block' : 'hidden'}`}>
          <li><Link to="/adminpanel/dashboard" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link></li>

          {/* Categories Dropdown */}
          <li className="relative">
            <button onClick={toggleCategories} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium focus:outline-none">Categories</button>
            {isCategoriesOpen && (
              <ul className="absolute bg-gray-700 text-white rounded-md mt-2 shadow-lg">
                <li><Link to="/adminpanel/AddCategory" className="block px-4 py-2 hover:bg-gray-600">Add Category</Link></li>
                <li><Link to="/adminpanel/ManageCategories" className="block px-4 py-2 hover:bg-gray-600">Manage Categories</Link></li>
              </ul>
            )}
          </li>

          {/* Brands Dropdown */}
          <li className="relative">
            <button onClick={toggleBrands} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium focus:outline-none">Brands</button>
            {isBrandsOpen && (
              <ul className="absolute bg-gray-700 text-white rounded-md mt-2 shadow-lg">
                <li><Link to="/adminpanel/AddBrands" className="block px-4 py-2 hover:bg-gray-600">Add Brand</Link></li>
                <li><Link to="/adminpanel/ManageBrands" className="block px-4 py-2 hover:bg-gray-600">Manage Brands</Link></li>
              </ul>
            )}
          </li>

          {/* Products Dropdown */}
          <li className="relative">
            <button onClick={toggleProducts} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium focus:outline-none">Products</button>
            {isProductsOpen && (
              <ul className="absolute bg-gray-700 text-white rounded-md mt-2 shadow-lg">
                <li><Link to="/adminpanel/AddProduct" className="block px-4 py-2 hover:bg-gray-600">Add Product</Link></li>
                <li><Link to="/adminpanel/AdminProductsShoesize" className="block px-4 py-2 hover:bg-gray-700">Product (size & stock)</Link></li>
                <li><Link to="/adminpanel/AdminProducts/ProductColor" className="block px-4 py-2 hover:bg-gray-700">Product Colors</Link></li>
                <li><Link to="/adminpanel/AdminProducts/AllProductsDetails" className="block px-4 py-2 hover:bg-gray-700"> ManageProducts </Link></li>
              </ul>
            )}
          </li>

          <li><Link to="/adminpanel/orders" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Orders</Link></li>
          <li><Link to="/adminpanel/users" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Users</Link></li>

          <li className="nav-item">
            {admin ? (
              <div className="nav-item-content">
                <button onClick={logout} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Logout ({admin.name})
                </button>
              </div>
            ) : (
              <Link className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" to="/adminpanel">Login</Link>
            )}
          </li>
        </ul>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} absolute top-16 left-0 right-0 bg-gray-800 z-40`}>
        <ul className="text-white rounded-md mt-2">
          <li><Link to="/adminpanel/dashboard" className="block px-4 py-2 hover:bg-gray-700">Dashboard</Link></li>

          {/* Mobile Categories Dropdown */}
          <li>
            <button onClick={toggleMobileCategories} className="w-full text-left px-4 py-2 hover:bg-gray-700 focus:outline-none">Categories</button>
            {isMobileCategoriesOpen && (
              <ul className="pl-4">
                <li><Link to="/adminpanel/AddCategory" className="block px-4 py-2 hover:bg-gray-700">Add Category</Link></li>
                <li><Link to="/adminpanel/ManageCategories" className="block px-4 py-2 hover:bg-gray-700">Manage Categories</Link></li>

              </ul>
            )}
          </li>
          {/* Mobile Brands Dropdown */}
          <li>
            <button onClick={toggleMobileBrands} className="w-full text-left px-4 py-2 hover:bg-gray-700 focus:outline-none">Brands</button>
            {isMobileBrandsOpen && (
              <ul className="pl-4">
                <li><Link to="/adminpanel/AddBrands" className="block px-4 py-2 hover:bg-gray-700">Add Brand</Link></li>
                <li><Link to="/adminpanel/ManageBrands" className="block px-4 py-2 hover:bg-gray-700">Manage Brands</Link></li>
              </ul>
            )}
          </li>

          {/* Mobile Products Dropdown */}
          <li>
            <button onClick={toggleMobileProducts} className="w-full text-left px-4 py-2 hover:bg-gray-700 focus:outline-none">Products</button>
            {isMobileProductsOpen && (
              <ul className="pl-4">
                <li><Link to="/adminpanel/AddProduct" className="block px-4 py-2 hover:bg-gray-700">Add Product</Link></li>
                <li><Link to="/adminpanel/AdminProductsShoesize" className="block px-4 py-2 hover:bg-gray-700">Product (size & stock)</Link></li>
                <li><Link to="/adminpanel/AdminProducts/ProductColor"
                  className="block px-4 py-2 hover:bg-gray-700">Product Colors</Link></li>
                <li><Link to="/adminpanel/AdminProducts/AllProductsDetails" className="block px-4 py-2 hover:bg-gray-700"> ManageProducts </Link></li>

              </ul>
            )}
          </li>

          <li><Link to="/adminpanel/orders" className="block px-4 py-2 hover:bg-gray-700">Orders</Link></li>
          <li><Link to="/adminpanel/users" className="block px-4 py-2 hover:bg-gray-700">Users</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminNavbar;
