import { ArrowDown, ChevronDownIcon, ChevronUpIcon } from '@assets/iconComponents';
import { ActionIcon, Avatar, Box, Button, Group, Stack, Text } from '@mantine/core';
import { ScreeningData } from './ScreeningPanel';
import clsx from 'clsx';

interface ScreeningPanelDataCardProps {
  data: ScreeningData;
  clickView(): void;
  isViewOpened: boolean;
  type: string | undefined;
}

export const ScreeningPanelDataCard: React.FC<ScreeningPanelDataCardProps> = ({
  data: { title, status, count, icon },
  clickView,
  isViewOpened,
  type
}) => {
  return (
    <Box
      className={clsx('rounded-t-[12px] flex-1 border-[1px] border-solid border-Gray-200 bg-white', {
        'rounded-b-[12px]': !isViewOpened,
        'border-[1px] border-solid border-brand-300 shadow-[0px_0px_0px_4px_rgba(158,119,237,0.24),_0px_1px_2px_0px_rgba(16,24,40,0.06),_0px_1px_3px_0px_rgba(16,24,40,0.1)]':
          isViewOpened,
      })}
    >
      <Stack className={`p-6 border-b-[1px] border-solid border-b-Gray-200 ${type === 'lease' ? 'gap-4':'gap-6'}`}>
        <Group gap={16}>
          <Text className="font-semibold text-base text-Gray-900 leading-6">{title}</Text>
          <Box
            className={`rounded-[6px] border border-solid border-Brand-200 py-0.5 px-1.5 ${status.color}`}
          >
            <Text className="font-medium text-xs leading-18">{status.label}</Text>
          </Box>
        </Group>
        <Group gap={16}>
          <Avatar size={60} className="rounded-full border-[8px] border-solid border-Brand-50">
            {icon}
          </Avatar>
          <Text className="font-semibold text-2xl leading-8">{count}</Text>
        </Group>
      </Stack>
      <Group className={`px-6 py-4 cursor-pointer ${ type === 'lease' && 'gap-1.5'}`} justify="flex-end" onClick={clickView}>
        <ActionIcon variant="transparent" className={`${type === 'lease' && 'w-5 h-5'}`}>
          {isViewOpened ? <ChevronUpIcon /> : <ChevronDownIcon stroke="#363F72" />}
        </ActionIcon>
        <Button variant="transparent" className={`${type === 'lease' && 'p-0'}`}>
          <Text className="font-semibold text-sm leading-5 text-Brand-700">View</Text>
        </Button>
      </Group>
    </Box>
  );
};
