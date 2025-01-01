import { ArrowDown, DateIcon } from '@assets/iconComponents';
import { Checkbox, Select } from '@mantine/core';
import CustomInput from '@utils/CustomInput';
import clsx from 'clsx';
import React from 'react';

interface IEnrollIndividualProps {
  onChange: (value: any) => void;
  selectedTenant: string;
}
const EnrollIndividual: React.FC<IEnrollIndividualProps> = ({ onChange, selectedTenant }) => (
  <div className="mt-6">
    <fieldset className="grid-cols-2 grid gap-5 mt-2">
      <Select
        classNames={{
          option: 'mb-0.5 rounded-[8px]',
          dropdown: 'rounded-[8px] drop-shadow-lg shadow-lg',
        }}
        label="Property"
        placeholder="Select"
        checkIconPosition="right"
        comboboxProps={{ dropdownPadding: 0 }}
        value={'Withstone apartments'}
        rightSection={<ArrowDown />}
        data={['Withstone apartments', 'Withstone apartments2', 'Withstone apartments3']}
      />
      <Select
        classNames={{
          option: 'mb-0.5 rounded-[8px]',
          dropdown: 'rounded-[8px] drop-shadow-lg shadow-lg',
        }}
        label="Unit"
        placeholder="Select"
        checkIconPosition="right"
        comboboxProps={{ dropdownPadding: 0 }}
        rightSection={<ArrowDown />}
        data={['Unit 101', 'Unit 102', 'Unit 103']}
        value={'Unit 101'}
      />
    </fieldset>
    <fieldset className="grid grid-cols-1 mt-6">
      <Select
        classNames={{
          option: 'mb-0.5 rounded-[8px]',
          dropdown: 'rounded-[8px] drop-shadow-lg shadow-lg',
        }}
        label="Tenant"
        placeholder="Select tenant"
        checkIconPosition="right"
        comboboxProps={{ dropdownPadding: 0 }}
        rightSection={<ArrowDown />}
        data={['Individual Tenant', 'Co Tenant']}
        value={selectedTenant}
        onChange={(value) => onChange(value)}
      />
    </fieldset>
    <fieldset className="grid grid-cols-2 gap-5 mt-6">
      <CustomInput
        label="Email address"
        placeholder="olivia@untitledui.com"
        value="olivia@untitledui.com"
        disabled
      />
      <CustomInput label="Phone number" placeholder="000-000-0000" value="000-000-0000" disabled />
    </fieldset>
    <fieldset className="grid grid-cols-2 gap-5 mt-6">
      <CustomInput
        label="Monthly rent"
        placeholder="$000"
        value="$000"
        disabled
        description="[Amount comited on lease]"
        inputWrapperOrder={['label', 'input', 'description', 'error']}
      />
      <CustomInput
        label="Date moved at property"
        placeholder="Select day"
        description="[not the lease start day!]"
        leftSection={<DateIcon />}
        inputWrapperOrder={['label', 'input', 'description', 'error']}
      />
    </fieldset>

    <fieldset className="grid grid-cols-3 gap-5 mt-6">
      <Select
        classNames={{
          option: 'mb-0.5 rounded-[8px]',
          dropdown: 'rounded-[8px] drop-shadow-lg shadow-lg',
        }}
        label="Lease type"
        placeholder="Select"
        checkIconPosition="right"
        comboboxProps={{ dropdownPadding: 0 }}
        rightSection={<ArrowDown />}
        data={['Unit 101', 'Unit 102', 'Unit 103']}
        value={'Unit 101'}
        description="[12 month - month to month]"
        inputWrapperOrder={['label', 'input', 'description', 'error']}
      />
      <CustomInput
        label="Lease start day"
        placeholder="Select day"
        description="This is a hint text to help user."
        inputWrapperOrder={['label', 'input', 'description', 'error']}
        leftSection={<DateIcon />}
      />
      <CustomInput
        label="Lease end day"
        placeholder="Select day"
        description="This is a hint text to help user."
        leftSection={<DateIcon />}
        inputWrapperOrder={['label', 'input', 'description', 'error']}
      />
    </fieldset>
    <div className="flex gap-3 mt-6">
      <Checkbox
        defaultChecked
        classNames={{
          label: 'text-gray-700 font-medium	text-base',
          body: 'items-center',
        }}
        className="mt-1"
        color="#3E4784"
      />
      <div>
        <div className="text-Gray-700 text-base font-medium">
          Tenant is reseding more than 3 months on the property
        </div>
        <div className="mt-0.5 text-Gray-600 text-base font-normal">
          Save my login details for next time.
        </div>
      </div>
    </div>
    <div className="flex gap-3 mt-6">
      <Checkbox
        defaultChecked
        classNames={{
          label: 'text-gray-700 font-medium	text-base',
          body: 'items-center',
        }}
        className="mt-1"
        color="#3E4784"
      />
      <div>
        <div className="text-Gray-700 text-base font-medium">
          No late payment in the last 12 months
        </div>
        <div className="mt-0.5 text-Gray-600 text-base font-normal">
          Save my login details for next time.
        </div>
      </div>
    </div>
  </div>
);

export default EnrollIndividual;
