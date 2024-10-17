// src/components/UserOrder.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Order = () => {
    const [orders, setOrders] = useState([]); // State to store user orders
    const [loading, setLoading] = useState(true); // State to manage loading
    const [error, setError] = useState(null); // State to manage error

    const userId = JSON.parse(localStorage.getItem('user'))?.id; // Get user ID from local storage

    useEffect(() => {
        // Fetch user orders from the API when the component mounts
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/orders/${userId}`); // Adjust the API endpoint as needed
                console.log(response)
                setOrders(response.data); // Store the orders in state
            } catch (error) {
                setError('Error fetching user orders');
                console.error('Error fetching user orders:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching data
            }
        };

        if (userId) {
            fetchOrders();
        }
    }, [userId]);

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container mx-auto px-4">
  <h1 className="text-2xl font-bold mb-6 text-center">Your Orders</h1>
  
  {orders.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
          {/* User and order information */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Order #{order.id}</h2>
            <p className="text-sm text-gray-500">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
            <br></br>
            Placed by {order.user.name}
            </p>
            <p className="text-sm font-medium mt-1">Status: <span className="text-green-500">{order.status}</span></p>
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
        </div>
      ))}
    </div>
  ) : (
    <p className="text-center text-gray-500 mt-6">No orders found.</p>
  )}
</div>

    );
};

export default Order;
