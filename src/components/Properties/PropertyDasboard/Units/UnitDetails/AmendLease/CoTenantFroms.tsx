import { ArrowDown, Edit01Icon, EmailIcon02, SvgDefaultUser01 } from '@assets/iconComponents';
import { statesList } from '@constants/app.constant';
import { yupResolver } from '@hookform/resolvers/yup';
import { Badge, Button, Card, Checkbox, Select } from '@mantine/core';
import CustomInput from '@utils/CustomInput';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CoTeanantDetailsForm, coTenantschema } from './schema';

interface Props {
  coteanantForm: boolean;
  setCoteanantForm: (value: boolean) => void;
  showCotenatFields: boolean;
  setShowCotenentFields: (value: boolean) => void;
}

const initialValues: CoTeanantDetailsForm = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
  newTenant: false,
};

interface CoTenantFormProps {
  formData: CoTeanantDetailsForm;
  onSubmit: (data: CoTeanantDetailsForm) => void;
  onCancel: () => void;
}

export function CoTenantForm({ formData, onSubmit, onCancel }: CoTenantFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm<CoTeanantDetailsForm>({
    resolver: yupResolver(coTenantschema),
    defaultValues: formData || initialValues,
  });

  const handleFormSubmit = (values: CoTeanantDetailsForm) => {
    onSubmit(values);
    reset(initialValues);
  };

  const [coTenantCheck, setCoTenantCheck] = useState(false);
  const [guarantor, setGuarantor] = useState(false);
  const [residents, setResidents] = useState(false);
  const [coApplicantList, setCoApplicantList] = useState<CoTeanantDetailsForm[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleEdit = (index: number) => {
    const coApplicant = coApplicantList[index];
    setEditIndex(index);
    reset(coApplicant);
  };

  return (
    <Card
    classNames={{
      root: 'flex px-4 gap-18 w-full flex-col items-start flex-0 rounded-[12px] border-[1px] border-solid border-Gray-200 bg-white drop-shadow-xs',
    }}
  >
    <div className="flex py-2 w-full flex-col items-center gap-2 rounded-[8px] border-[1px] border-solid border-Gray-200 bg-Gray-100 drop-shadow-xs">
      <span className="text-Gray-600 text-center text-sm font-medium leading-5">Co-tenant</span>
    </div>

      <div className="grid gap-5">
        <div className="flex gap-3 items-start">
          <Checkbox
            checked={coTenantCheck}
            onChange={() => setCoTenantCheck(!coTenantCheck)}
            classNames={{
              input: clsx('!rounded-[6px]', coTenantCheck && '!bg-brand-970 !border-brand-970'),
            }}
          />
          <div>
            <div className="text-gray-700 text-base font-medium">Co-applicant</div>
            <div className="text-gray-600 text-base">Will be residing at property and will share financial responsibilities</div>
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <Checkbox
            checked={guarantor}
            onChange={() => setGuarantor(!guarantor)}
            classNames={{
              input: clsx('!rounded-[6px]', guarantor && '!bg-brand-970 !border-brand-970'),
            }}
          />
          <div>
            <div className="text-gray-700 text-base font-medium">Guarantor</div>
            <div className="text-gray-600 text-base">Takes on financial responsibilities - not residing at the property.</div>
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <Checkbox
            checked={residents}
            onChange={() => setResidents(!residents)}
            classNames={{
              input: clsx('!rounded-[6px]', residents && '!bg-brand-970 !border-brand-970'),
            }}
          />
          <div>
            <div className="text-gray-700 text-base font-medium">Additional residents</div>
            <div className="text-gray-600 text-base">Residing at property without financial obligations</div>
          </div>
        </div>
      </div>

      <fieldset className="grid grid-cols-2 gap-4">
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
        <CustomInput
          leftSection={<EmailIcon02 className="size-5" />}
          label="Email address"
          placeholder="Enter email address"
          {...register('email')}
          error={errors.email?.message}
          onBlur={() => trigger('email')}
        />
        <CustomInput
          label="Phone number"
          placeholder="Enter phone number"
          {...register('phoneNumber')}
          error={errors.phoneNumber?.message}
          onBlur={() => trigger('phoneNumber')}
        />
      </fieldset>

      <div className="flex py-2 w-full flex-col items-center gap-2 rounded-[8px] border-[1px] border-solid border-Gray-200 bg-Gray-100 drop-shadow-xs">
        <span className="text-Gray-600 text-center text-sm font-medium leading-5">Previous address</span>
      </div>

      <fieldset className="grid grid-cols-2 gap-4">
        <CustomInput
          label="Address 1*"
          placeholder="Enter address"
          {...register('address1')}
          error={errors.address1?.message}
          onBlur={() => trigger('address1')}
        />
        <CustomInput
          label="Address 2"
          placeholder="Enter address"
          {...register('address2')}
        />
      </fieldset>

      <fieldset className="grid grid-cols-3 gap-4">
        <CustomInput
          label="City*"
          placeholder="Enter city"
          {...register('city')}
          error={errors.city?.message}
          onBlur={() => trigger('city')}
        />
        <CustomInput
          label="State*"
          placeholder="Enter state"
          {...register('state')}
          error={errors.state?.message}
          onBlur={() => trigger('state')}
        />
        <CustomInput
          label="ZIP*"
          placeholder="00000"
          {...register('zip')}
          error={errors.zip?.message}
          onBlur={() => trigger('zip')}
        />
      </fieldset>

      <div className="flex justify-end gap-6 w-full">
        <Button variant="subtle" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="subtle" onClick={handleSubmit(handleFormSubmit)}>
          Add
        </Button>
      </div>
    </Card>
  );
}
