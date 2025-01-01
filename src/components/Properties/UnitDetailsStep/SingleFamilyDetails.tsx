import React, { useEffect, useState } from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { CustomInput } from '@utils/CustomInput';
import {
  ActionIcon,
  Badge,
  Button,
  Image,
  Modal,
  RingProgress,
  Select,
  TagsInput,
} from '@mantine/core';
import {
  ArrowDown,
  Delete01,
  Edit01Icon,
  Home05Icon,
  Home06Icon,
  HomeIcon03,
  PlusIcon01,
  Square,
} from '@assets/iconComponents';
import { useDisclosure } from '@mantine/hooks';
import { statesList } from '@constants/app.constant';
import bgPattrerens from '@assets/patterns/Background pattern decorative.svg';
import single from '@assets/img/single.svg';
import { deleteUnitDetails, selectApiData } from '@stores/propertySlice';
import { useDispatch, useSelector } from 'react-redux';
import { UnknownAction } from '@reduxjs/toolkit';
import { DescriptionWithCounter } from '../PropertyDetailsStep/DescriptionWithCounter';
import { UnitDetailsForm } from './schemas';
import { FileDropzone } from './FileDropzone';
import { setLoading } from '@stores/authSlice';
import { SINGLE_UNIT_VALUE } from '@constants/singleUnit.constants';

interface Props {
  methods: UseFormReturn<UnitDetailsForm>;
  handleContinue: (values: any) => void;
  unitDetailList: any;
  getUnitList: () => void;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  closeUnitModal: boolean;
  setCloseUnitModal: (values: boolean) => void;
}

