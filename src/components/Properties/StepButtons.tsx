import { Button } from '@mantine/core';
import { UnknownAction } from '@reduxjs/toolkit';
import { APP_PATHS } from '@routes/app-paths';
import { clearAllData, clearData, setPropertyData } from '@stores/propertySlice';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

interface Props {
  step: number;
  handlers: {
    increment: () => void;
    decrement: () => void;
  };
  onContinue: () => void;
  onExit: () => void;
}

export function StepButtons({ step, handlers, onContinue, onExit }: Props) {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const handldeContinue = () => {
    
    // dispatch(setPropertyData());
    handlers?.increment()
  };
  

  const handldeExit = async () => {
    await dispatch(clearAllData() as unknown as UnknownAction);
    navigate(APP_PATHS.properties.get());
  };
  
  

  return (
    <div
      className={clsx(
        'flex justify-between items-center border-t border-gray-960 border-solid p-4',
        step === 1 && '!justify-end'
      )}
    >
      {step !== 1 && (
        <div>
          <Button onClick={handlers?.decrement} variant="subtle" className="text-gray-600">
            Go back
          </Button>
        </div>
      )}
      <div>
        {step !== 1 && (
          <Button
            variant="outline"
            onClick={
              step == 2 ? onExit : handldeExit  
            }
            className="border-gray-300 text-gray-700 rounded-lg h-10"
          >
            {step == 5 ? 'Skip for now' : 'Save and Exit'}
          </Button>
        )}
        <Button
          onClick={
            step == 3 ? handlers?.increment : onContinue
          }
          className="rounded-lg hover:bg-brand-970 bg-brand-960 text-base font-semibold ms-3 h-10"
        >
          {step == 5 ? 'Save and exit' : step == 1 ? 'Continue' : 'Save and Continue'}
        </Button>
      </div>
    </div>
  );
}
