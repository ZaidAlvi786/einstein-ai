"use client";
import { Avatar, Button, Divider, Skeleton } from "@nextui-org/react";
import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/app/authContext/auth";
import { useGetSubscribedToolsQuery } from "@/app/lib/features/chat/chatApi";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import ToolsLikeComponents from "@/components/marketplace/ToolsLikesComponent";
import ToolsUsersComponent from "@/components/marketplace/ToolsUsersComponent";
import ToolsPriceComponent from "@/components/marketplace/ToolsPriceComponent";
import ToolAddRemoveButton from "@/components/toolsDetailsComponents/toolAddRemove";

const TabTags = [
  { btnText: `Plugins`, category: "plugin" },
  { btnText: `Models`, category: "model" },
  { btnText: `GPT's`, category: "gpt" },
  // { btnText: `Widgets`, category: "widget" },
];
const MyTools = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();

  // This query will re-run whenever `selectedCategory` changes
  const {
    data: getSubscribedToolsData,
    isFetching: getSubscribedToolsLoading,
    refetch
  } = useGetSubscribedToolsQuery(
    { page_number: pageNumber, per_page: perPage, category: selectedCategory },
    { skip: !auth?.user?.email && !auth?.user?.fullname }
  );

  const createMultipleQueryString = useCallback(
    (paramsToUpdate) => {
      const newParams = new URLSearchParams(searchParams);
      Object.keys(paramsToUpdate).forEach((param) => {
        newParams.set(param, paramsToUpdate[param]);
      });
      return newParams.toString();
    },
    [searchParams]
  );

  const navigateToolDetailsPage = (tool_id) => {
    router.push(
      "/marketplace/tools-details?" + createMultipleQueryString({ tool_id })
    );
  };

  const handlePageChange = (newPage) => {
    setPageNumber(newPage);
  };

  const filterTools = (tool) => {
    setSelectedCategory(tool.category); // This will trigger the query to refetch
  };

  return (
    <div className="mytools xl:mt-[65px] 2xl:max-w-[1207px] xl:max-w-[905px] lg:max-w-[905px] w-full mx-auto">
      <div className="toolsHeading mb-[47px]">
        <h3 className="text-white text-[32px] font-bold helvetica-font mb-[14px]">
          My Tools
        </h3>
        <p className="text-[#B5B5B5] text-[14px] helvetica-font">
          Whether you’re writing marketing copy, creating a slideshow, turning
          images into videos, and more, find the tools you need to empower your
          work process.
        </p>
      </div>
      <div className="Toolstabs">
        <div className="flex flex-row gap-2">
          {TabTags.map((item, index) => (
            <Button
              key={index}
              className={`text-white helvetica-font font-bold w-auto !h-[34px] rounded-full border-[1px] bg-transparent 
              hover:bg-[#fff] hover:text-[#000] text-[14px] flex justify-center items-center leading-normal ${
                selectedCategory === item.category
                  ? "bg-[#fff] text-[#000]"
                  : ""
              }`}
              onClick={() => filterTools(item)}
            >
              {item.btnText}
            </Button>
          ))}
        </div>
        <div className="py-[17px]">
          <Divider className="h-[1px] bg-[#3C3C3C]" />
          {getSubscribedToolsLoading ? (
            Array.from({ length: 5 }, (_, i) => i + 1).map((_, key) => (
              <Skeleton key={key} className="w-full rounded mb-4">
                <div className="h-[50px] w-full"></div>
              </Skeleton>
            ))
          ) : (
            <table className="table-auto w-full helvetica-font">
              <tbody>
                {getSubscribedToolsData?.subscribed_tools?.length > 0 ? (
                  getSubscribedToolsData?.subscribed_tools?.map(
                    (item, index) => (
                      <tr className="flex items-center" key={index}>
                        <td className="py-[17px] pr-[18px] inline-block	w-[75%]">
                          <div
                            className="flex gap-6 cursor-pointer"
                            onClick={() =>
                              navigateToolDetailsPage(item?.tool_id)
                            }
                          >
                            <Avatar
                              src={item?.tool_details?.logo}
                              showFallback={true}
                              radius="sm"
                              className="w-12 h-12 cursor-pointer shrink-0	"
                              fallback={
                                <Image
                                  className="h-full w-full object-contain p-2.5"
                                  src="/svg/user.svg"
                                  alt="profile-pic"
                                  fill={true}
                                />
                              }
                            />
                            <div>
                              <h5 className="text-[#FFF] text-[20px] helvetica-font font-bold leading-normal truncate">
                                {item?.tool_details?.name ?? "-"}
                              </h5>
                              <p className="text-[#FFF] text-[16.25px] helvetica-font font-normal leading-normal whitespace-break-spaces line-clamp-1">
                                {item?.tool_details?.introtext ?? "-"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-[17px] px-[18px] inline-block	w-[10%]">
                          <ToolsPriceComponent price={item?.price} />
                        </td>
                        <td className="py-[17px] pl-[18px] flex justify-end	w-[15%]">
                          <ToolAddRemoveButton
                            className={
                              "rounded-3xl border border-white h-[30px] bg-transparent hover:bg-white hover:text-black text-sm font-bold font-helvetica leading-normal"
                            }
                            tool_id={item?.tool_id}
                            refetchToolListOnHome={refetch}
                          />
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td colSpan={5}>
                      <div className="w-full flex items-center justify-center mt-12">
                        <p className="text-white">No data found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTools;
