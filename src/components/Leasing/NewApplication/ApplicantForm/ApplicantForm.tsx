import {
  ArrowDown,
  DateIcon,
  Delete01,
  Edit01Icon,
  EmailIcon02,
  PlusIcon,
  SvgDefaultUser01,
  Users01Icon,
} from '@assets/iconComponents';
import { Badge, Button, Checkbox, Select } from '@mantine/core';
import clsx from 'clsx';
import React, { useRef, useState } from 'react';
import CoApplicantInputs from './CoApplicantInputs';
import CustomInput from '@utils/CustomInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { apllicantSchema, ApplicantForm } from '../schema';
import { useForm } from 'react-hook-form';
import StepButtons from '@components/Leasing/NewApplication/StepButtons';
import { input } from '@material-tailwind/react';
const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  rent: '',
  date: '',
};
interface Props {
  step: number;
  handlers: { increment: () => void; decrement: () => void };
}
const AddTenantForm = ({ step, handlers }: Props) => {
  const [qualityTenant, setQualityTenant] = useState(false);
  const [securityDeposit, setSecurityDeposit] = useState(false);
  const [applyFee, setApplyFee] = useState(false);
  const [coteanantForm, setCoteanantForm] = useState(false);
  const [showCotenatFields, setshowcotenentfields] = useState(false);
  const [firstInput, setFirstInput] = useState(0);
  const [secondInput, setSecondInput] = useState(0);
  const [thirdInput, setThirdInput] = useState(0);
  const [applicantList, setApplicantList] = useState<ApplicantForm[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showFields, setshowfields] = useState(true);
  const handleFirstInputChange = (value: any) => {
    setFirstInput(value);
    setSecondInput(value * 0.5);
    setThirdInput(value * 0.75);
  };
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    ...form
  } = useForm({
    resolver: yupResolver(apllicantSchema),
    defaultValues: initialValues,
  });
  const handleContinue = async () => {
    // handlers.increment();
    await handleSubmit(onSubmit)();
  };
  const onSubmitForm = (values: ApplicantForm) => {
    setshowfields(false);
    if (editIndex !== null) {
      const updatedList = [...applicantList];
      updatedList[editIndex] = values;
      setApplicantList(updatedList);
      setEditIndex(null);
    } else {
      setApplicantList([...applicantList, values]);
    }
    reset();
  };
  const handleEdit = (index: number) => {
    const tenant = applicantList[index];
    setEditIndex(index);
    setshowfields(true);
    reset(tenant);
  };

  const onSubmit = async (data: any) => {
    const isValid = await form.trigger();
    if (!isValid) {
      return;
    }
    handlers.increment();
  };
  const handleCancel = () => {
    handlers.decrement();
  };

  return (
    <div>
      <div className=" grid gap-6 p-6">
        <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
          Unit details
        </div>
        <fieldset className="grid-cols-2 grid gap-5 mt-2">
          <Select
            classNames={{
              option: 'mb-0.5 rounded-[8px]',
              dropdown: 'rounded-[8px] drop-shadow-lg shadow-lg',
            }}
            label="Property"
            placeholder="Select"
            checkIconPosition="right"
            comboboxProps={{ dropdownPadding: 0 }}
            value={'Withstone apartments'}
            rightSection={<ArrowDown />}
            // disabled={true}
            data={['Withstone apartments', 'Withstone apartments2', 'Withstone apartments3']}
          />
          <Select
            classNames={{
              option: 'mb-0.5 rounded-[8px]',
              dropdown: 'rounded-[8px] drop-shadow-lg shadow-lg',
            }}
            label="Unit"
            placeholder="Select"
            checkIconPosition="right"
            comboboxProps={{ dropdownPadding: 0 }}
            rightSection={<ArrowDown />}
            data={['Unit 101', 'Unit 102', 'Unit 103']}
            value={'Unit 101'}
            // disabled={true}
          />
          <CustomInput
            label="Monthly rent*"
            placeholder="$000"
            {...register('rent')}
            error={errors.rent?.message}
          />
          <CustomInput
            leftSection={<DateIcon className="size-5" />}
            label="Desired move-in date"
            placeholder="Select date"
            {...register('date')}
          />
        </fieldset>
        <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
          Tenant details
        </div>
        {applicantList?.length > 0 &&
          applicantList.map((tenant, index) => (
            <div
              className="border-solid border border-gray-960  border-[1px] rounded-[12px] p-4  h-30 m-h-30"
              key={index}
            >
              <div className="flex justify-between">
                <div className="flex">
                  <div className="items-center self-center me-4">
                    <SvgDefaultUser01 className="col-span-1 " />
                  </div>
                  <div className="self-center">
                    <div className="text-base	font-medium	leading-6	text-gray-700  flex items-center ">
                      <span className="text-ellipsis max-w-32 whitespace-nowrap overflow-hidden">
                        {tenant?.firstName} {tenant.lastName}
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
                    <div className="font-normal	text-base	leading-6	text-gray-600">
                      {' '}
                      {tenant.phoneNumber}
                    </div>
                    <div className="font-normal	text-base	leading-6 text-gray-600 mt-0.5">
                      {tenant.email}
                    </div>
                  </div>
                </div>
                <div className="pe-1 py-1">
                  <Edit01Icon
                    className="text-gray-700 cursor-pointer h-5 w-5"
                    onClick={() => handleEdit(index)}
                  />
                  <Delete01
                    onClick={() => {
                      setApplicantList([]);
                      setshowfields(true);
                    }}
                    className="text-gray-700 cursor-pointer ms-2 size-5"
                  />
                </div>
              </div>
            </div>
          ))}
        {showFields && (
          <div className={clsx('grid gap-5 ')}>
            <fieldset className="grid-cols-2 grid gap-5 ">
              <CustomInput
                label="First name*"
                placeholder="Enter first name"
                {...register('firstName')}
                error={errors.firstName?.message}
                onBlur={() => form.trigger('firstName')}
              />
              <CustomInput
                label="Last name* "
                placeholder="Enter last name"
                {...register('lastName')}
                error={errors.lastName?.message}
                onBlur={() => form.trigger('lastName')}
              />
              <CustomInput
                leftSection={<EmailIcon02 className="size-5" />}
                label="Email address"
                placeholder="Enter email address"
                {...register('email')}
                error={errors.email?.message}
                onBlur={() => form.trigger('email')}
              />
              <CustomInput
                label="Phone number"
                placeholder="Enter phone number"
                {...register('phoneNumber')}
                error={errors.phoneNumber?.message}
                onBlur={() => form.trigger('phoneNumber')}
              />
            </fieldset>
            <div className="flex justify-end ">
              <Button
                variant="subtle"
                className="text-Brand-700"
                onClick={handleSubmit(onSubmitForm)}
              >
                Add
              </Button>
            </div>
          </div>
        )}

        <CoApplicantInputs
          coteanantForm={coteanantForm}
          setCoteanantForm={setCoteanantForm}
          showCotenatFields={showCotenatFields}
          setshowcotenentfields={setshowcotenentfields}
        />
        <div
          className="bg-white border-solid border border-[#D0D5DD]  border-[1px] shadow-xs rounded-[8px] flex items-center justify-center cursor-pointer m-h-17 h-17"
          onClick={() => {
            setCoteanantForm(true);
            setshowcotenentfields(true);
          }}
        >
          <div className="flex items-center justify-center text-brand-960 font-semibold text-lg">
            <Users01Icon className="me-3" /> Add co-appilcant/occupants{' '}
            <PlusIcon className="ms-3" />
          </div>
        </div>

        <div className="grid-cols-1 grid gap-5 ">
          <div
            className={clsx(
              'border border-solid border-gray-960 border-[2px] rounded-[12px] p-4 cursor-pointer',
              (qualityTenant || applyFee || securityDeposit) && '!border-brand-970 border-2'
            )}
          >
            <div
              className="flex gap-3"
              onClick={() => {
                setQualityTenant(!qualityTenant);
              }}
            >
              <Checkbox
                checked={qualityTenant}
                className="mt-1"
                classNames={{
                  label: 'text-gray-700 font-medium	text-base	',
                  body: 'items-center',
                  input: clsx('rounded-[6px]', qualityTenant && '!bg-brand-970 !border-brand-970'),
                }}
              />
              <div>
                <div className="text-Gray-700 text-base font-medium">
                  Quality Tenant Guarantee
                  <span className="font-medium text-sm leading-5 ms-2 text-gray-600">
                    %4 of monthly rent/month
                  </span>
                </div>
                <div className="mt-0.5 text-gray-600 text-base font-normal">
                  12 months rent guaranteed (up to $100,000), rent payment reporting, eviction
                  filing fees, eviction legal fees (up to $1,000), leasing assistance (up to half
                  months rent).
                </div>
              </div>
            </div>

            <div
              className="flex mt-3 gap-3"
              onClick={() => {
                setApplyFee(!applyFee);
              }}
            >
              <Checkbox
                checked={applyFee}
                className="mt-1"
                classNames={{
                  label: 'text-gray-700 font-medium	text-base	',
                  body: 'items-center',
                  input: clsx('rounded-[6px]', applyFee && '!bg-brand-970 !border-brand-970'),
                }}
              />
              <div>
                <div className="text-Gray-700 text-base font-medium">
                  Security deposit waiver add on
                  <span className="font-medium text-sm leading-5 ms-2 text-gray-600">
                    %1 of monthly rent/month
                  </span>
                </div>
                <div className="mt-0.5 text-gray-600 text-base font-normal">
                  Waive the security deposit requirement from tenant, in case of tenant damage we
                  will cover up to 1 months rent.
                </div>
              </div>
            </div>

            <div className="flex mt-3 gap-3">
              <Checkbox
                checked={securityDeposit}
                className="mt-1"
                classNames={{
                  label: 'text-gray-700 font-medium	text-base	',
                  body: 'items-center',
                  input: clsx(
                    'rounded-[6px] cursor-pointer',
                    securityDeposit && '!bg-brand-970 !border-brand-970'
                  ),
                }}
                onClick={() => {
                  setSecurityDeposit(!securityDeposit);
                }}
              />
              <div className="text-Gray-700 text-base font-medium">
                Apply fee to tenant
                <CustomInput
                  leftSection={
                    <CustomInput
                    type='number'
                    max={99}
                      classNames={{
                        input: 'p-0 !rounded-none !text-center !border-y-0	m-1 !border-l-0 !h-10',
                      }}
                      placeholder="0 "
                      className=""
                    />
                  }
                  classNames={{
                    input: '!ps-10 !bg-gray-50',
                  }}
                  placeholder="% of monthly rent"
                  className="mt-2"
                />
              </div>
              <div className="text-Gray-700 text-base font-medium">
                Your fee
                <CustomInput
                  classNames={{
                    input: '!bg-gray-50',
                  }}
                  placeholder="% of monthly rent"
                  className="mt-2"
                />
              </div>
              <div className="text-Gray-700 text-base font-medium">
                Total monthly rent
                <CustomInput
                  classNames={{
                    input: '!bg-gray-50',
                  }}
                  placeholder="$000"
                  className="mt-2"
                />
              </div>
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

export default AddTenantForm;
