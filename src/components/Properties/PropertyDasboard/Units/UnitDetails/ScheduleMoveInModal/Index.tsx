import { ArrowBlockRight, ArrowDown, XCloseIcon } from '@assets/iconComponents';
import { Button, Modal, rem } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useState } from 'react';
import CalendarIcon from '@assets/iconComponents/CalendarIcon';

interface Props {
  scheduleMoveInModalOpen: boolean;
  setScheduleMoveInModalOpen: (item: boolean) => void;
}
export function ScheduleMoveInModal({
  scheduleMoveInModalOpen,
  setScheduleMoveInModalOpen,
}: Props) {
  const [value, setValue] = useState<Date | null>(null);
  const icon = <CalendarIcon style={{ width: rem(18), height: rem(18) }} />;
  return (
    <Modal.Root
      size="sm"
      classNames={{
        content: 'rounded-xl',
        close: 'text-gray-400',
      }}
      opened={scheduleMoveInModalOpen}
      onClose={() => setScheduleMoveInModalOpen(false)}
    >
      <Modal.Overlay />
      {/* <Modal.Overlay /> */}
      <Modal.Content>
        <Modal.Header className="bg-[url(/src/assets/patterns/circle.svg)] bg-no-repeat flex flex-col items-start gap-4 bg-left-top p-0 relative">
          {/* <Agreement setModalSize= {setModalSize}/> */}
          <div className="flex px-6 pt-6 flex-col items-start gap-4 self-stretch">
            <span className="flex h-12 w-12 items-center justify-center rounded-[28px] border-[8px] border-solid border-Brand-50 bg-Brand-100">
              <span className="h-full flex w-full p-2 justify-center items-center flex-0">
                <ArrowBlockRight height={24} width={24} />
              </span>
            </span>
            <div className="flex flex-col items-start gap-1 self-stretch">
              <span className="text-Gray-900 text-lg font-semibold leading-7">Move apartment</span>
              <span className="text-Gray-600 text-sm font-regular leading-5">
                Please select aprtmnt you will wish to move too.
              </span>
            </div>
          </div>
          <div className="flex h-11 w-11 p-2 justify-center items-center absolute right-4 top-4 rounded-[8px]">
            <XCloseIcon
              height={24}
              width={24}
              stroke="#98A2B3"
              onClick={() => {
                setScheduleMoveInModalOpen(false);
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
          <DatePickerInput
            leftSection={icon}
            leftSectionPointerEvents="none"
            label="Pick date"
            placeholder="Pick date"
            value={value}
            onChange={setValue}
          />
          <div className="flex pt-0  pb-6 items-start gap-3 self-stretch">
            <Button
              size="md"
              variant="outline"
              className="bg-white w-1/2 border-gray-300 text-gray-700 text-base font-semibold rounded-lg"
              classNames={{ label: 'text-gray-700' }}
              onClick={() => {
                setScheduleMoveInModalOpen(false);
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
  );
}
