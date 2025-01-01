import { clsx } from 'clsx';
import { PropsWithChildren } from 'react';

interface Props {
  className?: string;
  textClassName?: string;
}
export function CrossedTitle({ className, textClassName, children }: PropsWithChildren<Props>) {
  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <div className="flex-1 border-b border-gray-300 border-solid"></div>
      <span className={clsx('font-semibold leading-7 text-lg', textClassName)}>{children}</span>
      <div className="flex-1 border-b border-gray-300 border-solid"></div>
    </div>
  );
}
