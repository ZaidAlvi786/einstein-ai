import { Switch } from '@mantine/core';
import { UseFormReturn } from 'react-hook-form';
import {
  addTempIndividualOwnerDetails,
  addTempOwnerDetails,
  getOwnerDeatils,
  updateTempToOwnerDetails,
} from '@stores/propertySlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { CompanyOwnerFieldset } from './CompanyOwnerFieldset';
import { PropertyContactsForm } from '../PropertyDetailsStep/schemas';
import { IndividualOwnerFieldset } from './IndividualOwnerFieldset';

interface Props {
  methods: UseFormReturn<PropertyContactsForm>;
  name: 'owner' | 'manager';
  handleContinue: () => void;
}

export function OwnershipContactFields({ methods, name, handleContinue }: Props) {
  const ownerDetails = useSelector(getOwnerDeatils);
  const dispatch = useDispatch();
  const { watch, setValue } = methods;
  const isCompany = watch(`${'company'}`);

  useEffect(
    () => () => {
      dispatch(addTempOwnerDetails([]));
      dispatch(addTempIndividualOwnerDetails([]));
    },
    []
  );

  return (
    <>
      <div className="text-lg rounded-lg leading-7 font-semibold flex items-center justify-center text-center text-gray-900 bg-gray-50 p-2">
        Property owner
      </div>
      <div className="w-9">
        <Switch
          onChange={() => {
            isCompany
              ? dispatch(addTempOwnerDetails(ownerDetails))
              : dispatch(addTempIndividualOwnerDetails(ownerDetails));

            dispatch(updateTempToOwnerDetails(isCompany));

            setValue('company', !isCompany);
          }}
          checked={isCompany}
          classNames={{ track: 'h-5', label: 'text-sm leading-5 font-medium' }}
          label="Company"
        />
      </div>
      {isCompany && (
        <CompanyOwnerFieldset methods={methods} name={name} handleContinue={handleContinue} />
      )}
      {!isCompany && <IndividualOwnerFieldset />}
    </>
  );
}
