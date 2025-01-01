import StepIconBase from '@assets/iconComponents/StepIconBase';
import { Stepper } from '@mantine/core';
import { useState } from 'react';

export const ApplicationFlowMap = () => {
  const [active, setActive] = useState(3);

  return (
    <div className="flex flex-col gap-5 flex-1">
      <div className="font-semibold text-Gray-900 text-[18px] leading-[28px]">
        Tenant enrollment flow map
      </div>
      <div className="flex flex-col  justify-center flex-1">
        <Stepper
          iconSize={24}
          active={active}
          onStepClick={setActive}
          completedIcon={<StepIconBase />}
          icon={<StepIconBase />}
          color="#3E4784"
          classNames={{
            step: 'flex flex-col text-center',
            stepWrapper: 'mr-3 mb-2',
            separator: 'ml-[-4rem] mr-[-4rem] mb-12',
            stepBody: 'mr-4',
          }}
        >
          <Stepper.Step label="Qualify" description="Name and Email" />
          <Stepper.Step label="Enroll" description="Company" />
          <Stepper.Step label="Guaranteed" description="Start collaborating" />
        </Stepper>
      </div>
    </div>
  );
};
