import * as yup from 'yup';
import { InferType } from 'yup';

export const apllicantSchema = yup.object({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  email: yup.string(),
  phoneNumber: yup.string(),
  rent: yup.string().required('Rent is required'),
  date: yup.string(),

});
export const coApplicantchema = yup.object({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  email: yup.string(),
  phoneNumber: yup.string(),
  coApplicant: yup.boolean(),
  guarantor: yup.boolean(),
  residents: yup.boolean(),
});
export const coApplicantchemas = yup.object({
  address1: yup.string().required('Address 1 is required'),
  address2: yup.string(),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zip: yup
    .string()
    .matches(/^[0-9]{5}(?:-[0-9]{4})?$/, 'Zip Code is not valid')
    .required('Zip Code is required'),
  monthlyIncome: yup.string().required('Monthly Income is required'),
  sourceOfIncome: yup.string().required('Source of Income is required'),
  proofId: yup
    .array()
    .of(yup.mixed<File>())
    .min(1, 'Proof of Income is required'),
  copyId: yup
    .array()
    .of(yup.mixed<File>())
    .min(1, 'Copy of ID is required'),
});

export type CoApplicantDetailsForm = InferType<typeof coApplicantchema>;
export type CoApplicantDetailsForms = InferType<typeof coApplicantchemas>;
export type ApplicantForm = InferType<typeof apllicantSchema>;
