import { Button, Input } from '@mantine/core';
import { Controller, UseFormReturn, useForm } from 'react-hook-form';
import { Users04Icon, EmailIcon02, AlertCircleIcon } from '@assets/iconComponents';
import { PropertyContactsForm, propertyOwnerContactSchema } from '../PropertyDetailsStep/schemas';
import { CustomInput } from '@utils/CustomInput';
import { useDisclosure } from '@mantine/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import { setOwnerDetails, updateOwnerDetails } from '@stores/propertySlice';
import { useDispatch } from 'react-redux';
import { OwnerDetails } from '@interfaces/property.interface';
import { UnknownAction } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import bgPattrerens from '@assets/patterns/Background pattern decorative.svg';
import { toast } from 'react-toastify';
import { IMaskInput } from 'react-imask';
import USWithArrow from '@utils/ArrowWithUS';
import clsx from 'clsx';

interface Props {
  opened: boolean;
  onClose: () => void;
  setDeatails: ({}) => void;
  owner: OwnerDetails;
}
const initialValues = {
  first_name: '',
  last_name: '',
  phone_number: '',
  email: '',
  title: '',
};
export function CompanyOwnerContacts({ onClose, owner, setDeatails }: Props) {
  const dispatch = useDispatch();
  const methods = useForm({
    resolver: yupResolver(propertyOwnerContactSchema),
    defaultValues: initialValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    setValue,
    reset,
    ...form
  } = methods;

  const onSubmit = () => {};

  useEffect(() => {
    reset();
    if (owner) {
      onEdit(owner);
    }
  }, [owner]);

  const handleContinue = () => {
    handleSubmit(onSubmit)();
    const data = getValues();
    if (!isValid) {
      return;
    }

    if (owner && owner?.index !== undefined && owner?.index >= 0) {
      let newdata = {
        index: owner?.index,
        owner: data,
      };
      dispatch(updateOwnerDetails(newdata as unknown as OwnerDetails) as unknown as UnknownAction);
      onClose();
      return;
    }
    dispatch(setOwnerDetails(data as unknown as OwnerDetails) as unknown as UnknownAction);
    onClose();
  };

  const onEdit = (owner: any) => {
    setValue('first_name', owner?.owner?.first_name);
    setValue('last_name', owner?.owner?.last_name);
    setValue('title', owner?.owner?.title || '');
    setValue('email', owner?.owner?.email);
    setValue('phone_number', owner?.owner?.phone_number);
  };

  const handleCancel = () => {
    setDeatails({});
    onClose();
  };
  return (
    <>
      <div>
        <div className="bg-cover w-full my-3 relative">
          <img src={bgPattrerens.toString()} alt="circle-bg" className="circleImg -z-10" />
          <Users04Icon className="ms-6.8 mt-3 size-9" />
        </div>
        <div className="p-5 pt-2">
          <div className="leading-7 font-semibold text-lg	 text-gray-900 ">Add company contact</div>
          <div className="text-sm font-normal text-gray-600 leading-5	 mt-2">
            Share where you’ve worked on your profile.
          </div>
          <fieldset className="grid-cols-3 grid gap-5 mt-4">
            <CustomInput
              label="First name*"
              placeholder="First name"
              {...register(`first_name`)}
              error={errors?.first_name?.message}
            />
            <CustomInput
              label="Last name* "
              placeholder="Last name"
              {...register(`last_name`)}
              error={errors?.last_name?.message}
            />
            <CustomInput
              label="Title*"
              placeholder="Title"
              {...register(`title`)}
              error={errors?.title?.message}
            />
          </fieldset>
          <fieldset className="grid-cols-2 grid gap-5 mt-6">
            <CustomInput
              leftSection={<EmailIcon02 className="size-5 gray-200	" />}
              label="Email address*"
              placeholder="olivia@untitledui.com"
              {...register(`email`)}
              error={errors?.email?.message}
            />

            {/* <CustomInput
              label="Phone number*"
              type="number"  min="0"
              placeholder="212-212-1100"
              {...register(`phone`)}
              error={errors?.phone?.message}
            />  */}
            <Input.Wrapper
              classNames={{
                label: 'text-sm leading-5 font-medium	 text-gray-700 mb-1.5',
              }}
              label="Phone number*"
              className="w-full "
            >
              <Controller
                name="phone_number"
                control={form.control}
                render={({ field }) => (
                  <Input
                    size="sm"
                    value={field.value}
                    radius="md"
                    error={errors.phone_number?.message}
                    className="w-full"
                    classNames={{
                      input: clsx(
                        ' !h-11 placeholder:text-gray-500',
                        errors.phone_number?.message && 'border-error-600 focus:shadow-error'
                      ),
                    }}
                    // leftSection={<USWithArrow />}
                    rightSection={
                      errors.phone_number?.message ? (
                        <AlertCircleIcon className="size-4 text-error-500 me-2.5" />
                      ) : (
                        ''
                      )
                    }
                    type="text"
                    component={IMaskInput}
                    onAccept={(value) => {
                      field.onChange(value);
                      setValue('phone_number', value);
                      if (!form.getFieldState('phone_number').invalid) {
                        form.clearErrors('phone_number');
                      }
                    }}
                    // onChange={() => form.trigger('phone')}
                    onBlur={() => form.trigger('phone_number')}
                    mask="+1 000-000-0000"
                    placeholder="212-212-1100"
                  />
                )}
              />

              {errors.phone_number?.message && (
                <p className="text-error-600 text-xs !mt-1 -mb-6">
                  {' '}
                  {errors.phone_number?.message}
                </p>
              )}
            </Input.Wrapper>
          </fieldset>
          <div className="grid-cols-2 grid gap-5 mt-8">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="border-gray-300 font-semibold h-11 rounded-lg text-gray-700  hover:bg-transparent hover:text-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleContinue}
              disabled={Object.keys(owner)?.length > 0 && !isValid}
              variant="outline"
              className="rounded-lg h-11 hover:bg-brand-970 hover:text-white bg-brand-960 text-base text-white font-semibold ms-3"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
