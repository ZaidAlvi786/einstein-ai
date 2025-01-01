import { Embla } from '@mantine/carousel';
import { useCallback, useState } from 'react';

type TDirection = 'next' | 'previous';
const useCarousel = () => {
  const [carousel, setCarousel] = useState<Embla | null>(null);

  const handleScroll = useCallback(
    (direction: TDirection) => {
      if (!carousel) return;
      if (direction === 'next') {
        carousel.scrollNext();
      } else {
        carousel.scrollPrev();
      }
    },
    [carousel]
  );

  return { handleScroll, setCarousel };
};

export default useCarousel;
