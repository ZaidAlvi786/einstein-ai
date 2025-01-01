import { Checkbox, Input } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDisclosure } from '@mantine/hooks';
import { StepButtons } from '../StepButtons';
import { propertyContactsSchema } from '../PropertyDetailsStep/schemas';
import { OwnershipContactFields } from './OwnershipContactFields';
import { CustomInput } from '@utils/CustomInput';
import { AlertCircleIcon, EmailIcon02 } from '@assets/iconComponents';
import USWithArrow from '@utils/ArrowWithUS';
import { ManagerFieldset } from './ManagerFieldset';
import clsx from 'clsx';
import { CustomTittle } from '@components/CustomTitte';
import {
  clearAllData,
  clearMangerDetails,
  clearOwnerDetails,
  getContactDetails,
  getManegerDeatils,
  getOwnerDeatils,
  propertyContacts,
  sameAsOwner,
  selectApiData,
  setManagerDetails,
  setOwnerDetails,
  updateManagerDetails,
  updateOwnerDetails,
  updatePropertyContacts,
} from '@stores/propertySlice';
import { useDispatch, useSelector } from 'react-redux';
import { UnknownAction } from '@reduxjs/toolkit';
import {
  ContactDetails,
  OwnerDetails,
  PropertyManegerSchema,
} from '@interfaces/property.interface';
import { setLoading } from '@stores/authSlice';
import { APP_PATHS } from '@routes/app-paths';
import { useNavigate } from 'react-router-dom';
import { IMaskInput } from 'react-imask';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

interface Props {
  step: number;
  handlers: {
    increment: () => void;
    decrement: () => void;
  };
}
interface ObjectInterface {
  [key: string]: any;
}
const initialValues = {
  property_id: '',
  phone_number: '',
  email: '',
  company: true,
  company_info: {
    company_name: '',
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    zip_code: '',
  },
  property_owner: [],
  property_manager: [],
  same_as_owner: true,
};

