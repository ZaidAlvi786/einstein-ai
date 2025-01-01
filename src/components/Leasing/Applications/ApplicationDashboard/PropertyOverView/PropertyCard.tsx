import { Building04Icon } from '@assets/iconComponents';
import { Badge } from '@mantine/core';
import { Property } from '@components/Leasing/Applications/ApplicationDashboard/PropertyOverView';
import { useNavigate } from 'react-router-dom';
import { APP_PATHS } from '@routes/app-paths';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property: { id, name, address, city, applications },
}) => {
  const navigate = useNavigate();

  const getPropertyById = (id: any) => {
    navigate(`${APP_PATHS.properties.get()}/${id}`);
  };

  return (
    <div
      className="flex rounded-[6px] min-w-[290px] scroll-snap-align-start border-2 border-solid border-Gray-200 cursor-pointer shadow-[0px_1px_2px_0px_rgba(16,24,40,0.06)] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.1)] hover:border-Brand-600"
      onClick={() => getPropertyById(id)}
    >
      <div className="flex w-[90px] bg-Gray-100 items-center justify-center">
        <Building04Icon width={45} height={45} stroke="#000000" strokeWidth={1} />
      </div>
      <div className="flex flex-col justify-between p-3">
        <div className="text-[14px] font-medium leading-[20px]">{name}</div>
        <div className="text-[12px] font-normal leading-[18px]">{address}</div>
        <div className="text-[12px] font-normal leading-[18px]">{city}</div>
        <Badge
          classNames={{
            root: 'rounded-[6px] border border-solid py-0.5 px-1.5 flex items-center border-Brand-200 bg-Brand-50',
            label: 'text-center text-[12px] leading-18 font-medium text-Brand-700 lowercase',
          }}
          variant="outline"
        >
          {`${applications} applications`}
        </Badge>
      </div>
    </div>
  );
};
