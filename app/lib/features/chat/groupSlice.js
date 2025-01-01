import { createSlice } from "@reduxjs/toolkit";

const groupSlice = createSlice({
    name: 'group',
    initialState: {
        currentActiveGroup: {},
    },
    reducers: {
        setCurrentActiveGroup: (state, action) => {
            state.currentActiveGroup = action.payload;
        },
    }
});

export const { setCurrentActiveGroup } = groupSlice.actions;

export const groupReducer = groupSlice.reducer;
