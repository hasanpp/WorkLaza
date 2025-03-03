import { createSlice } from '@reduxjs/toolkit';

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

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
