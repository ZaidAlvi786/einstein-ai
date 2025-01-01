import { AlertSquareIcon, CheckCircle, XCircleIcon } from '@assets/iconComponents';
import Microscope from '@assets/iconComponents/Microscope';
import { Avatar, Button } from '@mantine/core';
import clsx from 'clsx';

interface TenantStatusProps {
  type?: 'screening' | 'qualified' | 'disqualified' | 'approved';
  title: string;
  verificationStatus?: 'pending' | 'verifying' | 'failed';
}

export const TenantStatus: React.FC<TenantStatusProps> = ({
  type = 'screening',
  title,
  verificationStatus,
}) => {
  return (
    <div
      className={clsx(
        'flex gap-4 items-center py-4 pr-4 pl-6 text-[24px] font-semibold leading-[32px] text-white rounded-[12px]',
        {
          'bg-brand-940 ': type === 'screening',
          'bg-Success-600': type === 'approved' || type === 'qualified',
          'bg-Error-600': type === 'disqualified',
        }
      )}
    >
      <div className={'border-2 border-solid border-[#FFFFFF1A] rounded-full p-1'}>
        <Avatar variant="transparent" className="border-2 border-solid border-[#FFFFFF66]">
          {type === 'screening' ? (
            <Microscope width={28} height={28} stroke="white" />
          ) : type === 'disqualified' ? (
            <XCircleIcon width={28} height={28} stroke="white" />
          ) : (
            <CheckCircle width={28} height={28} stroke="white" />
          )}
        </Avatar>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-center">
          <span>{title}</span>
          {/* <div className="flex gap-3 items-center">
            <span className="text-white font-semibold text-[14px] leading-[20px] cursor-pointer">
              Decline tenant
            </span>
            <Button className="bg-white text-Brand-700 rounded-[8px]">Accept tenant</Button>
          </div> */}
        </div>
        {verificationStatus && (
          <div className="flex font-medium text-[14px] leading-[20px] items-center w-fit gap-2.5">
            <div
              className={clsx('rounded-[6px] py-0.5 px-2 border border-solid', {
                'bg-[#FFFAEB] text-[#B54708] border-[#FEDF89]':
                  verificationStatus === 'pending' || verificationStatus === 'verifying',
                'bg-[#FEF3F2] text-Error-700 border-[#FECDCA]': verificationStatus === 'failed',
              })}
            >
              {verificationStatus === 'pending' || verificationStatus === 'verifying'
                ? 'Pending income and ID verification'
                : 'Income and Id verification failed'}
            </div>
            <div className="flex items-center gap-1">
              {verificationStatus === 'pending' ? (
                <>
                  <AlertSquareIcon />
                  <span>Verify now</span>
                </>
              ) : verificationStatus === 'verifying' ? (
                <>
                  <Microscope stroke="white" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Reverify</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
