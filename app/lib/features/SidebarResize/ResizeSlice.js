import { createSlice } from "@reduxjs/toolkit";

const sidebarResizeSlice = createSlice({
    name: 'sidebarResize',
    initialState: {
        width: 295,
    },
    reducers: {
        setSidebarSize: (state, action) => {
            state.width = action.payload;
        },
    }
});

export const { setSidebarSize } = sidebarResizeSlice.actions;

export const sidebarResizeReducer = sidebarResizeSlice.reducer;