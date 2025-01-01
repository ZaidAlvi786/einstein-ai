import { apiURL } from '@/config';
import axios from 'axios';

const getHeaders = () => {
    let headers = {};
    if (typeof window !== "undefined") {
        const authData = window?.localStorage?.getItem("enstine_auth") ? JSON?.parse(window?.localStorage?.getItem("enstine_auth")) : null;
        if (authData?.token) {
            headers = { ...headers, 'Authorization': `Bearer ${authData?.token}` };
        }
    };
    return headers;
}

// Create a new instance of Axios
const axiosInstance = axios.create({
    baseURL: apiURL,
    // You can add more configuration here if needed
    ...(getHeaders() && { headers: getHeaders() })

});

export default axiosInstance;
