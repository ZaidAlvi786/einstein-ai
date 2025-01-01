import {
  ArrowDown,
  Delete01,
  Edit01Icon,
  EmailIcon02,
  PlusIcon,
  SvgDefaultUser01,
  Users01Icon,
} from '@assets/iconComponents';
import { Badge, Button, Checkbox,  Select, Switch } from '@mantine/core';
import clsx from 'clsx';
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import StepButtons from '../StepButtons';
import CustomInput from '@utils/CustomInput';
import { tenantsDetailSchema, TenantsDetailsForm } from '../schema';
import ResidenceInputs from './ResidenceInputs';
import { MyContext } from '../AddLeaseTenant';

const initialValues = {
  selectApplication: true,
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
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
  const {newTenant,setNewTenant} = useContext(MyContext);

  const [currentTenant, setCurrentTenant] = useState(true);
  const [coteanantForm, setCoteanantForm] = useState(false);
  const [showCotenatFields, setshowcotenentfields] = useState(false);
  const [selectApplicationToggle, setSelectApplicationToggle] = useState(true);
  const [tenantList, setTenantList] = useState<TenantsDetailsForm[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showFields, setshowfields] = useState(true);
  const [conTenantCheck, setConTenantCheck] = useState(true);
  const [occupantCheck, setOccupantCheck] = useState(true);

  const dispatch = useDispatch();

  const methods = useForm({
    resolver: yupResolver(tenantsDetailSchema),
    defaultValues: initialValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    getValues,
    reset,
    // clearErrors,
    ...form
  } = methods;

  const handleContinue = async () => {
    // handlers.increment();
    await handleSubmit(onSubmit)();
  };

  const onSubmit = async (data: any) => {
    // if (!isValid) {
    //   return;
    // }
    handlers.increment();
    console.log(data, 'data');
  };

  const onAdd = async (data: any) => {
    setshowfields(false);
    if (editIndex !== null) {
      const updatedList = [...tenantList];
      updatedList[editIndex] = data;
      setTenantList(updatedList);
      setEditIndex(null);
    } else {
      setTenantList([...tenantList, data]);
    }
    reset(data);
    console.log(data, 'data');
  };

  const handleCancel = () => {
    // clearErrors();
    if (step === 1) {
      navigate(-1);
    } else {
      handlers.decrement();
    }
  };

  const handleEdit = (index: number) => {
    const tenant = tenantList[index];
    setEditIndex(index);
    setshowfields(true);
    reset(tenant);
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
          />
        </fieldset>
        <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
          Tenant details
        </div>
        <div className="grid gap-5">
          <Switch
            classNames={{ track: 'h-5 w-9' }}
            onChange={() => {
              setSelectApplicationToggle(!selectApplicationToggle);
              form.setValue('selectApplication', !selectApplicationToggle);
              form.clearErrors();
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
            label="Search appilcation"
            placeholder="Search and select"
            checkIconPosition="right"
            comboboxProps={{ dropdownPadding: 0 }}
            rightSection={<ArrowDown />}
            disabled={!selectApplicationToggle}
            data={['Application1', 'Application2', 'Application3']}
          />
        </div>
        {tenantList?.length > 0 &&
          tenantList.map((tenant, index) => (
            <div
              className="border-solid border border-Gray-200 shadow-xs  border-[1px] rounded-[12px] p-4  h-30 m-h-30"
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
                          root: 'ms-1 bg-Gray-200 rounded-[6px] border border-Gray-200 border-solid  border-[1px] drop-shadow-xs',
                          label:
                            'text-xs font-medium	leading-11 text-gray-700 capitalize  whitespace-nowrap overflow-hidden',
                        }}
                        variant="light"
                        className="h-3.2"
                      >
                        Primary renter
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
                      setTenantList([]);
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
                disabled={selectApplicationToggle}
                error={errors.firstName?.message}
              />
              <CustomInput
                label="Last name* "
                placeholder="Enter last name"
                {...register('lastName')}
                disabled={selectApplicationToggle}
                error={errors.lastName?.message}
              />
              <CustomInput
                leftSection={<EmailIcon02 className="size-5" />}
                label="Email address"
                placeholder="Enter email address"
                {...register('email')}
                disabled={selectApplicationToggle}
                error={errors.email?.message}
              />
              <CustomInput
                label="Phone number"
                placeholder="Enter phone number"
                {...register('phoneNumber')}
                disabled={selectApplicationToggle}
                error={errors.phoneNumber?.message}
              />
            </fieldset>

            <div className="flex justify-end ">
              <Button
                variant="subtle"
                className="text-Brand-700"
                onClick={handleSubmit(onAdd)}
                disabled={selectApplicationToggle}
              >
                Add
              </Button>
            </div>
          </div>
        )}
        <ResidenceInputs
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
            <Users01Icon className="me-3" />Add co-resident <PlusIcon className="ms-3" />
          </div>
        </div>
        <div className="grid gap-5 ">
          <div className="flex  gap-3">
            <Switch
              classNames={{ track: 'h-5 w-9' }}
              onChange={() => {

                setNewTenant(!newTenant);
              }}
              checked={newTenant}
              defaultChecked={newTenant}
              className="mt-1 "
            />
            <div>
              <div className="text-Gray-700 text-base font-medium">New tenant</div>
              <div className="mt-0.5 text-Gray-600 text-base font-normal">
                Tenant is not yet resding on property.{' '}
              </div>
            </div>
          </div>
          {
            !newTenant&&
            <>
          <div className="flex  gap-3">
            <Checkbox
              checked={conTenantCheck}
              onClick={() => setConTenantCheck(!conTenantCheck)}
              classNames={{
                label: 'text-gray-700 font-medium	text-base	',
                body: 'items-center',
                input: clsx('!rounded-[6px]', conTenantCheck && '!bg-brand-970 !border-brand-970'),
              }}
              className="mt-1"
            />
            <div>
              <div className="text-Gray-700 text-base font-medium">
                Tenant is reseding more than 3 months on the property
              </div>
              <div className="mt-0.5 text-Gray-600 text-base font-normal">
                Save my login details for next time.{' '}
              </div>
            </div>
          </div>
          <div className="flex  gap-3">
            <Checkbox
              checked={occupantCheck}
              onClick={() => setOccupantCheck(!occupantCheck)}
              classNames={{
                label: 'text-gray-700 font-medium	text-base	',
                body: 'items-center',
                input: clsx('!rounded-[6px]', occupantCheck && '!bg-brand-970 !border-brand-970'),
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
          </>
          }
        </div>
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
