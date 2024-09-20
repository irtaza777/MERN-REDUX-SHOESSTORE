import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { fetchProductsAsync, addShoeSizesAsync } from '../Store/adminslice';

const AdminProductsShoesize = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.admin.products);
  const loading = useSelector((state) => state.admin.loading);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [sizes, setSizes] = useState(['']);
  const [stocks, setStocks] = useState(['']);
  const [message, setMessage] = useState('');
  const [shoeSizes, setShoeSizes] = useState([]);
  const [editingShoeSizeId, setEditingShoeSizeId] = useState(null); // Track the shoe size being edited
  const [editSize, setEditSize] = useState('');
  const [editStock, setEditStock] = useState('');

  // Fetch products and shoe sizes when component mounts
  useEffect(() => {
    dispatch(fetchProductsAsync());
    fetchShoeSizes();
  }, [dispatch]);

  const fetchShoeSizes = async () => {
    try {
      const response = await axios.get('http://localhost:4000/AdminPanel/Product/AllShoesizes');
      setShoeSizes(response.data);
    } catch (error) {
      console.error('Error fetching shoe sizes:', error);
    }
  };

  const handleAddFields = () => {
    setSizes([...sizes, '']);
    setStocks([...stocks, '']);
  };

  const handleRemoveFields = (index) => {
    const newSizes = sizes.filter((_, i) => i !== index);
    const newStocks = stocks.filter((_, i) => i !== index);
    setSizes(newSizes);
    setStocks(newStocks);
  };

  const handleSizeChange = (index, value) => {
    const newSizes = sizes.map((size, i) => (i === index ? value : size));
    setSizes(newSizes);
  };

  const handleStockChange = (index, value) => {
    const newStocks = stocks.map((stock, i) => (i === index ? value : stock));
    setStocks(newStocks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProductId || sizes.length === 0 || stocks.length === 0 || sizes.length !== stocks.length) {
      setMessage('Please select a product, enter sizes, and stock quantities.');
      return;
    }

    try {
      await dispatch(
        addShoeSizesAsync({
          productId: selectedProductId,
          sizes: sizes.map(Number),
          stocks: stocks.map(Number),
        })
      );

      setMessage('Shoe sizes added successfully!');
      setSelectedProductId('');
      setSizes(['']);
      setStocks(['']);
      fetchShoeSizes();
    } catch (error) {
      console.error('Error adding shoe sizes:', error);
      setMessage('Failed to add shoe sizes.');
    }
  };

  const handleDelete = async (shoeSizeId) => {
    try {
      await axios.delete(`http://localhost:4000/AdminPanel/Product/Shoesize/${shoeSizeId}`);
      setMessage('Shoe size deleted successfully.');
      fetchShoeSizes();
    } catch (error) {
      console.error('Error deleting shoe size:', error);
      setMessage('Failed to delete shoe size.');
    }
  };

  const handleEdit = (shoeSizeId, currentSize, currentStock) => {
    setEditingShoeSizeId(shoeSizeId);
    setEditSize(currentSize);
    setEditStock(currentStock);
  };

  const handleUpdate = async (shoeSizeId) => {
    console.error(shoeSizeId);

    try {
      await axios.put(`http://localhost:4000/AdminPanel/Product/Shoesize/${shoeSizeId}`, {
        size: editSize,
        stock: editStock,
      });
      setMessage('Shoe size updated successfully.');
      setEditingShoeSizeId(null); // Exit edit mode
      fetchShoeSizes(); // Refresh the list
    } catch (error) {
      console.error('Error updating shoe size:', error);
      setMessage('Failed to update shoe size.');
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-gray-100 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add Shoe Sizes and Stock</h2>
      {message && <p className="text-red-500 mb-4">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="product" className="block mb-2">Select Product</label>
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

        {sizes.map((size, index) => (
          <div key={index} className="mb-4">
            <label htmlFor={`size-${index}`} className="block mb-2">Size</label>
            <input
              type="number"
              id={`size-${index}`}
              value={size}
              onChange={(e) => handleSizeChange(index, e.target.value)}
              className="border px-2 py-1 w-full mb-2"
              placeholder="Enter size"
              required
            />

            <label htmlFor={`stock-${index}`} className="block mb-2">Stock</label>
            <input
              type="number"
              id={`stock-${index}`}
              value={stocks[index]}
              onChange={(e) => handleStockChange(index, e.target.value)}
              className="border px-2 py-1 w-full"
              placeholder="Enter stock quantity"
              required
            />

            {index > 0 && (
              <button
                type="button"
                className="text-red-500 hover:underline mt-2"
                onClick={() => handleRemoveFields(index)}
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 mb-4"
          onClick={handleAddFields}
        >
          Add Another Size/Stock
        </button>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>

      <h2 className="text-2xl font-bold mt-8 mb-4">Shoe Sizes List</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Product</th>
            <th className="py-2">Size</th>
            <th className="py-2">Stock</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {shoeSizes.map((shoeSize) => (
            <tr key={shoeSize.id}>
              <td className="border px-4 py-2">{shoeSize.product.name}</td>
              <td className="border px-4 py-2">
                {editingShoeSizeId === shoeSize.id ? (
                  <input
                    type="number"
                    value={editSize}
                    onChange={(e) => setEditSize(e.target.value)}
                    className="border px-2 py-1"
                  />
                ) : (
                  shoeSize.size
                )}
              </td>
              <td className="border px-4 py-2">
                {editingShoeSizeId === shoeSize.id ? (
                  <input
                    type="number"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    className="border px-2 py-1"
                  />
                ) : (
                  shoeSize.stock
                )}
              </td>
              <td className="border px-4 py-2">
                {editingShoeSizeId === shoeSize.id ? (<button onClick={() => handleUpdate(shoeSize.id)} className="bg-green-500 text-white px-2 py-1 rounded-md hover
" > Save </button>) : (<button onClick={() => handleEdit(shoeSize.id, shoeSize.size, shoeSize.stock)} className="bg-yellow-500 text-white px-2 py-1 rounded-md hover
" > Edit </button>)} <button onClick={() => handleDelete(shoeSize.id)} className="bg-red-500 text-white px-2 py-1 rounded-md hover
ml-2" > Delete </button> </td> </tr>))} </tbody> </table> </div>);
};

export default AdminProductsShoesize;
