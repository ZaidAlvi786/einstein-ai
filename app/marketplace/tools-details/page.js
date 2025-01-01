"use client";
import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";
import { Avatar, Button, Skeleton, Textarea } from "@nextui-org/react";
import Linkicon from "@/app/assets/svg/link-icon.svg";
import Facebookicon from "@/app/assets/svg/facebook-icon.svg";
import Twittericon from "@/app/assets/svg/twitter-icon.svg";
import Instagramicon from "@/app/assets/svg/insta-icon.svg";
import Linkedinicon from "@/app/assets/svg/linkedin.svg";
import Googleicon from "@/app/assets/svg/google-icon.svg";
import Githubicon from "@/app/assets/svg/github-icon.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import {
  useDeactivateToolMutation,
  useGetSimilarToolsQuery,
  useGetToolDetailsGuestQuery,
  usePostRatingMutation,
  useReactivateToolMutation,
  useReportToolMutation,
  useUpdateRatingMutation,
  useUpdateToolMutation,
} from "@/app/lib/features/chat/chatApi";
import ToolsUsersComponent from "@/components/marketplace/ToolsUsersComponent";
import ToolAddRemoveButton from "@/components/toolsDetailsComponents/toolAddRemove";
import { useRouter, useSearchParams } from "next/navigation";
import moment from "moment";
import { useAuth } from "@/app/authContext/auth";
import ToolsComments from "@/components/toolsDetailsComponents/toolsComments";
import ToolsRatingComponents from "@/components/marketplace/ToolsRatingComponent";
import ToolSubscribe from "@/components/toolsDetailsComponents/toolSubscribe";
import RatingSuccessfullModel from "@/components/marketplace/RatingSuccessfullModel";
import AdminStatusBar from "@/components/marketplace/AdminStatusBar";
import AdminToolsHistory from "@/components/marketplace/AdminToolsHistory";
import { Checkbox, Tabs } from "antd";
import AddGptModel from "@/components/marketplace/AddGptModel";
import AddCardFormModal from "@/components/billing/AddCardFormModal";
import { useGetCustomersCardsQuery } from "@/app/lib/features/payment/paymentApi";

import jsPDF from "jspdf";
import "jspdf-autotable";

