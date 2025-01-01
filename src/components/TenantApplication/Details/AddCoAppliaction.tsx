import clsx from 'clsx';
import { coApplicantDetailForm, CoApplicantForm, coApplicantInitialValue } from '../Schema';
import { useForm, UseFormReturn, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, Checkbox } from '@mantine/core';
import CustomInput from '@utils/CustomInput';
import { EmailIcon02 } from '@assets/iconComponents';
import { useEffect, useState } from 'react';

interface Props {
    formData: CoApplicantForm;
    onSubmit: (data: CoApplicantForm) => void;
    onCancel: () => void;
    index: number;
    methods: UseFormReturn<CoApplicantForm>;
    setShowAddForm: (data:boolean)=>void;
    setShowEditForm: (data:boolean)=>void;
}

export const AddCoApplicantForm = ({ formData, onSubmit, onCancel, index,setShowAddForm,setShowEditForm }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
    control
  } = useForm<CoApplicantForm>({
    resolver: yupResolver(coApplicantDetailForm),
    defaultValues: formData || coApplicantInitialValue,
  });
  const [submitTrigger, setSubmitTrigger] = useState(false);
  useEffect(() => {
    reset(formData)
  }, [formData]);
  // Destructure the checkbox values using useWatch
  const { coApplicant, guarantor, occupants } = useWatch({
    control,
    name: ['coApplicant', 'guarantor', 'occupants'],
  }) as unknown as { coApplicant: boolean; guarantor: boolean; occupants: boolean };

  const handleFormSubmit = (values: CoApplicantForm) => {
    setTimeout(() => {
        onSubmit(values); // Pass form data to the onSubmit handler
        reset(coApplicantInitialValue); // Reset the form after submission
      }, 200); 
  };
  useEffect(() => {
    if (submitTrigger) {
      handleSubmit(handleFormSubmit)();
      setSubmitTrigger(false); // Reset trigger after submission
    }
  }, [submitTrigger]); 

  return (
    <Card classNames={{ root: 'flex px-4 gap-18 w-full flex-col items-start flex-0 rounded-[12px] border-[1px] border-solid border-Gray-200 bg-white drop-shadow-xs' }}>
      <div className="flex py-2 w-full flex-col items-center gap-2 rounded-[8px] border-[1px] border-solid border-Gray-200 bg-Gray-100 drop-shadow-xs">
        <span className="text-Gray-600 text-center text-sm font-medium leading-5">Co-Applicant</span>
      </div>

      <div className="grid gap-5">
        <div className="flex gap-3 items-start">
          <Checkbox
            {...register('coApplicant')}
            classNames={{
              input: clsx(
                '!rounded-[6px]',
                coApplicant && '!bg-brand-970 !border-brand-970'
              ),
            }}
          />
          <div>
            <div className="text-gray-700 text-base font-medium">Co-applicant</div>
            <div className="text-gray-600 text-base">Will be residing at property and will share financial responsibilities</div>
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <Checkbox
            {...register('guarantor')}
            classNames={{
              input: clsx(
                '!rounded-[6px]',
                guarantor && '!bg-brand-970 !border-brand-970'
              ),
            }}
          />
          <div>
            <div className="text-gray-700 text-base font-medium">Guarantor</div>
            <div className="text-gray-600 text-base">Takes on financial responsibilities - not residing at the property.</div>
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <Checkbox
            {...register('occupants')}
            classNames={{
              input: clsx(
                '!rounded-[6px]',
                occupants && '!bg-brand-970 !border-brand-970'
              ),
            }}
          />
          <div>
            <div className="text-gray-700 text-base font-medium">Additional residents</div>
            <div className="text-gray-600 text-base">Will be living at property with no financial responsibilities</div>
          </div>
        </div>
      </div>

      <fieldset className="grid grid-cols-2 w-full gap-4">
        <CustomInput
          label="First name*"
          placeholder="First name"
          {...register('firstName')}
          error={errors.firstName?.message}
          onBlur={() => trigger('firstName')}
        />
        <CustomInput
          label="Last name*"
          placeholder="Last name"
          {...register('lastName')}
          error={errors.lastName?.message}
          onBlur={() => trigger('lastName')}
        />
      </fieldset>
      <fieldset className="grid grid-cols-2 w-full gap-4">
        <CustomInput
          leftSection={<EmailIcon02 className="size-5" />}
          label="Email address*"
          placeholder="Enter email address"
          {...register('email')}
          error={errors.email?.message}
          onBlur={() => trigger('email')}
        />
        <CustomInput
          label="Phone number*"
          placeholder="Enter phone number"
          {...register('phoneNumber')}
          error={errors.phoneNumber?.message}
          onBlur={() => trigger('phoneNumber')}
        />
      </fieldset>

      <div className="flex justify-end gap-6 w-full">
        <Button variant="subtle" onClick={onCancel}>
          Cancel
        </Button>
        {index === -1 && formData.firstName === '' ? (
        <Button variant="subtle" onClick={() => {
            setShowAddForm(true); // Show the add form
            setSubmitTrigger(true); // Trigger form submission
          }}>
          Add
        </Button>
        ):(
            <Button variant="subtle" onClick={() => {
                setShowEditForm(true); // Show the add form
                setSubmitTrigger(true); // Trigger form submission
              }}>
          Update
        </Button>
        )}
      </div>
    </Card>
  );
};
