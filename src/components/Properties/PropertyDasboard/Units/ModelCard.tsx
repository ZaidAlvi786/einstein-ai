import { ActionIcon, Button, Card } from '@mantine/core';
import { useSelector } from 'react-redux';
import { getMultipleModelUnits } from '@stores/propertySlice';
import { useState } from 'react';
import { UnitModelDataInterface, MultipleUnitInterface } from '@interfaces/property.interface';
import { ArrowLeft, ArrowRightIcon } from '@assets/iconComponents';
import { ModelCardDetails } from './ModelCardDetails';

export default function ModelCard() {
  const [detailModel, setDetailModel] = useState<UnitModelDataInterface>(
    null as unknown as UnitModelDataInterface
  );
  const [detailModelOpen, setDetailModelOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 3;
  const multipleUnitDetails = useSelector(
    getMultipleModelUnits
  ) as unknown as MultipleUnitInterface;

  const handleDetailsClick = (element: UnitModelDataInterface) => {
    if (element.id === detailModel?.id) {
      setDetailModelOpen(false);
      setDetailModel(null as unknown as UnitModelDataInterface);
      return;
    }
    setDetailModel(element);
    setDetailModelOpen(true);
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < multipleUnitDetails.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    } else {
      setCurrentPage((prevPage) => (prevPage === 0 ? 3 : prevPage - 1));
    }
  };
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedDetails = multipleUnitDetails.slice(startIndex, endIndex);

  return (
    <div className="w-full">
      {displayedDetails.length > 0 && (
        <ActionIcon.Group className="my-4 flex justify-between">
          <ActionIcon
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            variant="outline"
            size={36}
            className="bg-white text-sm text-base font-semibold rounded-lg border-Gray-300 text-Gray-700 hover:text-Gray-600 w-[36px]"
          >
            <ArrowLeft />
          </ActionIcon>
          <ActionIcon
            variant="outline"
            size={36}
            className="bg-white text-sm text-base font-semibold rounded-lg border-Gray-300 text-Gray-700 hover:text-Gray-600 w-[36px]"
            onClick={handleNextPage}
            disabled={
              (currentPage + 1) * itemsPerPage >=
              multipleUnitDetails.filter(
                (element: { unit_type: string }) => element.unit_type === 'multiple'
              ).length
            }
          >
            <ArrowRightIcon stroke="#667085" />
          </ActionIcon>
        </ActionIcon.Group>
      )}
      <div className="flex gap-4 flex-wrap items-start content-start self-stretch ">
        {displayedDetails
          .filter((element: { unit_type: string }) => element.unit_type === 'multiple')
          .map((element: UnitModelDataInterface) => (
            <Card
              className={`flex flex-col items-start flex-0 min-h-[188px] max-w-[33.3%] shadow  ${element.id === detailModel?.id ? 'border-[1px] border-solid -bottom-sm-3 boder-b-0 border-Gray-blue-300 shadow-ring-brand-shadow-sm' : ''}`}
              key={element.id}
              withBorder
              classNames={{
                root: `${element.id === detailModel?.id ? 'rounded-t-[12px]' : 'rounded-[12px]'}`,
              }}
            >
              <Card.Section withBorder className="p-6 flex flex-col items-start gap-2 self-stretch">
                <div className="flex flex-col gap-2">
                  <div className="text-[14px] font-semibold text-gray-700 font-['Inter']">
                    {element.unit_info?.name}
                  </div>
                  <div className="flex gap-4">
                    <div className="text-[48px] font-semibold text-gray-900  font-['Inter']">
                      {element.units?.length}
                    </div>
                    <ul className="flex mt-1 flex-col text-sm-semibold text-gray-600 list-none">
                      <li>{element.bedrooms} Bed</li>
                      <li>{element.bathrooms} Bath</li>
                      <li>{element.square_feet} Sq ft.</li>
                    </ul>
                  </div>
                </div>
              </Card.Section>
              <Card.Section className="flex py-4 justify-end w-full">
                <Button
                  onClick={() => handleDetailsClick(element)}
                  variant="subtle"
                  className="text-sm-semibold text-[#363F72] p-0 h-5"
                >
                  {element.id === detailModel?.id ? 'Close' : 'Details'}
                </Button>
              </Card.Section>
            </Card>
          ))}
      </div>
      {detailModelOpen && (
        <div>
          <ModelCardDetails detailModel={detailModel} setDetailModelOpen={setDetailModelOpen} />
        </div>
      )}
    </div>
  );
}
