import { SkipInfoIcon } from '@assets/iconComponents';
import { Button, Modal } from '@mantine/core';
import { useContext } from 'react';
import { MyContext } from '../AddLease';

interface Props {
  step: number;
  handlers: {
    increment: () => void;
    decrement: () => void;
  };
}

const SkipModal = ({ step, handlers }: Props) => {
  const {skipModal,setShowSkipModal} = useContext(MyContext);


  return (
    <Modal
      size={'md'}
      classNames={{
        title: 'text-brand-960 font-semibold text-lg',
        content: 'rounded-xl modal-scroll ',
        header: 'w-24 float-right bg-transparent absolute top-0 right-0',
        body: 'px-8 pb-5 ',
        close: 'text-gray-400 ',
      }}
      opened={skipModal}
      onClose={() =>setShowSkipModal(false)}
    >
        <div className="w-full max-w-full  bg-[url(/src/assets/patterns/linesbg.svg)]  bg-no-repeat relative bg-top">
        <div className="text-center ">
          <SkipInfoIcon className='mt-8' />
        </div>
        <div className="text-2xl font-semibold text-center">Skip for now?</div>
        <div className="text-center font-normal	text-sm text-gray-600 mt-4 leading-6">
          Don’t let your rent be unprotected. Your tenant is aprroved for the QTG program, enroll
          now and benefit from a peace a mind.
        </div>

        <div className="grid grid-cols-2 w-11/12 m-auto gap-2 mt-5">
          <div>
            <ul className="list-disc font-semibold text-xs leading-5 text-Gray-700 ">
              <li className="list-disc">12 months rent guaranteed (up to $100,000)</li>
              <li className="list-disc">Full eviction managment</li>
              <li className="list-disc">Releasing assistance</li>
            </ul>
          </div>
          <div>
            <ul className="list-disc font-semibold text-xs leading-5 text-Gray-700 ms-2 ">
              <li className="list-disc">Rent reprting to the credit beuiros</li>
              <li className="list-disc">Security deposit waiver</li>
            </ul>
          </div>
        </div>

        <div className="grid-cols-2 grid gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => {
              setShowSkipModal(false)
              handlers.increment(); 
            }}
            className="border-gray-300 font-semibold text-base h-11 text-gray-700 rounded-lg"
          >
            Skip for now
          </Button>
          <Button
            variant="filled"
            className="border-solid border-[1px] border-success-600 bg-success-600 rounded-[8px] hover:bg-success-500 text-base font-semibold h-11 ms-3 "
          >
            Enroll tenant
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SkipModal;
