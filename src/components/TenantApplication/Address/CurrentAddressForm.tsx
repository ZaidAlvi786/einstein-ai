import CustomInput from '@utils/CustomInput';
import { Select } from '@mantine/core';
import { ArrowDown, DateIcon } from '@assets/iconComponents';
import { useForm, UseFormReturn } from 'react-hook-form';
import { currentAddressFormSchema, CurrentAddressFormSchema, currentAddressInitialValue } from '../Schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { statesList } from '@constants/app.constant';

interface Props {
  formData: CurrentAddressFormSchema;
  setShowAddForm: (data: boolean) => void;
  setShowEditForm: (data: boolean) => void;
  onSubmit: (data: CurrentAddressFormSchema) => void;
  onCancel: () => void;
  index: number;
  methods: UseFormReturn<CurrentAddressFormSchema>;
  submitTrigger: boolean;
  setSubmitTrigger: (data: boolean) => void;
}

export const CurrentAddressForm = ({
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
  } = useForm<CurrentAddressFormSchema>({
    resolver: yupResolver(currentAddressFormSchema),
    defaultValues: formData || currentAddressInitialValue,
  });
  useEffect(() => {
    reset(formData);
  }, [formData]);
  const handleFormSubmit = (values: CurrentAddressFormSchema) => {
    onSubmit(values); // Pass form data to the onSubmit handler
    reset(currentAddressInitialValue); // Reset the form after submission
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
        <span className="text-Gray-600 text-center text-sm font-medium leading-5">Current address</span>
      </div>
      <div className="grid grid-cols-2 w-full gap-6 ">
      <CustomInput
            className="w-full"
            label="Address 1* "
            placeholder="Enter address"
            {...register('address1')}
            error={errors.address1?.message}
          />
        <div className="flex flex-col items-start gap-1.5 flex-0">
          <CustomInput
            className="w-full"
            label="Address 2 "
            placeholder="Enter address 2"
            {...register('address2')}
            error={errors.address2?.message}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 w-full gap-6 ">
        <div className="flex flex-col items-start gap-1.5 flex-0 col-span-1">
          <CustomInput
            className="w-full"
            label="City*"
            placeholder="Enter city name"
            {...register('city')}
            error={errors.city?.message}
          />
        </div>
        <div className="flex flex-col items-start gap-1.5 flex-0 col-span-1">
        <Select
                    label="State*"
                    placeholder="Select State"
                    checkIconPosition="right"
                    rightSection={<ArrowDown />}
                    data={statesList}
                    className={`w-full `}
                    {...register('state')}
                    onChange={(_value, option) => {
                      setValue('state', option.value);
                      form.clearErrors('state');
                    }}
                    error={errors.state?.message}
                  />
        </div>
        <div className="flex flex-col items-start gap-1.5 flex-0 col-span-1">
          <CustomInput
            className="w-full"
            label="zip*"
            placeholder="000000"
            {...register('zip')}
            error={errors.zip?.message}
            type='number'
          />
        </div>
      </div>
      <div className="grid grid-cols-2 w-full gap-6 ">
        <div className="flex flex-col items-start gap-1.5 flex-0">
        <Select
          classNames={{
            option: 'mb-0.5 rounded-[8px]',
            dropdown: 'rounded-[8px] drop-shadow-lg shadow-lg',
          }}
          label="Employment Status*"
          placeholder="Select all that apply"
          checkIconPosition="right"
          comboboxProps={{ dropdownPadding: 0 }}
          rightSection={<ArrowDown />}
          data={['Full time', 'Part time', 'Self employed', 'Investment', 'Gov.benefits', 'Others']}
          {...register('type')}
          // Handle null case by providing a fallback or ignoring null values
          onChange={(value) => {
            if (value) {
              setValue('type', value); // update form value if it's not null
            } else {
              setValue('type', ''); // fallback to empty string if value is null
            }
            form.trigger('type'); // manually trigger validation if needed
          }}
          error={errors.type?.message}
          onBlur={() => form.trigger('type')}
        />
        </div>
        <div className="flex flex-col items-start gap-1.5 flex-0">
          <CustomInput
            className="w-full"
            label="Monthly wages*"
            placeholder="What is your title"
            {...register('monthlyRent')}
            error={errors.monthlyRent?.message}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 w-full gap-6 ">
        <div className="flex flex-col items-start gap-1.5 flex-0 col-span-1">
          <CustomInput
            leftSection={<DateIcon/>}
            className="w-full"
            label="Move in date*"
            placeholder="Select day"
            {...register('moveInDate')}
            error={errors.moveInDate?.message}
          />
        </div>
        <div className="flex flex-col items-start gap-1.5 flex-0 col-span-1">
        <CustomInput
            leftSection={<DateIcon/>}
            className="w-full"
            label="Move out date*"
            placeholder="Select day"
            {...register('moveOutDate')}
            error={errors.moveOutDate?.message}
          />
        </div>
        <div className="flex flex-col items-start gap-1.5 flex-0 col-span-1">
          <CustomInput
            className="w-full"
            label="Reason for moving*"
            placeholder="000000"
            {...register('movingReason')}
            error={errors.movingReason?.message}
            type='number'
          />
        </div>
      </div>
    </div>
  );
};
