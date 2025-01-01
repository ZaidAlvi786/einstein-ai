import { Button } from '@mantine/core';
import React from 'react';

const QualityTenantSidebar = () => (
  <div className="px-6">
    <div className="text-Success-800 border-solid border-[0.5px] border-t-Success-700"></div>
    <div className="text-lg text-success-800 font-semibold leading-7 text-center p-3">
      Quality Tenant Guarantee
    </div>
    <div className="text-Success-800 border-solid border-[0.5px] border-b-Success-700"></div>

    <div className="text-Gray-600 text-sm font-semibold leading-5 text-center mt-5">
      Enroll tenant into the QualityTenantGuarantee program
    </div>
    <div className="text-center mt-4">
      <div className="text-Brand-900 text-base font-semibold leading-5">Now only</div>
      <div className="flex gap-2 mt-4 items-center">
        <div className="text-5xl font-semibold leading-11">%4</div>
        <div className="flex flex-col gap-1">
          <div className="text-Gray-900 font-medium text-base">of monthly rent</div>
          <div className="text-Gray-600 font-normal text-xs leading-5">
            Paid monthly with anuell comitment
          </div>
        </div>
      </div>
    </div>
    <div className="mt-4 p-3">
      <ul className="list-disc text-Gray-700 text-sm font-semibold leading-5">
        <li>12 months rent guaranteed (up to $100,000)</li>
        <li>Full eviction management</li>
        <li>Releasing assistance</li>
        <li>Rent reprting to the credit beuiros</li>
        <li>Security deposit waiver (for an additnal 1%)</li>
      </ul>
    </div>
    <div className="text-sm font-semibold leading-5 cursor-pointer mt-4 text-center text-Brand-900">
      See full details
    </div>
    <div className="text-sm font-normal leading-5 text-justify mt-4 text-Gray-600">
      The Rent Set Program will start 07/01/2024 for a 12 months period. After that it will auto
      renew on a annual bases unless canceled.
    </div>
    <Button className="bg-Success-600 mt-5 rounded-[8px] w-full">Enroll</Button>
  </div>
);

export default QualityTenantSidebar;
