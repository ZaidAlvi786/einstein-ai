export interface ISignUpState {
  signupState: number;
  data?: {
    email?: string;
    user_id?: string;
    user_access_code?: string;
    phone?: string;
    isGoogleSignIn?: boolean;
    portfolio?: {
      phone?: string;
    };
  };
}

