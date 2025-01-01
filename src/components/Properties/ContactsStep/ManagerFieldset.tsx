import { Badge, Button, Group, Input, Modal, Select, SelectProps, Switch } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import {
  Users03Icon,
  EmailIcon,
  Users04Icon,
  ArrowDown,
  EmailIcon02,
  Delete01,
  Edit01Icon,
  AlertCircleIcon,
  CheckIcon02
} from '@assets/iconComponents';
import { propertyManagerSchema } from '../PropertyDetailsStep/schemas';
import { CustomInput } from '@utils/CustomInput';
import { useDisclosure } from '@mantine/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import { UnknownAction } from '@reduxjs/toolkit';
import {
  deleteManegerDetails,
  getManegerDeatils,
  setManagerDetails,
  setOwnerDetails,
  updateManagerDetails,
} from '@stores/propertySlice';
import { useDispatch, useSelector } from 'react-redux';
import { PropertyManegerSchema } from '@interfaces/property.interface';
import { useState } from 'react';
import clsx from 'clsx';
import bgPattrerens from '@assets/patterns/Background pattern decorative.svg';
import profileIcon from '@assets/patterns/Featured icon.svg';
import { IMaskInput } from 'react-imask';

const initialValues = {
  company: true,
  first_name: '',
  last_name: '',
  title: '',
  phone_number: '',
  email: '',
};

