import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import interviewReducer from './interviewSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        interview: interviewReducer,
    },
});

export default store;
