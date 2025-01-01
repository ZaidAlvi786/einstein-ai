import * as yup from 'yup';
import { InferType } from 'yup';

export const tenatDetailSchema =  yup.object({ 
  newTenant: yup.boolean().default(false),
  selectApplication: yup.boolean().default(false),
    firstName: yup.string().when(['selectApplication', 'newTenant'], ([selectApplication,newTenant],schema) => {
      return (selectApplication && newTenant) ? schema.notRequired() : schema.required('First name is required');
    }),
    lastName: yup.string().when(['selectApplication', 'newTenant'], ([selectApplication,newTenant],schema) => {
      return (selectApplication && newTenant) ? schema.notRequired() : schema.required('Last name is required');
    }),
    email: yup.string(),
    phoneNumber: yup.string(),
    address1: yup.string().when(['selectApplication', 'newTenant'], ([selectApplication,newTenant],schema) => {
      return (selectApplication && newTenant) ? schema.notRequired() : !newTenant? schema.notRequired() : schema.required('Address 1 is required');
    }),
    address2: yup.string(),
    city: yup.string().when(['selectApplication', 'newTenant'], ([selectApplication,newTenant],schema) => {
      return (selectApplication && newTenant) ? schema.notRequired() :!newTenant? schema.notRequired() : schema.required('City is required');
    }),
    state: yup.string().when(['selectApplication', 'newTenant'], ([selectApplication,newTenant],schema) => {
      return (selectApplication && newTenant) ? schema.notRequired() : !newTenant? schema.notRequired() :schema.required('State  is required');
    }),
    zip: yup.string().when(['selectApplication', 'newTenant'], ([selectApplication,newTenant],schema) => {
      return (selectApplication && newTenant) ?
       schema.notRequired()
        : !newTenant? schema.notRequired() :schema.matches(/^[0-9]{5}(?:-[0-9]{4})?$/, 'ZIP Code is not valid').required('ZIP Code is required')
    }),
  });

  export const coTenantschema =  yup.object({ 
    newTenant: yup.boolean().default(false),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string(),
    phoneNumber: yup.string(),
    address1: yup.string().when('newTenant', ([newTenant], schema) => {
      return newTenant ? schema.required('Address 1 is required') : schema.notRequired();
    }),
    address2: yup.string(),
    city: yup.string().when('newTenant', ([newTenant], schema) => {
      return newTenant ? schema.required('City is required') : schema.notRequired();
    }),
    state: yup.string().when('newTenant', ([newTenant], schema) => {
      return newTenant ? schema.required('State is required') : schema.notRequired();
    }),
    zip: yup.string().when('newTenant', ([newTenant], schema) => {
      return newTenant
        ? schema
            .matches(/^[0-9]{5}(?:-[0-9]{4})?$/, 'ZIP Code is not valid')
            .required('ZIP Code is required')
        : schema.notRequired();
    }),
  });

  export const leaseDetailSchema=yup.object({ 
    enterleaseDetails:yup.boolean().default(true),
    type: yup.string().when('enterleaseDetails', ([enterleaseDetails], schema) => {
      return enterleaseDetails ? schema.required('Lease Type is required') : schema.notRequired();
    }),
    startDay: yup.string().when('enterleaseDetails', ([enterleaseDetails], schema) => {
      return enterleaseDetails ? schema.required('Lease Start Day is required') : schema.notRequired();
    }),
    endDay: yup.string().when('enterleaseDetails', ([enterleaseDetails], schema) => {
      return enterleaseDetails ? schema.required('Lease End Day is required') : schema.notRequired();
    }),
    rent: yup.string().when('enterleaseDetails', ([enterleaseDetails], schema) => {
      return enterleaseDetails ? schema.required('Monthly Rent is required') : schema.notRequired();
    }),
    moveInDate: yup.string(),
  });
  
  export const tenantIdentification= yup.object({ 
    newTenant: yup.boolean().default(false),
    tenantSocialSecurity:yup.string().required("Social Security is required"),
    tenantDob:yup.string().required("Date of birth is required"),
    contenantSocialSecurity:yup.string().required("Social Security is required"),
    coTtenantDob:  yup.string().required("Date of birth is required")
  });
  
  export const proofOfIncomelandlord=yup.object({
    monthlyIncome:yup.string().required("Social Security is required"),
    sourceOfIncom:yup.string().required("Date of birth is required"),
   
  });
  export const proofOfIncome=yup.object({
    landlordStatement:yup.boolean().default(false),
    primaryMonthlyIncome: yup.string().when('landlordStatement', ([landlordStatement], schema) => {
      return landlordStatement ? schema.required("Monthly income is required") : schema.notRequired();
    }),
    primarySourceOfIncom: yup.string().when('landlordStatement', ([landlordStatement], schema) => {
      return landlordStatement ? schema.required("Source of income is required") : schema.notRequired();
    }),
    // primaryMonthlyIncome:yup.string().required("Monthly income is required"),
    // primarySourceOfIncom:yup.string().required("Source of income is required"),
    tenantMonthlyIncome: yup.string().when('landlordStatement', ([landlordStatement], schema) => {
      return landlordStatement ?  schema.notRequired():schema.required("Monthly income is required");
    }),
    tenantSourceOfIncom: yup.string().when('landlordStatement', ([landlordStatement], schema) => {
      return landlordStatement ?  schema.notRequired():schema.required("Source of income is required");
    }),
    cotenantMonthlyIncome: yup.string().when('landlordStatement', ([landlordStatement], schema) => {
      return landlordStatement ?  schema.notRequired():schema.required("Monthly income is required");
    }),
    cotenantSourceOfIncom:yup.string().when('landlordStatement', ([landlordStatement], schema) => {
      return landlordStatement ?  schema.notRequired():schema.required("Source of income is required");
    })
   
  });
  export const gurantor=yup.object({
    firstName:yup.string().required("First name is required"),
    lastName:yup.string().required("Last name is required"),
    email:yup.string(),
    phoneNumber:yup.string(),
    monthlyIncome:yup.string().required("Monthly income is required"),
    sourceOfIncome:yup.string().required("Source of income is required"),
   
  });

export type TeanantDetailsForm = InferType<typeof tenatDetailSchema>;
export type CoTeanantDetailsForm = InferType<typeof coTenantschema>;
export type LeaseDetailsForm = InferType<typeof leaseDetailSchema>;
export type TenantIdentificationForm=InferType<typeof tenantIdentification>;
export type ProofOfIncomeLandlord=InferType<typeof proofOfIncomelandlord>;
export type ProofOfIncome=InferType<typeof proofOfIncome>;
export type GurantorForm=InferType<typeof gurantor>;


