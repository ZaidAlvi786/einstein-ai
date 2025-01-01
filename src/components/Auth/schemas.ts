import { FileWithPath } from '@mantine/dropzone';
import * as yup from 'yup';
import { InferType } from 'yup';

const phoneRegExp = /^\+1 \d{3}-\d{3}-\d{4}$/;

export const loginSchema = yup.object({
  email: yup.string().required('Email is required').email('Email is not valid')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email is not valid'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long'),
});
import * as Yup from 'yup';

export const passwordSchema = Yup.object().shape({
  code: yup.string().required('OTP is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), ''], 'Passwords must match')
    .required('Confirm Password is required'),
});
export const forgotPasswordSchema = yup.object({
  email: yup.string().required('Email is required').email('Email is not valid')
  .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email is not valid'),
});


export const registerSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().required('Email is required').email('Email is not valid')
  .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email is not valid'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(phoneRegExp, 'Phone number is not valid'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long'),
    cpassword: yup.string()
    .required('Password is required')
     .oneOf([yup.ref('password')], 'Passwords must match')

});
export const portfolioSchema = yup.object({
  name: yup.string().required('Name is required'),
  portfolio_size: yup.number().typeError('Must be a number').required('Portfolio Size is required'),
  company_name: yup.string().required('Company name is required'),
  company_email: yup.string().required('Email is required').email('Email is not valid')
  .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email is not valid'),
  phone: yup.string().required('Phone is required').matches(phoneRegExp, 'Phone number is not valid'),
});
export const propertySchema = yup.object({
  name: yup.string(),
  units: yup.number().typeError('Must be a number').required('Units is required'),
  address_1: yup.string().required('Adress 1 is required'),
  address_2: yup.string(),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zip_code: yup.string().required('Zip Code is required').test('len', '5 digits are required', val => val.length === 5),
  association_with_property: yup.string().required('Association with property is required'),
});


export type LoginForm = InferType<typeof loginSchema>;
export type RegisterForm = InferType<typeof registerSchema>;
