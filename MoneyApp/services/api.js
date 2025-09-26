// services/api.js
import axios from "axios";
const BASE_URL = "http://10.0.2.2:8080/api/v1"; // Android Emulator ใช้ 10.0.2.2
const AUTH_URL = "http://10.0.2.2:8080/api/auth";

let jwtToken = null;

export const setToken = (token) => {
    jwtToken = token;
};

const request = async (url, method = "GET", body = null, isAuth = false) => {
    const headers = { "Content-Type": "application/json" };
    if (isAuth && jwtToken) {
        headers["Authorization"] = `Bearer ${jwtToken}`;
    }

    const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    });

    const data = await res.json().catch(() => ({}));
    return { status: res.status, data };
};

// === Auth APIs ===
export const registerUser = async (data) => {
    return await axios.post(`${API_URL}/register`, data);
};


export const loginUser = async (data) => {
    return await axios.post(`${API_URL}/login`, data);
};

// === Example APIs ===
export const getMonthlySummary = (year, month) =>
    request(`${BASE_URL}/transactions/monthly-summary/${year}/${month}`, "GET", null, true);

export const addCategory = (category) =>
    request(`${BASE_URL}/categories`, "POST", category, true);

export const addPaymentMethod = (paymentMethod) =>
    request(`${BASE_URL}/payment-methods`, "POST", paymentMethod, true);
