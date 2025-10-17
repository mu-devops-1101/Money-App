import axios from "axios";
import { Platform } from "react-native";

const BASE_DOMAIN = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';
const BASE_URL = `${BASE_DOMAIN}/api/v1`;
const AUTH_URL = `${BASE_DOMAIN}/api/auth`;

let jwtToken = null;

// --- Public Method: ตั้งค่า Token หลัง Login (ประกาศแค่ครั้งเดียว) ---
export const setToken = (token) => {
    jwtToken = token;
    // NOTE: In a real app, use AsyncStorage to persist the token.
};

// 2. สร้าง Axios Instance
const apiClient = axios.create({
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor: ตัวจัดการ Token อัตโนมัติสำหรับทุก Request
apiClient.interceptors.request.use(
    (config) => {
        if (jwtToken) {
            config.headers.Authorization = `Bearer ${jwtToken}`;
        }
        // กำหนด baseURL ที่ถูกต้องตามประเภทของ API
        if (config.isAuth) {
            config.baseURL = AUTH_URL;
        } else {
            config.baseURL = BASE_URL;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ----------------- Public Methods -----------------

// === Auth APIs (ใช้ isAuth: true) ===
export const registerUser = (data) => {
    return apiClient.post('/register', data, { isAuth: true });
};

export const loginUser = (data) => {
    return apiClient.post('/login', data, { isAuth: true });
};


// === Transaction/Wallet APIs (ใช้ Base URL ปกติ) ===
export const getMonthlySummary = (year, month) => {
    return apiClient.get(`/transactions/monthly-summary/${year}/${month}`);
};

export const addCategory = (category) => {
    return apiClient.post(`/categories`, category);
};

export const addPaymentMethod = (paymentMethod) => {
    return apiClient.post(`/payment-methods`, paymentMethod);
};

export const addTransaction = (transactionData) => {
    return apiClient.post('/transactions', transactionData);
};


// ----------------- Mock Data (เก็บไว้ใช้ Test) -----------------
let transactions = [];

export const mockAddTransaction = async (transaction) => {
    transactions.push(transaction);
    return { status: 201, data: { success: true, message: "Transaction added", data: transaction } };
};

export const mockGetTransactions = async () => {
    return { status: 200, data: transactions };
};