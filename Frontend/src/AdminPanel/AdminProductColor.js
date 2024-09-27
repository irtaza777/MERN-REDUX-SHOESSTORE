import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { fetchProductsAsync } from '../Store/adminslice'; // Import necessary actions

const AdminProductColor = () => {
  const [colors, setColors] = useState([]); // State to store colors
  const [productColors, setProductColors] = useState([]); // State to store product-color pairs
  const [selectedColorId, setSelectedColorId] = useState(''); // State to store selected color ID
  const [selectedProductId, setSelectedProductId] = useState(''); // State to store selected product ID
  const [editProductColorId, setEditProductColorId] = useState(null); // State to track editing
  const [message, setMessage] = useState(''); // State for success/error messages

  const dispatch = useDispatch();
  const products = useSelector((state) => state.admin.products); // Adjust selector as needed

  useEffect(() => {
    // Fetch products and colors on component mount
    dispatch(fetchProductsAsync());
    fetchColors();
    fetchProductColors(); // Fetch existing product-color pairs
  }, [dispatch]);

  // Fetch colors from the API
  const fetchColors = async () => {
    try {
      const response = await axios.get('http://localhost:4000/AdminPanel/Product/AllColor',{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setColors(response.data);
    } catch (error) {
      console.error('Error fetching colors:', error);
      setMessage('Failed to fetch colors.');
    }
  };

  // Fetch product-color pairs from the API
  const fetchProductColors = async () => {
    try {
      const response = await axios.get('http://localhost:4000/AdminPanel/Product/AllProductsColor',{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }); // Adjust API endpoint
     console.log(response)
      setProductColors(response.data);
    } catch (error) {
      console.error('Error fetching product colors:', error);
      setMessage('Failed to fetch product colors.');
    }
  };

  // Handle form submission (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProductId || !selectedColorId) {
      setMessage('Please select both a product and a color.');
      return;
    }

    try {
      if (editProductColorId) {
        // Edit existing product-color pair
        const response = await axios.put(`http://localhost:4000/AdminPanel/Product/ProductColor/${editProductColorId}`,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }, {
          productId: selectedProductId,
          colorId: selectedColorId,
        });
        setMessage(`Successfully updated product color!`);
      } else {
        // Add new product-color pair
        const response = await axios.post('http://localhost:4000/AdminPanel/Product/ProductColor', {
          productId: selectedProductId,
          colorId: selectedColorId,
        },{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setMessage(`Successfully added color to product!`);
      }

      // Refresh the product-color list and reset form
      fetchProductColors();
      setSelectedColorId('');
      setSelectedProductId('');
      setEditProductColorId(null);
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      console.error('Error submitting product color:', error);
      setMessage('Failed to submit product color. Please try again.');
    }
  };

  // Handle delete product-color pair
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/AdminPanel/Product/ProductColor/${id}`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage('Product color deleted successfully.');
      fetchProductColors();
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      console.error('Error deleting product color:', error);
      setMessage('Failed to delete product color.');
    }
  };

  // Handle edit product-color pair
  const handleEdit = (productColor) => {
    setSelectedProductId(productColor.productId);
    setSelectedColorId(productColor.colorId);
    setEditProductColorId(productColor.id);
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-gray-100 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Manage Product Colors</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="productSelect" className="block text-lg font-medium mb-2">Select Product:</label>
          <select
            id="productSelect"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            required
            className="block w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
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
            className="block w-full border border-gray-300 rounded-md p-2"
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
          className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-500"
        >
          {editProductColorId ? 'Update Color' : 'Add Color'}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-green-500">{message}</p>}

      {/* Display the product-color pairs */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Product-Color List</h3>
        {productColors.length === 0 ? (
          <p>No product-color pairs available.</p>
        ) : (
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Color</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {productColors.map((productColor) => (
                <tr key={productColor.id}>
                  <td className="border px-4 py-2">{productColor.productId}</td>
                  <td className="border px-4 py-2">{productColor.colorId}</td>
                  <td className="border px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => handleEdit(productColor)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(productColor.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminProductColor;
