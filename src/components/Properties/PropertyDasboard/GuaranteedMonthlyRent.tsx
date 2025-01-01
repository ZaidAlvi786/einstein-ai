import { Building07Icon } from '@assets/iconComponents';
import { Card } from '@mantine/core';

export function GuaranteedMonthlyRent() {
  return (
    <div className="flex items-start self-stretch flex-col p-8 bg-gradient-brand-60050090-deg w-full">
      <Card
        withBorder
        className="max-w-xs-2 p-0"
        classNames={{
          root: 'flex flex-col items-start self-stretch rounded-[12px] border-[1px] border-solid border-Gray-blue-300 bg-white drop-shadow-xs',
        }}
      >
        <div className="flex p-6 flex-col items-start gap-6 self-stretch">
          <div className="flex flex-col items-start gap-0.5 self-stretch hidden"></div>
          <div className="flex flex-col items-start gap-0.5 self-stretch">
            <div className="flex items-center gap-2 self-stretch">
              <span className="line-clamp-1 font-semibold text-Gray-700 text-ellipsis text-base">
                Guaranteed monthly rent
              </span>
              <span className="hidden"></span>
            </div>
            <span className="text-Success-700 text-2xl font-semibold">$164,000</span>
            <span className="line-clamp-1 font-semibold text-Gray-700 text-ellipsis text-sm leading-5">
              out of $192,000
            </span>
          </div>
          <div className="flex gap-4 items-center self-stretch">
            <span className="flex h-12 w-12  rounded-[9999px] border-[8px] border-solid border-Brand-50 bg-Brand-100">
              <span className="h-full flex w-full p-2 ustify-center items-center flex-0">
                <Building07Icon height={24} width={24} />
              </span>
            </span>
            <div className="flex flex-col justify-center items-start">
              <span className="text-Gray-700 text-sm leading-5 font-semibold">8 properties</span>
              <span className="text-Gray-700 text-sm leading-5 font-semibold">474 units</span>
            </div>
          </div>
          <div className="hidden"></div>
        </div>
        <div className="flex flex-col items-center self-stretch border-t-[1px] border-Gray-200 border-solid">
          <div className="flex justify-end items-center gap-4 py-4 px-6 self-stretch">
            <span className="text-Brand-700 text-sm leading-5 font-semibold cursor-pointer">
              Make a claim
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
