import {
  Edit01Icon,
  MicroscopeIcon,
  SvgDefaultUser01,
  Trash01Icon,
  VerifiedIcon,
} from '@assets/iconComponents';
import { Avatar, Box, Text } from '@mantine/core';
import CustomBadge from '@shared/components/CustomBadge';
import { Applicant } from '.';
import clsx from 'clsx';

interface ApplicantCardProps {
  applicant: Applicant;
}

export const ApplicantCard: React.FC<ApplicantCardProps> = ({
  applicant: { role, name, email, phone, status },
}) => {
  return (
    <Box className="p-3 rounded-[6px] bg-white border-2 border-solid border-Gray-50 shadow-[0px_1px_2px_0px_#1018280F,0px_1px_3px_0px_#1018281A] flex justify-between hover:border-Brand-600 cursor-pointer w-full">
      <Box className="flex gap-4">
        <Box className="flex flex-col justify-between gap-2">
          <Avatar size={65} className="rounded-[28px]">
            <SvgDefaultUser01 stroke="black" />
          </Avatar>
          <Box className="flex items-center justify-between gap-2">
            {status === 'Verifying' ? <MicroscopeIcon width={18} height={18} /> : <VerifiedIcon />}
            <Text
              className={clsx('font-semibold text-[12px] leading-[18px]', {
                'text-Gray-700': status === 'Verifying',
                'text-Success-700': status === 'Verified',
              })}
            >
              {status}
            </Text>
          </Box>
        </Box>
        <Box className="flex flex-col justify-between">
          <CustomBadge
            bgColor="Gray-50"
            borderColor="Gray-200"
            textColor="Gray-700"
            label={role}
            className="text-[12px] leading-[18px]"
          />
          <Text className="font-medium text-[14px] leading-[20px]">{name}</Text>
          <Text className="font-normal text-[14px] leading-[20px]">{phone}</Text>
          <Text className="font-normal text-[14px] leading-[20px]">{email}</Text>
        </Box>
      </Box>
      <Box className="flex flex-col gap-2">
        <Edit01Icon width={16} height={16} stroke="#475467" className="cursor-pointer" />
        <Trash01Icon width={16} height={16} stroke="#475467" className="cursor-pointer" />
      </Box>
    </Box>
  );
};
