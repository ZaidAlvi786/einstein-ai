"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import {
  useGetAutoTopupStatusQuery,
  useGetCustomersCardsQuery,
  useGetUserSubscribedPlanQuery,
  useSubscribeToPlatformPlanMutation,
} from "@/app/lib/features/payment/paymentApi";
import { useAuth } from "@/app/authContext/auth";
import AddCardFormModal from "@/components/billing/AddCardFormModal";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import PaymentMethod from "@/components/billing/PaymentMethod";
import SubscriptionTable from "@/components/billing/SubscriptionTable";
import SingleUseHistory from "@/components/billing/SingleUseHistory";
import BillHistory from "@/components/billing/BillHistory";
import toast from "react-hot-toast";
import { useGetUserQuery } from "@/app/lib/features/chat/chatApi";
import ToastService from "@/components/Toaster/toastService";
const NextInvoiceDate = dynamic(
  () => import("@/components/billing/NextInvoiceDate"),
  { ssr: false }
);

const Billing = () => {
  const auth = useAuth();
  const {
    data: cardsList,
    isFetching: cardsListLoading,
    refetch: refetchCardList,
  } = useGetCustomersCardsQuery(
    { user_id: auth?.user?.userID },
    { skip: !auth?.user?.userID && !auth?.user?.email }
  );
  const [OpenCardModal, setOpenCardModal] = useState({
    open: false,
    mode: "add",
    card_details: null,
  });
  const [invoices, setInvoices] = useState([]);
  console.log("invoices: ", invoices);

  const { data } = useGetAutoTopupStatusQuery();
  const {
    data: getUserSubscribedPlan,
    refetch,
    isError: isSubscribedplanError,
    isLoading,
  } = useGetUserSubscribedPlanQuery();
  const [isAutoTopUpHovered, setIsAutoTopUpHovered] = useState(false);
  const [SubscribeToPlatformPlan] = useSubscribeToPlatformPlanMutation();
  const [cancelSubscription, setCancelSubscription] = useState(false);
  const {
    data: getUserData,
    refetch: refetchUserData,
    isLoading: getUserLoading,
  } = useGetUserQuery({ email: auth?.user?.email });

  useEffect(() => {
    refetch();
    refetchUserData();
  }, []);
  useEffect(() => {
    if (cancelSubscription) refetch();
  }, [cancelSubscription]);
  // Handlers to change hover state
  const handleMouseEnter = () => {
    setIsAutoTopUpHovered(true);
  };

  const handleMouseLeave = () => {
    setIsAutoTopUpHovered(false);
  };

  let available_single_use_credit, topup_active, topup_amount;

  if (data?.status === 200) {
    ({ available_single_use_credit, topup_active, topup_amount } = data);
  }
  // console.log('data: ', data);
  const router = useRouter();

  const navigateToBuySubscription = () => {
    router.push("/profile/buy-subscription");
  };

  const getCardLogoImage = (name) => {
    switch (name) {
      case "Visa":
        return "https://i.imgur.com/ekLkVPr.png";
      case "Mastercard":
        return "https://i.imgur.com/bbPHJVe.png";
      case "American Express":
        return "https://i.imgur.com/8fl43Df.png";
      case "RuPay":
        return "https://i.imgur.com/4iZ6frQ.png";
      default:
        return "Image not found";
    }
  };

  const subscriptionPlans = (plan) => {
    // const amount = isAnnualBilling
    //   ? parseInt(plan?.yearly_price) * 100
    //   : parseInt(plan?.monthly_price) * 100;
    // const plan_type = isAnnualBilling ? "yearly" : "monthly";
    const plan_type = plan?.recurrence;
    // const card_id = cardsList?.payment_methods?.[0]?.card_id;
    // const user_id = auth?.user?.userID;
    const plan_id = plan?.id;

    // setisLoading({ plan_id: plan?.id });

    const data1 = {
      params: {
        plan_id,
        plan_type,
      },
    };

    SubscribeToPlatformPlan(data1)
      .unwrap()
      .then((response) => {
        toast.success("Plan Purchased Successfully!");
        // setisLoading({ plan_id: null });
        // navigateToBillingPage();
      })
      .catch((error) => {
        // setisLoading({ plan_id: null });
        if (error?.data?.message) {
          toast.error(error?.data?.message);
        }
      });
  };

  return (
    <>
      <div className="max-w-[865px] w-full mx-auto px-1.5 flex flex-col lg:justify-normal min-[1800px]:justify-center">
        <div className="flex justify-between items-center">
          <div className="mb-8 pt-8">
            <h2 className="text-[32px] text-white font-bold helvetica-font mb-[14px]">{`Billing`}</h2>
            <p className="helvetica-font text-[12px] text-[#B5B5B5] font-medium">{`Effortlessly handle your subscriptions and credits.`}</p>
          </div>
          <div>
            {getUserData?.data?.plan !== "paid" && ( // getting error 404 if  not subscribed any plan
              <Button
                onClick={navigateToBuySubscription}
                className={`text-white helvetica-font font-bold w-[119px] !h-[40px] rounded-full bg-[#0A84FF]
              hover:bg-[#fff] hover:text-[#000] text-[14px] flex justify-center items-center leading-normal min-w-fit`}
              >
                Try Togl Pro
              </Button>
            )}
          </div>
        </div>
        <div>
          <PaymentMethod
            cardsList={cardsList}
            getCardLogoImage={getCardLogoImage}
            setOpenCardModal={setOpenCardModal}
            cardsListLoading={cardsListLoading}
            refetchCardList={refetchCardList}
          />
        </div>
        {getUserSubscribedPlan?.data?.length > 0 && (
          <div className="mb-8 pt-8">
            <h2 className="text-[22px] text-white font-bold helvetica-font mb-[14px]">{`Subscriptions`}</h2>
            <p className="helvetica-font text-[12px] text-[#B5B5B5] font-medium">{`Some tools require a subscription for use. Your active subscriptions are listed here, and you can cancel them at any time.`}</p>
            <SubscriptionTable
              getUserSubscribedPlan={getUserSubscribedPlan}
              navigateToBuySubscription={navigateToBuySubscription}
              subscriptionPlans={subscriptionPlans}
              isSubscribedplanError={isSubscribedplanError}
              isLoading={isLoading}
              cancelSubscription={cancelSubscription}
              setCancelSubscription={setCancelSubscription}
            />
          </div>
        )}
        <div className="mb-8 pt-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[22px] text-white font-bold helvetica-font mb-[14px]">{`Single-Use`}</h2>
              <p className="helvetica-font text-[12px] text-[#B5B5B5] font-medium">{`Some tools charge per individual use - keep credits on hand to use these tools.`}</p>
            </div>
            <div>
              {topup_active ? (
                <Button
                  onMouseEnter={handleMouseEnter} // Set hover to true when mouse enters
                  onMouseLeave={handleMouseLeave}
                  onClick={navigateToBuySubscription}
                  className={`text-white helvetica-font font-bold !h-[40px] rounded-full bg-[#1B1B1B]
              hover:bg-[#545454] hover:text-white text-[16px] flex justify-center items-center leading-normal w-[240px] gap-2`}
                >
                  {isAutoTopUpHovered ? (
                    <div>Manage</div>
                  ) : (
                    <div className="flex justify-center items-center gap-1">
                      <div>Auto Credit Top-up</div>
                      <div className="text-[#2BDC43] font-normal">Active</div>
                    </div>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={navigateToBuySubscription}
                  className={`text-white helvetica-font font-bold !h-[40px] rounded-full bg-[#0A84FF]
                hover:bg-[#fff] hover:text-[#000] text-[16px] flex justify-center items-center leading-normal min-w-fit`}
                >
                  Auto Credit Top-up
                </Button>
              )}
            </div>
          </div>
          <div
            className="bg-[#1B1B1B] text-white h-[66px] mt-3 px-8 grid grid-cols-12 items-center justify-between"
            style={{ borderRadius: "24px" }}
          >
            <div className="col-span-7 text-base">Your Credit Balance</div>
            <div className="col-span-5 flex items-center justify-between">
              <div className="flex col-span-5 items-center mr-10">
                <div className="text-base">
                  <div>
                    $
                    {available_single_use_credit
                      ? parseFloat(available_single_use_credit).toFixed(5)
                      : 0}
                  </div>
                </div>
              </div>
              <div className="">
                <Button
                  onClick={navigateToBuySubscription}
                  className="w-[98px] h-[24px] min-w-unit-0 text-black bg-white text-[10px] font-bold rounded border-1 border-[#B7B7B7] hover:bg-white hover:text-black"
                >
                  Top Up
                </Button>
              </div>
            </div>
          </div>
          <SingleUseHistory />
        </div>
        <div className="mb-8 pt-8">
          <BillHistory invoices={invoices} setInvoices={setInvoices} />
        </div>
      </div>

      {/* Manage Cards */}
      <AddCardFormModal
        OpenCardModal={OpenCardModal}
        setOpenCardModal={setOpenCardModal}
      />
      <ToastService />
    </>
  );
};

export default Billing;
