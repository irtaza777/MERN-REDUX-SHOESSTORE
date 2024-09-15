import React, { useState } from 'react'; // Import React and useState for managing component state
import { useNavigate } from 'react-router-dom'; // Import hook for navigation
import axios from 'axios'; // Import Axios for making HTTP requests
import { useDispatch, useSelector } from 'react-redux';
import { addBrand } from '../Store/adminslice'; // Import the addBrand action

const AddBrand = () => {
    const [brandName, setBrandName] = useState(''); // State to hold brand name
    const [brandLogo, setBrandLogo] = useState(null); // State to hold brand logo
    const [error, setError] = useState(''); // State to hold error messages
    const [successMessage, setSuccessMessage] = useState(''); // State to hold success message
    const navigate = useNavigate(); // Hook to programmatically navigate between routes
    
    const Brands = useSelector((state) => state.admin.Brands); // Fetching brands from Redux state

    const dispatch = useDispatch(); // Hook to dispatch actions

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Validation
        if (!brandName) {
            setError('Brand name is required'); // Set error if brand name is empty
            return;
        }

        if (brandName.length < 3 || brandName.length > 50) {
            setError('Brand name must be between 3 and 50 characters'); // Set error if brand name is not in valid length
            return;
        }

        // Check if Brand already exists locally (client-side validation)
        if (Array.isArray(Brands) && Brands.some(Brand => Brand.name.toLowerCase() === brandName.toLowerCase())) {
            setError('Brand already exists. Please enter a unique brand name.'); // Set error if brand already exists
            return;
        }

        const formData = new FormData(); // Create FormData object
        formData.append('name', brandName); // Append brand name to form data
        if (brandLogo) {
            formData.append('logo', brandLogo); // Append logo to form data if provided
        }

        try {
            const response = await axios.post('http://localhost:4000/AdminPanel/Brands', formData, { // Use your API URL here
                headers: {
                    'Content-Type': 'multipart/form-data', // Set content type for file upload
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Send token for authentication
                },
            });

            if (response.status === 201) {
                dispatch(addBrand(response.data)); // Dispatch the new brand to Redux state
                setSuccessMessage('Brand added successfully!'); // Show success message
                setError(''); // Clear any previous error messages
                setTimeout(() => {
                    navigate('/adminpanel/ManageBrands'); // Navigate to Manage Brands page after a short delay
                }, 2000); // Delay for 2 seconds before navigation
            } else {
                setError('Failed to add brand'); // Set generic error message
            }
        } catch (err) {
            // Check if there is a response from the server
            if (err.response) {
                setError(err.response.data.message || 'Failed to add brand'); // Set error message from server
            } else {
                setError('An error occurred. Please try again.'); // Handle network errors
            }
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto bg-gray-100 shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Add Brand</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>} {/* Show error message if any */}
            {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>} {/* Show success message if any */}
            <form onSubmit={handleSubmit}>
                <div className="mb-4"> {/* Input field for brand name */}
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

                <div className="mb-4"> {/* Input field for brand logo */}
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
                    className="w-auto bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700" // Button styling
                >
                    Add Brand
                </button>
            </form>
        </div>
    );
};

export default AddBrand;
