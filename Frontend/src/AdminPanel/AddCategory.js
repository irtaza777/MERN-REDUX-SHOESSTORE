import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addCategory } from '../Store/adminslice';

const AddCategory = () => {
    const [categoryData, setCategoryData] = useState({
        name: '', // Category name input
    });
    const [message, setMessage] = useState(''); // Message for success/error feedback
    const [loading, setLoading] = useState(false); // Loading state for button
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.admin.categories); // Fetching categories from Redux state

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategoryData({ ...categoryData, [name]: value });
    };

    // Validate category name before submission
    const validateCategoryName = () => {
        const { name } = categoryData;
        if (!name || name.trim().length < 3 || name.length > 50) {
            setMessage('Category name must be at least 3 and at most 50 characters long.');
            return false;
        }
        return true;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages

        // Validate the category name
        if (!validateCategoryName()) return;

        setLoading(true); // Set loading state

        // Check if category already exists locally (client-side validation)
        if (Array.isArray(categories) && categories.some(category => category.name.toLowerCase() === categoryData.name.toLowerCase())) {
            setMessage('Category already exists. Please enter a unique category name.');
            setLoading(false);
            return;
        }

        try {
            // Make a POST request to the backend API to add the category
            const response = await axios.post('http://localhost:5000/AdminPanel/AddCategory', categoryData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Send token for authentication
                },
            });

            if (response.status === 201) {
                setMessage('Category added successfully!');
                setCategoryData({ name: '' }); // Reset form input
                dispatch(addCategory(response.data)); // Dispatch the new category to Redux state
            }
        } catch (error) {
            console.error('Error during category submission:', error);
            if (error.response && error.response.data.message) {
                setMessage(error.response.data.message); // Show the server's error message
            } else {
                setMessage('An internal error occurred. Please try again.');
            }
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto bg-gray-100 shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Add New Category</h2>
            {message && <div className="mb-4 text-center text-red-500">{message}</div>}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="categoryName">
                        Category Name
                    </label>
                    <input
                        id="categoryName"
                        type="text"
                        name="name"
                        value={categoryData.name}
                        onChange={handleChange}
                        required
                        className="w-auto px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                        placeholder="Enter category name"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading} // Disable button during loading
                    className={`w-auto bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Submitting...' : 'Add Category'}
                </button>
            </form>
        </div>
    );
};

export default AddCategory;
