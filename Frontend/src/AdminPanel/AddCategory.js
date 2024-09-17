import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCategoryAsync } from '../Store/adminslice';

const AddCategory = () => {
    const [categoryData, setCategoryData] = useState({
        name: '', // Category name input
    });
    const [message, setMessage] = useState(''); // Message for success/error feedback
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.admin.categories); // Fetching categories from Redux state
    const loading = useSelector((state) => state.admin.loading); // Loading state from Redux
    const error = useSelector((state) => state.admin.error); // Error state from Redux

    // Reset message when the component first renders or when there's an error
    useEffect(() => {
        if (error) {
            setMessage(error);
        }
    }, [error]);

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

        // Check if category already exists locally (client-side validation)
        if (Array.isArray(categories) && categories.some(category => category.name.toLowerCase() === categoryData.name.toLowerCase())) {
            setMessage('Category already exists. Please enter a unique category name.');
            return;
        }

        // Dispatch the thunk to add the category
        await dispatch(addCategoryAsync(categoryData));

        // Show success message if no error after dispatch
        if (!error) {
            setMessage('Category added successfully!');
            // Reset category data after successful addition
            setCategoryData({ name: '' });
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto bg-gray-100 shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Add New Category</h2>
            {message && <div className={`mb-4 text-center ${error ? 'text-red-500' : 'text-green-500'}`}>{message}</div>}

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
