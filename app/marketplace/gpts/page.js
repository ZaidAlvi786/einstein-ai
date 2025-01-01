"use client";
import React, { useCallback, useEffect } from "react";
import { Button, Divider, Input, Skeleton, Spinner } from "@nextui-org/react";
import SearchIcon from "@/app/assets/svg/search-icon.svg";
import { useState, useRef } from "react";
import useDebounce from "@/app/hooks/useDebounce";
import {
  useGetToolsByCategoryQuery,
  useGetToolUniqueFiltersQuery,
} from "@/app/lib/features/chat/chatApi";
import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import { useRouter, useSearchParams } from "next/navigation";
import GptCard from "@/components/marketplace/GptCard";
import BackIcon from "@/app/assets/svg/back-icon.svg";
import NextIcon from "@/app/assets/svg/forward-icon.svg";
const GPTsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 12;
  const [filterMenu1, setFilterMenu1] = useState({
    open: false,
    label: "Likes",
    value: "total_likes",
  });
  const [gptDataState, setGptDataState] = useState([]);
  const [filterMenu2, setFilterMenu2] = useState({
    open: false,
    label: "Paid + free",
    value: "",
  });
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filterType, setfilterType] = useState("All");
  const tagsContainerRef = useRef(null); // Reference to the scrollable container
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true); // show loader on tag click (added because showing no tools found for a few seconds)
  const {
    data: gptsData,
    isFetching: gptsLoading,
    refetch: refetchGptData,
  } = useGetToolsByCategoryQuery({
    page_number: currentPage,
    per_page: perPage,
    search: debouncedSearchTerm,
    category: "gpt",
    price_type_filter: filterMenu2?.value,
    sort_by: filterMenu1?.value,
  });
  const { data: gptsTagsData, isFetching: gptsTagsLoading } =
    useGetToolUniqueFiltersQuery({ type: "gpt" });

  useEffect(() => {
    if (gptsData?.tools) {
      setGptDataState((prev) => [...prev, ...gptsData.tools]);
      setHasMore(currentPage < Math.ceil(gptsData.total_tools / perPage));
      setIsLoading(false);
    }
  }, [gptsData]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !gptsLoading) {
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
  }, [hasMore, gptsLoading]);

  // Update search value and apply debounce
  const handleSearchChange = (value) => {
    // If the clicked value is already the current filter type, reset the filter
    if (value === filterType) {
      setfilterType(""); // Remove the filter
      setSearchTerm(""); // Clear the search term
    } else {
      if (value === "All") {
        setfilterType(""); // Remove the filter
        setSearchTerm("");
        return;
      }
      setfilterType(value); // Set the new filter type
      setSearchTerm(value); // Set the search term to the selected value
    }
    handleReset();
  };

  const handleReset = () => {
    setIsLoading(true);
    setGptDataState([]);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    refetchGptData();
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

  const handleScroll = (direction) => {
    if (tagsContainerRef.current) {
      const container = tagsContainerRef.current;
      const scrollAmount = direction === "next" ? 200 : -200; // Adjust the scroll amount as needed

      // Scroll only if scrollable
      if (
        direction === "next" &&
        container.scrollLeft < container.scrollWidth - container.clientWidth
      ) {
        container.scrollTo({
          left: container.scrollLeft + scrollAmount, // Scroll to the right
          behavior: "smooth", // Smooth scroll animation
        });
      } else if (direction === "back" && container.scrollLeft > 0) {
        container.scrollTo({
          left: container.scrollLeft + scrollAmount, // Scroll to the left
          behavior: "smooth", // Smooth scroll animation
        });
      }
    }
  };

  return (
    <>
      <div className="mytools  xl:mt-[65px] 2xl:max-w-[1207px] xl:max-w-[905px] lg:max-w-[905px]  w-full mx-auto">
        <div className="toolsHeading mb-[47px]">
          <h3 className="text-white text-[32px] font-bold helvetica-font mb-[14px]">{`GPT’s`}</h3>
          <p className="text-[#B5B5B5] text-[14px] helvetica-font">{`Whether you’re writing marketing copy, creating a slideshow, turning images into videos and more, find the tools you need to empower your work process.`}</p>
          <div className="flex flex-row gap-2 mt-[20px] max-msm:mt-0 mb-4 max-msm:ml-3 items-center h-[35px] max-w-[500px]">
            <Input
              type="text"
              placeholder="Search for GPTs like “Image generators”"
              classNames={{
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
                  "h-[35px] px-4",
                ],
              }}
              value={filterType == "" ? searchTerm : ""}
              onValueChange={(value) => {
                handleSearchChange(value);
                setfilterType("");
              }}
              onClear={() => handleSearchChange("")}
              startContent={
                <SearchIcon
                  fill="#BABABA"
                  height={16}
                  width={16}
                  className="text-2xl text-[#BABABA] pointer-events-none flex-shrink-0"
                />
              }
            />
          </div>
        </div>
        <div className="Toolstabs">
          <div className="flex relative ">
            <span
              className="absolute cursor-pointer z-10 top-[3px] w-[30px] h-[30px] bg-white rounded-full"
              onClick={() => handleScroll("back")}
            >
              <BackIcon />
            </span>
            <div
              ref={tagsContainerRef}
              className="flex flex-row gap-2 overflow-y-scroll tags_x_overflow mx-[35px]"
            >
              {gptsTagsLoading ? (
                <Skeleton className="w-full rounded">
                  <div className="h-[40px] w-full"></div>
                </Skeleton>
              ) : (
                <>
                  {["All", ...gptsTagsData?.tags?.[0]?.uniqueTags]?.map(
                    (item, index) => (
                      <Button
                        onClick={() => {
                          handleSearchChange(item);
                        }}
                        key={index}
                        className={`text-white helvetica-font font-bold w-auto !h-[34px] rounded-full border-[1px] bg-transparent ${
                          filterType === item ? "bg-[#fff] text-[#000]" : ""
                        } hover:bg-[#fff] hover:text-[#000] text-[14px] flex justify-center items-center leading-normal min-w-fit`}
                      >
                        {item}
                      </Button>
                    )
                  )}
                </>
              )}
            </div>
            <span
              className="absolute cursor-pointer z-10 top-[3px] w-[30px] h-[30px] bg-white rounded-full right-0"
              onClick={() => handleScroll("next")}
            >
              <NextIcon />
            </span>
          </div>
          <div className="py-[17px]">
            <div className="w-full">
              <Divider className="h-[1px] bg-[#3C3C3C]" />
              <div className="flex flex-row gap-[15px] mt-[20px] mb-[8px] items-center w-full">
                <p className="text-white text-center font-helvetica text-[15px] font-bold leading-5">
                  Filter by:
                </p>
                <Menu
                  offset={10}
                  placement="bottom"
                  open={filterMenu2.open}
                  handler={(open) =>
                    setFilterMenu2((pre) => ({ ...pre, open }))
                  }
                >
                  <MenuHandler>
                    <span className="flex flex-row gap-1 items-center cursor-pointer select-none">
                      <p className="text-white text-center font-helvetica text-[15px] font-bold leading-5">
                        {filterMenu2.label}
                      </p>
                      <svg
                        className={`transform ${
                          filterMenu2.open ? "rotate-180" : "rotate-0"
                        } transition-transform duration-500 mt-[5px]`}
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="7"
                        viewBox="0 0 11 7"
                        fill="none"
                      >
                        <path
                          d="M6.36093 6.00054C5.97041 6.39107 5.33724 6.39107 4.94672 6.00054L0.526913 1.58074C0.235907 1.28973 0.235907 0.817918 0.526912 0.526913C0.817918 0.235907 1.28973 0.235907 1.58074 0.526913L4.94672 3.89289C5.33724 4.28342 5.97041 4.28342 6.36093 3.89289L9.72691 0.526912C10.0179 0.235906 10.4897 0.235907 10.7807 0.526913C11.0717 0.817918 11.0717 1.28973 10.7807 1.58074L6.36093 6.00054Z"
                          fill="white"
                        />
                      </svg>
                    </span>
                  </MenuHandler>
                  <MenuList className="bg-[#272727] border-0 text-white shadow-md p-1.5">
                    <MenuItem
                      onClick={() => {
                        setFilterMenu2({
                          open: false,
                          label: "Paid + free",
                          value: "",
                        });
                        handleReset();
                      }}
                      className="flex pt-2 gap-2 hover:bg-[#505050] cursor-pointer items-center"
                    >
                      <div className="font-helvetica">{"Paid + free"}</div>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setFilterMenu2({
                          open: false,
                          label: "Free",
                          value: "free",
                        });
                        handleReset();
                      }}
                      className="flex pt-2 gap-2 hover:bg-[#505050] cursor-pointer items-center"
                    >
                      <div className="font-helvetica">{"Free"}</div>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setFilterMenu2({
                          open: false,
                          label: "Paid",
                          value: "subscription",
                        });
                        handleReset();
                      }}
                      className="flex pt-2 gap-2 hover:bg-[#505050] cursor-pointer items-center"
                    >
                      <div className="font-helvetica">{"Paid"}</div>
                    </MenuItem>
                  </MenuList>
                </Menu>
                <p className="text-white text-center font-helvetica text-[15px] font-bold leading-5 pl-4">
                  Sort by:
                </p>
                <Menu
                  offset={10}
                  placement="bottom"
                  open={filterMenu1.open}
                  handler={(open) =>
                    setFilterMenu1((pre) => ({ ...pre, open }))
                  }
                >
                  <MenuHandler>
                    <span className="flex flex-row gap-1 items-center cursor-pointer select-none">
                      <p className="text-white text-center font-helvetica text-[15px] font-bold leading-5">
                        {filterMenu1.label}
                      </p>
                      <svg
                        className={`transform ${
                          filterMenu1.open ? "rotate-180" : "rotate-0"
                        } transition-transform duration-500 mt-[5px]`}
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="7"
                        viewBox="0 0 11 7"
                        fill="none"
                      >
                        <path
                          d="M6.36093 6.00054C5.97041 6.39107 5.33724 6.39107 4.94672 6.00054L0.526913 1.58074C0.235907 1.28973 0.235907 0.817918 0.526912 0.526913C0.817918 0.235907 1.28973 0.235907 1.58074 0.526913L4.94672 3.89289C5.33724 4.28342 5.97041 4.28342 6.36093 3.89289L9.72691 0.526912C10.0179 0.235906 10.4897 0.235907 10.7807 0.526913C11.0717 0.817918 11.0717 1.28973 10.7807 1.58074L6.36093 6.00054Z"
                          fill="white"
                        />
                      </svg>
                    </span>
                  </MenuHandler>
                  <MenuList className="bg-[#272727] border-0 text-white shadow-md p-1.5">
                    <MenuItem
                      onClick={() => {
                        setFilterMenu1({
                          open: false,
                          label: "Likes",
                          value: "total_likes",
                        });
                        handleReset();
                      }}
                      className="flex pt-2 gap-2 hover:bg-[#505050] cursor-pointer items-center"
                    >
                      <div className="font-helvetica">{"Likes"}</div>
                    </MenuItem>
                    <MenuItem
                      onClick={() =>
                        setFilterMenu1({
                          open: false,
                          label: "Comments",
                          value: "total_comments",
                        })
                      }
                      className="flex pt-2 gap-2 hover:bg-[#505050] cursor-pointer items-center"
                    >
                      <div className="font-helvetica">{"Comments"}</div>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setFilterMenu1({
                          open: false,
                          label: "Ratings",
                          value: "average_rating",
                        });
                        handleReset();
                      }}
                      className="flex pt-2 gap-2 hover:bg-[#505050] cursor-pointer items-center"
                    >
                      <div className="font-helvetica">{"Ratings"}</div>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setFilterMenu1({
                          open: false,
                          label: "Views",
                          value: "total_views",
                        });
                        handleReset()
                      }}
                      className="flex pt-2 gap-2 hover:bg-[#505050] cursor-pointer items-center"
                    >
                      <div className="font-helvetica">{"Views"}</div>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </div>
              {/* {gptsLoading ? (
                Array.from({ length: 5 }, (_, i) => i + 1).map((_, key) => (
                  <Skeleton key={key} className="w-full rounded mb-4">
                    <div className="h-[50px] w-full"></div>
                  </Skeleton>
                ))
              ) : (
                <table className="table-auto w-full helvetica-font">
                  <tbody>
                    {gptsData?.tools?.length > 0 ? (
                      gptsData?.tools?.map((item, index) => (
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
                                      alt="tool-pic"
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
                                  title={
                                    item?.introtext ? item?.introtext : null
                                  }
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
                            <ToolAddRemoveButton tool_id={item?.id} />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5}>
                          <div className="w-full flex items-center justify-center">
                            <p className="text-white">No data found.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )} */}
              {(gptsLoading || isLoading) && gptDataState?.length < perPage ? (
                <div className="grid grid-cols-12 gap-5 py-4">
                  {Array.from({ length: 6 }, (_, i) => i + 1).map((_, key) => (
                    <div key={key} className="col-span-4 ">
                      <Skeleton className="w-full rounded-[21.411px]">
                        <section className="h-[210px]"></section>
                      </Skeleton>
                    </div>
                  ))}
                </div>
              ) : gptDataState?.length > 0 ? (
                <div className="grid grid-cols-12 gap-5 py-4">
                  {gptDataState?.map((item, index) => (
                    <div
                      className="col-span-4"
                      key={index}
                      style={{ cursor: "pointer" }}
                    >
                      {/* <MarketplaceCard cardData={item} /> */}
                      <GptCard
                        cardData={item}
                        navigateToolDetailsPage={navigateToolDetailsPage}
                        refetchToolListOnHome={refetchGptData}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full flex items-center justify-center">
                  <p className="text-white">No Tool found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          ref={observerRef}
          className="h-10 pb-4 flex justify-center items-center"
        >
          {hasMore && gptDataState?.length >= perPage && (
            <Spinner className="mt-2 " size="md" color="white" />
          )}
        </div>
      </div>
    </>
  );
};

export default GPTsPage;
