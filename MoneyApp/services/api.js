import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080',

    headers: {
        'Content-Type': 'application/json',
    },
});

export const getUserProfile = () => {
    // โดยทั่วไป Backend จะมี Endpoint เฉพาะสำหรับดึงข้อมูลผู้ใช้ปัจจุบัน
    // เช่น '/profile/me' หรือ '/users/current'
    // **คุณอาจต้องแก้ไข '/profile/me' ให้ตรงกับ Endpoint จริงของคุณ**
    return apiClient.get('/profile/me');
}

// ฟังก์ชันนี้จะถูกเรียกจากหน้า Register.js
export const registerUser = (userData) => {
    return apiClient.post('/auth/register', userData);
};

// ฟังก์ชันนี้จะถูกเรียกจากหน้า Login.js
export const loginUser = (credentials) => {
    return apiClient.post('/auth/login', credentials);
};

export const getTransactions = () => {
    return apiClient.get('/transactions');
};

export const setAuthToken = (token) => {
    if (token) {
        // ถ้ามี token, ให้ใส่เข้าไปใน Header ของทุกๆ request
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        // ถ้าไม่มี (logout), ให้ลบ Header นี้ออก
        delete apiClient.defaults.headers.common['Authorization'];
    }
};

export const getMonthlySummary = (year, month) => {
    return apiClient.get(`/transactions/summary?year=${year}&month=${month}`);
};

export default apiClient;
