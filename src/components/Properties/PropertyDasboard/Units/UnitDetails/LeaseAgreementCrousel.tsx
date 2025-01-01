import {
  ArrowLeft,
  ArrowRightIcon,
  ChevronDownIcon,
  EyeIcon,
  FileDownload,
  PdfFileIcon,
  PlusIcon,
} from '@assets/iconComponents';
import { Carousel, Embla } from '@mantine/carousel';
import { ActionIcon, Button, Container } from '@mantine/core';
import { useCallback, useState } from 'react';
import { EndLeaseModal } from './EndLease/Index';
import { AmendLeaseModal } from './AmendLease/Index';
import { TenantOverviewPanel } from '@shared/components/TenantOverviewPanel';

interface Props {
  carouselData: {
    title?: string;
    leaseDate?: string;
    cardData: {
      id?: number; // Optional if not all data objects will have an ID
      name?: string;
      size?: string;
    }[];
  };
  type: string;
}
export function LeaseAgreementCarousel({ carouselData,type }: Props) {
  const [embla, setEmbla] = useState<Embla | null>(null);
  const [endLeaseModalOpen, setEndLeaseModalModalOpen] = useState(false);
  const [ammendLeaseModalOpen, setAmmendLeaseModalOpen] = useState(false);
  console.log(type);
  
  const goToNext = useCallback(() => {
    if (embla) embla.scrollNext();
  }, [embla]);

  const goToPrev = useCallback(() => {
    if (embla) embla.scrollPrev();
  }, [embla]);
  return (
    <Container
      classNames={{
        root: 'm-0 p-0',
      }}
    >
      <div className="flex flex-col items-satrt gap-4 self-stretch">
        <div className="flex justify-end items-start gap-4 self-stretch">
          <div className="flex flex-col justify-center items-start gap-1 flex-0 self-stretch">
            <span className="text-Gray-900 text-xl font-semibold leading-30">
              {carouselData.title}
            </span>
            <span className="text-Gray-600 text-sm font-medium leading-5 line-clamp-1 self-stretch text-ellipsis">
              {carouselData.leaseDate}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <ActionIcon size={36} aria-label="Gradient action icon" variant="default">
              <ChevronDownIcon />
            </ActionIcon>
            <ActionIcon size={36} aria-label="Previous slide" variant="default" onClick={goToPrev}>
              <ArrowLeft />
            </ActionIcon>
            <ActionIcon size={36} aria-label="Next slide" variant="default" onClick={goToNext}>
              <ArrowRightIcon stroke="#667085" />
            </ActionIcon>
            <Button
              size="md"
              variant="outline"
              className="bg-white text-sm text-Gray-700 text-base font-semibold rounded-[8px] border-[1px] border-Gray-300"
              onClick={()=> setEndLeaseModalModalOpen(true)}
            >
              End
            </Button>
            <Button
              size="md"
              variant="outline"
              className="bg-white text-sm text-Gray-700 text-base font-semibold rounded-[8px] border-[1px] border-Gray-300"
              onClick={()=> setAmmendLeaseModalOpen(true)}
            >
              Emmend
            </Button>
          </div>
        </div>
        <div className="rounded-[10px] border-[1px] border-solid border-Gray-200 px-1.5 bg-Gray-50">
          <Carousel
            align="start"
            slideSize={290}
            classNames={{
              slide:
                'rounded-[12px] border-solid border-[1px] border-Gray-200   gap-1 flex items-start bg-white shadow-sm',
              container: 'p-1.5 items-center gap-1.5 self-stretch',
              viewport: '',
              controls: '!hidden',
              root: '',
            }}
            getEmblaApi={setEmbla}
            withControls={false} // Hide default controls
          >
            {carouselData.cardData.map((property, index: number) => (
              <Carousel.Slide key={index}>
                <div className="flex items-start gap-3 px-4 py-2 flex-0">
                  <PdfFileIcon height={40} width={32} />
                  <div className="flex flex-col items-start gap-1 flex-0">
                    <div className="flex flex-col items-start self-stretch">
                      <span className="text-Gray-700 text-sm font-medium leading-5 line-clamp-1 text-ellipsis">
                        {property.name}
                      </span>
                      <span className="text-Gray-600 text-sm font-regular leading-5 line-clamp-1 text-ellipsis">
                        {property.size}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center gap-0.5">
                    <div className="flex p-1 justify-center items-center gap-2 rounded-[8px]">
                      <FileDownload width={16} height={16} />
                    </div>
                    <div className="flex p-1 justify-center items-center gap-2 rounded-[8px]">
                      <EyeIcon width={16} height={16} />
                    </div>
                  </div>
                </div>
              </Carousel.Slide>
            ))}
          </Carousel>
        </div>
       <TenantOverviewPanel/>
      </div>
      <EndLeaseModal endLeaseModalOpen={endLeaseModalOpen} setEndLeaseModalModalOpen={setEndLeaseModalModalOpen}/>
      <AmendLeaseModal ammendLeaseModalOpen={ammendLeaseModalOpen} setAmmendLeaseModalOpen={setAmmendLeaseModalOpen} type={type} />
    </Container>
  );
}
