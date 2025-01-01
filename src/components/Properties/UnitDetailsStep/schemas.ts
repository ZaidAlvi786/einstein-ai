import { FileWithPath } from '@mantine/dropzone';
import * as yup from 'yup';
import { InferType } from 'yup';

export const unitDetailsSchema = yup.object({
  isSingle: yup.boolean().required(),
  single: yup.lazy((value, options) => {
    if (options.parent.isSingle) {
      return yup
        .array()
        .of(
          yup.object({
            id: yup.string().nullable(),
            name: yup.string().required('Name is required'),
            address1: yup.string().required('Address 1 is required'),
            address2: yup.string().required('Address 2 is required'),
            city: yup.string().required('City 1 is required'),
            state: yup.string().required('State is required'),
            description: yup.string().nullable(),
            bedrooms: yup.string().required('Bedrooms is required').max(4, 'invalid entry'),
            bathrooms: yup.string().required('Bathrooms is required').max(4, 'invlid entry'),
            amenities: yup.array().nullable(),
            sqfeet: yup.string().required('Sq. feet is required'),
            rent: yup.string().nullable(),
            images: yup.array().required('You must upload at least one image') .min(1, 'You must upload at least one image').of(yup.mixed<FileWithPath>()),
            parking: yup.boolean().nullable(),
            zip: yup
              .string().required('Zip code is required')
              .matches(/^[0-9]{5}(?:-[0-9]{4})?$/, 'Zip Code is not valid')
          })
        )
        .min(1, 'At least one single unit is required')
        .required('Single units are required');
    } else {
      return yup.array().of(
        yup.object({
          id: yup.string().nullable(),
          name: yup.string(),
          address1: yup.string(),
          address2: yup.string().nullable(),
          city: yup.string().nullable(),
          state: yup.string().nullable(),
          description: yup.string().nullable(),
          bedrooms: yup.string().nullable(),
          bathrooms: yup.string().nullable(),
          amenities:  yup.array().nullable(),
          sqfeet: yup.string().nullable(),
          rent: yup.string().nullable(),
          images: yup.array().nullable(),
          parking: yup.boolean().nullable(),
          zip: yup.string().nullable(),
        })
      );
    }
  }),
  multiple: yup.lazy((value, options) => {
    if (!options.parent.isSingle) {
      return yup
        .array()
        .of(
          yup.object({
            id: yup.string().nullable(),
            name: yup.string().required('Name is required'),
            unitsInModel: yup.string().required('Units in model is required'),
            bedrooms: yup.string().required('Bedrooms is required'),
            bathrooms: yup.string().required('Bathrooms is required'),
            description: yup.string().nullable(),
            images: yup.array().required('You must upload at least one image') .min(1, 'You must upload at least one image').of(yup.mixed<FileWithPath>()),
            rent: yup.string().nullable(),
            amenities: yup.array().nullable(),
            sqfeet: yup.string().required('Sq. feet is required'),
            parking: yup.boolean().nullable(),
          })
        )
        .min(1, 'At least one multiple unit model is required')
        .required('multiple units are required');
    } else {
      
      return yup.array().of(
        yup.object({
          id: yup.string().nullable(),
          name: yup.string().nullable(),
          unitsInModel: yup.string().nullable(),
          bedrooms: yup.string().nullable(),
          bathrooms: yup.string().nullable(),
          description: yup.string().nullable(),
          images: yup.array().nullable(),
          rent: yup.string().nullable(),
          amenities: yup.array().nullable(),
          sqfeet: yup.string().nullable(),
          parking: yup.boolean().nullable(),
          zip: yup.string().nullable(),
        })
      );
    }
  }),
});

export type UnitDetailsForm = InferType<typeof unitDetailsSchema>;
