import { Button } from '@mantine/core';
import { useContext } from 'react';
import { MyContext } from './AddLeaseTenant';
interface Props {
  step: number;
  handlers: {
    increment: () => void;
    decrement: () => void;
  };
  handleContinue: () => void;
  handleCancel: () => void;
}
const StepButtons = ({ step, handlers, handleContinue, handleCancel }: Props) => {
  const {setShowSkipModal} = useContext(MyContext);

  return (
    <div className="flex justify-between  items-center border-t border-gray-960 border-solid p-4">
      <div>
        <Button variant="subtle" className="text-gray-600" onClick={handleCancel}>
          {step === 1 ? 'Cancel' : 'Go back'}
        </Button>
      </div>
      <div className="flex">
        {step === 3  && (
            <Button
              onClick={()=>setShowSkipModal(true)}
              variant="outline"
              className="border-gray-300 text-gray-700 rounded-lg h-10"
            >
              Skip for now
            </Button>
         
        )}
        <Button
          className="rounded-[8px] hover:bg-brand-970 bg-brand-960 text-base font-semibold ms-3 h-10"
          onClick={handleContinue}
        >
          {step == 4 ? 'Enroll'  : 'Continue'}
        </Button>
      </div>
    </div>
  );
};

export default StepButtons;
