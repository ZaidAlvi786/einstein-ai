import { Carousel, Embla } from '@mantine/carousel';
import { Container } from '@mantine/core';
import React from 'react';

interface ICarouselProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  slideSize?: string;
  setMoveCarousel: (value: Embla | null) => void;
  classNames?: {
    slide?: string;
    container?: string;
    viewport?: string;
    controls?: string;
    root?: string;
  };
}

const CardCarousel = <T,>({
  items,
  renderItem,
  slideSize = '25%',
  setMoveCarousel,
  classNames = {},
}: ICarouselProps<T>) => (
  <Carousel
    align="start"
    slideSize={slideSize}
    classNames={{
      slide:
        classNames.slide ||
        'rounded-[6px] border-[1px] border-solid border-Gray-200 bg-white shadow-sm flex-0',
      container: classNames.container || 'p-1.5 items-center gap-1.5 self-stretch',
      viewport: classNames.viewport || 'overflow-hidden',
      controls: classNames.controls || '!hidden',
      root: classNames.root || 'w-full',
    }}
    getEmblaApi={setMoveCarousel}
    withControls={false}
    slidesToScroll={4}
  >
    {items.map((item, index) => (
      <Carousel.Slide key={index} className="w-full">
        {renderItem(item)}
      </Carousel.Slide>
    ))}
  </Carousel>
);

export default CardCarousel;
