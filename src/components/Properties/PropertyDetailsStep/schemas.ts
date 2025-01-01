import { FileWithPath } from '@mantine/dropzone';
import * as yup from 'yup';
import { InferType } from 'yup';

const phoneRegExp = /^\+1 \d{3}-\d{3}-\d{4}$/;

export const propertyDetailsSchema = yup.object({
  name: yup.string().required('Property name is required'),
  units: yup
    .string()
    .required('Number of units is required')
    .matches(/^\d{1,4}$/, 'Maximum 4 digits are allowed'),
  description: yup.string().max(140, 'Must be 140 characters or less'),
  address_1: yup.string().required('Address 1 is required'),
  address_2: yup.string(),
  amenities: yup
    .array()
    .of(yup.string().defined().max(30, 'Each tag must be 30 characters or less'))
    .max(20, 'A maximum of 20 tags are allowed'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  association_with_property: yup.string().required('Association with property is required'),
  zip_code: yup
    .string()
    .required('ZIP Code is required')
    .matches(/^[0-9]{5}(?:-[0-9]{4})?$/, 'ZIP Code is not valid'),
  photos: yup.array().of(yup.mixed<File>()),
});
export const unitDetailsSchema = yup.object({
  photos: yup.array().of(yup.mixed<File>()),
});

const companySchema = {
  company_name: yup.string().nullable(),
  address_1: yup.string().nullable(),
  address_2: yup.string().nullable(),
  city: yup.string().nullable(),
  state: yup.string().nullable(),
  zip_code: yup.string().nullable(),
};

const companySchemaManager = {
  firstName: yup.string(),
  lastName: yup.string(),
  phone: yup.string(),
  email: yup.string(),
  title: yup.string(),
  name: yup.string(),
};

const individualSchemaManager = {
  firstName: yup.string(),
  lastName: yup.string(),
  phone: yup.string(),
  email: yup.string(),
  title: yup.string(),
};
export const propertyManagerSchema = yup.object({
  company: yup.boolean().default(true),
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  title: yup.string().required('Title is required'),
  phone_number: yup
    .string()
    .required('Phone is required')
    .matches(phoneRegExp, 'Phone number is not valid'),
  email: yup
    .string()
    .email('Email is not valid')
    .required('Email is required')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email is not valid'),
});

export const propertyOwnerContactSchema = yup.object({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  title: yup.string().required('Title is required'),
  phone_number: yup
    .string()
    .required('Phone is required')
    .matches(phoneRegExp, 'Phone number is not valid'),
  email: yup
    .string()
    .email('Email is not valid')
    .required('Email is required')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email is not valid'),
});

export const propertyOwnerIndividuals = yup.object({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  phone_number: yup
    .string()
    .required('Phone is required')
    .matches(phoneRegExp, 'Phone number is not valid'),
  email: yup
    .string()
    .email('Email is not valid')
    .required('Email is required')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email is not valid'),
});

export const propertyContactsSchema = yup.object({
  property_id: yup.string(),
  phone_number: yup.string().test('is-valid-phone', 'Phone number is not valid', function (value) {
    if (!value) {
      return true;
    }
    return phoneRegExp.test(value);
  }),
  email: yup
    .string()
    .email('Email is not valid')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email is not valid'),
  company: yup.boolean().default(false),
  same_as_owner: yup.boolean().default(true),
  company_info: yup.object(companySchema).when('company', ([company], schema) => {
    return company
      ? yup.object().shape({
          company_name: yup.string().required('Company name is required'),
          address_1: yup.string().required('Address 1 is required'),
          address_2: yup.string(),
          city: yup.string().required('City is required'),
          state: yup.string().required('State is required'),
          zip_code: yup.string().matches(/^[0-9]{5}(?:-[0-9]{4})?$/, 'ZIP Code is not valid'),
        })
      : schema.nullable();
  }),
  property_owner: yup.array(),
  property_manager: yup.array(),
});

export type PropertyDetailsForm = InferType<typeof propertyDetailsSchema>;
export type PropertyContactsForm = InferType<typeof propertyContactsSchema>;
export type PropertyOwnerContactsForm = InferType<typeof propertyOwnerContactSchema>;
