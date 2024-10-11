import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const Checkout = () => {
    const [cartItems, setCartItems] = useState([]);
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        province: '',
        city: '',
        mobile: '',
        address: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate(); // Initialize the navigate function

    useEffect(() => {
        const fetchUserAndCartItems = async () => {
            try {
                const userId = JSON.parse(localStorage.getItem('user')).id;

                // Fetch user details
                const userResponse = await axios.get(`http://localhost:4000/GetUser/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('sectoken')}`,
                    },
                });
                setUserDetails(userResponse.data);  // Pre-fill user data

                // Fetch cart items
                const cartResponse = await axios.get(`http://localhost:4000/GetCart/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('sectoken')}`,
                    },
                });
                console.log(cartResponse)
                setCartItems(cartResponse.data);
                calculateTotalPrice(cartResponse.data); // Recalculate total price with fetched items

                setLoading(false);
            } catch (err) {
                setError('Failed to fetch data');
                setLoading(false);
            }
        };

        fetchUserAndCartItems();
    }, []);

    // Helper function to calculate the total price of the cart
    const calculateTotalPrice = (items) => {
        const total = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
        setTotalPrice(total);
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Send order details to the backend for processing
            const orderData = {
                userId: JSON.parse(localStorage.getItem('user')).id,
                cartItems,
                totalPrice,
               
            };

            await axios.post('http://localhost:4000/CreateOrder', orderData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('sectoken')}`,
                },
            });

            // Handle success (e.g., redirect to a confirmation page)
            navigate('/ordercomfirmed')
        } catch (error) {
            console.error('Order submission failed:', error);
        }
    };

    if (loading) {
        return <div className="text-center text-lg py-4">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 py-4">{error}</div>;
    }

    return (
        <div className="container w-1/2 mx-auto py-6 px-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
            <div className="space-y-6">
                {/* Cart Items */}
                {cartItems.map((item) => (
                    <div key={item.id} className="bg-white shadow-lg rounded-lg p-6 flex items-center space-x-6">
                        <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-20 h-24 object-cover rounded-md"
                        />
                        <div className="flex-1">
                            <h2 className="text font-bold text-gray-800">{item.product.name}</h2>
                            <p className="text-gray-600">Price: ${item.product.price}</p>
                            <p className="text-gray-600">Size: {item.size.size}</p>

                            <p className="text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                    </div>
                ))}

                {/* Total Price */}
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold text-center">Total Price: ${totalPrice.toFixed(2)}</h2>
                </div>

                {/* Order Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Name</label>
                        <input
                            type="text"
                            value={userDetails.name}
                            onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                            className="border border-gray-300 p-2 w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            value={userDetails.email}
                            onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                            className="border border-gray-300 p-2 w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Province</label>
                        <input
                            type="text"
                            value={userDetails.province}
                            onChange={(e) => setUserDetails({ ...userDetails, province: e.target.value })}
                            className="border border-gray-300 p-2 w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">City</label>
                        <input
                            type="text"
                            value={userDetails.city}
                            onChange={(e) => setUserDetails({ ...userDetails, city: e.target.value })}
                            className="border border-gray-300 p-2 w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Mobile</label>
                        <input
                            type="text"
                            value={userDetails.mobile}
                            onChange={(e) => setUserDetails({ ...userDetails, mobile: e.target.value })}
                            className="border border-gray-300 p-2 w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Address</label>
                        <input
                            type="text"
                            value={userDetails.address}
                            onChange={(e) => setUserDetails({ ...userDetails, address: e.target.value })}
                            className="border border-gray-300 p-2 w-full"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Place Order
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
