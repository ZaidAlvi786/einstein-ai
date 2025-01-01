import { ArrowNarrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from '@assets/iconComponents';
import React, { useEffect, useState } from 'react';

interface PaginationProps {
  total: number; // Total number of pages
  initialPage?: number; // The initial active page
  onPageChange?: (page: number) => void; // Callback function when page changes
}

const PaginationSlider = ({ total, initialPage = 1, onPageChange }: PaginationProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePageChange = (index: number) => {
    setActiveIndex(index);
    onPageChange?.(index);
  };

  const next = () => {
    if (activeIndex < total -1) {
      handlePageChange(activeIndex + 1);
    } else {
        handlePageChange(0);
    }
  };

  const prev = () => {
    if (activeIndex > 0) {
      handlePageChange(activeIndex - 1);
    }
  };

  const rederPagintion = () => {
    const dots = [];

    for (let i = 0; i < total; i++) {
      dots.push(
        <div
          key={i}
          className={`w-2.5 h-2.5 rounded-md ${activeIndex === i ? 'bg-white' : ' bg-brand-940'}`}
        ></div>
      );
    }

    return dots;
  };

  return (
    <div className="flex justify-center items-center self-stretch gap-16">
      <div className="cursor-pointer" onClick={prev}>
        <ChevronLeftIcon className="text-white" />
      </div>
      <div className="flex space-x-4">{rederPagintion()}</div>
      <div className="cursor-pointer" onClick={next}>
        <ChevronRightIcon className="text-white" />
      </div>
    </div>
  );
};

export default PaginationSlider;
