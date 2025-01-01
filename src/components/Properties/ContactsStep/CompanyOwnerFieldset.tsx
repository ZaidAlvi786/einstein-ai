import { Badge, Modal, Select } from '@mantine/core';
import { UseFormReturn } from 'react-hook-form';
import { Delete01, ArrowDown, Users03Icon, Edit01Icon } from '@assets/iconComponents';
import { CustomInput } from '@utils/CustomInput';
import { useDisclosure } from '@mantine/hooks';
import { statesList } from '@constants/app.constant';
import { useDispatch, useSelector } from 'react-redux';
import { deleteOwnerDetails, getOwnerDeatils } from '@stores/propertySlice';
import { OwnerDetails } from '@interfaces/property.interface';
import { useState } from 'react';
import { UnknownAction } from '@reduxjs/toolkit';
import profileIcon from '@assets/patterns/Featured icon.svg';
import { PropertyContactsForm } from '../PropertyDetailsStep/schemas';
import { CompanyOwnerContacts } from './CompanyOwnerContacts';

type nameType = 'owner' | 'manager';
interface Props {
  methods: UseFormReturn<PropertyContactsForm>;
  name: nameType;
  handleContinue: () => void;
}
export function CompanyOwnerFieldset({ methods }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const dispatch = useDispatch();
  const ownerDetails = useSelector(getOwnerDeatils);

  const [details, setDeatails] = useState({} as any);
  const {
    register,
    clearErrors,
    setValue,
    getValues,
    watch,
    formState: { errors },
    ...form
  } = methods;

  const editDetails = (owner: OwnerDetails, index: any) => {
    let data = {
      index: index,
      owner: owner,
    };
    setDeatails(data);
    open();
  };
  const removeDetails = (index: unknown) => {
    dispatch(deleteOwnerDetails(index) as unknown as UnknownAction);
  };
  const state = watch('company_info.state');
  return (
    <>
      <div className="flex flex-col gap-6">
        <fieldset className="grid-cols-3 grid gap-6">
          <CustomInput
            {...register(`company_info.company_name`)}
            label="Company name*"
            placeholder="Enter company name"
            error={errors['company_info']?.company_name?.message}
            onChange={() => {
              clearErrors('company_info.company_name');
            }}
          />
          <CustomInput
            {...register(`company_info.address_1`)}
            label="Address 1*"
            placeholder="Enter address 1"
            error={errors['company_info']?.address_1?.message}
            onChange={() => {
              clearErrors('company_info.address_1');
            }}
          />
          <CustomInput
            {...register(`company_info.address_2`)}
            label="Address 2"
            placeholder="Enter address 2"
          />
          <CustomInput
            {...register(`company_info.city`)}
            onChange={() => {
              clearErrors('company_info.city');
            }}
            label="City*"
            placeholder="Enter City"
            error={errors['company_info']?.city?.message}
          />

          <Select
            {...register(`company_info.state`)}
            label="State*"
            value={state}
            placeholder="Select State"
            checkIconPosition="right"
            rightSection={<ArrowDown />}
            data={statesList}
            error={errors['company_info']?.state?.message}
            onChange={(value) => {
              setValue(`company_info.state`, value ?? '');
              clearErrors(`company_info.state`);
            }}
          />

          <CustomInput
            {...register(`company_info.zip_code`)}
            value={getValues('company_info.zip_code') || ''}
            label="Zip Code*"
            placeholder="Enter Zip Code"
            type="number"
            min="0"
            error={errors['company_info']?.zip_code?.message}
            onChange={() => {
              clearErrors('company_info.zip_code');
            }}
          />
        </fieldset>
        <div className="grid-cols-2 grid gap-5 ">
          {ownerDetails.length > 0 &&
            ownerDetails.map((owner, index) => (
              <div
                // onClick={open}
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
                          {owner.first_name} {owner.last_name}
                        </span>
                        {owner.title && (
                          <Badge
                            classNames={{
                              root: 'ms-1 bg-transparent rounded-md border border-gray-300 border-solid drop-drop-shadow-xs',
                              label:
                                'text-xs font-medium	leading-11 text-gray-700 capitalize  whitespace-nowrap overflow-hidden',
                            }}
                            variant="light"
                            className="h-3.2"
                          >
                            {owner.title}
                          </Badge>
                        )}
                      </div>
                      <div className="font-semibold	text-base	leading-6	text-gray-600">
                        {owner.email}
                      </div>
                      <div className="font-normal	text-base	leading-6 text-gray-600">
                        {owner.phone_number}
                      </div>
                    </div>
                  </div>
                  <div className="pe-1 py-1">
                    <div>
                      <Edit01Icon
                        onClick={() => {
                          editDetails(owner, index);
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

          <Modal
            size={'lg'}
            classNames={{
              title: 'text-brand-960 font-semibold text-lg',
              content: 'rounded-xl ',
              header: 'w-24 float-right bg-transparent',
              body: 'p-0',
              close: 'text-gray-400',
            }}
            opened={opened}
            onClose={() => {
              close();
              setDeatails({});
            }}
          >
            <CompanyOwnerContacts
              opened={opened}
              onClose={close}
              owner={details}
              setDeatails={setDeatails as () => void}
            />
          </Modal>
          <div
            className="flex m-h-30 items-center justify-center border-solid border border-gray-300 rounded-xl  cursor-pointer h-30 m-h-30"
            onClick={open}
          >
            <div className="my-3 flex items-center justify-center text-brand-960 font-semibold text-lg leading-7">
              Add contact person <Users03Icon className="ms-3" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
