import axios from 'axios';
import { Platform } from 'react-native';

// Choose the correct base URL based on environment
const getBaseURL = () => {
    if (Platform.OS === 'web') {
        // For web in Docker, use the backend service name
        return 'http://backend:8080';
    }
    // For native mobile apps or local development
    return 'http://localhost:8080';
};

const apiClient = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Add timeout
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(
    config => {
        console.log('API Request:', config.method.toUpperCase(), config.url);
        return config;
    },
    error => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
    response => {
        console.log('API Response:', response.status, response.config.url);
        return response;
    },
    error => {
        console.error('API Response Error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

export const getUserProfile = () => {
    return apiClient.get('/profile/me');
}

export const registerUser = (userData) => {
    return apiClient.post('/auth/register', userData);
};

export const loginUser = (credentials) => {
    return apiClient.post('/auth/login', credentials);
};

export const getTransactions = () => {
    return apiClient.get('/transactions');
};

export const setAuthToken = (token) => {
    if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete apiClient.defaults.headers.common['Authorization'];
    }
};

export const getMonthlySummary = (year, month) => {
    return apiClient.get(`/transactions/summary?year=${year}&month=${month}`);
};

export default apiClient;