import { SkipInfoIcon } from '@assets/iconComponents';
import { Button, Checkbox, Image, Modal } from '@mantine/core';
import clsx from 'clsx';
import { useState } from 'react';

interface Props {
  skipModal: boolean;
  setSkipModal: (value: boolean) => void;
}

const SkipModal = ({ skipModal, setSkipModal }: Props) => {
  const [privacy, setPrivacy] = useState(false);
  const [privacy1, setPrivacy1] = useState(false);

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
      onClose={() => setSkipModal(false)}
    >
      <div className="bg-contain w-full max-w-full bg-[url(/src/assets/patterns/radial-lines.svg)] bg-top-12.4  bg-no-repeat relative">
        <div className="text-center mt-8">
          <SkipInfoIcon />
        </div>
        <div className="text-2xl font-semibold text-center">Skip for now?</div>
        <div className="text-center font-normal	text-sm text-gray-600 mt-3 leading-6">
          You will still need to submit proof of income and ID at a later stage for the guarantee to
          be finalized. The screening results will be based on tenant records but will not serve as
          a final guarantee.
        </div>

        <div
          className="flex gap-3 mt-4 cursor-pointer"
          onClick={() => {
            setPrivacy(!privacy);
          }}
        >
          <Checkbox
            checked={privacy}
            className="mt-1"
            classNames={{
              label: 'text-gray-700 font-medium	text-sm	',
              body: 'items-center',
              input: clsx('rounded-[6px]', privacy && '!bg-brand-970 !border-brand-970'),
            }}
          />
          <div>
            <div className="text-gray-700 text-sm font-medium leading-5">
              I understand that I must provide proof of tenant income in order for the guarantee to
              be activated.
            </div>
          </div>
        </div>
        <div
          className="flex gap-3 mt-4 cursor-pointer"
          onClick={() => {
            setPrivacy1(!privacy1);
          }}
        >
          <Checkbox
            checked={privacy1}
            className="mt-1"
            classNames={{
              label: 'text-gray-700 font-medium	text-sm leading-5',
              body: 'items-center',
              input: clsx('rounded-[6px]', privacy1 && '!bg-brand-970 !border-brand-970'),
            }}
          />
          <div>
            <div className="text-gray-700 text-sm font-medium leading-5">
              I understand that I must provide a copy of the tenant ID for the guarantee to take
              effect.
            </div>
          </div>
        </div>
        <div className="grid-cols-2 grid gap-2 mt-10">
          <Button
            variant="outline"
            onClick={() => setSkipModal(false)}
            className="border-gray-300 font-semibold text-base h-11 text-gray-700 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            className="rounded-lg h-11 hover:bg-brand-970 hover:text-white bg-brand-960 text-base text-white font-semibold ms-3"
          >
            Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SkipModal;
