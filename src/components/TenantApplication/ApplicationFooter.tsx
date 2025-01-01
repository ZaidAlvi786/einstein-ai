import { Button } from '@mantine/core';

interface Props {
  handlers: {
    increment: () => void;
    decrement: () => void;
    set: (value: number) => void;
  };
}
export const ApplicationFooter = ({ handlers }: Props) => {
  return (
    <div className="flex justify-end items-center gap-4 w-full pt-4">
      <Button className='text-Gray-600' variant="subtle">Cancel</Button>
      <div className="flex justify-end items-center gap-3 flex-0 w-full">
        <Button
          size="md"
          variant="outline"
          className="bg-white text-sm text-[#363F72] text-base font-semibold border-gray-300 border-[1px] border-solid rounded-[8px]"
        >
          Sent link to prospect
        </Button>
        <Button
          classNames={{
            section: 'w-5 h-5 m-0',
            root: 'flex gap-1.5 py-2 px-3 justify-center rounded-[8px] shadow-xs text-base h-11',
            inner: 'flex gap-1.5 justify-center shadow-xs text-base',
          }}
          className="bg-brand-960 hover:bg-brand-970 text-base font-semibold"
          onClick={handlers.increment}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};