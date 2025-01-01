import { EmailIcon02 } from '@assets/iconComponents';
import { Checkbox, Switch } from '@mantine/core';
import CustomInput from '@utils/CustomInput';
import React, { useState } from 'react';

const AddPropertyOwnerDetails = () => {
  const [showOwnerDetail, setShowOwnerDetail] = useState<boolean>(true);
  return (
    <div className="mt-4">
      <Switch defaultChecked label="Company" color="#3E4784" />
      <fieldset className="grid grid-cols-12 gap-5 mt-4">
        <CustomInput
          className="col-span-12"
          label="Company name*"
          placeholder="What is your title?"
        />
      </fieldset>
      <fieldset className="grid grid-cols-2 gap-5 mt-4">
        <CustomInput label="FIrst name*" placeholder="What is your title?" />
        <CustomInput label="Last name*" placeholder="What is your title?" />
      </fieldset>
      <fieldset className="grid grid-cols-2 gap-5 mt-4">
        <CustomInput
          leftSection={<EmailIcon02 className="size-5" />}
          label="Email*"
          placeholder="What is your title?"
        />
        <CustomInput label="Phone*" placeholder="What is your title?" />
      </fieldset>
      <div className="mt-5 rounded-[8px] bg-Gray-50 py-3 text-center text-Gray-600 font-medium text-sm">
        Property manger
      </div>
      <div className="mt-5">
        <Checkbox
          defaultChecked
          label="Same as owner"
          color="#3E4784"
          checked={showOwnerDetail}
          onChange={() => setShowOwnerDetail(!showOwnerDetail)}
        />
        {showOwnerDetail && (
          <div className="mt-5">
            <Switch defaultChecked label="Company" color="#3E4784" />
            <fieldset className="grid grid-cols-12 gap-5 mt-4">
              <CustomInput
                className="col-span-12"
                label="Company name*"
                placeholder="What is your title?"
              />
            </fieldset>
            <fieldset className="grid grid-cols-2 gap-5 mt-4">
              <CustomInput label="FIrst name*" placeholder="What is your title?" />
              <CustomInput label="Last name*" placeholder="What is your title?" />
            </fieldset>
            <fieldset className="grid grid-cols-2 gap-5 mt-4">
              <CustomInput
                leftSection={<EmailIcon02 className="size-5" />}
                label="Email*"
                placeholder="What is your title?"
              />
              <CustomInput label="Phone*" placeholder="What is your title?" />
            </fieldset>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddPropertyOwnerDetails;
