"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import {
  Button,
  Link,
  Autocomplete,
  AutocompleteItem,
  Avatar,
  AutocompleteSection,
  Skeleton,
} from "@nextui-org/react";
import trendingFirst from "@/app/assets/image/trending-01.png";
import KeyboardDown from "@/app/assets/svg/keyboard_arrow_down_blue.svg";
import SearchIcon from "@/app/assets/svg/search-icon.svg";
import AutoModel from "@/app/assets/image/AutoModel.png";
import EinsteinLogo from "@/app/assets/image/EinsteinLogo.png";
import {
  useGetTrendingToolsQuery,
  useSearchToolsForAllCategoryQuery,
} from "@/app/lib/features/chat/chatApi";
import ToolsLikeComponents from "./ToolsLikesComponent";
import ToolsUsersComponent from "./ToolsUsersComponent";
import useDebounce from "@/app/hooks/useDebounce";
import ToolsPriceComponent from "./ToolsPriceComponent";
import { useRouter, useSearchParams } from "next/navigation";

const AutocompleteData = [
  {
    id: 1,
    groupName: "Plugins",
    groupMenu: [
      {
        id: 1,
        image: trendingFirst,
        title: "AutoModel-text",
        subTitle: "By Einstein",
      },
      {
        id: 2,
        image: AutoModel,
        title: "AutoModel - Image",
        subTitle: "By Einstein",
      },
    ],
  },
  {
    id: 2,
    groupName: "Models",
    groupMenu: [
      {
        id: 1,
        image: trendingFirst,
        title: "AutoModel-text",
        subTitle: "By Einstein",
      },
      {
        id: 2,
        image: AutoModel,
        title: "AutoModel - Image",
        subTitle: "By Einstein",
      },
    ],
  },
  {
    id: 3,
    groupName: "GPT's",
    groupMenu: [
      {
        id: 1,
        image: trendingFirst,
        title: "AutoModel-text",
        subTitle: "By Einstein",
      },
      {
        id: 2,
        image: AutoModel,
        title: "AutoModel - Image",
        subTitle: "By Einstein",
      },
    ],
  },
  {
    id: 4,
    groupName: "Widgets",
    groupMenu: [
      {
        id: 1,
        image: trendingFirst,
        title: "AutoModel-text",
        subTitle: "By Einstein",
      },
      {
        id: 2,
        image: AutoModel,
        title: "AutoModel - Image",
        subTitle: "By Einstein",
      },
    ],
  },
];

