import clsx from 'clsx';
import {
  Home02Icon,
  Building03Icon,
  Settings01Icon,
  CreditCard02Icon,
  Stars02Icon,
} from '@assets/iconComponents';

export function CustomStepper({ steps2 }: any) {
  const steps = [
    {
      label: 'Property Details',
      icon: <Home02Icon />,
    },
    {
      label: 'Property contact detail & other contacts',
      icon: <Building03Icon />,
    },
    {
      label: 'Property type, adding units and unit models',
      icon: <Settings01Icon />,
    },
    {
      label: 'Payment details',
      icon: <CreditCard02Icon />,
    },
    {
      label: 'Unit details',
      icon: <Stars02Icon />,
    },
  ];
  const activeStepIndex = 2;
  return (
    <ol className="flex items-center w-full">
      {steps.map((step, index) => {
        const isLastStep = index === steps.length - 1;
        const isIntersection = index < activeStepIndex;
        const isActive = index <= activeStepIndex;

        return (
          <li
            className={clsx(
              'flex w-full items-center',
              !isLastStep &&
                "after:content-[''] after:w-full after:border-b-0 after:border-gray-100 after:border-solid after:inline-block",
              isIntersection && 'after:border-brand-700'
            )}
          >
            <div className="flex flex-col justify-center items-center">
              <div
                className={clsx(
                  'flex items-center justify-center w-10 h-10 rounded-full shrink-0 border border-solid border-gray-200',
                  isActive && 'border-brand-700'
                )}
              >
                {step.icon}
              </div>
              <div>{step.label}</div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
