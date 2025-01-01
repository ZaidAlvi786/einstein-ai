import { ActionIcon, Button } from '@mantine/core';
import { ArrowLeft, ArrowRightIcon } from '@assets/iconComponents';
import { useEffect, useState } from 'react';
import { useCarousel } from '../../hooks';
import PaymentCard from './PaymentCard';

interface IQualityTenantPaymentDetails {
  setShowPayment: (value: boolean) => void;
}

const QualityTenantPaymentDetails: React.FC<IQualityTenantPaymentDetails> = ({
  setShowPayment,
}) => {
  const { handleScroll, setCarousel } = useCarousel();
  const [isBalanceAvailable, setIsBalanceAvailable] = useState<boolean>(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsBalanceAvailable(true);
    }, 2000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="w-full grid grid-cols-12 gap-4">
      <div className="col-span-12 flex justify-between flex-col gap-4">
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold leading-7">Balance</h3>
          <div className="flex gap-1">
            <span
              className={`text-xl font-medium leading-7 mt-1 ${isBalanceAvailable ? 'text-Error-700' : 'text-Gray-900'}`}
            >
              $
            </span>
            <h1
              className={`text-3xl font-semibold leading-10 ${isBalanceAvailable ? 'text-Error-700' : 'text-Gray-900'}`}
            >
              {isBalanceAvailable ? '2,015.20' : '0.00'}
            </h1>
          </div>
        </div>
        <Button
          classNames={{
            section: 'w-5 h-5 m-0',
            root: 'flex gap-1 px-3 py-2 justify-center    rounded-[8px] shadow-xs text-base h-11',
            inner: 'flex gap-1.5 justify-center shadow-xs text-base ',
          }}
          className={`${isBalanceAvailable ? 'bg-Brand-600' : 'bg-Gray-100'} w-[87px] text-sm font-semibold border ${isBalanceAvailable ? 'border-Brand-600' : 'border-Gray-200'}  leading-5`}
          disabled={!isBalanceAvailable}
          onClick={() => setShowPayment(true)}
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
          <div className="flex gap-1.5 items-stretch">
            <ActionIcon.Group>
              <ActionIcon
                variant="outline"
                size={36}
                className="bg-white text-sm text-base font-semibold rounded-lg border-Gray-300 text-Gray-700 hover:text-Gray-600 w-[36px]"
              >
                <ArrowLeft onClick={() => handleScroll('previous')} />
              </ActionIcon>
              <ActionIcon
                variant="outline"
                size={36}
                className="bg-white text-sm text-base font-semibold rounded-lg border-Gray-300 text-Gray-700 hover:text-Gray-600 w-[36px]"
              >
                <ArrowRightIcon stroke="#667085" onClick={() => handleScroll('next')} />
              </ActionIcon>
            </ActionIcon.Group>
          </div>
        </div>
        {isBalanceAvailable ? (
          <div className="bg-Gray-50 border-[1px] border-Gray-200 border-solid rounded-lg p-1">
            <PaymentCard setCarousel={setCarousel} />
          </div>
        ) : (
          <div className="bg-Gray-50 border-[1px] border-Gray-200 border-solid rounded-lg p-3 flex items-center justify-center">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold leading-7">You are all coght up!</h3>
              <p className="text-sm font-normal text-center text-Gray-600 leading-5">
                No properties..
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QualityTenantPaymentDetails;
