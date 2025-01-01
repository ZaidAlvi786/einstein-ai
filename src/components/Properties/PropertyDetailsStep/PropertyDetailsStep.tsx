import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PropertyDetailsStepInputs } from './PropertyDetailsStepInputs';
import { propertyDetailsSchema } from './schemas';
import { StepButtons } from '../StepButtons';
import { FileDropzone } from './FileDropzone';
import { CrossedTitle } from '@components/CrossedTitle';
import { CustomInput } from '@utils/CustomInput';
import { Select, TagsInput } from '@mantine/core';
import { AlertCircleIcon, ArrowDown } from '@assets/iconComponents';
import { statesList } from '@constants/app.constant';
import { CustomTittle } from '@components/CustomTitte';
import { useDispatch, useSelector } from 'react-redux';
import { propertyDetails, selectApiData, updatePropertyDetails } from '@stores/propertySlice';
import { UnknownAction } from '@reduxjs/toolkit';
import { FileWithPath } from '@mantine/dropzone';
import { LoaderCircle } from '@components/LoaderCircle';
import { setLoading } from '@stores/authSlice';
import { PropertyDetails } from '@interfaces/property.interface';
import { useNavigate } from 'react-router-dom';
import { APP_PATHS } from '@routes/app-paths';
import { useEffect } from 'react';

interface Props {
  step: number;
  handlers: {
    increment: () => void;
    decrement: () => void;
  };
}

export function PropertyDetailsStep({ step, handlers }: Props) {
  const propertyData = useSelector(selectApiData);
  const dispatch = useDispatch();
  const methods = useForm({
    resolver: yupResolver(propertyDetailsSchema),
  });
  const {
    register,
    setValue,
    clearErrors,
    getValues,
    reset,
    watch,
    formState: { errors },
  } = methods;
  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const amenities = (watch('amenities')?.length && watch('amenities')) || undefined;
  const state = watch('state');

  useEffect(() => {
    if (propertyData?.['id']) {
      reset({
        name: propertyData?.['name'],
        amenities: propertyData?.['amenities'],
        address_1: propertyData?.['address_info']?.['address_1'],
        address_2: propertyData?.['address_info']?.['address_2'],
        city: propertyData?.['address_info']?.['city'],
        association_with_property: propertyData?.['address_info']?.['association_with_property'],
        state: propertyData?.['address_info']?.['state'],
        zip_code: propertyData?.['address_info']?.['zip_code'],
        description: propertyData?.['description'],
        units: propertyData?.['units'],
        photos: propertyData?.['photos'],
      });
    }
  }, []);

  const onSubmit = async () => {
    dispatch(setLoading(true));
    const formData = new FormData();
    let propertyDetailsData: { [key: string]: any } = getValues();
    Object.keys(propertyDetailsData).forEach((key) => {
      if (key === 'photos') {
        propertyDetailsData[key].forEach((file: File) => {
          if (file instanceof File) {
            formData.append('photos', file);
          }
        });
      } else {
        formData.append(key, propertyDetailsData[key]);
      }
    });
    try {
      let result = null;

      if (propertyData?.['id']) {
        formData.append('id', propertyData?.['id']);
        result = await dispatch(updatePropertyDetails(formData) as unknown as UnknownAction);
      } else {
        result = await dispatch(
          propertyDetails(formData as unknown as PropertyDetails) as unknown as UnknownAction
        );
      }

      if (result?.payload !== undefined) {
        dispatch(setLoading(false));
        handlers.increment();
      }
      dispatch(setLoading(false));
    } catch (error) {
      console.log(error);
      dispatch(setLoading(false));
    }
  };

  const handleContinue = async () => {
    await handleSubmit(onSubmit)();
  };

  const handleExit = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <div className="flex flex-col">
      <div className="p-6">
        <CustomTittle heading="Property details" />
        <form className="grid grid-cols-2 gap-4 mt-7 ">
          <PropertyDetailsStepInputs methods={methods} />
          <div className="flex flex-col gap-2">
            <div className="text-sm leading-5 font-medium	text-gray-700 mt-0.5">Property photos</div>
            <FileDropzone methods={methods} />
            <TagsInput
              value={amenities}
              onChange={(value: string[]) => {
                setValue('amenities', value); // Directly use value without wrapping it in another array
                clearErrors('amenities');
              }}
              rightSection={
                errors.amenities ? <AlertCircleIcon className="size-4 text-error-500" /> : ''
              }
              label="Property amenities"
              className="mt-3 custom-tag"
              placeholder="Enter Amenities"
              error={
                errors.amenities?.message ||
                (errors.amenities?.length && 'Each tag must be 30 characters or less')
              }
            />
          </div>

          <div className="mt-2 col-span-2">
            <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
              Address information
            </div>
            <div className="grid grid-cols-3 gap-5 mt-7">
              <CustomInput
                label="Address 1*"
                placeholder="Enter address 1"
                {...register('address_1')}
                error={errors.address_1?.message}
              />
              <CustomInput
                label="Address 2"
                placeholder="Enter address 2"
                {...register('address_2')}
              />
              <CustomInput
                label="City*"
                placeholder="Enter City"
                {...register('city')}
                error={errors.city?.message}
              />
              <Select
                {...register('state')}
                label="State*"
                placeholder="Select State"
                checkIconPosition="right"
                rightSection={<ArrowDown />}
                data={statesList}
                value={state}
                onChange={(value: string | null) => {
                  setValue('state', value ?? '');
                  clearErrors('state');
                }}
                error={errors.state?.message}
              />
              <CustomInput
                label="Zip Code*"
                type="text"
                placeholder="Enter Zip Code"
                {...register('zip_code')}
                // value={getValues('zip_code')}
                error={errors.zip_code?.message}
              />
              <CustomInput
                label="Association with property*"
                placeholder="Your Association with property"
                {...register('association_with_property')}
                error={errors.association_with_property?.message}
              />
            </div>
          </div>
        </form>
      </div>
      <StepButtons
        step={step}
        handlers={handlers}
        onContinue={handleContinue}
        onExit={handleExit}
      />
    </div>
  );
}
