import React, { useEffect, useMemo, useRef, useState } from "react";
import { useGetUserInvoiceHistoryQuery } from "@/app/lib/features/payment/paymentApi";
import {
  Button,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Pagination,
  Spinner,
} from "@nextui-org/react";
import moment from "moment";
import ViewInvoiceModal from "./ViewInvoiceModal";
import DownloadPDF from "./DownloadPdfButton";

const BillHistory = ({ invoices, setInvoices }) => {
  const classNames = useMemo(
    () => ({
      table: [
        "mb-2",
        "border-spacing-y-2",
        "border-separate",
        "rounded-[24px]",
      ],
      th: [
        "bg-transparent",
        "text-white",
        "helvetica-font",
        "font-medium",
        "text-[10px]",
        "leading-[14px]",
      ],
      thead: "[&>tr:last-child]:hidden",
    }),
    []
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // For total pagination pages
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const [isOpenCancelSubsModal, setisOpenCancelSubsModal] = useState(false);
  const perPage = 10;
  const observerRef = useRef(null);

  const {
    data: InvoiceHistory,
    refetch: getUserInvoiceHistory,
    isLoading,
  } = useGetUserInvoiceHistoryQuery({
    page_number: currentPage,
    per_size: perPage,
  });

  useEffect(() => {
    if (InvoiceHistory?.data) {
      setInvoices((prev) => [...prev, ...InvoiceHistory.data]);
      setHasMore(
        currentPage < Math.ceil(InvoiceHistory.total_records / perPage)
      );
    }
  }, [InvoiceHistory]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMore, isLoading]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    getUserInvoiceHistory();
  };

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setisOpenCancelSubsModal(true);
  };

  return isLoading ? (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[22px] text-white font-bold helvetica-font mb-[14px]">{`History`}</h2>
        </div>
      </div>
      <Skeleton className="w-full rounded-3xl mb-4">
        <div className="h-[44px] w-full "></div>
      </Skeleton>
    </>
  ) : (
    <div>
      {invoices?.length > 0 && (
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[22px] text-white font-bold helvetica-font mb-[14px]">{`History`}</h2>
            </div>
            <div className="mr-8">
              <DownloadPDF />
            </div>
          </div>
          <Table
            removeWrapper
            classNames={classNames}
            className="helvetica-font"
          >
            <TableHeader className="text-[10px]">
              <TableColumn className="h-auto">Invoice ID</TableColumn>
              <TableColumn className="h-auto text-center">Date</TableColumn>
              <TableColumn className="h-auto text-center">Type</TableColumn>
              <TableColumn className="h-auto text-center w-52">
                Amount
              </TableColumn>
              <TableColumn className="h-auto text-center w-[70px]">
                Details
              </TableColumn>
            </TableHeader>
            {invoices?.length > 0 ? (
              <TableBody>
                {invoices.map((item) => (
                  <TableRow
                    key={item.id}
                    className="rounded-3xl pb-4 planning-card shadow-billingCard"
                  >
                    <TableCell className="font-normal text-[14px] leading-[14px] text-white py-2.5 ps-[18px] rounded-l-3xl mt-2">
                      {item?.invoice_id}
                    </TableCell>
                    <TableCell className="font-normal text-[14px] text-center leading-[14px] text-white py-2.5 mt-2">
                      {moment(item?.invoice_date).format("DD MMM YYYY")}
                    </TableCell>
                    <TableCell className="font-normal text-[14px] text-center leading-[14px] text-white py-2.5 mt-2">
                      {item?.payment_source}
                    </TableCell>
                    <TableCell className="font-normal text-[14px] text-center leading-[14px] text-white py-2.5 mt-2">
                      ${`${parseFloat(item?.invoice_amount).toFixed(2)}`}
                    </TableCell>
                    <TableCell className="font-normal text-[10px] leading-[14px] text-white py-2.5 mt-2 rounded-r-3xl">
                      <Button
                        className="h-[24px] rounded-full min-w-unit-0 text-white bg-transparent text-[10px] font-bold border-1 border-[#B7B7B7] hover:bg-white hover:text-black"
                        onClick={() => handleViewDetails(item)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody emptyContent={"No History Available."}>{[]}</TableBody>
            )}
          </Table>
        </div>
      )}
      <div ref={observerRef} className="h-10 flex justify-center items-center">
        {hasMore && <Spinner className="mt-4" size="md" color="white" />}
      </div>
      <ViewInvoiceModal
        setisOpenCancelSubsModal={setisOpenCancelSubsModal}
        isOpenCancelSubsModal={isOpenCancelSubsModal}
        selectedInvoice={selectedInvoice}
      />
    </div>
  );
};

export default BillHistory;