interface Data {
  company?: boolean; // Required
  company_name?: string; // Required if company is true
}
export function ManagerFieldset() {
  const manegerDetails = useSelector(getManegerDeatils);
  const [opened, { open, close }] = useDisclosure(false);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [checkIndex, setCheckIndex] = useState(null);
  const dispatch = useDispatch();
  const methodsManager = useForm({
    resolver: yupResolver(propertyManagerSchema),
    defaultValues: initialValues,
  });

  const {
    handleSubmit,
    register,
    clearErrors,
    watch,
    setValue,
    getValues,
    formState: { errors, isValid },
    ...form
  } = methodsManager;
  const company = watch(`company`);
  const title = watch(`title`);
  const onSubmit = (data: any) => {};

  const handleContinue = () => {   
    handleSubmit(onSubmit)();

    if (company && name === '') {      
      setNameError(true);
      return;
    } else {
      setNameError(false);
    }

    let data: Data = getValues();
    
    // if company is true then add  name field to data
    if (company) {
      data = { ...data, company_name: name };
    }
    if (checkIndex !== null) {
      let newData = {
        index: checkIndex,
        maneger: data,
      };
      dispatch(
        updateManagerDetails(
          newData as unknown as PropertyManegerSchema
        ) as unknown as UnknownAction
      );
      close();
      setCheckIndex(null);
      return;
    }
    dispatch(
      setManagerDetails(data as unknown as PropertyManegerSchema) as unknown as UnknownAction
    );
    close();
  };

  const onEdit = (maneger: any, index: any) => {
    
    setCheckIndex(index);
    open();
    if(maneger?.company){
      setName(maneger.company_name)
    }
    setValue(`company`, maneger.company);
    setValue('first_name', maneger?.first_name);
    setValue('last_name', maneger?.last_name);
    setValue('title', maneger?.title || '');
    setValue('email', maneger?.email);
    setValue('phone_number', maneger?.phone_number);
  };
  const removeDetails = (index: unknown) => {
    dispatch(deleteManegerDetails(index) as unknown as UnknownAction);
  };

  const handleManeger = () => {
    methodsManager.reset();
    open();
    setName('');
  };

  const renderSelectOption: SelectProps['renderOption'] = ({ option, checked }) => (
    <Group flex="1" className={clsx('justify-between items-center gap-0 p-2.5 colors-gray-900  ',checked &&' bg-gray-50') }>
      <span className='text-base	font-medium	'>{option.label}</span>
      {checked && <CheckIcon02  />}
    </Group>
  );
  return (
    <>
      <Modal
        size={640}
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
            <Users04Icon className="ms-6.8 mt-3 size-9" />
          </div>
          <div className="p-6 pt-2">
            <div className="leading-7 font-semibold text-lg	 text-gray-900">
              Add property manager
            </div>
            <div className="text-sm font-normal text-gray-600 mt-2">
              Share where you’ve worked on your profile.
            </div>

            <Switch
              onChange={() => {
                setValue(`company`, !company);
              }}
              classNames={{ track: 'h-5 w-9' }}
              checked={company}
              defaultChecked={company}
              label="Company"
              className="mt-5 w-28"
            />
            <>
              {company && (
                <CustomInput
                  label="Company name*"
                  placeholder="Enter company name"
                  className="mt-3"
                  value={name}
                  classNames={{
                    input: clsx(
                      nameError &&
                        '!border-[#F04438] !focus:shadow-error !text-gray-900 !placeholder:text-gray-500'
                    ),
                  }}
                  onChange={(e) => {
                    setName(e.target.value);
                    setNameError(false);
                  }}
                />
              )}
              {company && nameError && (
                <div className="text-error-600 text-xs mt-1">Company name is required</div>
              )}
              <fieldset className="grid-cols-3 grid gap-5 mt-2">
                <CustomInput
                  label="First name*"
                  placeholder="First name"
                  {...register(`first_name`)}
                  error={errors.first_name?.message}
                />
                <CustomInput
                  label="Last name* "
                  placeholder="Last name"
                  {...register(`last_name`)}
                  error={errors.last_name?.message}
                />

                <Select
                  {...register(`title`)}
                  classNames={{option:'p-0 mb-0.5 rounded-lg',dropdown:"rounded-lg drop-shadow-lg shadow-lg" }}
                  label="Title*"
                  placeholder="Select"
                  checkIconPosition="right"
                  comboboxProps={{ dropdownPadding: 0 }}
                  rightSection={<ArrowDown />}
                  value={title}
                  data={['Property manager', 'Leasing agent', 'Other']}
                  renderOption={renderSelectOption}
                  error={errors.title?.message}
                  onChange={(value) => {
                    setValue(`title`, value ?? '');
                    clearErrors(`title`);
                  }}
                />
              </fieldset>
              <fieldset className="grid-cols-2 grid gap-5 mt-6">
                <CustomInput
                  leftSection={<EmailIcon02 className="size-5" />}
                  label="Email address*"
                  placeholder="olivia@untitledui.com"
                  {...register(`email`)}
                  error={errors.email?.message}
                />
                  <Input.Wrapper
              classNames={{
                label: 'text-sm leading-5 font-medium	 text-gray-700 mb-1.5',
              }}
              label="Phone number*"
              className="w-full "
            >
              <Controller
                name="phone_number"
                control={form.control}
                render={({ field }) => (
                  <Input
                  value={field.value}
                    size="sm"
                    radius="md"
                    error={errors.phone_number?.message}
                    className="w-full"
                    classNames={{
                      input: clsx(
                        ' !h-11 placeholder:text-gray-500',
                        errors.phone_number?.message && 'border-error-600 focus:shadow-error'
                      ),
                    }}
                    // leftSection={<USWithArrow />}
                    rightSection={
                      errors.phone_number?.message ? (
                        <AlertCircleIcon className="size-4 text-error-500 me-2.5" />
                      ) : (
                        ''
                      )
                    }
                    type="text"
                    component={IMaskInput}
                    onAccept={(value) => {
                      field.onChange(value);
                      setValue('phone_number', value);
                      if (!form.getFieldState('phone_number').invalid) {
                        clearErrors('phone_number');
                      }
                    }}
                    // onChange={() => form.trigger('phone')}
                    onBlur={() => form.trigger('phone_number')}
                    mask="+1 000-000-0000"
                    placeholder="212-212-1100"
                  />
                )}
              />

              {errors.phone_number?.message && (
                <p className="text-error-600 text-xs !mt-1 -mb-6">
                  {' '}
                  {errors.phone_number?.message}
                </p>
              )}
            </Input.Wrapper>
              </fieldset>
            </>

            <div className="grid-cols-2 grid gap-5 mt-10">
              <Button
                variant="outline"
                onClick={close}
                className="border-gray-300 font-semibold h-11 rounded-lg text-gray-700  hover:bg-transparent hover:text-gray-700"

              >
                Cancel
              </Button>
              <Button
                onClick={handleContinue}
                variant="outline"
                className="rounded-lg h-11 hover:bg-brand-970 hover:text-white bg-brand-960 text-base text-white font-semibold ms-3"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <div className="flex flex-col gap-6">
        <div className="grid-cols-2 grid gap-6">
          {manegerDetails.length > 0 &&
            manegerDetails.map((maneger, index) => (
              <div
                // onClick={open}
                key={index}
                className="border-solid border border-gray-300 rounded-xl  px-4 py-4  h-30 m-h-30"
              >
                <div className="flex justify-between">
                  <div className="flex">
                    <div className="items-center self-center me-4">
                      <img
                        className="col-span-1 w-14 h-14"
                        src={profileIcon.toString()}
                        alt="person-avatar"
                      />
                    </div>
                    <div className="self-center">
                      <div className="text-lg	font-semibold	leading-7	text-gray-700  flex items-center ">
                        <span className="text-ellipsis w-32 whitespace-nowrap overflow-hidden">
                          {maneger?.first_name} {maneger?.last_name}
                        </span>
                        {maneger.title && <Badge
                          classNames={{
                            root: 'ms-1 bg-transparent rounded-md border border-gray-300 border-solid drop-shadow-xs',
                            label: 'text-xs font-medium	leading-11 text-gray-700 capitalize  whitespace-nowrap overflow-hidden',
                          }}
                          variant="light"
                          className="h-3.2"
                        >
                          {maneger.title}
                        </Badge>}
                      </div>
                      <div className="font-semibold	text-base	leading-6	text-gray-600">
                        {maneger.email}
                      </div>
                      <div className="font-normal	text-base	leading-6 text-gray-600">
                        {maneger?.phone_number}
                      </div>
                    </div>
                  </div>
                  <div className="pe-1 py-1">
                    <div>
                      <Edit01Icon
                        onClick={() => {
                          onEdit(maneger, index);
                        }}
                        className="text-gray-700 cursor-pointer h-5 w-5"
                      />
                    </div>
                    <div>
                      <Delete01
                        onClick={() => {
                          removeDetails(index);
                        }}
                        className="text-gray-700 mt-5 cursor-pointer h-5 w-5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          <div
            onClick={handleManeger}
            className="bg-white border-solid border border-[#D0D5DD]  drop-shadow-xs rounded-lg h-30 m-h-30 flex items-center justify-center cursor-pointer"
          >
            <div className="my-3 flex items-center justify-center text-brand-960 font-semibold text-lg leading-7">
              Add manager <Users03Icon className="ms-3" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
