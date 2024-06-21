import axios from 'axios';

// Fetching API URL from environment variables
const apiUrl = import.meta.env.VITE_APP_API_URL;

// Creating Axios instance with baseURL
const axiosInstance = axios.create({
  baseURL: `${apiUrl}/api`, // Base URL for API requests
});

// Request interceptor: Modify outgoing requests
axiosInstance.interceptors.request.use((config) => {
  // Fetching token from session storage
  const token = sessionStorage.getItem('gett') ? decodeURIComponent(window.atob(sessionStorage.getItem('gett') as string)) : undefined;

  // Adding Authorization header if token exists
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor: Handle responses
axiosInstance.interceptors.response.use(
  // Successful response handler: Extracting data
  (response) => response.data,

  // Error response handler: Handle errors
  (error) => {
    const errorResponse = error.response; // Extracting error response

    if (errorResponse) {
      const errorMessage = errorResponse.data.message || 'Something went wrong'; // Extracting error message from response
      // Handle error notification or logging here
    }

    return Promise.reject(error); // Rejecting the promise with the error
  }
);

export default axiosInstance; // Exporting Axios instance configured with interceptors
