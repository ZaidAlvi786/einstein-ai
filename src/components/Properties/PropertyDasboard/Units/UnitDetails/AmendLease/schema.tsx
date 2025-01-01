import * as yup from 'yup';
import { InferType } from 'yup';

export const tenentInitailValue = {
  newTenant:false,
  selectApplication:false,
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
};
export const leaseDetailInitialValue={ 
  enterleaseDetail:true,
  type:"",
  startDay:"",
  endDay: "",
  rent:"",
  moveInDate:"",
};

export const tenatDetailSchema =  yup.object({ 
  newTenant: yup.boolean().default(false),
  selectApplication: yup.boolean().default(false),
    firstName: yup.string().when('selectApplication', ([selectApplication], schema) => {
      return selectApplication ? schema.required('First name is required'): schema.notRequired();
    }),
    lastName: yup.string().when('selectApplication', ([selectApplication], schema) => {
      return selectApplication ? schema.required('Last name is required'): schema.notRequired();
    }),
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

  export const coTenantschema = yup.object().shape({
    newTenant: yup.boolean().default(false),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email address'),
    phoneNumber: yup.string().matches(/^\d{10}$/, 'Phone number is not valid'),
    address1: yup.string().when('newTenant', {
      is: true,
      then: (schema) => schema.required('Address 1 is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    address2: yup.string().notRequired(),
    city: yup.string().when('newTenant', {
      is: true,
      then: (schema) => schema.required('City is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    state: yup.string().when('newTenant', {
      is: true,
      then: (schema) => schema.required('State is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    zip: yup.string().when('newTenant', {
      is: true,
      then: (schema) =>
        schema
          .matches(/^[0-9]{5}(?:-[0-9]{4})?$/, 'ZIP Code is not valid')
          .required('ZIP Code is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  export const leaseDetailSchema = yup.object({
    enterleaseDetail: yup.boolean().default(true),
    type: yup.string(),
    startDay: yup.string(),
    endDay: yup.string(),
    rent: yup.string(),
    moveInDate: yup.string(),
  });
  export const landlordSchema = yup.object({
    moveOutDate: yup.string(),
    reason: yup.string(),
  })

 export const defaultSchema = yup.object().shape({});
 export interface CoTenantDetailsForm {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  newTenant: boolean;
}

export type TeanantDetailsForm = InferType<typeof tenatDetailSchema>;
export type CoTeanantDetailsForm = InferType<typeof coTenantschema>;
export type LeaseDetailsForm = InferType<typeof leaseDetailSchema>;


