"use client"

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { Button } from "@nextui-org/react";
import { useGetToolEarningAndAnalyticsQuery } from "@/app/lib/features/admin/adminApi";
import moment from "moment";

const AdminStatusBar = ({ tool_id, getToolDetailsGuestData }) => {
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All Time");
  const [dateRange, setDateRange] = useState({ start_date: "", end_date: "" });

  const calculateDateRange = (option) => {
    const endDate = moment().utc();
    let startDate;

    switch (option) {
      case "24 Hours":
        startDate = moment().utc().subtract(1, "days");
        break;
      case "Week":
        startDate = moment().utc().startOf("week");
        break;
      case "Month":
        startDate = moment().utc().startOf("month");
        break;
      case "Year":
        startDate = moment().utc().startOf("year");
        break;
      default:
        startDate = null;
        break;
    }
    setDateRange({
      start_date: startDate ? startDate.format("YYYY-MM-DDTHH:mm:ss.SSSZ") : "",
      end_date: endDate.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
    });
  };

  // Update filter state and recalculate the date range
  const handleFilterOption = (optionType) => {
    setActiveFilter(optionType);
    calculateDateRange(optionType);
    setMenuOpen(false);
  };

  const { data: toolEarningData, isLoading } =
    useGetToolEarningAndAnalyticsQuery(
      { tool_id: tool_id, ...dateRange },
      { skip: !tool_id }
    );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  return (
    <div className="bg-[#1B1B1B] p-4 rounded-xl ">
      {/* Top Row */}
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Left Section */}
        <div className="col-span-6 flex items-center text-white space-x-2 relative">
          <Button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-0 w-[30px] min-w-[25px] h-[25px] bg-transparent"
          >
            <Image src={"/svg/toggle-icon.svg"}  alt="icon" width={18} height={13} />
          </Button>
          <div className="text-sm">{activeFilter}</div>
          {menuOpen && (
            <div ref={menuRef}>
              <div className="absolute top-0 left-[35px] bg-[#2F2F2F] text-[white] rounded-xl w-[85px] text-xs ">
                <Button
                  className="flex justify-center p-2 h-[33px] cursor-pointer hover:bg-[#505050] rounded-xl w-full bg-transparent"
                  onClick={() => handleFilterOption("All Time")}
                >
                  All Time
                </Button>
                <Button
                  className="flex justify-center p-2 h-[33px] cursor-pointer hover:bg-[#505050] rounded-xl w-full bg-transparent"
                  onClick={() => handleFilterOption("24 Hours")}
                >
                  24 Hours
                </Button>
                <Button
                  className="flex justify-center p-2 h-[33px] cursor-pointer hover:bg-[#505050] rounded-xl w-full bg-transparent"
                  onClick={() => handleFilterOption("Week")}
                >
                  Week
                </Button>
                <Button
                  className="flex justify-center p-2 h-[33px] cursor-pointer hover:bg-[#505050] rounded-xl w-full bg-transparent"
                  onClick={() => handleFilterOption("Month")}
                >
                  Month
                </Button>
                <Button
                  className="flex justify-center p-2 h-[33px] cursor-pointer hover:bg-[#505050] rounded-xl w-full bg-transparent"
                  onClick={() => handleFilterOption("Year")}
                >
                  Year
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="col-span-6 flex justify-end gap-2 items-center text-white">
          <span className="text-xs">
            Date Published:{" "}
            {moment(getToolDetailsGuestData?.tool?.created_at).format(
              "DD/MM/YYYY"
            )}
          </span>
          <span
            className={`${
              getToolDetailsGuestData?.tool?.is_active
                ? "text-green-500"
                : "text-red-500"
            } text-base`}
          >
            {getToolDetailsGuestData?.tool?.is_active ? "Active" : "Paused"}
          </span>
        </div>
      </div>

      {/* Bottom Row - Statistics */}
      <div className="flex justify-around items-center flex-wrap gap-3 text-white text-center mt-4">
        <div className="col-span-1">
          {/* <span className="block font-bold 2xl:text-[32px] xl:text-[25px] mt-1">$545.34</span> */}
          <span className="block font-bold 2xl:text-[32px] xl:text-[25px] mt-1">
            ${toolEarningData?.data?.total_income ?? 0}
          </span>
          <span className="block 2xl:text-base xl:text-[14px] mt-4">
            Total Earnings
          </span>
        </div>
        <div className="col-span-1">
          <span className="block font-bold text-[32px] mt-1 xl:text-[25px]">
            {toolEarningData?.data?.total_users ?? 0}
          </span>
          <span className="block 2xl:text-base xl:text-[14px] mt-4">
            Total users
          </span>
        </div>
        <div className="col-span-1">
          <span className="block font-bold text-[32px] mt-1 xl:text-[25px]">
            {toolEarningData?.data?.total_uses ?? 0}
          </span>
          <span className="block 2xl:text-base xl:text-[14px] mt-4">
            Total uses
          </span>
        </div>
        <div className="col-span-1">
          <span className="block font-bold text-[32px] mt-1 xl:text-[25px]">
            {toolEarningData?.data?.subscribed_users ?? 0}
          </span>
          <span className="block 2xl:text-base xl:text-[14px] mt-4">
            Subscribed
          </span>
        </div>
        <div className="col-span-1">
          <span className="block font-bold text-[32px] mt-1 xl:text-[25px]">
            {toolEarningData?.data?.free_uses ?? 0}
          </span>
          <span className="block 2xl:text-base xl:text-[14px] mt-4">
            Free Uses
          </span>
        </div>
        <div className="col-span-1">
          <span className="block font-bold text-[32px] mt-1 xl:text-[25px]">
            {toolEarningData?.data?.paid_uses ?? 0}
          </span>
          <span className="block 2xl:text-base xl:text-[14px] mt-4">
            Paid uses
          </span>
        </div>
        <div className="col-span-1">
          <span className="block font-bold text-[32px] mt-1 xl:text-[25px]">
            {toolEarningData?.data?.adds ?? 0}
          </span>
          <span className="block 2xl:text-base xl:text-[14px] mt-4">Adds</span>
        </div>
        <div className="col-span-1">
          <span className="block font-bold text-[32px] mt-1 xl:text-[25px]">
            {toolEarningData?.data?.free_trails_expended ?? 0}
          </span>
          <span className="block 2xl:text-base xl:text-[14px] mt-4">
            Free trials expended
          </span>
        </div>
        <div className="col-span-1">
          <span className="block font-bold text-[32px] mt-1 xl:text-[25px]">
            {toolEarningData?.data?.page_views ?? 0}
          </span>
          <span className="block 2xl:text-base xl:text-[14px] mt-4">
            Page Views
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminStatusBar;
