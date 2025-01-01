import {
  ArrowDown,
  Edit01Icon,
  EmailIcon02,
  Notificationicon,
  SvgDefaultUser01,
} from '@assets/iconComponents';
import { statesList } from '@constants/app.constant';
import { Badge, Button, Checkbox, Select } from '@mantine/core';
import CustomInput from '@utils/CustomInput';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { TeanantDetailsForm, tenatDetailSchema } from '../schema';
import { useForm, UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

interface Props {
  currentTenant: boolean;
  setCurrentTenant: (value: boolean) => void;
  methods: UseFormReturn<TeanantDetailsForm>;
  selectApplicationToggle: boolean;
}

const TeanantsInputs = ({
  currentTenant,
  setCurrentTenant,
  methods,
  selectApplicationToggle,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    ...form
  } = methods;
  const [moveIn, setMoveIn] = useState(false);
  const [moveExisting, setMoveExisting] = useState(false);
  const [moveOUt, setMoveOut] = useState(false);
  const [tenantList, setTenantList] = useState<TeanantDetailsForm[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showFields, setshowfields] = useState(true);

  useEffect(()=>{
    if(currentTenant===false){

      setTenantList([])
      setshowfields(true)
    }
  },[currentTenant])

  const onSubmit = (values: TeanantDetailsForm) => {
    setshowfields(false);
    if (editIndex !== null) {
      const updatedList = [...tenantList];
      updatedList[editIndex] = values;
      setTenantList(updatedList);
      setEditIndex(null);
    } else {
      setTenantList([...tenantList, values]);
    }
    reset(values);
  };
  const handleEdit = (index: number) => {
    const tenant = tenantList[index];
    setEditIndex(index);
    setshowfields(true);
    reset(tenant);
  };

  return (
    <>
      {currentTenant && (
        <div className="bg-white border border-solid border-[1px] border-Gray-blue-300 shadow-xs rounded-[12px] flex ">
          <div className="p-2.5 pe-2">
            <Notificationicon className="" />
          </div>
          <div className=" grid gap-3  py-4 pe-4 ps-0">
            <div>
              <div className="text-Gray-700 text-sm font-semibold leading-5">
                Lease alredy in place
              </div>
              <div className="mt-0.5 text-Gray-600 text-sm  font-normal  leading-5">
                This unit has alredy a lease, only one active lease per protperty. To precced
                furter, first move out exsiting tenants and end lease.
              </div>
            </div>
            <div className="flex  gap-3">
              <Checkbox
                checked={moveIn}
                onClick={() => setMoveIn(!moveIn)}
                classNames={{
                  label: 'text-gray-700 font-medium	text-base	',
                  body: 'items-center',
                  input: clsx('!rounded-[6px]', moveIn && '!bg-brand-970 !border-brand-970'),
                }}
              />
              <div>
                <div className="text-Gray-700 text-sm font-medium  leading-5">Schudal move in</div>
                <div className="mt-0.5 text-Gray-600 text-sm  font-normal  leading-5">
                  Tenant will bw added to property as a “schudled tenant”.
                </div>
              </div>
            </div>
            <div className="flex  gap-3">
              <Checkbox
                checked={moveExisting}
                onClick={() => setMoveExisting(!moveExisting)}
                classNames={{
                  label: 'text-gray-700 font-medium	text-base	',
                  body: 'items-center',
                  input: clsx('!rounded-[6px]', moveExisting && '!bg-brand-970 !border-brand-970'),
                }}
              />
              <div>
                <div className="text-Gray-700 text-sm font-medium  leading-5">
                  Move exsiting to diffrent unit
                </div>
                <div className="mt-0.5 text-Gray-600 text-sm  font-normal  leading-5">
                  After finishin adding new lease the current lease will be ammended and the
                  exsiting tenants will be mooved to:
                </div>
                <div className="grid-cols-2 grid gap-5 mt-2">
                  <Select
                    classNames={{
                      option: 'mb-0.5 rounded-[8px]',
                      dropdown: 'rounded-[8px] drop-shadow-lg shadow-lg',
                      input: 'text-sm',
                    }}
                    placeholder="Select unit"
                    checkIconPosition="right"
                    comboboxProps={{ dropdownPadding: 0 }}
                    rightSection={<ArrowDown />}
                    data={['Unit 101', 'Unit 102', 'Unit 103']}
                  />
                </div>
              </div>
            </div>
            <div className="flex  gap-3">
              <Checkbox
                checked={moveOUt}
                onClick={() => setMoveOut(!moveOUt)}
                classNames={{
                  label: 'text-gray-700 font-medium	text-base	',
                  body: 'items-center',
                  input: clsx('!rounded-[6px]', moveOUt && '!bg-brand-970 !border-brand-970'),
                }}
              />
              <div>
                <div className="text-Gray-700 text-sm font-medium  leading-5">
                  Move out exsiting tenants
                </div>
                <div className="mt-0.5 text-Gray-600 text-sm  font-normal  leading-5">
                  After finishin adding new lease, the exsiting lease will immtely be nended and
                  tenants mooved out.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
              </div>
            </div>
          </div>
        ))}
      {showFields && (
        <div className={clsx('grid gap-5 ')}>
          <fieldset className="grid-cols-2 grid gap-5 ">
            <CustomInput
              label="First name*"
              placeholder="First name"
              {...register('firstName')}
              disabled={selectApplicationToggle}
              error={errors.firstName?.message}
            />
            <CustomInput
              label="Last name* "
              placeholder="Last name"
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
          {!currentTenant && (
            <>
              <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2 ">
                Previous address
              </div>
              <fieldset className="grid-cols-2 grid gap-5 ">
                <CustomInput
                  label="Address 1*"
                  placeholder="Enter address 1"
                  {...register('address1')}
                  error={errors.address1?.message}
                  disabled={selectApplicationToggle}
                />
                <CustomInput
                  label="Address 2"
                  placeholder="Enter address 2"
                  {...register('address2')}
                  disabled={selectApplicationToggle}
                  error={errors.address2?.message}
                />
              </fieldset>
              <fieldset className="grid grid-cols-3 gap-5 ">
                <div>
                  <CustomInput
                    placeholder="Enter City"
                    label="City*"
                    type="text"
                    className={`w-full `}
                    {...register('city')}
                    error={errors.city?.message}
                    disabled={selectApplicationToggle}
                    onBlur={() => form.trigger('city')}
                  />
                </div>
                <div>
                  <Select
                    label="State*"
                    placeholder="Select State"
                    checkIconPosition="right"
                    rightSection={<ArrowDown />}
                    data={statesList}
                    disabled={selectApplicationToggle}
                    className={`w-full `}
                    {...register('state')}
                    onChange={(_value, option) => {
                      form.clearErrors('state');
                      form.setValue('state', option.value);
                    }}
                    error={errors.state?.message}
                    onBlur={() => form.trigger('state')}
                  />
                </div>
                <div>
                  <CustomInput
                    placeholder="Enter Zip Code"
                    label="Zip Code*"
                    type="text"
                    className={`w-full `}
                    disabled={selectApplicationToggle}
                    {...register('zip')}
                    error={errors.zip?.message}
                  />
                </div>
              </fieldset>
            </>
          )}

          <div className="flex justify-end ">
            <Button
              variant="subtle"
              className="text-Brand-700"
              onClick={handleSubmit(onSubmit)}
              disabled={selectApplicationToggle}
            >
              Add
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default TeanantsInputs;
