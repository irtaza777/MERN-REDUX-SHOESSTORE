import { createSlice } from '@reduxjs/toolkit';

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    admin: JSON.parse(localStorage.getItem('admin')) || null, // Initialize state from localStorage
    categories: [], // Initialize the categories array
    brands: [], // Initialize the brand array
  },
  reducers: {
    setAdmin(state, action) {
      state.admin = action.payload;
      // localStorage.setItem('admin', JSON.stringify(action.payload)); // Save to localStorage
    },
    clearAdmin(state) {
      state.admin = null;
      localStorage.removeItem('admin'); // Clear from localStorage
    },
    addCategory(state, action) {
      state.categories.push(action.payload); // Push the new category into the categories array
    },
    // New reducer for removing a category by its id
    removeCategory(state, action) {
      state.categories = state.categories.filter(category => category.id !== action.payload);
    },
    // New reducer for updating a category by its id
    updateCategory(state, action) {
      const { id, name } = action.payload; // Expecting an object with id and new name
      const categoryIndex = state.categories.findIndex(category => category.id === id);
      if (categoryIndex !== -1) {
        state.categories[categoryIndex].name = name; // Update the category's name
      }
    },
    // New reducer for adding a brand
    addBrand(state, action) {
      state.brands.push(action.payload); // Push the new brand into the brands array
    },
    // New reducer for removing a brand by its id
    removeBrand(state, action) {
      state.brands = state.brands.filter(brand => brand.id !== action.payload); // Remove brand by id
    },
    // New reducer for updating a brand by its id
    updateBrand(state, action) {
      const { id, name, logo } = action.payload; // Expecting an object with id, new name, and new logo
      const brandIndex = state.brands.findIndex(brand => brand.id === id);
      if (brandIndex !== -1) {
        state.brands[brandIndex].name = name; // Update the brand's name
        if (logo) {
          state.brands[brandIndex].logo = logo; // Update the brand's logo if provided
        }
      }
    },
  },
});

// Export the action creators for use in components
export const { 
  setAdmin, 
  clearAdmin, 
  addCategory, 
  removeCategory, 
  updateCategory, 
  addBrand, 
  removeBrand, 
  updateBrand 
} = adminSlice.actions;

export default adminSlice.reducer;
