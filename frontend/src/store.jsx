import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import authReducer from './authSlice';
import { combineReducers } from 'redux';
import otpReducer from './otpSlice';


const authPersistConfig = {
    key: 'auth',
    storage,
    whitelist: ['refreshToken'],
};

const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authReducer),
    otp: otpReducer,
});


// const persistConfig = {
//     key: 'root',
//     storage,
// };


// const persistedReducer = persistReducer(persistConfig, rootReducer);
 

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});


const persistor = persistStore(store);

export { store, persistor };
