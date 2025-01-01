"use client"


import React, { useEffect, useMemo, useState } from "react";
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
import moment from "moment";
import { useFetchToolPerformanceRecordsQuery } from "@/app/lib/features/admin/adminApi";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AdminToolsHistory = ({tool_id}) => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const perPage = 10;

  const { data: toolPerformanceRecord, isLoading} =
  useFetchToolPerformanceRecordsQuery(
    { tool_id: tool_id, page_number: currentPage, per_page: perPage },
    { skip: !tool_id }
  );
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


    useEffect(() => {
      if (toolPerformanceRecord?.data) {
        setInvoices((prevInvoices) => [...prevInvoices, ...toolPerformanceRecord.data]);
        if (toolPerformanceRecord.total_records <= invoices.length + perPage) {
          setHasMore(false);
        }
      }
    }, [toolPerformanceRecord]);

  const handleShowMoreInvoice = () => {
    if (hasMore && !isLoading) {
      setCurrentPage((prevPage) => prevPage + 1);
      // getUserInvoiceHistory(); TODO
    }
  };

  const downloadRowAsPdf = (row) => {
    const doc = new jsPDF();
    doc.text("Tool Performance Record", 14, 10);
    doc.autoTable({
      startY: 20,
      head: [["Date", "Total Earnings", "Uses", "Users", "Subscribed", "Page Views", "Adds", "Free Uses", "Free Trials Expended"]],
      body: [[
        moment(row.created_at).format("MMM YYYY"),
        "$"  + row.total_income,
        row.total_uses,
        row.total_users,
        row.subscribed_users,
        row.page_views,
        row.adds,
        row.free_uses,
        row.free_trails_expended
      ]],
    });
    doc.save(`tool_record_${moment(row.created_at).format("YYYYMMDD")}.pdf`);
  };

  const downloadAllAsPdf = () => {
    const doc = new jsPDF();
    doc.text("All Tool Performance Records", 14, 10);
    doc.autoTable({
      startY: 20,
      head: [["Date", "Total Earnings", "Uses", "Users", "Subscribed", "Page Views", "Adds", "Free Uses", "Free Trials Expended"]],
      body: invoices.map(item => [
        moment(item.created_at).format("MMM YYYY"),
        item.total_income,
        item.total_uses,
        item.total_users,
        item.subscribed_users,
        item.page_views,
        item.adds,
        item.free_uses,
        item.free_trails_expended
      ]),
    });
    doc.save("all_tool_records.pdf");
  };

  return isLoading ? (
    <Skeleton className="w-full rounded-3xl mb-4">
      <div className="h-[44px] w-full "></div>
    </Skeleton>
  ) : (
    <div>
      <Table removeWrapper classNames={classNames} className="helvetica-font">
        <TableHeader className="text-[10px]">
          <TableColumn className="h-auto text-center">Date</TableColumn>
          <TableColumn className="h-auto text-center">
            Total Earnings
          </TableColumn>
          <TableColumn className="h-auto text-center">Uses</TableColumn>
          <TableColumn className="h-auto text-center">Users</TableColumn>
          <TableColumn className="h-auto text-center">Subscribed</TableColumn>
          <TableColumn className="h-auto text-center">Page Views</TableColumn>
          <TableColumn className="h-auto text-center">Adds</TableColumn>
          <TableColumn className="h-auto text-center">Free Uses</TableColumn>
          <TableColumn className="h-auto text-center">
            Free Trials Expended
          </TableColumn>

          <TableColumn className="h-auto text-center w-[70px]">
            Details
          </TableColumn>
        </TableHeader>
        {toolPerformanceRecord?.data?.length > 0 ? (
          <TableBody>
            {toolPerformanceRecord?.data?.map((item, index) => (
              <TableRow
                key={index}
                className="rounded-3xl pb-4 bg-[#1B1B1B] shadow-billingCard"
              >
                <TableCell className="font-normal text-[14px] text-center leading-[14px] text-white py-2.5 ps-[18px] rounded-l-3xl mt-2">
                  {moment(item?.created_at).format("MMM YYYY")}
                </TableCell>
                <TableCell className="font-normal text-[14px] text-center leading-[14px] text-white py-2.5 mt-2">
                  {item?.total_income}
                </TableCell>
                <TableCell className="font-normal text-[14px] text-center leading-[14px] text-white py-2.5 mt-2">
                  {item?.total_uses}
                </TableCell>
                <TableCell className="font-normal text-[14px] text-center leading-[14px] text-white py-2.5 mt-2">
                  {item?.total_users}
                </TableCell>
                <TableCell className="font-normal text-[14px] text-center leading-[14px] text-white py-2.5 mt-2">
                  {item?.subscribed_users}
                </TableCell>
                <TableCell className="font-normal text-[14px] text-center leading-[14px] text-white py-2.5 mt-2">
                  {item?.page_views}
                </TableCell>
                <TableCell className="font-normal text-[14px] text-center leading-[14px] text-white py-2.5 mt-2">
                  {item?.adds}
                </TableCell>
                <TableCell className="font-normal text-[14px] text-center leading-[14px] text-white py-2.5 mt-2">
                  {item?.free_uses}
                </TableCell>
                <TableCell className="font-normal text-[14px] text-center leading-[14px] text-white py-2.5 mt-2">
                  {item?.free_trails_expended}
                </TableCell>
                <TableCell className="font-normal text-[10px] leading-[14px] text-white py-2.5 mt-2 rounded-r-3xl">
                  <Button onClick={() => downloadRowAsPdf(item)} className="h-[24px] rounded-full min-w-unit-0 text-white bg-transparent text-[10px] font-bold border-1 border-[#B7B7B7] hover:bg-white hover:text-black">
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody emptyContent={"No rows to display."}>{[]}</TableBody>
        )}
      </Table>
    </div>
  );
};

export default AdminToolsHistory;
