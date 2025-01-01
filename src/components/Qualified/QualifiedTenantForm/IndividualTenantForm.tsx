import { ArrowDown, EmailIcon02 } from '@assets/iconComponents';
import { Checkbox, Select } from '@mantine/core';
import CustomInput from '@utils/CustomInput';
import clsx from 'clsx';
import React, { useState } from 'react';
import { AddNewTenantUnitModel } from './AddNewTenantUnitModel';
import { AddTenantModel } from './AddTenantModel';

const IndividualTenantForm = () => {
  const [conTenantCheck, setConTenantCheck] = useState(true);
  const [occupantCheck, setOccupantCheck] = useState(false);
  const [isSaveLoginDetails, setIsSaveLoginDetails] = useState(false);
  const [openUnitModel, setOpenUnitModel] = useState<boolean>(false);
  const [openTenantModel, setOpenTenantModel] = useState<boolean>(false);

  const handleOpenUnitModal = () => {
    setOpenUnitModel(true);
  };
  const handleOpenTenantModal = () => {
    setOpenTenantModel(true);
  };
  return (
    <>
      <div className="mt-4">
        <fieldset className="grid-cols-2 grid gap-5">
          <Select
            classNames={{
              option: 'mb-0.5 rounded-[8px]',
              dropdown: 'rounded-[8px] drop-shadow-lg shadow-lg',
            }}
            label="Property"
            placeholder="Select"
            checkIconPosition="right"
            comboboxProps={{ dropdownPadding: 0 }}
            value="Withstone apartments"
            rightSection={<ArrowDown />}
            data={['Withstone apartments', 'Withstone apartments2', 'Withstone apartments3']}
          />
          <Select
            classNames={{
              option: 'mb-0.5 rounded-[8px]',
              dropdown: 'rounded-[8px] drop-shadow-lg shadow-lg',
              // wrapper: 'focus:shadow-ring-brand-shadow-lg border-gray-300 focus:border-brand-300',
            }}
            label="Unit"
            placeholder="Select"
            checkIconPosition="right"
            comboboxProps={{ dropdownPadding: 0 }}
            rightSection={<ArrowDown />}
            data={[
              { value: '101', label: '101' },
              { value: '102', label: '102' },
              { value: '103', label: '103' },
              { value: 'add-new', label: '+ Add New' },
            ]}
            value={'101'}
            onChange={(value) => {
              if (value === 'add-new') {
                handleOpenUnitModal();
              }
            }}
          />
        </fieldset>
        <div className="mt-4">
          <Select
            classNames={{
              option: 'mb-0.5 rounded-[8px]',
              dropdown: 'rounded-[8px] drop-shadow-lg shadow-lg',
            }}
            label="Tenant"
            placeholder="Select"
            checkIconPosition="right"
            comboboxProps={{ dropdownPadding: 0 }}
            rightSection={<ArrowDown />}
            data={[
              { value: 'Phoenix Baker', label: 'Phoenix Baker' },
              { value: 'Olivia Rhye', label: 'Olivia Rhye' },
              { value: 'Lana Steiner', label: 'Lana Steiner' },
              { value: 'add-new', label: '+ Add New' },
            ]}
            value={'Phoenix Baker'}
            onChange={(value) => {
              if (value === 'add-new') {
                handleOpenTenantModal();
              }
            }}
          />
        </div>
        <fieldset className="grid grid-cols-2 gap-5 mt-4">
          <CustomInput
            leftSection={<EmailIcon02 className="size-5" />}
            label="Email address"
            placeholder="Enter email address"
            value="olivia@untitledui.com"
            disabled
          />
          <CustomInput
            label="Phone number"
            placeholder="Enter phone number"
            value="000-000-0000"
            disabled
          />
        </fieldset>
        <div className="grid gap-5 mt-4">
          <div className="flex  gap-3">
            <Checkbox
              checked={conTenantCheck}
              onClick={() => setConTenantCheck(!conTenantCheck)}
              classNames={{
                label: 'text-gray-700 font-medium	text-base	',
                body: 'items-center',
                input: clsx('!rounded-[6px]', conTenantCheck && '!bg-brand-970 !border-brand-970'),
              }}
              className="mt-1"
            />
            <div>
              <div className="text-Gray-700 text-base font-medium">
                Tenant is reseding more than 3 months on the property
              </div>
              <div className="mt-0.5 text-Gray-600 text-base font-normal">
                Save my login details for next time.{' '}
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
                input: clsx('!rounded-[6px]', occupantCheck && '!bg-brand-970 !border-brand-970'),
              }}
              className="mt-1"
            />
            <div>
              <div className="text-Gray-700 text-base font-medium">
                No late payment in the last 12 months
              </div>
              <div className="mt-0.5 text-Gray-600 text-base font-normal">
                Save my login details for next time.
              </div>
            </div>
          </div>
          <div className="flex  gap-3">
            <Checkbox
              checked={isSaveLoginDetails}
              onClick={() => setIsSaveLoginDetails(!isSaveLoginDetails)}
              classNames={{
                label: 'text-gray-700 font-medium	text-base	',
                body: 'items-center',
                input: clsx(
                  '!rounded-[6px]',
                  isSaveLoginDetails && '!bg-brand-970 !border-brand-970'
                ),
              }}
              className="mt-1"
            />
            <div>
              <div className="text-Gray-700 text-base font-medium">
                No eviction in the past 5 years
              </div>
              <div className="mt-0.5 text-Gray-600 text-base font-normal">
                Save my login details for next time.
              </div>
            </div>
          </div>
        </div>
      </div>
      {openUnitModel && (
        <AddNewTenantUnitModel
          addUnitTenantModalOpen={openUnitModel}
          setAddUnitTenantModalOpen={setOpenUnitModel}
        />
      )}
      {openTenantModel && (
        <AddTenantModel
          addTenantModalOpen={openTenantModel}
          setAddTenantModalOpen={setOpenTenantModel}
        />
      )}
    </>
  );
};

export default IndividualTenantForm;
