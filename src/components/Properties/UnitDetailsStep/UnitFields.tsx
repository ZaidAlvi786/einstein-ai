import { Checkbox } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SINGLE_UNIT_VALUE } from '@constants/singleUnit.constants';
import { MULTI_UNIT_VALUE } from '@constants/multiUnit.constants';
import { useEffect, useState } from 'react';
import { Home03Icon, Building05Icon, Users03Icon } from '@assets/iconComponents';
import clsx from 'clsx';
import { CustomTittle } from '@components/CustomTitte';
import { AddUnitDetails, EditUnitDetailsArgs } from '@interfaces/property.interface';
import { UnknownAction } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { addUnitDetails, editUnitDetails, getUnitDetailsListByProperty, selectApiData } from '@stores/propertySlice';
import { setLoading } from '@stores/authSlice';
import { unitDetailsSchema } from './schemas';
import { MultiFamilyDetails } from './MultiFamilyDetails';
import { StepButtons } from '../StepButtons';
import { SingleFamilyDetails } from './SingleFamilyDetails';
import { useNavigate } from 'react-router-dom';
import { APP_PATHS } from '@routes/app-paths';

const initialValues = {
  isSingle: true,
  single: [SINGLE_UNIT_VALUE],
  multiple: [MULTI_UNIT_VALUE],
};

interface Props {
  step: number;
  handlers: {
    increment: () => void;
    decrement: () => void;
  };
}

