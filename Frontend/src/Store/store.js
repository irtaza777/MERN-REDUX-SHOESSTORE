import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './adminslice'; // Adjust the path as necessary

const store = configureStore({
  reducer: {
    admin: adminReducer, // Include the admin slice reducer
  },
});

export default store;
