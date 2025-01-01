import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { StepButtons } from '../StepButtons';
import { CrossedTitle } from '@components/CrossedTitle';
import {
  PlusIcon,
  CreditCard02Icon,
  BankIcon,
  Users04Icon,
  PaymentIcon,
  VisaIcon,
  BankPayment
} from '@assets/iconComponents';
import { useDisclosure } from '@mantine/hooks';
import { Button, Checkbox, Group, Modal, SegmentedControl } from '@mantine/core';
import { paymentDetailsSchema } from './schemas';
import { CreditCardFields } from './CreditCardFields';
import { BankDetails } from './BankDetails';
import { useState } from 'react';
import { CustomTittle } from '@components/CustomTitte';
import clsx from 'clsx';
import bgPattrerens from '@assets/patterns/Background pattern decorative.svg';
import { useDispatch } from 'react-redux';
import { APP_PATHS } from '@routes/app-paths';
import { clearData } from '@stores/propertySlice';
import { useNavigate } from 'react-router-dom';


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

interface Props {
  step: number;
  handlers: {
    increment: () => void;
    decrement: () => void;
  };
}

export function PaymentDetails({ step, handlers }: Props) {
  const [checked, setChecked] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const methods = useForm({
    resolver: yupResolver(paymentDetailsSchema),
    defaultValues: initialValues,
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = methods;

  const onSubmit = (data: any) => {
    navigate(APP_PATHS.properties.get());
    dispatch(clearData())
  };

  const handleContinue = async () => {
    // await handleSubmit(onSubmit)();
    dispatch(clearData())
    navigate(APP_PATHS.properties.get());

  };

  const handleExit = () => {
    // handleSubmit(onSubmit)();
    dispatch(clearData())
    navigate(APP_PATHS.properties.get());
  };
  const isCreditCard = watch(`isCreditCard`);

  return (
    <>
      <div className="flex flex-col">
        <div className="p-6">
          <CustomTittle heading="Payment details" />
          <div className="leading-7 rounded-lg font-semibold text-lg	 my-5 flex items-center justify-center text-center text-gray-900 bg-gray-50 p-2 ">
            Payment Account
          </div>
          <div className="grid grid-cols-2 gap-5 my-6">
            <div
              onClick={() => setValue(`isCreditCard`, !isCreditCard)}
              className={clsx(
                'h-30 border border-solid border-gray-960 rounded-lg p-4 cursor-pointer',
                isCreditCard && '!border-brand-970 border-2'
              )}
            >
              <div className='flex justify-between'>

              <div className="flex ">
              <VisaIcon className='w-10	h-8  me-4' />
                <div className="">
                  <div className="text-gray-700 leading-6 font-medium text-base mb-0.5">Visa ending in 1234</div>
                  <div className="text-gray-600 leading-6 font-normal	text-base">Expiry 06/2024</div>
                  <div className=' mt-3 text-brand-960 text-sm leading-5 font-semibold'><div>Edit</div></div>
                </div>
              </div>
              <div className="">
                <Checkbox
                  checked={isCreditCard}
                  classNames={{
                    label: 'text-gray-700 font-medium	text-base	',
                    body: 'items-center',
                    input: clsx('!rounded-md', isCreditCard && '!bg-brand-970 !border-brand-970'),
                  }}
                />
              </div>
              </div>
              
            </div>
            <div
              onClick={() => setValue(`isCreditCard`, !isCreditCard)}
              className={clsx(
                'h-30  border border-solid border-gray-960 rounded-lg p-4 cursor-pointer',
                !isCreditCard && '!border-brand-970 border-2'
              )}
            >
              <div className='flex justify-between'>
              <div className="flex">
                <BankPayment className='w-10	h-6 mt-1 me-4' />
                <div className="">
                  <div className="text-gray-700 leading-6 font-medium text-base mb-0.5	">Business checking</div>
                  <div className="text-gray-600 leading-6 font-normal	text-base">*****1234</div>
                  <div className='mt-3  text-sm leading-5 font-semibold'>
                    <span className='me-3 text-brand-960'>Set as backup</span>
                    <span className='me-3 text-gray-600 '>Edit</span>
                    <span className='me-3 text-gray-600 '>Delete</span>

                  </div>
                </div>
              </div>
              <div className="">
                <Checkbox
                  checked={!isCreditCard}
                  classNames={{
                    label: 'text-gray-700 font-medium	text-base	',
                    body: 'items-center',
                    input: clsx('!rounded-md', !isCreditCard && '!bg-brand-970 !border-brand-970'),
                  }}
                />
              </div>
              
              </div>
            </div>
          </div>
          <div className="grid-cols-2 grid gap-5">
            <div
              onClick={open}
              className="border-solid border border-gray-960 rounded-xl h-30 flex items-center justify-center cursor-pointer"
            >
              <div className="flex items-center justify-center text-brand-960 font-semibold text-lg leading-7">
                Add payment account <PlusIcon className="ms-3" />
              </div>
            </div>
          </div>
          <div className="leading-7 rounded-lg font-semibold text-lg	 my-3 flex items-center justify-center text-center text-gray-900 bg-gray-50 p-2 mt-4">
            Receivable Account
          </div>
          <div className="grid-cols-2 grid gap-5">
            <div
              onClick={open}
              className="border-solid border border-gray-960 rounded-xl h-30 flex items-center justify-center cursor-pointer"
            >
              <div className="flex items-center justify-center text-brand-960 font-semibold text-lg leading-7">
                Add receivable account <PlusIcon className="ms-3" />
              </div>
            </div>
          </div>

          <Modal
            size={'lg'}
            classNames={{
              title: 'text-brand-960 font-semibold text-lg',
              content: 'rounded-xl ',
              header: 'w-24 float-right bg-transparent',
              body: 'p-0',
              close: 'text-gray-400',
            }}
            opened={opened}
            onClose={close}
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
                  className="w-full rounded-xl bg-gray-50"
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
                          <span className="ms-4 border-1.5 bg-white border-solid border-gray-300 p-1 block flex items-center rounded-md">
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
                          <span className="ms-4 border-1.5 bg-white border-solid border-gray-300 p-1 block flex items-center rounded-md">
                            <BankIcon className="size-3" />
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
                    indicator: 'rounded-lg',
                  }}
                />
                {isCreditCard && <CreditCardFields methods={methods} />}
                {!isCreditCard && <BankDetails methods={methods} />}
                <div className="grid-cols-2 grid gap-5 mt-10">
                  <Button
                    variant="outline"
                    onClick={close}
                    className="border-gray-300 font-semibold text-base h-11 text-gray-700 rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-lg h-11 hover:bg-brand-970 hover:text-white bg-brand-960 text-base text-white font-semibold ms-3"
                    onClick={handleContinue}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        </div>
        <StepButtons
          step={step}
          handlers={handlers}
          onContinue={handleContinue}
          onExit={handleExit}
        />
      </div>
    </>
  );
}
