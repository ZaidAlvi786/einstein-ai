"use client";
import React, { useState, useCallback, useEffect } from "react";
// import Image from "next/image";
import {
  Button,
  Autocomplete,
  AutocompleteItem,
  Avatar,
  AutocompleteSection,
  Skeleton,
  Image,
} from "@nextui-org/react";
import trendingFirst from "@/app/assets/image/trending-01.png";
import KeyboardDown from "@/app/assets/svg/keyboard_arrow_down_blue.svg";
import SearchIcon from "@/app/assets/svg/search-icon.svg";
import AutoModel from "@/app/assets/image/AutoModel.png";
import EinsteinLogo from "@/app/assets/image/EinsteinLogo.png";
import {
  useGetToolsByCategoryQuery,
  useGetTrendingToolsQuery,
  useSearchToolsForAllCategoryQuery,
} from "@/app/lib/features/chat/chatApi";
import ToolsLikeComponents from "./ToolsLikesComponent";
import ToolsUsersComponent from "./ToolsUsersComponent";
import useDebounce from "@/app/hooks/useDebounce";
import ToolsPriceComponent from "./ToolsPriceComponent";
import { useRouter, useSearchParams } from "next/navigation";
import MarketplaceCard from "./MarketplaceCard";
import ToglBox from "./ToglBox";
import GptCard from "./GptCard";
import Link from "next/link";

