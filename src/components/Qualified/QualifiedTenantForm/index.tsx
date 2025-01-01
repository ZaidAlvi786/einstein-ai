import { useState } from 'react';
import { ITabPaneProps } from '@shared/components/tabs';
import { EQualifiedTenantStep, ETenantEnum } from '@enums/qualified.enum';
import TenantFormButton from './TenantFormButton';
import AddQualifiedTenantForm from './AddQualifiedTenantForm';
import IncomeProof from './IncomeProof';
import TenantSuccess from './TenantSuccess';
import TenantUnderReview from './TenantUnderReview';
import IndividualTenantForm from './IndividualTenantForm';
import BulkTenantForm from './BulkTenantForm';

const QualifiedTenantForm = () => {
  const panes: ITabPaneProps[] = [
    {
      title: 'Individual',
      key: 'Individual',
      component: <IndividualTenantForm />,
    },
    {
      title: 'Bulk',
      key: 'Bulk',
      component: <BulkTenantForm />,
    },
  ];
  const [activeStep, setActiveStep] = useState<EQualifiedTenantStep>(
    EQualifiedTenantStep.QUALIFIED_TENANT_FORM
  );
  const [tenantTab, setTenantTab] = useState<ETenantEnum>(ETenantEnum.INDIVIDUAL);

  const handleTabChange = (value: string | null) => {
    const tenantType = value === ETenantEnum.INDIVIDUAL ? ETenantEnum.INDIVIDUAL : ETenantEnum.BULK;
    setTenantTab(tenantType as ETenantEnum);
  };

  const handleNextStep = () => {
    if (tenantTab === ETenantEnum.BULK) return;
    setActiveStep(activeStep + 1);
  };
  const handlePreviousStep = () => {
    if (tenantTab === ETenantEnum.BULK) return;
    setActiveStep(activeStep - 1);
  };

  return (
    <div className="p-8">
      <p className="text-Gray-900 font-semibold text-3xl">Qualify tenants</p>
      <p className="font-normal text-base text-Gray-600">
        Update your photo and personal details here.
      </p>
      <div className="flex justify-center items-center mt-3 ">
        <div className="max-w-xl border-solid border border-gray-960 rounded-[12px] bg-white mx-9">
          {activeStep === EQualifiedTenantStep.QUALIFIED_TENANT_FORM && (
            <AddQualifiedTenantForm panes={panes} onChange={(value) => handleTabChange(value)} />
          )}
          {activeStep === EQualifiedTenantStep.INCOME_PROOF &&
            tenantTab === ETenantEnum.INDIVIDUAL && <IncomeProof />}
          {activeStep === EQualifiedTenantStep.TENANT_SUCCESS &&
            tenantTab === ETenantEnum.INDIVIDUAL && <TenantSuccess />}
          {activeStep === EQualifiedTenantStep.TENANT_UNDER_REVIEW &&
            tenantTab === ETenantEnum.INDIVIDUAL && <TenantUnderReview />}
          <TenantFormButton
            onNextStep={handleNextStep}
            step={activeStep}
            onPreviousStep={handlePreviousStep}
          />
        </div>
      </div>
    </div>
  );
};

export default QualifiedTenantForm;
