import { Button } from '@mantine/core';
interface Props {
  step: number;
  handlers: {
    increment: () => void;
    decrement: () => void;
  };
  handleContinue: () => void;
  handleCancel: () => void;
  skipModal: () => void;
}
const StepButtons = ({ step, handlers, handleContinue, handleCancel, skipModal }: Props) => {
  return (
    <div className="flex justify-between  items-center border-t border-gray-960 border-solid p-4">
      <div>
        <Button variant="subtle" className="text-gray-600" onClick={handleCancel}>
          {step === 1 ? 'Cancel' : 'Go back'}
        </Button>
      </div>
      <div>
        {step !== 1 && (
          <Button
            onClick={skipModal}
            variant="outline"
            className="border-gray-300 text-gray-700 rounded-lg h-10"
          >
            {step == 2 ? 'Skip for now' : 'Invite to apply'}
          </Button>
        )}
        {step !== 0 && (
          <Button variant="outline" className="border-gray-300 ms-3 text-gray-700 rounded-lg h-10">
            {step == 2 ? 'Sent link to prospect' : 'Send payment link'}
          </Button>
        )}
        <Button
          className="rounded-[8px] hover:bg-brand-970 bg-brand-960 text-base font-semibold ms-3 h-10"
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default StepButtons;
