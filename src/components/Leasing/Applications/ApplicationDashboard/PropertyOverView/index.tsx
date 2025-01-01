import { ArrowDown, ArrowLeft, ArrowRightIcon } from '@assets/iconComponents';
import { ActionIcon } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { PropertyCard } from '@components/Leasing/Applications/ApplicationDashboard/PropertyOverView/PropertyCard';
import CardCarousel from '@shared/components/CardCarousel';
import { useCarousel } from '../../../../../hooks';

export interface Property {
  id: number;
  name: string;
  address: string;
  city: string;
  applications: number;
}

const mockProperties: Property[] = [
  {
    id: 1,
    name: 'Whitestone Apartments',
    address: '123 Main St.',
    city: 'New York NY',
    applications: 14,
  },
  {
    id: 2,
    name: 'Whitestone Apartments',
    address: '123 Main St.',
    city: 'New York NY',
    applications: 14,
  },
  {
    id: 3,
    name: 'Whitestone Apartments',
    address: '123 Main St.',
    city: 'New York NY',
    applications: 14,
  },
  {
    id: 4,
    name: 'Whitestone Apartments',
    address: '123 Main St.',
    city: 'New York NY',
    applications: 14,
  },
  {
    id: 5,
    name: 'Whitestone Apartments',
    address: '123 Main St.',
    city: 'New York NY',
    applications: 14,
  },
  {
    id: 6,
    name: 'Whitestone Apartments',
    address: '123 Main St.',
    city: 'New York NY',
    applications: 14,
  },
];

const fetchProperties = (): Promise<Property[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProperties);
    }, 1000);
  });
};

export const PropertyOverview = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProperties = async () => {
      setLoading(true);
      const data = await fetchProperties();
      setProperties(data);
      setLoading(false);
    };

    getProperties();
  }, []);

  const { handleScroll, setCarousel } = useCarousel();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="gap-4 flex flex-col">
      <div className="flex overflow-hidden border border-solid border-Gray-200 bg-white px-1.5">
        <CardCarousel
          setMoveCarousel={setCarousel}
          items={properties}
          renderItem={(item) => <PropertyCard property={item} />}
        />
      </div>
      <div className="flex items-center h-[36px]">
        <div className="flex-1 text-xl leading-[30px] font-semibold">All properties</div>
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
              className="bg-white text-sm text-base font-semibold rounded-lg border-Gray-300 text-Gray-700 hover:text-Gray-600 w-[36px]"
              onClick={() => handleScroll('previous')}
            >
              <ArrowLeft />
            </ActionIcon>
            <ActionIcon
              variant="outline"
              size={36}
              className="bg-white text-sm text-base font-semibold rounded-lg border-Gray-300 text-Gray-700 hover:text-Gray-600 w-[36px]"
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
