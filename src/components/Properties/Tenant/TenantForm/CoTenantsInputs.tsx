import { ArrowDown, Edit01Icon, EmailIcon02, SvgDefaultUser01 } from '@assets/iconComponents';
import { statesList } from '@constants/app.constant';
import { yupResolver } from '@hookform/resolvers/yup';
import { Badge, Button, Checkbox, Select } from '@mantine/core';
import CustomInput from '@utils/CustomInput';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CoTeanantDetailsForm, coTenantschema } from '../schema';

interface Props {
  coteanantForm: boolean;
  setCoteanantForm: (value: boolean) => void;
  showCotenatFields: boolean;
  setshowcotenentfields: (value: boolean) => void;
  currentTenant: boolean;
}

const CoTenantsInputs = ({
  coteanantForm,
  setCoteanantForm,
  showCotenatFields,
  setshowcotenentfields,
  currentTenant
}: Props) => {

 
  const initialValues = {
    newTenant:currentTenant?false:true,
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    ...form
  } = useForm({
    resolver: yupResolver(coTenantschema),
    defaultValues: initialValues,
  });

  const [conTenantCheck, setConTenantCheck] = useState(true);
  const [occupantCheck, setOccupantCheck] = useState(false);
  const [cotenantList, setCoTenantList] = useState<CoTeanantDetailsForm[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(()=>{
    if(currentTenant===true){
      setCoTenantList([])
      setshowcotenentfields(true)
    }
  },[currentTenant])


 
  const onSubmit = (values: CoTeanantDetailsForm) => {
    reset();
    if (editIndex !== null) {
      const updatedList = [...cotenantList];
      updatedList[editIndex] = values;
      setCoTenantList(updatedList);
      setEditIndex(null);
    } else {
      setCoTenantList([...cotenantList, values]);
    }
    setshowcotenentfields(false);
  };
  const handleEdit = (index: number) => {
    const coTenant = cotenantList[index];
    setEditIndex(index);
    setshowcotenentfields(true);
    reset(coTenant);
  };
  const handleCancel=()=>{
    if (cotenantList.length===0){
        setCoteanantForm(false);
    }
    else{
        setshowcotenentfields(false)
    }

  }
  return (
    <>
      {coteanantForm && (
        <div
          className={clsx(
            'grid gap-5 bg-white border border-solid border-Gray-200 shadow-xs  border-[1px] rounded-[12px] p-6'
          )}
        >
          <div className="grid gap-5">
            <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
              Co-tenant
            </div>
          </div>

          {cotenantList?.length > 0 &&
            cotenantList.map((cotenant, index) => (
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
                          {cotenant?.firstName} {cotenant.lastName}
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
                          Co-Tenant
                        </Badge>
                      </div>
                      <div className="font-normal	text-base	leading-6	text-gray-600">
                        {cotenant.phoneNumber}
                      </div>
                      <div className="font-normal	text-base	leading-6 text-gray-600 mt-0.5">
                        {cotenant.email}
                      </div>
                    </div>
                  </div>
                  <div className="pe-1 py-1">
                    <Edit01Icon
                      className="text-gray-700 cursor-pointer h-5 w-5"
                      onClick={() => {
                        handleEdit(index);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            
          {showCotenatFields && (
            <>
              <div className="grid gap-5">
                <div className="flex  gap-3">
                  <Checkbox
                    checked={conTenantCheck}
                    onClick={() => setConTenantCheck(!conTenantCheck)}
                    classNames={{
                      label: 'text-gray-700 font-medium	text-base	',
                      body: 'items-center',
                      input: clsx(
                        '!rounded-[6px]',
                        conTenantCheck && '!bg-brand-970 !border-brand-970'
                      ),
                    }}
                    className="mt-1"
                  />
                  <div>
                    <div className="text-Gray-700 text-base font-medium">Co-tenant</div>
                    <div className="mt-0.5 text-Gray-600 text-base font-normal">
                      Is residing at property and share financial responsibilities
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
                      input: clsx(
                        '!rounded-[6px]',
                        occupantCheck && '!bg-brand-970 !border-brand-970'
                      ),
                    }}
                    className="mt-1"
                  />
                  <div>
                    <div className="text-Gray-700 text-base font-medium">Additional occupants</div>
                    <div className="mt-0.5 text-Gray-600 text-base font-normal">
                      Is living at property with no financial responsibilities
                    </div>
                  </div>
                </div>
              </div>
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
              {!currentTenant && <>
              <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2 ">
                Previous address
              </div>
              <fieldset className="grid-cols-2 grid gap-5 ">
                <CustomInput
                  label="Address 1*"
                  placeholder="Enter address 1"
                  {...register('address1')}
                  error={errors.address1?.message}
                  onBlur={() => form.trigger('address1')}
                />
                <CustomInput
                  label="Address 2"
                  placeholder="Enter address 2"
                  {...register('address2')}
                  error={errors.address2?.message}
                  onBlur={() => form.trigger('address2')}
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
                    className={`w-full `}
                    {...register('state')}
                    onChange={(_value, option) => {
                      setValue('state', option.value);
                      form.clearErrors('state');
                    }}
                    // onChange={(value) => {
                    //   setValue(`state`, value );
                    //   form.clearErrors(`state`);
                    // }}
                    error={errors.state?.message}
                  />
                </div>
                <div>
                  <CustomInput
                    placeholder="Enter Zip Code"
                    label="Zip Code*"
                    type="text"
                    className={`w-full `}
                    {...register('zip')}
                    error={errors.zip?.message}
                    onBlur={() => form.trigger('zip')}
                  />
                </div>
              </fieldset>
              </>}

              <div className="flex justify-end ">
                <Button
                  variant="subtle"
                  className="text-Brand-700"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  variant="subtle"
                  className="text-Brand-700"
                  onClick={handleSubmit(onSubmit)}
                >
                  Add
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default CoTenantsInputs;
