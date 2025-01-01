import { StepIconBase } from '@assets/iconComponents';
import { Stepper } from '@mantine/core';
import { useState } from 'react';

export const FlowMap = () => {
  const [active, setActive] = useState(3);

  return (
    <div className="flex flex-col gap-5 flex-1">
      <div className="font-semibold text-Gray-900 text-[18px] leading-[28px]">
        Lease flow map
      </div>
      <div className="flex flex-col min-h-[200px] justify-center flex-1 gap-40">
        <div className='flex flex-col gap-3  '>
        <Stepper
          iconSize={24}
          active={active}
          onStepClick={setActive}
          completedIcon={<StepIconBase />}
          icon={<StepIconBase />}
          color="#3E4784"
          classNames={{root:'pl-14 pr-[49px]',separator: 'm-0 pr-2.5'}}
        >
          <Stepper.Step  />
          <Stepper.Step  />
          <Stepper.Step classNames={{
            
          }} />
          <Stepper.Step />
        </Stepper>
        <div className='flex justify-between'>
            <div className='flex flex-col items-center self-stretch'>
                <span className='text-Gray-700 text-sm font-semibold leading-5'>Sign lease and enroll</span>
                <span className='text-Gray-600 text-sm font-normal leading-5'>Name and Email</span>
            </div>
            <div className='flex flex-col items-center self-stretch'>
                <span className='text-Gray-700 text-sm font-semibold leading-5'>Move in</span>
                <span className='text-Gray-600 text-sm font-normal leading-5'>Website and location</span>
            </div>
            <div className='flex flex-col items-center self-stretch'>
                <span className='text-Gray-700 text-sm font-semibold leading-5'>Renew lease</span>
                <span className='text-Gray-600 text-sm font-normal leading-5'>Start collaborating</span>
            </div>
            <div className='flex flex-col items-center self-stretch'>
                <span className='text-Gray-700 text-sm font-semibold leading-5'>Move out</span>
                <span className='text-Gray-600 text-sm font-normal leading-5'>Automatic sharing</span>
            </div>
        </div>
        </div>
      </div>
    </div>
  );
};
