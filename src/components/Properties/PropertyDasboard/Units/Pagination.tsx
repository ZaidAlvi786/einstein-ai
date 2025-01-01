import React from 'react';
import { Button } from '@mantine/core';

import { ArrowNarrowLeftIcon, ArrowRightIcon } from '@assets/iconComponents';

interface PaginationProps {
  total: number;
  page?: number;
  setCurrentPage?: (page: any) => void;
  onPageChange?: (name: string, page: number) => void;
}

export function CustomPagination({ total, page, setCurrentPage, onPageChange }: PaginationProps) {
  const [activePage, setActivePage] = React.useState(1);
  const getItemProps = (index: number) => ({
    variant: page === index ? 'filled' : 'text',
    color: 'gray',
    onClick: () => handlePageChange(index),
    className: page === index ? 'bg-gray-50 text-gray-800' : 'bg-white text-gray-600',
  });

  const next = () => {
    setCurrentPage?.(2);

    if ((page ?? 1) < total) {
      handlePageChange((page ?? 1) + 1);
    }
  };

  const prev = () => {
    if ((page ?? 1) > 1) {
      handlePageChange((page ?? 1) - 1);
    }
  };

  const handlePageChange = (page1: number) => {
    let name = page1 > (page ?? 1) ? 'Next' : 'Previous';
    setCurrentPage?.(page1);
    onPageChange?.(name, page1 ?? 1);
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

      if ((page ?? 1) > 4) {
        buttons.push(<span key="start-dots">...</span>);
      }

      const startPage = Math.max(2, (page ?? 1) - 2);
      const endPage = Math.min(total - 1, (page ?? 1) + 2);

      for (let i = startPage; i <= endPage; i++) {
        buttons.push(
          <Button key={i} {...getItemProps(i)}>
            {i}
          </Button>
        );
      }

      if ((page ?? 1) < total - 3) {
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
        disabled={page === 1}
        leftSection={<ArrowNarrowLeftIcon strokeWidth={2} className="h-4 w-4" />}
      >
        Previous
      </Button>
      <div className="flex items-center gap-2">{renderPageButtons()}</div>
      <Button
        variant="text"
        className="flex border border-gray-300 items-center gap-2 bg-white text-gray-700"
        onClick={next}
        disabled={page === total}
        rightSection={<ArrowRightIcon strokeWidth={2} className="h-4 w-4" />}
      >
        Next
      </Button>
    </div>
  );
}
