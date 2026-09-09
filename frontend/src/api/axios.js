import axios from "axios";

const axiosInstance = axios.create({
    // Use Vite's development proxy unless an environment-specific API URL is set.
    baseURL: import.meta.env.VITE_API_URL || "/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;
