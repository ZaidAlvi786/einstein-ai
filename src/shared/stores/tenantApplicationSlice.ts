import { ITenantState } from "@interfaces/unitDetailsForm.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

// Define initial state with correct typing
const initialState: { tenantApplication: ITenantState } = {
  tenantApplication: {
    data: {
      id: '',
      coApplicantdata:[],
      employmentsData: [],

    }
  } as ITenantState
}

export const applicantSlice = createSlice({
  name: 'tenantApplication',
  initialState,
  reducers: {
    setTenantApplicationData(state, action: PayloadAction<Partial<ITenantState['data']>>) {
      state.tenantApplication.data = { ...state.tenantApplication.data, ...action.payload };
    },
  }
});

// Export only the reducer
export const { setTenantApplicationData } = applicantSlice.actions;
export const applicantData = (state: RootState) => state.addApplicant.tenantApplication.data;
export default applicantSlice.reducer;  // <-- Use the reducer here
