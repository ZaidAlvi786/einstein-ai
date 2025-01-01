import { EQualifiedTenantStep } from '@enums/qualified.enum';
import { Button } from '@mantine/core';
import clsx from 'clsx';
import React from 'react';

interface ITenantFormButtonProps {
  onNextStep: () => void;
  onPreviousStep: () => void;
  step: EQualifiedTenantStep;
}
const TenantFormButton: React.FC<ITenantFormButtonProps> = ({
  onNextStep,
  onPreviousStep,
  step,
}) => (
  <div className="flex justify-end p-4  items-center border-t border-gray-960 border-solid">
    <div>
      <Button
        className="text-Gray-700 ms-3 h-10  font-semibold text-sm border-solid border-Gray-300 bg-white rounded-[8px] px-3 py-2 hover:bg-white hover:text-Gray-700 "
        onClick={onPreviousStep}
      >
        {step === EQualifiedTenantStep.TENANT_SUCCESS ||
        step === EQualifiedTenantStep.TENANT_UNDER_REVIEW
          ? 'Done'
          : 'Cancel'}
      </Button>
    </div>
    {step !== EQualifiedTenantStep.TENANT_SUCCESS && (
      <div>
        <Button
          className={clsx(
            'rounded-[8px] hover:bg-brand-970 bg-brand-960 text-base font-semibold ms-3 h-10',
            {
              'text-Gray-700 border-solid border-Gray-300 bg-white hover:bg-white hover:text-Gray-700':
                step === EQualifiedTenantStep.TENANT_UNDER_REVIEW,
            }
          )}
          onClick={onNextStep}
        >
          {step !== EQualifiedTenantStep.TENANT_UNDER_REVIEW ? 'Prequalify' : 'New application'}
        </Button>
      </div>
    )}
  </div>
);

export default TenantFormButton;
