import { Button } from '@mantine/core';
import CardInfo from '@shared/components/CardInfo';
import BillingProfileCard from './BillingProfileCard';

const QualityTenantEditPayment = () => {
  const hasBalance = true;
  return (
    <div className="w-full grid grid-cols-12 gap-8">
      <div className="col-span-8 flex flex-col justify-between gap-3">
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold leading-7">Balance</h3>
          <div className="flex gap-1">
            <span
              className={`text-xl font-medium leading-7  ${hasBalance ? 'text-Error-700' : 'text-Gray-900'}`}
            >
              $
            </span>
            <h1
              className={`text-4xl font-semibold leading-10 ${hasBalance ? 'text-Error-700' : 'text-Gray-900'}`}
            >
              {hasBalance ? '18,760.56' : '0.00'}
            </h1>
          </div>
        </div>
        <Button
          classNames={{
            section: 'w-5 h-5 m-0',
            root: 'flex gap-1 px-3 py-2  justify-center    rounded-[8px] shadow-xs text-base h-11',
            inner: 'flex gap-1.5 justify-center shadow-xs text-base ',
          }}
          className={`${hasBalance ? 'bg-Brand-600' : 'bg-Gray-100'} w-[87px] text-sm font-semibold border ${hasBalance ? 'border-Brand-600' : 'border-Gray-200'}  leading-5`}
          disabled={!hasBalance}
        >
          Pay
        </Button>
        <div className="flex  justify-between items-start">
          <div>
            <h3 className="text-sm font-semibold leading-5">Payment methods</h3>
            <p className="text-sm font-normal leading-5 text-Gray-600">
              Update your photo and personal details.
            </p>
          </div>
          <p className="font-semibold text-sm leading-5 text-Brand-700 cursor-pointer">Change</p>
        </div>
        <div className="flex gap-2">
          <CardInfo
            title="Visa ending in 1234"
            subTitle="Expiry 06/2024"
            actionText="Primary"
            deleteIcon={false}
          />
          <CardInfo title="Visa ending in 1234" subTitle="Expiry 06/2024" actionText="Backup" />
        </div>
      </div>
      <div className="col-span-4">
        <BillingProfileCard />
      </div>
    </div>
  );
};

export default QualityTenantEditPayment;
