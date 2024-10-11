import React from 'react';
import { useNavigate } from 'react-router-dom';

const Ordercomfirmed = () => {
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    // Redirect to the shop or products page
    navigate('/Products'); // Change '/products' to your desired route
  };

  return (
    <div className="container mx-auto text-center py-10">
      <h1 className="text-4xl font-bold mb-6">Thank You for Your Purchase!</h1>
      <p className="text-lg text-gray-700 mb-8">We appreciate your order and hope you enjoy your shopping experience with us!</p>
      <button
        onClick={handleContinueShopping}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default Ordercomfirmed;
