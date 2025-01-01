import { useState } from 'react';
import { Stepper, StepperProps, rem } from '@mantine/core';
import { StepIcon, StepIconActive } from '@assets/iconComponents';

function StyledStepper(props: StepperProps) {
  return (
    <Stepper
      styles={{
        stepBody: {
          display: 'none',
        },

        step: {
          padding: 0,
        },

        stepIcon: {
          borderWidth: rem(0),
          backgroundColor: 'unset',
        },

        separator: {
          marginLeft: rem(-2),
          marginRight: rem(-2),
          height: rem(2),
        },
      }}
      {...props}
    />
  );
}
interface Props {
    step: number;
}
 export default function Steps({step}:Props) {
//   const [active, setActive] = useState(1);
  return (
    // <StyledStepper active={active} onStepClick={setActive}>
    <StyledStepper active={step}   completedIcon={<StepIconActive/>} >
       <Stepper.Step icon={step > 0 ? <StepIcon /> : <StepIconActive />} />
      <Stepper.Step icon={step == 1 ? <StepIconActive /> : <StepIcon />} />
      <Stepper.Step icon={step == 2 ? <StepIconActive /> : <StepIcon />} />
      <Stepper.Step icon={step == 3 ? <StepIconActive /> : <StepIcon />} />
      <Stepper.Step icon={step == 4 ? <StepIconActive /> : <StepIcon />} />
      {/* <Stepper.Step label="Step 1" description=""   icon={<StepIconActive />} />
      <Stepper.Step label="Step 2" description=""   icon={<StepIcon  />} />
      <Stepper.Step label="Step 3" description=""   icon={<StepIcon  />}/>
      <Stepper.Step label="Step 4" description=""   icon={<StepIcon />}/>
      <Stepper.Step label="Step 5" description=""   icon={<StepIcon />}/> */}
    </StyledStepper>
  );
}