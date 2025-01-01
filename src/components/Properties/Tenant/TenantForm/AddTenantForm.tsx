import { ArrowDown, PlusIcon, Users01Icon } from '@assets/iconComponents';
import { Checkbox, Radio, Select, Switch } from '@mantine/core';
import clsx from 'clsx';
import React, { useRef, useState } from 'react';
import CoTenantsInputs from './CoTenantsInputs';
import TeanantsInputs from './TeanantsInputs';
import { useForm } from 'react-hook-form';
import { tenatDetailSchema } from '../schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { setNewTenent } from '@stores/addTenentSlice';
import StepButtons from '../StepButtons';
import { useNavigate } from 'react-router-dom';

const initialValues = {
  newTenant: false,
  selectApplication: false,
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
};

interface Props {
  step: number;
  handlers: {
    increment: () => void;
    decrement: () => void;
  };
}
const AddTenantForm = ({ step, handlers }: Props) => {
  const navigate = useNavigate();
  const [threeMonth, setThreemonth] = useState(true);
  const [twelveMonth, setTweleveMonth] = useState(false);
  const [currentTenant, setCurrentTenant] = useState(true);
  const [coteanantForm, setCoteanantForm] = useState(false);
  const [showCotenatFields, setshowcotenentfields] = useState(false);
  const [selectApplicationToggle, setSelectApplicationToggle] = useState(false);
  const dispatch = useDispatch();

  const methods = useForm({
    resolver: yupResolver(tenatDetailSchema),
    defaultValues: initialValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    getValues,
    reset,
    clearErrors,
    ...form
  } = methods;

  const handleContinue = async () => {
    // handlers.increment();
    await handleSubmit(onSubmit)();
  };

  const onSubmit = async (data: any) => {
    if (!isValid) {
      return;
    }
    handlers.increment();
    console.log(data, 'data');
  };

  const handleCancel = () => {
    clearErrors();
    if (step === 1) {
      navigate(-1);
    } else {
      handlers.decrement();
    }
  };

  return (
    <div>
      <div className=" grid gap-6 p-6">
        <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
          Tenant details
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
            disabled={true}
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
            disabled={true}
          />
        </fieldset>
        <div className="grid-cols-2 grid gap-5 ">
          <div
            onClick={() => {
              form.setValue('newTenant', false);
              clearErrors();
              setCurrentTenant(true);
              dispatch(setNewTenent(false));
              setSelectApplicationToggle(false);
            }}
            className={clsx(
              'border border-solid border-Gray-200 border-[2px] rounded-[12px] p-4 cursor-pointer',
              currentTenant && '!border-brand-970 border-2'
            )}
          >
            <div className="flex  gap-3">
              <Radio
                checked={currentTenant}
                className="mt-1"
                classNames={{
                  body: 'items-center',
                  radio: clsx(currentTenant && '!bg-brand-970 !border-brand-970'),
                }}
              />
              <div>
                <div className="text-Gray-700 text-base font-medium">Current tenant</div>
                <div className="mt-0.5 text-Gray-600 text-base font-normal">
                  Tenant is alredy residing at property
                </div>
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              setCurrentTenant(false);
              form.setValue('newTenant', true);
              clearErrors();
              dispatch(setNewTenent(true));
            }}
            className={clsx(
              ' border border-solid border-Gray-200 border-[2px] rounded-[12px] p-4 cursor-pointer',
              !currentTenant && '!border-brand-970 border-2'
            )}
          >
            <div className="flex  gap-3">
              <Radio
                checked={!currentTenant}
                className="mt-1"
                classNames={{
                  body: 'items-center',
                  radio: clsx(!currentTenant && '!bg-brand-970 !border-brand-970'),
                }}
              />
              <div>
                <div className="text-Gray-700 text-base font-medium">New tenant</div>
                <div className="mt-0.5 text-Gray-600 text-base font-normal">
                  Tenant to be schedule to move in on property
                </div>
              </div>
            </div>
          </div>
        </div>

        {!currentTenant && (
          <div className="grid gap-5">
            <Switch
              classNames={{ track: 'h-5 w-9' }}
              onChange={() => {
                setSelectApplicationToggle(!selectApplicationToggle);
                form.setValue('selectApplication', !selectApplicationToggle);
                clearErrors();
              }}
              checked={selectApplicationToggle}
              defaultChecked={selectApplicationToggle}
              label="Select from applications"
              // className="mt-5 w-28"
            />
            <Select
              classNames={{
                option: 'mb-0.5 rounded-[8px]',
                dropdown: 'rounded-[8px] drop-shadow-lg shadow-lg',
              }}
              label="Application"
              placeholder="Select application"
              checkIconPosition="right"
              comboboxProps={{ dropdownPadding: 0 }}
              rightSection={<ArrowDown />}
              disabled={!selectApplicationToggle}
              data={['Application1', 'Application2', 'Application3']}
            />
          </div>
        )}
        <TeanantsInputs
          currentTenant={currentTenant}
          setCurrentTenant={setCurrentTenant}
          methods={methods}
          selectApplicationToggle={selectApplicationToggle}
        />
        <CoTenantsInputs
          coteanantForm={coteanantForm}
          setCoteanantForm={setCoteanantForm}
          showCotenatFields={showCotenatFields}
          setshowcotenentfields={setshowcotenentfields}
          currentTenant={currentTenant}
        />
        <div
          className="bg-white border-solid border border-Gray-200  border-[1px] shadow-xs rounded-[8px] flex items-center justify-center cursor-pointer m-h-17 h-17"
          onClick={() => {
            setCoteanantForm(true);
            setshowcotenentfields(true);
          }}
        >
          <div className="flex items-center justify-center text-brand-960 font-semibold text-lg">
            <Users01Icon className="me-3" /> Add co-tenant <PlusIcon className="ms-3" />
          </div>
        </div>
        {currentTenant && (
          <>
            <div>
              <div className="flex gap-3 ">
                <Checkbox
                  checked={threeMonth}
                  onClick={() => setThreemonth(!threeMonth)}
                  classNames={{
                    label: 'text-gray-700 font-medium	text-base	',
                    body: 'items-center',
                    input: clsx('!rounded-[6px]', threeMonth && '!bg-brand-970 !border-brand-970'),
                  }}
                  className="mt-1"
                />
                <div>
                  <div className="text-Gray-700 text-base font-medium">
                    Tenant is reseding more than 3 months on the property
                  </div>
                  <div className="mt-0.5 text-Gray-600 text-base font-normal">
                    {' '}
                    Save my login details for next time.
                  </div>
                </div>
              </div>
            </div>
            <div>
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
                  <div className="text-Gray-700 text-base font-medium">
                    No late payment in the last 12 months
                  </div>
                  <div className="mt-0.5 text-Gray-600 text-base font-normal">
                    Save my login details for next time.
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <StepButtons
        step={step}
        handlers={handlers}
        handleContinue={handleContinue}
        handleCancel={handleCancel}
      />
    </div>
  );
};

export default AddTenantForm;
