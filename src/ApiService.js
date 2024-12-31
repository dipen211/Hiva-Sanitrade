import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || "https://billingservice-wq93.onrender.com/api/",
    timeout: 100000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error("API Error:", error.response.data.message || error.response.statusText);
        } else if (error.request) {
            console.error("Network Error: No response received from server.");
        } else {
            console.error("Error:", error.message);
        }
        return Promise.reject(error);
    }
);

const apiService = {
    get: async (url, params = {}, config = {}) => {
        try {
            const response = await apiClient.get(url, { params, ...config });
            return response.data;
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    },

    post: async (url, data = {}, config = {}) => {
        try {
            const response = await apiClient.post(url, data, { ...config });
            return response.data;
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    },

    put: async (url, data = {}, config = {}) => {
        try {
            const response = await apiClient.put(url, data, { ...config });
            return response.data;
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    },

    delete: async (url, config = {}) => {
        try {
            const response = await apiClient.delete(url, { ...config });
            return response.data;
        } catch (error) {
            handleApiError(error);
            throw error;
        }
    },
};

const handleApiError = (error) => {
    if (error.response) {
        const { status, data } = error.response;
        switch (status) {
            case 400:
                console.error("Bad Request:", data.message || "Invalid request.");
                break;
            case 401:
                console.error("Unauthorized:", data.message || "You need to log in.");
                break;
            case 403:
                console.error("Forbidden:", data.message || "You don't have access.");
                break;
            case 404:
                console.error("Not Found:", data.message || "The resource was not found.");
                break;
            case 500:
                console.error("Server Error:", data.message || "Something went wrong on the server.");
                break;
            default:
                console.error("Error:", data.message || "An unexpected error occurred.");
        }
    } else if (error.request) {
        console.error("Network Error:", "No response received from the server.");
    } else {
        console.error("Error:", error.message);
    }
};

export default apiService;
