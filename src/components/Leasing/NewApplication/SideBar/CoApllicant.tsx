import { SuccessIcon } from '@assets/iconComponents';
import { Badge, Button } from '@mantine/core';
import React from 'react';

const applicantCoapplicant = () => {
  return (
    <div className="py-10 px-4 mt-12">
      <div className="flex justify-between ">
        <div className="flex">
          <div className="self-center">
            <div className="text-2xl	font-semibold leading-8	text-Gray-900  flex items-center ">
              <span className="text-ellipsis max-w-32 whitespace-nowrap overflow-hidden">
                Mollie Hall
              </span>
            </div>
            <div className="font-normal	text-sm	leading-5 text-gray-600 ">mollie@untitledui.com</div>
            <div className="font-normal	text-sm	leading-5	text-gray-600 ">212-212-1100</div>
          </div>
        </div>
      </div>
      <div className="border-gray-960 py-3  border-solid border-y-[1px]  mt-3">
        <div className="text-center font-semibold	text-base	">“Quality tenant” screening</div>
      </div>
      <div className="flex mt-4 justify-between">
        <div className="text-5xl font-semibold ">$20</div>
        <ul className="list-disc">
          <li className="!list-disc text-base font-semibold	">Credit check</li>
          <li className="!list-disc text-base font-semibold	">Eviction records</li>
          <li className="!list-disc text-base font-semibold	">Criminal history</li>
          <li className="!list-disc text-base font-semibold	">Income verification</li>
        </ul>
      </div>
      <div className="border-success-600 border-[1px] border border-solid rounded-xl p-4 mt-5">
        <div className="grid-cols-5 grid gap-5">
          <SuccessIcon />
          <div className="col-span-4">
            <div className="text-sm font-semibold">Guaranteed screening</div>
            <div className="text-sm	font-normal	mt-1 text-gray-600">
              Should the applicant be approved, rent can be secured for up to 12 months. (Separate
              enrollment upon lease signing)
            </div>
          </div>
        </div>
      </div>
      <div className="font-medium text-sm text-gray-600 mt-6 leading-5">
        We will provide you with a dessicen if applicant is qualified for the{' '}
        <span className="font-bold">“quality tenant assurance program”</span>. You will also get a
        copy of the eviction and criminal records.
      </div>
      <Button className="rounded-[8px] hover:bg-brand-970 bg-brand-960 text-base font-semibold h-10 w-full mt-4">
        Screen now
      </Button>
      <Button variant="outline" className="w-full mt-4 border-gray-300 text-gray-700 rounded-lg h-10">
        Send payment link
      </Button>
      <Button variant="outline" className="w-full mt-4 border-gray-300 text-gray-700 rounded-lg h-10">
        Invite to apply
      </Button>
    </div>
  );
};

export default applicantCoapplicant;
