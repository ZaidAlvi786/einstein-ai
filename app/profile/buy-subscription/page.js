"use client";
import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Modal,
  Skeleton,
  Spinner,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import TagIcon from "@/app/assets/svg/icon-tag.svg";
import StarIcon from "@/app/assets/svg/star-icon.svg";
import CancelSubscriptionModal from "@/components/billing/CancelSubscriptionModal";
import ToggleCancelModel from "@/components/billing/ToggleCancelModel";
import { useMemo } from "react";
import {
  useCancelSubscriptionMutation,
  useGetAutoTopupStatusQuery,
  useGetCustomersCardsQuery,
  useGetPlatformPlansQuery,
  useGetUserInvoiceHistoryQuery,
  useGetUserSubscribedPlanQuery,
  useMakePaymentMutation,
  useSetAutoTopupStatusMutation,
  useSubscribeToPlatformPlanMutation,
  useUpdateAutoTopupStatusMutation,
} from "@/app/lib/features/payment/paymentApi";
import { useAuth } from "@/app/authContext/auth";
import { useEffect } from "react";
import { Switch as NextSwitch } from "@nextui-org/switch";
import toast from "react-hot-toast";
import ToastService from "@/components/Toaster/toastService";
import AddCardFormModal from "@/components/billing/AddCardFormModal";
import ConfirmTopupChangeModal from "@/components/billing/ConfirmTopupChangeModal";
import { Switch } from "antd";

const freeFeatureLists = [
  "30 Queries",
  "15 Models and Plugins",
  "2 Pinned Chats",
  "2 Workspaces",
  "200 MB Storage",
  "Einstein Auto Basic Access",
  "Free Plugins Only",
];

const ultraFeatureList = [
  "1000 Queries per month (included)",
  "200+ Models & Plugins",
  "Rapid GPT Builder",
  "Unlimited Pinned Chats",
  "Unlimited Workspaces",
  "5 GB Storage (included)",
  "Shared Workspaces & Chats",
  "Einstein Auto Full Access",
  "Full Plugin + Model Library",
];

const enterpriseFeatures = [
  "Unlimited Queries",
  "Enterprise Models",
  "High Security Features",
  "Custom Permissions",
  "Custom Workspaces",
  "Unlimited Storage",
];

const Plans = [
  {
    plan_name: "Free",
    title_text: "There are currently no running promotions",
    limited_time_only: false,
    bullet_points: freeFeatureLists,
    button_text: "Applied",
  },
  {
    plan_name: "Pro",
    title_text: "20% Off Annual Plan",
    limited_time_only: true,
    bullet_points: ultraFeatureList,
    button_text: "Subscribe",
  },
  {
    plan_name: "Enterprise",
    title_text: "Special Pricing for New Companies",
    limited_time_only: true,
    bullet_points: enterpriseFeatures,
    button_text: "Contact",
  },
];
const PlatformPlans = [
  {
    id: "66fd0e52502dbc3c43998687",
    plan_name: "Free",
    price: 0,
    plan_description:
      "Our basic plan for new users. Try out Togl with free credits on us.",
    features: [
      "$1 single-use credits total",
      "6 Pinned Chats",
      "2 GPT’s",
      "5 Workspaces",
      "1 shared workspace/chat",
    ],
    buttonText: "Active",
    buttonDisabled: true,
    title_text: "There are currently no running promotions",
  },
  {
    id: "66fd0e52502dbc3c43998688",
    plan_name: "Pro",
    monthly_price: 12,
    monthly_price_lumsum: 9,
    yearly_price: 108,
    plan_description:
      "Experience the full power of Togl - the largest library of AI tools at your fingertips.",
    features: [
      "Unlimited GPT’s",
      "Unlimited Pinned Chats",
      "Unlimited Workspaces",
      "Unlimited Shared Workspaces & Chats",
      "2$ of Single-use Credits per month incl.",
    ],
    buttonText: "Continue",
    buttonDisabled: false,
    title_text: "20% Off Annual Plan",
    limited_time_only: true,
  },
  {
    id: "66fd0e52502dbc3c43998689",
    plan_name: "Enterprise",
    price: "Contact",
    plan_description:
      "Customize the Togl experience for your team’s needs. Access enterprise models.",
    features: [
      "Enterprise Models",
      "High Security Features",
      "Custom Permissions",
      "Team management",
      "Employee accounts",
    ],
    buttonText: "Contact",
    buttonDisabled: false,
    title_text: "Special Pricing for New Companies",
    title_text: true,
  },
];

