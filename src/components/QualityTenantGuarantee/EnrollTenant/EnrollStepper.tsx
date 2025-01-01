import { Stepper, StepperProps, rem } from '@mantine/core';
import { StepCheckIcon, StepIcon, StepIconActive } from '@assets/iconComponents';

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
          backgroundColor: '#3E4784',
        },
      }}
      {...props}
    />
  );
}
interface Props {
  step: number;
}
export default function Steps({ step }: Props) {
  return (
    <StyledStepper active={step} completedIcon={<StepCheckIcon />}>
      <Stepper.Step icon={step > 0 ? <StepIcon /> : <StepIconActive />} />
      <Stepper.Step icon={step == 1 ? <StepIconActive /> : <StepIcon />} />
      <Stepper.Step icon={step == 2 ? <StepIconActive /> : <StepIcon />} />
    </StyledStepper>
  );
}
