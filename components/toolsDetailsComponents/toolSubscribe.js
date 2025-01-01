import { useAuth } from "@/app/authContext/auth";
import {
  useCancelToolSubscriptionMutation,
  useGetSubscribedToolsQuery,
  useSubscribeToolMutation,
  useUnsubscribeToolMutation,
} from "@/app/lib/features/chat/chatApi";
import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import CancelSubscriptionModal from "@/components/billing/CancelSubscriptionModal";
import { useFormik } from "formik";
import Link from "next/link";
import React, { useState } from "react";

import BillingCanc from "@/app/assets/svg/billingCanc.svg";
import Image from "next/image";
import toast from "react-hot-toast";

const classNames = {
  //   header: ["2xl:py-8", "2xl:px-[65px]", "xl:py-[22px]", "xl:px-[30px]"],
  header: ["2xl:py-5", "2xl:px-[65px]", "xl:py-[10px]", "xl:px-[30px]"],
  footer: ["p-0", "my-[25px] py-0"],
};

const SubscribeModal = ({
  isOpenSubsribeModal,
  setIsOpenSubsribeModal,
  getToolDetailsGuestData,
  tool_info,
}) => {
  const [showSubscriptionDetails, setshowSubscriptionDetails] = useState(false);
  const tool_id = tool_info?.id;
  const [SubscribeTool] = useSubscribeToolMutation();
  const tool_category = tool_info?.category;
  const tool_monetization = tool_info?.tool_monetization;
  const tool_per_use_price = tool_info?.price?.per_use;
  const tool_monthly_price = tool_info?.price?.monthly;
  const tool_annual_price = tool_info?.price?.annual;

  const [isSubmitting, setSubmitting] = useState({
    open: false,
    action: "",
    subscription_mode: "",
  });
  const [openAddGptPluginModal, setOpenAddGptPluginModal] = useState(false);
  const [initialValues, setInitialValues] = useState({
    tool_id: tool_id,
    subscription_mode: "",
  });

  const addToolsFormik = useFormik({
    initialValues,
    onSubmit: async (values, { resetForm }) => {
      setSubmitting((pre) => ({ ...pre, open: true, action: "add" }));
      const data = {
        ...values,
        subscription_mode: isSubmitting?.subscription_mode,
      };
      SubscribeTool(data)
        .unwrap()
        .then((response) => {
          toast.success(response.message);
          resetForm();
          window.location.reload();
        })
        .catch((error) => {
          toast.error(
            (error?.data?.message ?? error?.message) || "Something went wrong"
          );
        })
        .finally(() => {
          setSubmitting({ open: false, action: "", subscription_mode: "" });
          setIsOpenSubsribeModal(false);
          HandleModalClose();
        });
    },
  });

  const HandleModalClose = () => {
    if (!isSubmitting.open) {
      setOpenAddGptPluginModal(false);
      addToolsFormik.resetForm();
      // removeToolsFormik.resetForm();
    }
  };

  const HandleSubcribePlugin = (mode) => {
    setInitialValues({
      tool_id: tool_id,
      subscription_mode: mode,
    });
    setSubmitting((pre) => ({ ...pre, subscription_mode: mode }));
    addToolsFormik.handleSubmit();
  };

  return (
    <Modal
      isOpen={isOpenSubsribeModal}
      onOpenChange={setIsOpenSubsribeModal}
      //   setIsConfirm={setIsConfirm}
      size={"md"}
      classNames={classNames}
      className="bg-[#171717]"
    >
      <ModalContent onClick={(e) => e.stopPropagation()}>
        {(onClose) => (
          <>
            <div className="text-center">
              <ModalHeader className="text-white helvetica-font  flex justify-center p-3">
                <div className="flex flex-col p-0">
                  <div className="flex justify-center p-4">
                    <Avatar
                      src={tool_info?.logo}
                      showFallback={true}
                      alt="tools-logo"
                      className="w-[64px] h-[64px] rounded-[14px]"
                      fallback={
                        <Image
                          src={"/svg/user.svg"}
                          alt="profile-pic"
                          width={14}
                          height={17}
                        />
                      }
                    />
                  </div>
                  <div classNames="font-normal">Buy Subscription</div>
                </div>
              </ModalHeader>
            </div>
            <ModalBody className="px-[30px] py-[0px] text-white text-center">
              <div className="max-w-xl mx-auto">
                Purchase a subscription to <b>{tool_info?.name}</b>. Cancel
                anytime.
              </div>
            </ModalBody>

            <ModalFooter className="w-[300px] mx-auto flex flex-col ">
              <div className="flex flex-col gap-2">
                {tool_monthly_price ? (
                  <Button
                    className="bg-[#343539] hover:bg-[#535353] rounded-[15px] hover:text-white font-normal h-[36px] text-sm "
                    color="primary"
                    onClick={() => HandleSubcribePlugin("monthly")}
                  >
                    Subscribe ${tool_monthly_price}/Monthly
                  </Button>
                ) : (
                  ""
                )}
                {tool_annual_price ? (
                  <Button
                    className="bg-[#343539] hover:bg-[#535353] rounded-[15px] hover:text-white font-normal h-[36px] text-sm "
                    color="primary"
                    onClick={() => HandleSubcribePlugin("annual")}
                  >
                    Subscribe ${tool_annual_price}/Annual
                  </Button>
                ) : (
                  ""
                )}

                {tool_per_use_price ? (
                  <Button
                    className="bg-[#0A84FF] rounded-[15px]  font-normal h-[36px] text-sm "
                    onClick={() => HandleSubcribePlugin("per_use")}
                  >
                    Subscribe ${tool_per_use_price}/Per use{" "}
                  </Button>
                ) : (
                  ""
                )}
              </div>
              <div className="text-white">
                <div>
                  {(tool_info?.query_limit?.monthly > 0 ||
                    tool_info?.query_limit?.annual > 0) && (
                    <div className="flex items-center ">
                      Whats included?{" "}
                      {showSubscriptionDetails ? (
                        <Button
                          className="!p-2 !w-fit !h-fit !min-w-1 !bg-transparent !hover:bg-transparent  !active:bg-transparent !focus:bg-transparent !focus:outline-none "
                          onClick={() => setshowSubscriptionDetails(false)}
                        >
                          <Image
                            className="mt-1"
                            onClick={() => setshowSubscriptionDetails(false)}
                            src={"/svg/arrow_up.svg"}
                            alt="profile-pic"
                            width={14}
                            height={17}
                          />
                        </Button>
                      ) : (
                        <Button
                          className="!p-2 !w-fit !h-fit !min-w-1 !bg-transparent !hover:bg-transparent  !active:bg-transparent !focus:bg-transparent !focus:outline-none "
                          onClick={() => setshowSubscriptionDetails(true)}
                        >
                          <Image
                            className="mt-1"
                            onClick={() => setshowSubscriptionDetails(true)}
                            src={"/svg/arrow_down.svg"}
                            alt="profile-pic"
                            width={14}
                            height={17}
                          />
                        </Button>
                      )}
                    </div>
                  )}
                  <div
                    className={`list-disc ml-4 text-[14px] font-normal mt-2 
    transition-all !duration-5000 ease-in-out transform 
    ${
      showSubscriptionDetails
        ? "max-h-[100px] opacity-100"
        : "max-h-0 opacity-0"
    }
  `}
                    style={{ overflow: "hidden" }}
                  >
                    <ul className="list-disc ml-4">
                      {tool_info?.query_limit?.monthly > 0 && (
                        <li>
                          {tool_info?.query_limit?.monthly} queries per month
                          limit
                        </li>
                      )}
                      {tool_info?.query_limit?.annual > 0 && (
                        <li>
                          {tool_info?.query_limit?.annual} queries per year
                          limit
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const ToolSubscribe = ({
  tool_id,
  tool_info,
  getToolDetailsGuestData,
  isPaymentMethodAdded,
  setOpenCardModal,
  bgColor = "transparent",
  textColor = "#fff",
  borderColor='#636363',
  setIsOpenSubsribeModal,
  isOpenSubsribeModal
}) => {
  const [UnsubscribeTool, isMutationLoading] = useUnsubscribeToolMutation();
  const [isOpenCancelSubsModal, setisOpenCancelSubsModal] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openCancelSubsModal = (plan) => {
    setIsConfirm(true);
  };

  const handleUnsubscribeTool = () => {    
    setIsLoading(true);
    try {
      UnsubscribeTool({ subscription_id: tool_info.subscription_id })
        .unwrap()
        .then((response) => {
          toast.success(response?.message);
          window.location.reload();
          const menuItems = JSON.parse(localStorage.getItem("menuItemsOrder") || "[]");
          const pinnedPlugins = JSON.parse(localStorage.getItem("pinnedItemsOrder") || "[]");

          const updatedMenuItems = menuItems.filter(
            (item) => item.subscription_id !== tool_info.subscription_id
          );
          const updatedPinnedPlugins = pinnedPlugins.filter(
            (item) => item.subscription_id !== tool_info.subscription_id
          );
      
          // Save updated lists back to localStorage
          localStorage.setItem("menuItemsOrder", JSON.stringify(updatedMenuItems));
          localStorage.setItem("pinnedItemsOrder", JSON.stringify(updatedPinnedPlugins));
        })
        .catch((error) => {
          toast.error(
            (error?.data?.detail ?? error?.message) || "Something went wrong"
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <>
      {!tool_info?.is_subscribed ? (
        <Button
          onClick={() => {
            if (isPaymentMethodAdded) {
              setIsOpenSubsribeModal(true);
            } else {
              setOpenCardModal((prev) => ({ ...prev, open: true }));
            }
          }}
          className={` text-[${textColor}] helvetica-font h-9 rounded-full bg-[${bgColor}] border border-[${borderColor}]
                    hover:bg-[#fff] hover:text-[#000] text-[16px] flex justify-center items-center`}
        >
          Subscribe
        </Button>
      ) : (
        // <div
        //   className={` text-white helvetica-font h-9 rounded-full bg-transparent border border-[#636363] px-3
        //         text-[16px] flex justify-center items-center select-none`}
        // >
        //   {isLoading ? "Unsubscribe" : "Unsubscribe" }

        // </div>
        <Button
          onClick={openCancelSubsModal}
          className={` text-[${textColor}] helvetica-font h-9 rounded-full bg-[${bgColor}] border border-[${borderColor}]
                    hover:bg-[#fff] hover:text-[#000] text-[16px] flex justify-center items-center`}
        >
          {/* {isLoading ? <Spinner size="sm" color="white" /> : "Unsubscribe" } */}
          Unsubscribe
        </Button>
      )}
      <CancelSubscriptionModal
        isOpenCancelSubsModal={isOpenCancelSubsModal}
        setisOpenCancelSubsModal={(v) => setisOpenCancelSubsModal(v)}
        setIsConfirm={setIsConfirm}
        isConfirm={isConfirm}
        handleCancelSubscription={handleUnsubscribeTool}
        isMutationLoading={isMutationLoading}
      />
      <SubscribeModal
        isOpenSubsribeModal={isOpenSubsribeModal}
        setIsOpenSubsribeModal={setIsOpenSubsribeModal}
        getToolDetailsGuestData={getToolDetailsGuestData}
        tool_info={tool_info}
      />
    </>
  );
};

export default ToolSubscribe;
