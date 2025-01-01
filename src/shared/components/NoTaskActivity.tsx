import { CheckCircle } from "@assets/iconComponents";
import { Image } from "@mantine/core";

interface Props {
    title: string;
    description: string;
    icon: JSX.Element
}
export function NoTaskActivity({title,description,icon}:Props) {
    return (
        <div className='flex overflow-hidden justify-center items-center self-stretch h-18.75 relative'>
        <div className='absolute h-sm_3 w-sm_3 top-[-132px] bg-[url(/src/assets/patterns/radial-lines.svg)] bg-top-sm-9  bg-no-repeat'>
          {/* <Image src='/src/assets/patterns/radial-lines.svg' width={480} height={480} /> */}
        </div>
        <div className='flex flex-col items-center gap-6 flex-0'>
          <div className='flex flex-col items-center gap-4 self-stretch'>
            <div className='flex h-12 w-12 p-3 justify-center items-center rounded-[10px] border-solid border-[1px] border-Gray-200 bg-white drop-shadow-xs'>
             {icon}
            </div>
            <div className='flex max-w-sm-4 px-10 flex-col items-center gap-1 self-stretch'>
              <span className='text-Gray-900 text-center text-base font-semibold leading-6'>{title}</span>
              <span className='text-Gray-600 text-center text-sm font-normal leading-5'>{description}</span>
            </div>
          </div>
        </div>
      </div>
    )
}