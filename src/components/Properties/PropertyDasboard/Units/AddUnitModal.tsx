import { Button, Modal } from '@mantine/core';
import { useCounter } from '@mantine/hooks';

import { Home06Icon } from '@assets/iconComponents';
import bgPattrerens from '@assets/patterns/Background pattern decorative.svg';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import {
  addUnitDetails,
  getMultipleUnits,
  getResponseUnits,
  getUnitMixDetails,
  updateUnitDetailsUnits,
  updateUnitTable,
} from '@stores/propertySlice';
import { AddUnitDetails, Unit } from '@interfaces/property.interface';
import { UnknownAction } from '@reduxjs/toolkit';
import { isEqual } from 'lodash';
import { useState } from 'react';
import { setLoading } from '@stores/authSlice';
import { multiunitSchema } from './AddUnitModal/schema';
import { UnitTableData } from './AddUnitModal/UnitTableData';
import { UnitModalFormData } from './AddUnitModal/UnitModalFormData';

interface Props {
  addUnitModalOpen: boolean;
  setAddUnitModalOpen: (item: boolean) => void;
  property_id: string;
}

export function AddUnitModal({ addUnitModalOpen, setAddUnitModalOpen, property_id }: Props) {
  const responseUnits = useSelector(getResponseUnits);
  const unitMixDetails = useSelector(getUnitMixDetails);
  const [tableData, setTableData] = useState<Unit[]>([]);

  const [step, handlers] = useCounter(0, { min: 0, max: 2 });
  const dispatch = useDispatch();
  const methods = useForm({
    resolver: yupResolver(multiunitSchema),
  });

  const { getValues, handleSubmit } = methods;

  const onSubmit = async () => {
    dispatch(setLoading(true));

    const formData = new FormData();
    const unitModelDetailsData: { [key: string]: any } = getValues();

    Object.keys(unitModelDetailsData).forEach((key) => {
      if (key === 'photos') {
        unitModelDetailsData[key]?.forEach((photos: File) => {
          if (photos instanceof File) {
            formData.append('photos', photos);
          }
        });
      } else if (key !== 'name' && key !== 'unitsInModel') {
        formData.append(key, unitModelDetailsData[key]);
      }
    });
    formData.append('property_id', property_id);
    formData.append(
      'unit_info',
      `{"name":"${unitModelDetailsData?.name}","no_of_units":${unitModelDetailsData?.unitsInModel}}`
    );
    formData.append('unit_type', 'multiple');

    await dispatch(
      addUnitDetails(formData as unknown as AddUnitDetails) as unknown as UnknownAction
    );

    handlers?.increment();
    dispatch(setLoading(false));
    dispatch(getMultipleUnits(property_id as unknown as string) as unknown as UnknownAction);
  };

  const handleSave = async () => {
    dispatch(setLoading(true));

    // Compare responseUnits and tableData to avoid unnecessary API call
    if (isEqual(responseUnits, tableData)) {
      dispatch(updateUnitDetailsUnits([...unitMixDetails, responseUnits]));
      return;
    }

    // Proceed with API call if changes are detected
    await dispatch(updateUnitTable(tableData as unknown as Unit[]) as unknown as UnknownAction);
    dispatch(updateUnitDetailsUnits([...unitMixDetails, { ...responseUnits, units: tableData }]));

    dispatch(setLoading(false));
  };

  return (
    <Modal
      size={`${step === 1 ? 'xl' : 'lg'}`}
      className="modalElement1"
      classNames={{
        title: 'text-brand-960 font-semibold text-lg',
        content: 'rounded-[12px] modal-scroll ',
        header: 'w-24 float-right bg-transparent',
        body: 'p-0 ',
        close: 'text-gray-400',
      }}
      opened={addUnitModalOpen}
      onClose={() => {
        setAddUnitModalOpen(false);
        handlers.set(0);
      }}
    >
      <div>
        <div className="bg-cover w-full my-3 relative  ">
          <img src={bgPattrerens.toString()} alt="circle-bg" className="circleImg -z-10" />
          <Home06Icon className="ms-6.2 mt-3 h-37.47 w-9" />
        </div>
        <div className="p-5 pt-2">
          <div className="leading-7 font-semibold text-lg text-gray-900 ">Add unit model</div>
          <div className="text-sm font-normal text-gray-600 mt-2">
            Share where you’ve worked on your profile.
          </div>
          <form>
            {step === 0 && <UnitModalFormData methods={methods} />}
            {step === 1 && <UnitTableData tableData={tableData} setTableData={setTableData} />}
            <div className="grid-cols-2 grid gap-5 mt-10">
              <Button
                variant="outline"
                onClick={() => {
                  if (step > 0) {
                    handlers?.decrement();
                  } else {
                    handlers.set(0);
                    setAddUnitModalOpen(false);
                  }
                }}
                className="border-gray-300 font-semibold text-base h-11 text-gray-700 rounded-[8px]"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (step > 0) {
                    handleSave();
                    handlers.set(0);
                    setAddUnitModalOpen(false);
                  } else {
                    handleSubmit(onSubmit)();
                  }
                }}
                variant="outline"
                className="rounded-[8px] h-11 hover:bg-brand-970 hover:text-white bg-brand-960 text-base text-white font-semibold ms-3"
              >
                {step > 0 ? 'Save' : 'Continue'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
