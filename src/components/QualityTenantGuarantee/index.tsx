import { ActionIcon } from '@mantine/core';
import { ArrowLeft, ArrowRightIcon, ChevronDownIcon } from '@assets/iconComponents';
import '@mantine/carousel/styles.css';
import CardCarousel from '@shared/components/CardCarousel';
import { mockedPropertyData } from '@components/mocks';
import { useCarousel } from '../../hooks';
import QualityTenantSliderList from './QualityTenantSliderList';

export function QualityTenant() {
  const { handleScroll, setCarousel } = useCarousel();
  const carouselData = mockedPropertyData;
  return (
    <>
      <div className="rounded-[10px] border-[1px] border-solid border-Gray-200 bg-white w-full overflow-hidden">
        <CardCarousel
          setMoveCarousel={setCarousel}
          items={carouselData}
          renderItem={(item) => <QualityTenantSliderList item={item} />}
        />
      </div>
      <div className="flex justify-between items-start gap-8 self-stretch pt-4">
        <div className="flex flex-col justify-center items-start gap-1 flex-0 self-stretch">
          <span className="text-Gray-900 text-xl font-semibold leading-30">All properties</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ActionIcon
            size={36}
            aria-label="Gradient action icon"
            className="rounded-lg"
            variant="default"
          >
            <ChevronDownIcon />
          </ActionIcon>

          <div className="flex gap-1.5 items-stretch">
            <ActionIcon.Group>
              <ActionIcon
                variant="outline"
                size={36}
                className="bg-white text-sm text-base font-semibold rounded-lg border-Gray-300 text-Gray-700 hover:text-Gray-600 w-[36px]"
              >
                <ArrowLeft onClick={() => handleScroll('previous')} />
              </ActionIcon>
              <ActionIcon
                variant="outline"
                size={36}
                className="bg-white text-sm text-base font-semibold rounded-lg border-Gray-300 text-Gray-700 hover:text-Gray-600 w-[36px]"
              >
                <ArrowRightIcon stroke="#667085" onClick={() => handleScroll('next')} />
              </ActionIcon>
            </ActionIcon.Group>
          </div>
        </div>
      </div>
    </>
  );
}
