import { CalendarIcon } from '@assets/iconComponents';
import { DatePickerModal } from '@shared/components/DatePickerModals/DatePickerModal';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const ScheduleMoveInModal = ({ open, onClose }: Props) => {
  const handleContinue = () => {
    console.log('Selected date for move-in schedule.');
  };

  return (
    <DatePickerModal
      open={open}
      onClose={onClose}
      title="Schedule move in"
      subtitle="Please select the date you will to change to"
      icon={<CalendarIcon />}
      handleContinue={handleContinue}
    />
  );
};
