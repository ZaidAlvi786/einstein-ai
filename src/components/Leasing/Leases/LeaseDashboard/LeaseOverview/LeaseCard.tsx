import { Building04Icon } from '@assets/iconComponents';
import { Badge } from '@mantine/core';
import { Property } from './Index';

interface LeaseCardProps {
    property: Property;
}

export const LeaseCard: React.FC<LeaseCardProps> = ({
    property: { name, address, city, leases },
}) => {
  return (
    <div className="flex min-w-[290px] scroll-snap-align-start">
      <div className="flex w-[90px] bg-Gray-100 items-center justify-center">
        <Building04Icon width={60} height={60} stroke="#000000" strokeWidth={1} />
      </div>
      <div className="flex flex-col justify-between p-3 gap-1">
        <div className="text-sm font-medium text-Gray-700 leading-5">{name}</div>
        <div className="text-xs font-normal text-Gray-600 leading-18">{address}</div>
        <div className="text-xs font-normal text-Gray-600 leading-18">{city}</div>
        <Badge
          classNames={{
            root: 'rounded-[6px] border-[1px] border-solid py-0.5 px-1.5 flex items-center border-Brand-200 bg-Brand-50',
            label: 'text-center text-xs leading-18 font-medium text-Brand-700 lowercase',
          }}
          variant="outline"
        >
          {`${leases} leases`}
        </Badge>
      </div>
    </div>
  );
};
