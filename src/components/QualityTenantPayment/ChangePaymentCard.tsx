import { Button, Card } from '@mantine/core';
import QualityTenantPaymentTabs from './QualityTenantPaymentTabs';
import BillingProfileCard from './BillingProfileCard';

const ChangePaymentCard = () => (
  <div className="mt-4">
    <Card
      withBorder
      classNames={{
        root: 'w-full flex flex-row gap-3 bg-white rounded-[12px] border-secondary border-solid border-[1px] shadow-sm',
      }}
    >
      <div className="w-full grid grid-cols-12 gap-4">
        <div className="col-span-12 flex justify-between flex-col gap-4">
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold leading-7">Balance</h3>
            <div className="flex gap-1">
              <span className="text-xl font-medium leading-7 mt-1 text-Error-700">$</span>
              <h1 className="text-3xl font-semibold leading-10 text-Error-700">2,015.20</h1>
            </div>
          </div>
          <Button
            classNames={{
              section: 'w-5 h-5 m-0',
              root: 'flex gap-1 px-3 py-2 justify-center    rounded-[8px] shadow-xs text-base h-11',
              inner: 'flex gap-1.5 justify-center shadow-xs text-base ',
            }}
            className="bg-Brand-600 w-[60px] text-sm font-semibold border border-Brand-600  leading-5"
          >
            Pay
          </Button>
          <div className="flex  justify-between">
            <div>
              <h3 className="text-sm font-semibold leading-5">Properties with balance</h3>
              <p className="text-xs font-normal leading-5 text-Gray-600">
                Update your photo and personal details.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold leading-5 text-Brand-700 cursor-pointer">
                Change
              </p>
            </div>
          </div>
        </div>
      </div>
      <BillingProfileCard />
    </Card>
    <QualityTenantPaymentTabs />
  </div>
);

export default ChangePaymentCard;