export function PropertyContactsStep({ step, handlers }: Props) {
  const [isSameAsOwner, { toggle }] = useDisclosure(true);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const ownerDetails = useSelector(getOwnerDeatils);
  const manegerDetails = useSelector(getManegerDeatils);
  const propertyData = useSelector(selectApiData);
  const contactDetailsData = useSelector(getContactDetails);

  const methods = useForm({
    resolver: yupResolver(propertyContactsSchema),
    defaultValues: initialValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    getValues,
    reset,
    ...form
  } = methods;

  const phone_number = watch('phone_number');
  const onSubmit = async (data: any, isContinue: boolean) => {
    dispatch(setLoading(true));
    try {
      const contactDetails = getValues();
      if (!contactDetails.company) {
        delete (contactDetails as { company_info?: any }).company_info;
      }

      // contactDetails.property_id = (propertyData as unknown as { id?: string })?.id ?? '';
      contactDetails.property_id = propertyData?.['id'];
      contactDetails.property_owner = ownerDetails;
      contactDetails.property_manager = manegerDetails;
      let result = null;

      if (
        contactDetails?.property_owner?.length &&
        (contactDetails?.same_as_owner || contactDetails?.property_manager?.length)
      ) {
        if (contactDetailsData?.['id']) {
          result = await dispatch(
            updatePropertyContacts({
              ...contactDetails,
              id: contactDetailsData?.['id'],
            } as unknown as ContactDetails) as unknown as UnknownAction
          );
        } else {
          result = await dispatch(
            propertyContacts(
              contactDetails as unknown as ContactDetails
            ) as unknown as UnknownAction
          );
        }
      } else {
        toast.error('Minimum 1 owner required. Minimum 1 Property Manger is required');
      }

      if (result?.payload !== undefined) {
        dispatch(
          updateManagerDetails([] as unknown as PropertyManegerSchema) as unknown as UnknownAction
        );
        dispatch(updateOwnerDetails([] as unknown as OwnerDetails) as unknown as UnknownAction);
        if (isContinue) {
          handlers.increment();
        } else {
          await dispatch(clearAllData() as unknown as UnknownAction);
          navigate(APP_PATHS.properties.get());
        }
      }
      dispatch(setLoading(false));
    } catch (err: any) {
      dispatch(setLoading(false));
    }
  };

  const handleContinue = async () => {
    handleSubmit((data) => onSubmit(data, true))();
  };

  const handleExit = async () => {
    await handleSubmit((data) => onSubmit(data, false))();

    // navigate(APP_PATHS.properties.get());
  };

  const removeMatchingObjects = (arr1: ObjectInterface, arr2: ObjectInterface) =>
    arr2.filter(
      (obj2: any) =>
        !arr1.some((obj1: any) => Object.keys(obj1).every((key) => obj1[key] === obj2[key]))
    );

  const handleAsSameOwner = (e: any) => {
    toggle();

    if (isSameAsOwner) {
      const neArrr = removeMatchingObjects(ownerDetails, manegerDetails);
      dispatch(sameAsOwner(neArrr as unknown as PropertyManegerSchema) as unknown as UnknownAction);
      return;
    }
    let data = ownerDetails;
    if (!isSameAsOwner) {
      for (let x of data) {
        dispatch(
          setManagerDetails(x as unknown as PropertyManegerSchema) as unknown as UnknownAction
        );
      }
    }
  };

  useEffect(() => {
    if (contactDetailsData?.['id']) {
      reset({
        phone_number: contactDetailsData?.['phone_number'],
        company: contactDetailsData?.['company'],
        email: contactDetailsData?.['email'],
        company_info: contactDetailsData?.['company_info'],
        same_as_owner: contactDetailsData?.['same_as_owner'],
      });
      if (contactDetailsData?.['property_owner']) {
        dispatch(clearOwnerDetails() as unknown as UnknownAction);
        let data = contactDetailsData?.['property_owner'] as Array<any>;
        for (let x of data) {
          dispatch(setOwnerDetails(x as unknown as OwnerDetails) as unknown as UnknownAction);
        }
      }

      if (contactDetailsData?.['property_manager']) {
        dispatch(clearMangerDetails() as unknown as UnknownAction);
        let data = contactDetailsData?.['property_manager'] as Array<any>;
        for (let x of data) {
          dispatch(
            setManagerDetails(x as unknown as PropertyManegerSchema) as unknown as UnknownAction
          );
        }
      }
    }
  }, []);

  return (
    <div className="flex flex-col">
      <div className="p-6">
        <CustomTittle heading="Contact details" />
        {/* <div className="border-solid border-t border-gray-960 my-4"></div> */}
        <form className="flex gap-6 flex-col items-stretch mt-6">
          <div className="grid grid-cols-2 gap-7">
            {/* <CustomInput
              type="number"  min="0"
              classNames={{ input: 'ps-16' }}
              label="Phone number"
              leftSection={<USWithArrow />}
              max={10}
              placeholder="+1 (555) 000-0000"
              {...register('phone_number')}
              error={errors.phone_number?.message}
            /> */}
            <Input.Wrapper
              classNames={{
                label: 'text-sm-medium text-gray-700',
              }}
              label="Phone number"
              className="w-full mt-1"
            >
              <Controller
                name="phone_number"
                control={form.control}
                render={({ field }) => (
                  <Input
                    size="sm"
                    radius="md"
                    error={errors.phone_number?.message}
                    className="w-full"
                    classNames={{
                      input: clsx(
                        'ps-16 !h-11 placeholder:text-gray-500',
                        errors.phone_number?.message && 'border-error-600 focus:shadow-error'
                      ),
                    }}
                    leftSection={<USWithArrow />}
                    rightSection={
                      errors.phone_number?.message ? (
                        <AlertCircleIcon className="size-4 text-error-500 me-2.5" />
                      ) : (
                        ''
                      )
                    }
                    value={phone_number}
                    type="text"
                    component={IMaskInput}
                    onAccept={(value) => {
                      field.onChange(value);
                      form.setValue('phone_number', value);
                      if (!form.getFieldState('phone_number').invalid) {
                        form.clearErrors('phone_number');
                      }
                    }}
                    // onChange={() => form.trigger('phone_number')}
                    // onBlur={() => form.trigger('phone_number')}
                    mask="+1 000-000-0000"
                    placeholder="+1 (555) 000-0000"
                  />
                )}
              />

              {errors.phone_number?.message && (
                <p className="text-error-600 text-sm !mt-0.5 -mb-3">
                  {' '}
                  {errors.phone_number?.message}
                </p>
              )}
            </Input.Wrapper>
            <CustomInput
              label="Email"
              leftSection={<EmailIcon02 className="size-5" />}
              placeholder="olivia@untitledui.com"
              {...register('email')}
              error={errors.email?.message}
            />
          </div>
          <OwnershipContactFields methods={methods} name="owner" handleContinue={handleContinue} />

          <div className="text-lg rounded-[8px] leading-7 font-semibold flex items-center justify-center text-center text-gray-900 bg-gray-50 p-2">
            Property manager
          </div>
          <Checkbox
            classNames={{
              label: 'text-gray-700 text-base font-medium leading-6',
              inner: 'flex items-center justify-center',
              body: 'items-center',
              input: clsx(
                '!rounded-md w-5 h-3.2',
                isSameAsOwner && '!bg-brand-970 !border-brand-970'
              ),
            }}
            label="Same as owner"
            // checked={isSameAsOwner}
            {...register('same_as_owner')}
          />
          <ManagerFieldset />
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
