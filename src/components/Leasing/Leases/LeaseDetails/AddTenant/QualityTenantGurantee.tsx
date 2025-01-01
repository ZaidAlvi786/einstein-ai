import React, { useState } from 'react';
import StepButtons from './StepButtons';
import { Checkbox } from '@mantine/core';
import clsx from 'clsx';
import { PlusIcon, ShieldTickIcon } from '@assets/iconComponents';
import { TenantGuaranteeFeatures } from '@constants/app.constant';
import { PaymentModal } from '@components/Properties/Tenant/Modals/PaymentModal';
import GuranteedLease from './Modals/GuranteedLease';

interface Props {
  step: number;
  handlers: {
    increment: () => void;
    decrement: () => void;
  };
}
const QualityTenantGurantee = ({ step, handlers }: Props) => {
  const [tenantCheck, setTenantCheck] = useState(true);
  const [securityCheck, setSecurityCheck] = useState(false);
  const [twelveMonth, setTweleveMonth] = useState(true);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const[openGuranteeLease,setOpenGuranteeLease]=useState(false)

  const handleContinue = async () => {
   
    setOpenGuranteeLease(true)
  };

  const onSubmit = async (data: any) => {
    handlers.increment();
    console.log(data, 'data step3');
  };

  const handleCancel = () => {
    handlers.decrement();
  };
  return (
    <>
      <div className=" grid gap-6 p-6">
        <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
          Quality Tenant Guarantee
        </div>
        <div className="flex gap-3 ">
          <Checkbox
            checked={tenantCheck}
            onClick={() => setTenantCheck(!tenantCheck)}
            classNames={{
              label: 'text-gray-700 font-medium	text-base	',
              body: 'items-center',
              input: clsx('!rounded-[6px]', tenantCheck && '!bg-brand-970 !border-brand-970'),
            }}
            className="mt-1"
          />
          <div>
            <div className="text-Gray-700 text-base font-medium">
              Quality tenant guarantee
              <span className="mt-0.5 text-Gray-600 text-base font-normal">
                {' '}
                %4 of monthly rent/month
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 ">
          <Checkbox
            checked={securityCheck}
            onClick={() => setSecurityCheck(!securityCheck)}
            classNames={{
              label: 'text-gray-700 font-medium	text-base	',
              body: 'items-center',
              input: clsx('!rounded-[6px]', securityCheck && '!bg-brand-970 !border-brand-970'),
            }}
            className="mt-1"
          />
          <div>
            <div className="text-Gray-700 text-base font-medium">
              Security deposit waiver add on
              <span className="mt-0.5 text-Gray-600 text-base font-normal">
                {' '}
                %1 of monthly rent/month
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className=" py-10 m-auto">
            <div className="text-sm leading-5 font-semibold text-Gray-700">Price brackdown</div>
            <div className="mt-3 mb-4">
              <div className="flex justify-between text-sm leading-5 font-medium text-Gray-700 mb-1">
                <div>One time application fee</div> <div>$0</div>
              </div>
              <div className="flex justify-between text-sm leading-5 font-medium text-Gray-700">
                <div>Monthly program fee</div> <div>$40</div>
              </div>
            </div>
            <div className="mb-4 text-xs leading-18  text-Gray-700 font-normal ">
              You will be billed a monthly fee of $40 for the QTG prgram. First payment will be on
              <span className="font-bold"> 07/01/2024</span> and contuinue for a
              <span className="font-bold"> 12 months perioud.</span> After that it will auto renew
              on a anual bases unless canclled.
            </div>
            <div className="flex justify-between text-sm leading-5 font-semibold text-Gray-700">
              <div>Total due today</div> <div>$0</div>
            </div>
          </div>
          <div className="flex flex-1 flex-col p-6 gap-4 rounded-[6px] border-[1px] border-solid border-Success-600 h-full w-full">
            <div className="flex flex-col gap-4 justify-center items-center">
              <div className="flex flex-row items-center p-[2px_6px_2px_4px] text-xs gap-1 text-Success-700 bg-Success-50 border border-solid border-[#ABEFC6] rounded-[6px]">
                <ShieldTickIcon width={12} height={12} stroke="#079455" />
                Quality Tenant Guarantee
              </div>
            </div>
            <div className="flex gap-5 text-Gray-700 flex-col">
              <div className="flex gap-4 flex-col flex-1 ">
                <ul className="list-disc font-semibold text-xs leading-18 ">
                  {TenantGuaranteeFeatures.map((feature, index) => (
                    <li key={index} className="list-disc">
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="text-xs leading-18  text-Gray-700 font-normal">
                  QTG will go in affect for this tenant on{' '}
                  <span className="font-bold">07/01/2024</span> and contuinue for a{' '}
                  <span className="font-bold">12 months perioud.</span> After that it will auto
                  renew on a anual bases unless canclled.
                </div>
                <div className="flex text-xs leading-5 font-medium justify-center cursor-pointer">
                  See full details
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
          Payment account
        </div>
        <div className="text-sm font-normal text-Gray-600 text-center w-3/4  mx-auto px-6 leading-5">
          Asign account from where the monthly fee should be collected. Payment will be charged on
          the 1th of each month.
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div
            className="bg-white border-solid border border-Gray-200  border-[1px] shadow-xs rounded-[12px] flex items-center justify-center cursor-pointer m-h-24 h-24"
            onClick={() => {
              setOpenPaymentModal(true);
            }}
          >
            <div className="flex items-center justify-center text-brand-960 font-semibold text-base">
              Add payment method <PlusIcon className="ms-3" />
            </div>
          </div>
          <div
            className="bg-white border-solid border border-Gray-200  border-[1px] shadow-xs rounded-[12px] flex items-center justify-center cursor-pointer m-h-24 h-24"
          >
            <div className="flex items-center justify-center text-brand-960 font-semibold text-base">
              Add billing detailes <PlusIcon className="ms-3" />
            </div>
          </div>
        </div>
        <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
          Recevable account
        </div>
        <div className="text-sm font-normal text-Gray-600 text-center w-3/4  mx-auto px-6 leading-5">
          Asign account where to recive payment in case of a claim
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div
            className="bg-white border-solid border border-Gray-200  border-[1px] shadow-xs rounded-[12px] flex items-center justify-center cursor-pointer m-h-24 h-24"
            onClick={() => {
              setOpenPaymentModal(true);
            }}
          >
            <div className="flex items-center justify-center text-brand-960 font-semibold text-base">
              Add payout account <PlusIcon className="ms-3" />
            </div>
          </div>
        </div>
        <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
          Sign agreement
        </div>
        <div className="flex  gap-3">
          <Checkbox
            checked={twelveMonth}
            onClick={() => setTweleveMonth(!twelveMonth)}
            classNames={{
              label: 'text-gray-700 font-medium	text-base	',
              body: 'items-center',
              input: clsx('!rounded-[6px]', twelveMonth && '!bg-brand-970 !border-brand-970'),
            }}
            className="mt-1"
          />
          <div>
            <div className="text-Gray-700 text-base font-medium">I agree to terms and...</div>
            <div className="mt-0.5 text-Gray-600 text-base font-normal">
              Save my login details for next time.
            </div>
          </div>
        </div>
      </div>
      <StepButtons
        step={step}
        handlers={handlers}
        handleContinue={handleContinue}
        handleCancel={handleCancel}
      />
      <PaymentModal openPaymentModal={openPaymentModal} setOpenPaymentModal={setOpenPaymentModal} />
      <GuranteedLease openGuranteeLease={openGuranteeLease} setOpenGuranteeLease={setOpenGuranteeLease}/>
    </>
  );
};

export default QualityTenantGurantee;
