/* eslint-disable no-unused-vars */
import axios from "axios";
import { store } from "../../store";
import { login, logout } from "../../authSlice";
import { toast } from "sonner";


const isTokenValid = (token) => {
    try {
        if (!token) return false;
        const decoded = JSON.parse(atob(token.split(".")[1])); 
        return decoded.exp > Date.now() / 1000; 
    } catch (error) {
        return false;
    }
};

const refreshTokenHandler = async () => {
    try {
        const { refreshToken } = store.getState().auth;
        if (!refreshToken) throw new Error("No refresh token available");

        const res = await axios.post(`${import.meta.env.VITE_API_URL}/token/refresh/`, { refresh: refreshToken });

        if (res.status === 200) {
            const newAccessToken = res.data.access;
            const data_res = await axios.post(`${import.meta.env.VITE_API_URL}/user/featch_user_data/`, { token: newAccessToken });

            store.dispatch(login({
                accessToken: newAccessToken,
                refreshToken: refreshToken,
                username: data_res.data.username,
                user_id: data_res.data.id,
                first_name: data_res.data.first_name,
                last_name: data_res.data.last_name,
                role: data_res.data.role
            }));

            return newAccessToken; 
        }
    } catch (error) {
        store.dispatch(logout()); 
        toast.error("Session expired. Please log in again.");
        throw new Error("Token refresh failed");
    }
};


const secureRequest = async (requestFn, ...args) => {
    let { accessToken } = store.getState().auth;

    if (!isTokenValid(accessToken)) {
        try {
            accessToken = await refreshTokenHandler(); 
        } catch (error) {
            return;
        }
    }

    try {
        return await requestFn(...args); 
    } catch (err) {
        console.error("API Request Error:", err);
        err?.response?.data?.message && toast.error(err?.response?.data?.message)
    }
};


export default secureRequest