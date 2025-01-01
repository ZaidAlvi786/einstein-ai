import { SvgStepSuccess } from '@assets/iconComponents';
import { Button } from '@mantine/core';
import React from 'react';

const TenantSuccess = () => (
  <div className="p-6">
    <div className="flex flex-col items-center gap-4">
      <SvgStepSuccess />
      <div className="text-Gray-900 text-4xl font-semibold">Tenant qualified!</div>
    </div>
    <div className="text-Gray-600 text-xl font-normal leading-7 mt-6 text-center">
      This blog post has been published. Team members will be able to edit this post and republish
      changes.
    </div>
    <div className="text-Gray-600 text-xl font-normal leading-7 mt-6 text-center">
      Qualified does not mean approved, tenant will still undergo a screening upon enrollment
    </div>
    <div className="grid grid-cols-2 gap-3 mt-8 mb-3">
      <Button className="border-solid border-[1px] border-Gray-300 bg-white text-Gray-700  rounded-[8px] drop-shadow-sm font-semibold text-base hover:text-Gray-700 hover:bg-white px-4 py-2">
        Qualify another tenant
      </Button>
      <Button className="border-solid border-[1px] border-Brand-600 bg-Brand-600 text-white  rounded-[8px] drop-shadow-sm font-semibold text-base hover:text-white hover:bg-Brand-600 px-4 py-2">
        Enroll now
      </Button>
    </div>
  </div>
);

export default TenantSuccess;
