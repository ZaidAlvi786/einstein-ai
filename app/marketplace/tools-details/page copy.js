"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Avatar, Button, Skeleton } from "@nextui-org/react";
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
  useGetSimilarToolsQuery,
  useGetToolDetailsGuestQuery,
} from "@/app/lib/features/chat/chatApi";
import ToolsLikeComponents from "@/components/marketplace/ToolsLikesComponent";
import ToolsUsersComponent from "@/components/marketplace/ToolsUsersComponent";
import ToolAddRemoveButton from "@/components/toolsDetailsComponents/toolAddRemove";
import ToolsLikesComponent from "@/components/toolsDetailsComponents/toolsLikes";
import { useRouter, useSearchParams } from "next/navigation";
import moment from "moment";
import { useAuth } from "@/app/authContext/auth";
import ToolsComments from "@/components/toolsDetailsComponents/toolsComments";
import ToolsRatingComponents from "@/components/marketplace/ToolsRatingComponent";
import ToolSubscribe from "@/components/toolsDetailsComponents/toolSubscribe";
import MarketplaceCard from "@/components/marketplace/MarketplaceCard";
import RatingSuccessfullModel from "@/components/marketplace/RatingSuccessfullModel";
import AdminStatusBar from "@/components/marketplace/AdminStatusBar";
import AdminToolsHistory from "@/components/marketplace/AdminToolsHistory";
import { Tabs } from "antd";

const ToolsDetailsPage = () => {
  const router = useRouter();
  const auth = useAuth();
  const searchParams = useSearchParams();
  const tool_id = searchParams?.get("tool_id") ?? null;
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const {
    data: getToolDetailsGuestData,
    isLoading: getToolDetailsGuestLoading,
  } = useGetToolDetailsGuestQuery(
    { IsLoggedIn: auth?.user?.email && auth?.user?.fullname, tool_id },
    { skip: !tool_id }
  );
  const { data: getSimilarToolsData, isLoading: getSimilarToolsLoading } =
    useGetSimilarToolsQuery(
      { tool_id, page_number: 1, per_page: 10 },
      { skip: !tool_id }
    );

  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [rating, setRating] = useState(null);
  const [IsAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("about");

  const handleSubmitRating = (rate) => {
    setRating(rate);
    setIsRatingModalOpen(true);
  };

  const handleRatingModelClose = () => {
    setIsRatingModalOpen(false);
  };

  useEffect(() => {
    if (tool_id) return;
    router.back();
  }, [tool_id]);

  useEffect(() => {
    const authData = window?.localStorage?.getItem("enstine_auth")
      ? JSON?.parse(window?.localStorage?.getItem("enstine_auth"))
      : null;
    if (authData?.userID === getToolDetailsGuestData?.tool?.creator_id) {
      setIsAdmin(true);
    }
  }, []);

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
                      <p className="text-base font-roboto font-bold text-white ">
                        ${getToolDetailsGuestData?.tool?.price?.monthly}/m Or
                      </p>{" "}
                      <p className="text-white text-base font-roboto font-bold">
                        $0.01 Per Use
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
                            getToolDetailsGuestData?.tool?.total_likes
                          }
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <span className="block w-1 h-1 bg-[#B9B9B9] rounded-full"></span>
                      <div className="flex gap-1 items-center">
                        <ToolsUsersComponent
                          total_views={
                            getToolDetailsGuestData?.tool?.total_views
                          }
                        />
                        {/* <p className="text-[#B9B9B9] flex items-center text-[14px] font-medium helvetica-font">
                          {getToolDetailsGuestData?.tool?.total_views > 1
                            ? "Users"
                            : "User"}
                        </p> */}
                      </div>
                    </div>
                  </div>
                  {IsAdmin ? (
                    <div className="flex gap-[10px] items-center">
                      <Button
                        className={`text-base h-auto rounded-full font-helvetica font-bold py-1.5 px-5 bg-[#0A84FF] text-white`}
                      >
                        {"Edit"}
                      </Button>
                      <Button
                        className={` text-[#636363] helvetica-font h-9 rounded-full bg-transparent border border-[#636363]
                    hover:bg-[#fff] hover:text-[#000] text-[16px] flex justify-center items-center`}
                      >
                        Pause
                      </Button>
                      <Button
                        className={` text-[#636363] helvetica-font h-9 rounded-full bg-transparent border border-[#636363]
                    hover:bg-[#fff] hover:text-[#000] text-[16px] flex justify-center items-center`}
                      >
                        Delete
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-[10px] items-center">
                        <ToolAddRemoveButton
                          tool_id={tool_id}
                          tool_info={getToolDetailsGuestData?.tool}
                        />
                        {/* <ToolsLikesComponent
                      tool_id={tool_id}
                      isAlreadyLiked={getToolDetailsGuestData?.tool?.user_like}
                    /> */}
                        <ToolSubscribe
                          tool_id={tool_id}
                          tool_info={getToolDetailsGuestData?.tool}
                        />
                        <p className="text-sm text-[#B9B9B9]">Or</p>{" "}
                        <p className="text-[#B9B9B9] text-sm">$0.01 Per Use</p>
                      </div>
                      <p className="text-[#BABABA] text-xs my-2">
                        Free Trial Available
                      </p>
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
      <div className="pb-12">
        <div className="mt-9 admin-details-tab">
          <div className="w-full xl:max-w-[900px] lg:max-w-[920px] min-[1700px]:max-w-[1300px] mx-auto relative">
            <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
              <Tabs.TabPane key="about" tab="About">
                {/* About content here */}
                <div className="text-white text-sm font-helvetica font-medium pb-12">
                  About content goes here.
                </div>
              </Tabs.TabPane>

              <Tabs.TabPane
                key="comments"
                tab={`Comments ${
                  getToolDetailsGuestData?.tool?.total_comments > 0
                    ? getToolDetailsGuestData?.tool?.total_comments
                    : ""
                }`}
              >
                {/* Render the ToolsComments component here */}
                <ToolsComments tool_id={tool_id} />
              </Tabs.TabPane>

              <Tabs.TabPane key="admin" tab="Admin">
                {/* Admin content here */}
                <div className="text-white text-sm font-helvetica font-medium pb-3">
                  <AdminStatusBar />
                  <div className="mb-8 pt-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-[22px] text-white font-bold helvetica-font mb-[14px]">{`History`}</h2>
                      </div>
                      <div>
                        <Button className="w-[98px] h-[24px] min-w-unit-0 text-white bg-transparent text-[10px] font-bold rounded border-1 border-[#B7B7B7] hover:bg-white hover:text-black">
                          Download
                        </Button>
                      </div>
                    </div>
                    <AdminToolsHistory />
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
                            <div className="relative bg-[#222222] rounded-2xl h-[110px] min-[1700px]:h-[164px]">
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
    </>
  );
};

export default ToolsDetailsPage;
