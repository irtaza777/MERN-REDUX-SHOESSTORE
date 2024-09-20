import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk for fetching categories
export const fetchCategoriesAsync = createAsyncThunk(
  'admin/fetchCategoriesAsync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:4000/AdminPanel/AllCategories', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Send token for authentication
        },
      });
      return response.data; // Assuming response data contains the categories
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'An error occurred while fetching categories');
    }
  }
);

// Thunk for fetching brands
export const fetchBrandsAsync = createAsyncThunk(
  'admin/fetchBrandsAsync',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:4000/AdminPanel/AllBrands', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Send token for authentication
        },
      });
      return response.data; // Assuming response data contains the brands
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'An error occurred while fetching brands');
    }
  }
);

// Thunk for adding a new category
export const addCategoryAsync = createAsyncThunk(
  'admin/addCategoryAsync',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:4000/AdminPanel/AddCategory', categoryData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Send token for authentication
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'An error occurred');
    }
  }
);

// Thunk for deleting a category
export const deleteCategoryAsync = createAsyncThunk(
  'admin/deleteCategoryAsync',
  async (categoryId, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:4000/AdminPanel/DeleteCategory/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return categoryId; // Return the deleted category ID
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'An error occurred');
    }
  }
);

// Thunk for updating a category
export const updateCategoryAsync = createAsyncThunk(
  'admin/updateCategoryAsync',
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:4000/AdminPanel/UpdateCategory/${id}`, { name }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'An error occurred');
    }
  }
);

// Thunk for adding a new brand
export const addBrandAsync = createAsyncThunk(
  'admin/addBrandAsync',
  async (brandData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:4000/AdminPanel/Brands', brandData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'An error occurred');
    }
  }
);

// Thunk for deleting a brand
export const deleteBrandAsync = createAsyncThunk(
  'admin/deleteBrandAsync',
  async (brandId, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:4000/AdminPanel/DeleteBrand/${brandId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return brandId; // Return the deleted brand ID
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'An error occurred');
    }
  }
);

// Thunk for updating a brand
export const updateBrandAsync = createAsyncThunk(
  'admin/updateBrandAsync',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:4000/AdminPanel/UpdateBrand/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log(response)

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'An error occurred');
    }
  }
);

// Thunk for adding a new product
export const addProductAsync = createAsyncThunk(
  'admin/addProductAsync',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:4000/AdminPanel/AddProduct', productData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Change this based on your API
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Send token for authentication
        },
      });
      console.log(response)
      return response.data; // Assuming response data contains the added product
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'An error occurred while adding the product');
    }
  }
);
// Add shoe sizes async action
export const addShoeSizesAsync = createAsyncThunk(
  'admin/addShoeSizes',
  async ({ productId, sizes, stocks }, { rejectWithValue }) => {
    console.log(sizes)
    try {
      const response = await axios.post('http://localhost:4000/AdminPanel/Product/AddShoesizes', {
        productId, // Send productId as integer
        sizes,     // Send sizes as array of floats/integers
        stocks,    // Send stocks as array of integers
      }, {
        headers: {
          'Content-Type': 'application/json', // Ensure it's JSON
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Send token for authentication
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error adding shoe sizes:', error.response);
      return rejectWithValue(error.response.data);
    }
  }
);
//fetch shoesize thunk
export const fetchShoeSizesAsync = createAsyncThunk('admin/fetchShoeSizes', {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
} ,async () => {
  const response = await axios.get('/api/shoesizes'); // Replace with actual API endpoint
  return response.data;
});

//update shoesize thunk
export const updateShoeSizesAsync = createAsyncThunk(
  'admin/updateShoeSizes',
  async ({ productId, sizes, stocks }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:4000/AdminPanel/Product/UpdateShoeSizes`, {
        productId,
        sizes,
        stocks,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error updating shoe sizes:', error.response);
      return rejectWithValue(error.response.data);
    }
  }
);
//Delete shoesize thunk

