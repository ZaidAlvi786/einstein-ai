import { ArrowDown } from '@assets/iconComponents';
import { Select } from '@mantine/core';
import CustomInput from '@utils/CustomInput';
import React from 'react';

const PropertyModelFormData = () => (
  <div>
    <fieldset className="grid grid-cols-12 gap-5 mt-4">
      <CustomInput className="col-span-4" label="Name" placeholder="What is your title?" />
      <CustomInput className="col-span-3" label="Units" placeholder="What is your title?" />
      <CustomInput
        className="col-span-5"
        label="Association with property*"
        placeholder="Your Association with property"
      />
    </fieldset>
    <fieldset className="grid grid-cols-2 gap-5 mt-4">
      <CustomInput label="Address 1*" placeholder="What is your title?" />
      <CustomInput label="Address 2" placeholder="What is your title?" />
    </fieldset>
    <fieldset className="grid grid-cols-3 gap-5 mt-4">
      <CustomInput label="City*" placeholder="What is your title?" />
      <Select
        classNames={{
          option: 'mb-0.5 rounded-[8px]',
          dropdown: 'rounded-[8px] drop-shadow-lg shadow-lg',
        }}
        label="State*"
        placeholder="What is your title?"
        checkIconPosition="right"
        comboboxProps={{ dropdownPadding: 0 }}
        rightSection={<ArrowDown />}
        data={['Phoenix Baker', 'Olivia Rhye', 'Lana Steiner']}
      />
      <CustomInput label="Zip*" placeholder="00000" />
    </fieldset>
  </div>
);

export default PropertyModelFormData;
