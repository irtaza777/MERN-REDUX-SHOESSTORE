import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTruck } from 'react-icons/fa'; // Import the dispatch truck icon from react-icons

const AdminOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetching orders when the component mounts
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:4000/Adminorders');
                setOrders(response.data);
            } catch (error) {
                setError('Error fetching user orders');
                console.error('Error fetching user orders:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    // Function to handle dispatch click
    const handleDispatch = async (orderId) => {
        try {
            // Make an API call to update the order status to 'on'
            await axios.put(`http://localhost:4000/Dispatchorder/${orderId}`, { status: 'on' });
            
            // Update the local state to reflect the status change
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: 'on' } : order
            ));
        } catch (error) {
            console.error('Error dispatching order:', error);
        }
    };

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold mb-6 text-center">All Orders</h1>

            {orders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                            {/* User and order information */}
                            <div className="mb-4">
                                <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                                <p className="text-sm text-gray-500">
                                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                                    <br />
                                    Placed by {order.user.name}
                                </p>
                                <p className="text-sm font-medium mt-1">
                                    Status: <span className="text-green-500">{order.status}</span>
                                </p>
                            </div>

                            {/* Products */}
                            <div className="border-t pt-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center py-2">
                                        <div className="flex items-center">
                                            {/* Product image */}
                                            <img 
                                                src={item.product.imageUrl} 
                                                alt={item.product.name} 
                                                className="w-16 h-16 object-cover rounded-md mr-4"
                                            />
                                            <div>
                                                {/* Product name and details */}
                                                <p className="text-sm font-semibold">{item.product.name}</p>
                                                <p className="text-xs text-gray-500">Size: {item.size.size}</p>
                                                <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                                            </div>
                                        </div>
                                        {/* Price */}
                                        <p className="text-sm font-semibold">Price: ${item.price}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Order summary */}
                            <div className="mt-4">
                                <p className="text-lg font-semibold">Total: ${order.total}</p>
                            </div>

                            {/* Dispatch icon */}
                            {order.status !== 'on' && (
                                <button
                                    onClick={() => handleDispatch(order.id)}
                                    className="mt-4 flex items-center justify-center text-blue-500 hover:text-blue-700"
                                    title="Dispatch Order"
                                >
                                    <FaTruck className="mr-2" /> Dispatch
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 mt-6">No orders found.</p>
            )}
        </div>
    );
};

export default AdminOrder;
