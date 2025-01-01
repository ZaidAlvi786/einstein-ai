"use client";
import {
  Button,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import moment from "moment";
import ActionIcon from "@/app/assets/svg/action-icon.svg"; // Assuming this is your custom SVG icon
import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "antd";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormik } from "formik";
import { useCancelToolSubscriptionMutation } from "@/app/lib/features/chat/chatApi";
import { useCallback } from "react";
import toast from "react-hot-toast";

const CancelSubscriptionModal = ({
  setIsModalVisible,
  isModalVisible,
  handleCancel,
  setPlanDetails,
  planDetails,
  cancelSubscription,
  setCancelSubscription,
}) => {
  const tool_id = planDetails?.tool_id;
  const [CancelToolSubscription] = useCancelToolSubscriptionMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isViewDetails, setIsViewDetails] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const formik = useFormik({
    initialValues: { tool_id },
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting((pre) => ({ ...pre, open: true, action: "remove" }));

      const data = { tool_id: tool_id };
      CancelToolSubscription(data)
        .unwrap()
        .then((response) => {
          setCancelSubscription(true);
          setIsModalVisible(false);
          toast.success(response?.message);
        })
        .catch((error) => {
          console.log("###_error_### ", error);
          toast.error(
            (error?.data?.detail ?? error?.message) || "Something went wrong"
          );
        })
        .finally(() => {
          setIsModalVisible(false);
          setCancelSubscription(true);
          setIsSubmitting({ open: false, action: "", subscription_mode: "" });
          HandleModalClose();
        });
    },
  });
  const HandleModalClose = () => {
    if (!isSubmitting?.open) {
      formik.resetForm();
    }
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
    setIsViewDetails(true);
    router.push(
      "/marketplace/tools-details" +
        "?" +
        createMultipleQueryString({ tool_id })
    );
  };
  return (
    <>
      <Modal
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
        className="custom-modal"
        width={300} // Adjust width to match the design
        bodyStyle={{
          padding: "20px",
          textAlign: "center",
          backgroundColor: "#1F1F1F",
          borderRadius: "10px",
        }}
        closeIcon={<span style={{ color: "white" }}>X</span>}
      >
        <div className="text-center">
          <p className="text-white font-bold text-sm">
            You are subscribed to {planDetails?.tool_name}
          </p>
          <div className="flex justify-center items-center gap-2 my-3">
            {/* <Image
              alt="gemini icon"
              width={40}
              height={40}
              src={"/models/gemini.png"}
            /> */}
            <p className="text-white text-sm font-bold">
              ${planDetails?.price}/{planDetails?.recurrence}
            </p>
          </div>
          <p className="text-white text-sm mb-6 font-normal">
            Do you want to cancel this subscription?
          </p>
          <div className="flex flex-col gap-2">
            <Button
              className="bg-[#414141] hover:bg-[#E54637] hover:text-white text-[#E54637] font-normal rounded-md h-[36px] text-sm"
              block
              disabled={isSubmitting?.open || isViewDetails}
              onPress={formik.handleSubmit}
              isLoading={isSubmitting?.open}
            >
              Cancel Subscription
            </Button>
            <Button
              className="bg-[#414141]  text-white font-normal rounded-md h-[36px] text-sm"
              block
              isLoading={isViewDetails}
              disabled={isSubmitting?.open || isViewDetails}
              onPress={() => navigateToolDetailsPage(planDetails?.tool_id)}
            >
              View Details
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

const InvoiceHistory = {
  data: [
    {
      id: 1,
      invoice_id: "111",
      created_at: "2024-06-01",
      title: "Togl Pro",
      type: "Monthly",
      cost: "$9/month",
      btnType: "manage",
      expires: false,
    },
    {
      id: 2,
      invoice_id: "111",
      created_at: "2024-06-01",
      title: "Single Use Credit Plan",
      type: "Monthly",
      cost: "$21/month",
      btnType: "cancel",
      expires: "9/10/25", // Adding the expiry date for one of the items
    },
    {
      id: 3,
      invoice_id: "111",
      created_at: "2024-06-01",
      title: "Suno",
      type: "Yearly",
      cost: "$32/year",
      btnType: "expire",
      expires: false,
    },
  ],
};

const SubscriptionTable = ({
  navigateToBuySubscription,
  getUserSubscribedPlan,
  subscriptionPlans,
  isLoading,
  isSubscribedplanError,
  cancelSubscription,
  setCancelSubscription,
}) => {
  console.log("getUserSubscribedPlan: ", getUserSubscribedPlan);
  const currentDate = moment();
  const firstDayOfNextMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1, // Add 1 to the current month
    1
  ).toISOString();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [totalInvoice, setTotalInvoice] = useState("");
  const [planDetails, setPlanDetails] = useState({});
  // useEffect(() => {
  //   const sum = getUserSubscribedPlan?.data?.reduce(
  //     (acc, item) => acc + item?.price,
  //     0
  //   );
  //   setTotalInvoice(sum);
  // }, [getUserSubscribedPlan]);

  useEffect(() => {
    const sum = getUserSubscribedPlan?.data?.reduce(
      (acc, item) =>
        acc + item.recurrence === "yearly"
          ? getDaysDifference(item.created_at) <= 0
            ? item.price
            : 0
          : item.price, // add in case of monthly
      0
    );
    setTotalInvoice(sum);
  }, [getUserSubscribedPlan]);

  const showModal = (plan) => {
    setPlanDetails(plan);
    setCancelSubscription(false);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setPlanDetails(null);
  };

  useEffect(() => {}, [cancelSubscription]);

  function getDaysDifference(created_at) {
    const createdDate = new Date(created_at);
    const currentDate = new Date();

    // Calculate the difference in milliseconds
    const diffInMilliseconds = currentDate - createdDate;

    // Convert milliseconds to days
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    return diffInDays;
  }

  // const createdAt = "2024-12-06T11:59:14.883000";
  // console.log("getDaysDifference", getDaysDifference(createdAt));

  const classNames = useMemo(
    () => ({
      table: [
        "mb-8",
        "border-spacing-y-0",
        "border-separate",
        "rounded-[24px]",
        "py-5",
        "pl-3",
      ],
      th: [
        "bg-transparent",
        "text-white",
        "helvetica-font",
        "font-medium",
        "text-[10px]",
        "leading-[14px]",
        "[&>tr:last-child]:!mt-0",
        "[&>tr:last-child]:!h-0",
      ],
      thead: "[&>tr:last-child]:hidden",
    }),
    []
  );

  const renderActionButton = (btnType, plan) => {
    // return (
    //   <Button
    //     // onClick={navigateToBuySubscription}
    //     onClick={() => subscriptionPlans(plan)}
    //     className="w-[54px] h-[24px] min-w-unit-0 text-white bg-transparent text-[10px] font-bold rounded border-1 border-[#B7B7B7] hover:bg-white hover:text-black"
    //   >
    //     Manage
    //   </Button>
    // );
    switch (btnType) {
      case "manage":
        return (
          <Button
            onClick={navigateToBuySubscription}
            className="w-[54px] h-[24px] min-w-unit-0 text-white bg-transparent text-[10px] font-bold rounded border-1 border-[#B7B7B7] hover:bg-white hover:text-black"
          >
            Manage
          </Button>
        );
      case "cancel":
        return (
          <>
            <Button
              onClick={() => showModal(plan)}
              className="w-[54px] h-[24px] min-w-unit-0 text-white bg-transparent text-[10px] font-bold rounded border-1 border-[#B7B7B7] hover:bg-white hover:text-black"
            >
              Cancel
            </Button>
          </>
        );
      case "expire":
        return (
          <span className="text-[#FF7474] text-[10px]">Expires 9/10/25</span>
        );
      default:
        return null;
    }
  };

  return isLoading ? (
    <Skeleton className="w-full rounded-3xl mb-4">
      <div className="h-[240px] w-full "></div>
    </Skeleton>
  ) : (
    <div>
      <Table
        removeWrapper
        classNames={classNames}
        className="helvetica-font mt-8"
        style={{ borderRadius: "24px", background: "#1B1B1B" }}
      >
        <TableHeader>
          <TableColumn className="text-[16px] font-bold mb-5">
            Subscriptions
          </TableColumn>
          <TableColumn className="text-[16px] font-bold mb-5">Type</TableColumn>
          <TableColumn className="text-[16px] font-bold mb-5">Cost</TableColumn>
          <TableColumn className="text-[16px] font-bold" mb-5>
            Manage
          </TableColumn>
        </TableHeader>
        {!isSubscribedplanError && getUserSubscribedPlan?.data?.length > 0 ? (
          <TableBody>
            {getUserSubscribedPlan?.data?.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell
                  className={`font-normal text-[14px] leading-[14px] text-white ${
                    index === 0 ? "pt-4" : ""
                  } `}
                >
                  {item?.tool_name ? item?.tool_name : item?.details?.plan_name}
                </TableCell>
                <TableCell
                  className={`font-normal text-[14px] leading-[14px] text-white capitalize ${
                    index === 0 ? "pt-4" : ""
                  }`}
                >
                  {item?.recurrence}
                </TableCell>
                <TableCell
                  className={`font-normal text-[14px] leading-[14px] text-white ${
                    index === 0 ? "pt-4" : ""
                  }`}
                >
                  {item.price > 0
                    ? `$${item?.price}/${item?.recurrence.replace('ly','')}`
                    : "Free"}
                </TableCell>
                <TableCell
                  className={`font-normal text-[14px] leading-[14px] text-white ${
                    index === 0 ? "pt-4" : ""
                  }`}
                >
                  {renderActionButton(item.plan_id ? "manage" : "cancel", item)}
                </TableCell>
                {/* <TableCell className="">
                  {renderActionButton(item?.btnType, item?.expires)}
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody emptyContent={"No Tool subscribed"}>{[]}</TableBody>
        )}
      </Table>
      {totalInvoice > 0 && (
        <div
          className="bg-[#1B1B1B] text-white h-[66px] px-8 grid grid-cols-12 items-center justify-between"
          style={{ borderRadius: "24px" }}
        >
          <div className="col-span-7 font-bold text-base">
            Next Invoice Total
          </div>
          <div className="col-span-5 flex items-center justify-between">
            <div className="flex gap-5 items-center mr-10">
              <div>
                <div className="font-bold text-base">
                  {/* {currentDate.add(1, "months").format("YYYY-MM-DD")} */}
                  {moment(firstDayOfNextMonth).format("YYYY-MM-DD")}
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                width: "130px",
                justifyContent: "center",
                fontWeight: "700",
              }}
              className="text-base"
            >
              ${totalInvoice}
            </div>
          </div>
        </div>
      )}
      <CancelSubscriptionModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        setPlanDetails={setPlanDetails}
        planDetails={planDetails}
        handleCancel={handleCancel}
        cancelSubscription={cancelSubscription}
        setCancelSubscription={setCancelSubscription}
      />
    </div>
  );
};

export default SubscriptionTable;