const MarketPlaceHome = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: trendingData, isLoading: trendingLoading } =
    useGetTrendingToolsQuery({
      page_number: currentPage,
      per_page: 6,
      search: debouncedSearchTerm,
    });
    
  const { data: toolsData, isLoading: toolsLoading } =
    useSearchToolsForAllCategoryQuery({
      page_number: currentPage,
      per_page: 10,
      search: debouncedSearchTerm,
    });

  // Update search term and apply debounce
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

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
    <>
      <div className="2xl:max-w-[1207px] xl:max-w-[905px] lg:max-w-[905px] w-full mx-auto">
        <div className="text-center mt-[150px] mb-[105px]">
          <h2 className="text-white text-[45.582px] font-normal helvetica-font mb-[16px]">{`Welcome to Einstein Community`}</h2>
          <p className="text-[#E4E4E4] text-[17px] font-normal helvetica-font leading-[140%]">
            {`Explore thousands of free and paid plugins, models, widgets, GPT’s, prompts`}
            <br /> {`and more to take your work to the next level.`}
          </p>

          <div className="flex flex-row gap-2 mt-[20px] max-msm:mt-0 mb-4 max-msm:ml-3 items-center h-[52px] max-w-[467px] mx-auto">
            <Autocomplete
              fullWidth={true}
              classNames={{
                base: "max-w-[467px]",
                listboxWrapper: "max-h-[320px]",
                selectorButton: "text-default-500",
                content: "bg-[#171717]",
              }}
              defaultItems={AutocompleteData}
              inputProps={{
                classNames: {
                  label: "text-white",
                  input: [
                    "bg-[transparent]",
                    "placeholder:text-[#BABABA]",
                    "text-[14px]",
                    "font-bold",
                    "font-inter",
                    "group-data-[has-value=true]:text-white",
                    "caret-white",
                  ],
                  inputWrapper: [
                    "bg-[#272727]",
                    "rounded-[24px]",
                    "data-[hover=true]:bg-[#232323]",
                    "group-data-[focus=true]:bg-[#232323]",
                    "group-data-[has-value=true]:text-white",
                    "h-[52px]",
                    "px-[19px] py-[19px]",
                  ],
                },
              }}
              menuTrigger="focus"
              listboxProps={{
                hideSelectedIcon: true,
                itemClasses: {
                  base: [
                    "rounded-medium",
                    "text-default-500",
                    "transition-opacity",
                    "p-[12px]",
                    "data-[hover=true]:text-foreground",
                    "dark:data-[hover=true]:bg-default-[#232323]",
                    "data-[pressed=true]:opacity-70",
                    "data-[hover=true]:bg-[#232323]",
                    "data-[selectable=true]:focus:bg-[#232323]",
                    "data-[focus-visible=true]:ring-[#232323]",
                  ],
                },
              }}
              placeholder={`Search for resources like “Text-to-Image generators”`}
              popoverProps={{
                offset: 20,
                classNames: {
                  base: "rounded-lg",
                  content: "bg-[#171717] py-[17px] px-[8px] !shadow-none",
                },
              }}
              startContent={
                <SearchIcon className="text-default-400 w-[20px]" size={20} />
              }
              radius="full"
              variant="flat"
              isClearable={false}
              selectorButtonProps={{ style: { display: "none" } }}
              inputValue={searchTerm}
              onInputChange={handleSearchChange}
            >
              {(item) => (
                <AutocompleteSection
                  key={item.id}
                  title={item.groupName}
                  classNames={{
                    heading:
                      "text-[#B5B5B5] font-bold text-[14px] mb-[14px] flex px-3",
                  }}
                >
                  {item.groupMenu.map((menu) => (
                    <AutocompleteItem key={menu.id} textValue={menu.title}>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                          <Avatar
                            alt={menu.title}
                            className="flex-shrink-0 w-[72px] h-[72px]"
                            src={menu?.image?.src}
                          />
                          <div className="flex flex-col">
                            <span className="text-[18px] font-bold text-white">
                              {menu.title}
                            </span>
                            <span className="text-[12.62px] font-bold text-[#B1B1B1]">
                              {menu.subTitle}
                            </span>
                          </div>
                        </div>
                      </div>
                    </AutocompleteItem>
                  ))}
                </AutocompleteSection>
              )}
            </Autocomplete>
          </div>
        </div>
        <div className="flex gap-[3px] items-end justify-between mb-[24px]">
          <div className="flex flex-col">
            <div className="text-[24px] font-bold text-[#fff] leading-[140%] helvetica-font mb-[4px]">
              Trending
            </div>
            <p className="text-[#858584] text-[14px] helvetica-font font-medium">
              Discover the top plugins, text models and image generation models.
            </p>
          </div>
          <button className="text-[#707AFD] flex gap-[3px] items-center">
            <span className="text-[13px] font-bold text-[#707AFD]">
              Browse all
            </span>
            <KeyboardDown />
          </button>
        </div>
        <div className="flex flex-wrap -mx-[17px] mb-[37px]">
          {trendingLoading ? (
            Array.from({ length: 6 }, (_, i) => i + 1).map((_, key) => (
              <div key={key} className="w-2/6 xl:px-[17px] px-[10px] mb-[34px]">
                <Skeleton className="w-full rounded-[21.411px]">
                  <section className="h-[200px]"></section>
                </Skeleton>
              </div>
            ))
          ) : trendingData?.tools?.length > 0 ? (
            trendingData?.tools?.map((item, index) => (
              <div
                key={index}
                className="w-2/6 xl:px-[17px] px-[10px] mb-[34px]"
              >
                <div
                  onClick={() => navigateToolDetailsPage(item?.id)}
                  className="cursor-pointer w-full text-white shadow-trendingCard rounded-[21.411px] bg-custom-gradient backdrop-blur-Blurcustom 2xl:p-[18px] p-[13px]"
                >
                  <div className="flex flex-col">
                    <div className="flex flex-row gap-[14px] mb-[16px] items-center">
                      <div className="max-w-[96px] max-h-[96]">
                        <Avatar
                          src={item?.logo}
                          showFallback={true}
                          radius="sm"
                          className="w-[96px] h-[96px] cursor-pointer"
                          fallback={
                            <Image
                              src={"/svg/user.svg"}
                              alt="trending-tools-pic"
                              width={50}
                              height={50}
                            />
                          }
                        />
                      </div>
                      <div>
                        <h4 className="lg:text-[16px] xl:text-[18px] 2xl:text-[24px] font-bold leading-[140%] mb-[2px] helvetica-font">
                          {item.name}
                        </h4>
                        <h5 className="lg:text-[14px] xl:text-[14px] 2xl:text-[16.824px] text-[#B1B1B1] helvetica-font font-medium">
                          {item?.creator_details?.full_name
                            ? `By ${item?.creator_details?.full_name}`
                            : "-"}
                        </h5>
                      </div>
                    </div>
                    <p
                      className="mb-[9px] text-[13px] font-medium w-[255px] truncate"
                      title={item?.introtext ? item?.introtext : null}
                    >
                      {item?.introtext ? item?.introtext : "-"}
                    </p>
                    <button className="text-[14px] text-[#fff] font-bold rounded-[24px] border border-white max-w-[77px] w-full ml-auto flex items-center justify-center h-[30px]">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full flex items-center justify-center">
              <p className="text-white">No data found.</p>
            </div>
          )}
        </div>
        <div className="mb-[39px]">
          <div className="flex gap-[3px] items-end justify-between mb-[22px]">
            <div className="flex flex-col">
              <div className="text-[24px] font-bold text-[#fff] leading-[140%] helvetica-font mb-[4px]">
                Plugins
              </div>
              <p className="text-[#858584] text-[14px] helvetica-font font-medium">
                Most popular Plugins by our community.
              </p>
            </div>
            <Link
              href={"/marketplace/plugins"}
              className="text-[#707AFD] flex gap-[3px] items-center"
            >
              <span className="text-[13px] font-bold text-[#707AFD]">
                Browse all
              </span>
              <KeyboardDown />
            </Link>
          </div>
          <div>
            {toolsLoading ? (
              Array.from({ length: 5 }, (_, i) => i + 1).map((_, key) => (
                <Skeleton key={key} className="w-full rounded mb-4">
                  <div className="h-[50px] w-full">1111</div>
                </Skeleton>
              ))
            ) : (
              <table className="table-auto w-full helvetica-font">
                <tbody>
                  {toolsData?.tools?.plugin?.length > 0 ? (
                    toolsData?.tools?.plugin?.map((item, index) => (
                      <tr key={index}>
                        <td className="py-[17px] pr-[18px]">
                          <div
                            className="flex gap-6 cursor-pointer"
                            onClick={() => navigateToolDetailsPage(item?.id)}
                          >
                            <div>
                              <Avatar
                                src={item?.logo}
                                showFallback={true}
                                radius="sm"
                                className="w-[50px] h-[50px] cursor-pointer"
                                fallback={
                                  <Image
                                    src={"/svg/user.svg"}
                                    alt="trending-tools-pic"
                                    width={45}
                                    height={45}
                                  />
                                }
                              />
                            </div>
                            <div>
                              <h5 className="text-[#FFF] text-[20px] helvetica-font font-bold leading-normal">
                                {item?.name}
                              </h5>
                              <p
                                className="text-[#FFF] text-[16.25px] helvetica-font font-normal leading-normal max-w-96 truncate"
                                title={item?.introtext ? item?.introtext : null}
                              >
                                {item?.introtext ? item?.introtext : "-"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="w-[45px] py-[17px] px-[18px]">
                          <ToolsLikeComponents
                            total_likes={item?.total_likes}
                          />
                        </td>
                        <td className="w-[45px] py-[17px] px-[18px]">
                          <ToolsUsersComponent
                            total_views={item?.total_views}
                          />
                        </td>
                        <td className="w-[60px] py-[17px] px-[18px]">
                          <ToolsPriceComponent price={item?.price} />
                        </td>
                        <td className="w-[77px] py-[17px] pl-[18px]">
                          <Button className="text-white helvetica-font font-bold w-[77px] !h-[30px] rounded-full border-[1px] bg-transparent hover:bg-[#fff] hover:text-[#000] text-[14px]">
                            Add
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6}>
                        <div className="w-full flex items-center justify-center">
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
        <div className="mb-[39px]">
          <div className="flex gap-[3px] items-end justify-between mb-[22px]">
            <div className="flex flex-col">
              <div className="text-[24px] font-bold text-[#fff] leading-[140%] helvetica-font mb-[4px]">
                Models
              </div>
              <p className="text-[#858584] text-[14px] helvetica-font font-medium">
                Most popular Models by our community.
              </p>
            </div>
            <Link
              href={"/marketplace/models"}
              className="text-[#707AFD] flex gap-[3px] items-center"
            >
              <span className="text-[13px] font-bold text-[#707AFD]">
                Browse all
              </span>
              <KeyboardDown />
            </Link>
          </div>
          <div>
            {toolsLoading ? (
              Array.from({ length: 5 }, (_, i) => i + 1).map((_, key) => (
                <Skeleton key={key} className="w-full rounded mb-4">
                  <div className="h-[50px] w-full">1111</div>
                </Skeleton>
              ))
            ) : (
              <table className="table-auto w-full helvetica-font">
                <tbody>
                  {toolsData?.tools?.model?.length > 0 ? (
                    toolsData?.tools?.model?.map((item, index) => (
                      <tr key={index}>
                        <td className="py-[17px] pr-[18px]">
                          <div
                            className="flex gap-6 cursor-pointer"
                            onClick={() => navigateToolDetailsPage(item?.id)}
                          >
                            <div>
                              <Avatar
                                src={item?.logo}
                                showFallback={true}
                                radius="sm"
                                className="w-[50px] h-[50px] cursor-pointer"
                                fallback={
                                  <Image
                                    src={"/svg/user.svg"}
                                    alt="trending-tools-pic"
                                    width={45}
                                    height={45}
                                  />
                                }
                              />
                            </div>
                            <div>
                              <h5 className="text-[#FFF] text-[20px] helvetica-font font-bold leading-normal">
                                {item?.name}
                              </h5>
                              <p
                                className="text-[#FFF] text-[16.25px] helvetica-font font-normal leading-normal max-w-96 truncate"
                                title={item?.introtext ? item?.introtext : null}
                              >
                                {item?.introtext ? item?.introtext : "-"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="w-[45px] py-[17px] px-[18px]">
                          <ToolsLikeComponents
                            total_likes={item?.total_likes}
                          />
                        </td>
                        <td className="w-[45px] py-[17px] px-[18px]">
                          <ToolsUsersComponent
                            total_views={item?.total_views}
                          />
                        </td>
                        <td className="w-[60px] py-[17px] px-[18px]">
                          <ToolsPriceComponent price={item?.price} />
                        </td>
                        <td className="w-[77px] py-[17px] pl-[18px]">
                          <Button className="text-white helvetica-font font-bold w-[77px] !h-[30px] rounded-full border-[1px] bg-transparent hover:bg-[#fff] hover:text-[#000] text-[14px]">
                            Add
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6}>
                        <div className="w-full flex items-center justify-center">
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
        <div className="mb-[39px]">
          <div className="flex gap-[3px] items-end justify-between mb-[22px]">
            <div className="flex flex-col">
              <div className="text-[24px] font-bold text-[#fff] leading-[140%] helvetica-font mb-[4px]">{`GPT’s`}</div>
              <p className="text-[#858584] text-[14px] helvetica-font font-medium">{`Most popular GPT’s by our community.`}</p>
            </div>
            <Link
              href={"/marketplace/gpts"}
              className="text-[#707AFD] flex gap-[3px] items-center"
            >
              <span className="text-[13px] font-bold text-[#707AFD]">
                Browse all
              </span>
              <KeyboardDown />
            </Link>
          </div>
          <div>
            {toolsLoading ? (
              Array.from({ length: 5 }, (_, i) => i + 1).map((_, key) => (
                <Skeleton key={key} className="w-full rounded mb-4">
                  <div className="h-[50px] w-full">1111</div>
                </Skeleton>
              ))
            ) : (
              <table className="table-auto w-full helvetica-font">
                <tbody>
                  {toolsData?.tools?.gpt?.length > 0 ? (
                    toolsData?.tools?.gpt?.map((item, index) => (
                      <tr key={index}>
                        <td className="py-[17px] pr-[18px]">
                          <div
                            className="flex gap-6 cursor-pointer"
                            onClick={() => navigateToolDetailsPage(item?.id)}
                          >
                            <div>
                              <Avatar
                                src={item?.logo}
                                showFallback={true}
                                radius="sm"
                                className="w-[50px] h-[50px] cursor-pointer"
                                fallback={
                                  <Image
                                    src={"/svg/user.svg"}
                                    alt="trending-tools-pic"
                                    width={45}
                                    height={45}
                                  />
                                }
                              />
                            </div>
                            <div>
                              <h5 className="text-[#FFF] text-[20px] helvetica-font font-bold leading-normal">
                                {item?.name}
                              </h5>
                              <p
                                className="text-[#FFF] text-[16.25px] helvetica-font font-normal leading-normal max-w-96 truncate"
                                title={item?.introtext ? item?.introtext : null}
                              >
                                {item?.introtext ? item?.introtext : "-"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="w-[45px] py-[17px] px-[18px]">
                          <ToolsLikeComponents
                            total_likes={item?.total_likes}
                          />
                        </td>
                        <td className="w-[45px] py-[17px] px-[18px]">
                          <ToolsUsersComponent
                            total_views={item?.total_views}
                          />
                        </td>
                        <td className="w-[60px] py-[17px] px-[18px]">
                          <ToolsPriceComponent price={item?.price} />
                        </td>
                        <td className="w-[77px] py-[17px] pl-[18px]">
                          <Button className="text-white helvetica-font font-bold w-[77px] !h-[30px] rounded-full border-[1px] bg-transparent hover:bg-[#fff] hover:text-[#000] text-[14px]">
                            Add
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6}>
                        <div className="w-full flex items-center justify-center">
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
        <div className="mb-[39px]">
          <div className="flex gap-[3px] items-end justify-between mb-[22px]">
            <div className="flex flex-col">
              <div className="text-[24px] font-bold text-[#fff] leading-[140%] helvetica-font mb-[4px]">
                Widgets
              </div>
              <p className="text-[#858584] text-[14px] helvetica-font font-medium">
                Most popular Widgets by our community.
              </p>
            </div>
            <Link
              href={"/marketplace/widgets"}
              className="text-[#707AFD] flex gap-[3px] items-center"
            >
              <span className="text-[13px] font-bold text-[#707AFD]">
                Browse all
              </span>
              <KeyboardDown />
            </Link>
          </div>
          <div>
            {toolsLoading ? (
              Array.from({ length: 5 }, (_, i) => i + 1).map((_, key) => (
                <Skeleton key={key} className="w-full rounded mb-4">
                  <div className="h-[50px] w-full">1111</div>
                </Skeleton>
              ))
            ) : (
              <table className="table-auto w-full helvetica-font">
                <tbody>
                  {toolsData?.tools?.widget?.length > 0 ? (
                    toolsData?.tools?.widget?.map((item, index) => (
                      <tr key={index}>
                        <td className="py-[17px] pr-[18px]">
                          <div
                            className="flex gap-6 cursor-pointer"
                            onClick={() => navigateToolDetailsPage(item?.id)}
                          >
                            <div>
                              <Avatar
                                src={item?.logo}
                                showFallback={true}
                                radius="sm"
                                className="w-[50px] h-[50px] cursor-pointer"
                                fallback={
                                  <Image
                                    src={"/svg/user.svg"}
                                    alt="trending-tools-pic"
                                    width={45}
                                    height={45}
                                  />
                                }
                              />
                            </div>
                            <div>
                              <h5 className="text-[#FFF] text-[20px] helvetica-font font-bold leading-normal">
                                {item?.name}
                              </h5>
                              <p
                                className="text-[#FFF] text-[16.25px] helvetica-font font-normal leading-normal max-w-96 truncate"
                                title={item?.introtext ? item?.introtext : null}
                              >
                                {item?.introtext ? item?.introtext : "-"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="w-[45px] py-[17px] px-[18px]">
                          <ToolsLikeComponents
                            total_likes={item?.total_likes}
                          />
                        </td>
                        <td className="w-[45px] py-[17px] px-[18px]">
                          <ToolsUsersComponent
                            total_views={item?.total_views}
                          />
                        </td>
                        <td className="w-[60px] py-[17px] px-[18px]">
                          <ToolsPriceComponent price={item?.price} />
                        </td>
                        <td className="w-[77px] py-[17px] pl-[18px]">
                          <Button className="text-white helvetica-font font-bold w-[77px] !h-[30px] rounded-full border-[1px] bg-transparent hover:bg-[#fff] hover:text-[#000] text-[14px]">
                            Add
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6}>
                        <div className="w-full flex items-center justify-center">
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
        <footer>
          <div className="mx-auto w-full max-w-screen-xl">
            <div className="grid grid-cols-2 gap-8 px-4 py-6 lg:py-8 md:grid-cols-4">
              <div>
                <ul className="text-[#fff] helvetica-font text-sm not-italic font-medium leading-normal">
                  <li className="mb-4">
                    <a href="#" className="hover:underline">
                      Popular searches
                    </a>
                  </li>
                  <li className="mb-4">
                    <a href="#" className="hover:underline">
                      Startup workspaces
                    </a>
                  </li>
                  <li className="mb-4">
                    <a href="#" className="hover:underline">
                      Content Creation
                    </a>
                  </li>
                  <li className="mb-4">
                    <a href="#" className="hover:underline">
                      Image to Text
                    </a>
                  </li>
                  <li className="mb-4">
                    <a href="#" className="hover:underline">
                      Image to Video
                    </a>
                  </li>
                  <li className="mb-4">
                    <a href="#" className="hover:underline">
                      Legal OWrkstation
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="text-[#fff] helvetica-font text-sm not-italic font-medium leading-normal">
                  <li className="mb-4">
                    <a href="#" className="hover:underline">
                      Most used
                    </a>
                  </li>
                  <li className="mb-4">
                    <a href="#" className="hover:underline">
                      Startup workspaces
                    </a>
                  </li>
                  <li className="mb-4">
                    <a href="#" className="hover:underline">
                      Content Creation
                    </a>
                  </li>
                  <li className="mb-4">
                    <a href="#" className="hover:underline">
                      Image to Text
                    </a>
                  </li>
                  <li className="mb-4">
                    <a href="#" className="hover:underline">
                      Image to Video
                    </a>
                  </li>
                  <li className="mb-4">
                    <a href="#" className="hover:underline">
                      Legal OWrkstation
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="text-[#fff] helvetica-font text-sm not-italic font-medium leading-normal">
                  <li className="mb-4">
                    <a href="#" className="hover:underline">
                      Top Plugins
                    </a>
                  </li>
                  <li className="mb-4">
                    <a href="#" className="hover:underline">
                      Startup workspaces
                    </a>
                  </li>
                  <li className="mb-4">
                    <a href="#" className="hover:underline">
                      Content Creation
                    </a>
                  </li>
                  <li className="mb-4">
                    <a href="#" className="hover:underline">
                      Image to Text
                    </a>
                  </li>
                  <li className="mb-4">
                    <a href="#" className="hover:underline">
                      Image to Video
                    </a>
                  </li>
                  <li className="mb-4">
                    <a href="#" className="hover:underline">
                      Legal OWrkstation
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="text-[#fff] helvetica-font text-sm not-italic font-medium leading-normal">
                  <li className="mb-4">
                    <a href="#" className="hover:underline">
                      Top categories
                    </a>
                  </li>
                  <li className="mb-4">
                    <a href="#" className="hover:underline">
                      Startup workspaces
                    </a>
                  </li>
                  <li className="mb-4">
                    <a href="#" className="hover:underline">
                      Content Creation
                    </a>
                  </li>
                  <li className="mb-4">
                    <a href="#" className="hover:underline">
                      Image to Text
                    </a>
                  </li>
                  <li className="mb-4">
                    <a href="#" className="hover:underline">
                      Image to Video
                    </a>
                  </li>
                  <li className="mb-4">
                    <a href="#" className="hover:underline">
                      Legal OWrkstation
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="px-4 pb-10 flex items-center">
              <div className="mb-6 md:mb-0">
                <a href="#" className="flex items-center">
                  <img
                    src={EinsteinLogo?.src}
                    className="w-[121px] h-[34px] me-3 object-contain mb-[18px]"
                    alt="Einstein Logo"
                  />
                </a>
                <span className="text-sm font-bold text-white sm:text-center flex items-center gap-1.5">
                  © 2024 Einstein Inc
                  <a href="#" className="flex items-center gap-x-1.5">
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="5"
                        height="5"
                        viewBox="0 0 5 5"
                        fill="none"
                      >
                        <circle cx="2.5" cy="2.5" r="2.5" fill="#FDFDFD" />
                      </svg>
                    </span>
                    Community guidelines
                  </a>
                  <a href="#" className="flex items-center gap-x-1.5">
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="5"
                        height="5"
                        viewBox="0 0 5 5"
                        fill="none"
                      >
                        <circle cx="2.5" cy="2.5" r="2.5" fill="#FDFDFD" />
                      </svg>
                    </span>
                    Terms of service
                  </a>
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default MarketPlaceHome;
