import { Button, Card, Checkbox, Modal, SegmentedControl } from '@mantine/core';
import {
  BankIcon,
  BankIcon01,
  CreditCard02Icon,
  CreditCardUp,
  CreditCardX,
  PaymentIcon,
  PlusIcon,
  SvgEdit02,
  VisaCardIcon,
} from '@assets/iconComponents';
import { ChangeEvent, ReactElement, useState } from 'react';
import { ConfirmationModal } from '@shared/components/ConfirmationModal';
import { initialModalProps } from '@components/mocks';
import { PaymentInterface } from '@interfaces/property.interface';
import { useDisclosure } from '@mantine/hooks';
import bgPattrerens from '@assets/patterns/Background pattern decorative.svg';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { paymentDetailsSchema } from '@components/Properties/PaymentDetails/schemas';
import { CreditCardFields } from '@components/Properties/PaymentDetails/CreditCardFields';
import { BankDetails } from '@components/Properties/PaymentDetails/BankDetails';

interface Props {
  paymentMethodData: PaymentInterface[];
  title: string;
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
export function PaymentMethod({ paymentMethodData, title }: Props) {
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [paymentMethods, setPaymentMethodData] = useState(paymentMethodData);
  const [modalProps, setModalProps] = useState(initialModalProps);
  const [icon, setIcon] = useState<ReactElement | null>(null);
  const[modalHeading,setModalHeading]=useState("")


  const [opened, { open, close }] = useDisclosure(false);
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

  const formatPaymentInfo = (payment: string) => {
    if (!payment) return `*****`;
    const value = payment;
    const lastFour = value.slice(-4);
    return `*****${lastFour}`;
  };
  const updateValue = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    const updatedPaymentMethodData = [...paymentMethodData];
    updatedPaymentMethodData[index].active = event.currentTarget.checked;
    setPaymentMethodData(updatedPaymentMethodData);
  };
  const handleDeleteClick = () => {
    setModalProps({
      title: 'Delete payment method',
      desc: 'Are you sure you want to delete this payment method? This action cannot be undone.',
      bgColor: 'bg-Error-600',
      hoverColor: 'hover:bg-Error-600',
      btnTitle: 'Delete',
      iconBg: 'bg-Error-100',
      borderColor: 'border-Error-50',
    });
    setIcon(<CreditCardX className="shrink-0" />);
    setConfirmationModalOpen(true);
  };
  const handleBackupClick = () => {
    setModalProps({
      title: 'Setting account as backup',
      desc: 'Your payment method ending in 3434 will be set as back up...',
      bgColor: 'bg-Brand-600',
      hoverColor: 'hover:bg-Brand-600',
      btnTitle: 'Confirm',
      iconBg: 'bg-Brand-100',
      borderColor: 'border-Brand-50',
    });
    setIcon(<CreditCardUp className="shrink-0" />);
    setConfirmationModalOpen(true);
  };
  const editDetails = (payment: any, index: any) => {
    setModalHeading("Edit")
    open();
  };
  return (
    <>
      <div className="flex flex-col items-start gap-6 self-stretch">
        <div className="flex items-start gap-5 self-stretch">
          <div className="flex flex-col items-start justify-center gap-1 flex-0 self-stretch">
            <span className="text-Gray-900 text-xl leading-xl-1 font-semibold">{title}</span>
          </div>
        </div>
        <div className="flex items-start gap-6 self-stretch grid grid-cols-2">
          {paymentMethods.map((payment, index) => (
            <Card
              withBorder
              classNames={{
                root: `flex flex-col col-span-1 p-4 items-start self-stretch gap-1 rounded-[12px] border-solid bg-white ${payment.active === true ? 'border-[2px] border-Brand-600' : 'border-[1px] border-Gray-200'}`,
              }}
            >
              <Card.Section
                classNames={{
                  section: 'flex  items-start col-span-1 gap-1 self-stretch p-4',
                }}
              >
                <div className="flex items-start  w-full self-stretch gap-4">
                  {payment.method === 'visa' ? (
                    <VisaCardIcon width={46} height={32} />
                  ) : (
                    <BankIcon01 />
                  )}
                  <div className="flex flex-col gap-3 flex-0 w-full">
                    <div className="flex flex-col items-start gap-0.5 self-stretch">
                      <span className="text-Gray-700 text-base font-medium leading-6">
                        {payment.title}
                      </span>
                      <span className="text-Gray-700 text-base font-medium leading-6">
                        {payment.expiryDate
                          ? payment.expiryDate
                          : formatPaymentInfo(payment?.accountNumber || '')}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      {payment.active === true ? (
                        <div className="flex justify-cneter items-center gap-1.5">
                          <span className="text-Brand-700 text-sm font-semibold leading-5 cursor-pointer"
                         onClick={() => {
                          clearErrors();
                          editDetails(payment, index);
                        }}
                          >
                            Edit
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3">
                          <div className="flex justify-cneter items-center gap-1.5">
                            <span
                              className="text-Brand-700 text-sm font-semibold leading-5 cursor-pointer"
                              onClick={handleBackupClick}
                            >
                              Set as backup
                            </span>
                          </div>
                          <div className="flex justify-cneter items-center gap-1.5">
                            <span className="text-Brand-700 text-sm font-semibold leading-5 cursor-pointer"
                              onClick={() => {
                                clearErrors();
                                editDetails(payment, index);
                              }}
                            >
                              Edit
                            </span>
                          </div>
                          <div className="flex justify-cneter items-center gap-1.5">
                            <span
                              className="text-Brand-700 text-sm font-semibold cursor-pointer leading-5"
                              onClick={handleDeleteClick}
                            >
                              Delete
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Checkbox
                  key={index}
                  checked={payment.active}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => updateValue(event, index)}
                  label=""
                />
              </Card.Section>
            </Card>
          ))}
          <Card
            withBorder
            classNames={{
              root: 'flex !h-sm-2 col-span-1 p-4 justify-center gap-1 flex-col items-start self-stretch rounded-[12px] border-[1px] border-solid border-Gray-200 bg-white',
            }}
          >
            <Card.Section
              classNames={{
                section:
                  'flex flex-col items-center gap-3 justify-center self-stretch flex-0 cursor-pointer',
              }}
              onClick={()=>{
                methods.reset();
                setModalHeading("Add")
                open();
              }}
            >
              <div className="flex justify-center items-center gap-3">
                <span className="text-Brand-700 text-lg font-semibold leading-7">
                  Add payment account
                </span>
                <PlusIcon className='h-6 w-6 text-Brand-700' />
              </div>
            </Card.Section>
          </Card>
        </div>
      </div>

      <Modal
        size={'lg'}
        classNames={{
          title: 'text-brand-960 font-semibold text-lg',
          content: 'rounded-[12px] ',
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
           {modalHeading==="Add"&& <PaymentIcon className="ms-6.8 mt-4 size-9" />}
           {modalHeading==="Edit"&&   <SvgEdit02 className="ms-6.8 mt-4 size-9" />}
          </div>
          <div className="p-5 pt-0">
            <div className="leading-7 font-semibold text-lg	 text-gray-900 mt-4 ">
              {modalHeading} payment method
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
                onClick={close}
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

      <ConfirmationModal
        confirmationModalOpen={confirmationModalOpen}
        setConfirmationModalOpen={setConfirmationModalOpen}
        confirmBtnDetail={modalProps}
        icon={icon}
      />
    </>
  );
}
