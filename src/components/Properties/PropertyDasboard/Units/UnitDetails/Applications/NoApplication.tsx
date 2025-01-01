import { DotGridIcon, PlusIcon, Users01Icon } from '@assets/iconComponents';
import { Button } from '@mantine/core';

interface Props {
  title: string;
  btnTitle2: string;
  btnTitle: string;
}
export function NoApplication({ btnTitle, btnTitle2, title }: Props) {
  return (
    <div className="flex justify-center items-center h-32.6 self-stretch relative">
      <div className="absolute z-10 h-sm_3 w-sm_3 left-[116px] top-[11px]">
        <div className="flex  justify-center items-center shrink-0 p-8.5">
          <DotGridIcon width={463} height={463} />
        </div>
      </div>
      <div
        className="flex justify-center items-center
        flex-0 pt-10 pb-8 px-8 flex-col gap-6 self-stretch
         relative border-b-[1px] border-solid border-Gray-200 bg-Gray-50"
      >
        <div className="flex  flex-col items-center gap-5 self-stretch">
          <div className="flex z-20 w-12 h-12 p-3 items-center justify-center rounded-[10px] border-[1px] border-solid border-Gray-200 bg-white drop-shadow-xs">
            <Users01Icon width={24} height={24} />
          </div>
          <div className="flex max-w-sm-4 flex-col items-center gap-2">
            <span className="z-20 text-Gray-900 text-lg font-semibold leading-7">{title}</span>
            <span className="z-20 text-Gray-600 text-sm font-regular text-center leading-5">
              Your search “Landing page design” did not match any projects. Please try again.
            </span>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Button
            size="md"
            variant="outline"
            className="bg-white z-20 text-sm text-[#363F72] text-base font-semibold rounded-[8px]"
            leftSection={<PlusIcon />}
          >
            {btnTitle2}
          </Button>
          <Button
            classNames={{
              section: 'w-5 h-5 m-0',
              root: 'flex gap-1.5 z-20 py-2 px-3 justify-center rounded-[8px] shadow-xs text-base h-11',
              inner: 'flex gap-1.5 justify-center shadow-xs text-base',
            }}
            className="bg-brand-960 hover:bg-brand-970 text-base font-semibold"
            leftSection={<PlusIcon />}
          >
            {btnTitle}
          </Button>
        </div>
        <div className="flex justify-center items-center gap-1.5">
          <span className="text-Brand-700 z-20 text-sm font-semibold leading-5 cursor-pointer">
            Show closed applications
          </span>
        </div>
      </div>
    </div>
  );
}
