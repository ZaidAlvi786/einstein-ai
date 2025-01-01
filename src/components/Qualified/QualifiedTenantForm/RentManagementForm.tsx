import { Home01Icon } from '@assets/iconComponents';
import { Anchor, Button } from '@mantine/core';
import CustomInput from '@utils/CustomInput';
import React from 'react';
import { Link } from 'react-router-dom';

const RentManagementForm = () => (
  <div className="border-solid border-[1px] border-Brand-500 rounded-[12px] p-6 mt-6">
    <div className="flex flex-col justify-center items-center gap-3">
      <div className="bg-Brand-50 border-solid border-[1px] border-Brand-200 rounded-[5px] drop-shadow-lg text-center w-fit p-1">
        <Home01Icon />
      </div>
      <div className="text-Gray-900 font-semibold text-lg mt-3">Log in to your account</div>
      <div className="text-Gray-600 font-normal text-sm">
        Log in to your account and select a property
      </div>
    </div>
    <div className=" flex flex-col  self-stretch gap-5 mt-3">
      <CustomInput size="md" placeholder="Enter your email" label="Email" type="text" />
      <CustomInput size="md" placeholder="••••••••" label="Password" type="password" />
      <Anchor component="button" size="sm" className="text-sm-semibold text-[#363F72] flex">
        <Link className="text-[#363F72]" to={''}>
          Forgot password
        </Link>
      </Anchor>
      <Button className="bg-Brand-600 rounded-[6px] hover:bg-Brand-600 text-base font-semibold">
        Sign in
      </Button>
    </div>
  </div>
);

export default RentManagementForm;
