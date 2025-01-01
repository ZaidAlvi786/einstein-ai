import {
  ArrowDown,
  DateIcon,
  Edit01Icon,
  EmailIcon02,
  Notificationicon,
  PlusIcon,
  SvgDefaultUser01,
  Users01Icon,
} from '@assets/iconComponents';
import { statesList } from '@constants/app.constant';
import { Badge, Button, Checkbox, Select } from '@mantine/core';
import CustomInput from '@utils/CustomInput';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { TeanantDetailsForm, tenatDetailSchema } from '@components/Properties/Tenant/schema';
interface Props {
  isleased: boolean;
  setIsLeased: (value: boolean) => void;
}

const initialValues = {
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

const CurrentTenant = ({ isleased, setIsLeased }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    ...form
  } = useForm({
    resolver: yupResolver(tenatDetailSchema) as any,
    defaultValues: initialValues,
  });
  const [moveIn, setMoveIn] = useState(false);
  const [moveExisting, setMoveExisting] = useState(false);
  const [moveOUt, setMoveOut] = useState(false);
  const [tenantList, setTenantList] = useState<TeanantDetailsForm[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showFields, setshowfields] = useState(true);

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
    reset();
  };
  const handleEdit = (index: number) => {
    const tenant = tenantList[index];
    setEditIndex(index);
    setshowfields(true);
    reset(tenant);
  };

  return (
    <>
      <div className="grid-cols-2 grid gap-5">
        <div
          onClick={() => setIsLeased(true)}
          className={clsx(
            'border border-solid border-gray-960 border-[2px] rounded-[12px] p-4 cursor-pointer',
            isleased && '!border-brand-970 border-2'
          )}
        >
          <div className="flex  gap-3">
            <Checkbox
              checked={isleased}
              className="mt-1"
              classNames={{
                label: 'text-gray-700 font-medium	text-base	',
                body: 'items-center',
                input: clsx('rounded-[6px]', isleased && '!bg-brand-970 !border-brand-970'),
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
          onClick={() => setIsLeased(false)}
          className={clsx(
            ' border border-solid border-gray-960 border-[2px] rounded-[12px] p-4 cursor-pointer',
            !isleased && '!border-brand-970 border-2'
          )}
        >
          <div className="flex  gap-3">
            <Checkbox
              className="mt-1"
              checked={!isleased}
              classNames={{
                label: 'text-gray-700 font-medium	text-base	',
                body: 'items-center',
                input: clsx('rounded-[6px]', !isleased && '!bg-brand-970 !border-brand-970'),
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
      {isleased && (
        <div className="bg-white mt-4 border-solid border-[1px] border-Gray-blue-300 rounded-[12px] flex ">
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
                    disabled
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
      {!isleased && (
        <div className="bg-white mt-4 border-solid border-[1px] border-Gray-200 rounded-[12px] p-3">
          <div className="mt-5 rounded-[8px] bg-Gray-50 py-3 text-center text-Gray-600 font-medium text-sm">
            Co-tenant
          </div>
        </div>
      )}
      {tenantList?.length > 0 &&
        tenantList.map((tenant, index) => (
          <div
            className="border-solid  border-gray-300  border-[1px] rounded-[12px] p-4  h-30 m-h-30"
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
              </div>
            </div>
          </div>
        ))}

      {showFields && (
        <div className={clsx('grid gap-5 mt-4')}>
          <fieldset className="grid-cols-2 grid gap-5 ">
            <CustomInput
              label="First name*"
              placeholder="First name"
              {...register('firstName')}
              error={errors.firstName?.message}
              onBlur={() => form.trigger('firstName')}
            />
            <CustomInput
              label="Last name* "
              placeholder="Last name"
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
          <div className="bg-white border-solid mt-6  border-Gray-200  border-[1px] shadow-xs rounded-[8px] flex items-center justify-center cursor-pointer m-h-17 h-17">
            <div className="flex items-center justify-center text-Gray-600 font-semibold text-lg">
              <Users01Icon className="me-3" /> Add residence <PlusIcon className="ms-3" />
            </div>
          </div>
          <fieldset className="grid-cols-2 grid gap-5 ">
            <CustomInput
              label="Monthly rent*"
              placeholder="0"
              {...register('address1')}
              error={errors.address1?.message}
              onBlur={() => form.trigger('address1')}
            />
            <CustomInput
              label="Move in date*"
              placeholder="$000"
              {...register('address2')}
              error={errors.address2?.message}
              onBlur={() => form.trigger('address2')}
            />
          </fieldset>
          <fieldset className="grid grid-cols-3 gap-5 ">
            <div>
              <Select
                label="Lease type*"
                placeholder="Select"
                checkIconPosition="right"
                rightSection={<ArrowDown />}
                data={statesList}
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
                placeholder="Select"
                label="Lease start date* "
                type="text"
                className={`w-full `}
                {...register('city')}
                error={errors.city?.message}
                onBlur={() => form.trigger('city')}
                leftSection={<DateIcon />}
              />
            </div>

            <div>
              <CustomInput
                placeholder="Select"
                label="Lease end date*"
                type="text"
                className={`w-full `}
                {...register('zip')}
                error={errors.zip?.message}
                onBlur={() => form.trigger('zip')}
                leftSection={<DateIcon />}
              />
            </div>
          </fieldset>
        </div>
      )}
    </>
  );
};

export default CurrentTenant;
