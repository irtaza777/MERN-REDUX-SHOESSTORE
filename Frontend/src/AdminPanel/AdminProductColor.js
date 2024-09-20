import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { fetchProductsAsync } from '../Store/adminslice'; // Import necessary actions

const AdminProductColor = () => {
  const [colors, setColors] = useState([]); // State to store colors
  const [selectedColorId, setSelectedColorId] = useState(''); // State to store selected color ID
  const [message, setMessage] = useState(''); // State for success/error messages
  const [selectedProductId, setSelectedProductId] = useState(''); // State to store selected product ID

  const dispatch = useDispatch();
  const products = useSelector((state) => state.admin.products); // Adjust selector as needed

  useEffect(() => {
    // Fetch products on component mount
    dispatch(fetchProductsAsync());

    // Fetch colors from the API
    const fetchColors = async () => {
      try {
        const response = await axios.get('http://localhost:4000/AdminPanel/Product/AllColor'); // Adjust API endpoint as needed
        setColors(response.data); // Assuming the response contains an array of colors
      } catch (error) {
        console.error('Error fetching colors:', error);
        setMessage('Failed to fetch colors. Please try again later.');
      }
    };

    fetchColors();
  }, [dispatch]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProductId) {
      setMessage('Please select a product.');
      return;
    }

    if (!selectedColorId) {
      setMessage('Please select a color.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/AdminPanel/Product/ProductColor', {
        productId: selectedProductId,
        colorId: selectedColorId,
      });

      if (response.status === 201) {
        // Display success message with product and color details
        setMessage(`Successfully added color !`);

        // Reset the selected values
        setSelectedColorId(''); // Reset the selected color
        setSelectedProductId(''); // Reset the selected product

        // Clear the message after 5 seconds
        setTimeout(() => {
          setMessage('');
        }, 5000);
      }
    } catch (error) {
      console.error('Error adding color to product:', error);
      setMessage('Failed to add color to product. Please try again.');
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-gray-100 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Color to Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="productSelect" className="block text-lg font-medium mb-2">Select Product:</label>
          <select
            id="productSelect"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            required
            className="block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} {/* Assuming product has a name field */}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="colorSelect" className="block text-lg font-medium mb-2">Select Color:</label>
          <select
            id="colorSelect"
            value={selectedColorId}
            onChange={(e) => setSelectedColorId(e.target.value)}
            required
            className="block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-indigo-200 focus:border-indigo-500"
          >
            <option value="">Select a color</option>
            {colors.map((color) => (
              <option key={color.id} value={color.id}>
                {color.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-500 transition duration-200"
        >
          Add Color
        </button>
      </form>
      {message && <p className="mt-4 text-center text-green-500">{message}</p>} {/* Display success/error message */}
    </div>
  );
};

export default AdminProductColor;
