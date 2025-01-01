import { SvgUser06, Users04Icon } from '@assets/iconComponents';
import SvgEdit01 from '@assets/iconComponents/Edit01';
import { Status } from '@components/Status';
import React from 'react';

interface IImageCardProps {
  title: React.ReactNode;
  icon?: React.ReactNode;
  statusValue?: string;
  subTitle: string;
  nestChildren: React.ReactNode;
  editIcon?: boolean;
  isStatus?: boolean;
}

const ImageCard: React.FC<IImageCardProps> = ({
  title,
  icon,
  statusValue = '',
  subTitle,
  nestChildren,
  editIcon = true,
  isStatus = true,
}) => (
  <div className="border-solid border-[1px] border-Gray-200 rounded-[12px] p-4">
    <div className="flex justify-between">
      <div className="flex gap-2">
        {icon || <SvgUser06 />}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            {title}
            {isStatus && <Status tab="" statusValue={statusValue} />}
          </div>
          <div className="text-Gray-600 text-base font-normal">{subTitle}</div>
          {nestChildren}
        </div>
      </div>
      {editIcon && <SvgEdit01 className="cursor-pointer" />}
    </div>
  </div>
);

export default ImageCard;
