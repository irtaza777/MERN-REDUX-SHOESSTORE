import React, { useEffect, useState } from 'react';
import { fetchCategoriesAsync,fetchProductsAsync } from '../../Store/adminslice'; // Use your async thunks
import { useDispatch, useSelector } from 'react-redux';

const LandingPage = () => {
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.admin.categories); // Get categories from Redux state
    const products = useSelector((state) => state.admin.products); // Get categories from Redux state
    useEffect(() => {
        dispatch(fetchCategoriesAsync()); // Fetch categories when component mounts
        dispatch(fetchProductsAsync()); // Fetch categories when component mounts
    }, [dispatch]);

  return (
    <div className="bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-indigo-600">ShoeStore</h1>
            <ul className="flex space-x-6">
              <li><a href="#home" className="text-gray-600 hover:text-indigo-600">Home</a></li>
              <li><a href="#categories" className="text-gray-600 hover:text-indigo-600">Categories</a></li>
              <li><a href="#products" className="text-gray-600 hover:text-indigo-600">Products</a></li>
              <li><a href="#contact" className="text-gray-600 hover:text-indigo-600">Contact Us</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Banner Section */}
      <section id="home" className="bg-cover bg-center h-96" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542293787938-c9e299b8800f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80')" }}>
        <div className="flex items-center justify-center h-full bg-gray-900 bg-opacity-50">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Discover the Latest in Footwear</h2>
            <p className="text-xl mb-8">Exclusive Collection of Shoes for Every Occasion</p>
            <a href="#products" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full">Shop Now</a>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-16 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Shop By Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="bg-white shadow-md rounded-lg p-4 text-center">
              <h3 className="text-xl font-semibold mt-4">{category.name}</h3>
              <a href={category.link} className="text-indigo-600 hover:text-indigo-700 mt-2 inline-block">Explore</a>
            </div>
          ))}
        </div>
      </div>
    </section>

      {/* Featured Products Section */}
      <section id="products" className="py-16">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white shadow-md rounded-lg p-4 text-center">
              <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover rounded-lg" />
              <h3 className="text-xl font-semibold mt-4">{product.name}</h3>
              <p className="text-lg font-bold text-gray-700 mt-2">${product.price}</p>
              <a href="#" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full mt-4 inline-block">Buy Now</a>
            </div>
          ))}
        </div>
      </div>
    </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 ShoeStore. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
