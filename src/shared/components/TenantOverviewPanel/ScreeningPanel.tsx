import {
  ArrowLeft,
  ArrowRightIcon,
  Building08Icon,
  CurrencyDollarCircleIcon,
  DotGridIcon,
  FileDownload03Icon,
  FileSearch03Icon,
  Home05Icon,
  ImageUserIcon,
  Luggage02Icon,
  PlusIcon,
  PrinterIcon,
} from '@assets/iconComponents';
import { ActionIcon, Box, Grid, Group, Stack, Text } from '@mantine/core';
import { ScreeningPanelDataCard } from './ScreeningPanelDataCard';
import { useState } from 'react';
import ScreeningPanelDataCardView from './ScreeningPanelDataCardView';
import clsx from 'clsx';

export interface ScreeningData {
  id: string;
  title: string;
  status: { value: string; label: string; color: string };
  count: number;
  icon: React.ReactNode;
}

const screeningData: ScreeningData[] = [
  {
    id: 'eviction-records',
    title: 'Eviction records',
    status: { value: 'search-processing', label: 'Search processing', color: 'bg-Brand-50' },
    count: 0,
    icon: <FileSearch03Icon stroke="#363F72" />,
  },
  {
    id: 'criminal-history',
    title: 'Criminal history',
    status: { value: 'report-ready', label: 'Report ready processing', color: 'bg-Success-50' },
    count: 0,
    icon: <Building08Icon stroke="#363F72" />,
  },
  {
    id: 'monthly-income',
    title: 'Monthly income',
    status: { value: 'verifying', label: 'Verifying', color: 'bg-Brand-50' },
    count: 2000,
    icon: <CurrencyDollarCircleIcon />,
  },
  {
    id: 'id',
    title: 'ID',
    status: { value: 'verified', label: 'Verified', color: 'bg-Success-50' },
    count: 1,
    icon: <ImageUserIcon />,
  },
  {
    id: 'addresses',
    title: 'Addresses',
    status: { value: 'self-reported', label: 'Self reported', color: 'bg-Gray-50' },
    count: 2,
    icon: <Home05Icon width={22} height={20} />,
  },
  {
    id: 'employment-history',
    title: 'Employment history',
    status: { value: 'self-reported', label: 'Self reported', color: 'bg-Gray-50' },
    count: 3,
    icon: <Luggage02Icon />,
  },
];
interface Props {
  type: string | undefined
}
export const ScreeningPanel = ({type}:Props) => {
  const [applicantRole, setApplicantRole] = useState('primary');
  const [currentSelectedView, setCurrentSelectedView] = useState<number | null>(null);

  const chunkSize = 2;
  const rows = [];

  for (let i = 0; i < screeningData.length; i += chunkSize) {
    rows.push(screeningData.slice(i, i + chunkSize));
  }

  const handleViewClick = (rowIndex: number, cardIndex: number) => {
    if (rowIndex * chunkSize + cardIndex === currentSelectedView) setCurrentSelectedView(null);
    else setCurrentSelectedView(rowIndex * chunkSize + cardIndex);
  };

  const handleToggleApplicantRole = (role: string) => () => setApplicantRole(role);

  return (
    <Stack gap={24}>
      {type !== 'lease' && (
      <Group justify="space-between" align="center">
        <Text className="text-Gray-900 font-semibold text-lg leading-7">2 screenings</Text>
        <Group align="center" gap={8}>
          <ActionIcon.Group>
            <ActionIcon variant="default" size="xl" className="rounded-[10px]">
              <ArrowLeft stroke="#667085" />
            </ActionIcon>
            <ActionIcon variant="default" size="xl" className="rounded-[10px]">
              <ArrowRightIcon stroke="#667085" />
            </ActionIcon>
          </ActionIcon.Group>
          <ActionIcon variant="default" size="xl" className="rounded-[10px]">
            <PlusIcon stroke="#344054" />
          </ActionIcon>
        </Group>
      </Group>
      )}
      <Group className={`border-[1px] border-solid border-Gray-200 gap-1 grid grid-cols-2 bg-white ${type === 'lease' ? 'p-1.5 rounded-[12px]': 'p-1 rounded-[10px]'}`}>
        <Group
          align="center"
          className={clsx('px-3 py-2 rounded-[6px] cursor-pointer col-span-1', {
            'bg-Gray-50 shadow-[0px_1px_3px_rgba(16,24,40,0.1),0px_1px_2px_rgba(16,24,40,0.06)]':
              applicantRole === 'primary',
              '!bg-Gray-100 h-11 gap-2':type === 'lease' && applicantRole === 'primary'
          })}
          gap={8}
          onClick={handleToggleApplicantRole('primary')}
        >
          <Text className="font-semibold text-sm leading-5 text-Gray-700">
            Calvin Brown
          </Text>
          <Box className="rounded-[6px] border border-solid border-Brand-200 bg-Brand-50 py-0.5 px-1.5">
            <Text className="font-medium text-xs leading-18">Primary applicant</Text>
          </Box>
        </Group>
        <Group
          align="center"
          className={clsx('px-3 py-2 rounded-[6px] cursor-pointer col-span-1', {
            'bg-Gray-50 shadow-[0px_1px_3px_rgba(16,24,40,0.1),0px_1px_2px_rgba(16,24,40,0.06)]':
              applicantRole === 'co',
          })}
          gap={8}
          onClick={handleToggleApplicantRole('co')}
        >
          <Text className="font-semibold text-sm leading-5 text-Gray-700">
            Calvin Brown
          </Text>
          <Box className="rounded-[6px] border border-solid border-Brand-200 bg-Brand-50 py-0.5 px-1.5">
            <Text className="font-medium text-xs leading-18">Co applicant</Text>
          </Box>
        </Group>
      </Group>
      <Group
        className="font-semibold text-Brand-700"
        gap={16}
        style={{ fontSize: '14px', lineHeight: '20px' }}
        justify="flex-end"
      >
        <Group align="center" gap={type === 'lease' ? 6: 8}>
          <PrinterIcon width={20} height={20} />
          <Text className={`cursor-pointer ${type === 'lease' ? 'text-Brand-700 text-sm font-semibold leading-5':''}`} onClick={() => console.log('Print all clicked')}>
            Print all
          </Text>
        </Group>
        <Group align="center" gap={type === 'lease' ? 6: 8}>
          <FileDownload03Icon />
          <Text className={`cursor-pointer ${type === 'lease' ? 'text-Brand-700 text-sm font-semibold leading-5':''}`} onClick={() => console.log('Download all clicked')}>
            Download all
          </Text>
        </Group>
      </Group>
      {rows.length > 0 ? (
      rows.map((row, index) => (
        <Stack key={index} gap={0}>
          <Group gap={24}>
            {row.map((data, idx) => (
              <ScreeningPanelDataCard
                key={idx}
                data={data}
                isViewOpened={currentSelectedView === index * chunkSize + idx}
                clickView={() => handleViewClick(index, idx)}
                type = {type}
              />
            ))}
          </Group>
          <Box className="mt-1">
            {currentSelectedView !== null && Math.floor(currentSelectedView / 2) === index && (
              <ScreeningPanelDataCardView type={type} />
            )}
          </Box>
        </Stack>
      ))
    ):(
      <div className='flex h-[394px] px-4 justify-center items-end self-stretch relative'>
        <div className='flex h-sm_3 w-sm_3 absolute left-[116px] -top-12'>
          <div className='flex h-sm_3 w-sm_3 p-[8.5px] justify-center items-center shrink-0'>
            <DotGridIcon />
          </div>
        </div>
        <div className='flex flex-col items-center gap-8 flex-0 z-10'>
          <div className='flex flex-col items-center gap-5'>
            <div className='flex h-12 w-12 p-3 justify-center items-center rounded-[10px] border-[1px] border-solid border-Gray-200 bg-white shadow-xs'>
              <Home05Icon height={24} width={24} />
            </div>
            <div className='flex max-w-sm-4 flex-col items-center gap-2 self-stretch'>
              <span className='text-Gray-900 text-center text-lg font-semibold leading-7'>No added units</span>
              <span className='text-Gray-600 text-center text-sm font-normal leading-5'>Your search "Landing page design" did not match any projects. Please try again.</span>
            </div>
          </div>
        </div>
      </div>
    )}
    </Stack>
  );
};
