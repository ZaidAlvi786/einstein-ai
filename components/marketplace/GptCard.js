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
      <div className="w-full rounded-2xl my-3">
        <div
          onClick={() => navigateToolDetailsPage(cardData?.id)}
          className="w-full 2xl:h-[210px] xl:h-[170px] rounded-2xl p-2 relative flex justify-center items-center"
          style={{
            // backgroundImage:
            //   cardData?.preview_url?.length > 0
            //     ? `url(${cardData?.preview_url[0]})`
            //     : "url('https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4')",
            // backgroundSize: "cover",
            // backgroundPosition: "center",
            background: "#222222",
            //   height: "80%",
            width: "100%",
          }}
        >
          <Avatar
            src={cardData?.logo}
            showFallback={true}
            alt="similar-tools-logo"
            className="w-[128px] h-[128px] rounded-full cursor-pointer"
            fallback={
              <Image
                src={"/svg/user.svg"}
                alt="profile-pic"
                width={128}
                height={128}
              />
            }
          />
          <div className="absolute right-3 bottom-3 z-30 flex gap-x-2">
            {!cardData?.subscription_completed &&
              !cardData.trial_completed &&
              !cardData?.is_subscribed && (
                <ToolAddRemoveButton
                  tool_id={cardData?.id}
                  tool_info={cardData}
                  navigateToolDetailsPage={navigateToolDetailsPage}
                  refetchToolListOnHome={refetchToolListOnHome}
                />
              )}{" "}
            {(cardData?.price?.monthly > 0 || cardData?.price?.annual > 0) && (
              <ToolSubscribe
                tool_id={cardData?.id}
                tool_info={cardData}
                getToolDetailsGuestData={getToolDetailsGuestData}
                setOpenCardModal={setOpenCardModal}
                isPaymentMethodAdded={cardsList?.payment_methods?.length > 0}
                bgColor="#fff"
                textColor="#000"
                borderColor='#fff'
                isOpenSubsribeModal={isOpenSubsribeModal}
                setIsOpenSubsribeModal={setIsOpenSubsribeModal}

              />
            )}
          </div>
        </div>
        <div className="pl-2 pt-2 flex justify-between items-center">
          <h5 className="text-[#FFF] text-[20px] helvetica-font font-bold leading-normal">
            {cardData?.name}
          </h5>
          <div className="flex items-center">
            <p className=" py-[5px] pr-[10px]">
              {cardData?.average_rating ? (
                <ToolsRatingComponents
                  total_rating={cardData?.average_rating}
                />
              ) : (
                <div className="text-[#BABABA] text-[14px] helvetica-font">
                  No Ratings
                </div>
              )}
            </p>
            <p className=" py-[5px] pr-[10px]">
              {cardData?.total_users && (
                <ToolsUsersComponent
                  total_views={cardData?.total_users}
                  text_color={"#BABABA"}
                />
              )}
            </p>
            <p className=" py-[5px] pr-[18px]">
              <ToolsPriceComponent price={0} />
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

export default GptCard;
