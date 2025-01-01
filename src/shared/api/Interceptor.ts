import { storagekeysEnum } from '@enums/storage.enum';
import { getItemStorage } from '@helpers/storage.helper';
import axios from 'axios';
import { logout } from './Base.api';
import { toast } from 'react-toastify';


// Create an Axios instance
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Your API base URL
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    config => {
      const token = getItemStorage(storagekeysEnum.AUTH_TOKEN);
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      // Do something with request error
      return Promise.reject(error);
    }
  
);

axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      // Handle 401 error: Unauthorized, usually trigger logout
      logout(); // Call your logout function here
    } else {
      toast.error(error?.response?.data?.detail);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

