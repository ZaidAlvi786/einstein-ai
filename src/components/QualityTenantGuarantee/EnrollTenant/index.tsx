import React, { useState } from 'react';
import Steps from './EnrollStepper';
import { useCounter } from '@mantine/hooks';
import { GuaranteedMonthlyRent } from '@components/Properties/PropertyDasboard/GuaranteedMonthlyRent';
import { TaskActivity } from '@shared/components/TaskActivity';
import UnitDetail from '@components/Properties/Tenant/UnitDetail';
import TenantCoTenant from '@components/Properties/Tenant/SideBar/TenantCoTenant';
import { ITabPaneProps, Tabs } from '@shared/components/tabs';
import EnrollIndividual from './EnrollIndividual';
import EnrollBulk from './EnrollBulk';
import StepButtons from './StepButtons';
import EnrollTenantTabs from './EnrollTenantTabs';
import TenantIdentification from './TenantIdentification';
import PrimaryTenantIdentification from './PrimaryTenantIdentification';
import EnrollIncomeProof from './EnrollIncomeProof';
import EnrollLastStep from './EnrollLastStep';
import EnrollTenantGuarantee from './EnrollTenantGuarantee';
import QualityTenantSidebar from './QualityTenantSidebar';
import { useNavigate } from 'react-router-dom';
import { APP_PATHS } from '@routes/app-paths';

const EnrollTenant = () => {
  const navigate = useNavigate();
  const [step, handlers] = useCounter(1, { min: 1, max: 5 });
  const [selectedTenant, setSelectedTenant] = useState('');
  const handleSelectedTenant = (value: string) => {
    setSelectedTenant(value);
  };

  const panes: ITabPaneProps[] = [
    {
      title: 'Individual',
      key: 'Individual',
      component:
        selectedTenant === 'Individual Tenant' ? (
          <TenantIdentification />
        ) : selectedTenant === 'Co Tenant' ? (
          <PrimaryTenantIdentification />
        ) : (
          <EnrollIndividual
            selectedTenant={selectedTenant}
            onChange={(value) => handleSelectedTenant(value)}
          />
        ),
    },
    {
      title: 'Bulk',
      key: 'Bulk',
      component: null,
      // component: <EnrollBulk />
    },
  ];

  const handleContinue = () => {
    if (step > 2) {
      // Reset to the first step
      handlers.set(1); // Set to 1 instead of 0 to align with your min/max settings
    } else {
      // Proceed to the next step
      handlers.increment();
    }
  };
  const handleBack = () => {
    if (step === 1) {
      navigate(APP_PATHS.qualityTenant.get());
    } else handlers.decrement();
  };

  const handleDone = () => {
    if (step > 2) {
      navigate(APP_PATHS.qualityTenant.get());
    } else {
      // Proceed to the next step
      handlers.increment();
    }
  };

  return (
    <div className="p-6 grid grid-cols-7">
      <div className="col-span-5 bg-Gray-50 px-8 pt-6 pb-8">
        <div className="flex flex-col gap-2">
          <div className="text-Gray-900 text-3xl font-semibold">QTG enrollment</div>
          <div className="text-base font-normal text-Gray-600">
            Update your photo and personal details here.
          </div>
        </div>
        <div className="my-10 mx-20">
          <Steps step={step - 1} />
        </div>
        <div className="border-solid border-[1px] border-Gray-200 rounded-[12px] bg-white mx-9 ">
          {step === 1 && (
            <div className="p-6">
              <Tabs type="filled" currentSelectedTab={panes[0].key} panes={panes} />
            </div>
          )}
          {/* {step === 2 && <TenantIdentification />} */}
          {/* {step === 2 && <PrimaryTenantIdentification />} */}
          {/* {step === 2 && <EnrollIncomeProof />} */}
          {step === 2 && <EnrollTenantGuarantee />}
          {step === 3 && <EnrollLastStep />}

          <StepButtons
            step={step}
            handlers={handlers}
            handleContinue={handleContinue}
            handleCancel={handleBack}
            handleDone={handleDone}
          />
        </div>
      </div>
      <div className="col-span-2 bg-white ">
        <UnitDetail />
        {step > 1 && (
          <div>
            <TenantCoTenant />
            <QualityTenantSidebar />
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrollTenant;
