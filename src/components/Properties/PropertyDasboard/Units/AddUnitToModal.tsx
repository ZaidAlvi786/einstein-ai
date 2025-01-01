import { Button, Modal, Select, TagsInput } from '@mantine/core';
import CustomInput from '@utils/CustomInput';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AlertCircleIcon, ArrowDown, Home06Icon } from '@assets/iconComponents';
import bgPattrerens from '@assets/patterns/Background pattern decorative.svg';
import { statesList } from '@constants/app.constant';
import { DescriptionWithCounter } from '@components/Properties/PropertyDetailsStep/DescriptionWithCounter';
import { addUnitToModelDetails, getMultipleUnits, getResponseUnits, getUnitMixDetails, selectApiData } from '@stores/propertySlice';
import { UnknownAction } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@stores/authSlice';
import { unitToModalFormSchema } from './AddUnitModal/schema';
import { FileDropzone } from './AddUnitModal/FileDropzone';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

interface Props {
  addUnitOpen: boolean;
  setAddUnitOpen: (item: boolean) => void;
  unit_model_id: string;
}

const AddUnitToModal = ({ addUnitOpen, setAddUnitOpen, unit_model_id }: Props) => {
  const dispatch = useDispatch();
  const propertyData = useSelector(selectApiData);

  const { id } = useParams<{ id: string }>();
  const methods = useForm({
    resolver: yupResolver(unitToModalFormSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    clearErrors,
    reset,
    watch,
  } = methods;

  useEffect(() => {
    const resetData = {
      address1: propertyData?.address_info?.address_1 || '',
      address2: propertyData?.address_info?.address_2 || '',
      city: propertyData?.address_info?.city || '',
      state: propertyData?.address_info?.state || '',
      zip_code: propertyData?.address_info?.zip_code ||'', 
    };
    reset({ ...resetData });
  }, []);

  const amenities = (watch('amenities')?.length && watch('amenities')) || undefined;
  const state = watch('state') || '';


  // onSubmit handler
  const onSubmit = async () => {
    dispatch(setLoading(true));
    const formData = new FormData();
    const unitDetailsData: { [key: string]: any } = getValues();
    const params = {
      unit_model_id,
      name: unitDetailsData.name,
      address1: unitDetailsData.address1,
      address2: unitDetailsData.address2,
      city: unitDetailsData.city,
      state: unitDetailsData.state,
      zip_code: unitDetailsData.zip_code,
      market_rent: unitDetailsData.market_rent,
      description: unitDetailsData.description,
    };

    Object.keys(unitDetailsData).forEach((key) => {
      if (key === 'photos') {
        unitDetailsData[key]?.forEach((photos: File) => {
          if (photos instanceof File) {
            formData.append('photos', photos);
          }
        });
      } else if (key === 'amenities') formData.append('amenities', unitDetailsData[key]);
    });

    await dispatch(
      addUnitToModelDetails({ params, formData } as unknown as any) as unknown as UnknownAction
    );
    dispatch(getMultipleUnits(id as unknown as string) as unknown as UnknownAction);

    setAddUnitOpen(false);
    dispatch(setLoading(false));
  };

  return (
    <Modal
      size="lg"
      className="modalElement1"
      classNames={{
        title: 'text-brand-960 font-semibold text-lg',
        content: 'rounded-[12px]  modal-scroll ',
        header: 'w-24 float-right bg-transparent',
        body: 'p-0',
        close: 'text-gray-400',
      }}
      opened={addUnitOpen}
      onClose={() => {
        setAddUnitOpen(false);
      }}
    >
      <div>
        <div className="bg-cover w-full my-3 relative">
          <img src={bgPattrerens.toString()} alt="circle-bg" className="circleImg -z-10" />
          <Home06Icon className="ms-6.2 mt-3 h-37.47 w-9 " />
        </div>
        <div className="p-5 pt-2">
          <div className="leading-7 font-semibold text-lg text-gray-900">Add unit to model</div>

          <h4 className="mt-6 leading-5 font-medium text-sm text-center h-9 text-gray-600 bg-gray-50 p-2">
            Unit address
          </h4>
          <form onSubmit={handleSubmit(onSubmit)}>
            <>
              <div className="mt-6 col-span-2">
                <div className="grid grid-cols-5 gap-4 mt-6">
                  <CustomInput
                    label="Name*"
                    placeholder="Main"
                    error={errors.name?.message}
                    {...register('name')}
                  />
                  <CustomInput
                    label="Address 1*"
                    placeholder="Prefilled as the property address"
                    className="col-span-2"
                    error={errors.address1?.message}
                    {...register('address1')}
                  />
                  <CustomInput
                    label="Address 2"
                    placeholder="Prefilled same as the unit name"
                    className="col-span-2"
                    {...register('address2')}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <CustomInput
                    label="City*"
                    placeholder="Prefilled the same as property city"
                    error={errors.city?.message}
                    {...register('city')}
                  />
                  <Select
                    className="inner-Drop-Down"
                    classNames={{ option: 'h-11' }}
                    label="State*"
                    placeholder="Prefilled with property state"
                    rightSection={<ArrowDown />}
                    data={statesList}
                    value={state}
                    error={errors.state?.message}
                    {...register('state')}
                    onChange={(value: string | null) => {
                      setValue('state', value || '');
                    }}
                  />
                  <CustomInput
                    label="ZIP Code*"
                    type="number"
                    min="0"
                    placeholder="Prefilled with property zip"
                    {...register('zip_code')} 
                    value={getValues('zip_code') || ''}
                    error={errors.zip_code?.message}
                  />
                </div>
              </div>
              <h4 className="mt-6 leading-5 font-medium text-sm text-center h-9 text-gray-600 bg-gray-50 p-2">
                Unit details
              </h4>
              <div className="grid grid-cols-4 gap-4 mt-5">
                <CustomInput
                  type="number"
                  min="0"
                  label="Market rent"
                  placeholder="0"
                  {...register('market_rent')}
                />
                <div className="col-span-2">
                  <TagsInput
                    value={amenities}
                    onChange={(value: string[]) => {
                      setValue('amenities', value); // Set value and clear errors
                      clearErrors('amenities');
                    }}
                    rightSection={
                      errors.amenities ? <AlertCircleIcon className="size-4 text-error-500" /> : ''
                    }
                    label="Amenities"
                    className="custom-tag"
                    placeholder="Enter Amenities"
                    error={errors.amenities?.message} // Error message for 'amenities'
                  />
                </div>
                <div className="col-span-2">
                  <DescriptionWithCounter
                    title="Description"
                    label="single"
                    index={2}
                    methods={methods}
                  />
                </div>

                <h4 className="col-span-4 leading-5 font-medium text-sm text-center h-9 text-gray-600 bg-gray-50 p-2">
                  Units photos
                </h4>
                <div className="col-span-4">
                  <div className="text-sm font-medium text-gray-700 my-2">Photos</div>

                  <FileDropzone
                    methods={methods}
                    index={2}
                    unitType="single"
                    error={errors.photos?.message}
                  />
                </div>
              </div>
            </>
            <div className="grid-cols-2 grid gap-5 mt-8">
              <Button
                variant="outline"
                onClick={() => {
                  reset();
                  setAddUnitOpen(false);
                }}
                className="border-gray-300 font-semibold text-base h-11 text-gray-700 rounded-[8px]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="outline"
                className="rounded-[8px] h-11 hover:bg-brand-970 hover:text-white bg-brand-960 text-base text-white font-semibold ms-3"
              >
                Save
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AddUnitToModal;
