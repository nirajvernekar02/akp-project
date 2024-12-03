import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/authSlice'; // Example reducer

const store = configureStore({
  reducer: {
    auth: authReducer, // Add your reducers here
  },
});

export default store;
