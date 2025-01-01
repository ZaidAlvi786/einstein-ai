import React from 'react';
import { Button } from '@mantine/core';

import { ArrowNarrowLeftIcon, ArrowRightIcon } from '@assets/iconComponents';

interface PaginationProps {
  total: number; // Total number of pages
  initialPage?: number; // The initial active page
  onPageChange?: (page: number) => void; // Callback function when page changes
}

export function CustomPagination({ total, initialPage = 1, onPageChange }: PaginationProps) {
  const [activePage, setActivePage] = React.useState(initialPage);

  const getItemProps = (index: number) => ({
    variant: activePage === index ? 'filled' : 'text',
    color: 'gray',
    onClick: () => handlePageChange(index),
    className: activePage === index ? "bg-gray-50 text-gray-800" : "bg-white text-gray-600"
  });

  const next = () => {
    if (activePage < total) {
      handlePageChange(activePage + 1);
    }
  };

  const prev = () => {
    if (activePage > 1) {
      handlePageChange(activePage - 1);
    }
  };

  const handlePageChange = (page: number) => {
    setActivePage(page);
    onPageChange?.(page);
  };

  const renderPageButtons = () => {
    const buttons = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        buttons.push(
          <Button key={i} {...getItemProps(i)}>
            {i}
          </Button>
        );
      }
    } else {
      buttons.push(
        <Button key={1} {...getItemProps(1)}>
          1
        </Button>
      );

      if (activePage > 4) {
        buttons.push(<span key="start-dots">...</span>);
      }

      const startPage = Math.max(2, activePage - 2);
      const endPage = Math.min(total - 1, activePage + 2);

      for (let i = startPage; i <= endPage; i++) {
        buttons.push(
          <Button key={i} {...getItemProps(i)}>
            {i}
          </Button>
        );
      }

      if (activePage < total - 3) {
        buttons.push(<span key="end-dots">...</span>);
      }

      buttons.push(
        <Button key={total} {...getItemProps(total)}>
          {total}
        </Button>
      );
    }

    return buttons;
  };

  return (
    <div className="flex items-center justify-between gap-4 pt-3 px-6 pb-4">
      <Button
        variant="text"
        className="flex items-center gap-2 border border-gray-300 bg-white text-gray-700"
        onClick={prev}
        disabled={activePage === 1}
        leftSection={<ArrowNarrowLeftIcon strokeWidth={2} className="h-4 w-4" />}
      >
         Previous
      </Button>
      <div className="flex items-center gap-2">{renderPageButtons()}</div>
      <Button
        variant="text"
        className="flex border border-gray-300 items-center gap-2 bg-white text-gray-700"
        onClick={next}
        disabled={activePage === total}
        rightSection={<ArrowRightIcon strokeWidth={2} className="h-4 w-4" />}
      >
        Next
        
      </Button>
    </div>
  );
}
