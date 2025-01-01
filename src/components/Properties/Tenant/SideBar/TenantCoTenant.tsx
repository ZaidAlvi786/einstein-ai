import { Badge } from '@mantine/core';
import React from 'react';

const TenantCoTenant = () => {
  return (
    <div className="pt-10 px-6 mt-12">
      <div className="flex justify-between ">
        <div className="flex">
          <div className="self-center">
            <div className="text-2xl	font-semibold leading-8	text-Gray-900  flex items-center ">
              <span className="text-ellipsis max-w-32 whitespace-nowrap overflow-hidden">
                Mollie Hall
              </span>
              <Badge
                classNames={{
                  root: 'ms-1 bg-Gray-200 rounded-[6px] border border-Gray-200 border-solid  border-[1px] drop-shadow-xs',
                  label:
                    'text-xs font-medium leading-11 text-gray-700 capitalize  whitespace-nowrap overflow-hidden',
                }}
                variant="light"
                className="h-3.2"
              >
                Primary Tenant
              </Badge>
            </div>
            <div className="font-normal	text-sm	leading-5 text-gray-600 ">
              mollie@untitledui.com
            </div>
            <div className="font-normal	text-sm	leading-5	text-gray-600 ">212-212-1100</div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-2 ">
        <div className="flex">
          <div className="self-center">
            <div className="text-2xl	font-semibold leading-8	text-Gray-900  flex items-center ">
              <span className="text-ellipsis max-w-32 whitespace-nowrap overflow-hidden">
                Mollie Hall
              </span>
              <Badge
                classNames={{
                  root: 'ms-1 bg-Gray-200 rounded-[6px] border border-gray-300 border-solid  border-[1px] drop-shadow-xs',
                  label:
                    'text-xs font-medium leading-11 text-gray-700 capitalize  whitespace-nowrap overflow-hidden',
                }}
                variant="light"
                className="h-3.2"
              >
                Co-tenant
              </Badge>
            </div>
            <div className="font-normal	text-sm	leading-5 text-gray-600 ">
              mollie@untitledui.com
            </div>
            <div className="font-normal	text-sm	leading-5	text-gray-600">212-212-1100</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantCoTenant;
