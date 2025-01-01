import { MicroscopeIcon, Users04Icon } from '@assets/iconComponents';
import { Avatar, Badge } from '@mantine/core';
import { formatNumberToCurrency } from '@utils/currency';

interface HeaderProps {
  name: string;
  phone: string;
  email: string;
  monthlyIncome: number;
  isVerified: string;
}

export const Header: React.FC<HeaderProps> = ({
  name,
  phone,
  email,
  monthlyIncome,
  isVerified,
}) => {
  return (
    <div className="flex gap-8 px-8 pt-4 pb-8">
      <Avatar className="w-[160px] h-[160px] border-4 border-solid border-white shadow-lg">
        <Users04Icon width={53} height={60} stroke="#475467" strokeWidth="4" />
      </Avatar>
      <div className="flex flex-col gap-1">
        <Badge
          classNames={{
            root: 'rounded-[6px] border border-solid py-0.5 px-1.5 flex items-center border-Gray-200 bg-Brand-50',
            label: 'text-center text-[12px] leading-18 font-medium text-Gray-700 normal-case',
          }}
          variant="outline"
        >
          Primary applicant
        </Badge>
        <span className="text-Gray-900 font-semibold leading-[38px] text-[30px]">{name}</span>
        <span className="text-Gray-700 font-medium leading-[24px] text-[16px]">{phone}</span>
        <span className="text-Gray-700 font-medium leading-[24px] text-[16px]">{email}</span>
        <div className="flex items-center text-Gray-600 font-medium leading-[20px] text-[14px] gap-2">
          <span>Monthly income: {formatNumberToCurrency(monthlyIncome)}</span>
          <div className="flex items-center gap-1 text-Gray-700">
            <MicroscopeIcon />
            <span>{isVerified ? 'Verified' : 'Verifying'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
