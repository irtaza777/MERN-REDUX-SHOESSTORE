import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCartCountAsync } from '../../Store/cartslice'; // Import the thunk for fetching cart count

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false); // State to manage the mobile menu open/close
    const dispatch = useDispatch(); // Hook to access the Redux store's dispatch function

    // Select cartCount, status, and error from the Redux store
    const { cartCount, status, error } = useSelector((state) => state.cart);

    // Function to toggle the mobile menu
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        // Get userId from local storage
        const userId = JSON.parse(localStorage.getItem('user'))?.id;
        
        if (userId) {
            // Dispatch the thunk to fetch the cart count if userId exists
            dispatch(fetchCartCountAsync(userId));
        }
    }, [cartCount]); // Dependency array includes dispatch to avoid warnings

    return (
        <nav className="bg-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <div className="text-2xl font-bold text-gray-800">
                        <Link to="/">ShoeStore</Link>
                    </div>

                    {/* Menu for larger screens */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-gray-600 hover:text-indigo-600">Home</Link>
                        <Link to="/categories" className="text-gray-600 hover:text-indigo-600">Categories</Link>
                        <Link to="/Products" className="text-gray-600 hover:text-indigo-600">Products</Link>
                        <Link to="/cart" className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700">
                            {/* Cart Icon */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 3h2l.4 2h13.2l.4-2h2M3 3l1 10h12l1-10H3zm0 0h0m0 0l1.8 7.2a1 1 0 00.9.8h12.6a1 1 0 00.9-.8L21 3H3zm1 11a2 2 0 100 4 2 2 0 000-4zm15 0a2 2 0 100 4 2 2 0 000-4z"
                                />
                            </svg>
                            {/* Cart Count Badge */}
                            {cartCount > 0 && (
                                <span className="text-xs text-white rounded-full mt-3">
                                    {cartCount} {/* Display cart count */}
                                </span>
                            )}
                        </Link>
                        <Link to="/UserAuthentication" className="text-gray-600 hover:text-indigo-600">Login</Link>
                    </div>

                    {/* Hamburger Icon for Mobile Navigation */}
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
                    <Link to="/Products" className="block text-gray-600 hover:bg-gray-200 px-4 py-2">Products</Link>
                    <Link to="/cart" className="block-flex items-center bg-indigo-600 text-white px-4 py-2 rounded-full mt-2">
                        {/* Cart Icon for Mobile */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 3h2l.4 2h13.2l.4-2h2M3 3l1 10h12l1-10H3zm0 0h0m0 0l1.8 7.2a1 1 0 00.9.8h12.6a1 1 0 00.9-.8L21 3H3zm1 11a2 2 0 100 4 2 2 0 000-4zm15 0a2 2 0 100 4 2 2 0 000-4z"
                            />
                        </svg>
                        Cart
                        {/* Cart Count Badge for Mobile */}
                        {cartCount > 0 && (
                            <span className="ml-2 text-xs bg-red-500 text-white rounded-full px-2">
                                {cartCount} {/* Display cart count for mobile */}
                            </span>
                        )}
                    </Link>
                    <Link to="/UserAuthentication" className="block text-gray-600 hover:bg-gray-200 px-4 py-2">Login</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
