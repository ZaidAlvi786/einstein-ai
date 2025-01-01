import { CalendarIcon } from '@assets/iconComponents';
import { Box, Button, Group, Popover, Text } from '@mantine/core';
import { DatePicker, DatePickerProps } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { format } from 'date-fns';
import { useState, FC } from 'react';

export const useDatePicker = () => {
  const [date, setDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const handleApply = () => {
    setDate(selectedDate);
    close();
  };

  const handleChangeDate = (date: Date | null) => {
    setSelectedDate(date);
  };

  const getDayProps: DatePickerProps['getDayProps'] = (date) => {
    const today = new Date();
    
    // Check if the current date matches the provided date
    const isCurrentDate =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
    
    // Check if the date is selected
    const isSelectedDate =
      selectedDate &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  
    return {
      style: {
        backgroundColor: isSelectedDate ? '#F2F4F7' : '', // Gray background for selected date
        borderRadius: isSelectedDate ? '50%' : '', // Rounded background for selected date
        position: 'relative',
        textAlign: 'center',
        color: '#344054'
      },
      className: `${isCurrentDate ? 'current-day' : ''} ${isSelectedDate ? 'selected-day' : ''}`, // Add classes as needed
    };
  };

  const DatePickerComponent: FC = () => (
    <Group>
      <Popover
        opened={opened}
        onClose={close}
        position="bottom-start"
        shadow="md"
        classNames={{ dropdown: 'p-0' }}
      >
        <Popover.Target>
          <Button
            variant="outline"
            leftSection={<CalendarIcon />}
            onClick={open}
            className="border-Gray-300 text-Gray-500 hover:text-Gray-500"
          >
            {date ? format(date, 'yyyy-MM-dd') : 'Select Date'}
          </Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Box className="p-4 py-0">
            <Box className="flex justify-between gap-4" mt="md">
              <Box className="rounded-[8px] border border-solid border-Gray-300 py-2 px-3.5 flex-1">
                <Text className="font-normal text-[16px] leading-[24px] text-Gray-500">
                  {selectedDate ? format(selectedDate, 'yyyy-MM-dd') : 'Select Date'}
                </Text>
              </Box>
              <Button
                variant="outline"
                className="rounded-[8px] hover:text-Gray-700 font-semibold text-[14px] leading-[20px] text-Gray-700 border-Gray-300 h-auto"
                onClick={() => handleChangeDate(new Date())}
              >
                Today
              </Button>
            </Box>
          </Box>

          <Box className="border-solid border-b border-Gray-200 p-4 pt-2">
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              defaultDate={new Date()}
              getDayProps={getDayProps}
              classNames={{
                day: 'hover:!bg-Gray-50 hover:!rounded-full'
              }}
            />
          </Box>

          <Group justify="space-between" mt="md" className="p-4 pt-0">
            <Button
              variant="outline"
              onClick={close}
              className="border-gray-300 font-semibold text-base text-gray-700 rounded-[8px] hover:text-gray-700 flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              className="rounded-lg hover:bg-brand-970 hover:text-white bg-brand-960 text-base text-white font-semibold ms-3 flex-1"
              onClick={handleApply}
            >
              Apply
            </Button>
          </Group>
        </Popover.Dropdown>
      </Popover>
    </Group>
  );

  return { selectedDate, DatePickerComponent };
};
