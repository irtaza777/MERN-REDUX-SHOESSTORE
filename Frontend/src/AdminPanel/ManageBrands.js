import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { removeBrand, setBrands, updateBrand } from '../Store/adminslice';

const ManageBrands = () => {
  const dispatch = useDispatch();
  const brands = useSelector((state) => state.admin.brands);

  const [editingBrandId, setEditingBrandId] = useState(null);
  const [editedBrandName, setEditedBrandName] = useState('');
  const [editedLogo, setEditedLogo] = useState(null);
  const [errorMessage, setErrorMessage] = useState(''); // For validation errors

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get('http://localhost:4000/AdminPanel/AllBrands', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        dispatch(setBrands(response.data));
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };
    fetchBrands();
  }, [dispatch]);

  const handleDelete = async (brandId) => {
    try {
      await axios.delete(`http://localhost:4000/AdminPanel/DeleteBrand/${brandId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      dispatch(removeBrand(brandId));
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  };

  const handleEditClick = (brand) => {
    setEditingBrandId(brand.id);
    setEditedBrandName(brand.name);
  };

  const handleLogoChange = (e) => {
    setEditedLogo(e.target.files[0]);
  };

  const handleUpdate = async (brandId) => {
    // Validate brand name length
    if (editedBrandName.length < 3 || editedBrandName.length > 50) {
      setErrorMessage('Brand name must be between 3 and 50 characters.');
      return;
    }
    
    setErrorMessage(''); // Clear any previous error messages

    const formData = new FormData();
    formData.append('name', editedBrandName);
    
    if (editedLogo) {
      formData.append('logo', editedLogo);
    }

    try {
      const response = await axios.put(
        `http://localhost:4000/AdminPanel/UpdateBrand/${brandId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      dispatch(updateBrand(response.data.brand));
      setEditingBrandId(null);
      setEditedLogo(null);
    } catch (error) {
      console.error('Error updating brand:', error);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-gray-100 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Manage Brands</h2>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>} {/* Display validation error */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3 border">Brand Name</th>
            <th className="p-3 border">Brand Logo</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {brands.length > 0 ? (
            brands.map((brand) => (
              <tr key={brand.id} className="bg-white hover:bg-gray-50">
                <td className="p-3 border">
                  {editingBrandId === brand.id ? (
                    <input
                      type="text"
                      value={editedBrandName}
                      onChange={(e) => setEditedBrandName(e.target.value)}
                      className="border px-2 py-1"
                    />
                  ) : (
                    brand.name
                  )}
                </td>
                <td className="p-3 border">
                  {editingBrandId === brand.id ? (
                    <input
                      type="file"
                      onChange={handleLogoChange}
                      className="border px-2 py-1"
                    />
                  ) : brand.imageUrl ? (
                    <img
                      src={brand.imageUrl}
                      alt={brand.name}
                      className="h-16 w-16 object-cover"
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td className="p-3 border flex space-x-2">
                  {editingBrandId === brand.id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(brand.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingBrandId(null)}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(brand)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(brand.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="p-3 border text-center">
                No brands available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageBrands;
