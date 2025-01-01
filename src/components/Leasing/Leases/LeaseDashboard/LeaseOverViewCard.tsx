import { Users05Icon } from '@assets/iconComponents';
import { Avatar, Card } from '@mantine/core';

export const LeaseOverViewCard = () => {
  return (
    <div className="flex items-start self-stretch flex-col p-8 bg-gradient-brand-60050090-deg w-full">
      <Card
        withBorder
        className="max-w-xs-2 p-0"
        classNames={{
          root: 'flex flex-col items-start self-stretch rounded-xl border border-solid border-Gray-blue-300 bg-white drop-shadow-xs',
        }}
      >
        <div className="flex p-6 flex-col items-start gap-6 self-stretch text-Gray-700 font-semibold">
          <div className="flex gap-4 items-center">
            <div className="rounded-full bg-Brand-50 p-2">
              <Avatar color="blue" radius="xl">
                <Users05Icon />
              </Avatar>
            </div>
            <div className="flex flex-col items-start justify-start text-sm leading-5 ">
              <span>234 active leases</span>
              <span>234 scheduled leases</span>
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-base leading-6">Guaranteed leases</span>
            <span className="text-2xl leading-8 text-Success-700">192</span>
          </div>
        </div>
        <div className="flex flex-col items-center self-stretch border-t border-Gray-200 border-solid">
          <div className="flex justify-end items-center gap-4 py-4 px-6 self-stretch">
            <span className="text-Brand-700 text-sm leading-5 font-semibold cursor-pointer">
              Enroll lease
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};
