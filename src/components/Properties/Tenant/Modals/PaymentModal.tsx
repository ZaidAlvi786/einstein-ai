import { Button, Modal, SegmentedControl } from '@mantine/core';
import {
  BankIcon,
  CreditCard02Icon,
  PaymentIcon,
} from '@assets/iconComponents';
import bgPattrerens from '@assets/patterns/Background pattern decorative.svg';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { paymentDetailsSchema } from '@components/Properties/PaymentDetails/schemas';
import { CreditCardFields } from '@components/Properties/PaymentDetails/CreditCardFields';
import { BankDetails } from '@components/Properties/PaymentDetails/BankDetails';


interface Props {
  openPaymentModal:boolean;
  setOpenPaymentModal:(value: boolean) => void;
}
const initialValues = {
  isCreditCard: true,
  creditCard: {
    name: '',
    date: '',
    cardNumber: '',
    cvv: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
  },
  bankAccount: {
    accountNumber: '',
    routingNumber: '',
    accountType: '',
    nameOnAccount: '',
  },
};
export function PaymentModal({openPaymentModal,setOpenPaymentModal}:Props) {

  const methods = useForm({
    resolver: yupResolver(paymentDetailsSchema),
    defaultValues: initialValues,
  });
  const {
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors, isValid },
  } = methods;
  const isCreditCard = watch(`isCreditCard`);

  return (
    <>
      <Modal
        size={'lg'}
        classNames={{
          title: 'text-brand-960 font-semibold text-lg',
          content: 'rounded-[12px] ',
          header: 'w-24 float-right bg-transparent',
          body: 'p-0',
          close: 'text-gray-400',
        }}
        opened={openPaymentModal}
        onClose={()=>setOpenPaymentModal(false)}
      >
        <div>
          <div className="bg-cover w-full my-3 relative">
            <img src={bgPattrerens.toString()} alt="circle-bg" className="circleImg -z-10" />
           <PaymentIcon className="ms-6.8 mt-4 size-9" />
          </div>
          <div className="p-5 pt-0">
            <div className="leading-7 font-semibold text-lg	 text-gray-900 mt-4 ">
              Add payment method
            </div>
            <div className="text-sm font-normal leading-5	text-gray-600 mt-1 mb-4">
              Share where you’ve worked on your profile.
            </div>
            <SegmentedControl
              className="w-full rounded-[12px] bg-gray-50"
              data={[
                {
                  value: 'Credit card',
                  label: (
                    <div className="flex items-center ">
                      <span
                        className={clsx(
                          'text-sm font-bold leading-5 text-gray-700',
                          !isCreditCard && '!text-gray-500'
                        )}
                      >
                        Credit card
                      </span>
                      <span className="ms-4 border-[1.5px] bg-white border-solid border-gray-300 p-1 block flex items-center rounded-[6px]">
                        <CreditCard02Icon className="size-3" />
                      </span>
                    </div>
                  ),
                },
                {
                  value: 'Bank account',
                  label: (
                    <div className="flex items-center">
                      <span
                        className={clsx(
                          'text-sm font-bold leading-5 text-gray-700',
                          isCreditCard && '!text-gray-500'
                        )}
                      >
                        Bank account
                      </span>
                      <span className="ms-4 border-[1.5px] bg-white border-solid border-gray-300 p-1 block flex items-center rounded-[6px]">
                        <BankIcon  />
                      </span>
                    </div>
                  ),
                },
              ]}
              value={isCreditCard ? 'Credit card' : 'Bank account'}
              onChange={(value) => {
                setValue(`isCreditCard`, value === 'Credit card');
              }}
              classNames={{
                label: 'h-9 flex justify-center items-center text-sm font-bold ',
                indicator: 'rounded-[8px]',
              }}
            />
            {isCreditCard && <CreditCardFields methods={methods} />}
            {!isCreditCard && <BankDetails methods={methods} />}
            <div className="grid-cols-2 grid gap-5 mt-10">
              <Button
                variant="outline"
                onClick={()=>setOpenPaymentModal(false)}
                className="border-gray-300 font-semibold text-base h-11 text-gray-700 rounded-[8px]"
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                className="rounded-[8px] h-11 hover:bg-brand-970 hover:text-white bg-brand-960 text-base text-white font-semibold ms-3"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </Modal>

   
    </>
  );
}