export function SingleFamilyDetails({
  methods,
  handleContinue,
  unitDetailList,
  getUnitList,
  setIsEdit,
  closeUnitModal,
  setCloseUnitModal,
}: Props) {
  const propertyData = useSelector(selectApiData);

  const baseUrl = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const [opened, { open, close }] = useDisclosure(false);
  const [editData, setEditData] = useState<any>();
  const [isParking, { toggle }] = useDisclosure();
  const unitType = 'single';
  const {
    register,
    control,
    formState: { errors },
    getValues,
    setValue,
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: `single`,
  });

  const {
    handleSubmit,
    formState: { isValid },
    reset,
    watch,
  } = methods;

  const state = watch('single')?.[0]?.state;

  const getImage = (imagePath: string) => {
    return imagePath ? baseUrl + imagePath : single;
  };
  useEffect(() => {
    if (opened && editData) {
      setIsEdit(true);
      setValue('single', [
        {
          id: editData?.id,
          name: editData?.unit_info?.name,
          address1: editData?.unit_info?.address_1,
          address2: editData?.unit_info?.address_2,
          city: editData?.unit_info?.city,
          state: editData?.unit_info?.state,
          zip: editData?.unit_info?.zip_code,
          description: editData?.description,
          bedrooms: editData?.bedrooms,
          bathrooms: editData?.bathrooms,
          amenities: editData?.amenities,
          sqfeet: editData?.square_feet,
          rent: editData?.market_rent,
          images: editData?.photos,
        },
      ]);
    } else {
      setIsEdit(false);
      setEditData(null);
      const resetData = {
        ...SINGLE_UNIT_VALUE,
        address1: propertyData?.['address_info']?.['address_1'],
        address2: propertyData?.['address_info']?.['address_2'],
        city: propertyData?.['address_info']?.['city'],
        state: propertyData?.['address_info']?.['state'],
        zip: propertyData?.['address_info']?.['zip_code'] || null,
      };
      reset({ isSingle: true, single: [resetData] });
    }
  }, [opened, editData, reset]);

  const handleEditUnit = (unitDetailListItem: any) => {
    open();
    setEditData(unitDetailListItem);
  };

  const handleDeleteUnit = async (unitDetailListItem: any) => {
    dispatch(setLoading(true));
    try {
      await dispatch(deleteUnitDetails(unitDetailListItem.id) as unknown as UnknownAction);
      getUnitList();
      dispatch(setLoading(false));
    } catch (error) {
      // Handle the error here
      console.error(error);
    }
  };
  useEffect(() => {
    if (closeUnitModal) {
      close();
      setCloseUnitModal(false);
    }
  }, [closeUnitModal]);
  const progressPercent = 40;
  const radius = 27;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="flex flex-col">
      <div className="leading-7 rounded-lg font-semibold text-lg	 flex items-center justify-center text-center text-gray-900 bg-gray-50 p-2">
        Units
      </div>
      <div className="grid-cols-2 grid gap-5 mt-5">
        {/* Single Unit Details List */}
        {unitDetailList?.length > 0
          ? unitDetailList.map((unitDetailListItem: any) => (
              <div
                key={unitDetailListItem.id}
                className="border-solid h-36 m-h-36 border border-gray-300 rounded-xl grid-cols-3 grid gap-5"
              >
                <div className="col-span-1 relative">
                  <Image
                    src={getImage(unitDetailListItem?.photos?.[0])}
                    className="h-36 m-h-36 -mt-px	 rounded-l-lg"
                  />
                  {unitDetailListItem?.market_rent > 0 && (
                    <Badge
                      classNames={{
                        root: 'ms-2 mb-2 bg-white rounded-md border border-gray-300 border-solid',
                        label:
                          'text-xs font-medium	leading-11 text-gray-700 capitalize  max-w-24 whitespace-nowrap overflow-hidden text-ellipsis',
                      }}
                      variant="light"
                      className="h-3.2 absolute bottom-2 m-w-24 "
                    >
                      {`$${unitDetailListItem?.market_rent}/month`}
                    </Badge>
                  )}
                </div>
                <div className="col-span-2 py-4 pe-5 ps-0">
                  <div className="flex justify-between">
                    <div>
                      <div className="text-sm	font-semibold leading-5 text-brand-960 m-w-32  whitespace-nowrap overflow-hidden text-ellipsis">
                        {propertyData?.['name']}
                      </div>
                      <div className="text-lg	font-semibold leading-5 text-gray-900 mt-1  w-32 whitespace-nowrap overflow-hidden text-ellipsis">
                        {unitDetailListItem?.unit_info?.name}
                      </div>
                      {/* {unitDetailListItem?.amenities?.length > 0 && <div className="leading-7	font-medium	text-lg	mt-1.5">{unitDetailListItem?.amenities?.map((aminity:any, index: number) => `${aminity}${index < unitDetailListItem?.amenities?.length - 1 ? ', ' : ''}`)}</div>} */}
                    </div>
                    <div className="flex justify-end items-start gap-3">
                      <Edit01Icon
                        width={20}
                        height={20}
                        onClick={() => handleEditUnit(unitDetailListItem)}
                        className="text-gray-700 cursor-pointer  gap-2"
                      />
                      <Delete01
                        width={20}
                        height={20}
                        onClick={() => handleDeleteUnit(unitDetailListItem)}
                        className="text-gray-700 cursor-pointer gap-2 "
                      />
                    </div>
                  </div>
                  <div className="text-sm	font-normal	leading-5 text-gray-600 mt-1   w-full whitespace-nowrap overflow-hidden  text-ellipsis">
                    {`${
                      unitDetailListItem?.unit_info?.address_1
                        ? unitDetailListItem?.unit_info?.address_1
                        : unitDetailListItem?.unit_info?.address_2
                    } 
                  ${unitDetailListItem?.unit_info.zip_code ? `${unitDetailListItem?.unit_info?.zip_code}` : ''} 
                  ${unitDetailListItem?.unit_info.city}
                  ${unitDetailListItem?.unit_info?.state}`}
                  </div>
                  <div className="mt-1.5 flex items-center">
                    <div className="text-base font-semibold leading-6 text-gray-600  flex items-center me-4">
                      <HomeIcon03 className="me-0.5" />{' '}
                      <span className=" ms-2">
                        {unitDetailListItem?.bedrooms} bed, {unitDetailListItem?.bathrooms} bath
                      </span>
                    </div>
                    {unitDetailListItem?.square_feet > 0 && (
                      <div className="text-base font-semibold leading-6 text-gray-600  flex items-center">
                        {' '}
                        <Square className="me-0.5" />
                        <span className="ms-2 ">{`${unitDetailListItem?.square_feet} sqft`}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          : null}
        {/* Add Single Unit Block*/}
        {unitDetailList?.length < 4 && (
          <div
            onClick={open}
            className="border-solid border border-gray-300 rounded-xl flex items-center justify-center cursor-pointer h-36 m-h-36"
          >
            <div className="flex items-center justify-center ">
              <Home05Icon className="me-3 size-6" />
              <div className="text-brand-960 font-semibold text-lg ">Add unit</div>{' '}
              <PlusIcon01 className="ms-3 h-3.5 w-3.5 " />
            </div>
          </div>
        )}
      </div>
      <Modal
        size={'lg'}
        classNames={{
          title: 'text-brand-960 font-semibold text-lg',
          content: 'rounded-xl  modal-scroll ',
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
            <Home06Icon className="ms-6.2 mt-3 h-37.47 w-9 " />
          </div>
          <div className="p-5 pt-2">
            <div className="leading-7 font-semibold text-lg	text-gray-900">Add unit</div>
            <div className="text-sm font-normal text-gray-600 mt-2">
              Share where you’ve worked on your profile.
            </div>
            <h4 className="mt-6 leading-5 font-medium	text-sm	text-center h-9	text-gray-600 bg-gray-50 p-2">
              Unit address
            </h4>
            <form>
              {fields.map((field, index) => (
                <React.Fragment key={field.id}>
                  {fields.length > 1 && (
                    <div className="leading-5 font-medium	text-sm	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2 relative  mt-5">
                      <div className="absolute right-0 top-1 flex">
                        <ActionIcon
                          variant="transparent"
                          className="flex items-center text-black"
                          onClick={() => remove(index)}
                        >
                          <Delete01 />
                        </ActionIcon>
                      </div>
                      <span>
                        {fields.length === 1 ? 'Main unit' : `Additional unit ${fields.length - 1}`}
                      </span>
                    </div>
                  )}
                  <div className="mt-6 col-span-2">
                    <div className="grid grid-cols-5 gap-4 mt-6">
                      <CustomInput
                        label="Name*"
                        placeholder="Main"
                        {...register(`${unitType}.${index}.name`)}
                        error={errors?.single?.[index]?.name?.message}
                      />
                      <CustomInput
                        label="Address 1*"
                        placeholder="Prefilled as the property address"
                        {...register(`${unitType}.${index}.address1`)}
                        className="col-span-2"
                        error={errors?.single?.[index]?.address1?.message}
                      />
                      <CustomInput
                        label="Address 2*"
                        placeholder="Prefilled same as the unit name"
                        {...register(`${unitType}.${index}.address2`)}
                        className="col-span-2"
                        error={errors?.single?.[index]?.address2?.message}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <CustomInput
                        label="City*"
                        placeholder="Prefilled the same as property city"
                        {...register(`${unitType}.${index}.city`)}
                        error={errors?.single?.[index]?.city?.message}
                      />
                      <Select
                        classNames={{
                          option: 'h-11',
                        }}
                        label="State*"
                        placeholder="Prefilled with property state"
                        checkIconPosition="right"
                        rightSection={<ArrowDown />}
                        data={statesList}
                        {...register(`${unitType}.${index}.state`)}
                        value={state}
                        onChange={(value: string | null) => {
                          setValue(`${unitType}.${index}.state`, value ?? '');
                        }}
                        error={errors?.single?.[index]?.state?.message}
                      />
                      <CustomInput
                        label="Zip Code*"
                        type="number"
                        min="0"
                        placeholder="Prefilled with property zip"
                        {...register(`${unitType}.${index}.zip`)}
                        value={getValues(`${unitType}.${index}.zip`) || ''}
                        error={errors?.single?.[index]?.zip?.message}
                      />
                    </div>
                  </div>
                  <h4 className="mt-6 leading-5 font-medium	text-sm	text-center h-9	text-gray-600 bg-gray-50 p-2">
                    Units details
                  </h4>
                  <div className="grid grid-cols-4 gap-4 mt-5">
                    <CustomInput
                      type="number"
                      min="0"
                      label="Bedrooms*"
                      placeholder="0"
                      {...register(`${unitType}.${index}.bedrooms`)}
                      value={getValues(`${unitType}.${index}.bedrooms`) || ''}
                      error={errors?.single?.[index]?.bedrooms?.message}
                    />
                    <CustomInput
                      type="number"
                      min="0"
                      label="Bathrooms*"
                      placeholder="0"
                      {...register(`${unitType}.${index}.bathrooms`)}
                      value={getValues(`${unitType}.${index}.bathrooms`) || ''}
                      error={errors?.single?.[index]?.bathrooms?.message}
                    />
                    <CustomInput
                      type="number"
                      min="0"
                      label="Sq. feet*"
                      placeholder="0"
                      {...register(`${unitType}.${index}.sqfeet`)}
                      value={getValues(`${unitType}.${index}.sqfeet`) || ''}
                      error={errors?.single?.[index]?.sqfeet?.message}
                    />
                    <CustomInput
                      type="number"
                      min="0"
                      label="Market rent"
                      placeholder="0"
                      {...register(`${unitType}.${index}.rent`)}
                      value={getValues(`${unitType}.${index}.rent`) || ''}
                    />
                    <div className="col-span-2">
                      <TagsInput
                        value={
                          (watch('single')?.[0]?.amenities?.length &&
                            getValues('single')?.[0]?.amenities) ||
                          undefined
                        }
                        onChange={(value: string[]) => {
                          setValue(`${unitType}.${index}.amenities`, value); // Directly use value without wrapping it in another array
                        }}
                        label="Amenities"
                        className="custom-tag"
                        placeholder="Enter Amenities"
                      />
                    </div>
                    <div className="col-span-2">
                      <DescriptionWithCounter
                        title={'Description'}
                        label={'single'}
                        index={index}
                        {...register(`${unitType}.${index}.description`)}
                        methods={methods}
                      />
                    </div>

                    <h4 className="col-span-4 leading-5 font-medium	text-sm	text-center h-9	text-gray-600 bg-gray-50 p-2">
                      Units photos
                    </h4>
                    <div className="col-span-4">
                      <div className="text-sm font-medium text-gray-700 my-2">Photos</div>
                      {/* <div className="grid grid-cols-5 gap-4 mt-2"> */}
                      {/* <div className="col-span-3 flex items-center">
                          <Previews
                            watch={watch}
                            label="single"
                            index={index}
                            error={errors?.single?.[index]?.images?.message}
                          />
                        </div> */}
                      {/* <div className="col-span-2 flex items-center justify-between"> */}
                      {/* <div>
                            <div className="frame">
                              <div className="circle-small">
                                <div className="text">{progressPercent}%</div>
                                <svg>
                                  <circle className="bg" cx="34" cy="34" r={radius}></circle>
                                  <circle
                                    className="progress two"
                                    cx="34"
                                    cy="34"
                                    r={radius}
                                    style={{
                                      strokeDasharray: circumference,
                                      strokeDashoffset: offset,
                                    }}
                                  ></circle>
                                </svg>
                              </div>
                            </div>
                          </div> */}
                      <FileDropzone
                        methods={methods}
                        index={index}
                        unitType={unitType}
                        error={errors?.single?.[index]?.images?.message}
                      />
                      {/* </div> */}
                      {/* </div> */}
                    </div>
                  </div>
                </React.Fragment>
              ))}
              <div className="grid-cols-2 grid gap-5 mt-8">
                <Button
                  variant="outline"
                  onClick={close}
                  className="border-gray-300 font-semibold text-base h-11 text-gray-700 rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // close();
                    handleContinue({ ...getValues(), id: editData?.id });
                  }}
                  variant="outline"
                  className="rounded-lg h-11 hover:bg-brand-970 hover:text-white bg-brand-960 text-base text-white font-semibold ms-3"
                >
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
}
