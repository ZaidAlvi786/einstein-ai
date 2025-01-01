import { XCloseIcon } from '@assets/iconComponents';
import FilePlus02 from '@assets/iconComponents/FilePlus02';
import { Button, Card, Group, Modal, Radio, Text } from '@mantine/core';
import { useState } from 'react';
import { LadnlordForm } from './LandlordForm';
import { TenantForm } from './TenantForm';

interface Props {
  moveOutTenantModal: boolean;
  setMoveOutTenantModal: (item: boolean) => void;
}
export function MoveOutTenantModal({ moveOutTenantModal, setMoveOutTenantModal }: Props) {
  const [selectedValue, setSelectedValue] = useState('');

  const handleCardClick = (value: string) => {
    setSelectedValue(value === selectedValue ? '' : value);
  };
  const data = [
    {
      name: 'Ladnlord agrred',
      description: 'Tenant is alredy resding at properrty',
    },
    { name: 'Tenant aborted', description: 'Tenant to be schlued to move in on property' },
  ];
  return (
    <>
      <Modal.Root
        size={640}
        classNames={{
          content: 'rounded-xl',
          close: 'text-gray-400',
        }}
        opened={moveOutTenantModal}
        onClose={() => setMoveOutTenantModal(false)}
      >
        <Modal.Overlay />
        {/* <Modal.Overlay /> */}
        <Modal.Content>
          <Modal.Header className="bg-[url(/src/assets/patterns/circle.svg)] bg-no-repeat flex flex-col items-start gap-4 bg-left-top p-0 relative">
            {/* <Agreement setModalSize= {setModalSize}/> */}
            <div className="flex px-6 pt-6 flex-col items-start gap-4 self-stretch">
              <span className="flex h-12 w-12 items-center justify-center rounded-[28px] border-[8px] border-solid border-Brand-50 bg-Brand-100">
                <span className="h-full flex w-full p-2 justify-center items-center flex-0">
                  <FilePlus02 height={24} width={24} />
                </span>
              </span>
              <div className="flex flex-col items-start gap-1 self-stretch">
                <span className="text-Gray-900 text-lg font-semibold leading-7">
                  Move out tenant
                </span>
                <span className="text-Gray-600 text-sm font-regular leading-5">
                  Share where you’ve worked on your profile.
                </span>
              </div>
            </div>
            <div className="flex h-11 w-11 p-2 justify-center items-center absolute right-4 top-4 rounded-[8px]">
              <XCloseIcon
                height={24}
                width={24}
                stroke="#98A2B3"
                onClick={() => {
                  setMoveOutTenantModal(false);
                }}
                className="cursor-pointer"
              />
            </div>
          </Modal.Header>
          <Modal.Body
            classNames={{
              body: '!pb-0 pt-5',
            }}
            className="flex px-6 flex-col items-start gap-5 self-stretch"
          >
            <div className="flex flex-col items-start gap-4 self-stretch">
              <div className="flex items-start gap-6 self-stretch">
                {data.map((item) => {
                  const isChecked = selectedValue === item.name;

                  return (
                    <Card
                      key={item.name}
                      classNames={{
                        root: `flex p-4 items-start flex-0 border-solid cursor-pointer rounded-[12px] ${isChecked ? 'border-Brand-600 border-[2px]': 'border-Gray-200 border-[1px]'}`
                      }}
                      onClick={() => handleCardClick(item.name)}
                    //   style={{
                    //     cursor: 'pointer',
                    //     borderColor: isChecked ? '#228be6' : '#ccc', // Change border color based on isChecked
                    //   }}
                    >
                      <Group wrap="nowrap" align="flex-start">
                        <Radio
                        classNames={{
                            radio: `rounded-[99999px] ${ isChecked ? 'bg-Brand-600' : ''}`
                        }}
                          value={item.name}
                          checked={isChecked}
                          onChange={() => handleCardClick(item.name)}
                        />
                        <div className='flex flex-col items-start flex-0'>
                          <div className='flex items-start gap-1'>
                            <span className='text-Gray-700 text-sm font-medium leading-5'>{item.name}</span>
                        </div>
                          <span className='text-Gray-600 text-sm font-normal leading-5'>{item.description}</span>
                        </div>
                      </Group>
                    </Card> 
                  );
                })}
              </div>
              {selectedValue == 'Ladnlord agrred' && (
                 <LadnlordForm type={''} />
                )}
                {selectedValue === 'Tenant aborted' && (
                 <TenantForm type='QTG Qualified' />
                )}
            </div>
            <div className="flex pt-0  pb-6 items-start gap-3 self-stretch">
              <Button
                size="md"
                variant="outline"
                className="bg-white w-1/2 border-gray-300 text-gray-700 text-base font-semibold rounded-lg"
                classNames={{ label: 'text-gray-700' }}
                onClick={() => {
                  setMoveOutTenantModal(false);
                }}
              >
                Cancel
              </Button>
              <Button
                size="md"
                className="bg-Brand-600 w-1/2 hover:bg-Brand-600 text-base font-semibold rounded-lg"
              >
                Confirm
              </Button>
            </div>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
