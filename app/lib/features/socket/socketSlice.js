import { createSlice } from '@reduxjs/toolkit';

const webSocketSlice = createSlice({
    name: 'webSocket',
    initialState: {
        ws: {},
        connected: false,
        messages: {},
        error: null,
    },
    reducers: {
        setWebSocket: (state, action) => {
            state.ws = action.payload;
        },
        setConnected: (state, action) => {
            state.connected = action.payload;
        },
        addMessage: (state, action) => {
            state.messages = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setWebSocket, setConnected, addMessage, setError } = webSocketSlice.actions;

export default webSocketSlice.reducer;