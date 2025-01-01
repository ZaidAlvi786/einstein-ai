import { useCounter } from '@mantine/hooks';

import { CustomBreadcrumbs } from '@components/CustomBreadcrumbs';
import {
  Home02Icon,
  Building03Icon,
  Settings01Icon,
  CreditCard02Icon,
  Stars02Icon,
} from '@assets/iconComponents';
import StepperTest from '@components/StepperTest/StepperTest';
import { PropertyDetailsStep } from '@components/Properties/PropertyDetailsStep/PropertyDetailsStep';
import { PropertyContactsStep } from '@components/Properties/ContactsStep/PropertyContactsStep';
import { UnitFields } from '@components/Properties/UnitDetailsStep/UnitFields';
import { UnitTable } from '@components/Properties/UnitDetailsStep/UnitsTable';
import { PaymentDetails } from '@components/Properties/PaymentDetails/PaymentDetails';

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
export function NewPropertyPage() {
  const [step, handlers] = useCounter(0, { min: 0, max: 5 });
  return (
    <main className=" bg-gray-50 relative">
      <div className="flex flex-col gap-6 p-8 my-0 mx-auto max-w-[1250px]">
        <div>
          <h1 className="text-d-md-semibold leading-xxxl">New Property</h1>
        </div>
        <StepperTest currentStep={step} />
        <div className="border-solid border border-gray-960 rounded-[12px] bg-white">
          {step === 0 && <PropertyDetailsStep step={1} handlers={handlers} />}
          {step === 1 && <PropertyContactsStep step={2} handlers={handlers} />}
          {step === 2 && <UnitFields step={3} handlers={handlers} />}
          {step === 3 && <UnitTable step={4} handlers={handlers} />}
          {step === 4 && <PaymentDetails step={5} handlers={handlers} />}
        </div>
      </div>
    </main>
  );
}
