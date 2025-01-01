import {  CheckCircle02,  } from '@assets/iconComponents';
import { Button,  Modal } from '@mantine/core';


interface Props {
  openGuranteeLease:boolean;
  setOpenGuranteeLease:(value: boolean) => void;
}

const GuranteedLease = ({openGuranteeLease,setOpenGuranteeLease}:Props) => {

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
      opened={openGuranteeLease}
      onClose={() => setOpenGuranteeLease(false)}
    >
      <div className="w-full max-w-full  bg-[url(/src/assets/patterns/linesbg.svg)]  bg-no-repeat relative bg-top">
        <div className="text-center ">
          <CheckCircle02 className='mt-8' />
        </div>
        <div className="text-2xl font-semibold text-center">Guararnteed lease added</div>
        <div className="text-center font-normal	text-sm text-gray-600 mt-4 leading-6">
          You will still need to submit proof of income and ID at a later stage for the guarantee to
          be finalized. The screening results will be based on tenant records but will not serve as
          a final guarantee.
        </div>


        <div className="grid-cols-3 grid gap-1 mt-8">
          <Button
            variant="outline"
            onClick={() => {
              setOpenGuranteeLease(false)
            }}
            className="border-gray-300 font-semibold text-base h-11 text-gray-700 rounded-[8px]"
          >
            Done
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              
            }}
            className="border-gray-300 font-semibold text-base h-11 text-gray-700 rounded-[8px]"
          >
            View Lease
          </Button>
          <Button
            variant="outline"
            onClick={() => {
            
            }}
            className="border-gray-300 font-semibold text-base h-11 text-gray-700 rounded-[8px]"
          >
            New Lease
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default GuranteedLease;
