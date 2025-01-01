import { Button, Modal } from '@mantine/core';
import { useCounter } from '@mantine/hooks';

import { Home06Icon } from '@assets/iconComponents';
import bgPattrerens from '@assets/patterns/Background pattern decorative.svg';
import PropertyModelFormData from './PropertyModelFormData';
import AddPropertyOwnerDetails from './AddPropertyOwnerDetails';

interface Props {
  addPropertyModalOpen: boolean;
  setAddPropertyModalOpen: (item: boolean) => void;
}

export function AddNewPropertyModel({ addPropertyModalOpen, setAddPropertyModalOpen }: Props) {
  const [step, handlers] = useCounter(0, { min: 0, max: 1 });

  return (
    <Modal
      size={`${step === 1 ? 'xl' : 'lg'}`}
      classNames={{
        title: 'text-brand-960 font-semibold text-lg',
        content: 'rounded-[12px] modal-scroll ',
        header: 'w-24 float-right bg-transparent',
        body: 'p-0 ',
        close: 'text-gray-400',
      }}
      opened={addPropertyModalOpen}
      onClose={() => {
        setAddPropertyModalOpen(false);
        handlers.set(0);
      }}
    >
      <div>
        <div className="bg-cover w-full my-3 relative  ">
          <img src={bgPattrerens.toString()} alt="circle-bg" className="circleImg -z-10" />
          <Home06Icon className="ms-6.2 mt-3 h-37.47 w-9" />
        </div>
        <div className="p-5 pt-2">
          <div className="leading-7 font-semibold text-lg text-gray-900 ">
            {step === 0 ? 'Add property' : 'Owners details'}
          </div>
          <div className="text-sm font-normal text-gray-600 mt-2">
            Share where you’ve worked on your profile.
          </div>
          <form>
            {step === 0 && <PropertyModelFormData />}
            {step === 1 && <AddPropertyOwnerDetails />}
            <div className="grid-cols-2 grid gap-5 mt-10">
              <Button
                variant="outline"
                onClick={() => {
                  if (step > 0) {
                    handlers?.decrement();
                  } else {
                    handlers.set(0);
                    setAddPropertyModalOpen(false);
                  }
                }}
                className="border-gray-300 font-semibold text-base h-11 text-gray-700 rounded-[8px]"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (step > 0) {
                    handlers.set(0);
                    setAddPropertyModalOpen(false);
                  } else {
                    handlers?.increment();
                  }
                }}
                variant="outline"
                className="rounded-[8px] h-11 hover:bg-brand-970 hover:text-white bg-brand-960 text-base text-white font-semibold ms-3"
              >
                {step > 0 ? 'Save' : 'Continue'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
