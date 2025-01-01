import clsx from 'clsx';
import {
  Building03Icon,
  Building04Icon,
  Users02Icon,
  CreditCard02Icon,
} from '@assets/iconComponents';
import styles from './StepperTest.module.css';

const steps = [
  {
    label: 'Property Details',
    subTitle: 'Name and address',
    icon: <Building04Icon />,
  },
  {
    label: 'Contact Details',
    subTitle: 'Owner and manager',
    icon: <Users02Icon />,
  },
  {
    label: 'Unit Details',
    subTitle: 'Unit models and count',
    icon: <Building03Icon />,
  },
  {
    label: 'Unit Table',
    subTitle: 'Unit models and count',
    icon: <Building03Icon />,
  },
  {
    label: 'Payment Details',
    subTitle: 'Card or bank',
    icon: <CreditCard02Icon />,
  },
];

interface Props {
  currentStep: number;
}
export function StepperTest({ currentStep }: Props) {
  return (
    <div className="flex justify-between">
      {steps.map((step, index) => (
        <div
          className={clsx(
            styles.stepperItem,
            'relative flex flex-col items-center flex-1',
            index == currentStep && 'font-bold',
            step.label === 'Unit Table' && 'hidden',
            currentStep == 3
              ? index < (currentStep -1) && styles.completed
            : index < currentStep && styles.completed
          )}
          key={index}
        >
          <div
            className={clsx(
              'relative rounded-[12px] z-20 flex w-10 h-10 justify-center items-center bg-white border-solid border-[1px] border-[#EAECF0] drop-shadow-xs'
            )}
          >
            {step.icon}
          </div>
          <div
            className={clsx(
              'mt-3 text-center font-semibold text-sm leading-5 text-gray-400',
              currentStep >= index && '!text-gray-700' 
            )}
          >
            {step.label}
          </div>
          <div
            className={clsx(
              'text-center font-normal text-sm leading-5 text-gray-400',
              currentStep >= index && '!text-gray-700'
            )}
          >
            {step.subTitle}
          </div>
        </div>
      ))}
    </div>
  );
}

export default StepperTest;
