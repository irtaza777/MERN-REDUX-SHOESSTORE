import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const LandingPage = () => {
    const dispatch = useDispatch();
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:4000/LandingPage/Products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:4000/LandingPage/Categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchBrands = async () => {
            try {
                const response = await axios.get('http://localhost:4000/LandingPage/Brands');
                setBrands(response.data);
            } catch (error) {
                console.error('Error fetching brands:', error);
            }
        };

        fetchProducts();
        fetchCategories();
        fetchBrands();
    }, []);

    return (
        <div className="bg-gray-100">
            {/* Banner Section */}
            <section
                id="home"
                className="bg-cover bg-center h-[600px]"
                style={{
                    backgroundImage: `url('https://res.cloudinary.com/dtjgspe71/image/upload/v1720786259/gaziano-girling-savile-row-boutique-16-march-2017-0095_fxjtax.jpg')`
                }}
            >
                <div className="flex items-center justify-center h-full bg-gray-900 bg-opacity-60">
                    <div className="text-center text-white">
                        <h1 className="text-5xl font-extrabold mb-4">Step into Style</h1>
                        <p className="text-lg mb-8 font-light">Find the perfect footwear for every occasion</p>
                        <a href="#products" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full shadow-lg">
                            Shop Now
                        </a>
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section id="products" className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-extrabold text-center mb-12 text-gray-800">Featured Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <div key={product.id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                                <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover" />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                                    <p className="text-lg font-bold text-gray-700 mt-2">${product.price}</p>
                                    <a href="#" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full mt-4 inline-block">Buy Now</a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section id="categories" className="p-16 bg-gray-50 justify-between">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-extrabold text-center mb-12 text-gray-800">Shop by Category</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
                        {categories.map((category) => (
                            <div key={category.id} className="bg-white shadow-md rounded-lg p-6 text-center">
                                <h3 className="text-xl font-semibold text-gray-800">{category.name}</h3>
                                <a href={category.link} className="text-indigo-600 hover:text-indigo-800 mt-2 inline-block">
                                    Explore
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Brands Section */}
            <section id="brands" className="py-16 bg-gray-100">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-extrabold text-center mb-12 text-gray-800">Shop by Brand</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {brands.map((brand) => (
                            <div key={brand.id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                                <img src={brand.imageUrl} alt={brand.name} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold text-gray-800">{brand.name}</h3>
                                    <a href={brand.link} className="text-indigo-600 hover:text-indigo-700 mt-2 inline-block">Explore</a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-6 mt-12">
                <div className="container mx-auto text-center">
                    <p>&copy; 2024 ShoeStore. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
