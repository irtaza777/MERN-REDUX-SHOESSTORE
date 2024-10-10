import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for adding a product to the cart
export const addToCartAsync = createAsyncThunk(
    'cart/addToCart',
    async ({ userId, productId, name, price, imageUrl, selectedColor, selectedSize }, { rejectWithValue }) => {
        console.log(userId)
        try {
            const response = await axios.post('http://localhost:4000/AddToCart', {
                userId,
                productId,
                name,
                price,
                imageUrl,
                selectedColor,
                selectedSize,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('sectoken')}`,
                },
            });

            return response.data; // Assuming the response contains the updated cart or relevant data
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
// Async thunk to fetch cart count
export const fetchCartCountAsync = createAsyncThunk(
    'cart/fetchCartCount',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`http://localhost:4000/GetCartCount/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('sectoken')}`,
                },
            });
            console.log( response.data)

            return response.data.count; // Assuming API returns count in response
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
// Thunk to delete a cart item and fetch updated cart items
// Thunk to delete a cart item
export const deleteCartItemAsync = createAsyncThunk(
    'cart/deleteCartItem',
    async (itemId, { rejectWithValue, dispatch }) => {
        try {
            // Call the backend to delete the item
            await axios.delete(`http://localhost:4000/DeleteCartItem/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('sectoken')}`,
                },
            });

            // Return the itemId if deletion is successful
            return itemId; // You can use this to remove the item from the Redux state if necessary

        } catch (error) {
            // Handle error and reject with value
            return rejectWithValue(error.response?.data?.message || 'An error occurred');
        }
    }
);
// Create a slice of the state
const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [], // Array to hold cart items
        cartCount: 0,
        loading: false,
        error: null,
    },
    
    reducers: {
        // You can add synchronous reducers here if needed
       
    },
    extraReducers: (builder) => {
        builder
            .addCase(addToCartAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCartAsync.fulfilled, (state, action) => {
                // Assuming action.payload contains the added item
                state.items.push(action.payload);
                state.cartCount = state.items.length; // Update cart count
                state.loading = false;
            })
            .addCase(addToCartAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Set error message
            })
            .addCase(fetchCartCountAsync.pending, (state) => {
            state.loading = true;
            state.error = null;

        })
        .addCase(fetchCartCountAsync.fulfilled, (state, action) => {
            console.log("Cart count from API payload:", action.payload); // This should log the payload
            state.cartCount = action.payload; // Update cartCount with API response
            state.loading = false; // Update loading state
        })
        .addCase(fetchCartCountAsync.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload; // Set error message
            console.error("Error in cart count:", action.payload); // Log error payload
        })
        .addCase(deleteCartItemAsync.fulfilled, (state, action) => {
            // Remove the deleted item from the cartItems
            state.cartItems = state.items.filter(item => item.id !== action.payload);
            state.cartCount -= 1; // Adjust the cart count
        })
        .addCase(deleteCartItemAsync.rejected, (state, action) => {
            // Handle error case
            state.error = action.payload; // Store the error message
        });
       
    },
});

// Export the reducer and actions
export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
