import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'sonner';

const initialState = {
    accessToken: null,
    refreshToken: null,
    username: null,
    user_id:null,
    first_name: null,
    last_name: null,
    role: null,
    isAuthenticated: false,
};


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.username = action.payload.username;
            state.user_id = action.payload.user_id;
            state.first_name = action.payload.first_name;
            state.last_name = action.payload.last_name;
            state.role = action.payload.role;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.username = null;
            state.first_name = null;
            state.last_name = null;
            state.role = null;
            state.isAuthenticated = false;
            state.user_id = null;
        },
    },
});

export const { login, logout, restoreSession  } = authSlice.actions;

export const restoreUserSession = async (dispatch, refreshToken) => {
    try {
        if (!refreshToken) return;
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/token/refresh/`, { refresh: refreshToken });
        if (res.status === 200) {
            const newAccessToken = res.data.access;
            const data_res = await axios.post(`${import.meta.env.VITE_API_URL}/user/featch_user_data/`, { token: newAccessToken });
            console.log(data_res.data)
            dispatch(login({ accessToken: newAccessToken, refreshToken: refreshToken, username: data_res.data.username, user_id: data_res.data.id, first_name: data_res.data.first_name, last_name: data_res.data.last_name, role: data_res.data.role }));
        }
    } catch (err) {
        console.log(err)    
        toast.error(err?.response?.data?.message || "Session expired. Please log in again.")
        dispatch(logout());
    }
};

export default authSlice.reducer;