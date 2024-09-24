import { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <div className="text-2xl font-bold text-gray-800">
                        <Link to="/">ShoeStore</Link> {/* Use Link for internal navigation */}
                    </div>

                    {/* Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-gray-600 hover:text-indigo-600">Home</Link>
                        <Link to="/categories" className="text-gray-600 hover:text-indigo-600">Categories</Link>
                        <Link to="/products" className="text-gray-600 hover:text-indigo-600">Products</Link>
                        <Link to="/cart" className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700">
                            Cart
                        </Link>
                        <Link to="/UserAuthentication" className="text-gray-600 hover:text-indigo-600">Login</Link> {/* Login Link */}
                    </div>

                    {/* Hamburger Icon for Mobile */}
                    <div className="md:hidden flex items-center">
                        <button onClick={toggleMenu} className="text-gray-600 focus:outline-none">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
                    <Link to="/" className="block text-gray-600 hover:bg-gray-200 px-4 py-2">Home</Link>
                    <Link to="/categories" className="block text-gray-600 hover:bg-gray-200 px-4 py-2">Categories</Link>
                    <Link to="/products" className="block text-gray-600 hover:bg-gray-200 px-4 py-2">Products</Link>
                    <Link to="/about" className="block text-gray-600 hover:bg-gray-200 px-4 py-2">About</Link>
                    <Link to="/contact" className="block text-gray-600 hover:bg-gray-200 px-4 py-2">Contact</Link>
                    <Link to="/cart" className="block bg-indigo-600 text-white px-4 py-2 rounded-full mt-2">Cart</Link>
                    <Link to="/UserAuthentication" className="block text-gray-600 hover:bg-gray-200 px-4 py-2">Login</Link> {/* Login Link */}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
