import { createSlice } from '@reduxjs/toolkit';

const otpSlice = createSlice({
    name: 'otp',
    initialState: { isOtpVerified: false }, 
    reducers: {
        verifyOtp: (state) => {
            state.isOtpVerified = true; 
        },
        setUserEmail: (state, action) => {
            state.userEmail = action.payload; 
        },
        resetOtp: (state) => {
            state.isOtpVerified = false;
        },
    },
});

export const { verifyOtp, resetOtp, setUserEmail } = otpSlice.actions;
export default otpSlice.reducer;
