import { createSlice } from "@reduxjs/toolkit";

const workspaceSlice = createSlice({
    name: 'workspace',
    initialState: {
        workspaces: [],
        activeWorkspace: null
    },
    reducers: {
        // Add custom reducers here if needed
        updateWorkspaces: (state, action) => {
            state.workspaces = action.payload;
        },
        setActiveWorkspace: (state, action) => {
            state.activeWorkspace = action.payload;
        },
    }
});



export const { updateWorkspaces, setActiveWorkspace } = workspaceSlice.actions;

export const workspaceReducer = workspaceSlice.reducer;
