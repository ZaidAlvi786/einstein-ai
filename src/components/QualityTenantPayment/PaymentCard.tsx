import { QualityPaymentCardData } from '@components/mocks';
import CardCarousel from '@shared/components/CardCarousel';
import React from 'react';
import { Embla } from '@mantine/carousel';

export interface IPaymentCardData {
  name: string;
  address: string;
  price: string;
}

interface IPaymentCardProps {
  PaymentCardData?: IPaymentCardData[];
  setCarousel: (value: Embla | null) => void;
}

const PaymentCard: React.FC<IPaymentCardProps> = ({ setCarousel }) => {
  const paymentCardData = QualityPaymentCardData as IPaymentCardData[];
  return (
    <CardCarousel
      classNames={{
        slide:
          'flex w-fit flex-row px-4 py-4 bg-white rounded-[12px] border-secondary border-solid border-[1px] drop-shadow-sm',
      }}
      items={paymentCardData}
      renderItem={(item) => (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col items-start gap-0.5 ">
            <h3 className="text-sm font-medium leading-5">{item.name}</h3>
            <p className="text-xs font-normal text-center text-Gray-600 leading-4">
              {item.address}
            </p>
          </div>
          <div className="flex justify-between">
            <h3 className="text-sm font-semibold leading-4 text-Error-700">{item.price}</h3>
            <p className="text-xs font-semibold text-center  leading-4 text-Brand-600 cursor-pointer">
              Pay now
            </p>
          </div>
        </div>
      )}
      setMoveCarousel={setCarousel}
    />
  );
};

export default PaymentCard;
