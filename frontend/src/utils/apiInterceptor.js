import axios from 'axios';
import Cookies from 'js-cookie';
// Import your Redux actions (replace with actual imports)
// import { setLoading, setError, clearError } from '../redux/actions';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Replace with your API base URL
  timeout: 10000, // Set timeout if needed
});

// Axios request interceptor
api.interceptors.request.use(
  (config) => {
    // You can also add authorization headers or modify the request config here
    // const token = localStorage.getItem('token'); // Example token retrieval
    const token = Cookies.get("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Optionally set a loading indicator here if needed
    // dispatch(setLoading(true));
    return config;
  },
  (error) => {
    // Optionally handle the request error here
    // dispatch(setLoading(false));
    // dispatch(setError(error.message || 'An error occurred during the request.'));
    return Promise.reject(error);
  }
);

// Axios response interceptor
api.interceptors.response.use(
  (response) => {
    // Optionally handle the successful response
    // dispatch(setLoading(false));
    // dispatch(clearError());
    return response;
  },
  (error) => {
    // Optionally handle the response error here
    // dispatch(setLoading(false));
    // dispatch(setError(error.message || 'An error occurred during the response.'));
    return Promise.reject(error);
  }
);

export default api;
