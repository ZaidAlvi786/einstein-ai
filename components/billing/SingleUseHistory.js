import {
  Button,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React, { useEffect, useMemo, useState } from "react";
import { useFetchUserSingleHistoryOverviewQuery } from "@/app/lib/features/payment/paymentApi";

const SingleUseHistory = () => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const perPage = 10;

  const classNames = useMemo(
    () => ({
      table: [
        "border-spacing-y-0",
        "border-separate",
        "rounded-[24px]",
        "py-5",
        "pl-4",
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

  const {
    data: fetchUserSingleUseHistory,
    refetch: singleUseHistory,
    isLoading,
  } = useFetchUserSingleHistoryOverviewQuery({
    start_date_time: startDate,
    end_date_time: endDate,
    page_number: currentPage,
    page_size: perPage,
  });

  useEffect(() => {
    if (fetchUserSingleUseHistory?.data) {
      setInvoices((prevInvoices) => [
        ...prevInvoices,
        ...fetchUserSingleUseHistory.data,
      ]);
      if (
        fetchUserSingleUseHistory.total_records <=
        invoices.length + perPage
      ) {
        setHasMore(false);
      }
    }
  }, [fetchUserSingleUseHistory]);

  // Trigger API refetch when filters (start_date_time, end_date_time) or page changes
  useEffect(() => {
    singleUseHistory();
  }, [startDate, endDate, currentPage]);

  useEffect(() => {
    filterSingleUseHistory("month");
  }, []);


  const handleShowMoreInvoice = () => {
    if (hasMore && !isLoading) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const filterSingleUseHistory = (filterType) => {
    setInvoices([]);
    setCurrentPage(1);
    if (filterType === "month") {
      const firstDayOfMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      ).toISOString();
      const lastDayOfMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      ).toISOString();

      setStartDate(firstDayOfMonth);
      setEndDate(lastDayOfMonth);
    } else if (filterType === "allTime") {
      setStartDate("");
      setEndDate("");
    }
  };

  return isLoading ? (
    <Skeleton className="w-full rounded-3xl mt-4">
      <div className="h-[240px] w-full "></div>
    </Skeleton>
  ) : fetchUserSingleUseHistory?.data?.length > 0 && (
    <div
      style={{ borderRadius: "24px", background: "#1B1B1B" }}
      className="mt-4 "
    >
      <div className="text-white pl-8 pt-5 text-base">Single Use History</div>
      <Table removeWrapper classNames={classNames} className="helvetica-font">
        <TableHeader>
          <TableColumn className="text-[13px] font-bold mb-5">
            <Button
              className={`${
                startDate && endDate
                  ? "h-[24px] min-w-unit-0 text-black bg-white text-[10px] font-bold rounded-full border-1 border-[#B7B7B7] hover:bg-white hover:text-black"
                  : "bg-transparent text-white  min-w-unit-0 h-[24px] border-none"
              }h-[24px] min-w-unit-0   text-[10px] font-bold rounded-full border-[#B7B7B7] hover:bg-white hover:text-black`}
              onClick={() => filterSingleUseHistory("month")}
            >
              This Month
            </Button>
            <Button
              // className="h-[24px] min-w-unit-0   text-[10px] font-bold rounded-full hover:bg-white hover:text-black ml-1"
              className={`${
                startDate === "" && endDate === ""
                  ? "h-[24px] min-w-unit-0 text-black bg-white text-[10px] font-bold rounded-full border-1 border-[#B7B7B7] hover:bg-white hover:text-black"
                  : "bg-transparent text-white h-[24px] min-w-unit-0 border-none"
              }h-[24px] min-w-unit-0 text-[10px] font-bold rounded-full  border-[#B7B7B7] hover:bg-white hover:text-black ml-1`}
              onClick={() => filterSingleUseHistory("allTime")}
            >
              All Time
            </Button>
          </TableColumn>
          <TableColumn className="text-[14px] font-bold mb-5">
            Cost Per Use
          </TableColumn>
          <TableColumn className="text-[14px] font-bold mb-5">
            Uses
          </TableColumn>
          <TableColumn className="text-[14px] font-bold mb-5" >
            Spent
          </TableColumn>
        </TableHeader>
        {fetchUserSingleUseHistory?.data?.length > 0 ? (
          <TableBody>
            {fetchUserSingleUseHistory?.data?.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell
                  className={`font-normal text-[14px] leading-[14px] text-white ${
                    index === 0 ? "pt-4" : ""
                  }`}
                >
                  {item?.name}
                </TableCell>
                <TableCell
                  className={`font-normal text-[14px] leading-[14px] text-white ${
                    index === 0 ? "pt-4" : ""
                  }`}
                >
                  {item?.average_amount
                    ? `$${parseFloat(item?.average_amount).toFixed(5)}`
                    : "$0"}
                </TableCell>
                <TableCell
                  className={`font-normal text-[14px] leading-[14px] text-white ${
                    index === 0 ? "pt-4" : ""
                  }`}
                >
                  {item?.count}
                </TableCell>
                <TableCell
                  className={`font-normal text-[14px] leading-[14px] text-white ${
                    index === 0 ? "pt-4" : ""
                  }`}
                >
                  {item?.total_amount
                    ? `$${parseFloat(item?.total_amount).toFixed(5)}`
                    : "$0"}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="mt-5">
              <TableCell className="pt-5 font-bold text-[14px] leading-[14px] text-white">
                Total
              </TableCell>
              <TableCell className="pt-5"></TableCell>
              <TableCell className="pt-5 font-bold text-[14px] leading-[14px] text-white">
                {fetchUserSingleUseHistory?.total_uses
                  ? fetchUserSingleUseHistory?.total_uses
                  : 0}
              </TableCell>
              <TableCell className="pt-5 font-bold text-[14px] leading-[14px] text-white">
                {fetchUserSingleUseHistory?.total_amount
                  ? `$${parseFloat(fetchUserSingleUseHistory?.total_amount).toFixed(
                      5
                    )}`
                  : "$0"}
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody emptyContent={"No Singlr."}>{[]}</TableBody>
        )}
      </Table>
    </div>
  );
};

export default SingleUseHistory;
