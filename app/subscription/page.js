"use client";
import React, { useEffect, useState } from "react";
import { Button, Card, Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import {
  useCancelSubscriptionMutation,
  useGetCustomersCardsQuery,
  useGetPaymentLinkQuery,
  useGetUserSubscribedPlanQuery,
  useSetAutoTopupStatusMutation,
  useSubscribeToPlatformPlanMutation,
} from "../lib/features/payment/paymentApi";
import { useAuth } from "../authContext/auth";
import AddCardFormModal from "@/components/billing/AddCardFormModal";
import ConfirmTopupChangeModal from "@/components/billing/ConfirmTopupChangeModal";
import toast from "react-hot-toast";
import ToastService from "@/components/Toaster/toastService";
import CancelSubscriptionModal from "@/components/billing/CancelSubscriptionModal";

const pricingPlans = [
  {
    id: "66fd0e52502dbc3c43998688",
    plan_name: "Togl Pro",
    price: "20",
    Note: "Access TOGL for free, complimentary credits on us.",
    duration: "Per month",
    buttonText: "Buy Now",
    description: "Try TOGL For Free",
    discount: "",
    features: [
      "Unlimited GPTs",
      "Unlimited Pinned Chats",
      "Unlimited Workspaces",
      "Unlimited Shared Workspaces & Chats",
      "$5 of Monthly Credits",
    ],
  },
  {
    id: "66fd0e52502dbc3c43998688",
    plan_name: "Early Bird",
    Note: "Support Togl and lock in a lifetime discount!",
    price: "144",
    duration: "Per year",
    buttonText: "Buy Now",
    description: "Limited Spots Available",
    specialNote: "Only 3 Left - Act Quickly",
    discount: "40% Cheaper!",
    features: [
      "Unlimited GPTs",
      "Unlimited Pinned Chats",
      "Unlimited Workspaces",
      "Unlimited Shared Workspaces & Chats",
      "$5 of Monthly Credits",
      "Private Founder's Circle",
      "Exclusive Early Feature Access",
      "Priority Support",
      "Exclusive Credit Discounts",
    ],
  },
];

const Subscription = () => {
  const router = useRouter();
  const auth = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(pricingPlans[1]);
  console.log("🚀 ~ Subscription ~ selectedPlan:", selectedPlan);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [isAnnualBilling, setIsAnnualBilling] = useState(true);
  const [isLoading, setisLoading] = useState({ plan_id: null });
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [isOpenCancelSubsModal, setisOpenCancelSubsModal] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [OpenCardModal, setOpenCardModal] = useState({
    open: false,
    mode: "add",
    card_details: null,
  });
  const [SubscribeToPlatformPlan] = useSubscribeToPlatformPlanMutation();
  const [setAutoTopupStatus] = useSetAutoTopupStatusMutation();
  const { data: cardsList } = useGetCustomersCardsQuery(
    { user_id: auth?.user?.userID },
    { skip: !auth?.user?.userID }
  );
  const {
    data: getUserSubscribedPlanApi,
    refetch: refetchUserSubscribedPlan,
    isError: errorInGetUserSubscriptionApi,
  } = useGetUserSubscribedPlanQuery();
  console.log('getUserSubscribedPlanApi: ', getUserSubscribedPlanApi?.data);

  const [CancelSubscription, isMutationLoading] =
  useCancelSubscriptionMutation();
  const { data: yearlyPaymentLink } = useGetPaymentLinkQuery({
    payment_type: "yearly",
  });
  const { data: monthlyPaymentLink } = useGetPaymentLinkQuery({
    payment_type: "monthly",
  });
  const subscriptionPlans = (plan) => {
    console.log("🚀 ~ subscriptionPlans ~ plan:", plan);
    const isAnnualBilling = plan.duration === "Per year";
    const amount = plan.price;
    const plan_type = isAnnualBilling ? "yearly" : "monthly";
    const card_id = cardsList?.payment_methods?.[0]?.card_id;
    const user_id = auth?.user?.userID;
    const plan_id = plan?.id;

    setisLoading({ plan_id: plan?.id });

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
        // if (plan?.plan_name === "Pro") {
        const data = {
          status: true,
          amount: 5,
        };
        handleTopUpStatus(data);
        // }
      })
      .catch((error) => {
        setisLoading({ plan_id: null });
        if (error?.data?.message) {
          toast.error(error?.data?.message);
        }
      });
    setSelectedPlan(null);
  };

  const handleTopUpStatus = (data) => {
    setAutoTopupStatus(data)
      .unwrap()
      .then((response) => {
        toast.success("Set Auto Credit Top-Ups Successfully!");
        router.push("/profile/billing");
        // setisLoading({ plan_id: null });
      })
      .catch((error) => {
        if (error?.data?.message) {
          toast.error(error?.data?.message);
        }
      });
  };

  
  const isPlanTypeSubscribed = (plan) => {
    return getUserSubscribedPlanApi?.data?.some(
      (p) =>
        p?.plan_id === plan.id &&
        ((plan.duration === "Per year" && p?.recurrence === "yearly") ||
          (plan.duration === "Per month" && p?.recurrence === "monthly"))
    );
  };
  const hasAnySubscribedPlan = (pricingPlans = [], subscribedPlans = []) => {
    return pricingPlans.some((plan) =>
      subscribedPlans?.some((p) => p?.plan_id === plan?.id)
    );
  };
  const handleStripeCheckout = (plan) => {
    
   if (hasAnySubscribedPlan(pricingPlans, getUserSubscribedPlanApi?.data)) {
  toast.error("You are already subscribed to a plan");
  return;
}
    if (plan.duration === "Per month" && monthlyPaymentLink?.payment_link) {
      window.location.href=monthlyPaymentLink?.payment_link;
    }else if(plan.duration === "Per year" && yearlyPaymentLink?.payment_link){
      window.location.href=yearlyPaymentLink?.payment_link;
    }else{
      toast.error("Payment link not found");
    }
    localStorage.setItem("stripe_process_plan", JSON.stringify({
      plan_id : plan.id,
      plan_type:plan.duration,  
    }));
  };

  const openCancelSubsModal = (plan) => {
  console.log('plan: ', plan);
    setIsConfirm(true);
  };
  const handleCancelSubscription = () => {
    CancelSubscription()
      .unwrap()
      .then((response) => {
        setIsConfirm(false);
        refetchUserSubscribedPlan();
        // setGetUserSubscribedPlan(null);
        toast.success("Subscription cancelled Successfully!");
      })
      .catch((error) => {
        // setIsAutoCredit(!data.status);
        if (error?.data?.message) {
          toast.error(error?.data?.message);
        }
      });
  };
  return (
    <div className="bg-gray-100 min-h-screen font-helvetica">
      <header className="fixed top-0 w-full bg-white p-5">
        <img src="/svg/togl-icon.svg" alt="Togl Logo" width={40} height={20} />
      </header>

      <div className="container mx-auto px-4 pt-32 text-center">
        <h2 className="text-5xl font-semibold text-[#090909] font-helvetica">
          Welcome to Togl
        </h2>
        <p className="text-lg font-medium text-[#3D3D3D] mt-2 font-helvetica">
          One platform. Endless AI tools. Seamlessly integrated to supercharge
          your productivity.
        </p>

        <div className="flex flex-wrap justify-center gap-6 mt-10">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className="w-[500px] py-4 px-7 shadow-md rounded-lg bg-white items-start"
            >
              <div
                style={{ height: "50px" }}
                className="flex flex-col items-center w-full"
              >
                <div className="flex justify-center w-full  mb-0.5">
                  <div
                    className="text-[#687177] text-sm font-helvetica flex items-center"
                    style={{ fontWeight: plan.discount ? 700 : 400 }}
                  >
                    <img
                      src="/svg/plan-icon.svg"
                      alt="plan"
                      width={18}
                      height={18}
                      className="mr-2"
                    />
                    {plan.description}
                  </div>
                </div>
                {plan.specialNote && (
                  <p className="text-sm text-[#687177] self-center ml-5">
                    {plan.specialNote}
                  </p>
                )}
              </div>
              <div className="flex justify-between items-center w-full mt-2">
                <h3 className="text-2xl font-semibold text-[#000000] mt-2">
                  {plan.plan_name}
                </h3>
                {plan.discount && (
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-md text-xs font-bold">
                    {plan.discount}
                  </span>
                )}
              </div>
              <p className="text-sm font-normal text-[#000000] mt-1">
                {plan.Note}
              </p>
              <h2 className="text-3xl font-normal text-gray-900 mt-3">
                ${plan.price}{" "}
                <span className="text-sm text-[#687177]">{plan.duration}</span>
              </h2>
              <Button
              disabled={monthlyPaymentLink?.payment_link ? false : true}
                // onClick={() => router.push("/")}
                className="w-full bg-[#387FF5] text-[17px] text-white !font-bold mt-1 rounded"
                onMouseEnter={() =>
                  isPlanTypeSubscribed(plan) && setHoveredPlan(plan)
                }
                onMouseLeave={() => setHoveredPlan(null)}
                onClick={() =>
                  isPlanTypeSubscribed(plan)
                    ? openCancelSubsModal(plan)
                    : handleStripeCheckout(plan)
                }
              >
                {isPlanTypeSubscribed(plan)
                  ? hoveredPlan?.duration === plan.duration
                    ? "Cancel"
                    : "Subscribed"
                  : plan.buttonText}
              </Button>
              <ul className="mt-5 mb-1 text-left text-[#000000] text-sm">
                {plan.features.map((feature, i) => (
                  <li key={i} className="py-1">
                    • {feature}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
      <CancelSubscriptionModal
        isOpenCancelSubsModal={isOpenCancelSubsModal}
        setisOpenCancelSubsModal={(v) => setisOpenCancelSubsModal(v)}
        setIsConfirm={setIsConfirm}
        isConfirm={isConfirm}
        handleCancelSubscription={handleCancelSubscription}
        isMutationLoading={isMutationLoading}
      />
      <AddCardFormModal
        OpenCardModal={OpenCardModal}
        setOpenCardModal={setOpenCardModal}
        afterSubscribe={true}
        setIsOpenSubsribeModal={setShowSubscribeModal}
      />
      <ConfirmTopupChangeModal
        isModalVisible={showSubscribeModal}
        setIsModalVisible={setShowSubscribeModal}
        handleCancel={(state) => {
          setShowSubscribeModal(state);
          setSelectedPlan(null);
        }}
        handleConfirm={() => {
          subscriptionPlans(selectedPlan);
          setShowSubscribeModal(false);
        }}
        title={"Subscribe"}
        subtitle={`Subscribe to ${selectedPlan?.plan_name} plan!`}
        message={`Are you sure you want to subscribe to ${selectedPlan?.plan_name}?`}
        selectedPlan={selectedPlan}
        isAnnualBilling={isAnnualBilling}
      />
      <ToastService />
    </div>
  );
};

export default Subscription;
