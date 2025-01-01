import { ArrowDown, ArrowLeft, ArrowRightIcon } from '@assets/iconComponents';
import { ActionIcon } from '@mantine/core';
import { useState } from 'react';
import CardCarousel from '@shared/components/CardCarousel';
import { useCarousel } from '../../../../../hooks';
import { LeaseCard } from './LeaseCard';

export interface Property {
  id: number;
  name: string;
  address: string;
  city: string;
  leases: number;
}

const mockProperties: Property[] = [
  {
    id: 1,
    name: 'Whitestone Apartments',
    address: '123 Main St.',
    city: 'New York NY',
    leases: 14,
  },
  {
    id: 2,
    name: 'Whitestone Apartments',
    address: '123 Main St.',
    city: 'New York NY',
    leases: 14,
  },
  {
    id: 3,
    name: 'Whitestone Apartments',
    address: '123 Main St.',
    city: 'New York NY',
    leases: 14,
  },
  {
    id: 4,
    name: 'Whitestone Apartments',
    address: '123 Main St.',
    city: 'New York NY',
    leases: 14,
  },
  {
    id: 5,
    name: 'Whitestone Apartments',
    address: '123 Main St.',
    city: 'New York NY',
    leases: 14,
  },
  {
    id: 6,
    name: 'Whitestone Apartments',
    address: '123 Main St.',
    city: 'New York NY',
    leases: 14,
  },
];

export const LeaseOverview = () => {
  const [properties] = useState<Property[]>(mockProperties);
  const { handleScroll, setCarousel } = useCarousel();

  return (
    <div className="gap-4 flex flex-col">
      <div className="flex overflow-hidden border-[1px] rounded-[10px] border-solid border-Gray-200 bg-white px-1.5">
        <CardCarousel
          setMoveCarousel={setCarousel}
          items={properties}
          renderItem={(item) => <LeaseCard property={item} />}
        />
      </div>
      <div className="flex items-center h-9">
        <div className="flex-1 text-xl leading-xl-1 font-semibold">All properties</div>
        <div className="flex gap-1.5 items-stretch">
          <ActionIcon
            variant="outline"
            size={36}
            className="bg-white text-sm text-base font-semibold rounded-lg border-Gray-300 text-Gray-700 hover:text-Gray-600"
          >
            <ArrowDown stroke="#667085" />
          </ActionIcon>
          <ActionIcon.Group>
            <ActionIcon
              variant="outline"
              size={36}
              className="bg-white text-sm text-base font-semibold rounded-lg border-Gray-300 text-Gray-700 hover:text-Gray-600 w-9"
              onClick={() => handleScroll('previous')}
            >
              <ArrowLeft />
            </ActionIcon>
            <ActionIcon
              variant="outline"
              size={36}
              className="bg-white text-sm text-base font-semibold rounded-lg border-Gray-300 text-Gray-700 hover:text-Gray-600 w-9"
              onClick={() => handleScroll('next')}
            >
              <ArrowRightIcon stroke="#667085" />
            </ActionIcon>
          </ActionIcon.Group>
        </div>
      </div>
    </div>
  );
};
