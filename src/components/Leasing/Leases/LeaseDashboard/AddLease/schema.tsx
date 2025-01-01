import * as yup from 'yup';
import { InferType } from 'yup';

export const tenantsDetailSchema =  yup.object({ 
  selectApplication: yup.boolean().default(true),
    firstName: yup.string().when(['selectApplication'], ([selectApplication],schema) => {
      return (selectApplication) ? schema.notRequired() : schema.required('First name is required');
    }),
    lastName: yup.string().when(['selectApplication'], ([selectApplication],schema) => {
      return (selectApplication) ? schema.notRequired() : schema.required('Last name is required');
    }),
    email: yup.string(),
    phoneNumber: yup.string(),
  });

  export const coResidence =  yup.object({ 
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string(),
    phoneNumber: yup.string(),
  });

  export const leaseDetailSchema=yup.object({ 
    type: yup.string().required('Lease Type is required'),
    startDay: yup.string().required('Lease Start Day is required'),
    endDay: yup.string().required('Lease End Day is required'),
    rent: yup.string().required('Monthly Rent is required'),
    moveInDate: yup.string(),
  });
  
  export const tenantIdentification= yup.object({ 
    newTenant: yup.boolean().default(false),
    tenantSocialSecurity:yup.string().required("Social Security is required"),
    tenantDob:yup.string().required("Date of birth is required"),
    // contenantSocialSecurity:yup.string().required("Social Security is required"),
    // coTtenantDob:  yup.string().required("Date of birth is required")
  });
  
  export const proofOfIncome=yup.object({
    monthlyIncome:yup.string().required("Monthly Income is required"),
    sourceOfIncom:yup.string().required("Source of Income is required"),
   
  });


export type TenantsDetailsForm = InferType<typeof tenantsDetailSchema>;
export type CoResidenceDetailsForm = InferType<typeof coResidence>;
export type LeaseDetailsForm = InferType<typeof leaseDetailSchema>;
export type TenantIdentificationForm=InferType<typeof tenantIdentification>;


