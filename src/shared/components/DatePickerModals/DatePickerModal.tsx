import { Avatar, Box, Button, Modal, Stack } from '@mantine/core';
import { useDatePicker } from '@shared/components/useDatePicker';
import { ReactNode } from 'react';

interface DatePickerModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  icon: ReactNode;
  handleContinue: () => void;
}

export const DatePickerModal = ({
  open,
  onClose,
  title,
  subtitle,
  icon,
  handleContinue,
}: DatePickerModalProps) => {
  const { DatePickerComponent } = useDatePicker();

  return (
    <Modal
      size={'sm'}
      classNames={{
        title: 'text-brand-960 font-semibold text-lg',
        content: 'rounded-xl modal-scroll',
        header: 'w-24 float-right bg-transparent absolute top-0 right-0',
        body: 'px-8 pb-5 ',
        close: 'text-gray-400 ',
      }}
      opened={open}
      onClose={onClose}
    >
      <Stack
        gap={25}
        className="bg-contain w-full max-w-full bg-[url(/src/assets/patterns/radial-center.svg)] bg-top-12.4  bg-no-repeat relative"
      >
        <Box className="mt-8">
          <Avatar size={48} classNames={{ root: 'border-8 border-solid border-Brand-50' }}>
            {icon}
          </Avatar>
        </Box>
        <Stack gap={1}>
          <Box className="text-[18px] leading-[28px] font-semibold">{title}</Box>
          <Box className="text-[14px] leading-[20px] font-normal">{subtitle}</Box>
        </Stack>

        <DatePickerComponent />

        <Box className="grid-cols-2 grid gap-2 pt-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-300 font-semibold text-base h-11 text-gray-700 rounded-[8px]"
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            className="rounded-lg h-11 hover:bg-brand-970 hover:text-white bg-brand-960 text-base text-white font-semibold ms-3"
            onClick={handleContinue}
          >
            Continue
          </Button>
        </Box>
      </Stack>
    </Modal>
  );
};
