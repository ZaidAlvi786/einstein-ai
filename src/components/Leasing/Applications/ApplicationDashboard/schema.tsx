import * as yup from 'yup';
import { InferType } from 'yup';

export const incomeVerificationSchema = yup.object({
  monthlyIncome: yup.string().required('Monthly Income is required'),
  sourceOfIncome: yup.string().required('Source of Income is required'),
  documents: yup
    .array()
    .of(yup.mixed<File>())
});
export const incomeVerificationIdSchema = yup.object({
  documents: yup
    .array()
    .of(yup.mixed<File>())
});


export type VerifyIncomeArray = InferType<typeof incomeVerificationSchema>;
export type VerifyIncomeIdArray = InferType<typeof incomeVerificationIdSchema>;
