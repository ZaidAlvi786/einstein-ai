import { createSlice } from "@reduxjs/toolkit";



const addTenentSlice = createSlice({
    name: 'addTenent',
    initialState:{
    newTenent:false ,  
    showSkipModal:false
    },
    reducers: {
      setNewTenent(state,action) {
        state.newTenent = action.payload;
      },
      setShowSkipModal(state,action) {
        state.showSkipModal = action.payload;
      },
    },
});

export const {setNewTenent,setShowSkipModal} = addTenentSlice.actions;

export default addTenentSlice.reducer;
