import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import { useDispatch, useSelector } from 'react-redux';
import { addBrandAsync } from '../Store/adminslice'; // Import the thunk

const AddBrand = () => {
  const [brandName, setBrandName] = useState(''); // State to hold brand name
  const [brandLogo, setBrandLogo] = useState(null); // State to hold brand logo
  const [error, setError] = useState(''); // State to hold error messages
  const [successMessage, setSuccessMessage] = useState(''); // State to hold success message
  const navigate = useNavigate(); // Hook for navigation

  const { brands, loading } = useSelector((state) => state.admin); // Fetching brands and loading state from Redux

  const dispatch = useDispatch(); // Hook to dispatch actions

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validation
    if (!brandName) {
      setError('Brand name is required');
      return;
    }

    if (brandName.length < 3 || brandName.length > 50) {
      setError('Brand name must be between 3 and 50 characters');
      return;
    }

    // Check if Brand already exists locally (client-side validation)
    if (Array.isArray(brands) && brands.some(brand => brand.name.toLowerCase() === brandName.toLowerCase())) {
      setError('Brand already exists. Please enter a unique brand name.');
      return;
    }

    const formData = new FormData(); // Create FormData object
    formData.append('name', brandName); // Append brand name to form data
    if (brandLogo) {
      formData.append('logo', brandLogo); // Append logo to form data if provided
    }

    try {
      // Dispatch addBrandAsync thunk instead of Axios directly
      const result = await dispatch(addBrandAsync(formData)).unwrap();

      setSuccessMessage('Brand added successfully!'); // Show success message
      setError(''); // Clear any previous error messages

      // Navigate to Manage Brands page after a short delay
      setTimeout(() => {
        navigate('/adminpanel/ManageBrands');
      }, 2000);
    } catch (err) {
      setError(err || 'Failed to add brand. Please try again.'); // Handle errors
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-gray-100 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add Brand</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>} {/* Show error message if any */}
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>} {/* Show success message if any */}
      {loading && <div>Loading...</div>} {/* Show loading state */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="brandName">Brand Name</label>
          <input
            type="text"
            id="brandName"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            placeholder="Enter brand name"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="brandLogo">Brand Logo (Optional)</label>
          <input
            type="file"
            id="brandLogo"
            onChange={(e) => setBrandLogo(e.target.files[0])}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
            accept="image/*"
          />
        </div>

        <button
          type="submit"
          className="w-auto bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700"
          disabled={loading} // Disable button when loading
        >
          {loading ? 'Adding...' : 'Add Brand'}
        </button>
      </form>
    </div>
  );
};

export default AddBrand;
