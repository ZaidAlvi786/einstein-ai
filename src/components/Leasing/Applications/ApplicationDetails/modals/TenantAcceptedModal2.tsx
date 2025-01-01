import { CheckCircle } from '@assets/iconComponents';
import { Avatar, Box, Button, Group, Modal, Radio, Stack, Text } from '@mantine/core';
import { useForm, Controller } from 'react-hook-form';

interface TenantAcceptedModal2Props {
  open: boolean;
  onClose: () => void;
}

type FormValues = {
  action: string;
};

export const TenantAcceptedModal2: React.FC<TenantAcceptedModal2Props> = ({ open, onClose }) => {
  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      action: '',
    },
  });

  const selectedAction = watch('action');

  const onSubmit = (data: FormValues) => {
    console.log('Selected action:', data.action);
  };

  return (
    <Modal
      opened={open}
      onClose={() => onClose()}
      classNames={{
        title: 'text-brand-960 font-semibold text-lg',
        content: 'rounded-xl modal-scroll',
        header: 'w-24 float-right bg-transparent absolute top-0 right-0',
        body: 'p-6',
        close: 'text-gray-400 ',
      }}
      size={'md'}
    >
      <Stack gap={24}>
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
          Tenant accepted!
        </Text>

        <Text className="font-normal text-[14px] leading-[20px] text-Gray-600">
          You successfully accepted the tenant application. Please note, Tenant has not yet verified
          income and ID, these are required in order for the guarantee to be in place
        </Text>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={20}>
            <Controller
              name="action"
              control={control}
              render={({ field }) => (
                <Box className="flex gap-4">
                  <Box className="pt-1">
                    <Radio
                      {...field}
                      value="notify"
                      checked={selectedAction === 'notify'}
                      onChange={() => field.onChange('notify')}
                      color="#3E4784"
                    />
                  </Box>
                  <Box className="flex flex-1 flex-col">
                    <Text className="text-Gray-700 font-medium text-[14px] leading-[20px]">
                      Request documents
                    </Text>
                    <Text className="text-Gray-600 font-normal text-[14px] leading-[20px]">
                      Let the tenant know that they are pattently approved and ask them to send in
                      the required documents, (you will be able to edit the message on the next
                      screen)
                    </Text>
                  </Box>
                </Box>
              )}
            />

            <Controller
              name="action"
              control={control}
              render={({ field }) => (
                <Box className="flex gap-4">
                  <Box className="pt-1">
                    <Radio
                      {...field}
                      value="sign"
                      checked={selectedAction === 'sign'}
                      onChange={() => field.onChange('sign')}
                      color="#3E4784"
                    />
                  </Box>
                  <Box className="flex flex-1 flex-col">
                    <Text className="text-Gray-700 font-medium text-[14px] leading-[20px]">
                      Sign lease
                    </Text>
                    <Text className="text-Gray-600 font-normal text-[14px] leading-[20px]">
                      Ready to sign a lease? Let's get started right away.
                    </Text>
                  </Box>
                </Box>
              )}
            />

            <Box className="grid-cols-2 grid gap-2 pt-8">
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
                Continue
              </Button>
            </Box>
          </Stack>
        </form>
      </Stack>
    </Modal>
  );
};
