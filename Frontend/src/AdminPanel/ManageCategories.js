import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  deleteCategoryAsync, updateCategoryAsync, fetchCategoriesAsync } from '../Store/adminslice'; // Use your async thunks

const ManageCategories = () => {
    const [editMode, setEditMode] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [message, setMessage] = useState('');

    const dispatch = useDispatch();
    const categories = useSelector((state) => state.admin.categories); // Get categories from Redux state
    const loading = useSelector((state) => state.admin.loading);
    const error = useSelector((state) => state.admin.error);

    useEffect(() => {
        dispatch(fetchCategoriesAsync()); // Fetch categories when component mounts
    }, [dispatch]);

    const handleDelete = async (id) => {
        try {
            await dispatch(deleteCategoryAsync(id));
            setMessage('Category deleted successfully.');
        } catch (error) {
            console.error('Error deleting category:', error);
            setMessage('Error deleting category.');
        }
    };

    const handleEdit = (category) => {
        setEditMode(category.id);
        setCategoryName(category.name);
    };

    const handleUpdate = async (id) => {
        try {
            await dispatch(updateCategoryAsync({ id, name: categoryName }));
            setEditMode(null);
            setMessage('Category updated successfully.');
        } catch (error) {
            console.error('Error updating category:', error);
            setMessage('Error updating category.');
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto bg-gray-100 shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>
            {loading && <div className="text-center text-blue-500 mb-4">Loading...</div>}
            {message && <div className="text-center text-green-500 mb-4">{message}</div>}
            {error && <div className="text-center text-red-500 mb-4">{error}</div>}

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
                            <th className="py-3 px-5 text-left">Serial</th>
                            <th className="py-3 px-5 text-left">Category Name</th>
                            <th className="py-3 px-5 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category, index) => (
                            <tr key={category.id} className="border-t hover:bg-gray-100">
                                <td className="py-3 px-5">
                                    {index + 1}
                                </td>
                                <td className="py-3 px-5">
                                    {editMode === category.id ? (
                                        <input
                                            type="text"
                                            value={categoryName}
                                            onChange={(e) => setCategoryName(e.target.value)}
                                            className="border border-gray-300 rounded p-2 w-full"
                                        />
                                    ) : (
                                        <span>{category.name}</span>
                                    )}
                                </td>
                                <td className="py-3 px-5 flex space-x-2">
                                    {editMode === category.id ? (
                                        <button
                                            className="bg-green-500 text-white px-4 py-2 rounded-md"
                                            onClick={() => handleUpdate(category.id)}
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                            onClick={() => handleEdit(category)}
                                        >
                                            Edit
                                        </button>
                                    )}
                                    <button
                                        className="bg-red-500 text-white px-4 py-2 rounded-md"
                                        onClick={() => handleDelete(category.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageCategories;
