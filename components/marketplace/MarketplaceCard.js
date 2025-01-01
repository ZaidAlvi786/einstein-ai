"use client";

import { Image, Avatar, Button } from "@nextui-org/react";
import React, { useState } from "react";
import ToolsUsersComponent from "./ToolsUsersComponent";
import ToolsRatingComponents from "./ToolsRatingComponent";
import ToolsPriceComponent from "./ToolsPriceComponent";
import ToolAddRemoveButton from "../toolsDetailsComponents/toolAddRemove";
import ToolSubscribe from "../toolsDetailsComponents/toolSubscribe";
import { useGetToolDetailsGuestQuery } from "@/app/lib/features/chat/chatApi";
import { useAuth } from "@/app/authContext/auth";
import { useGetCustomersCardsQuery } from "@/app/lib/features/payment/paymentApi";
import AddCardFormModal from "@/components/billing/AddCardFormModal";

const MarketplaceCard = ({
  cardData,
  navigateToolDetailsPage,
  refetchToolListOnHome,
}) => {
  const tool_id = cardData?.id;
  const auth = useAuth();
  const [OpenCardModal, setOpenCardModal] = useState({
    open: false,
    mode: "add",
    card_details: null,
  });
  const [isOpenSubsribeModal, setIsOpenSubsribeModal] = useState(false);
  const { data: getToolDetailsGuestData } = useGetToolDetailsGuestQuery(
    { IsLoggedIn: auth?.user?.email && auth?.user?.fullname, tool_id },
    { skip: !tool_id }
  );
  const { data: cardsList } = useGetCustomersCardsQuery(
    { user_id: auth?.user?.userID },
    { skip: !auth?.user?.userID && !auth?.user?.email }
  );
  return (
    <div className="w-full rounded-2xl my-3">
      <div className="w-full rounded-2xl my-3">
        <div
          onClick={() => navigateToolDetailsPage(cardData?.id)}
          className="w-full 2xl:h-[210px] xl:h-[170px] rounded-2xl p-2 relative"
          style={{
            backgroundImage:
              cardData?.preview_url?.length > 0
                ? `url(${cardData?.preview_url[0]})`
                : "url('https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            //   height: "80%",
            width: "100%",
            aspectRatio: "16/9",
          }}
        >
          <div
            className="absolute bg-[#00000040] rounded-lg text-white text-sm font-helvetica p-1 font-bold flex gap-2 items-center "
            // style={{ paddingRight: "20px" }}
          >
            <Avatar
              src={cardData?.logo}
              showFallback={true}
              alt="similar-tools-logo"
              className="4k:w-[95.81px] 4k:h-[95.81px] w-[47.91px] h-[47.91px] cursor-pointer"
              fallback={
                <Image
                  src={"/svg/user.svg"}
                  alt="profile-pic"
                  width={40}
                  height={40}
                />
              }
            />
          </div>
          <div className="absolute right-3 bottom-3 z-30 flex gap-x-2">
            {!cardData?.subscription_completed &&
              !cardData?.trial_completed &&
              !cardData?.is_subscribed && (
                <ToolAddRemoveButton
                  tool_id={cardData?.id}
                  tool_info={cardData}
                  navigateToolDetailsPage={navigateToolDetailsPage}
                  refetchToolListOnHome={refetchToolListOnHome}
                />
              )}
            {(cardData?.price?.monthly > 0 || cardData?.price?.annual > 0) && (
              <ToolSubscribe
                tool_id={cardData?.id}
                tool_info={cardData}
                getToolDetailsGuestData={getToolDetailsGuestData}
                setOpenCardModal={setOpenCardModal}
                isPaymentMethodAdded={cardsList?.payment_methods?.length > 0}
                bgColor="#fff"
                textColor="#000"
                borderColor="#fff"
                isOpenSubsribeModal={isOpenSubsribeModal}
                setIsOpenSubsribeModal={setIsOpenSubsribeModal}
              />
            )}
          </div>
        </div>
        <div className="pl-2 pt-2 flex justify-between items-center">
          <h5 className="text-[#FFF] text-[20px] helvetica-font font-normal leading-normal">
            {cardData?.name}
          </h5>
          <div className="flex items-center">
            <p className=" py-[5px] pr-[10px]">
              {cardData?.average_rating ? (
                <ToolsRatingComponents
                  total_rating={cardData?.average_rating.toFixed(1)}
                />
              ) : (
                <div className="text-[#BABABA] text-[14px] helvetica-font">
                  No Ratings
                </div>
              )}
            </p>
            {/* {cardData.total_unique_users} */}
            <p className=" py-[5px] pr-[10px]">
              {
                cardData?.total_unique_users && (
                  <ToolsUsersComponent
                    total_views={cardData?.total_unique_users}
                    text_color={"#BABABA"}
                  />
                )
                // :
                // <div className="text-[#BABABA] text-[14px] helvetica-font">No Review</div>
              }
            </p>
            <p>
              {
                cardData.tool_monetization === "free" ? (
                  <div className="py-[5px] pr-[18px]">
                    <p className="text-[#FFF] text-center text-[14px] helvetica-font">
                      {"Free"}
                    </p>
                  </div>
                ) : (
                  cardData.tool_monetization === "subscription" &&
                  //   cardData.price.per_use > 0 ? (
                  //   <div>
                  //     <p className='text-[#FFF] text-center text-[14px] helvetica-font'>
                  //       ${cardData.price.per_use}/use
                  //     </p>
                  //   </div>
                  // ) : cardData.tool_monetization === "subscription" &&
                  //   cardData.price.monthly > 0 ? (
                  //   <div>
                  //     <p className='text-[#FFF] text-center text-[14px] helvetica-font'>
                  //       ${cardData.price.monthly}/m
                  //     </p>
                  //   </div>
                  // ) : cardData.tool_monetization === "subscription" &&
                  //   cardData.price.annual > 0 ? (
                  //   <div>
                  //     <p className='text-[#FFF] text-center text-[14px] helvetica-font'>
                  //       ${cardData.price.annual}/y
                  //     </p>
                  //   </div>
                  // )
                  ""
                )
                //  : (
                //   <ToolsPriceComponent price={0} />
                // )
              }
            </p>
          </div>
        </div>
        <p className="text-[#9E9D9C] pl-2 2xl:text-[16px] xl:text-[14px] helvetica-font mr-1">
          {cardData?.introtext?.length > 45
            ? `${cardData?.introtext.slice(0, 45)}...`
            : cardData?.introtext}
        </p>
      </div>
      {/* Manage Cards */}
      <AddCardFormModal
        OpenCardModal={OpenCardModal}
        setOpenCardModal={setOpenCardModal}
        afterSubscribe={true}
        setIsOpenSubsribeModal={setIsOpenSubsribeModal}
      />
    </div>
  );
};

export default MarketplaceCard;