// const CancelSubscriptionModalOnToggle = ({
//   setIsModalVisible,
//   isModalVisible,
//   handleCancel,
// }) => {
//   return (
//     <Modal
//       open={true}
//       onCancel={handleCancel}
//       footer={null}
//       centered
//       className="custom-modal"
//       width={300} // Adjust width to match the design
//       bodyStyle={{
//         padding: "20px",
//         textAlign: "center",
//         backgroundColor: "#1F1F1F",
//         borderRadius: "10px",
//       }}
//       closeIcon={<span style={{ color: "white" }}>X</span>}
//     >
//       <div className="text-center">
//         <p className="text-white font-bold text-sm">
//           You are subscribed to Gemini
//         </p>
//         <div className="flex justify-center items-center gap-2 my-3">
//           <Image
//             alt="gemini icon"
//             width={40}
//             height={40}
//             src={"/models/gemini.png"}
//           />
//           <p className="text-white text-sm font-bold">$8.99/Month</p>
//         </div>
//         <p className="text-white text-sm mb-6 font-normal">
//           Do you want to cancel this subscription?
//         </p>
//         <div className="flex flex-col gap-2">
//           <Button
//             className="bg-[#414141] hover:bg-[#E54637] hover:text-white text-[#E54637] font-normal rounded-md h-[36px] text-sm"
//             block
//             onClick={() => alert("Cancelled")}
//           >
//             Cancel Subscription
//           </Button>
//           <Button
//             className="bg-[#414141]  text-white font-normal rounded-md h-[36px] text-sm"
//             block
//             onClick={handleCancel}
//           >
//             View Details
//           </Button>
//         </div>
//       </div>
//     </Modal>
//   );
// };

