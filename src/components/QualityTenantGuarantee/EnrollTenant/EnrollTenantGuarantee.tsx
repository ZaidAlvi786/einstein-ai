import {
  PlusIcon01,
  ShieldTickIcon,
  Users01Icon,
  Users02Icon,
  VisaCardIcon,
} from '@assets/iconComponents';
import ShieldTick from '@assets/iconComponents/ShieldTick';
import { Checkbox } from '@mantine/core';
import ImageCard from '@shared/components/ImageCard';
import React from 'react';

const EnrollTenantGuarantee = () => (
  <div className="p-6">
    <div className="mt-4 text-sm font-medium rounded-[8px] leading-5 flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
      Quality Tenant Guarantee
    </div>
    <div className="flex gap-3 mt-6">
      <Checkbox defaultChecked color="#3E4784" />
      <div className="flex items-center gap-1">
        <div className="text-Gray-700 text-sm font-semibold">Quality tenant guarantee</div>
        <div className="text-Gray-600 text-sm font-medium">%4 of monthly rent/month</div>
      </div>
    </div>
    <div className="flex gap-3 mt-6">
      <Checkbox color="#3E4784" />
      <div className="flex items-center gap-1">
        <div className="text-Gray-700 text-sm font-semibold">Security deposit waiver add on</div>
        <div className="text-Gray-600 text-sm font-medium">%1 of monthly rent/month</div>
      </div>
    </div>
    <div className="grid grid-cols-12 gap-6 mt-6">
      <div className="col-span-5 flex flex-col justify-center">
        <div className="text-Gray-700 text-sm font-semibold mb-3">Price brackdown</div>
        <div className="flex justify-between gap-1">
          <div className="text-Gray-700 text-sm font-medium">One time application fee</div>
          <div className="text-Gray-700 text-sm font-medium">$0</div>
        </div>
        <div className="flex justify-between gap-1 mt-2">
          <div className="text-Gray-700 text-sm font-medium">Monthly program fee</div>
          <div className="text-Gray-700 text-sm font-medium">$0</div>
        </div>
        <div className="text-Gray-700 text-sm font-normal leading-5 mt-4 text-start">
          You will be billed a monthly fee of $40 for the QTG program. First payment will be on
          <span className="text-Gray-700 text-sm font-bold"> 07/01/2024</span> and continue for a
          <span className="text-Gray-700 text-sm font-bold"> 12 months period.</span>
          After that it will auto renew on a annual bases unless cancelled.
        </div>
        <div className="flex justify-between gap-1 mt-4">
          <div className="text-Gray-700 text-sm font-semibold">Total due today</div>
          <div className="text-Gray-700 text-sm font-semibold">$0</div>
        </div>
      </div>
      <div className="col-span-7 border-solid border-[2px] border-Success-600 p-4 rounded-[12px]">
        <div className="flex items-center justify-center">
          <div className="flex items-center  gap-1 w-fit border-solid border-[1px] border-success-200 rounded-[6px] bg-success-50 py-2 px-2">
            <ShieldTickIcon stroke="#079455" width={14} height={14} strokeWidth={4} />
            <div className="text-success-700 tex-xs font-medium">Quality Tenant Guarantee</div>
          </div>
        </div>
        <div className="mt-4 p-3">
          <ul className="list-disc list-style-type-disc text-Gray-700 text-sm font-semibold leading-5">
            <li>12 months rent guaranteed (up to $100,000)</li>
            <li>Full eviction management</li>
            <li>Releasing assistance</li>
            <li>Rent reprting to the credit beuiros</li>
            <li>Security deposit waiver (for an additnal 1%)</li>
          </ul>
        </div>
        <div className="text-Gray-700 text-sm font-normal leading-5 mt-4 text-start">
          You will be billed a monthly fee of $40 for the QTG program. First payment will be on
          <span className="text-Gray-700 text-sm font-bold"> 07/01/2024</span> and continue for a
          <span className="text-Gray-700 text-sm font-bold"> 12 months period.</span>
          After that it will auto renew on a annual bases unless cancelled.
        </div>
        <div className="text-Gray-700 text-sm font-medium leading-5 cursor-pointer mt-6 text-center">
          See full details
        </div>
      </div>
    </div>
    <div className="mt-4 text-sm font-medium rounded-[8px] leading-5 flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
      Payment account
    </div>
    <div className="text-sm font-normal leading-5 text-Gray-600 mt-6 text-center">
      Assign account from where the monthly fee should be collected. Payment will be charged on the
      1th of each month.
    </div>
    <div className="mt-6 grid grid-cols-12 gap-6">
      <div className="col-span-6">
        <ImageCard
          isStatus={false}
          subTitle="Expiry 06/2024"
          title={<div className="text-Gray-700 font-medium text-sm">Visa ending in 1234</div>}
          nestChildren={
            <div className="text-Brand-700 mt-1 font-semibold text-sm">Change payment method</div>
          }
          icon={<VisaCardIcon />}
        />
      </div>
      <div className="col-span-6">
        <ImageCard
          isStatus={false}
          subTitle="123 47584 Main St. New.."
          title={<div className="text-Gray-700 font-medium text-sm">Calvin Brown</div>}
          nestChildren={
            <div className="text-Brand-700 mt-1 font-semibold text-sm">Change billing details</div>
          }
          icon={<Users02Icon />}
        />
      </div>
      <div className="col-span-6 flex items-center justify-center text-center gap-3 border-solid border-[1px] border-Gray-200 rounded-[12px] p-8">
        <div className="text-Brand-700 font-semibold text-base">Add payment backup</div>
        <PlusIcon01 />
      </div>
    </div>
    <div className="mt-4 text-sm font-medium rounded-[8px] leading-5 flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
      Payout account
    </div>
    <div className="text-sm font-normal leading-5 text-Gray-600 mt-6 text-center">
      Assign account where to receive payment in case of a claim
    </div>
    <div className="mt-6 grid grid-cols-12 gap-6">
      <div className="col-span-6">
        <ImageCard
          isStatus={false}
          subTitle="Expiry 06/2024"
          title={<div className="text-Gray-700 font-medium text-sm">Visa ending in 1234</div>}
          nestChildren={
            <div className="text-Brand-700 mt-1 font-semibold text-sm">Change account</div>
          }
          icon={<VisaCardIcon />}
        />
      </div>
      <div className="col-span-6">
        <ImageCard
          isStatus={false}
          subTitle="123 47584 Main St. New.."
          title={<div className="text-Gray-700 font-medium text-sm">Calvin Brown</div>}
          nestChildren={
            <div className="text-Gray-400 mt-1 font-semibold text-sm">Change payout details</div>
          }
          icon={<Users02Icon />}
        />
      </div>
    </div>
    <div className="mt-4 text-sm font-medium rounded-[8px] leading-5 flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
      Sign agreement
    </div>
    <div className="flex gap-3 mt-6">
      <Checkbox color="#3E4784" defaultChecked />
      <div className="flex flex-col gap-1">
        <div className="text-Gray-700 text-base font-semibold">I agree to terms and...</div>
        <div className="text-Gray-600 text-sm font-normal">
          Save my login details for next time.
        </div>
      </div>
    </div>
  </div>
);

export default EnrollTenantGuarantee;
