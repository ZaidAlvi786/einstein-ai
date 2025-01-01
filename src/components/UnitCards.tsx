import { Button, Card } from '@mantine/core';
import { modelCardUnitsData } from './mocks';

export function UnitCards() {
  const unitsData = modelCardUnitsData;

  return (
    <ul className="flex gap-9 flex-wrap list-none">
      {unitsData.map((element) => (
        <Card
          key={element.unit}
          withBorder
          classNames={{
            root: 'rounded-2xl flex-1',
          }}
        >
          <Card.Section withBorder className="p-6">
            <h5 className="text-sm font-semibold text-gray-700 font-['Inter']">Unit {element.unit}</h5>
            <div className="flex gap-4 mt-2">
              <strong className="text-tempBig tracking-tight">{element.rent}</strong>
              <ul className="flex flex-col text-sm-semibold text-gray-600 list-none">
                <li>{element.bedrooms} Bed</li>
                <li>{element.bathrooms} Bath</li>
                <li>{element.sqFt} Sq ft.</li>
              </ul>
            </div>
          </Card.Section>
          <Card.Section className="flex px-6 py-4 justify-end">
            <Button variant="subtle" className="text-sm-semibold text-[#363F72] p-0 h-5">
              Details
            </Button>
          </Card.Section>
        </Card>
      ))}
    </ul>
  );
}
