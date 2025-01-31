import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000',
});


export const sendOtp = (data) => API.post('/send-otp/', data);
export const verifyOtp = (data) => API.post('/verify-otp/', data);

export default API;