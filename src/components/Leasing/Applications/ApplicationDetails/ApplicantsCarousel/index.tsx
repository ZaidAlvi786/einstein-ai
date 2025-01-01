import { ArrowDown, ArrowLeft, ArrowRightIcon, PlusIcon } from '@assets/iconComponents';
import { ActionIcon, Box, Button, Text } from '@mantine/core';
import CardCarousel from '@shared/components/CardCarousel';
import { ApplicantCard } from './ApplicantCard';
import useCarousel from '@hooks/useCarousel';

export interface Applicant {
  role: string;
  name: string;
  phone: string;
  email: string;
  status: string;
}

const applicants: Applicant[] = [
  {
    role: 'Primary applicant',
    name: 'Calvin Brown',
    phone: '212-212-1100',
    email: 'calvin@email.com',
    status: 'Verifying',
  },
  {
    role: 'Co-applicant',
    name: 'Calvin Brown',
    phone: '212-212-1100',
    email: 'calvin@email.com',
    status: 'Verified',
  },
  {
    role: 'Primary applicant',
    name: 'Calvin Brown',
    phone: '212-212-1100',
    email: 'calvin@email.com',
    status: 'Verifying',
  },
  {
    role: 'Co-applicant',
    name: 'Calvin Brown',
    phone: '212-212-1100',
    email: 'calvin@email.com',
    status: 'Verified',
  },
  {
    role: 'Primary applicant',
    name: 'Calvin Brown',
    phone: '212-212-1100',
    email: 'calvin@email.com',
    status: 'Verifying',
  },
  {
    role: 'Co-applicant',
    name: 'Calvin Brown',
    phone: '212-212-1100',
    email: 'calvin@email.com',
    status: 'Verified',
  },
];

export const ApplicantsCarousel = () => {
  const { handleScroll, setCarousel } = useCarousel();

  return (
    <Box className="flex flex-col gap-5">
      <Box className="flex justify-between items-center">
        <Text className="font-semibold text-[18px] leading-[28px] text-Gray-900">1 applicant</Text>
        <Box className="flex items-center">
          <Box className="flex gap-1.5 items-stretch">
            <ActionIcon
              variant="outline"
              size={36}
              className="bg-white text-sm text-base font-semibold rounded-lg border-Gray-300 text-Gray-700 hover:text-Gray-600"
            >
              <ArrowDown stroke="#667085" />
            </ActionIcon>
            <ActionIcon.Group>
              <ActionIcon
                variant="outline"
                size={36}
                className="bg-white text-sm text-base font-semibold rounded-lg border-Gray-300 text-Gray-700 hover:text-Gray-600 w-[36px]"
                onClick={() => handleScroll('previous')}
              >
                <ArrowLeft />
              </ActionIcon>
              <ActionIcon
                variant="outline"
                size={36}
                className="bg-white text-sm text-base font-semibold rounded-lg border-Gray-300 text-Gray-700 hover:text-Gray-600 w-[36px]"
                onClick={() => handleScroll('next')}
              >
                <ArrowRightIcon stroke="#667085" />
              </ActionIcon>
            </ActionIcon.Group>
            <Button
              variant="outline"
              className="bg-white text-sm text-base font-semibold rounded-lg border-Gray-300 text-Gray-700 hover:text-Gray-600"
              leftSection={<PlusIcon />}
            >
              Add
            </Button>
          </Box>
        </Box>
      </Box>
      <Box className="flex overflow-hidden border border-solid border-Gray-200 bg-Gray-50 px-1.5 rounded-[6px]">
        <CardCarousel
          setMoveCarousel={setCarousel}
          items={applicants}
          renderItem={(item) => <ApplicantCard applicant={item} />}
        />
      </Box>
    </Box>
  );
};