const MarketPlaceHome = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [allData, setAllData] = React.useState([]);

  const {
    data: trendingData,
    isLoading: trendingLoading,
    refetch: refetchTrandingListOnHome,
  } = useGetTrendingToolsQuery({
    page_number: currentPage,
    per_page: 6,
    // search: debouncedSearchTerm, // dashboard data will not change on search filter
  });

  const { data: toolsData, isLoading: toolsLoading } =
    useSearchToolsForAllCategoryQuery({
      page_number: currentPage,
      per_page: 6,
      search: debouncedSearchTerm,
    });

  const {
    data: modelsData,
    isFetching: modelsLoading,
    refetch: refetchModelListOnHome,
  } = useGetToolsByCategoryQuery({
    page_number: currentPage,
    per_page: 6,
    // search: debouncedSearchTerm, // dashboard data will not change on search filter
    category: "model",
    price_type_filter: "",
    sort_by: "",
  });

  const {
    data: gptData,
    isFetching: gptLoading,
    refetch: refetchGptListOnHome,
  } = useGetToolsByCategoryQuery({
    page_number: currentPage,
    per_page: 6,
    // search: debouncedSearchTerm, // dashboard data will not change on search filter
    category: "gpt",
    price_type_filter: "",
    sort_by: "",
  });

  const {
    data: pluginData,
    isFetching: pluginLoading,
    refetch: refetchPluginListOnHome,
  } = useGetToolsByCategoryQuery({
    page_number: currentPage,
    per_page: 6,
    // search: debouncedSearchTerm, // dashboard data will not change on search filter
    category: "plugin",
    price_type_filter: "",
    sort_by: "",
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

  useEffect(() => {
    const combineData = { ...toolsData?.tools, trending: trendingData?.tools };
    if (combineData) {
      transformData(combineData);
    }
  }, [
    toolsData?.tools?.plugin,
    toolsData?.tools?.model,
    toolsData?.tools?.gpt,
    toolsData?.tools?.widget,
    trendingData?.tools,
    searchTerm,
  ]);

  const transformData = (apiData) => {
    const groups = [
      { key: "plugin", groupName: "Plugins" },
      { key: "model", groupName: "Models" },
      { key: "gpt", groupName: "GPT's" },
      { key: "widget", groupName: "Widgets" },
      { key: "trending", groupName: "Trending" },
      { key: "egos", groupName: "Egos" },
    ];

    // Helper function to map each item to the groupMenu structure
    const mapItems = (items) => {
      return items.map((item, index) => ({
        id: item.id,
        image: item.logo, // Mapping the logo to image
        title: item.name, // Mapping the name to title
        subTitle: item.introtext || "No description available", // Default subtitle if introtext is empty
      }));
    };

    // Transforming each group
    const AutocompleteData = groups.map((group, groupIndex) => ({
      id: groupIndex + 1,
      groupName: group.groupName,
      groupMenu: mapItems(apiData[group.key] || []), // Map the items in the group
    }));

    const filterBlankArrayData = AutocompleteData.filter(
      (data) => data.groupMenu.length !== 0
    );

    setAllData(filterBlankArrayData);
    return AutocompleteData;
  };

  const handleRedirection = (e, link) => {
    e.preventDefault();
    router.push(link);
  };
  return (
    <>
      <div className="2xl:max-w-[1227px] xl:max-w-[925px] lg:max-w-[915px] w-full mx-auto px-3">
        <div className="text-center mt-[50px] mb-[105px]">
          {/* <ToglBox /> */}
          <h2 className="text-white 4k:text-[91.163px] text-[40.433px] font-normal helvetica-font mb-[16px]">{`Welcome to Togl Marketplace`}</h2>
          <p className="text-[#E4E4E4] text-[17px] !font-normal helvetica-font leading-[140%]">
            {`Explore thousands of free and paid plugins, models, widgets, GPT’s, prompts`}
            <br /> {`and more to take your work to the next level.`}
          </p>

          <div className="flex flex-row gap-2 mt-[20px] max-msm:mt-0 mb-4 max-msm:ml-3 items-center h-[52px] max-w-[467px] mx-auto">
            <Autocomplete
              //  key={searchTerm}
              fullWidth={true}
              classNames={{
                base: "max-w-[467px]",
                listboxWrapper: "max-h-[320px]",
                selectorButton: "text-default-500",
                content: "bg-[#171717]",
              }}
              items={allData}
              inputProps={{
                classNames: {
                  label: "text-white",
                  input: [
                    "bg-[transparent]",
                    "placeholder:text-[#BABABA]",
                    "text-[14px]",
                    "font-normal",
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
                <SearchIcon className="text-default-400 w-[15px] h-[16px] 4k:w-[22.59px]  4k:h-[22.5px]" />
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
                    <AutocompleteItem
                      key={menu.id}
                      textValue={menu.title}
                      onClick={() => navigateToolDetailsPage(menu?.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                          <Avatar
                            alt={menu.title}
                            className="flex-shrink-0 w-[72px] h-[72px]"
                            src={menu?.image}
                            fallback={
                              <Image
                                src={"/svg/user.svg"}
                                alt="profile-pic"
                                width={14}
                                height={17}
                              />
                            }
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
          {/* <button className="text-[#707AFD] flex gap-[3px] items-center">
            <span className="text-[13px] font-bold text-[#707AFD]">
              Browse all
            </span>
            <KeyboardDown />
          </button> */}
        </div>
        <div className="gap-4 mb-[37px]">
          {trendingLoading ? (
            <div className="grid grid-cols-12 gap-5 p-4">
              {Array.from({ length: 6 }, (_, i) => i + 1).map((_, key) => (
                <div key={key} className="col-span-4 ">
                  <Skeleton className="w-full rounded-[21.411px]">
                    <section className="h-[210px]"></section>
                  </Skeleton>
                </div>
              ))}
            </div>
          ) : trendingData?.tools?.length > 0 ? (
            <div className="grid grid-cols-12 gap-5 p-4">
              {trendingData?.tools?.map((item, index) => (
                <div
                  className="lg:col-span-4 sm:col-span-6 col-span-12 cursor-pointer"
                  key={index}
                >
                  <MarketplaceCard
                    cardData={item}
                    navigateToolDetailsPage={navigateToolDetailsPage}
                    refetchToolListOnHome={refetchTrandingListOnHome}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full flex items-center justify-center">
              <p className="text-white">No data found.</p>
            </div>
          )}
        </div>

        {pluginData?.tools ? (
          <div className="mb-[39px]">
            <div className="flex gap-[3px] items-end justify-between mb-[22px]">
              <div className="flex flex-col">
                <Link href={`/marketplace/plugins`}>
                  <div className="text-[24px] cursor-pointer font-bold text-[#fff] leading-[140%] helvetica-font mb-[4px]">
                    Plugins
                  </div>
                </Link>
                <p className="text-[#858584] text-[14px] helvetica-font font-medium">
                  Most popular Plugins by our community.
                </p>
              </div>
              <p
                onClick={(e) => handleRedirection(e, "/marketplace/plugins")}
                className="text-[#707AFD] flex gap-[3px] items-center cursor-pointer"
              >
                <span className="text-[13px] font-bold text-[#0A84FF]">
                  Browse all
                </span>
                <KeyboardDown />
              </p>
            </div>
            <div>
              {pluginLoading ? (
                <div className="grid grid-cols-12 gap-5 p-4">
                  {Array.from({ length: 6 }, (_, i) => i + 1).map((_, key) => (
                    <div
                      key={key}
                      className="lg:col-span-4 sm:col-span-6 col-span-12 p-4"
                    >
                      <Skeleton className="w-full rounded-[21.411px]">
                        <section className="h-[210px]"></section>
                      </Skeleton>
                    </div>
                  ))}
                </div>
              ) : pluginData?.tools?.length > 0 ? (
                <div className="grid grid-cols-12 gap-5 p-4">
                  {pluginData?.tools?.map((item, index) => (
                    <div
                      className="lg:col-span-4 sm:col-span-6 col-span-12"
                      key={index}
                      style={{ cursor: "pointer" }}
                    >
                      <MarketplaceCard
                        cardData={item}
                        navigateToolDetailsPage={navigateToolDetailsPage}
                        refetchToolListOnHome={refetchPluginListOnHome}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full flex items-center justify-center">
                  <p className="text-white">No data found.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          ""
        )}
        {modelsData?.tools ? (
          <div className="mb-[39px]">
            <div className="flex gap-[3px] items-end justify-between mb-[22px]">
              <div className="flex flex-col">
                <Link href={`/marketplace/models`}>
                  <div className="text-[24px] cursor-pointer font-bold text-[#fff] leading-[140%] helvetica-font mb-[4px]">
                    Models
                  </div>
                </Link>
                <p className="text-[#858584] text-[14px] helvetica-font font-medium">
                  Most popular Models by our community.
                </p>
              </div>
              <p
                onClick={(e) => handleRedirection(e, "/marketplace/models")}
                className="text-[#707AFD] flex gap-[3px] items-center cursor-pointer"
              >
                <span className="text-[13px] font-bold text-[#0A84FF]">
                  Browse all
                </span>
                <KeyboardDown />
              </p>
            </div>
            <div>
              {modelsLoading ? (
                <div className="grid grid-cols-12 gap-5 p-4">
                  {Array.from({ length: 6 }, (_, i) => i + 1).map((_, key) => (
                    <div
                      key={key}
                      className="lg:col-span-4 sm:col-span-6 col-span-12"
                    >
                      <Skeleton className="w-full rounded-[21.411px]">
                        <section className="h-[210px]"></section>
                      </Skeleton>
                    </div>
                  ))}
                </div>
              ) : modelsData?.tools?.length > 0 ? (
                <div className="grid grid-cols-12 gap-5 p-4">
                  {modelsData?.tools?.map((item, index) => (
                    <div
                      className="lg:col-span-4 sm:col-span-6 col-span-12"
                      key={index}
                      onClick={() => navigateToolDetailsPage(item?.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <MarketplaceCard
                        cardData={item}
                        navigateToolDetailsPage={navigateToolDetailsPage}
                        refetchToolListOnHome={refetchModelListOnHome}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full flex items-center justify-center">
                  <p className="text-white">No data found.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          ""
        )}
        {/* {toolsData?.tools?.widget ? (
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
              <p
                onClick={(e) => handleRedirection(e, "/marketplace/widgets")}
                className="text-[#707AFD] flex gap-[3px] items-center cursor-pointer"
              >
                <span className="text-[13px] font-bold text-[#707AFD]">
                  Browse all
                </span>
                <KeyboardDown />
              </p>
            </div>
            <div>
              {toolsLoading ? (
                <div className="grid grid-cols-12 gap-5 p-4">
                  {Array.from({ length: 6 }, (_, i) => i + 1).map((_, key) => (
                    <div key={key} className="col-span-4 ">
                      <Skeleton className="w-full rounded-[21.411px]">
                        <section className="h-[210px]"></section>
                      </Skeleton>
                    </div>
                  ))}
                </div>
              ) : toolsData?.tools?.widget?.length > 0 ? (
                <div className="grid grid-cols-12 gap-5 p-4">
                  {toolsData?.tools?.widget?.map((item, index) => (
                    <div
                      className="col-span-4"
                      key={index}
                      onClick={() => navigateToolDetailsPage(item?.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <MarketplaceCard cardData={item} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full flex items-center justify-center">
                  <p className="text-white">No data found.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          ""
        )} */}
        {gptData?.tools ? (
          <div className="mb-[39px]">
            <div className="flex gap-[3px] items-end justify-between mb-[22px]">
              <div className="flex flex-col">
                <Link href={`/marketplace/gpts`}>
                  <div className="text-[24px] cursor-pointer font-bold text-[#fff] leading-[140%] helvetica-font mb-[4px]">{`GPT’s`}</div>
                </Link>
                <p className="text-[#858584] text-[14px] helvetica-font font-medium">{`Most popular GPT’s by our community.`}</p>
              </div>
              <p
                onClick={(e) => handleRedirection(e, "/marketplace/gpts")}
                className="text-[#707AFD] flex gap-[3px] items-center cursor-pointer"
              >
                <span className="text-[13px] font-bold text-[#0A84FF]">
                  Browse all
                </span>
                <KeyboardDown />
              </p>
            </div>
            <div>
              {gptLoading ? (
                <div className="grid grid-cols-12 gap-5 p-4">
                  {Array.from({ length: 6 }, (_, i) => i + 1).map((_, key) => (
                    <div
                      key={key}
                      className="lg:col-span-4 sm:col-span-6 col-span-12"
                    >
                      <Skeleton className="w-full rounded-[21.411px]">
                        <section className="h-[210px]"></section>
                      </Skeleton>
                    </div>
                  ))}
                </div>
              ) : gptData?.tools?.length > 0 ? (
                <div className="grid grid-cols-12 gap-5 p-4">
                  {gptData?.tools?.map((item, index) => (
                    <div
                      className="lg:col-span-4 sm:col-span-6 col-span-12"
                      key={index}
                      onClick={() => navigateToolDetailsPage(item?.id)}
                      style={{ cursor: "pointer" }}
                    >
                      {/* <MarketplaceCard cardData={item} /> */}
                      <GptCard
                        cardData={item}
                        navigateToolDetailsPage={navigateToolDetailsPage}
                        refetchToolListOnHome={refetchGptListOnHome}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full flex items-center justify-center">
                  <p className="text-white">No data found.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          ""
        )}
        <footer>
          <div className="mx-auto w-full max-w-screen-xl">
            {/* <div className="grid grid-cols-2 gap-8 px-4 py-6 lg:py-8 md:grid-cols-4">
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
            </div> */}
            <div className="px-4 pb-10 flex items-center">
              <div className="mb-6 md:mb-0">
                {/* <a href="#" className="flex items-center">
                  <img
                    src={EinsteinLogo?.src}
                    className="w-[121px] h-[34px] me-3 object-contain mb-[18px]"
                    alt="Einstein Logo"
                  />
                </a> */}
                <span className="text-sm font-bold text-white sm:text-center flex items-center gap-1.5">
                  © 2024 Togl Inc
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
