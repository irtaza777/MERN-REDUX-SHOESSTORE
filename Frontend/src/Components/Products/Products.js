import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiFilter } from 'react-icons/fi'; // Import filter icon from react-icons
import '../../Css/Products/Products.css'; // Import CSS for posts
const Products = () => {
    const [products, setProducts] = useState([]); // State for all products
    const [filteredProducts, setFilteredProducts] = useState([]); // State for filtered products
    const [categories, setCategories] = useState([]); // State for categories
    const [brands, setBrands] = useState([]); // State for brands
    const [sizes, setSizes] = useState([6, 7, 8, 9, 10]); // State for available sizes
    const [selectedCategory, setSelectedCategory] = useState(null); // State for selected category
    const [selectedBrand, setSelectedBrand] = useState(null); // State for selected brand
    const [selectedSize, setSelectedSize] = useState(null); // State for selected size
    const [minPrice, setMinPrice] = useState(0); // State for minimum price
    const [maxPrice, setMaxPrice] = useState(1000); // State for maximum price
    const [sidebarOpen, setSidebarOpen] = useState(false); // State to control sidebar visibility

    // Fetch products, categories, and brands
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch products
                const productsResponse = await axios.get('http://localhost:4000/Products', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('sectoken')}`,
                    },
                });
                setProducts(productsResponse.data);
                setFilteredProducts(productsResponse.data); // Set initial filtered products

                // Fetch categories
                const categoriesResponse = await axios.get('http://localhost:4000/Categories', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('sectoken')}`,
                    },
                });
                setCategories(categoriesResponse.data);

                // Fetch brands
                const brandsResponse = await axios.get('http://localhost:4000/Brands', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('sectoken')}`,
                    },
                });
                setBrands(brandsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Filter products based on category, brand, size, and price range
    useEffect(() => {
        const filtered = products.filter(product => {
            const inSelectedCategory = selectedCategory ? product.categoryId === selectedCategory.id : true;
            const inSelectedBrand = selectedBrand ? product.brandId === selectedBrand.id : true;
            const inSelectedSize = selectedSize ? product.sizes.some(size => size.size === selectedSize) : true;
            const priceMatch = product.price >= minPrice && product.price <= maxPrice;

            return inSelectedCategory && inSelectedBrand && inSelectedSize && priceMatch; // Return true if all conditions match
        });
        setFilteredProducts(filtered); // Update filtered products
    }, [selectedCategory, selectedBrand, selectedSize, minPrice, maxPrice, products]);

    // Handle category selection
    const handleCategoryClick = (category) => {
        setSelectedCategory(category); // Set selected category
    };

    // Handle brand selection
    const handleBrandClick = (brand) => {
        setSelectedBrand(brand); // Set selected brand
    };

    // Handle size selection
    const handleSizeClick = (size) => {
        setSelectedSize(size); // Set selected size
    };

    // Toggle sidebar visibility
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="container mx-auto py-10 flex flex-col">
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold">Footwear Collection</h1>
                <p className="text-gray-500">Discover the latest trends</p>
            </header>

            <button
                onClick={toggleSidebar}
                className="mb-4  text-black text-3xl "
            >
                <FiFilter className="mr-2" /> {/* Filter Icon */}
            </button>

            <div className="flex flex-row">
                {sidebarOpen && (
                    <aside className="w-64 pr-4 transition-transform duration-300 ease-in-out">
                        {/* Sidebar for filters */}
                        <div className="mb-10">
                            <h2 className="text-2xl font-bold text-center mb-6">Shop by Category</h2>
                            <div className="flex justify  flex-wrap">
                                {categories.map((category) => (
                                    <div key={category.id}
                                        className="bg-blue-100 p-4 m-1 rounded-full shadow-lg transform transition-transform hover:scale-105 cursor-pointer"
                                        onClick={() => handleCategoryClick(category)}>
                                        <span className="text-center text-balance font-medium ">{category.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Brands Section */}
                        <div className="mb-10">
                            <h2 className="text-2xl font-bold text-center mb-6">Shop by Brand</h2>
                            <div className="flex justify  flex-wrap">
                                {brands.map((brand) => (
                                    <div key={brand.id}
                                        className="bg-green-100 p-4 m-1 rounded-full shadow-lg transform transition-transform hover:scale-105 cursor-pointer"
                                        onClick={() => handleBrandClick(brand)}>
                                        <span className="text-center text-balance font-medium">{brand.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Size Filter Section */}
                        <div className="mb-10">
                            <h2 className="text-2xl font-bold text-center mb-6">Filter by Size</h2>
                            <div className="flex justify  flex-wrap">
                                {sizes.map((size) => (
                                    <div key={size}
                                        className="border rounded px-4 py-2 cursor-pointer hover:bg-gray-200 m-1"
                                        onClick={() => handleSizeClick(size)}>
                                        <span className="text-center font-medium">{size}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Price Range Filter */}
                        <div className="mb-10 w-40 mx-auto">
                            <h2 className="text-2xl font-bold text-center mb-6">Filter by Price</h2>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-semibold">Min: ${minPrice}</label>
                                <label className="text-sm font-semibold">Max: ${maxPrice}</label>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1000"
                                step="50"
                                value={minPrice}
                                onChange={(e) => setMinPrice(Number(e.target.value))}
                                className="w-full mb-4"
                            />
                            <input
                                type="range"
                                min="0"
                                max="1000"
                                step="50"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>
                    </aside>
                )}

                <main className={`flex-grow transition-all duration-300 ${sidebarOpen ? 'ml-2' : 'ml-4'}`}>
                    {/* Header */}
                    
                    {/* Product Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 ml-5 ">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="bg-slate-100 shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                {/* Product Image */}
                                <div className="relative">
                                    <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover" />
                                </div>
                                {/* Product Details */}
                                <div className="p-4 text-center ">
                                    <h2 className="text-lg font-medium text-gray-800">{product.name}</h2>
                                    <p className="text-gray-600 mt-1">${product.price}</p>
                                    {/* Display available colors */}
                                    <div className="mt-2">
                                        <span className="font-semibold">Available Colors:</span>
                                        <div className="flex space-x-2 mt-1">
                                            {product.colors.map((color) => (
                                                <div
                                                    key={color.id}
                                                    className="w-6 h-6 rounded-full"
                                                    style={{ backgroundColor: color.color.name.toLowerCase() }}
                                                    title={color.color.name}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Display available sizes */}
                                    <div className="mt-2">
                                        <span className="font-semibold">Available Sizes:</span>
                                        <div className="flex space-x-2 mt-1">
                                            {product.sizes.map((size) => (
                                                <span
                                                    key={size.id}
                                                    className="px-2 py-1 bg-gray-200 text-sm rounded-md"
                                                >
                                                    {size.size}
                                                </span>
                                            ))}
                                        </div>
                                         {/* Add to Cart Button */}
                            <button className="mt-4 p-4 bg-orange-600 text-white py-2 rounded hover:bg-red-950 transition duration-200">
                                Add to Cart
                            </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                      {/* No Products Message */}
            {filteredProducts.length === 0 && (
                <div className="text-center text-gray-500 mt-10">
                    <p>No products found for the selected filters.</p>
                </div>
            )}
                </main>
            </div>
        </div>
    );
};

export default Products;
