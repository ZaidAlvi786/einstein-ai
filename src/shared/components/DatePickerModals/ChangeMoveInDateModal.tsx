import { ArrowBlockRight } from '@assets/iconComponents';
import { DatePickerModal } from '@shared/components/DatePickerModals/DatePickerModal';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const ChangeMoveInDateModal = ({ open, onClose }: Props) => {
  const handleContinue = () => {
    console.log('Selected date for change move-in date.');
  };

  return (
    <DatePickerModal
      open={open}
      onClose={onClose}
      title="Change move in date"
      subtitle="Please select the date you will to change to"
      icon={<ArrowBlockRight stroke="#344054" />}
      handleContinue={handleContinue}
    />
  );
};
