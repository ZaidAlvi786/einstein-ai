import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import propertySlice from './propertySlice';
import addTenentSlice from './addTenentSlice';
// import applicantReducer from './tenantApplicationSlice'; // <-- Import the reducer, not the slice
import applicantSlice from './tenantApplicationSlice'; // <-- Import the reducer, not the slice

export const store = configureStore({
  reducer: {
    auth: authSlice,
    property: propertySlice,
    addTenent: addTenentSlice,
    addApplicant: applicantSlice,  // <-- Use the reducer here
  },
});

// Define types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
