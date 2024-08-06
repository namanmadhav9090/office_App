// store/slices/notificationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const utilSlice = createSlice({
  name: 'utils',
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {
    showLoading: (state) => {
      state.loading = true;
    },
    hideLoading: (state) => {
      state.loading = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { showLoading, hideLoading, setError, clearError } = utilSlice.actions;
export default utilSlice.reducer;
