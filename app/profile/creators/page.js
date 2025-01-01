"use client";
import { useGetToolsPerformanceDetailsListQuery } from "@/app/lib/features/admin/adminApi";
import { Avatar, Button, Image, Skeleton } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import MarketplaceCard from "@/components/marketplace/MarketplaceCard";
import AddIcon from "@/app/assets/svg/add.svg";
const CreatorsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusBarData, setStatusBarData] = useState({});
  const router = useRouter();
  const searchParams = useSearchParams();



  const { data: toolList, isLoading,refetch } = useGetToolsPerformanceDetailsListQuery({
    page: currentPage,
    limit: 100,
  });

  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  useEffect(() => {
    if (toolList?.data?.length > 0) {
      const totalIncome = toolList.data.reduce(
        (acc, tool) => acc + (tool.total_income || 0),
        0
      );
      const totalUsers = toolList.data.reduce(
        (acc, tool) => acc + (tool.total_users || 0),
        0
      );
      const totalUses = toolList.data.reduce(
        (acc, tool) => acc + (tool.total_uses || 0),
        0
      );

      setStatusBarData({
        totalIncome,
        totalUsers,
        totalUses,
      });
    }
  }, [toolList]);

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
      "/marketplace/tools-details" +
      "?" +
      createMultipleQueryString({ tool_id })
    );
  };
  return (
    <div className="max-w-[1095px] 4k:!w-[3250px] w-full mx-auto px-1.5 flex flex-col items-center lg:justify-normal min-[1800px]:justify-center pb-10">
      {isLoading ? (
        <Skeleton className="w-full rounded-3xl h-[179px] pt-8`" />
      ) : (
        <div className="h-[158.614px] bg-[#1B1B1B] 4k:!w-[2190px] 4k:!h-[358px] rounded-[21.267px] 4k:rounded-[48px] 4k:!shadow-4k-custom 4k:!backdrop-blur-4k-custom shadow-custom-light backdrop-blur-custom w-[970.292px] mt-8 items-center flex">
          <div className="flex justify-around items-center flex-wrap gap-3 text-white text-center w-full">
            <div className="col-span-1 flex flex-col gap-[5.19px] 4k:!gap-[11.72px]">
              <span className="block font-bold leading-[140%] 2xl:text-[32px] xl:text-[28.356px 4k:!text-[64px]]">
                ${statusBarData?.totalIncome ?? 0}
              </span>
              <span className="block 2xl:text-base leading-[140%] xl:text-[14.178px] 4k:!text-[32px] font-normal">
                Total Income
              </span>
            </div>
            <div className="col-span-1 flex flex-col gap-[5.19px]">
              <span className="block font-bold text-[32px] leading-[140%] xl:text-[28.356px 4k:!text-[64px]]">
                {statusBarData?.totalUsers ?? 0}
              </span>
              <span className="block 2xl:text-base leading-[140%] xl:text-[14.178px] 4k:!text-[32px] font-normal">
                Total users
              </span>
            </div>
            <div className="col-span-1 flex flex-col gap-[5.19px]">
              <span className="block font-bold text-[32px] leading-[140%] xl:text-[28.356px 4k:!text-[64px]]">
                {statusBarData?.totalUses ?? 0}
              </span>
              <span className="block 2xl:text-base leading-[140%] xl:text-[14.178px] 4k:!text-[32px] font-normal">
                Total uses
              </span>
            </div>
            <div className="col-span-1 text-[10px]">
              <Button
                className={`text-white helvetica-font font-bold 4k:!w-[440px] 4k:!h-[80px] 4k:!rounded-[12px] w-[194.944px] !h-[35.444px] rounded-[5.317px] bg-[#337CE1]
          hover:bg-[#fff] hover:text-[#000] text-[12.988px] leading-[140%] 4k:!text-[29.315px] flex justify-center items-center min-w-fit`}
              >
                Set up Stripe
              </Button>
              <div className="mt-3 text-[8.08px] font-normal 4k:!text-[18.238px] leading-[140%] text-[#FFF]">By clicking you agree to Togl’s</div>
              <div className="text-[#7FB9F3] text-[8.08px] 4k:!text-[18.238px] font-normal leading-[140%] hover:decoration-black cursor-pointer">
                Creator Agreement
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div>
          <Skeleton className="w-full rounded-3xl h-[215px] mt-11" />
          <Skeleton className="w-full rounded-3xl h-[215px] mt-11" />
          <Skeleton className="w-full rounded-3xl h-[215px] mt-11" />
        </div>
      ) : toolList?.data?.length > 0 ? (
        toolList?.data.map((tool) => {
          return (
            <div className="flex gap-5 mt-11 text-white">
              <div className="relative w-[385px] bg-[#222222] rounded-2xl h-[215px] min-[1700px]:h-[215px] flex-shrink-0"
               onClick={() => navigateToolDetailsPage(tool?.tool_id)}
              >
                <div className="absolute bg-[#00000040] rounded-lg text-white text-sm font-helvetica p-1 font-bold max-w-36 w-full flex gap-2 items-center m-2">
                  <Avatar
                    // src={"/svg/user.svg"}
                    src={tool.logo}
                    showFallback={true}
                    alt="similar-tools-logo"
                    className="w-9 h-9 cursor-pointer"
                    fallback={
                      <Image
                        src={"/svg/user.svg"}
                        alt="profile-pic"
                        width={14}
                        height={17}
                      />
                    }
                  />
                  {tool.name}
                </div>
                {tool?.preview_url?.length > 0 && (
                  <img
                    className="w-full h-full cursor-pointer rounded-[15px] object-cover"
                    src={tool?.preview_url?.[0]}
                    alt="similar-tools-preview-url"
                  />
                )}
              </div>
              <div className="w-full">
                <div className="flex justify-between ">
                  <div>
                    <div className="text-[20px] cursor-pointer"  onClick={() => navigateToolDetailsPage(tool?.tool_id)}>{tool?.name}</div>
                    <div className="text-[16.25px] text-[#9E9D9C]">
                      {tool?.introtext}
                    </div>
                  </div>
                  <div className="text-[16.25px]">
                    Status:{" "}
                    {tool?.is_active ? (
                      <span className="text-[#1BFF7E]">Active</span>
                    ) : (
                      <span className="text-[#1BFF7E]">Paused</span>
                    )}
                  </div>
                </div>
                <div className="mt-[50px] flex gap-12 text-center ">
                  <div>
                    <div className="text-xs font-medium">Total income</div>
                    <div className="text-2xl font-bold mt-2">
                      ${tool?.total_income}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium">Users</div>
                    <div className="text-2xl font-bold mt-2">
                      {tool?.total_users}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium">Uses</div>
                    <div className="text-2xl font-bold mt-2">
                      {tool?.total_uses}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium">Comments</div>
                    <div className="text-2xl font-bold mt-2">
                      {tool?.comments}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium">Page Views</div>
                    <div className="text-2xl font-bold mt-2">{tool?.views}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex h-full mt-[147.67px] flex-col justify-center items-center gap-[15.87px]">
          <Button
         
          className="text-white 4k:!h-[68px] 4k:!text-[28px] helvetica-font 4k:!w-[192px] 4k:!rounded-[48px] 4k:!border-[2px] font-bold w-auto !h-[34px] rounded-full border-[1px] bg-transparent
               hover:bg-[#fff] hover:text-[#000] text-[14px] flex justify-center items-center leading-normal gap-[5px] px-[4px]"
          startContent={<AddIcon className="" />}
         
        >
          {`Create`}
        </Button>
          <span className="text-[#FFF] 4k:!text-[28px] text-[12.406px] font-normal leading-[140%]">Press “Create” to add a tool to the marketplace</span>
        </div>
      )}
    </div>
  );
};

export default CreatorsPage;
