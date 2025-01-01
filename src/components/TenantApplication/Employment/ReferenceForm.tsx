import CustomInput from '@utils/CustomInput';
import { Button, Select } from '@mantine/core';
import { ArrowDown } from '@assets/iconComponents';
import { useForm, UseFormReturn } from 'react-hook-form';
import {
  employmentFormInitialValue,
  employmentFormSchema,
  EmploymentFormShcema,
  referenceFormInitialValue,
  referenceFormSchema,
  ReferenceFormShcema,
} from '../Schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';

interface Props {
  formData: ReferenceFormShcema;
  setShowAddForm: (data: boolean) => void;
  setShowEditForm: (data: boolean) => void;
  onSubmit: (data: ReferenceFormShcema) => void;
  onCancel: () => void;
  index: number;
  methods: UseFormReturn<ReferenceFormShcema>;
  submitTrigger: boolean;
  setSubmitTrigger: (data: boolean) => void;
}

export const ReferenceForm = ({
  formData,
  onSubmit,
  onCancel,
  index,
  setShowAddForm,
  setShowEditForm,
  setSubmitTrigger,
  submitTrigger,
  methods,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    ...form
  } = useForm<ReferenceFormShcema>({
    resolver: yupResolver(referenceFormSchema),
    defaultValues: formData || referenceFormInitialValue,
  });
  useEffect(() => {
    reset(formData);
  }, [formData]);
  const handleFormSubmit = (values: ReferenceFormShcema) => {
    setTimeout(() => {
      onSubmit(values); // Pass form data to the onSubmit handler
      reset(referenceFormInitialValue); // Reset the form after submission
    }, 500);
  };

  const checkForErrors = (errors: any) => {
    console.log(errors, 'errorss');
  };
  useEffect(() => {
    if (submitTrigger) {
      handleSubmit(handleFormSubmit, checkForErrors)();
      setSubmitTrigger(false); // Reset trigger after submission
    }
  }, [submitTrigger]);

  return (
    <div className="flex flex-col gap-6 w-full items-start">
      <div className="flex w-full py-2 flex-col items-center gap-2 rounded-[8px] bg-Gray-50">
        <span className="text-Gray-600 text-center text-sm font-medium leading-5">
          Employment reference
        </span>
      </div>
      <div className="grid grid-cols-3 w-full gap-6 ">
        <CustomInput
          className="col-span-1"
          label="First name* "
          placeholder="Enter your first name"
          {...register('firstName')}
          error={errors.firstName?.message}
        />
        <CustomInput
          className="col-span-1"
          label="Last name* "
          placeholder="Enter your last name"
          {...register('lastName')}
          error={errors.lastName?.message}
        />

        <CustomInput
          className="col-span-1"
          label="title* "
          placeholder="Enter your title"
          {...register('title')}
          error={errors.title?.message}
        />
      </div>
      <div className="grid grid-cols-2 w-full gap-6 ">
        <CustomInput
          className="col-span-1"
          label="Phone number*"
          placeholder="Enter your phone number"
          {...register('phoneNumber')}
          error={errors.phoneNumber?.message}
        />
        <CustomInput
          className="col-span-1"
          label="Email* "
          placeholder="Enter your email address"
          {...register('email')}
          error={errors.email?.message}
        />
      </div>
    </div>
  );
};
