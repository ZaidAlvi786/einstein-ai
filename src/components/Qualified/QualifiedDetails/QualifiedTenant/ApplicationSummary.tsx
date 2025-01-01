import { ArrowNarrowDownIcon } from '@assets/iconComponents';
import ShieldTick from '@assets/iconComponents/ShieldTick';
import { TenantGuaranteeFeatures } from '@constants/app.constant';
import { Button, List } from '@mantine/core';

export const ApplicationSummary = () => (
  <div className="flex justify-between gap-10 items-start">
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium leading-5 text-Gray-600">New qualified tenants</div>
        <div className="text-4xl font-semibold leading-[44px] text-Gray-900">142</div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium leading-5 text-Gray-600">Monthly income value</div>
        <div className="flex gap-1">
          <span className="text-xl font-medium leading-7 mt-1">$</span>
          <h1 className="text-3xl font-semibold leading-10">189,880</h1>
        </div>
      </div>
      <Button
        size="lg"
        className="bg-Success-600 text-sm text-base font-semibold rounded-lg border-Gray-300 text-white h-10 hover:bg-Success-600 hover:text-white w-fit drop-shadow-sm"
      >
        Enroll tenants
      </Button>
    </div>
    <div className="flex flex-1 flex-col pt-8 px-4 pb-6 gap-4 rounded-[12px] border-2 border-solid border-Success-600 h-full max-w-[461px]">
      <div className="flex flex-col gap-4 justify-center items-center">
        <div className="flex flex-row items-center p-[2px_6px_2px_4px] gap-1 text-Success-700 bg-Success-50 border border-solid border-[#ABEFC6] rounded-[6px]">
          <ShieldTick width={17} height={18} stroke="#079455" />
          Quality Tenant Guarantee
        </div>
      </div>
      <div className="flex gap-5 text-Gray-700">
        <div className="flex flex-col gap-2 p-[0_16px] text-[14px] font-medium leading-[20px] w-[214px]">
          <div className="flex items-center justify-center">For only</div>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-[24px] leading-[32px]">4%</span>
            <span>of monthly rent</span>
          </div>
          <div className="flex items-center justify-center text-[11px] leading-[18px] text-center">
            Paid monthly with anuell comitment
          </div>
        </div>
        <div className="flex gap-4 flex-col w-[235px]">
          <ul className="list-disc font-semibold text-[12px] leading-[18px] ">
            {TenantGuaranteeFeatures.map((feature) => (
              <li className="list-disc">{feature}</li>
            ))}
          </ul>
          <div className="text-sm text-center leading-5 font-semibold cursor-pointer">
            See full details
          </div>
        </div>
      </div>
    </div>
  </div>
);
