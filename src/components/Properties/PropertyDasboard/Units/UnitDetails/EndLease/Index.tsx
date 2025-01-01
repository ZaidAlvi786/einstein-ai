import { Modal } from '@mantine/core';
import { useCounter } from '@mantine/hooks';
import { useState } from 'react';
import { Agreement } from './Agreement';
import { FileX02, XCloseIcon } from '@assets/iconComponents';
import { Confirmation } from './Confirmation';

interface Props {
  endLeaseModalOpen: boolean;
  setEndLeaseModalModalOpen: (item: boolean) => void;
}

export function EndLeaseModal({ endLeaseModalOpen, setEndLeaseModalModalOpen }: Props) {
  const [step, handlers] = useCounter(0, { min: 0, max: 1 });
  const [modalSize, setModalSize] = useState('lg');
  return (
    <Modal.Root
      size={modalSize}
      classNames={{
        content: 'rounded-xl',
        close: 'text-gray-400',
      }}
      opened={endLeaseModalOpen}
      onClose={() => setEndLeaseModalModalOpen(false)}
    >
      <Modal.Overlay />
      {/* <Modal.Overlay /> */}
      <Modal.Content>
        <Modal.Header className="bg-[url(/src/assets/patterns/circle.svg)] bg-no-repeat bg-left-top p-0 relative">
          {/* <Agreement setModalSize= {setModalSize}/> */}
          <div className="flex px-6 pt-6 flex-col items-start gap-4 self-stretch">
            <span className="flex h-12 w-12 items-center justify-center rounded-[28px] border-[8px] border-solid border-Error-50 bg-Error-100">
              <span className="h-full flex w-full p-2 ustify-center items-center flex-0">
                <FileX02  />
              </span>
            </span>
            <div className="flex flex-col items-start gap-1 self-stretch">
              <span className="text-Gray-900 text-lg font-semibold leading-7">
                End lease agreement?
              </span>
              <span className='text-Gray-600 text-sm font-regular leading-5'>
                {step === 0
                  ? 'Share where you’ve worked on your profile.'
                  : 'This will mover out all tenants and imitedly terminate the lease.'}
              </span>
            </div>
          </div>
          <div className='flex h-11 w-11 p-2 justify-center items-center absolute right-4 top-4 rounded-[8px]'>
            <XCloseIcon height={24} width={24} stroke='#98A2B3' onClick={()=>{setEndLeaseModalModalOpen(false),handlers.set(0),setModalSize('lg')}} className='cursor-pointer' />
          </div>
        </Modal.Header>
        <Modal.Body classNames={{
            body: '!pb-0',
          }} className='flex px-6 flex-col items-start gap-5 self-stretch'>
          {step ===0 ? (<Agreement setEndLeaseModalModalOpen={setEndLeaseModalModalOpen} setModalSize= {setModalSize} handlers={handlers}/>):(
            <Confirmation setEndLeaseModalModalOpen={setEndLeaseModalModalOpen} handlers={handlers} setModalSize= {setModalSize}/>
          )}
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
