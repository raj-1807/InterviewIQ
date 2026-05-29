import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentInterview: null,
    interviews: [],
    loading: false,
    error: null,
};

const interviewSlice = createSlice({
    name: 'interview',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.loading = true;
            state.error = null;
        },
        setCurrentInterview: (state, action) => {
            state.currentInterview = action.payload;
            state.loading = false;
        },
        updateCurrentQuestion: (state, action) => {
            if (state.currentInterview) {
                state.currentInterview.currentQuestion = action.payload;
            }
        },
        setInterviews: (state, action) => {
            state.interviews = action.payload;
            state.loading = false;
        },
        clearCurrentInterview: (state) => {
            state.currentInterview = null;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const {
    setLoading,
    setCurrentInterview,
    updateCurrentQuestion,
    setInterviews,
    clearCurrentInterview,
    setError,
} = interviewSlice.actions;

export default interviewSlice.reducer;
