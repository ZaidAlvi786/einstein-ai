import SvgDelete01 from '@assets/iconComponents/Delete01';
import SvgEdit01 from '@assets/iconComponents/Edit01';
import { Status } from '@components/Status';
import { Card } from '@mantine/core';
import clsx from 'clsx';
import React from 'react';

interface ICardInfoProps {
  title?: string;
  subTitle?: string;
  hasSubTitle?: boolean;
  editIcon?: boolean;
  deleteIcon?: boolean;
  actionText?: string;
  hasStatus?: boolean;
  nestChildren?: React.ReactNode;
}

const CardInfo: React.FC<ICardInfoProps> = ({
  title,
  subTitle,
  hasSubTitle = false,
  actionText,
  deleteIcon = true,
  editIcon = true,
  hasStatus = false,
  nestChildren,
}) => (
  <Card
    withBorder
    classNames={{
      root: 'w-full flex flex-col gap-2 bg-white rounded-[12px] border-secondary border-solid border-[1px] shadow-sm',
    }}
  >
    <div className="flex items-center gap-4 justify-between">
      {hasStatus ? (
        <Status tab="" statusValue="Individual" />
      ) : (
        <h3 className="text-xs font-medium leading-4 text-Gray-700">{title}</h3>
      )}
      {editIcon && <SvgEdit01 className="cursor-pointer" />}
    </div>
    <div className="flex items-center justify-between">
      <p
        className={clsx('text-xs leading-4 ', {
          'font-medium text-Gray-700': hasSubTitle,
          'font-normal text-Gray-600': !hasSubTitle,
        })}
      >
        {subTitle}
      </p>
      {deleteIcon && <SvgDelete01 className="cursor-pointer" />}
    </div>
    {nestChildren && nestChildren}
    {actionText && <h3 className="text-xs font-semibold leading-4 ">{actionText}</h3>}
  </Card>
);

export default CardInfo;