const ToolsDetailsPage = () => {
  const router = useRouter();
  const auth = useAuth();
  const searchParams = useSearchParams();
  const tool_id = searchParams?.get("tool_id") ?? null;
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const { data: cardsList, isFetching: cardsListLoading } =
    useGetCustomersCardsQuery(
      { user_id: auth?.user?.userID },
      { skip: !auth?.user?.userID && !auth?.user?.email }
    );
  const [OpenCardModal, setOpenCardModal] = useState({
    open: false,
    mode: "add",
    card_details: null,
  });
  const {
    data: getToolDetailsGuestData,
    isLoading: getToolDetailsGuestLoading,
    refetch,
  } = useGetToolDetailsGuestQuery(
    { IsLoggedIn: auth?.user?.email && auth?.user?.fullname, tool_id },
    { skip: !tool_id }
  );
  const [postRating] = usePostRatingMutation();
  const [updateRating] = useUpdateRatingMutation();
  const { data: getSimilarToolsData, isLoading: getSimilarToolsLoading } =
    useGetSimilarToolsQuery(
      { tool_id, page_number: 1, per_page: 10 },
      { skip: !tool_id }
    );
  console.log("getSimilarToolsData: ", getSimilarToolsData);
  const { data: toolPerformanceRecord, isLoading: isLoadingPerformanceRecord } =
    useFetchToolPerformanceRecordsQuery(
      { tool_id: tool_id, page_number: 1, per_page: 500 },
      { skip: !tool_id }
    );

  const { data: toolEarningData, isLoading: isLoadingToolEarning } =
    useGetToolEarningAndAnalyticsQuery(
      { tool_id: tool_id, start_date: "", end_date: "" },
      { skip: !tool_id }
    );

  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [IsAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [addToolModelGpt, setAddToolModelGpt] = useState({
    open: false,
    category: "",
    isEditable: false,
    tool_details: null,
  });
  const [isOpenCancelSubsModal, setisOpenCancelSubsModal] = useState(false);
  const [isOpenReportModal, setisOpenReportModal] = useState(false);
  const [UpdateTool] = useUpdateToolMutation();
  const [isOpenSubsribeModal, setIsOpenSubsribeModal] = useState(false);

  const handleSubmitRating = async (rate) => {
    const ratingData = {
      tool_id,
      rating: rate,
    };

    try {
      if (
        getToolDetailsGuestData?.tool?.user_rating &&
        getToolDetailsGuestData?.tool?.user_rating > 0
      ) {
        await updateRating(ratingData)
          .unwrap()
          .then((response) => {
            setIsRatingModalOpen(true);
            setRating(rate);
            refetch();
          })
          .catch((error) => {
            toast.error(
              (error?.data?.detail ?? error?.message) || "Something went wrong"
            );
          });
      } else {
        await postRating(ratingData)
          .unwrap()
          .then((response) => {
            setIsRatingModalOpen(true);
            setRating(rate);
            refetch();
          })
          .catch((error) => {
            toast.error(
              (error?.data?.detail ?? error?.message) || "Something went wrong"
            );
          });
      }
      setIsRatingModalOpen(true);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const handleRatingModelClose = () => {
    setIsRatingModalOpen(false);
  };

  useEffect(() => {
    const authData = window?.localStorage?.getItem("enstine_auth")
      ? JSON?.parse(window?.localStorage?.getItem("enstine_auth"))
      : null;
    if (authData?.userID === getToolDetailsGuestData?.tool?.creator_id) {
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    if (tool_id) return;
    router.back();
  }, [tool_id]);

  useEffect(() => {
    if (auth?.user?.userID === getToolDetailsGuestData?.tool?.creator_id) {
      setIsAdmin(true);
    } else {
      setRating(getToolDetailsGuestData?.tool?.user_rating);
    }
  }, [getToolDetailsGuestData]);

  const downloadAllAsPdf = (invoices) => {
    const doc = new jsPDF();
    doc.text("All Tool Performance Records", 14, 10);
    doc.autoTable({
      startY: 20,
      head: [
        [
          "Date",
          "Total Earnings",
          "Uses",
          "Users",
          "Subscribed",
          "Page Views",
          "Adds",
          "Free Uses",
          "Free Trials Expended",
        ],
      ],
      body:
        toolPerformanceRecord?.data?.length > 0
          ? toolPerformanceRecord?.data?.map((item) => [
              moment(item.created_at).format("MMM YYYY"),
              item.total_income,
              item.total_uses,
              item.total_users,
              item.subscribed_users,
              item.page_views,
              item.adds,
              item.free_uses,
              item.free_trails_expended,
            ])
          : "No Data Found",
    });
    doc.save("all_tool_records.pdf");
  };

  const activeTool = (key) => {
    UpdateTool({ tool_id: tool_id, is_active: key === "Pause" ? false : true })
      .unwrap()
      .then((response) => {
        refetch();
        toast.success("Tool updated successfully");
      })
      .catch((error) => {
        console.log("###_error_### ", error);
      });
  };

  const handleCopy = () => {
    const url = new URL(window.location.href);

    url.searchParams.delete("group");

    navigator.clipboard
      .writeText(url.toString())
      .then(() => {
        toast.success("Copied!");
      })
      .catch((err) => {
        toast.error("Failed to copy.");
      });
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
    const newUrl =
      "/marketplace/tools-details?" + createMultipleQueryString({ tool_id });
    router.replace(newUrl);
  };

  return (
    <>
      <div className="w-full xl:max-w-[900px] lg:max-w-[920px] min-[1700px]:max-w-[1300px] mx-auto pb-7">
        <div className="grid grid-cols-12 gap-4 mt-28">
          <div className="col-span-5">
            <div className="text-white mt-16">
              <div className="flex gap-3 items-center text-center min-[1700px]:mb-[22px] mb-5">
                {getToolDetailsGuestLoading ? (
                  <Skeleton className="rounded-full">
                    <div className="h-9 w-9 rounded-full bg-default-300"></div>
                  </Skeleton>
                ) : (
                  <Avatar
                    src={getToolDetailsGuestData?.tool?.logo}
                    showFallback={true}
                    alt="tools-logo"
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
                )}
                {getToolDetailsGuestLoading ? (
                  <Skeleton className="rounded-lg">
                    <div className="h-7 w-[100px] rounded-lg bg-default-300"></div>
                  </Skeleton>
                ) : (
                  <p className="text-[32px] text-white font-helvetica">
                    {getToolDetailsGuestData?.tool?.name ?? "-"}
                  </p>
                )}
              </div>
              {getToolDetailsGuestLoading ? (
                <Skeleton className="rounded-lg">
                  <div className="h-[100px] rounded-lg bg-default-300"></div>
                </Skeleton>
              ) : (
                <>
                  <p className="text-sm text-white mb-5 font-helvetica">
                    {getToolDetailsGuestData?.tool?.introtext ?? "-"}
                  </p>
                  {IsAdmin && (
                    <div className="flex gap-2 mb-3">
                      {/* <p className="text-base font-roboto font-bold text-white ">
                        ${getToolDetailsGuestData?.tool?.price?.monthly}/m Or
                      </p>{" "} */}
                      <p className="text-white text-base font-roboto font-bold">
                        {/* {getToolDetailsGuestData?.tool?.price?.monthly > 0
                          ? `$${getToolDetailsGuestData?.tool?.price?.monthly}/m`
                          : getToolDetailsGuestData?.tool?.price?.annual > 0
                          ? `${getToolDetailsGuestData?.tool?.price?.annual}/y`
                          : getToolDetailsGuestData?.tool?.price?.per_use > 0
                          ? `$${getToolDetailsGuestData?.tool?.price?.per_use} Per Use`
                          : ""} */}
                        {getToolDetailsGuestData?.tool?.price?.monthly > 0 &&
                          `$${getToolDetailsGuestData?.tool?.price?.monthly}/m`}
                        {getToolDetailsGuestData?.tool?.price?.monthly
                          ? " or "
                          : ""}
                        {getToolDetailsGuestData?.tool?.price?.annual > 0 &&
                          `$${getToolDetailsGuestData?.tool?.price?.annual}/y`}
                        {getToolDetailsGuestData?.tool?.price?.per_use > 0 &&
                          `$${getToolDetailsGuestData?.tool?.price?.per_use} Per use`}
                      </p>
                    </div>
                  )}
                  <div className="flex gap-3 items-center min-[1700px]:mb-7 mb-5">
                    <div className="flex gap-[7px] items-center">
                      <Avatar
                        src={
                          getToolDetailsGuestData?.tool?.creator_details
                            ?.creator_profile_picture_url
                        }
                        showFallback={true}
                        alt="creator_profile_picture_url"
                        className="w-5 h-5 cursor-pointer"
                        radius="sm"
                        fallback={
                          <Image
                            src={"/svg/user.svg"}
                            alt="profile-pic"
                            width={14}
                            height={17}
                          />
                        }
                      />
                      <p className="text-[#B9B9B9] text-sm font-medium font-helvetica">
                        {getToolDetailsGuestData?.tool?.creator_details
                          ?.creator_full_name ?? "-"}
                      </p>
                    </div>
                    <div className="flex gap-3 items-center">
                      <span className="block w-1 h-1 bg-[#B9B9B9] rounded-full"></span>
                      <p className="text-[#B9B9B9] text-sm font-medium font-helvetica capitalize">
                        {getToolDetailsGuestData?.tool?.category ?? "-"}
                      </p>
                    </div>
                    <div className="flex gap-3 items-center">
                      <span className="block w-1 h-1 bg-[#B9B9B9] rounded-full"></span>
                      <div className="flex gap-1 items-center">
                        {/* <ToolsLikeComponents total_likes={getToolDetailsGuestData?.tool?.total_likes} /> */}
                        <ToolsRatingComponents
                          total_rating={
                            getToolDetailsGuestData?.tool?.average_rating
                          }
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <span className="block w-1 h-1 bg-[#B9B9B9] rounded-full"></span>
                      <div className="flex gap-1 items-center">
                        <ToolsUsersComponent
                          total_views={
                            getToolDetailsGuestData?.tool?.total_users
                          }
                        />
                      </div>
                    </div>
                  </div>
                  {IsAdmin ? (
                    <div className="flex gap-[10px] items-center">
                      <Button
                        onClick={() =>
                          setAddToolModelGpt({
                            open: true,
                            category: getToolDetailsGuestData?.tool?.category,
                            isEditable: true,
                            tool_details: getToolDetailsGuestData?.tool,
                          })
                        }
                        className={`text-base h-auto rounded-full font-helvetica font-bold py-1.5 px-5 bg-[#0A84FF] text-white`}
                      >
                        {"Edit"}
                      </Button>
                      {getToolDetailsGuestData?.tool?.is_active ? (
                        <Button
                          onClick={() => activeTool("Pause")}
                          className={` text-[#636363] helvetica-font h-9 rounded-full bg-transparent border border-[#636363]
                    hover:bg-[#fff] hover:text-[#000] text-[16px] flex justify-center items-center`}
                        >
                          Pause
                        </Button>
                      ) : (
                        <Button
                          onClick={() => activeTool("Active")}
                          className={` text-[#636363] helvetica-font h-9 rounded-full bg-transparent border border-[#636363]
                    hover:bg-[#fff] hover:text-[#000] text-[16px] flex justify-center items-center`}
                        >
                          Paused
                        </Button>
                      )}
                      <Button
                        onClick={() => setisOpenCancelSubsModal(true)}
                        className={` text-[#636363] helvetica-font h-9 rounded-full bg-transparent border border-[#636363]
                    hover:bg-[#fff] hover:text-[#000] text-[16px] flex justify-center items-center`}
                      >
                        Delete
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-[10px] items-center">
                        {!getToolDetailsGuestData?.tool
                          ?.subscription_completed &&
                          !getToolDetailsGuestData?.tool?.trial_completed &&
                          !getToolDetailsGuestData?.tool?.is_subscribed && (
                            <ToolAddRemoveButton
                              tool_id={tool_id}
                              tool_info={getToolDetailsGuestData?.tool}
                              refetchToolListOnHome={refetch}
                            />
                          )}
                        {(getToolDetailsGuestData?.tool?.price?.monthly > 0 ||
                          getToolDetailsGuestData?.tool?.price?.annual > 0) && (
                          <ToolSubscribe
                            tool_id={tool_id}
                            tool_info={getToolDetailsGuestData?.tool}
                            getToolDetailsGuestData={getToolDetailsGuestData}
                            setOpenCardModal={setOpenCardModal}
                            isPaymentMethodAdded={
                              cardsList?.payment_methods?.length > 0
                            }
                            isOpenSubsribeModal={isOpenSubsribeModal}
                            setIsOpenSubsribeModal={setIsOpenSubsribeModal}
                          />
                        )}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="col-span-7 text-white">
            {getToolDetailsGuestLoading ? (
              <Skeleton className="h-[350px] w-full rounded-lg" />
            ) : (
              <>
                <Swiper
                  style={{
                    "--swiper-navigation-color": "#fff",
                    "--swiper-pagination-color": "#fff",
                  }}
                  loop={true}
                  spaceBetween={10}
                  navigation={false}
                  thumbs={{ swiper: thumbsSwiper }}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="mySwiper2 h-[300px] xl:h-[300px] min-[1700px]:h-[445px] rounded-lg mb-5"
                >
                  {getToolDetailsGuestData?.tool?.preview_url?.map(
                    (item, index) => (
                      <SwiperSlide
                        key={index}
                        style={{
                          borderRadius: "0.5rem",
                          border: "1.5px solid #636363",
                        }}
                      >
                        <img
                          src={item}
                          alt="preview_url"
                          className="w-full h-full object-contain"
                        />
                      </SwiperSlide>
                    )
                  )}
                </Swiper>
                <Swiper
                  onSwiper={setThumbsSwiper}
                  loop={true}
                  spaceBetween={10}
                  slidesPerView={4}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="mySwiper h-20"
                >
                  {getToolDetailsGuestData?.tool?.preview_url?.map(
                    (item, index) => (
                      <SwiperSlide
                        key={index}
                        style={{
                          borderRadius: "0.5rem",
                          border: "1.5px solid #222222",
                        }}
                      >
                        <img
                          src={item}
                          alt="preview_url"
                          className="w-full h-full object-contain"
                        />
                      </SwiperSlide>
                    )
                  )}
                </Swiper>
              </>
            )}
          </div>
        </div>
      </div>

      {IsAdmin ? (
        <div>
          <div className="pb-12">
            <div className="mt-9 admin-details-tab">
              <div className="w-full xl:max-w-[900px] lg:max-w-[920px] min-[1700px]:max-w-[1300px] mx-auto relative">
                <Tabs
                  activeKey={activeTab}
                  onChange={(key) => setActiveTab(key)}
                >
                  <Tabs.TabPane key="about" tab="About">
                    {/* About content here */}
                    <div className="text-white text-sm font-helvetica font-medium pb-12">
                      {getToolDetailsGuestData?.tool?.description ?? ""}
                    </div>
                  </Tabs.TabPane>

                  <Tabs.TabPane key="admin" tab="Admin">
                    {/* Admin content here */}
                    <div className="text-white text-sm font-helvetica font-medium pb-3">
                      <AdminStatusBar
                        toolEarningData={toolEarningData}
                        isLoading={isLoadingToolEarning}
                        tool_id={tool_id}
                        getToolDetailsGuestData={getToolDetailsGuestData}
                      />
                      <div className="mb-8 pt-8">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-[22px] text-white font-bold helvetica-font mb-[14px]">{`History`}</h2>
                          </div>
                          <div>
                            <Button
                              onClick={downloadAllAsPdf}
                              className="w-[98px] h-[24px] min-w-unit-0 text-white bg-transparent text-[10px] font-bold rounded border-1 border-[#B7B7B7] hover:bg-white hover:text-black"
                            >
                              Download All
                            </Button>
                          </div>
                        </div>
                        <AdminToolsHistory
                          toolPerformanceRecord={toolPerformanceRecord}
                          isLoading={isLoadingPerformanceRecord}
                          tool_id={tool_id}
                        />
                      </div>
                    </div>
                  </Tabs.TabPane>
                </Tabs>
              </div>
            </div>
            <div className="w-full xl:max-w-[900px] lg:max-w-[920px] min-[1700px]:max-w-[1300px] mx-auto mt-11">
              <div className="grid grid-cols-12 gap-9 mt-16">
                <div className="col-span-8">
                  {getSimilarToolsData?.tools?.length > 0 && (
                    <>
                      <p className="font-helvetica text-sm min-[1700px]:mb-9 mb-7 font-bold text-white">
                        More Like this
                      </p>
                      <div className="grid grid-cols-12 gap-4 min-[1700px]:mb-14 mb-8">
                        {getSimilarToolsLoading
                          ? Array.from({ length: 3 }, (_, i) => i + 1).map(
                              (_, key) => (
                                <div key={key} className="col-span-4">
                                  <Skeleton className="bg-[#222222] rounded-2xl h-[110px] min-[1700px]:h-[164px] p-2">
                                    <section className="h-[200px]"></section>
                                  </Skeleton>
                                </div>
                              )
                            )
                          : getSimilarToolsData?.tools?.map((item, index) => (
                              <div key={index} className="col-span-4">
                                <div
                                  className="relative bg-[#222222] rounded-2xl h-[110px] min-[1700px]:h-[164px]"
                                  onClick={() =>
                                    navigateToolDetailsPage(item?.id)
                                  }
                                >
                                  <div className="absolute bg-[#00000040] rounded-lg text-white text-sm font-helvetica p-1 font-bold max-w-36 w-full flex gap-2 items-center m-2">
                                    <Avatar
                                      src={item?.logo}
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
                                    {item?.name && <p>{item.name}</p>}
                                  </div>
                                  {item?.preview_url?.length && (
                                    <img
                                      className="w-full h-full cursor-pointer rounded-[15px]"
                                      src={item?.preview_url?.[0]}
                                      alt="similar-tools-preview-url"
                                    />
                                  )}
                                </div>
                              </div>
                            ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="pb-11">
          <div className="border-b-1 border-[#3C3C3C] mt-9">
            <div className="w-full xl:max-w-[900px] lg:max-w-[920px] min-[1700px]:max-w-[1300px] mx-auto relative">
              <div className="flex gap-9">
                <button className="text-white text-sm font-helvetica font-medium border-b-1 border-[#fff] pb-3">
                  About
                </button>
                <a
                  href="#comments"
                  className="text-sm text-[#A9A9A9] font-helvetica font-medium pb-3"
                >
                  Comments{" "}
                  {getToolDetailsGuestData?.tool?.total_comments > 0
                    ? getToolDetailsGuestData?.tool?.total_comments
                    : ""}
                </a>
              </div>
            </div>
          </div>
          <div className="w-full xl:max-w-[900px] lg:max-w-[920px] min-[1700px]:max-w-[1300px] mx-auto mt-11">
            <div className="grid grid-cols-12 gap-9 mt-16">
              <div className="col-span-8">
                {getSimilarToolsData?.tools?.length > 0 && (
                  <>
                    <p className="font-helvetica text-sm min-[1700px]:mb-9 mb-7 font-bold text-white">
                      More Like this
                    </p>
                    <div className="grid grid-cols-12 gap-4 min-[1700px]:mb-14 mb-8">
                      {getSimilarToolsLoading
                        ? Array.from({ length: 3 }, (_, i) => i + 1).map(
                            (_, key) => (
                              <div key={key} className="col-span-4">
                                <Skeleton className="bg-[#222222] rounded-2xl h-[110px] min-[1700px]:h-[164px] p-2">
                                  <section className="h-[200px]"></section>
                                </Skeleton>
                              </div>
                            )
                          )
                        : getSimilarToolsData?.tools?.map((item, index) => (
                            <div key={index} className="col-span-4">
                              <div
                                className="relative bg-[#222222] rounded-2xl h-[110px] min-[1700px]:h-[164px]"
                                onClick={() =>
                                  navigateToolDetailsPage(item?.id)
                                }
                              >
                                <div className="absolute bg-[#00000040] rounded-lg text-white text-sm font-helvetica p-1 font-bold max-w-36 w-full flex gap-2 items-center m-2">
                                  <Avatar
                                    src={item?.logo}
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
                                  {item?.name && <p>{item.name}</p>}
                                </div>
                                {item?.preview_url?.length && (
                                  <img
                                    className="w-full h-full cursor-pointer rounded-[15px]"
                                    src={item?.preview_url?.[0]}
                                    alt="similar-tools-preview-url"
                                  />
                                )}
                              </div>
                            </div>
                          ))}
                    </div>
                  </>
                )}
                <ToolsComments tool_id={tool_id} />
              </div>
              {!getToolDetailsGuestLoading && (
                <div className="col-span-3">
                  <p className="text-sm font-helvetica font-bold text-white mb-1">
                    Rate This Tool
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((rate) => (
                      <Button
                        key={rate}
                        onClick={() => handleSubmitRating(rate)}
                        className="p-0 min-w-fit  h-fit"
                        style={{ background: "transparent", border: "none" }} // Remove default button styles
                      >
                        {rate <= rating ? (
                          <Image
                            src={"/svg/filled-rating.svg"}
                            alt="profile-pic"
                            width={15}
                            height={15}
                          />
                        ) : (
                          <Image
                            src={"/svg/rating.svg"}
                            alt="profile-pic"
                            width={15}
                            height={15}
                          />
                        )}
                      </Button>
                    ))}
                    <RatingSuccessfullModel
                      isOpen={isRatingModalOpen}
                      onOpenChange={handleRatingModelClose}
                      message={`Rating ${rating} has been submitted successfully!`}
                    />
                  </div>
                  {(getToolDetailsGuestData?.tool?.url ||
                    getToolDetailsGuestData?.tool?.social_links?.facebook ||
                    getToolDetailsGuestData?.tool?.social_links?.twitter ||
                    getToolDetailsGuestData?.tool?.social_links?.instagram ||
                    getToolDetailsGuestData?.tool?.social_links?.linkedin ||
                    getToolDetailsGuestData?.tool?.social_links?.website ||
                    getToolDetailsGuestData?.tool?.social_links?.github) && (
                    <p className="text-sm font-helvetica font-bold text-white mb-2 mt-7">
                      Share
                    </p>
                  )}

                  <div className="flex gap-3 mb-5">
                    <button onClick={handleCopy}>
                      <Linkicon />
                    </button>
                    {getToolDetailsGuestData?.tool?.social_links?.facebook && (
                      <a
                        href={
                          getToolDetailsGuestData?.tool?.social_links
                            ?.facebook ?? "#facebook"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Facebookicon />
                      </a>
                    )}
                    {getToolDetailsGuestData?.tool?.social_links?.twitter && (
                      <a
                        href={
                          getToolDetailsGuestData?.tool?.social_links
                            ?.twitter ?? "#x"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Twittericon />
                      </a>
                    )}
                    {getToolDetailsGuestData?.tool?.social_links?.instagram && (
                      <a
                        href={
                          getToolDetailsGuestData?.tool?.social_links
                            ?.instagram ?? "#instagram"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Instagramicon />
                      </a>
                    )}
                    {getToolDetailsGuestData?.tool?.social_links?.linkedin && (
                      <a
                        href={
                          getToolDetailsGuestData?.tool?.social_links
                            ?.linkedin ?? "#linkedin"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Linkedinicon />
                      </a>
                    )}
                    {getToolDetailsGuestData?.tool?.social_links?.website && (
                      <a
                        href={
                          getToolDetailsGuestData?.tool?.social_links
                            ?.website ?? "#google"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Googleicon />
                      </a>
                    )}
                    {getToolDetailsGuestData?.tool?.social_links?.github && (
                      <a
                        href={
                          getToolDetailsGuestData?.tool?.social_links?.github ??
                          "#github"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Githubicon />
                      </a>
                    )}
                  </div>
                  <div className="flex flex-col gap-y-2">
                    <p className="text-sm font-helvetica font-bold text-[#BABABA] leading-none mt-2">
                      {getToolDetailsGuestData?.tool?.average_rating ?? 0}
                    </p>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((rate) => (
                        <Image
                          src={
                            rate <=
                            Math.round(
                              getToolDetailsGuestData?.tool?.average_rating
                            )
                              ? "/svg/filled-rating.svg"
                              : "/svg/rating.svg"
                          }
                          alt="profile-pic"
                          width={12}
                          height={12}
                        />
                      ))}
                    </div>
                    <p className="text-sm font-helvetica font-bold text-[#BABABA] my-2 leading-none m">
                      {getToolDetailsGuestData?.tool?.total_ratings} Ratings
                    </p>
                  </div>
                  <p className="text-sm text-white mt-5 mb-2 font-helvetica">
                    Last Updated{" "}
                    {moment(
                      getToolDetailsGuestData?.tool?.updated_at
                    ).fromNow()}
                  </p>
                  <div className="flex items-center text-center gap-3">
                    <p className="text-sm text-white font-helvetica">
                      Support:
                    </p>
                    {getToolDetailsGuestData?.tool?.support_email ? (
                      <a
                        href={`mailto:${getToolDetailsGuestData?.tool?.support_email}`}
                        className="text-sm text-white font-helvetica"
                      >
                        {getToolDetailsGuestData?.tool?.support_email}
                      </a>
                    ) : (
                      <p className="text-white">{"-"}</p>
                    )}
                  </div>
                  <p
                    className="text-[#CFCFCF] text-sm mt-9 font-medium font-helvetica cursor-pointer"
                    onClick={() => setisOpenReportModal(true)}
                  >
                    Report model
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {addToolModelGpt?.category === "gpt" && (
        <AddGptModel
          open={addToolModelGpt}
          setOpen={setAddToolModelGpt}
          generateRandomImage={!addToolModelGpt.isEditable}
        />
      )}
      {(addToolModelGpt?.category === "plugin" ||
        addToolModelGpt?.category === "model") && (
        <CreateToolsModel open={addToolModelGpt} setOpen={setAddToolModelGpt} />
      )}
      <CancelSubscriptionModal
        isOpenCancelSubsModal={isOpenCancelSubsModal}
        setisOpenCancelSubsModal={setisOpenCancelSubsModal}
        tool_id={tool_id}
      />
      <ReportModal
        isOpenReportModal={isOpenReportModal}
        setisOpenReportModal={setisOpenReportModal}
        tool_id={tool_id}
      />
      {/* Manage Cards */}
      <AddCardFormModal
        OpenCardModal={OpenCardModal}
        setOpenCardModal={setOpenCardModal}
        afterSubscribe={true}
        setIsOpenSubsribeModal={setIsOpenSubsribeModal}
      />
    </>
  );
};

export default ToolsDetailsPage;

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import ExclamationIcon from "@/app/assets/svg/exclamation-icon.svg";
import BillingCanc from "@/app/assets/svg/billingCanc.svg";
import {
  useFetchToolPerformanceRecordsQuery,
  useGetToolEarningAndAnalyticsQuery,
} from "@/app/lib/features/admin/adminApi";
import toast from "react-hot-toast";
import AddToolsDropdown from "@/components/marketplace/Tools/AddToolsDropdown";
import CreateToolsModel from "@/components/marketplace/AddToolModel";

const classNames = {
  //   header: ["2xl:py-8", "2xl:px-[65px]", "xl:py-[22px]", "xl:px-[30px]"],
  header: ["2xl:py-5", "2xl:px-[65px]", "xl:py-[10px]", "xl:px-[30px]"],
  footer: ["p-0", "my-[25px] py-0"],
};

const CancelSubscriptionModal = ({
  isOpenCancelSubsModal,
  setisOpenCancelSubsModal,
  tool_id,
}) => {
  const router = useRouter();
  const [UpdateTool] = useUpdateToolMutation();
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [pinnedPlugins, setpinnedPlugins] = useState([]);

  

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("menuItemsOrder") || "[]");
    setMenuItems(items);
    const items2 = JSON.parse(localStorage.getItem("pinnedItemsOrder") || "[]");
    setpinnedPlugins(items2);
  }, []);

  const toggleConfirm = () => {
    setisOpenCancelSubsModal(false);
  };

  const deleteConfirm = () => {
    if (!isCheckboxChecked) {
      toast.error("Please check 'I Understand' to proceed with deletion.");
      return;
    }
    UpdateTool({ tool_id: tool_id, is_deleted: true })
      .unwrap()
      .then((response) => {
        toast.success("Tool deleted successfully");
        setisOpenCancelSubsModal(false);
        // router.push("/profile/creators");
        window.location.href = "/profile/creators";
        const removeFromTogleBox = menuItems.filter(
          (item) => item.id !== tool_id
        );
        const removeFromTogleBar = pinnedPlugins.filter(
          (item) => item.id !== tool_id
        );
        localStorage.setItem(
          "menuItemsOrder",
          JSON.stringify([...removeFromTogleBox])
        );
        localStorage.setItem(
          "pinnedItemsOrder",
          JSON.stringify([...removeFromTogleBar])
        );
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        toast.error(error?.data?.message);
        console.log("###_error_### ", error);
      });
  };
  return (
    <Modal
      isOpen={isOpenCancelSubsModal}
      onOpenChange={toggleConfirm}
      //   setIsConfirm={setIsConfirm}
      size={"md"}
      classNames={classNames}
      className="bg-[#171717]"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <div className="text-center">
              <ModalHeader className="text-white helvetica-font  flex justify-center pt-3 pl-3 pr-3 !pb-2">
                <div className="flex flex-col p-0">
                  <div className="flex justify-center p-4">
                    <BillingCanc />
                  </div>
                  <div className="text-xl font-normal">
                    Are you sure you want to delete?
                  </div>
                </div>
              </ModalHeader>
            </div>
            <ModalBody className="px-[28px] py-[0px] text-white ">
              <div className="max-w-xs mx-auto text-[13px] font-normal px-3.5">
                <div>Clicking “Delete” will </div>
                <div
                  className={`list-disc ml-4 text-[14px] font-normal  
     `}
                  style={{ overflow: "hidden" }}
                >
                  <ul className="list-disc text-start ml-4">
                    <li>
                      Schedule the app to be deleted at the end of this pay
                      period.
                    </li>
                    <li>Remove the app from the marketplace.</li>
                    <li>Halt any new subscriptions.</li>
                  </ul>
                </div>
                <div className="my-1">
                  Note: Per the Creator Agreement app creators must maintain
                  functionality until end of pay period. Failure to do so will
                  result in refund request.
                </div>
                <Checkbox
                  onChange={() => setIsCheckboxChecked(!isCheckboxChecked)}
                  checked={isCheckboxChecked}
                  className="custom-checkbox text-white text-[10px]"
                >
                  I Understand
                </Checkbox>
              </div>
            </ModalBody>

            <ModalFooter className="w-[300px] mx-auto flex flex-col ">
              <div className="flex flex-col gap-2">
                <Button
                  className="bg-[#533938] hover:bg-[#EE4142] rounded-[15px] hover:text-white font-normal h-[36px] text-sm "
                  color="primary"
                  onClick={deleteConfirm}
                >
                  Delete
                </Button>

                <Button
                  className="bg-[#343539] hover:bg-[#535353] rounded-[15px] hover:text-white font-normal h-[36px] text-sm "
                  onClick={toggleConfirm}
                >
                  Decline
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

// const classNames = {
//   //   header: ["2xl:py-8", "2xl:px-[65px]", "xl:py-[22px]", "xl:px-[30px]"],
//   header: ["2xl:py-5", "2xl:px-[65px]", "xl:py-[10px]", "xl:px-[30px]"],
//   footer: ["p-0", "my-[25px] py-0"],
// };

const ReportModal = ({ setisOpenReportModal, isOpenReportModal, tool_id }) => {
  const [ReportTool] = useReportToolMutation();
  const [reportText, setReportText] = useState("");

  const toggleConfirm = () => {
    setisOpenReportModal(false);
  };

  const submitReport = () => {
    if (reportText === "") {
      toast.error("Enter text report");
      return;
    }
    ReportTool({ tool_id: tool_id, reason: reportText })
      .unwrap()
      .then((response) => {
        toast.success("Submit report successfully");
        setisOpenReportModal(false);
      })
      .catch((error) => {
        toast.error(error?.data?.message);
        console.log("###_error_### ", error);
      });
  };
  return (
    <Modal
      isOpen={isOpenReportModal}
      onOpenChange={toggleConfirm}
      //   setIsConfirm={setIsConfirm}
      size={"md"}
      classNames={classNames}
      className="bg-[#171717]"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <div className="text-center">
              <ModalHeader className="text-white helvetica-font  flex justify-center pt-3 pl-3 pr-3 !pb-2">
                <div className="flex flex-col p-0">
                  <div className="flex justify-center p-4">
                    <BillingCanc />
                  </div>
                  <div className="text-xl font-normal">Report Modal </div>
                </div>
              </ModalHeader>
            </div>
            <ModalBody className="px-[28px] py-[0px] text-white ">
              <div className="w-full max-w-xs mx-auto text-[13px] font-normal px-3.5">
                <Textarea
                  placeholder="Enter report..."
                  className="!w-full"
                  maxLength={500}
                  onChange={(e) => setReportText(e.target.value)}
                />
              </div>
            </ModalBody>

            <ModalFooter className="w-[300px] mx-auto flex flex-col ">
              <div className="flex flex-col gap-2">
                <Button
                  className="bg-[#343539] hover:bg-[#535353] rounded-[15px] hover:text-white font-normal h-[36px] text-sm "
                  onClick={submitReport}
                >
                  Submit
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
