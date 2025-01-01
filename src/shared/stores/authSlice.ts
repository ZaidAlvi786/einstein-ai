import { ISignUpState } from '@interfaces/signupState.interface';
import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from './index';

const initialState: { signUp: ISignUpState & { isLoading: boolean } } = {
  signUp: {
    isLoading: false,
    signupState: 1,
    data: {
      email: '',
      user_id: '',
      user_access_code: '',
      phone: '',
      isGoogleSignIn: false,
    },
  } as ISignUpState & { isLoading: boolean },
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setNextSignupState(state) {
      state.signUp.signupState += 1;
    },
    setPreviousSignupState(state) {
      state.signUp.signupState -= 1;
    },
    setSignUpData(state, action) {
      state.signUp.data = { ...state.signUp.data, ...action.payload };
    },
    setLoading(state, action) {
      state.signUp.isLoading = action.payload;
    },
  },
});

export const { setNextSignupState, setPreviousSignupState, setSignUpData, setLoading } =
  authSlice.actions;

export const selectSignupState = (state: RootState) => state.auth.signUp.signupState;
export const selectSignupData = (state: RootState) => state.auth.signUp.data;

export default authSlice.reducer;