export function UnitFields({ step, handlers }: Props) {
  const navigate = useNavigate();

  const propertyData = useSelector(selectApiData);
  const [checked, setChecked] = useState(false);
  const [unitDetailList, setUnitDetailList] = useState<any[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const dispatch = useDispatch();

  const [closeUnitModal, setCloseUnitModal] = useState(false);
  const methods = useForm({
    resolver: yupResolver<any>(unitDetailsSchema),
    defaultValues: initialValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    getValues,
    setValue,

  } = methods;

  const getUnitList = async () => {
    // Get Unit list
    dispatch(setLoading(true));
    let property_id = (propertyData as unknown as { id?: string })?.id ?? '';

    const result = await dispatch(
      getUnitDetailsListByProperty(property_id) as unknown as UnknownAction
    ) as any;
    if (result?.payload !== undefined) {
      setUnitDetailList(result?.payload);
    }
    dispatch(setLoading(false));

  };

  useEffect(() => {
    getUnitList();
  }, []);

  const onSubmit = async(values: any) => {    
    const  unit_type = isSingle ? 'single' : 'multiple'
    const unitDetails = values?.[unit_type]?.[0];
    const formData = new FormData();

    let id = (propertyData as unknown as { id?: string })?.id ?? '';
    unitDetails.property_id = id;
    
    const payload = {
      photos: unitDetails?.images,
      property_id: id,
      bedrooms: Number(unitDetails.bedrooms),
      bathrooms: Number(unitDetails.bathrooms),
      square_feet: Number(unitDetails.sqfeet),
      market_rent: Number(unitDetails.rent),
      description: unitDetails.description || '',
      amenities: unitDetails.amenities,
      unit_type: isSingle ? 'single' : 'multiple',
      unit_info: 
        isSingle ? {
          name: unitDetails.name, 
          address_1: unitDetails.address1,
          address_2: unitDetails.address2, 
          city: unitDetails.city, 
          state: unitDetails.state, 
          zip_code: unitDetails.zip,
        } : {
          name: unitDetails.name, 
          no_of_units: unitDetails.unitsInModel
        }
      ,
    } as any

    Object.keys(payload).forEach((key) => {
      if (key === 'photos') {
        payload[key]?.forEach((file: File) => {
          if (file instanceof File) {
            formData.append('photos', file);
          }
        });
      } else if (key === 'unit_info') {
        formData.append(key, JSON.stringify(payload[key]));
      } else {
        formData.append(key, payload[key]);
      }
    });

    try {
      dispatch(setLoading(true));
      if (isEdit) {
        const editPayload = {
          id: unitDetails?.id,
          userData: formData,
        }
        const result = await dispatch(
          editUnitDetails(editPayload as unknown as EditUnitDetailsArgs) as unknown as UnknownAction
        );
        if (result?.payload !== undefined) {
          dispatch(setLoading(false));
          setCloseUnitModal(true);
          getUnitList();
          // handlers.increment();
        }
      } else {
        const result = await dispatch(
          addUnitDetails(formData as unknown as AddUnitDetails) as unknown as UnknownAction
        );
        if (result?.payload !== undefined) {
          dispatch(setLoading(false));
          // handlers.increment();
          setUnitDetailList([...unitDetailList, {...result?.payload}])
          setCloseUnitModal(true);
        }
      }
    } catch (error) {
      console.log({error});
      dispatch(setLoading(false));
    }
    dispatch(setLoading(false));

    if (!isValid) return;
    // handlers.increment();
  };

  const handleContinue = async () => {   
    await handleSubmit(onSubmit)();
    
  };

  const handleExit = async() => {
    // await handleSubmit(onSubmit)();
    navigate(APP_PATHS.properties.get());

  };
  const isSingle = watch(`isSingle`);
  
  return (
    <>
      <div className="flex flex-col">
        <div className="p-6">
        <CustomTittle heading="Unit Details" />
          <div className="grid grid-cols-2 gap-5 my-6">
            <div
              onClick={() => setValue(`isSingle`, !isSingle)}
              className={clsx(
                'h-28 border border-solid border-gray-960 rounded-lg p-3 cursor-pointer',
                isSingle && '!border-brand-970 border-2'
              )}
            >
              <div className="flex justify-end">
                <Checkbox
                  checked={isSingle}
                  classNames={{
                    label: 'text-gray-700 font-medium	text-base	',
                    body: 'items-center',
                    input: clsx('!rounded-md', isSingle && '!bg-brand-970 !border-brand-970'),
                  }}
                />
              </div>
              <div className="flex justify-center">
                <Home03Icon className='w-10	h-37.5 mt-1' />
                <div className="ms-3">
                  <div className="text-gray-600 leading-7 font-semibold text-lg">Single family</div>
                  <div className="text-gray-600 leading-5 font-medium	text-sm">Up to 4 units</div>
                </div>
              </div>
            </div>
            <div
              onClick={() => setValue(`isSingle`, !isSingle)}
              className={clsx(
                'h-28 border border-solid border-gray-960 rounded-lg p-3 cursor-pointer',
                !isSingle && '!border-brand-970 border-2'
              )}
            >
              <div className="flex justify-end">
                <Checkbox
                  checked={!isSingle}
                  classNames={{
                    label: 'text-gray-700 font-medium	text-base	',
                    body: 'items-center',
                    input: clsx('!rounded-md', !isSingle && '!bg-brand-970 !border-brand-970'),
                  }}
                />
              </div>
              <div className="flex justify-center">
                <Building05Icon className='w-10	h-9 mt-1' />
                <div className="ms-3">
                  <div className="text-gray-600 leading-7 font-semibold text-lg	">Multi family</div>
                  <div className="text-gray-600 leading-5 font-medium	text-sm">4 units and more</div>
                </div>
              </div>
            </div>
          </div>
          {isSingle && 
            <SingleFamilyDetails 
              methods={methods} 
              handleContinue={handleContinue} 
              unitDetailList={unitDetailList.filter((item: any) => item?.unit_type === 'single')}
              getUnitList={getUnitList}
              setIsEdit={setIsEdit}
              closeUnitModal = {closeUnitModal}
              setCloseUnitModal= {setCloseUnitModal}
            />
          }
          {!isSingle && 
            <MultiFamilyDetails 
              methods={methods} 
              handleContinue={handleContinue} 
              unitDetailList={unitDetailList.filter((item: any) => item?.unit_type === 'multiple')} 
              getUnitList={getUnitList}
              setIsEdit={setIsEdit}
              closeUnitModal = {closeUnitModal}
              setCloseUnitModal= {setCloseUnitModal}
            />
          }
        </div>
        <StepButtons
          step={step}
          handlers={handlers}
          onContinue={handlers.increment}
          onExit={handleExit}
        />
      </div>
    </>
  );
}