export const deleteShoeSizesAsync = createAsyncThunk(
  'admin/deleteShoeSizes',
  async ({ productId, sizeId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`http://localhost:4000/AdminPanel/Product/DeleteShoeSizes/${productId}/${sizeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      return response.data; // Assuming success response contains some data
    } catch (error) {
      console.error('Error deleting shoe size:', error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

// Define the fetchProductsAsync thunk
export const fetchProductsAsync = createAsyncThunk(
  'admin/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:4000/AdminPanel/Products'); // Adjust the URL as needed
      return response.data; // Assuming your API returns a list of products
    } catch (error) {
      return rejectWithValue(error.response.data); // Handle errors gracefully
    }
  }
);
const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    admin: JSON.parse(localStorage.getItem('admin')) || null,
    categories: [],
    brands: [],
    products: [],
    Shoesizes: [],
    loading: false,
    error: null,
  },
  reducers: {
    setAdmin(state, action) {
      state.admin = action.payload;
    },
    clearAdmin(state) {
      state.admin = null;
      localStorage.clear('admin');
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle the fetchCategoriesAsync thunk
      .addCase(fetchCategoriesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload; // Assuming response contains the array of categories
      })
      .addCase(fetchCategoriesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle the fetchBrandsAsync thunk
      .addCase(fetchBrandsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrandsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload; // Assuming response contains the array of brands
      })
      .addCase(fetchBrandsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle the addCategoryAsync thunk
      .addCase(addCategoryAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategoryAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(addCategoryAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle the deleteCategoryAsync thunk
      .addCase(deleteCategoryAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategoryAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(category => category.id !== action.payload);
      })
      .addCase(deleteCategoryAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle the updateCategoryAsync thunk
      .addCase(updateCategoryAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategoryAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCategory = action.payload;
        const index = state.categories.findIndex(category => category.id === updatedCategory.id);
        if (index !== -1) {
          state.categories[index] = updatedCategory;
        }
      })
      .addCase(updateCategoryAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle the addBrandAsync thunk
      .addCase(addBrandAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBrandAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.brands.push(action.payload);
      })
      .addCase(addBrandAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle the deleteBrandAsync thunk
      .addCase(deleteBrandAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBrandAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = state.brands.filter(brand => brand.id !== action.payload);
      })
      .addCase(deleteBrandAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle the updateBrandAsync thunk
      .addCase(updateBrandAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBrandAsync.fulfilled, (state, action) => {
        state.loading = false;
        const updatedBrand = action.payload;
        const index = state.brands.findIndex(brand => brand.id === updatedBrand.id);
        if (index !== -1) {
          state.brands[index] = updatedBrand;
        }
      })
      .addCase(updateBrandAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle the addProductAsync thunk
      .addCase(addProductAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProductAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload); // Assuming response contains the added product
      })
      .addCase(addProductAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //Add addShoeSizesAsync thunk 
      .addCase(addShoeSizesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;

      })
      .addCase(addShoeSizesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.Shoesizes.push(action.payload); // Assuming response contains the added product
      })
      .addCase(addShoeSizesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProductsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload; // Assuming response contains the list of products
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store the error message
      })
      // Fetch Shoe Sizes
      .addCase(fetchShoeSizesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShoeSizesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.Shoesizes = action.payload; // Set fetched sizes
      })
      .addCase(fetchShoeSizesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Shoe Sizes
      .addCase(updateShoeSizesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShoeSizesAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.shoeSizes.findIndex(size => size.id === action.payload.id);
        if (index !== -1) {
          state.Shoesizes[index] = action.payload; // Update the size
        }
      })
      .addCase(updateShoeSizesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Shoe Sizes
      .addCase(deleteShoeSizesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteShoeSizesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.Shoesizes = state.shoeSizes.filter(size => size.id !== action.meta.arg.sizeId); // Remove size
      })
      .addCase(deleteShoeSizesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });


  },
});

// Export actions and reducer
export const { setAdmin, clearAdmin, setBrands, addBrand, removeBrand, updateBrand, addProduct } = adminSlice.actions;
export default adminSlice.reducer;
