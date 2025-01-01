import * as yup from 'yup';
import { InferType } from 'yup';
const creditCardSchema = {
  name: yup.string(),
  date: yup.string(),
  cardNumber: yup.string(),
  cvv: yup.string(),
  address1: yup.string(),
  address2: yup.string(),
  city: yup.string(),
  state: yup.string(),
  zip: yup.string(),
};
const bankAccountSchema = {
  accountNumber: yup.string(),
  routingNumber: yup.string(),
  accountType: yup.string(),
  nameOnAccount: yup.string(),
};

export const paymentDetailsSchema = yup.object({
  isCreditCard: yup.boolean(),
  creditCard: yup.object(creditCardSchema).when('isCreditCard', ([isCreditCard], schema) =>
    isCreditCard
      ? yup.object().shape({
          name: yup.string().required('Name is required'),
          date: yup.string().required('Date is required'),
          cardNumber: yup.string().required('Card number is required'),
          cvv: yup.string().required('CVV is required'),
          address1: yup.string().required('Address 1 is required'),
          address2: yup.string(),
          city: yup.string().required('City is required'),
          state: yup.string().required('State is required'),
          zip: yup
            .string()
            .matches(/^[0-9]{5}(?:-[0-9]{4})?$/, 'Zip Code is not valid')
            .required('Zip Code is required'),
        })
      : schema
  ),

  bankAccount: yup.object(bankAccountSchema).when('isCreditCard', ([isCreditCard], schema) =>
    !isCreditCard
      ? yup.object().shape({
          accountNumber: yup.string().required('Account number is required'),
          routingNumber: yup.string().required('Routing number is required'),
          accountType: yup.string(),
          nameOnAccount: yup.string().required('Name on account is required'),
        })
      : schema
  ),
});

export type PaymentDetailsForm = InferType<typeof paymentDetailsSchema>;
