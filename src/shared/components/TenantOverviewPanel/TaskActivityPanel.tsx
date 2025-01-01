import { AnnotationQuestionIcon } from '@assets/iconComponents';
import { TenantApprovalCard } from '@shared/components/TenantOverviewPanel/TenantApprovalCard';

export const TaskActivityPanel = () => {
  const handleDecline = () => {
    console.log('Declined');
  };

  const handleApprove = () => {
    console.log('Approved');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-Gray-900 text-xl leading-7 font-semibold">Upcoming tasks</div>
      <TenantApprovalCard
        avatarContent={<AnnotationQuestionIcon height={20} width={20} />}
        title="Approve or decline tenant"
        description="Tenant has been qualified for the QTG program, it is now your choice to make the final decision to accept the tenant or not."
        timestamp="1 day ago"
        onDecline={handleDecline}
        onApprove={handleApprove}
        declineLabel="Reject"
        approveLabel="Accept"
      />
      <div className="text-Gray-900 text-xl leading-7 font-semibold">Activity</div>
      <div className="flex flex-col">
        <TenantApprovalCard
          avatarContent={<AnnotationQuestionIcon height={20} width={20} />}
          title="Approve or decline tenant"
          description="Tenant has been qualified for the QTG program, it is now your choice to make the final decision to accept the tenant or not."
          timestamp="1 day ago"
          onDecline={handleDecline}
          onApprove={handleApprove}
          declineLabel="Reject"
          approveLabel="Accept"
        />
        <TenantApprovalCard
          avatarContent={<AnnotationQuestionIcon height={20} width={20} />}
          title="Approve or decline tenant"
          description="Tenant has been qualified for the QTG program, it is now your choice to make the final decision to accept the tenant or not."
          timestamp="1 day ago"
          onDecline={handleDecline}
          onApprove={handleApprove}
          declineLabel="Reject"
          approveLabel="Accept"
        />
        <TenantApprovalCard
          avatarContent={<AnnotationQuestionIcon height={20} width={20} />}
          title="Approve or decline tenant"
          description="Tenant has been qualified for the QTG program, it is now your choice to make the final decision to accept the tenant or not."
          timestamp="1 day ago"
          onDecline={handleDecline}
          onApprove={handleApprove}
          declineLabel="Reject"
          approveLabel="Accept"
        />
      </div>
    </div>
  );
};
