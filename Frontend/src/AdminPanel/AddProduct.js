import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addProductAsync, fetchBrandsAsync, fetchCategoriesAsync } from '../Store/adminslice';

const AddProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        sizes: [{ size: '', stock: '' }],
        categoryId: '',
        brandId: '',
    });

    const [imageFile, setImageFile] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({}); // State to store validation errors

    // Get categories and brands from Redux state
    const categories = useSelector((state) => state.admin.categories);
    const brands = useSelector((state) => state.admin.brands);

    // Fetch categories and brands on component mount
    useEffect(() => {
        dispatch(fetchCategoriesAsync());
        dispatch(fetchBrandsAsync());
    }, [dispatch]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) {
            newErrors.name = 'Product name is required.';
        } else if (formData.name.length < 5 && formData.description.length < 10) {
            newErrors.name = 'Product name must be at least 5 characters long.';
            newErrors.description = 'Product cription must be at least 10 characters long.';
        }
        if (!formData.description) newErrors.description = 'Description is required.';
        if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
            newErrors.price = 'Price must be a positive number.';
        }
        if (!formData.stock || isNaN(formData.stock) || formData.stock <= 0) {
            newErrors.stock = 'Stock must be a positive number.';
        }
        if (!formData.categoryId) newErrors.categoryId = 'Category is required.';
        if (!formData.brandId) newErrors.brandId = 'Brand is required.';
        if (!imageFile) newErrors.image = 'Image is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!validateForm()) {
            setLoading(false);
            return; // Stop submission if validation fails
        }

        const productData = new FormData();
        productData.append('name', formData.name);
        productData.append('description', formData.description);
        productData.append('price', formData.price);
        productData.append('stock', formData.stock);
        productData.append('sizes', JSON.stringify(formData.sizes));
        productData.append('categoryId', formData.categoryId);
        productData.append('brandId', formData.brandId);
        if (imageFile) {
            productData.append('image', imageFile);
        }

        try {
            const response = await dispatch(addProductAsync(productData)); // Use thunk action to add product

            if (response.meta.requestStatus === 'fulfilled') {
                setMessage('Product added successfully!');
                //navigate('/adminpanel/products');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            setMessage('Failed to add product. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto mt-10">
            <h2 className="text-2xl font-semibold mb-5">Add New Product</h2>
            {message && <p className={message.includes('success') ? 'text-green-500' : 'text-red-500'}>{message}</p>}
            <form onSubmit={handleSubmit}>
                {/* Product Name */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        required
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                </div>

                <div className="flex flex-wrap gap-4 mb-4">
                    {/* Price */}
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                        {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                    </div>

                    {/* Stock */}
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Total Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            required
                        />
                        {errors.stock && <p className="text-red-500 text-sm">{errors.stock}</p>}
                    </div>
                </div>

                {/* Image Upload */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Upload Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="mt-1 block w-full"
                        required
                    />
                    {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
                </div>

                {/* Category Dropdown */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        name="categoryId"
                        onChange={handleChange}
                        value={formData.categoryId}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId}</p>}
                </div>

                {/* Brand Dropdown */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Brand</label>
                    <select
                        name="brandId"
                        onChange={handleChange}
                        value={formData.brandId}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        required
                    >
                        <option value="">Select Brand</option>
                        {brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.name}
                            </option>
                        ))}
                    </select>
                    {errors.brandId && <p className="text-red-500 text-sm">{errors.brandId}</p>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="mt-5 bg-blue-500 text-white px-6 py-2 rounded-md"
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;