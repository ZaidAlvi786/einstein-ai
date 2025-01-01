import { Divider } from '@mantine/core';
import { clsx } from 'clsx';
import { PropsWithChildren } from 'react';

interface Props {
  heading?: string;
}
export function CustomTittle({ heading }: PropsWithChildren<Props>) {
  return (
    <div className="flex flex-col  self-stretch gap-5" >
      <div>
        <h2 className="text-lg leading-7 font-semibold">{heading}</h2>
        <div className="text-sm font-normal text-gray-600 mt-1">
          Manage your team members and their account permissions here.
        </div>
      </div>

      <div>
        <Divider my="sm" />
      </div>
    </div>
  );
}
