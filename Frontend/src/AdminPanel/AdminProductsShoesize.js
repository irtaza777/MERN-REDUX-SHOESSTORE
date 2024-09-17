import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsAsync, addShoeSizesAsync } from '../Store/adminslice'; // Import necessary actions

const AdminProductsShoesize = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.admin.products);
  console.log(products)
  const loading = useSelector((state) => state.admin.loading);
  const error = useSelector((state) => state.admin.error);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [size, setSize] = useState(''); // For size
  const [stock, setStock] = useState(''); // For stock
  const [message, setMessage] = useState(''); // For success or error messages

  useEffect(() => {
    dispatch(fetchProductsAsync()); // Fetch products on component mount
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate inputs
    if (!selectedProductId || !size || !stock) {
      setMessage('Please select a product, enter size, and stock.');
      return;
    }

    try {
      // Dispatch action to add shoesize
      await dispatch(addShoeSizesAsync({ productId: selectedProductId, size, stock }));
      setMessage('Shoesize added successfully!'); // Set success message
      // Clear form fields after submission
      setSelectedProductId('');
      setSize('');
      setStock('');
    } catch (error) {
      console.error('Error adding shoesize:', error);
      setMessage('Failed to add shoesize.'); // Set error message
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-gray-100 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add Shoe Size Stock</h2>
      {message && <p className="black-red-500 mb-4">{message}</p>} {/* Display message */}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="product" className="block mb-2">
            Select Product
          </label>
          <select
            id="product"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="border px-2 py-1 w-full"
          >
            <option value="">-- Select a product --</option>
            {loading ? (
              <option>Loading products...</option>
            ) : products.length > 0 ? (
              products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))
            ) : (
              <option>No products available</option>
            )}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="size" className="block mb-2">
            Size
          </label>
          <input
            type="number"
            id="size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="border px-2 py-1 w-full"
            placeholder="Enter size (e.g., 8, 9, 10)"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="stock" className="block mb-2">
            Stock
          </label>
          <input
            type="number"
            id="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="border px-2 py-1 w-full"
            placeholder="Enter stock quantity"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AdminProductsShoesize;
