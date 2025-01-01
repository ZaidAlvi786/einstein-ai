import { Button } from '@mantine/core';
import clsx from 'clsx';

interface Props {
  step: number;
  handlers: {
    increment: () => void;
    decrement: () => void;
  };
  handleContinue: () => void;
  handleCancel: () => void;
  handleDone: () => void;
}
const StepButtons = ({ step, handlers, handleContinue, handleCancel, handleDone }: Props) => (
  <div
    className={clsx('border-t border-gray-960 border-solid p-4', {
      'flex justify-between  items-center': step !== 3,
    })}
  >
    {step !== 3 && (
      <div>
        <Button variant="subtle" className="text-gray-600" onClick={handleCancel}>
          {step === 1 ? 'Cancel' : 'Go back'}
        </Button>
      </div>
    )}
    <div className="flex justify-end">
      {step > 1 && (
        <Button
          variant="outline"
          className="border-gray-300 text-gray-700 rounded-lg h-10"
          onClick={handleDone}
        >
          {step > 2 ? 'Done' : 'Skip for now '}
        </Button>
      )}
      <Button
        className={clsx(
          'rounded-[8px] hover:bg-brand-970 bg-brand-960 text-base font-semibold ms-3 h-10',
          {
            'border-solid border-[1px] border-Gray-300 rounded-[8px] bg-white text-Gray-700 hover:text-Gray-700 hover:bg-white':
              step > 2,
          }
        )}
        onClick={handleContinue}
      >
        {step > 2 ? 'New application' : step === 2 ? 'Enroll' : 'Continue'}
      </Button>
    </div>
  </div>
);

export default StepButtons;
