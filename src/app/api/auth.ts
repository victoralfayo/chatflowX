import axios from 'axios';

const api = axios.create({
    baseURL: '/api/auth',
    headers: {
        'Content-Type': 'application/json',
    },
});

export async function loginWithPassword(email: string, password: string) {
    try {
        const response = await api.post('/login', { email, password });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
        throw error;
    }
}

export async function sendOTP(phoneNumber: string) {
    try {
        const response = await api.post('/send-otp', { phoneNumber });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to send OTP');
        }
        throw error;
    }
}

export async function verifyOTP(phoneNumber: string, otp: string) {
    try {
        const response = await api.post('/verify-otp', { phoneNumber, otp });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'OTP verification failed');
        }
        throw error;
    }
}

export async function register(userData: {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
}) {
    try {
        const response = await api.post('/register', userData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
        throw error;
    }
}

export async function getUserProfile() {
    try {
        const response = await api.get('/user-profile');
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
        }
        throw error;
    }
}

export async function getAvailableProducts() {
    try {
        const response = await api.get('/available-products');
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to fetch available products');
        }
        throw error;
    }
}

export async function getStats() {
    try {
        const response = await api.get('/stats');
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to fetch stats');
        }
        throw error;
    }
}

export async function getNotifications() {
    try {
        const response = await api.get('/notifications');
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
        }
        throw error;
    }
}

export async function logout() {
    try {
        const response = await api.post('/logout');
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Logout failed');
        }
        throw error;
    }
}