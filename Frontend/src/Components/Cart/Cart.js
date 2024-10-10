import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { deleteCartItemAsync } from '../../Store/cartslice'; // Adjust the import path accordingly

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const userId = JSON.parse(localStorage.getItem('user')).id;

                const response = await axios.get(`http://localhost:4000/GetCart/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('sectoken')}`,
                    },
                });
                setCartItems(response.data);
                calculateTotalPrice(response.data); // Recalculate total price with fetched items
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch cart items');
                setLoading(false);
            }
        };

        fetchCartItems();
    }, []);

    // Helper function to calculate the total price of the cart
    const calculateTotalPrice = (items) => {
        const total = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
        setTotalPrice(total);
    };

    // Update quantity of a product in the cart
    const updateQuantity = async (itemId, newQuantity) => {
        try {
            const updatedItems = cartItems.map(item => {
                if (item.id === itemId) {
                    return { ...item, quantity: newQuantity };
                }
                return item;
            });

            // Send the updated quantity to the backend
            await axios.patch(`http://localhost:4000/UpdateCartItem/${itemId}`, {
                quantity: newQuantity,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('sectoken')}`,
                },
            });

            setCartItems(updatedItems);
            calculateTotalPrice(updatedItems); // Recalculate total price with updated quantity
        } catch (err) {
            console.error('Failed to update quantity:', err);
        }
    };

    // Delete cart item
    const deleteCartItem = async (itemId) => {
        try {
            // Dispatch the delete action
            await dispatch(deleteCartItemAsync(itemId));

            // Fetch updated cart items after deletion
            const userId = JSON.parse(localStorage.getItem('user')).id;
            const response = await axios.get(`http://localhost:4000/GetCart/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('sectoken')}`,
                },
            });
            setCartItems(response.data); // Update the cart items state
            calculateTotalPrice(response.data); // Recalculate total price
        } catch (err) {
            console.error('Failed to delete item:', err);
        }
    };

    if (loading) {
        return <div className="text-center text-lg py-4">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 py-4">{error}</div>;
    }

    if (cartItems.length === 0) {
        return <div className="text-center text-lg py-4">Your cart is empty!</div>;
    }

    return (
        <div className="container w-1/2 mx-auto py-6 px-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>
            <div className="space-y-6">
                {cartItems.map((item) => (
                    <div key={item.id} className="bg-white shadow-lg rounded-lg p-6 flex items-center space-x-6">
                        <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-32 h-32 object-cover rounded-md"
                        />
                        <div className="flex-1">
                            <h2 className="text-2xl font-semibold text-gray-800">{item.product.name}</h2>
                            <p className="text-gray-600">Price: ${item.product.price}</p>
                            <p className="text-gray-600">Color: {item.color}</p>
                            <p className="text-gray-600">Size: {item.size.size}</p>

                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-2">
                                <button
                                    className="px-2 py-1 bg-gray-300 rounded"
                                    onClick={() => {
                                        if (item.quantity > 1) {
                                            updateQuantity(item.id, item.quantity - 1);
                                        }
                                    }}
                                >
                                    -
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    className="px-2 py-1 bg-gray-300 rounded"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Delete Icon */}
                        <div>
                            <FontAwesomeIcon
                                icon={faTrash}
                                className="text-red-500 cursor-pointer"
                                onClick={() => deleteCartItem(item.id)}
                                size="lg"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Total Price Section */}
            <div className="mt-8">
                <h2 className="text-2xl font-semibold text-center">Total Price: ${totalPrice.toFixed(2)}</h2>
            </div>
        </div>
    );
};

export default Cart;
