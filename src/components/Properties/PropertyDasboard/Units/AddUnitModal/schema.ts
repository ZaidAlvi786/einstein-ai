import { FileWithPath } from '@mantine/dropzone';
import * as yup from 'yup';
import { InferType } from 'yup';

export const unitFormSchema = yup.object({
  name: yup.string().required('Name is required'),
  address_1: yup.string().required('Address_1 is required'),
  address_2: yup.string(),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zip_code: yup
    .string()
    .matches(/^[0-9]{5}(?:-[0-9]{4})?$/, 'ZIP code is not valid')
    .required('ZIP code is required'),
  bedrooms: yup.string().required('Bedrooms is required'),
  bathrooms: yup.string().required('Bathrooms is required'),
  unit_model: yup.string(),
  market_rent: yup.number(),
  amenities: yup.array().nullable(),
  description: yup.string().max(700, 'Description must be at most 700 characters'),
  photos: yup
    .array()
    .required('You must upload at least one image')
    .min(1, 'You must upload at least one image')
    .of(yup.mixed<FileWithPath>()),
  square_feet: yup.string().required('Sq. feet is required'),
});

export const multiunitSchema = yup.object({
  name: yup.string().required('Name is required'),
  unitsInModel: yup.string().required('Units in model is required'),
  bedrooms: yup.string().required('Bedrooms is required'),
  bathrooms: yup.string().required('Bathrooms is required'),
  description: yup.string().nullable(),
  photos: yup
    .array()
    .required('You must upload at least one image')
    .min(1, 'You must upload at least one image')
    .of(yup.mixed<FileWithPath>()),
  market_rent: yup.string().nullable(),
  amenities: yup.array().nullable(),
  square_feet: yup.string().required('Sq. feet is required'),
});

export const unitToModalFormSchema = yup.object({
  name: yup.string().required('Name is required'),
  address1: yup.string().required('Address_1 is required'),
  address2: yup.string(),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zip_code: yup
    .string()
    .matches(/^[0-9]{5}(?:-[0-9]{4})?$/, 'ZIP code is not valid')
    .required('ZIP code is required'),
  market_rent: yup.number(),
  description: yup.string().max(700, 'Description must be at most 700 characters'),
  photos: yup
    .array()
    .required('You must upload at least one image')
    .min(1, 'You must upload at least one image')
    .of(yup.mixed<FileWithPath>()),
  amenities: yup.array().nullable(),
});

export type UnitForm = InferType<typeof unitFormSchema>;
export type MultiUnitForm = InferType<typeof multiunitSchema>;
