import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_APP_SECRET_KEY;

interface FormValues {
  email: string;
  password: string;
}

type UseFormSetValue<T> = (name: keyof T, value: T[keyof T]) => void;

export const setUserLoginData = (setRememberMe: (value: boolean) => void, setValue: UseFormSetValue<FormValues>) => {
  const savedEmail = Cookies.get('email');
  const savedPassword = Cookies.get('password');
  if (savedEmail && savedPassword) {
    try {
      const decryptedEmail = CryptoJS.AES.decrypt(savedEmail, SECRET_KEY).toString(CryptoJS.enc.Utf8);
      const decryptedPassword = CryptoJS.AES.decrypt(savedPassword, SECRET_KEY).toString(CryptoJS.enc.Utf8);
      decryptedEmail && decryptedPassword ? setRememberMe(true) : setRememberMe(false);
      setValue('email', decryptedEmail);
      setValue('password', decryptedPassword);
    } catch (error) {
      Cookies.remove('email');
      Cookies.remove('password');
      setRememberMe(false);
      // Set form values to empty strings
      setValue('email', '');
      setValue('password', '');
    }
  }
};
