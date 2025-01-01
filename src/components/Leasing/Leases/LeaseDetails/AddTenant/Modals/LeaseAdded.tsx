import { CheckCircle02, } from '@assets/iconComponents';
import { Button, Modal } from '@mantine/core';


const LeaseAdded = () => {

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
      opened={false}
      onClose={() => {}}
    >
            <div className="w-full max-w-full  bg-[url(/src/assets/patterns/linesbg.svg)]  bg-no-repeat relative bg-top">
        <div className="text-center ">
          <CheckCircle02 className='mt-8' />
        </div>
        <div className="text-2xl font-semibold text-center">Lease sucsessfully added</div>
        <div className="text-center font-normal	text-sm text-gray-600 mt-4 leading-6">
          Don’t let your rent be unprotected. Your tenant is aprroved for the QTG program, enroll
          now and benefit from a peace a mind.
        </div>

        <div className="grid-cols-3 grid gap-1 mt-8">
          <Button
            variant="outline"
            className="border-gray-300 font-semibold text-base h-11 text-gray-700 rounded-[8px]"
          >
            Done
          </Button>
          <Button
            variant="outline"
            className="border-gray-300 font-semibold text-base h-11 text-gray-700 rounded-[8px]"
          >
            View Lease
          </Button>
          <Button
            variant="filled"
            className="border-solid border-[1px] border-success-600 bg-success-600 rounded-[8px] hover:bg-success-500 text-base font-semibold h-11 ms-3 "
          >
            Enroll Lease
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LeaseAdded;
