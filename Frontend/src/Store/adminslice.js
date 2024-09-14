// adminSlice.js
import { createSlice } from '@reduxjs/toolkit';

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    admin: JSON.parse(localStorage.getItem('admin')) || null, // Initialize state from localStorage
  },
  reducers: {
    setAdmin(state, action) {
      state.admin = action.payload;
      //localStorage.setItem('admin', (action.payload)); // Save to localStorage
    },
    clearAdmin(state) {
      state.admin = null;
      localStorage.clear('admin'); // Clear from localStorage
    },
  },
});

export const { setAdmin, clearAdmin } = adminSlice.actions;
export default adminSlice.reducer;
