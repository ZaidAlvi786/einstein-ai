import { CheckCircle } from '@assets/iconComponents';
import { Avatar, Box, Button, Modal, Stack, Text } from '@mantine/core';

interface EmailSuccessfullySentModalProps {
  open: boolean;
  onClose: () => void;
}

export const EmailSuccessfullySentModal: React.FC<EmailSuccessfullySentModalProps> = ({
  open,
  onClose,
}) => {
  return (
    <Modal
      opened={open}
      onClose={() => onClose()}
      classNames={{
        title: 'text-brand-960 font-semibold text-lg',
        content: 'rounded-xl modal-scroll',
        header: 'w-24 float-right bg-transparent absolute top-0 right-0',
        body: 'p-6 pt-4',
        close: 'text-gray-400 ',
      }}
      size={'md'}
    >
      <Stack gap={12}>
        <Avatar
          size={60}
          color="#DCFAE6"
          variant="filled"
          radius="xl"
          className="border-8 border-solid border-Success-50"
        >
          <CheckCircle stroke="#079455" />
        </Avatar>

        <Text className="font-semibold text-[24px] leading-[32px] text-Gray-900">
          Email Successfully sent!
        </Text>

        <Text className="font-normal text-[14px] leading-[20px] text-Gray-600">
          Email was sent out successfully to tenant, keep an eye..
        </Text>

        <Stack gap={8}>
          <Box className="grid-cols-2 grid gap-2 pt-3">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="border-gray-300 font-semibold text-base h-11 text-gray-700 rounded-lg"
            >
              Done
            </Button>
            <Button
              variant="outline"
              type="submit"
              className="rounded-lg h-11 hover:bg-brand-970 hover:text-white bg-brand-960 text-base text-white font-semibold ms-3"
            >
              New Application
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Modal>
  );
};
