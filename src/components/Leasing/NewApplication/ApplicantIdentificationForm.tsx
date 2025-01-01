import {
  AlertErrorIcon,
  BankIcon01,
  DateIcon,
  Edit01Icon,
  SvgDefaultUser01,
  UserIcon06,
  SuccessIcon,
} from '@assets/iconComponents';
import StepButtons from '@components/Leasing/NewApplication/StepButtons';
import { Badge, Button, Checkbox } from '@mantine/core';
import CustomInput from '@utils/CustomInput';
import clsx from 'clsx';
import { useState } from 'react';

interface Props {
  step: number;
  handlers: { increment: () => void; decrement: () => void };
}
const ApplicantIdentificationForm = ({ step, handlers }: Props) => {
  const [terms, setTerms] = useState(false);
  const handleContinue = async () => {
    handlers.increment();
    // await handleSubmit(onSubmit)();
  };
  const handleCancel = () => {
    handlers.decrement();
  };

  return (
    <div>
      <div className="grid gap-6 p-6">
        <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
          Tenant details
        </div>
        <div className="border-solid border border-gray-960  border-[1px] rounded-[12px] p-4  h-30 m-h-30">
          <div className="flex justify-between">
            <div className="flex">
              <div className="items-center self-center me-4">
                <SvgDefaultUser01 className="col-span-1 " />
              </div>
              <div className="self-center">
                <div className="text-base	font-medium	leading-6	text-gray-700  flex items-center ">
                  <span className="text-ellipsis max-w-32 whitespace-nowrap overflow-hidden">
                    Calvin Brown
                  </span>
                  <Badge
                    classNames={{
                      root: 'ms-1 bg-Gray-200 rounded-[6px] border border-gray-300 border-solid  border-[1px] drop-shadow-xs',
                      label:
                        'text-xs font-medium	leading-11 text-gray-700 capitalize  whitespace-nowrap overflow-hidden',
                    }}
                    variant="light"
                    className="h-3.2"
                  >
                    Primary tenant
                  </Badge>
                </div>
                <div className="font-normal	text-base	leading-6	text-gray-600">212-212-1100</div>
                <div className="font-normal	text-base	leading-6 text-gray-600 mt-0.5">
                  calvin@email.com
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-revert items-center border border-solid border-error-300 border-[1px] rounded-[12px] cursor-pointer h-13 font-semibold text-sm p-1.5">
          <AlertErrorIcon className="me-3" /> The SSN you entered is incorrect, please entet the
          valid SSN
        </div>

        <fieldset className="grid-cols-2 grid gap-5 mt-2">
          <CustomInput label="Social security" placeholder="000-00-0000" />
          <CustomInput
            leftSection={<DateIcon className="size-5" />}
            label="Date of birth"
            placeholder="Select day"
            // {...register('date')}
          />
        </fieldset>
        <div className="border-solid border border-gray-960  border-[1px] rounded-[12px] p-4  h-30 m-h-30">
          <div className="flex justify-between">
            <div className="flex">
              <div className="items-center self-center me-4">
                <SvgDefaultUser01 className="col-span-1 " />
              </div>
              <div className="self-center">
                <div className="text-base	font-medium	leading-6	text-gray-700  flex items-center ">
                  <span className="text-ellipsis max-w-32 whitespace-nowrap overflow-hidden">
                    Calvin Brown
                  </span>
                  <Badge
                    classNames={{
                      root: 'ms-1 bg-Gray-200 rounded-[6px] border border-gray-300 border-solid  border-[1px] drop-shadow-xs',
                      label:
                        'text-xs font-medium	leading-11 text-gray-700 capitalize  whitespace-nowrap overflow-hidden',
                    }}
                    variant="light"
                    className="h-3.2"
                  >
                    Co applicant
                  </Badge>
                </div>
                <div className="font-normal	text-base	leading-6	text-gray-600">212-212-1100</div>
                <div className="font-normal	text-base	leading-6 text-gray-600 mt-0.5">
                  calvin@email.com
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-revert items-center border border-solid border-error-300 border-[1px] rounded-[12px] cursor-pointer h-13 font-semibold text-sm p-1.5">
          <AlertErrorIcon className="me-3" /> The SSN you entered is incorrect, please entet the
          valid SSN
        </div>
        <fieldset className="grid-cols-2 grid gap-5 mt-2">
          <CustomInput label="Social security" placeholder="000-00-0000" />
          <CustomInput
            leftSection={<DateIcon className="size-5" />}
            label="Date of birth"
            placeholder="Select day"
            // {...register('date')}
          />
        </fieldset>
        <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
          Payment details
        </div>

        <div className="flex justify-revert items-center border border-solid border-error-300 border-[1px] rounded-[12px] cursor-pointer h-13 font-semibold text-sm p-1.5">
          <AlertErrorIcon className="me-3" /> The payment..
        </div>

        <div className="grid-cols-2 grid gap-5 mt-2">
          <div>
            <div className="flex justify-between">
              <div className="font-medium	text-sm text-gray-700">Paymnet method*</div>
              <div className="font-semibold	text-brand-960 text-sm">Change</div>
            </div>
            <div className="h-23 m-h-23 px-4 py-3 mt-3 border-solid border border-gray-960  border-[1px] rounded-[12px]">
              <div className="flex justify-between mt-2">
                <div className="flex">
                  <BankIcon01 />
                  <div className="ms-3.5">
                    <div className="font-medium	text-sm text-gray-700">Business checking</div>
                    <div className="font-normal	text-sm text-gray-700 mt-2">*****1234</div>
                  </div>
                </div>
                <div className="pe-1 py-1">
                  <Edit01Icon className="text-gray-700 cursor-pointer h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="flex justify-between">
              <div className="font-medium	text-sm text-gray-700">Billing detailes*</div>
              <div className="font-semibold	text-brand-960 text-sm">Change</div>
            </div>
            <div className="h-23 m-h-23 px-4 py-3 mt-3 border-solid border border-gray-960  border-[1px] rounded-[12px]">
              <div className="flex justify-between mt-2">
                <div className="flex justify-between">
                  <UserIcon06 className="size-8" />
                  <div className='ms-3.5'>
                    <div className="font-medium	text-sm text-gray-700">Business checking</div>
                    <div className="font-normal	text-sm text-gray-700 mt-2">123 Main St.</div>
                    <div className="font-normal	text-sm text-gray-700 mt-2">New York NY 11211</div>
                  </div>
                </div>
                <div className="pe-1 py-1">
                  <Edit01Icon className="text-gray-700 cursor-pointer h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
          Final details
        </div>
        <div className="grid-cols-5 grid gap-5">
          <div className="col-span-2">
            <div className="font-semibold	text-brand-960 text-sm">Price brackdown</div>
            <div className="flex justify-between">
              <div className="font-normal	text-gray-600 text-sm mt-4">Primary tenant</div>
              <div className="font-normal	text-gray-600 text-sm mt-4">$20</div>
            </div>

            <div className="flex justify-between">
              <div className="font-normal	text-gray-600 text-sm mt-3">Co-tenant</div>
              <div className="font-normal	text-gray-600 text-sm mt-4">$20</div>
            </div>
            <div className="flex justify-between">
              <div className="font-semibold	text-gray-700 text-sm mt-3">Total</div>
              <div className="font-semibold	text-gray-700 text-sm mt-4">$40</div>
            </div>
          </div>
          <div className="col-span-3 pb-3 border-solid border border-gray-960  border-[1px] px-4 rounded-[12px]">
            <div className="border-gray-960 py-3 mt-3">
              <div className="text-center text-gray-900 font-semibold	text-base	">
                “Quality tenant” screening
              </div>
            </div>
            <div className="font-medium text-sm text-gray-600 mt-6 leading-5">
              We will provide you with a dessicen if applicant is qualified for the{' '}
              <span className="font-bold">“quality tenant assurance program”</span>. You will also
              get a copy of the eviction and criminal records.
            </div>
            <div className="flex mt-4 ps-4">
              <ul className="list-disc">
                <li className="!list-disc text-base font-semibold	">Criminal history</li>
                <li className="!list-disc text-base font-semibold	">Income verification</li>
              </ul>
              <ul className="list-disc ps-8">
                <li className="!list-disc text-base font-semibold	">Credit check</li>
                <li className="!list-disc text-base font-semibold	">Eviction records</li>
              </ul>
            </div>
            <div className="border-success-600 border-[1px] border border-solid rounded-xl p-4 mt-5">
              <div className="grid-cols-5 grid">
                <SuccessIcon />
                <div className="col-span-4 ">
                  <div className="text-sm font-semibold">Guaranteed screening</div>
                  <div className="text-sm	font-normal	mt-1 text-gray-600">
                    Should the applicant be approved, rent can be secured for up to 12 months.
                    (Separate enrollment upon lease signing)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Checkbox
            onClick={() => {
              setTerms(!terms);
            }}
            checked={terms}
            className="mt-1"
            classNames={{
              label: 'text-gray-700 font-medium	text-base	',
              body: 'items-center',
              input: clsx(
                'rounded-[6px] border-error-300 cursor-pointer',
                terms && '!bg-brand-970 !border-brand-970'
              ),
            }}
          />
          <div>
            <div
              onClick={() => {
                setTerms(!terms);
              }}
              className="text-Gray-700 text-base font-medium cursor-pointer"
            >
              I agree to terms and...
            </div>
            <div className="mt-0.5 text-gray-600 text-base font-normal">
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
        skipModal={() => {}}
      />
    </div>
  );
};

export default ApplicantIdentificationForm;
