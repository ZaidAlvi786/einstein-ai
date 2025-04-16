"use client";

import { Image, Avatar, Button } from "@nextui-org/react";
import React, { useState } from "react";
import ToolsUsersComponent from "./ToolsUsersComponent";
import ToolsRatingComponents from "./ToolsRatingComponent";
import ToolsPriceComponent from "./ToolsPriceComponent";
import ToolAddRemoveButton from "../toolsDetailsComponents/toolAddRemove";
import { useGetToolDetailsGuestQuery } from "@/app/lib/features/chat/chatApi";
import { useAuth } from "@/app/authContext/auth";
import ToolSubscribe from "../toolsDetailsComponents/toolSubscribe";
import AddCardFormModal from "@/components/billing/AddCardFormModal";
import { useGetCustomersCardsQuery } from "@/app/lib/features/payment/paymentApi";

const GptCard = ({
  cardData,
  navigateToolDetailsPage,
  refetchToolListOnHome,
}) => {
  const tool_id = cardData?.id;
  const auth = useAuth();
    const [isOpenSubsribeModal, setIsOpenSubsribeModal] = useState(false);
  const { data: cardsList } = useGetCustomersCardsQuery(
    { user_id: auth?.user?.userID },
    { skip: !auth?.user?.userID && !auth?.user?.email }
  );

  const [OpenCardModal, setOpenCardModal] = useState({
    open: false,
    mode: "add",
    card_details: null,
  });
  const { data: getToolDetailsGuestData } = useGetToolDetailsGuestQuery(
    { IsLoggedIn: auth?.user?.email && auth?.user?.fullname, tool_id },
    { skip: !tool_id }
  );

  return (
    <div className="w-full rounded-2xl my-3">
    <div
      onClick={() => navigateToolDetailsPage(cardData?.id)}
      className="w-full 2xl:h-[125px] xl:h-[85px] rounded-2xl p-2 relative bg-[#404040] px-4 flex"
    
    >
      <div
        className=" my-auto rounded-lg flex  items-center h-full"
        // style={{ paddingRight: "20px" }}
      >
        <Avatar
         style={{ boxShadow: '0px 28.89px 28.89px 0px #00000040' }}
          src={cardData?.logo}
          showFallback={true}
          alt="similar-tools-logo"
          className="4k:w-[95.81px] 4k:h-[95.81px] w-[85px] h-[85px] cursor-pointer"
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
      <div className="pl-3 py-3">
      <h5 className="text-[#FFF] text-[20px] helvetica-font font-normal leading-normal">
        {cardData?.name}
      </h5>
      <p className="text-white  2xl:text-[14px] xl:text-[14px] helvetica-font mr-1">
      {cardData?.introtext?.length > 45
        ? `${cardData?.introtext.slice(0, 45)}...`
        : cardData?.introtext}
    </p>
      </div>
      <div className="absolute right-3 bottom-2 z-30 flex gap-x-2">
        {!cardData?.subscription_completed &&
          !cardData?.trial_completed &&
          !cardData?.is_subscribed && (
            <ToolAddRemoveButton
              tool_id={cardData?.id}
              tool_info={cardData}
              navigateToolDetailsPage={navigateToolDetailsPage}
              refetchToolListOnHome={refetchToolListOnHome}
              MarketplaceCard={true}
            />
          )}
        {/* {(cardData?.price?.monthly > 0 || cardData?.price?.annual > 0) && (
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
        )} */}
      </div>
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

export default GptCard;
