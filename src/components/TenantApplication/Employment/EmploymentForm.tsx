import CustomInput from '@utils/CustomInput';
import { Select } from '@mantine/core';
import { ArrowDown } from '@assets/iconComponents';
import { useForm, UseFormReturn } from 'react-hook-form';
import { employmentFormInitialValue, employmentFormSchema, EmploymentFormShcema } from '../Schema';
import clsx from 'clsx';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';

interface Props {
  formData: EmploymentFormShcema;
  setShowAddForm: (data: boolean) => void;
  setShowEditForm: (data: boolean) => void;
  onSubmit: (data: EmploymentFormShcema) => void;
  onCancel: () => void;
  index: number;
  methods: UseFormReturn<EmploymentFormShcema>;
  submitTrigger: boolean;
  setSubmitTrigger: (data: boolean) => void;
}

export const EmploymentForm = ({
  formData,
  onSubmit,
  onCancel,
  index,
  setShowAddForm,
  setShowEditForm,
  submitTrigger,
  setSubmitTrigger,
  methods,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    ...form
  } = useForm<EmploymentFormShcema>({
    resolver: yupResolver(employmentFormSchema),
    defaultValues: formData || employmentFormInitialValue,
  });
  useEffect(() => {
    reset(formData);
  }, [formData]);
  const handleFormSubmit = (values: EmploymentFormShcema) => {
    onSubmit(values); // Pass form data to the onSubmit handler
    reset(employmentFormInitialValue); // Reset the form after submission
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
        <span className="text-Gray-600 text-center text-sm font-medium leading-5">Employment</span>
      </div>
      <div className="grid grid-cols-2 w-full gap-6 ">
        <Select
          classNames={{
            option: 'mb-0.5 rounded-[8px]',
            dropdown: 'rounded-[8px] drop-shadow-lg shadow-lg',
            error: 'bottom-3'
          }}
          label="Employment Status*"
          placeholder="Select all that apply"
          checkIconPosition="right"
          comboboxProps={{ dropdownPadding: 0 }}
          rightSection={<ArrowDown />}
          data={['Full time', 'Part time', 'Self employed', 'Investment', 'Gov.benefits', 'Others']}
          {...register('employmentStatus')}
          // Handle null case by providing a fallback or ignoring null values
          onChange={(value) => {
            if (value) {
              setValue('employmentStatus', value); // update form value if it's not null
            } else {
              setValue('employmentStatus', ''); // fallback to empty string if value is null
            }
            form.trigger('employmentStatus'); // manually trigger validation if needed
          }}
          error={errors.employmentStatus?.message}
          onBlur={() => form.trigger('employmentStatus')}
          
        />
        <div className="flex flex-col items-start gap-1.5 flex-0">
          <CustomInput
            className="w-full"
            label="Job description* "
            placeholder="Job description"
            {...register('jobDescription')}
            error={errors.jobDescription?.message}
          />
          <div className={clsx(`${errors.jobDescription?.message ? 'mt-2.5':''}`, 'text-sm w-full font-normal text-Gray-600 leading-5')}>
            This is a hint text to help user.
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 w-full gap-6 ">
        <div className="flex flex-col items-start gap-1.5 flex-0">
          <CustomInput
            className="w-full"
            label="Company name*"
            placeholder="What is your title"
            {...register('companyName')}
            error={errors.companyName?.message}
          />
          <div className={clsx(`${errors.companyName?.message ? 'mt-2.5':''}`, 'text-sm w-full font-normal text-Gray-600 leading-5')}>
            This is a hint text to help user.
          </div>
        </div>
        <div className="flex flex-col items-start gap-1.5 flex-0">
          <CustomInput
            className="w-full"
            label="Company website* "
            placeholder="What is your title"
            {...register('companyWebsite')}
            error={errors.companyWebsite?.message}
          />
          <div className={clsx(`${errors.companyWebsite?.message ? 'mt-2.5':''}`, 'text-sm w-full font-normal text-Gray-600 leading-5')}>
            This is a hint text to help user.
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 w-full gap-6 ">
        <div className="flex flex-col items-start gap-1.5 flex-0">
          <CustomInput
            className="w-full"
            label="length*"
            placeholder="What is your title"
            {...register('length')}
            error={errors.length?.message}
          />
          <div className={clsx(`${errors.length?.message ? 'mt-2.5':''}`, 'text-sm w-full font-normal text-Gray-600 leading-5')}>
            This is a hint text to help user.
          </div>
        </div>
        <div className="flex flex-col items-start gap-1.5 flex-0">
          <CustomInput
            className="w-full"
            label="Monthly wages*"
            placeholder="What is your title"
            {...register('monthlyWage')}
            error={errors.monthlyWage?.message}
          />
          <div className={clsx(`${errors.monthlyWage?.message ? 'mt-2.5':''}`, 'text-sm w-full font-normal text-Gray-600 leading-5')}>
            This is a hint text to help user.
          </div>
        </div>
      </div>
    </div>
  );
};
