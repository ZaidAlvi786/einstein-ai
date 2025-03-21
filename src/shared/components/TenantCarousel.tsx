import {
  ArrowLeft,
  ArrowRightIcon,
  ChevronDownIcon,
  Edit01Icon,
  MicroscopeIcon,
  PlusIcon,
  Trash01Icon,
  Users01Icon,
  Users04Icon,
  VerifiedIcon,
} from '@assets/iconComponents';
import { AddTenantModal } from '@components/Properties/PropertyDasboard/Units/UnitDetails/AddTenant/Index';
import { Carousel, Embla } from '@mantine/carousel';
import { ActionIcon, Badge, Button, Container } from '@mantine/core';
import { APP_PATHS } from '@routes/app-paths';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  carouselData: {
    title?: string;
    leaseDate?: string;
    cardData: {
      id?: number; // Optional if not all data objects will have an ID
      name?: string;
      badge?: string;
      email?: string;
      phone?: string;
      status?: string;
    }[];
  };
}
export function TenantCarousel({ carouselData }: Props) {
  const [embla, setEmbla] = useState<Embla | null>(null);
  const [addTenantModalOpen, setAddTenantModalOpen] = useState(false);
  const navigate=useNavigate()

  const goToNext = useCallback(() => {
    if (embla) embla.scrollNext();
  }, [embla]);

  const goToPrev = useCallback(() => {
    if (embla) embla.scrollPrev();
  }, [embla]);

  return (
    <>
      <Container
        classNames={{
          root: 'm-0 p-0 w-full',
        }}
      >
        <div className="flex flex-col items-satrt gap-4 self-stretch">
          <div className="flex justify-end items-start gap-4 self-stretch">
            <div className="flex flex-col justify-center items-start gap-1 flex-0 self-stretch">
              <span className="text-Gray-900 text-xl font-semibold leading-30">
                {carouselData.title}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <ActionIcon size={36} aria-label="Gradient action icon" variant="default">
                <ChevronDownIcon />
              </ActionIcon>
              <ActionIcon
                size={36}
                aria-label="Previous slide"
                variant="default"
                onClick={goToPrev}
              >
                <ArrowLeft />
              </ActionIcon>
              <ActionIcon size={36} aria-label="Next slide" variant="default" onClick={goToNext}>
                <ArrowRightIcon stroke="#667085" />
              </ActionIcon>
              <Button
                size="md"
                variant="outline"
                className="bg-white text-sm text-Gray-700 text-base font-semibold rounded-[8px] border-[1px] border-Gray-300"
                leftSection={<PlusIcon />}
                onClick={() => {
                  navigate(APP_PATHS.leasing.addTenant.get());
                }}
              >
                Add
              </Button>
            </div>
          </div>
          <div className="rounded-[10px] border-[1px] border-solid border-Gray-200 px-1.5 bg-Gray-50">
            <Carousel
              align="start"
              slideSize={280}
              classNames={{
                slide: 'rounded-[6px] flex items-start bg-white shadow-sm flex-0',
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
                  <div className="flex justify-between px-3 py-2 items-start flex-0">
                    <div className="flex items-start gap-4">
                      <div className={`flex flex-col items-center self-stretch ${property.status ? 'justify-between': 'justify-center'}`}>
                      <span className="flex h-12 w-12  rounded-[9999px] border-[8px] border-solid border-Brand-50 bg-Brand-100">
                        <span className="h-full flex w-full p-2 ustify-center items-center flex-0">
                          <Users04Icon />
                        </span>
                      </span>
                      {property.status && (
                      <div className='flex justify-center items-center gap-1.5'>
                        {property.status == 'verifing' ? (<MicroscopeIcon width={16} height={16} />):(
                          <VerifiedIcon width={16} height={16} />
                        )}
                        <span className={`text-xs font-semibold leading-18 capitalize ${property.status === 'verified' ? 'text-Success-700': 'text-Gray-700'}`}>{property.status}</span>
                      </div>
                      )}
                      </div>
                      <div className="flex flex-col gap-0.5 items-start">
                        <Badge
                          classNames={{
                            root: 'felx px-1.5 py-0.5 items-center rounded-[6px] border-[1px] border-solid border-Gray-200 bg-Gray-50',
                            label: 'text-Gray-700 text-center text-xs font-medium leading-18',
                          }}
                        >
                          {property.badge}
                        </Badge>
                        <div className="flex items-start gap-6">
                          <span className="text-Gray-700 text-sm font-medium leading-5">
                            {property.name}
                          </span>
                        </div>
                        <span className="text-Gray-600 text-sm font-regular leading-5">
                          {property.phone}
                        </span>
                        <span className="text-Gray-600 text-sm font-regular leading-5">
                          {property.email}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                      <div className="flex p-1 justify-center items-center gap-2 rounded-[8px]">
                        <Edit01Icon width={20} />
                      </div>
                      <div className="flex p-1 justify-center items-center gap-2 rounded-[8px]">
                        <Trash01Icon />
                      </div>
                    </div>
                  </div>
                </Carousel.Slide>
              ))}
            </Carousel>
          </div>
        </div>
      </Container>
      <AddTenantModal
        addTenantModalOpen={addTenantModalOpen}
        setAddTenantModalOpen={setAddTenantModalOpen} type={''}      />
    </>
  );
}