const BuySubscription = () => {
  const auth = useAuth();
  const router = useRouter();
  // const { data: PlatformPlans, isLoading: isLoadingPlatformPlans } =
  useGetPlatformPlansQuery();
  const { data: cardsList } = useGetCustomersCardsQuery(
    { user_id: auth?.user?.userID },
    { skip: !auth?.user?.userID }
  );
  // const { data: InvoiceHistory } = useGetUserInvoiceHistoryQuery(
  //   { user_id: auth?.user?.userID },
  //   { skip: !auth?.user?.userID }
  // );
  const [CancelSubscription, isMutationLoading] =
    useCancelSubscriptionMutation();
  const [OpenCardModal, setOpenCardModal] = useState({
    open: false,
    mode: "add",
    card_details: null,
  });
  const [isAnnualBilling, setIsAnnualBilling] = useState(true);
  const [isAutoCredit, setIsAutoCredit] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setisLoading] = useState({ plan_id: null });
  const [SubscribeToPlatformPlan] = useSubscribeToPlatformPlanMutation();
  const [setAutoTopupStatus] = useSetAutoTopupStatusMutation();
  const [updateAutoTopupStatus] = useUpdateAutoTopupStatusMutation();
  const {
    data: topUpStatusData,
    error,
    isLoading: isQueryLoading,
  } = useGetAutoTopupStatusQuery();
  const {
    data: getUserSubscribedPlanApi,
    refetch: refetchUserSubscribedPlan,
    isError: errorInGetUserSubscriptionApi,
  } = useGetUserSubscribedPlanQuery();

  const [isOpenCancelSubsModal, setisOpenCancelSubsModal] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [autoCreditAmount, setAutoCreditAmount] = useState(null);
  const [showAutoCreditErr, setShowAutoCreditErr] = useState(false);
  const [hoverText, setHoverText] = useState("");
  const [getUserSubscribedPlan, setGetUserSubscribedPlan] = useState(null);
  const [showtopuModal, setShowtopupModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(PlatformPlans[1]);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  useEffect(() => {
    refetchUserSubscribedPlan();
  }, []);
  useEffect(() => {
    if (errorInGetUserSubscriptionApi) {
      setGetUserSubscribedPlan(null);
    }
  }, [errorInGetUserSubscriptionApi]);
  useEffect(() => {
    if (getUserSubscribedPlanApi?.data) {
      setGetUserSubscribedPlan(getUserSubscribedPlanApi);
      const getSub_plan = getUserSubscribedPlanApi?.data?.find(
        (plan) => plan?.subscription_type === "plan"
      );
      console.log("getSub_plan: ", getSub_plan);
      if (getSub_plan) {
        if (getSub_plan.recurrence === "yearly") {
          setIsAnnualBilling(true);
        } else {
          setIsAnnualBilling(false);
        }
      }
    } else {
      setGetUserSubscribedPlan(null);
    }
  }, [getUserSubscribedPlanApi?.data]);

  useEffect(() => {
    if (topUpStatusData?.topup_active) {
      setIsAutoCredit(true);
      setAutoCreditAmount(topUpStatusData.topup_amount);
    } else {
      setIsAutoCredit(false);
    }
  }, [topUpStatusData]);

  const handleTopUpStatus = (data) => {
    setAutoTopupStatus(data)
      .unwrap()
      .then((response) => {
        if (data.status) {
          setShowAutoCreditErr(false);
          setAutoCreditAmount(data.amount);
          setIsAutoCredit(true); //make toggle button active
          toast.success("Set Auto Credit Top-Ups Successfully!");
        } else {
          setIsAutoCredit(false); //make toggle button deactivated
          setAutoCreditAmount(null);
          toast.success("Auto Credit Top-Ups Deativated!");
          if (isModalVisible) {
            // is user deactivating status then close the confirm model
            setIsModalVisible((prev) => !prev);
          }
        }
      })
      .catch((error) => {
        setIsAutoCredit(!data.status);
        if (error?.data?.message) {
          toast.error(error?.data?.message);
        }
      });
  };

  const updateTopUpStatus = (amount) => {
    updateAutoTopupStatus({ amount: autoCreditAmount })
      .unwrap()
      .then((response) => {
        setShowAutoCreditErr(false);
        setIsAutoCredit(true);
        setAutoCreditAmount(amount);
        toast.success(response.message);
      })
      .catch((error) => {
        toast.error(error?.data?.message);
        if (error.status === 400) {
          // message : Auto topup is inactive, please enable it first
          const data = {
            status: true,
            amount: autoCreditAmount,
          };
          handleTopUpStatus(data);
        }
        // if (error?.data?.message) {
        //   toast.error(error?.data?.message);
        // }
      });
  };

  const ActiveTopUpStatus = (amount) => {
    updateAutoTopupStatus({ amount: amount })
      .unwrap()
      .then((response) => {
        setShowAutoCreditErr(false);
        setIsAutoCredit(true);
        setAutoCreditAmount(amount);
      })
      .catch((error) => {
        toast.error(error?.data?.message);
        if (error.status === 400) {
          // message : Auto topup is inactive, please enable it first
          const data = {
            status: true,
            amount: amount,
          };
          handleTopUpStatus(data);
        }
        // if (error?.data?.message) {
        //   toast.error(error?.data?.message);
        // }
      });
  };
  const handleCancelSubscription = () => {
    CancelSubscription()
      .unwrap()
      .then((response) => {
        setIsConfirm(false);
        refetchUserSubscribedPlan();
        setGetUserSubscribedPlan(null);
        toast.success("Subscription cancelled Successfully!");
      })
      .catch((error) => {
        // setIsAutoCredit(!data.status);
        if (error?.data?.message) {
          toast.error(error?.data?.message);
        }
      });
  };
  console.log("autoCreditAmount: ", autoCreditAmount);

  // const handleToggleOn = (checked) => {
  //   if (checked) {
  //     if (autoCreditAmount && autoCreditAmount > 0) {

  //       const data = {
  //         status: true,
  //         amount: autoCreditAmount,
  //       };
  //       handleTopUpStatus(data);
  //     } else {
  //       setIsAutoCredit(true); // Disable Auto Credit
  //       setShowAutoCreditErr(true); // Show error message
  //       return; // Simply return to prevent further action
  //     }
  //   } else {
  //     setIsModalVisible(true); // Show modal when unchecked
  //     setIsAutoCredit(false); // Ensure Auto Credit is disabled when unchecked
  //     setShowAutoCreditErr(false); // Hide any previous error messages
  //   }
  // };

  const handleToggleOn = (checked) => {
    if (checked) {
      if (autoCreditAmount && autoCreditAmount > 0) {
        const data = {
          status: true,
          amount: autoCreditAmount,
        };
        handleTopUpStatus(data);
      } else {
        setShowAutoCreditErr(true);
      }
    } else {
      setIsModalVisible(true);
    }
  };

  const handleConfirmCancel = () => {
    const data = {
      status: false,
      amount: 0,
    };
    handleTopUpStatus(data);
  };

  const handleCancel = () => {
    setIsAutoCredit(true); // Reset switch to "OFF"
    setIsModalVisible(false); // Close the modal
  };

  // -------------------------

  const navigateToBillingPage = () => {
    router.push("/profile/billing");
  };

  const openCancelSubsModal = (plan) => {
    setIsConfirm(true);
  };

  // const subscriptionPlans = (plan) => {
  //   //  NOTE: if (plan.plan_name !== "Free") is only added to demo the Cancel confirmation model
  //   //  NOTE: Open comment of Disable on Button  because not availablity of cancel button right noe
  //   if (plan.plan_name !== "Free") { // Temporary check only to show cancel model when user click on Applied Button
  //     const amount = isAnnualBilling
  //       ? parseInt(plan?.yearly_price) * 100
  //       : parseInt(plan?.monthly_price) * 100;
  //     const plan_type = isAnnualBilling ? "yearly" : "monthly";
  //     const card_id = cardsList?.payment_methods?.[0]?.card_id;
  //     const user_id = auth?.user?.userID;
  //     const plan_id = plan?.id;

  //     const data = {
  //       params: {
  //         card_id,
  //         amount,
  //         user_id,
  //       },
  //     };

  //     setisLoading({ plan_id: plan?.id });

  //     MakePaymentInStripe(data)
  //       .unwrap()
  //       .then((response) => {
  //         console.log("MakePaymentInStripe Success : ", response);

  //         const stripe_reference_id = response?.stripe_reference_id;

  //         const data1 = {
  //           params: {
  //             user_id,
  //             stripe_reference_id,
  //             plan_id,
  //             plan_type,
  //           },
  //         };

  //         SubscribeToPlatformPlan(data1)
  //           .unwrap()
  //           .then((response) => {
  //             console.log("SubscribeToPlatformPlan Success : ", response);
  //             toast.success("Plan Purchased Successfully!");
  //             setisLoading({ plan_id: null });
  //             navigateToBillingPage();
  //           })
  //           .catch((error) => {
  //             setisLoading({ plan_id: null });
  //             console.log("SubscribeToPlatformPlan Error : ", error);
  //             if (error?.data?.message) {
  //               toast.error(error?.data?.message);
  //             }
  //           });
  //       })
  //       .catch((error) => {
  //         setisLoading({ plan_id: null });
  //         console.log("MakePaymentInStripe Error : ", error);
  //         if (error?.data?.message) {
  //           toast.error(error?.data?.message);
  //         }
  //       });
  //   }else{
  //     setIsConfirm(true);
  //   }
  // };

  // const subscriptionPlans = (plan) => {
  // console.log('plan: mmm', plan);

  //   const amount = isAnnualBilling
  //     ? parseInt(plan?.yearly_price) * 100
  //     : parseInt(plan?.monthly_price) * 100;
  //   const plan_type = isAnnualBilling ? "yearly" : "monthly";
  //   const card_id = cardsList?.payment_methods?.[0]?.card_id;
  //   const user_id = auth?.user?.userID;
  //   const plan_id = plan?.id;

  //   const data = {
  //     params: {
  //       card_id,
  //       amount,
  //       user_id,
  //     },
  //   };

  //   setisLoading({ plan_id: plan?.id });

  //   MakePaymentInStripe(data)
  //     .unwrap()
  //     .then((response) => {
  //       console.log("MakePaymentInStripe Success : ", response);

  //       const stripe_reference_id = response?.stripe_reference_id;

  //       const data1 = {
  //         params: {
  //           user_id,
  //           stripe_reference_id,
  //           plan_id,
  //           plan_type,
  //         },
  //       };

  //       SubscribeToPlatformPlan(data1)
  //         .unwrap()
  //         .then((response) => {
  //           console.log("SubscribeToPlatformPlan Success : ", response);
  //           toast.success("Plan Purchased Successfully!");
  //           setisLoading({ plan_id: null });
  //           navigateToBillingPage();
  //         })
  //         .catch((error) => {
  //           setisLoading({ plan_id: null });
  //           console.log("SubscribeToPlatformPlan Error : ", error);
  //           if (error?.data?.message) {
  //             toast.error(error?.data?.message);
  //           }
  //         });
  //     })
  //     .catch((error) => {
  //       setisLoading({ plan_id: null });
  //       console.log("MakePaymentInStripe Error : ", error);
  //       if (error?.data?.message) {
  //         toast.error(error?.data?.message);
  //       }
  //     });
  // };

  const subscriptionPlans = (plan) => {
    const amount = isAnnualBilling
      ? parseInt(plan?.yearly_price) * 100
      : parseInt(plan?.monthly_price) * 100;
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
        navigateToBillingPage();
        toast.success("Plan Purchased Successfully!");
        setisLoading({ plan_id: null });
      })
      .catch((error) => {
        setisLoading({ plan_id: null });
        if (error?.data?.message) {
          toast.error(error?.data?.message);
        }
      });
    setSelectedPlan(null);
  };
  // const IsPlanPurchased = (plan) => {
  //   const Plan = InvoiceHistory?.data?.find(
  //     (current_plan) => current_plan?.plan_id === plan?.id
  //   );

  //   if (Plan) {
  //     return true;
  //   }
  //   return false;
  // };
  // console.log("isConfirm", isConfirm);

  const handleSeleteAutoCreditAmount = (amount) => {
    if (cardsList?.payment_methods?.length === 0)
      return setOpenCardModal((prev) => ({ ...prev, open: true }));
    if (isAutoCredit) {
      setShowtopupModal(true);
      setAutoCreditAmount(amount);
    } else {
      // setAutoCreditAmount(amount);
      const data = {
        status: true,
        amount: amount,
      };
      handleTopUpStatus(data);
    }
  };
  useEffect(() => {}, [selectedPlan]);

  return (
    <div className='max-w-[1150px] w-full mx-auto px-6  flex flex-col lg:justify-normal min-[1800px]:justify-center pb-5 lg:mt-[10px]'>
      <CancelSubscriptionModal
        isOpenCancelSubsModal={isOpenCancelSubsModal}
        setisOpenCancelSubsModal={(v) => setisOpenCancelSubsModal(v)}
        setIsConfirm={setIsConfirm}
        isConfirm={isConfirm}
        handleCancelSubscription={handleCancelSubscription}
        isMutationLoading={isMutationLoading}
      />

      <ToggleCancelModel
        isModalVisible={isModalVisible}
        setIsModalVisible={(e) => setIsModalVisible(e)}
        handleCancel={handleCancel}
        handleToggleOn={handleToggleOn}
        handleConfirmCancel={handleConfirmCancel}
        isMutationLoading={isMutationLoading}
      />

      <div className='pt-8'>
        <h2 className='text-[36px] text-white font-normal helvetica-font mb-5'>
          Upgrade Your Togl Account
        </h2>
        <div className='2xl:mb-15 xl:mb-8 flex items-center gap-2'>
          {/* <NextSwitch
            // checked={isAutoCredit}
            isSelected={isAnnualBilling}
            onValueChange={(e) => setIsAnnualBilling(e)}
            size="sm"
            style={{ border: !isAnnualBilling ? "1px solid white" : "none" }}
          ></NextSwitch> */}
          <NextSwitch
            isSelected={isAnnualBilling}
            onValueChange={(state) => setIsAnnualBilling(state)}
          />
          <div className='text-white text-[14px]'>Annual Billing On</div>
          <div className='text-white text-[14px]'>
            {isAnnualBilling ? "$9/mo totaling $108" : "$12/mo"}
          </div>
        </div>
      </div>
      <div className='flex items-center justify-center gap-8'>
        {PlatformPlans?.map((platformPlan, key) => (
          <div
            onClick={() => setSelectedPlan(platformPlan)}
            key={key}
            className='className="max-w-[385px] w-full shadow-[-3px_3px_8px_0px_#0000001A]  group cursor-pointer transition-all mb-5 relative'
          >
            {platformPlan?.plan_name === "Pro" && (
              <div className='absolute top-[-40px] flex gap-[5px] items-center'>
                <StarIcon className='text-white' />
                <p className='text-white helvetica-font font-bold text-[14px]'>
                  Recommended
                </p>
              </div>
            )}
            <Card
              className={`bg-card-gradient rounded-3xl h-[547px] ${
                platformPlan?.id === selectedPlan?.id
                  ? "border-[#5E91FF] border-[1px] border-solid"
                  : ""
              }`}
            >
              <CardHeader
                className={`
                      ${
                        // getUserSubscribedPlan?.data?.some(
                        //   (p) => p?.plan_id === platformPlan?.id
                        // )
                        //   ? "bg-[#5E91FF]"
                        //   : "bg-[#393838]"
                        ""
                      }
                    ${
                      platformPlan?.id === selectedPlan?.id
                        ? "bg-[#5E91FF]"
                        : "bg-[#393838]"
                    }
                     group-hover:bg-[#5E91FF] items-center group-hover:text-white group-hover:font-medium group-hover:text-sm text-xl font-medium justify-start flex 2xl:gap-[16px] xl:gap-[10px] plan-title h-16`}
              >
                <div
                  className={`${
                    platformPlan?.limited_time_only ? "h-full" : ""
                  } `}
                >
                  <TagIcon
                    className={`${
                      // getUserSubscribedPlan?.data?.some(
                      //   (p) => p?.plan_id === platformPlan?.id
                      // )
                      platformPlan?.id === selectedPlan?.id
                        ? "text-white"
                        : "text-[#A4A4A4]"
                    } group-hover:text-white mt-1`}
                  />
                </div>
                <div className='p-1'>
                  <p
                    className={`helvetica-font text-sm group-hover:text-white font-inter group-hover:text-sm ${
                      platformPlan?.limited_time_only ||
                      Plans.find(
                        (plan) => plan.plan_name === platformPlan?.plan_name
                      )?.title_text === "Special Pricing for New Companies"
                        ? "font-bold text-beige"
                        : "font-normal text-[#FFFFFF]"
                    }`}
                  >
                    {
                      Plans.find(
                        (plan) => plan.plan_name === platformPlan?.plan_name
                      )?.title_text
                    }
                  </p>
                  {Plans.find(
                    (plan) => plan.plan_name === platformPlan?.plan_name
                  )?.limited_time_only && (
                    <p className='text-sm font-normal font-inter text-white'>
                      *Limited time only
                    </p>
                  )}
                </div>
              </CardHeader>
              <CardBody className='px-7 py-2'>
                <div className='flex justify-between pt-2 pb-7'>
                  <h1
                    className={`2xl:text-[40px] xl:text-[27px] text-white helvetica-font ${
                      platformPlan?.limited_time_only
                        ? "font-medium"
                        : "font-light"
                    }`}
                  >
                    {platformPlan?.plan_name ?? "-"}
                  </h1>
                  <div className="flex flex-col justify-start items-end lg:min-h-[56.7px]">
                    {platformPlan?.plan_name === "Pro" && isAnnualBilling ? (
                      <span className="2xl:text-[34px] xl:text-[27px] text-white helvetica-font font-light">
                        $
                        {PlatformPlans?.find(
                          (p) => p.plan_name === platformPlan?.plan_name
                        )?.yearly_price ?? 0}
                        /year
                      </span>
                    ) : (
                      <></>
                    )}
                    {platformPlan?.plan_name !== "Enterprise" ? (
                      isAnnualBilling ? (
                        PlatformPlans?.find(
                          (p) => p.plan_name === platformPlan?.plan_name
                        )?.monthly_price ? (
                          <p className="text-white font-helvetica font-normal text-xs not-italic">
                            $
                            {
                              PlatformPlans?.find(
                                (p) => p.plan_name === platformPlan?.plan_name
                              )?.monthly_price_lumsum
                            }
                            /mo
                          </p>
                        ) : (
                          <p className="2xl:text-[34px] xl:text-[27px] text-white helvetica-font font-light">
                            $0/mo
                          </p>
                        )
                      ) : platformPlan.plan_name === "Free" ? (
                        <p className="2xl:text-[34px] xl:text-[27px] text-white helvetica-font font-light">
                          $0/mo
                        </p>
                      ) : (
                        <p className="2xl:text-[34px] xl:text-[27px] text-white helvetica-font font-light">
                          $12/mo
                        </p>
                      )
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <p className='text-[16px] h-[100px] text-white helvetica-font font-normal pb-[34px]'>
                  {PlatformPlans?.find(
                    (p) => p?.plan_name === platformPlan?.plan_name
                  )?.plan_description ?? "-"}
                </p>
                <ul className='2xl:ml-[46px] xl:ml-8'>
                  {platformPlan?.features?.map((feature, index) => (
                    <li
                      key={index}
                      className='list-disc list-item ps-0 pb-0 helvetica-font text-[15px] font-normal mb-2'
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardBody>
              <CardFooter className='pe-5 pb-5'>
                {getUserSubscribedPlan?.data?.some(
                  (p) => p?.plan_id === platformPlan?.id
                ) ? (
                  <Button
                    // className={`bg-transparent rounded-2xl w-full 2xl:text-[18px] xl:text-base font-bold helvetica-font bg-[#E54637] text-black group-hover:disabled:bg-[#3A3A3A] group-hover:disabled:text-[#959595] disabled:bg-[#3A3A3A] disabled:text-[#959595] tracking-widest`}
                    className={`bg-transparent rounded-2xl w-full 2xl:text-[18px] xl:text-base font-bold helvetica-font ${
                      getUserSubscribedPlan?.data?.some(
                        (p) => p?.plan_id === platformPlan?.id
                      )
                        ? "bg-[#3A3A3A] text-[#959595]"
                        : "bg-[#E4E4E4] text-black"
                    }  group-hover:disabled:bg-[#3A3A3A] group-hover:disabled:text-[#959595] disabled:bg-[#3A3A3A] disabled:text-[#959595] tracking-widest`}
                    onClick={() =>
                      openCancelSubsModal(
                        PlatformPlans?.find(
                          (p) => p.plan_name === platformPlan?.plan_name
                        )
                      )
                    }
                    onMouseEnter={() => setHoverText("Cancel")}
                    onMouseLeave={() => setHoverText("")}
                  >
                    {hoverText == "" ? "Active" : hoverText}
                  </Button>
                ) : (
                  <Button
                    className={`bg-transparent rounded-2xl w-full 2xl:text-[18px] xl:text-base font-bold helvetica-font bg-[#E4E4E4]  text-black group-hover:disabled:bg-[#3A3A3A] group-hover:disabled:text-[#959595] disabled:bg-[#3A3A3A] disabled:text-[#959595] tracking-widest`}
                    disabled={isLoading?.plan_id === platformPlan?.id}
                    onClick={() => {
                      if (cardsList?.payment_methods.length > 0) {
                        setSelectedPlan(platformPlan);
                        setShowSubscribeModal(true);
                        // subscriptionPlans(
                        //   PlatformPlans?.find(
                        //     (p) => p.plan_name === platformPlan?.plan_name
                        //   )
                        // );
                      } else {
                        setOpenCardModal((prev) => ({ ...prev, open: true }));
                      }
                    }}
                  >
                    {isLoading?.plan_id === platformPlan?.id ? (
                      <Spinner size='sm' color='white' />
                    ) : getUserSubscribedPlan?.data?.some(
                        (p) => p?.plan_id === platformPlan?.id
                      ) ? (
                      "Cancel"
                    ) : platformPlan.plan_name === "Enterprise" ? (
                      "Contact"
                    ) : (
                      "Subscribe"
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>

      {isQueryLoading ? (
        <Skeleton className='w-full  rounded-3xl mb-4'>
          <div className='h-[187px] w-full '></div>
        </Skeleton>
      ) : (
        <div className='pb-8 mt-4'>
          <div
            style={{
              background:
                "linear-gradient(155.14deg, #242424 -2.13%, #1B1B1B 136.58%)",
            }}
            className='px-6 rounded-[24px] mb-5 py-3'
          >
            {isQueryLoading ? (
              <Skeleton className='w-[20px]  rounded-3xl mb-4'>
                <div className='h-[20px] '></div>
              </Skeleton>
            ) : isAutoCredit ? (
              <div className='text-[green] text-end mt-3 ml-5 '>Active</div>
            ) : (
              <div className='text-[#FF3C3C] text-end mt-3 ml-5 '>
                Not Active
              </div>
            )}

            <div className='mt-[-25px] flex flex-wrap justify-center md:justify-center items-center'>
              <div>
                <div className='flex items-center gap-4'>
                  <h2 className='text-[40px] text-white font-[500] helvetica-font'>
                    Auto Credit Top-Ups
                  </h2>
                  <div className='flex gap-2 '>
                    <Switch
                      // checked={isAutoCredit}
                      value={isAutoCredit}
                      onChange={(e) => handleToggleOn(e)}
                      size='sm'
                    />
                  </div>
                </div>
                <div>
                  <p className='text-[16px] text-white helvetica-font font-normal pb-[20px] mt-6'>
                    Some tools charge per individual use - keep your workflow
                    <br />
                    uninterrupted with automatic credit top-ups.
                  </p>
                </div>
              </div>
              <div className='text-white w-[100%] md:w-[50%] flex justify-center items-center flex-col'>
                <div>When credits drop below $1.00 add:</div>
                <div className='mt-3 flex justify-around gap-3'>
                  <div
                    className={` ${
                      autoCreditAmount === 3
                        ? "bg-[#7A7A7A] border-1"
                        : "bg-[#3A3A3A]"
                    } hover:bg-[#7A7A7A] cursor-pointer  w-[64.54px] h-[43px] text-[21.76px] flex justify-center items-center rounded-[15px]`}
                    onClick={() => {
                      handleSeleteAutoCreditAmount(3);
                    }}
                  >
                    $3
                  </div>
                  <div
                    className={` ${
                      autoCreditAmount === 5
                        ? "bg-[#7A7A7A] border-1"
                        : "bg-[#3A3A3A]"
                    } hover:bg-[#7A7A7A] cursor-pointer  w-[64.54px] h-[43px] text-[21.76px] flex justify-center items-center rounded-[15px]`}
                    onClick={() => {
                      handleSeleteAutoCreditAmount(5);
                    }}
                  >
                    $5
                  </div>
                  <div
                    className={` ${
                      autoCreditAmount === 10
                        ? "bg-[#7A7A7A] border-1"
                        : "bg-[#3A3A3A]"
                    } hover:bg-[#7A7A7A] cursor-pointer  w-[64.54px] h-[43px] text-[21.76px] flex justify-center items-center rounded-[15px]`}
                    onClick={() => {
                      handleSeleteAutoCreditAmount(10);
                    }}
                  >
                    $10
                  </div>
                </div>
                {showAutoCreditErr && !autoCreditAmount && (
                  <div className='text-[red] text-base mt-2'>
                    Select Auto Credit Amount
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastService />
      <AddCardFormModal   
        OpenCardModal={OpenCardModal}
        setOpenCardModal={setOpenCardModal}
        afterSubscribe={true}
        setIsOpenSubsribeModal={setShowSubscribeModal}
      />
      <ConfirmTopupChangeModal
        isModalVisible={showtopuModal}
        setIsModalVisible={setShowtopupModal}
        handleCancel={(state) => {
          setShowtopupModal(state);
          setAutoCreditAmount(topUpStatusData.topup_amount);
        }}
        handleConfirm={() => {
          setShowtopupModal(false);
          updateTopUpStatus(autoCreditAmount);
        }}
        title={"Top-Up Credit"}
        subtitle={"Confirm Top-Up Credit"}
        message={`Are you sure you want to change top-up credit amount to $${autoCreditAmount}?`}
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
    </div>
  );
};

export default BuySubscription;
