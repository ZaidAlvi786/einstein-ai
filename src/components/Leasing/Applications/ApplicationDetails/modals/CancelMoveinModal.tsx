import { XCircleIcon } from '@assets/iconComponents';
import { Avatar, Box, Button, Input, Modal, Stack, Switch, Text } from '@mantine/core';
import { useForm } from 'react-hook-form';

interface CancelMoveinModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormValues {
  closeApplication: boolean;
  notifyTenant: boolean;
  reason: string;
}

export const CancelMoveinModal: React.FC<CancelMoveinModalProps> = ({ open, onClose }) => {
  const { handleSubmit, register, watch } = useForm<FormValues>();

  const handleConfirm = (data: FormValues) => {
    console.log(data);
    onClose();
  };

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
          color="#EAECF5"
          variant="filled"
          radius="xl"
          className="border-8 border-solid border-Brand-50"
        >
          <XCircleIcon stroke="#344054" />
        </Avatar>

        <Box className="flex flex-col gap-1">
          <Text className="font-semibold text-[24px] leading-[32px] text-Gray-900">
            Cancel move in
          </Text>

          <Text className="font-normal text-[14px] leading-[20px] text-Gray-600">
            Please select apartment you will wish to move to.
          </Text>
        </Box>

        <form onSubmit={handleSubmit(handleConfirm)}>
          <Box className="flex flex-col gap-3">
            <Box className="flex flex-col gap-2">
              <Text className="text-Gray-700 font-medium text-[14px] leading-[20px]">
                Reason given (optional)
              </Text>
              <Input {...register('reason')} placeholder="Reason given for moving out" />
            </Box>

            <Box component="label" className="flex gap-4">
              <Box className="pt-1">
                <Switch color="#3E4784" {...register('closeApplication')} />
              </Box>
              <Box className="flex flex-1 flex-col">
                <Text className="text-Gray-700 font-medium text-[14px] leading-[20px]">
                  Close application
                </Text>
                <Text className="text-Gray-600 font-normal text-[14px] leading-[20px]">
                  Mark application as closed.
                </Text>
              </Box>
            </Box>

            <Box component="label" className="flex gap-4">
              <Box className="pt-1">
                <Switch color="#3E4784" {...register('notifyTenant')} />
              </Box>
              <Box className="flex flex-1 flex-col">
                <Text className="text-Gray-700 font-medium text-[14px] leading-[20px]">
                  Notify tenant
                </Text>
                <Text className="text-Gray-600 font-normal text-[14px] leading-[20px]">
                  Let tenant know that the application is closed, (you will be able to edit the
                  message on the next screen)
                </Text>
              </Box>
            </Box>

            <Stack gap={8}>
              <Box className="grid-cols-2 grid gap-2 pt-3">
                <Button
                  variant="outline"
                  type="button"
                  onClick={onClose}
                  className="border-gray-300 font-semibold text-base h-11 text-gray-700 rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  type="submit"
                  className="rounded-lg h-11 hover:bg-brand-970 hover:text-white bg-brand-960 text-base text-white font-semibold ms-3"
                >
                  {watch('notifyTenant') ? 'Continue' : 'Confirm'}
                </Button>
              </Box>
            </Stack>
          </Box>
        </form>
      </Stack>
    </Modal>
  );
};
