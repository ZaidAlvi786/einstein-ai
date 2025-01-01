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
  Spinner,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import TagIcon from "@/app/assets/svg/icon-tag.svg";
import StarIcon from "@/app/assets/svg/star-icon.svg";
import CancelSubscriptionModal from "@/components/billing/CancelSubscriptionModal";
import ToggleCancelModel from "@/components/billing/ToggleCancelModel";
import { useMemo } from "react";
import {
  useGetAutoTopupStatusQuery,
  useGetCustomersCardsQuery,
  useGetPlatformPlansQuery,
  useGetUserInvoiceHistoryQuery,
  useMakePaymentMutation,
  useSetAutoTopupStatusMutation,
  useSubscribeToPlatformPlanMutation,
  useUpdateAutoTopupStatusMutation,
} from "@/app/lib/features/payment/paymentApi";
import { useAuth } from "@/app/authContext/auth";
import { useEffect } from "react";
import { Switch } from "antd";
import toast from "react-hot-toast";

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
    plan_name: "Ultra",
    title_text: "Get the Einstein Auto Free!",
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
  const { data: PlatformPlans } = useGetPlatformPlansQuery();
  const { data: cardsList } = useGetCustomersCardsQuery(
    { user_id: auth?.user?.userID },
    { skip: !auth?.user?.userID }
  );
  const { data: InvoiceHistory } = useGetUserInvoiceHistoryQuery(
    { user_id: auth?.user?.userID },
    { skip: !auth?.user?.userID }
  );
  const [isCanceledSubscription, setisCanceledSubscription] = useState(false);
  const [isAnnualBilling, setIsAnnualBilling] = useState(true);
  const [isAutoCredit, setIsAutoCredit] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setisLoading] = useState({ plan_id: null });
  const [MakePaymentInStripe] = useMakePaymentMutation();
  const [SubscribeToPlatformPlan] = useSubscribeToPlatformPlanMutation();
  const [setAutoTopupStatus] = useSetAutoTopupStatusMutation();
  const [updateAutoTopupStatus] = useUpdateAutoTopupStatusMutation();
  const {
    data: topUpStatusData,
    error,
    isLoading: isQueryLoading,
  } = useGetAutoTopupStatusQuery();
  
  const [isOpenCancelSubsModal, setisOpenCancelSubsModal] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [autoCreditAmount, setAutoCreditAmount] = useState(null);
  const [showAutoCreditErr, setShowAutoCreditErr] = useState(false);

  //  const [isToggleModelVisible, setToggleModelVisible] = useState(false);

  //  const showToggleModal = () => {
  //    setToggleModelVisible(true);
  //  };

  //  const handleToggleCancel = () => {
  //    setToggleModelVisible(false);
  //  };
  // -------------------------

  useEffect(() => {
    if(topUpStatusData?.topup_active){
      setIsAutoCredit(true)
      setAutoCreditAmount(topUpStatusData.topup_amount)
    }else{
      setIsAutoCredit(false)
    }
  },[topUpStatusData])

  const handleTopUpStatus = (data) => {
    setAutoTopupStatus(data)
      .unwrap()
      .then((response) => {
        if (data.status) {
          setShowAutoCreditErr(false);
          setAutoCreditAmount(data.amount)
          setIsAutoCredit(true); //make toggle button active
          toast.success("Set Auto Credit Top-Ups Successfully!");
        } else {
          setIsAutoCredit(false); //make toggle button deactivated
          setAutoCreditAmount(null)
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
    updateAutoTopupStatus({ amount: amount })
      .unwrap()
      .then((response) => {
        setShowAutoCreditErr(false);
        setIsAutoCredit(true)
        setAutoCreditAmount(amount)
        toast.success("Set Auto Credit Top-Ups Successfully!");
      })
      .catch((error) => {
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
        toast.success("Plan Purchased Successfully!");
        setisLoading({ plan_id: null });
        navigateToBillingPage();
      })
      .catch((error) => {
        setisLoading({ plan_id: null });
        if (error?.data?.message) {
          toast.error(error?.data?.message);
        }
      });
  };
  const IsPlanPurchased = (plan) => {
    const Plan = InvoiceHistory?.data?.find(
      (current_plan) => current_plan?.plan_id === plan?.id
    );

    if (Plan) {
      return true;
    }
    return false;
  };

  const handleSeleteAutoCreditAmount = (amount) => {
    if (autoCreditAmount) {
    } else {
      setAutoCreditAmount(amount);
    }
  };

  return (
    <div className="max-w-[1150px] w-full mx-auto px-6  flex flex-col lg:justify-normal min-[1800px]:justify-center pb-5 lg:mt-[10px]">
      <CancelSubscriptionModal
        isOpenCancelSubsModal={isOpenCancelSubsModal}
        setisOpenCancelSubsModal={(v) => setisOpenCancelSubsModal(v)}
        setIsConfirm={setIsConfirm}
        isConfirm={isConfirm}
      />

      <ToggleCancelModel
        isModalVisible={isModalVisible}
        setIsModalVisible={(e) => setIsModalVisible(e)}
        handleCancel={handleCancel}
        handleToggleOn={handleToggleOn}
        handleConfirmCancel={handleConfirmCancel}
      />

      <div className="pt-8">
        <h2 className="text-[36px] text-white font-normal helvetica-font mb-5">
          Upgrade Your Togl Account
        </h2>
        <div className="2xl:mb-15 xl:mb-8 flex items-center gap-2">
          <Switch
            // checked={isAutoCredit}
            value={isAnnualBilling}
            onChange={(e) => setIsAnnualBilling(e)}
            size="sm"
            style={{ border: !isAnnualBilling ? "1px solid white" : "none" }}
          />

          <div className="text-white text-[14px]">Annual Billing On</div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-8">
        {Plans?.map((plan, key) => (
          <div
            key={key}
            className='className="max-w-[385px] w-full shadow-[-3px_3px_8px_0px_#0000001A]  group cursor-pointer transition-all mb-5 relative'
          >
            {plan?.plan_name === "Ultra" && (
              <div className="absolute top-[-40px] flex gap-[5px] items-center">
                <StarIcon className="text-white" />
                <p className="text-white helvetica-font font-bold text-[14px]">
                  Recommended
                </p>
              </div>
            )}
            <Card className="planning-card rounded-3xl h-[547px]">
              <CardHeader
                className={`${
                  IsPlanPurchased(
                    PlatformPlans?.find((p) => p.plan_name === plan?.plan_name)
                  )
                    ? "bg-[#5E91FF]"
                    : "bg-[#393838]"
                } group-hover:bg-[#5E91FF] items-center group-hover:text-white group-hover:font-medium group-hover:text-sm text-xl font-medium justify-start flex 2xl:gap-[16px] xl:gap-[10px] plan-title h-16`}
              >
                <div className={`${plan?.limited_time_only ? "h-full" : ""} `}>
                  <TagIcon
                    className={`${
                      IsPlanPurchased(
                        PlatformPlans?.find(
                          (p) => p.plan_name === plan?.plan_name
                        )
                      )
                        ? "text-white"
                        : "text-[#A4A4A4]"
                    } group-hover:text-white mt-1`}
                  />
                </div>
                <div className="p-1">
                  <p
                    className={`helvetica-font text-sm group-hover:text-white group-hover:text-sm ${
                      plan?.limited_time_only
                        ? "font-bold text-beige"
                        : "font-normal text-[#A4A4A4]"
                    }`}
                  >
                    {plan?.title_text ?? "-"}
                  </p>
                  {plan?.limited_time_only && (
                    <p className="text-sm font-normal text-white">
                      *Limited time only
                    </p>
                  )}
                </div>
              </CardHeader>
              <CardBody className="px-7 py-2">
                <div className="flex justify-between pt-2 pb-7">
                  <h1
                    className={`2xl:text-[40px] xl:text-[27px] text-white helvetica-font ${
                      plan?.limited_time_only ? "font-medium" : "font-light"
                    }`}
                  >
                    {plan?.plan_name ?? "-"}
                  </h1>
                  <div className="flex flex-col justify-end items-end">
                    {plan?.plan_name !== "Enterprise" ? (
                      <p className="2xl:text-[34px] xl:text-[27px] text-white helvetica-font font-light">
                        $
                        {PlatformPlans?.find(
                          (p) => p.plan_name === plan?.plan_name
                        )?.monthly_price ?? 0}
                        /mo
                      </p>
                    ) : (
                      <></>
                    )}
                    {plan?.plan_name === "Ultra" && isAnnualBilling ? (
                      <span className="text-white font-helvetica font-normal text-xs not-italic">
                        $
                        {PlatformPlans?.find(
                          (p) => p.plan_name === plan?.plan_name
                        )?.yearly_price ?? 0}
                        /mo
                      </span>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <p className="text-[16px] text-white helvetica-font font-normal pb-[34px]">
                  {PlatformPlans?.find((p) => p?.plan_name === plan?.plan_name)
                    ?.plan_description ?? "-"}
                </p>
                <ul className="2xl:ml-[46px] xl:ml-8">
                  {plan?.bullet_points?.map((feature, index) => (
                    <li
                      key={index}
                      className="list-disc list-item ps-0 pb-0 helvetica-font text-[15px] font-normal mb-2"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardBody>
              <CardFooter className="pe-5 pb-5">
                {IsPlanPurchased(
                  PlatformPlans?.find((p) => p.plan_name === plan?.plan_name)
                ) ? (
                  <Button
                    className={`bg-transparent rounded-2xl w-full 2xl:text-[18px] xl:text-base font-bold helvetica-font bg-[#E54637] text-black group-hover:disabled:bg-[#3A3A3A] group-hover:disabled:text-[#959595] disabled:bg-[#3A3A3A] disabled:text-[#959595] tracking-widest`}
                    onClick={() =>
                      openCancelSubsModal(
                        PlatformPlans?.find(
                          (p) => p.plan_name === plan?.plan_name
                        )
                      )
                    }
                  >
                    {"Cancel"}
                  </Button>
                ) : (
                  <Button
                    className={`bg-transparent rounded-2xl w-full 2xl:text-[18px] xl:text-base font-bold helvetica-font ${
                      plan?.plan_name === "Free" ? "" : "bg-[#E4E4E4]"
                    } text-black group-hover:disabled:bg-[#3A3A3A] group-hover:disabled:text-[#959595] disabled:bg-[#3A3A3A] disabled:text-[#959595] tracking-widest`}
                    disabled={
                      plan?.plan_name === "Free" ||
                      isLoading?.plan_id ===
                        PlatformPlans?.find(
                          (p) => p.plan_name === plan?.plan_name
                        )?.id
                    }
                    onClick={() =>
                      subscriptionPlans(
                        PlatformPlans?.find(
                          (p) => p.plan_name === plan?.plan_name
                        )
                      )
                    }
                  >
                    {isLoading?.plan_id ===
                    PlatformPlans?.find((p) => p.plan_name === plan?.plan_name)
                      ?.id ? (
                      <Spinner size="sm" />
                    ) : (
                      plan?.button_text
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
      <div className="pb-8 mt-4">
        <div
          style={{
            background:
              "linear-gradient(155.14deg, #242424 -2.13%, #1B1B1B 136.58%)",
          }}
          className="px-6 rounded-[24px] mb-5 py-3"
        >
          {isQueryLoading ? (
            ""
          ) : isAutoCredit ? (
            <div className="text-[green] text-end mt-3 ml-5 ">Active</div>
          ) : (
            <div className="text-[#FF3C3C] text-end mt-3 ml-5 ">Not Active</div>
          )}

          <div className="mt-[-25px] flex flex-wrap justify-center md:justify-center items-center">
            <div>
              <div className="flex items-center gap-4">
                <h2 className="text-[40px] text-white font-[500] helvetica-font">
                  Auto Credit Top-Ups
                </h2>
                <div className="flex gap-2 ">
                  <Switch
                    // checked={isAutoCredit}
                    value={isAutoCredit}
                    onChange={(e) => handleToggleOn(e)}
                    size="sm"
                  />
                </div>
              </div>
              <div>
                <p className="text-[16px] text-white helvetica-font font-normal pb-[20px] mt-6">
                  Some tools charge per individual use - keep your workflow
                  <br />
                  uninterrupted with automatic credit top-ups.
                </p>
              </div>
            </div>
            <div className="text-white w-[100%] md:w-[50%] flex justify-center items-center flex-col">
              <div>When credits drop below $1.00 add:</div>
              <div className="mt-3 flex justify-around gap-3">
                <div
                  className={` ${
                    autoCreditAmount === 3
                      ? "bg-[#7A7A7A] border-1"
                      : "bg-[#3A3A3A]"
                  } hover:bg-[#7A7A7A] cursor-pointer  w-[64.54px] h-[43px] text-[21.76px] flex justify-center items-center rounded-[15px]`}
                  onClick={() => updateTopUpStatus(3)}
                >
                  $3
                </div>
                <div
                  className={` ${
                    autoCreditAmount === 5
                      ? "bg-[#7A7A7A] border-1"
                      : "bg-[#3A3A3A]"
                  } hover:bg-[#7A7A7A] cursor-pointer  w-[64.54px] h-[43px] text-[21.76px] flex justify-center items-center rounded-[15px]`}
                  onClick={() => updateTopUpStatus(5)}
                >
                  $5
                </div>
                <div
                  className={` ${
                    autoCreditAmount === 10
                      ? "bg-[#7A7A7A] border-1"
                      : "bg-[#3A3A3A]"
                  } hover:bg-[#7A7A7A] cursor-pointer  w-[64.54px] h-[43px] text-[21.76px] flex justify-center items-center rounded-[15px]`}
                  onClick={() => updateTopUpStatus(10)}
                >
                  $10
                </div>
              </div>
              {showAutoCreditErr && !autoCreditAmount && (
                <div className="text-[red] text-base mt-2">
                  Select Auto Credit Amount
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuySubscription;
