import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteBrandAsync, updateBrandAsync, fetchBrandsAsync } from '../Store/adminslice';

const ManageBrands = () => {
  const dispatch = useDispatch();
  const brands = useSelector((state) => state.admin.brands);
  
  const [editingBrandId, setEditingBrandId] = useState(null);
  const [editedBrandName, setEditedBrandName] = useState('');
  const [editedLogo, setEditedLogo] = useState(null);
  const [errorMessage, setErrorMessage] = useState(''); // For validation or API errors
  const [message, setMessage] = useState(''); // For success messages
  const loading = useSelector((state) => state.admin.loading);
  const error = useSelector((state) => state.admin.error);

  useEffect(() => {
    dispatch(fetchBrandsAsync()); // Fetch brands on component mount
  }, [dispatch]);

  const handleDelete = async (brandId) => {
    try {
      await dispatch(deleteBrandAsync(brandId)); // Dispatch deleteBrand action
      setMessage('Brand successfully deleted.');
      setErrorMessage('');
    } catch (error) {
      console.error('Error deleting brand:', error);
      setErrorMessage('Failed to delete the brand.');
      setMessage('');
    }
  };

  const handleEditClick = (brand) => {
    setEditingBrandId(brand.id);
    setEditedBrandName(brand.name);
    setEditedLogo(null); // Reset the logo to avoid confusion if it was uploaded earlier
    setErrorMessage('');
    setMessage('');
  };

  const handleLogoChange = (e) => {
    setEditedLogo(e.target.files[0]); // Set the selected image file
  };

  const handleUpdate = async (brandId) => {
    // Validate brand name
    if (editedBrandName.length < 3 || editedBrandName.length > 50) {
      setErrorMessage('Brand name must be between 3 and 50 characters.');
      setMessage('');
      return;
    }

    // Prepare FormData for the API request
    const formData = new FormData();
    formData.append('name', editedBrandName);
    if (editedLogo) {
      formData.append('logo', editedLogo);
    }

    try {
      // Dispatch updateBrand action
      await dispatch(updateBrandAsync({ id: brandId, data: formData }));
      setEditingBrandId(null);
      setEditedLogo(null);
      setErrorMessage('');
      setMessage('Brand successfully updated.');
      
      // Re-fetch brands after update
      dispatch(fetchBrandsAsync());
    } catch (error) {
      console.error('Error updating brand:', error);
      setErrorMessage('Failed to update the brand.');
      setMessage('');
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-gray-100 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Manage Brands</h2>

      {/* Display success message */}
      {message && <p className="text-green-500 mb-4">{message}</p>}
      
      {/* Display validation or API error message */}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>} 

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
                      className="border px-2 py-1 w-full"
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
