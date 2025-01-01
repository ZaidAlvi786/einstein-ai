import * as yup from 'yup';
import { InferType } from 'yup';

export const tenantsDetailSchema = yup.object({
  selectApplication: yup.boolean().default(true),
  firstName: yup.string().when(['selectApplication'], ([selectApplication], schema) => {
    return selectApplication ? schema.notRequired() : schema.required('First name is required');
  }),
  lastName: yup.string().when(['selectApplication'], ([selectApplication], schema) => {
    return selectApplication ? schema.notRequired() : schema.required('Last name is required');
  }),
  email: yup.string(),
  phoneNumber: yup.string(),
});

export const coResidence = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string(),
  phoneNumber: yup.string(),
});

export const leaseDetailSchema = yup.object({
  type: yup.string().required('Lease Type is required'),
  startDay: yup.string().required('Lease Start Day is required'),
  endDay: yup.string().required('Lease End Day is required'),
  rent: yup.string().required('Monthly Rent is required'),
  moveInDate: yup.string(),
});

export const tenantIdentification = yup.object({
  newTenant: yup.boolean().default(false),
  tenantSocialSecurity: yup.string().required('Social Security is required'),
  tenantDob: yup.string().required('Date of birth is required'),
  // contenantSocialSecurity:yup.string().required("Social Security is required"),
  // coTtenantDob:  yup.string().required("Date of birth is required")
});

export const proofOfIncome = yup.object({
  address_1: yup.string().required('Address 1 is required'),
  address_2: yup.string(),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zip_code: yup.string().matches(/^[0-9]{5}(?:-[0-9]{4})?$/, 'ZIP Code is not valid'),
  monthlyIncome: yup.string().required('Monthly Income is required'),
  sourceOfIncom: yup.string().required('Source of Income is required'),
  socialSecurity: yup.string(),
  dob: yup.string(),
});

export type TenantsDetailsForm = InferType<typeof tenantsDetailSchema>;
export type CoResidenceDetailsForm = InferType<typeof coResidence>;
export type LeaseDetailsForm = InferType<typeof leaseDetailSchema>;
export type TenantIdentificationForm = InferType<typeof tenantIdentification>;
