import * as yup from 'yup';
import { InferType } from 'yup';

// Rental application form schema
export const rentalApplicationDetailForm = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email address'),
  moveInDate: yup.string().required('Desired move-in date is required'),
  leaseLength: yup.number().required('Desired lease length is required'),
  phoneNumber: yup.string().matches(/^\d{10}$/, 'Phone number is not valid'),
  socialSecurity: yup.number(),
  birthDate: yup.string(),
});
export const employmentFormSchema = yup.object().shape({
  employmentStatus: yup.string().required('Employment status is required'),
  jobDescription: yup.string().required('Job description is required'),
  length: yup.string().required('Length is required'),
  companyName: yup.string().required('Company name is required'),
  companyWebsite: yup.string(),
  monthlyWage: yup.string().required('Monthly wage is required'),
});
export const referenceFormSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email address'),
  title: yup.string().required('Desired move-in date is required'),
  phoneNumber: yup.string().required('Phone number is required'),
});

// Co-applicant form schema
export const coApplicantDetailForm = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().required('Email is required').email('Invalid email address'),
  phoneNumber: yup.string().required('Phone number is required'),
  coApplicant: yup.boolean(),
  guarantor: yup.boolean(),
  occupants: yup.boolean(),
});
export const otherProofOfIncomeSchema = yup.object().shape({
    monthlyIncome: yup.string().required('Monthly income is required'),
    sourceOfIncome: yup.string().required('Source of income is required'),
})
export const currentAddressFormSchema = yup.object().shape({
  address1: yup.string().required('Address is required'),
  address2: yup.string(),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zip: yup.number().required('Zip is required'),
  type: yup.string().required('Type is required'),
  monthlyRent: yup.number().required('Monthly rent is required'),
  moveInDate: yup.string().required('Move in date is required'),
  moveOutDate: yup.string().required('Move out date is required'),
  movingReason: yup.string().required('Move reason is required'),

})

export const landlordSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email address'),
  phoneNumber: yup.string().required('Phone number is required'),
})

// Initial values for the forms
export const detailFormInitialValue = {
  firstName: '',
  lastName: '',
  email: '',
  moveInDate: '',
  leaseLength: 0,
  phoneNumber: '',
  socialSecurity: undefined,
  birthDate: '',
};

export const coApplicantInitialValue = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  coApplicant: false,
  guarantor: false,
  occupants: false,
};
export const employmentFormInitialValue = {
  id: '',
  employmentStatus: '',
  jobDescription: '',
  length: '',
  companyName: '',
  companyWebsite: '',
  monthlyWage: '',
};
export const referenceFormInitialValue = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  title: '',
  phoneNumber: '',
};

export const otherIncomeInitialValue = {
    monthlyIncome: '',
    sourceOfIncome: '',
}

export const currentAddressInitialValue = {
  id:'',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: 0,
  type: '',
  monthlyRent: 0,
  moveInDate: '',
  moveOutDate: '',
  movingReason: '',
}
export const landlordInitialValue = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
};

// Infer types from schemas
export type DetailFormSchema = InferType<typeof rentalApplicationDetailForm>;
export type CoApplicantForm = InferType<typeof coApplicantDetailForm>;
export type EmploymentFormShcema = InferType<typeof employmentFormSchema>;
export type ReferenceFormShcema = InferType<typeof referenceFormSchema>;
export type OtherIncomeSchema = InferType<typeof otherProofOfIncomeSchema>;
export type CurrentAddressFormSchema = InferType<typeof currentAddressFormSchema>;
export type LandlordSchema = InferType<typeof landlordSchema>;
