import { StepIconBase } from '@assets/iconComponents';
import { Stepper } from '@mantine/core';
import { useState } from 'react';

export const ApplicationFlowMap = () => {
  const [active, setActive] = useState(3);

  return (
    <div className="flex flex-col gap-5 flex-1">
      <div className="font-semibold text-Gray-900 text-[18px] leading-[28px]">
        Application flow map
      </div>
      <div className="flex flex-col justify-between flex-1 gap-40">
        <Stepper
          iconSize={24}
          active={active}
          onStepClick={setActive}
          completedIcon={<StepIconBase />}
          icon={<StepIconBase />}
          color="#3E4784"
        >
          <Stepper.Step label="Apply" description="Name and Email" />
          <Stepper.Step label="Qualified" description="Website and location" />
          <Stepper.Step label="Approved" description="Start collaborating" />
          <Stepper.Step label="Accept" description="Automatic sharing" />
        </Stepper>

        <Stepper
          iconSize={24}
          active={active}
          onStepClick={setActive}
          completedIcon={<StepIconBase />}
          icon={<StepIconBase />}
          color="#3E4784"
        >
          <Stepper.Step label="Sign lease" description="Name and Email" />
          <Stepper.Step label="Enroll" description="Website and location" />
          <Stepper.Step label="Move in" description="Start collaborating" />
          <Stepper.Step label="Guaranteed" description="Automatic sharing" />
        </Stepper>
      </div>
    </div>
  );
};
