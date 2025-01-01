import { Card } from '@mantine/core';
import CardInfo from '@shared/components/CardInfo';

const BillingProfileCard = () => (
  <Card
    withBorder
    classNames={{
      root: ' flex w-full flex-col gap-5  bg-white rounded-[12px] border-secondary border-solid border-[1px] shadow-sm',
    }}
  >
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2 justify-between">
        <h3 className="text-sm font-semibold leading-5 text-Gray-700">Billing profile</h3>
        <p className="text-sm font-semibold  text-Brand-700 leading-5 cursor-pointer">Change</p>
      </div>
      <CardInfo
        hasStatus
        hasSubTitle
        subTitle="Calvin Brown"
        deleteIcon={false}
        nestChildren={
          <div>
            <p className="text-sm font-normal  text-Gray-600 leading-5">212-212-1100</p>
            <p className="text-sm font-normal  text-Gray-600 leading-5">calvin@email.com </p>
          </div>
        }
      />
    </div>
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2 justify-between">
        <h3 className="text-sm font-semibold leading-5 text-Gray-700">Receivable account</h3>
        <p className="text-sm font-semibold  text-Brand-700 leading-5 cursor-pointer">Change</p>
      </div>
      <CardInfo
        title="Visa ending in 1234"
        subTitle="Expiry 06/2024"
        actionText="Edit"
        deleteIcon={false}
      />
    </div>
  </Card>
);

export default BillingProfileCard;
