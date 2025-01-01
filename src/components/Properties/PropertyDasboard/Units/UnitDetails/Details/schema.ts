import * as yup from 'yup';
import { InferType } from 'yup';

export const unitFormSchema = yup.object({
  name: yup.string().required('Name is required'),
  address_1: yup.string().required('Address is required'),
  address_2: yup.string().nullable(),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zip_code: yup
    .string()
    .required('ZIP Code is required')
    .matches(/^[0-9]{5}(?:-[0-9]{4})?$/, 'ZIP Code is not valid'),
  unit_type: yup.string().required('Unit Type is required'),
  market_rent: yup.number().required('Market Rent is required'),
  amenities: yup.array().of(
    yup
      .string().defined()
      .max(30, 'Each tag must be 30 characters or less')
  ).max(20, 'A maximum of 20 tags are allowed'),
  description: yup
    .string()
    .max(1000, 'Description must be at most 1000 characters'),
  photos: yup.array().of(yup.mixed<File>()),
  bedrooms: yup.string().required('Bedrooms is required'),
  bathrooms: yup.string().required('Bathrooms is required'),
  square_feet: yup.string().required('Square Feet is required'),
  no_of_units: yup.string().required('Number of Units is required')
});

  export type UnitFormDetails = InferType<typeof unitFormSchema>;
