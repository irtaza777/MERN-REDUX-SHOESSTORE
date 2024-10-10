import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './adminslice'; // Adjust the path as necessary
import cartReducer from './cartslice';

const store = configureStore({
  reducer: {
      cart: cartReducer,
      admin: adminReducer,
  }
});


export default store;
