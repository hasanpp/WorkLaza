import axios from 'axios';
import { store } from './store'
const apiUrl = import.meta.env.VITE_API_URL;

const API = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'multipart/form-data',
        
    },
});

API.interceptors.request.use(
    (config) =>{
        const token = store.getState().auth.accessToken
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) =>{
        return Promise.reject(error)
    }
)


export const sendOtp = (data) => API.post('/send-otp/', data);
export const verifyOtp = (data) => API.post('/verify-otp/', data);

export default API;