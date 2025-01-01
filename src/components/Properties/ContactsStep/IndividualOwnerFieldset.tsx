import { Button, Input, Modal } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import {
  Users04Icon,
  Users03Icon,
  EmailIcon02,
  Edit01Icon,
  Delete01,
  AlertCircleIcon,
} from '@assets/iconComponents';
import { CustomInput } from '@utils/CustomInput';
import { useDisclosure } from '@mantine/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  deleteOwnerDetails,
  getOwnerDeatils,
  setOwnerDetails,
  updateOwnerDetails,
} from '@stores/propertySlice';
import { useDispatch, useSelector } from 'react-redux';
import { UnknownAction } from '@reduxjs/toolkit';
import { OwnerDetails } from '@interfaces/property.interface';
import { useState } from 'react';
import bgPattrerens from '@assets/patterns/Background pattern decorative.svg';
import profileIcon from '@assets/patterns/Featured icon.svg';
import clsx from 'clsx';
import { IMaskInput } from 'react-imask';
import { propertyOwnerIndividuals } from '../PropertyDetailsStep/schemas';

const initialValues = {
  first_name: '',
  last_name: '',
  title: '',
  phone_number: '',
  email: '',
};

export function IndividualOwnerFieldset() {
  const [opened, { open, close }] = useDisclosure(false);
  const ownerDetails = useSelector(getOwnerDeatils);
  const [checkIndex, setCheckIndex] = useState(null);

  const dispatch = useDispatch();
  const methods = useForm({
    resolver: yupResolver(propertyOwnerIndividuals),
    defaultValues: initialValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    setValue,
    clearErrors,
    ...form
  } = methods;
  const onSubmit = (data: any) => {};

  const handleContinue = async () => {
    handleSubmit(onSubmit)();
    if (!isValid) {
      return;
    }
    const data = getValues();
    if (checkIndex !== null) {
      let newdata = {
        index: checkIndex,
        owner: data,
      };
      dispatch(updateOwnerDetails(newdata as unknown as OwnerDetails) as unknown as UnknownAction);
      close();
      return;
    }
    dispatch(setOwnerDetails(data as unknown as OwnerDetails) as unknown as UnknownAction);
    close();
  };
  const editDetails = (owner: OwnerDetails, index: any) => {
    setCheckIndex(index);
    setValue('first_name', owner?.first_name);
    setValue('last_name', owner?.last_name);
    setValue('email', owner?.email);
    setValue('phone_number', owner?.phone_number);
    open();
  };
  const removeDetails = (index: unknown) => {
    dispatch(deleteOwnerDetails(index) as unknown as UnknownAction);
  };

  return (
    <>
      <div className="grid-cols-2 grid gap-5">
        {ownerDetails.length > 0 &&
          ownerDetails.map((owner, index) => (
            <div
              // onClick={open}
              key={index}
              className="border-solid border border-gray-300 rounded-xl  px-4 py-4  h-30 m-h-30"
            >
              <div className="flex justify-between">
                <div className="flex">
                  <div className="items-center self-center me-4">
                    <img
                      className="col-span-1 w-14 h-14"
                      src={profileIcon.toString()}
                      alt="person-avatar"
                    />
                  </div>
                  <div className="self-center">
                    <div className="text-lg	font-semibold	leading-7	text-gray-700  flex items-center ">
                      <span className="text-ellipsis w-32 whitespace-nowrap overflow-hidden">
                        {owner?.first_name} {owner?.last_name}
                      </span>
                    </div>
                    <div className="font-semibold	text-base	leading-6	text-gray-600">
                      {owner.email}
                    </div>
                    <div className="font-normal	text-base	leading-6 text-gray-600">
                      {owner.phone_number}
                    </div>
                  </div>
                </div>
                <div className="pe-1 py-1">
                  <div>
                    <Edit01Icon
                      onClick={() => {
                        clearErrors();
                        editDetails(owner, index);
                      }}
                      className="text-gray-700 cursor-pointer h-5 w-5"
                    />
                  </div>
                  <div>
                    <Delete01
                      onClick={() => {
                        removeDetails(index);
                      }}
                      className="text-gray-700 mt-5 cursor-pointer h-5 w-5"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        <Modal
          size={'lg'}
          classNames={{
            title: 'text-brand-960 font-semibold text-lg',
            content: 'rounded-xl ',
            header: 'w-24 float-right bg-transparent',
            body: 'p-0',
            close: 'text-gray-400',
          }}
          opened={opened}
          onClose={close}
        >
          <div>
            <div className=" bg-cover w-full my-3 relative">
              <img src={bgPattrerens.toString()} alt="circle-bg" className="circleImg -z-10" />
              <Users04Icon className="ms-6.8 mt-3 size-9" />
            </div>
            <div className="p-5 pt-2">
              <div className="leading-7 font-semibold text-lg	 text-gray-900 ">Add owner</div>
              <div className="text-sm font-normal text-gray-600 mt-2">
                Share where you’ve worked on your profile.
              </div>
              <fieldset className="grid-cols-2 grid gap-5 mt-4">
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
                  {...register(`email`)}
                  leftSection={<EmailIcon02 className="size-5" />}
                  label="Email address*"
                  placeholder="olivia@untitledui.com"
                  error={errors?.email?.message}
                />
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
                        value={field.value}
                        size="sm"
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
                            clearErrors('phone_number');
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
                  onClick={close}
                  className="border-gray-300 font-semibold h-11 rounded-lg text-gray-700  hover:bg-transparent hover:text-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleContinue}
                  variant="outline"
                  className="rounded-lg h-11 hover:bg-brand-970 hover:text-white bg-brand-960 text-base text-white font-semibold ms-3"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </Modal>
        <div
          onClick={() => {
            //set values to default
            methods.reset();
            open();
          }}
          className="bg-white border-solid border border-[#D0D5DD]  drop-shadow-xs rounded-lg flex items-center justify-center cursor-pointer m-h-30 h-30"
        >
          <div className="flex items-center justify-center text-brand-960 font-semibold text-lg">
            Add owner <Users03Icon className="ms-3" />
          </div>
        </div>
      </div>
    </>
  );
}
