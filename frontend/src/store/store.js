// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import utilSlice from './slices/utilSlice';

const store = configureStore({
  reducer: {
    utils : utilSlice
  },
});

export default store;
