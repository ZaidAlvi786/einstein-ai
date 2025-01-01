import { AnnotationQuestionIcon } from '@assets/iconComponents';
import { Avatar } from '@mantine/core';

interface TenantApprovalCardProps {
  avatarContent: React.ReactNode;
  title: string;
  description: string;
  timestamp: string;
  onDecline: () => void;
  onApprove: () => void;
  declineLabel?: string;
  approveLabel?: string;
}

export const TenantApprovalCard: React.FC<TenantApprovalCardProps> = ({
  avatarContent,
  title,
  description,
  timestamp,
  onDecline,
  onApprove,
  declineLabel = 'Decline',
  approveLabel = 'Approve',
}) => {
  return (
    <div className="flex border border-solid border-Gray-200 gap-4 p-4 bg-white">
      <div className="rounded-full">
        <Avatar color="blue" radius="xl" className="border-[4px] border-solid border-Brand-50">
          {avatarContent}
        </Avatar>
      </div>

      <div className="flex flex-1 justify-between">
        <div className="flex flex-col gap-1 w-[354px]">
          <div className="font-medium text-[14px] leading-[20px] text-Gray-700">{title}</div>
          <div className="font-normal text-[14px] leading-[20px] text-Gray-600">{description}</div>
        </div>
        <div className="flex flex-col justify-between gap-3 w-[125px]">
          <span className="flex justify-end items-center text-Error-700 text-[12px] leading-[18px] font-medium">
            {timestamp}
          </span>
          <div className="flex justify-between text-[14px] font-semibold leading-[20px] ">
            <span className="text-Gray-600 cursor-pointer" onClick={onDecline}>
              {declineLabel}
            </span>
            <span className="text-Brand-700 cursor-pointer" onClick={onApprove}>
              {approveLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
