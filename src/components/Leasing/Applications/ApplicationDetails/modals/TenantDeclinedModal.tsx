import { XCircleIcon } from '@assets/iconComponents';
import { Avatar, Box, Button, Group, Modal, Radio, Stack, Switch, Text } from '@mantine/core';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';

interface TenantDeclinedModalProps {
  open: boolean;
  onClose: () => void;
}

type FormValues = {
  notifyTenant: boolean;
};

export const TenantDeclinedModal: React.FC<TenantDeclinedModalProps> = ({ open, onClose }) => {
  const { handleSubmit, watch, register } = useForm<FormValues>({
    defaultValues: {
      notifyTenant: true,
    },
  });

  const selectedAction = watch('notifyTenant');

  const onSubmit = (data: FormValues) => {
    console.log('Selected action:', data.notifyTenant);
  };

  return (
    <Modal
      opened={open}
      onClose={onClose}
      classNames={{
        title: 'text-brand-960 font-semibold text-lg',
        content: 'rounded-xl modal-scroll',
        header: 'w-24 float-right bg-transparent absolute top-0 right-0',
        body: 'p-6 pt-10',
        close: 'text-gray-400 ',
      }}
      size={'md'}
    >
      <Stack gap={12}>
        <Avatar
          size={60}
          color="#FEE4E2"
          variant="filled"
          radius="xl"
          className="border-8 border-solid border-Error-50"
        >
          <XCircleIcon stroke="#D92D20" />
        </Avatar>

        <Text className="font-semibold text-[24px] leading-[32px] text-Gray-900">
          Tenant declined!
        </Text>

        <Text className="font-normal text-[14px] leading-[20px] text-Gray-600">
          Tenant application is declined. Now choose your next steps.
        </Text>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={8}>
            <Box className="flex gap-4">
              <Box className="pt-1">
                <Switch {...register('notifyTenant')} color="#3E4784" />
              </Box>
              <Box className="flex flex-1 flex-col">
                <Text className="text-Gray-700 font-medium text-[14px] leading-[20px]">
                  Notify tenant
                </Text>
                <Text className="text-Gray-600 font-normal text-[14px] leading-[20px]">
                  Let tenant know that they are delined, (you will be able to etid the masage on the
                  next screen).
                </Text>
              </Box>
            </Box>

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
                className={clsx('rounded-lg h-11 text-base font-semibold ms-3', {
                  'bg-Gray-200': !watch('notifyTenant'),
                  'hover:bg-brand-970 hover:text-white bg-brand-960 text-white':
                    watch('notifyTenant'),
                })}
                disabled={!watch('notifyTenant')}
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
