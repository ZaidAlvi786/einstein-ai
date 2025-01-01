import { Button, Modal, TagsInput } from '@mantine/core';
import { useCounter } from '@mantine/hooks';

import { Home06Icon } from '@assets/iconComponents';
import bgPattrerens from '@assets/patterns/Background pattern decorative.svg';
import CurrentTenant from './CurrentTenant';
import { useState } from 'react';

interface Props {
  addTenantModalOpen: boolean;
  setAddTenantModalOpen: (item: boolean) => void;
}

export function AddTenantModel({ addTenantModalOpen, setAddTenantModalOpen }: Props) {
  const [isleased, setIsLeased] = useState(false);
  return (
    <Modal
      size="xl"
      classNames={{
        title: 'text-brand-960 font-semibold text-lg',
        content: 'rounded-[12px] modal-scroll ',
        header: 'w-24 float-right bg-transparent',
        body: 'p-0 ',
        close: 'text-gray-400',
      }}
      opened={addTenantModalOpen}
      onClose={() => {
        setAddTenantModalOpen(false);
      }}
    >
      <div>
        <div className="bg-cover w-full my-3 relative  ">
          <img src={bgPattrerens.toString()} alt="circle-bg" className="circleImg -z-10" />
          <Home06Icon className="ms-6.2 mt-3 h-37.47 w-9" />
        </div>
        <div className="p-5 pt-2">
          <div className="leading-7 font-semibold text-lg text-gray-900 ">Add tenant</div>
          <div className="text-sm font-bold text-Gray-600 mt-2">
            <span className="text-sm font-normal text-Gray-600">Adding unit to</span> Withesthone
            Apartments - 123 Main St. New York NY 11111.
          </div>
          <form className="mt-4">
            <CurrentTenant isleased={isleased} setIsLeased={setIsLeased} />
            <div className="grid-cols-2 grid gap-5 mt-10">
              <Button
                variant="outline"
                onClick={() => {
                  setAddTenantModalOpen(false);
                }}
                className="border-gray-300 font-semibold text-base h-11 text-gray-700 rounded-[8px]"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setAddTenantModalOpen(false);
                }}
                variant="outline"
                className="rounded-[8px] h-11 hover:bg-brand-970 hover:text-white bg-brand-960 text-base text-white font-semibold ms-3"
              >
                Save
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
