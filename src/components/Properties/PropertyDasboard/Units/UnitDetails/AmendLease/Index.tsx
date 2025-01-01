import {
  AlertCircleIcon,
  Building04Icon,
  XCloseIcon,
} from '@assets/iconComponents';
import { Alert, Button, Modal, Tabs } from '@mantine/core';
import { useCounter } from '@mantine/hooks';
import { useState } from 'react';
import { LeaseDetails } from './LeaseDetails';
import { TenantDetails } from './TenantDetails';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { leaseDetailInitialValue, leaseDetailSchema, tenatDetailSchema, tenentInitailValue } from './schema';

interface Props {
  ammendLeaseModalOpen: boolean;
  setAmmendLeaseModalOpen: (item: boolean) => void;
  type: string;
}

export function AmendLeaseModal({ ammendLeaseModalOpen, setAmmendLeaseModalOpen, type }: Props) {
  const [step, handlers] = useCounter(0, { min: 0, max: 1 });
  const [unitTab, setUnitTab] = useState<string>('tenants');
  const [activeButton, setActiveButton] = useState('lease');
  const getSchemaForStep = (step: number) => {
    switch (activeButton) {
      case 'lease':
        return { schema: leaseDetailSchema, initialValues: leaseDetailInitialValue };
      case 'tenant':
      return {schema:tenatDetailSchema, initialValues: tenentInitailValue};
      default: 
        return { schema: leaseDetailSchema, initialValues: leaseDetailInitialValue };
    }
  };
  const Form = getSchemaForStep(step);
  const methods = useForm({
    resolver: yupResolver<any>(Form?.schema),
    defaultValues: Form?.initialValues,
  });
  const icon = (
    <span className=" flex items-center justify-center outline-2 outline rounded-[24px] outline-[#d92d201a] outline-offset-4">
      <AlertCircleIcon
        width={20}
        height={20}
        opacity={100}
        className="outline-2 outline rounded-[24px] outline-[#d92d204d] outline-offset-1"
      />
    </span>
  );
  const label = (
    <div className="flex flex-col ga-1 items-start self-stretch">
      <span className="text-Gray-700 text-sm font-semibold leading-5">
        This lease is under the QTG
      </span>
      <span className="text-Gray-600 text-sm font-normal leading-5">
        Per our agrremnt a lease can’t be early terminated unless landlord has a new tenat to put in
        place.
      </span>
    </div>
  );
  

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
    setValue,
    clearErrors,
    reset,
    ...form
  } = methods;
  return (
    <Modal.Root
      size="lg"
      classNames={{
        content: 'rounded-xl',
        close: 'text-gray-400',
      }}
      opened={ammendLeaseModalOpen}
      onClose={() => setAmmendLeaseModalOpen(false)}
    >
      <Modal.Overlay />
      {/* <Modal.Overlay /> */}
      <Modal.Content>
        <Modal.Header className="bg-[url(/src/assets/patterns/circle.svg)] bg-no-repeat bg-left-top p-0">
          <div className="flex px-6 pt-6 flex-col items-start gap-4 self-stretch">
            <span className="flex h-12 w-12 items-center justify-center rounded-[28px] border-[8px] border-solid border-Brand-50 bg-Brand-100">
              <span className="h-full flex w-full p-2 ustify-center items-center flex-0">
                <Building04Icon />
              </span>
            </span>
            <div className="flex flex-col items-start gap-1 self-stretch">
              <span className="text-Gray-900 text-lg font-semibold leading-7">Ammend lease</span>
              <span className="text-Gray-600 text-sm font-regular leading-5">
                {step === 0
                  ? 'Share where you’ve worked on your profile.'
                  : 'This will mover out all tenants and imitedly terminate the lease.'}
              </span>
            </div>
          </div>
          <div className="flex h-11 w-11 p-2 justify-center items-center absolute right-4 top-4 rounded-[8px]">
            <XCloseIcon
              height={24}
              width={24}
              stroke="#98A2B3"
              onClick={() => {
                setAmmendLeaseModalOpen(false), handlers.set(0);
              }}
              className="cursor-pointer"
            />
          </div>
        </Modal.Header>
        <Modal.Body
          classNames={{
            body: 'flex flex-col items-start gap-4 pt-5 self-stretch px-6 !pb-0',
          }}
        >
          {type === 'QTG Qualified' && (
            <Alert
              classNames={{
                root: 'flex p-4 items-start gap-4 self-stretch rounded-[12px] border-[1px] border-solid border-Error-300 bg-white drop-shadow-xs',
              }}
              variant="light"
              title={label}
              icon={icon}
            ></Alert>
          )}

          <div className="flex flex-col items-start  gap-4 self-stretch w-full">
            <Button.Group
              classNames={{
                group:
                  'flex items-center justify-center self-stretch p-1 gap-1 rounded-[10px] border-[1px] border-solid bg-Gray-50 w-full border-Gray-200 w-full drop-shadow-xs',
              }}
            >
              <Button
                className="flex py-2 h-full pl-3.4 pr-4 justify-center items-center gap-2 flex-0 border-0  !border-x-0 rounded-[6px]"
                classNames={{
                  label: `text-sm font-semibold leading-5 ${activeButton === 'lease' ? 'text-Gray-700' : 'text-Gray-500'}`,
                  section: 'flex py-0.5 px-1.5 items-center !border-0 text-Gray-700',
                  root: `h-9 flex justify-center py-2 px-3 items-center  ${activeButton === 'lease' ? 'flex justify-center py-2 px-3 items-center gap-2 flex-0 !rounded-[6px] bg-white shadow-sm' : 'bg-Gray-50 !border-0'}`,
                }}
                variant="outline"
                onClick={() => {
                  setActiveButton('lease');
                }}
              >
                Lease details
              </Button>
              <Button
                className="flex py-2 h-full pl-3.4 pr-4 justify-center items-center gap-2 flex-0 border-0   !border-x-0 rounded-[6px]"
                classNames={{
                  label: `text-sm font-semibold leading-5 ${activeButton === 'tenant' ? 'text-Gray-700' : 'text-Gray-500'}`,
                  section: 'flex py-0.5 px-1.5 items-center !border-0 text-Gray-700',
                  root: `h-9 flex justify-center py-2 px-3 items-center  ${activeButton === 'tenant' ? 'flex justify-center py-2 px-3 items-center gap-2 flex-0 !rounded-[6px] bg-white shadow-sm' : ' bg-Gray-50 !border-0'}`,
                }}
                variant="outline"
                onClick={() => {
                  setActiveButton('tenant');
                }}
              >
                Tenant details
              </Button>
            </Button.Group>
          </div>
          {activeButton === 'lease' ? <LeaseDetails methods={methods} /> : <TenantDetails />}
          <div className="flex pt-0 pt-4 pb-6 items-start gap-3 self-stretch">
            <Button
              size="md"
              variant="outline"
              className="bg-white w-1/2 border-gray-300 text-gray-700 text-base font-semibold rounded-lg"
              classNames={{ label: 'text-gray-700' }}
            >
              Cancel
            </Button>
            <Button
              size="md"
              className="bg-Brand-600 w-1/2 hover:bg-Brand-600 text-base font-semibold rounded-lg"
            >
              Confirm
            </Button>
          </div>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
