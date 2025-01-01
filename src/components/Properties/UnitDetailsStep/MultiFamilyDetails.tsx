import React, { useEffect, useState } from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { CrossedTitle } from '@components/CrossedTitle';
import { CustomInput } from '@utils/CustomInput';
import {
  ActionIcon,
  Button,
  Checkbox,
  Modal,
  RingProgress,
  Select,
  TagsInput,
  Image,
  Badge,
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
import bgPattrerens from '@assets/patterns/Background pattern decorative.svg';
import single from '@assets/img/single.svg';
import { deleteUnitDetails, selectApiData } from '@stores/propertySlice';
import { UnknownAction } from '@reduxjs/toolkit';
import { FileDropzone, } from './FileDropzone';
import { UnitDetailsForm } from './schemas';
import { DescriptionWithCounter } from '../PropertyDetailsStep/DescriptionWithCounter';
import { setLoading } from '@stores/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { MULTI_UNIT_VALUE } from '@constants/multiUnit.constants';

interface Props {
  methods: UseFormReturn<UnitDetailsForm>;
  handleContinue: (values: any) => void;
  unitDetailList: any;
  getUnitList: () => void;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  closeUnitModal: boolean;
  setCloseUnitModal: (values: boolean) => void;
}
export function MultiFamilyDetails({
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
  const [isParking, { toggle }] = useDisclosure();
  const dispatch = useDispatch();
  const [opened, { open, close }] = useDisclosure(false);
  const [editData, setEditData] = useState<any>();

  const unitType = 'multiple';
  const {
    register,
    control,
    formState: { errors },
    getValues,
    setValue,
    formState: { isValid },
    watch,
    reset,
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: `multiple`,
  });

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
      dispatch(setLoading(false));
    }
  };
  const getImage = (imagePath: string) => {
    return imagePath ? baseUrl + imagePath : single;
  };

  useEffect(() => {
    if (opened && editData) {
      setIsEdit(true);
      setValue('multiple', [
        {
          id: editData?.id,
          name: editData?.unit_info?.name,
          unitsInModel: editData?.unit_info?.no_of_units,
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
      reset({ isSingle: false, multiple: [MULTI_UNIT_VALUE] });
    }
  }, [opened, editData, reset]);

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
        Unit models
      </div>
      <div className="grid-cols-2 grid gap-5 mt-5">
        {/* multiple Unit Details List */}
        {unitDetailList?.length > 0
          ? unitDetailList.map((unitDetailListItem: any, index: number) => (
              <div key={index} className="h-36 m-h-36 border-solid border border-gray-300 rounded-xl h-35 m-h-35 grid-cols-3 grid gap-5">
                <div className="col-span-1 relative">
                  <Image
                    src={getImage(unitDetailListItem?.photos?.[0])}
                    className="h-36 m-h-36 -mt-px rounded-l-lg"
                  />
                 <Badge
                    classNames={{
                      root: 'ms-2 bg-white rounded-md border border-gray-300 border-solid',
                      label: 'text-xs font-medium	leading-11 text-gray-700 capitalize',
                    }}
                    variant="light"
                    className="h-3.2 absolute bottom-2 m-w-24"
                  >
                    {`$${unitDetailListItem?.market_rent}/month`}
                  </Badge>
                </div>
                <div className="col-span-2 py-4  ps-0">
                  <div className="flex justify-between">
                    <div>
                      <div className="text-sm	font-semibold leading-5 text-brand-960">
                        {propertyData?.['name']}
                      </div>
                      <div className="leading-7	font-medium	text-lg text-gray-900  m-w-32 whitespace-nowrap overflow-hidden text-ellipsis">{`${unitDetailListItem?.unit_info?.name}`}</div>
                    </div>
                    <div className="flex justify-between pe-4 ">
                      <Edit01Icon
                        width={20}
                        height={20}
                        onClick={() => handleEditUnit(unitDetailListItem)}
                        className="text-gray-700 cursor-pointer me-3"
                      />
                      <Delete01
                        width={20}
                        height={20}
                        onClick={() => handleDeleteUnit(unitDetailListItem)}
                        className="text-gray-700 cursor-pointer "
                      />
                    </div>
                  </div>
                  <div className="leading-7	font-bold	text-lg	text-brand-970">
                    {`${unitDetailListItem?.unit_info?.no_of_units}`} units
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
        {/* Add multiple Unit Block*/}
        { unitDetailList?.length < 4 &&
        <div
          onClick={() => {
            open();
            setEditData(undefined);
          }}
          className="border-solid border border-gray-300 rounded-xl flex items-center justify-center cursor-pointer h-36 "
        >
          <div className="flex items-center justify-center ">
            <Home05Icon className="me-3 size-6" />
            <div className="text-brand-960 font-semibold text-lg">Add model</div>{' '}
            <PlusIcon01 className="ms-3 h-3.5 w-3.5 " />
          </div>
        </div>
}
      </div>
      <Modal
        size={'lg'}
        classNames={{
          title: 'text-brand-960 font-semibold text-lg',
          content: 'rounded-xl modal-scroll ',
          header: 'w-24 float-right bg-transparent',
          body: 'p-0 ',
          close: 'text-gray-400',
        }}
        opened={opened}
        onClose={close}
      >
        <div>
          <div className="bg-cover w-full my-3 relative  ">
            <img src={bgPattrerens.toString()} alt="circle-bg" className="circleImg -z-10" />
            <Home06Icon className="ms-6.2 mt-3 h-37.47 w-9" />
          </div>
          <div className="p-5 pt-2">
            <div className="leading-7 font-semibold text-lg	 text-gray-900 ">Add unit model</div>
            <div className="text-sm font-normal text-gray-600 mt-2">
              Share where you’ve worked on your profile.
            </div>
            <form>
              {fields.map((field, index) => (
                <React.Fragment key={field.id}>
                  <div className="grid grid-cols-2 gap-4 mt-5">
                    <CustomInput
                      label="Name*"
                      placeholder="Enter model name"
                      {...register(`${unitType}.${index}.name`)}
                      error={errors?.multiple?.[index]?.name?.message}
                      disabled = {editData}
                    />
                    <CustomInput
                      label="Units in this model*"
                      placeholder="0"
                      type="number"  min="0"
                      {...register(`${unitType}.${index}.unitsInModel`)}
                      value={getValues(`${unitType}.${index}.unitsInModel`) || ''}
                      error={errors?.multiple?.[index]?.unitsInModel?.message}
                      disabled = {editData}
                    />
                  </div>
                  <h4 className="mt-6 leading-5 font-medium	text-sm text-center h-9	text-gray-600 bg-gray-50 p-2">
                    Model details
                  </h4>
                  <div className="grid grid-cols-4 gap-4 mt-5">
                    <CustomInput
                      type="number"  min="0"
                      label="Bedrooms*"
                      placeholder="0"
                      {...register(`${unitType}.${index}.bedrooms`)}
                      value={getValues(`${unitType}.${index}.bedrooms`) || ''}
                      error={errors?.multiple?.[index]?.bedrooms?.message}
                    />
                    <CustomInput
                      type="number"  min="0"
                      label="Bathrooms*"
                      placeholder="0"
                      {...register(`${unitType}.${index}.bathrooms`)}
                      value={getValues(`${unitType}.${index}.bathrooms`) || ''}
                      error={errors?.multiple?.[index]?.bathrooms?.message}
                    />
                    <CustomInput
                      type="number"  min="0"
                      label="Sq. feet*"
                      placeholder="0"
                      {...register(`${unitType}.${index}.sqfeet`)}
                      value={getValues(`${unitType}.${index}.sqfeet`) || ''}
                      error={errors?.multiple?.[index]?.sqfeet?.message}
                    />
                    <CustomInput
                      type="number"  min="0"
                      label="Market rent"
                      placeholder="0"
                      {...register(`${unitType}.${index}.rent`)}
                      value={getValues(`${unitType}.${index}.rent`) || ''}
                    />
                    <div className="col-span-2">
                      <TagsInput
                        value={
                          (watch('multiple')?.[0]?.amenities?.length &&
                            getValues('multiple')?.[0]?.amenities) ||
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
                        label={'multiple'}
                        index={index}
                        {...register(`${unitType}.${index}.description`)}
                        methods={methods}
                      />
                    </div>

                    <h4 className="col-span-4 leading-5 font-medium	text-sm text-center h-9	text-gray-600 bg-gray-50 p-2">
                      Model photos
                    </h4>
                    <div className="col-span-4">
                      <div className="leading-5 font-medium	text-sm text-gray-700 my-2">Photos</div>
                      {/* <div className="grid grid-cols-5 gap-4 mt-2">
                        <div className="col-span-3 flex items-center">
                          <Previews
                            watch={watch}
                            label="multiple"
                            index={index}
                            error={errors?.multiple?.[index]?.images?.message}
                          />
                        </div>
                        <div className="col-span-2 flex items-center justify-between">
                          <div>
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
                          <FileDropzone methods={methods} index={index} unitType={unitType}  error={errors?.multiple?.[index]?.images?.message} />
                        {/* </div>
                      </div> */}
                    </div>
                  </div>
                </React.Fragment>
              ))}
              <div className="grid-cols-2 grid gap-5 mt-10">
                <Button
                  variant="outline"
                  onClick={close}
                  className="border-gray-300 font-semibold text-base h-11 text-gray-700 rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
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
