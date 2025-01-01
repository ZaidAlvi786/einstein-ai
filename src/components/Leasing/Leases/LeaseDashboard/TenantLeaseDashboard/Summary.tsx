import { ArrowNarrowDownIcon, ShieldTickIcon } from '@assets/iconComponents';
import { TenantGuaranteeFeatures } from '@constants/app.constant';
import { Button } from '@mantine/core';

export const Summary = () => {
  return (
    <div className="flex justify-between items-start flex-col md:flex-row">
      <div className="flex gap-10 h-full flex-col justify-between w-full">
        <div className="flex gap-8 justify-between w-full grid grid-cols-2">
          <div className="flex flex-col gap-2 cols-span-1">
            <div className="text-sm font-medium leading-5 text-Brand-700">Active leases</div>
            <div className="text-4xl font-semibold leading-44 text-Brand-700">134</div>
          </div>
          <div className="flex flex-col gap-2 cols-span-1">
            <div className="text-sm font-medium leading-5 text-Success-700">Guaranteed leases</div>
            <div className="text-4xl font-semibold leading-44 text-Success-700">112</div>
          </div>
          <div className="flex flex-col gap-2 cols-span-1">
            <div className="text-sm font-medium leading-5 text-Indigo-700">Scheduled lease</div>
            <div className="text-4xl font-semibold leading-44 text-Indigo-700">132</div>
          </div>
          <div className="flex flex-col gap-2 cols-span-1">
            <div className="text-sm font-medium leading-5 text-Error-700">Expired leases</div>
            <div className="text-4xl font-semibold leading-44 text-Error-700">132</div>
          </div>
        </div>
        <Button
          size="md"
          variant="outline"
          className="bg-white text-sm text-base font-semibold rounded-lg border-Gray-300 text-Gray-700 hover:text-Gray-600 w-fit"
          rightSection={<ArrowNarrowDownIcon />}
        >
          View
        </Button>
      </div>
      <div className="flex flex-1 flex-col pt-8 px-4 pb-6 gap-4 rounded-[12px] border-2 border-solid border-Success-600 h-full w-full md:max-w-[40%]">
        <div className="flex flex-col gap-4 justify-center items-center">
          <div className="flex flex-row items-center p-[2px_6px_2px_4px] gap-1 text-Success-700 bg-Success-50 border border-solid border-[#ABEFC6] rounded-[6px]">
            <ShieldTickIcon width={17} height={18} stroke="#079455" />
            Quality Tenant Guarantee
          </div>
        </div>
        <div className="flex gap-5 text-Gray-700 flex-col xl:flex-row">
          <div className="flex gap-4 flex-col p-6 flex-1 xl:w-[235px]">
            <ul className="list-disc font-semibold text-[12px] leading-[18px] ">
              {TenantGuaranteeFeatures.map((feature, index) => (
                <li key={index} className="list-disc">
                  {feature}
                </li>
              ))}
            </ul>
            <div className="flex text-sm leading-5 font-semibold justify-center cursor-pointer">
              See full details
            </div>
            <Button
              size="lg"
              className="bg-Success-600 w-full text-sm text-base font-semibold rounded-lg border-Gray-300 text-white h-10 hover:bg-Success-600 hover:text-white w-fit drop-shadow-sm"
            >
              Enroll tenants
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
