import { createSlice } from "@reduxjs/toolkit";

const sharedChatsSlice = createSlice({
    name: 'sharedChats',
    initialState: {
        isOpenShareChats: false,
        sharedChatsSearchValue: "",
        isSharedChatsSearchLoading: false,
    },
    reducers: {
        setSharedChatsOpen: (state, action) => {
            state.isOpenShareChats = action.payload;
        },
        setSharedChatsSearchValue: (state, action) => {
            state.sharedChatsSearchValue = action.payload;
        },
        setSharedChatsSearchLoading: (state, action) => {
            state.isSharedChatsSearchLoading = action.payload;
        },
    }
});

export const { setSharedChatsOpen, setSharedChatsSearchValue, setSharedChatsSearchLoading } = sharedChatsSlice.actions;

export const sharedChatsReducer = sharedChatsSlice.reducer;