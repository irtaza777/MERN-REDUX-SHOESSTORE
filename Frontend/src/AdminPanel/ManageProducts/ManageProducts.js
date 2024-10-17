import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editProduct, setEditProduct] = useState(null);
    const [productForm, setProductForm] = useState({
        name: '',
        description: '',
        imageUrl: '',
        price: '',
        stock: '',
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:4000/AdminPanel/Products',{
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                      },
                });
                setProducts(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/AdminPanel/DeleteProduct/${id}`,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
            });
            setProducts(products.filter((product) => product.id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleEdit = (product) => {
        setEditProduct(product);
        setProductForm({
            name: product.name,
            description: product.description,
            imageUrl: product.imageUrl,
            price: product.price,
            stock: product.stock,
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
    
        // Create a FormData object to handle the file and other fields
        const formData = new FormData();
        formData.append('name', productForm.name);
        formData.append('description', productForm.description);
        formData.append('price', productForm.price);
        formData.append('stock', productForm.stock);
        
        // Append the file only if it's updated
        if (productForm.imageUrl instanceof File) {
            formData.append('imageUrl', productForm.imageUrl);
        }
    
        try {
            const response = await axios.put(
                `http://localhost:4000/AdminPanel/UpdateProduct/${editProduct.id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                        
                    },
                }
            );
            setProducts(products.map((product) => (product.id === editProduct.id ? response.data : product)));
            setEditProduct(null);
        } catch (error) {
            console.error('Failed to update product:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-6">Manage Products</h1>

            {editProduct && (
         <form onSubmit={handleUpdate} className="mb-6">
         <h2 className="text-2xl">Edit Product</h2>
         <input
             type="text"
             value={productForm.name}
             onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
             placeholder="Name"
             required
             className="border p-2 mb-2 w-full"
         />
         <input
             type="text"
             value={productForm.description}
             onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
             placeholder="Description"
             required
             className="border p-2 mb-2 w-full"
         />
         {/* File input for image upload */}
         <input
             type="file"
             onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.files[0] })}
             className="border p-2 mb-2 w-full"
         />
         <input
             type="number"
             value={productForm.price}
             onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
             placeholder="Price"
             required
             className="border p-2 mb-2 w-full"
         />
         <input
             type="number"
             value={productForm.stock}
             onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
             placeholder="Stock"
             required
             className="border p-2 mb-2 w-full"
         />
         <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
             Update Product
         </button>
         <button
             type="button"
             onClick={() => setEditProduct(null)}
             className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
         >
             Cancel
         </button>
     </form>
     
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                            <th className="px-6 py-3 text-left">Image</th>
                            <th className="px-6 py-3 text-left">Name</th>
                            <th className="px-6 py-3 text-left">Description</th>
                            <th className="px-6 py-3 text-left">Price</th>
                            <th className="px-6 py-3 text-left">Stock</th>
                            <th className="px-6 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr
                                key={product.id}
                                className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} text-gray-700 hover:bg-gray-100`}
                            >
                                <td className="px-6 py-4 border-b">
                                    <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover" />
                                </td>
                                <td className="px-6 py-4 border-b">{product.name}</td>
                                <td className="px-6 py-4 border-b">{product.description}</td>
                                <td className="px-6 py-4 border-b">${product.price}</td>
                                <td className="px-6 py-4 border-b">{product.stock}</td>
                                <td className="px-6 py-4 border-b flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageProducts;
