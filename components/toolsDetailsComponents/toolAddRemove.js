import { useAuth } from "@/app/authContext/auth";
import {
  useGetSubscribedToolsQuery,
  useSubscribeToolMutation,
  useSubscribeToolTrialMutation,
} from "@/app/lib/features/chat/chatApi";
import DeleteToolConfirmationModal from "@/app/profile/my-tools/deletetools";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useFormik } from "formik";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import ToastService from "../Toaster/toastService";

const ToolAddRemoveButton = ({
  tool_id,
  tool_info,
  className,
  navigateToolDetailsPage,
  refetchToolListOnHome,
}) => {
  const auth = useAuth();
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
  const [openTrialAddGptPluginModal, setOpenTrialAddGptPluginModal] =
    useState(false);
  const [SubscribeTool] = useSubscribeToolMutation();
  const [SubscribeTrialTool] = useSubscribeToolTrialMutation();
  const { data: getSubscribedToolsData } = useGetSubscribedToolsQuery(
    { tool_id, page_number: 1, per_page: 100 },
    { skip: !tool_id }
  );
  const isSubscribedTools = getSubscribedToolsData?.subscribed_tools?.find(
    (ele) => ele?.tool_id === tool_id
  );
  const [deleteTool, setDeleteTool] = useState({ open: false, tool_id: "" });

  const addToolsFormik = useFormik({
    initialValues: { tool_id: tool_id ?? "" },
    onSubmit: async (values, { resetForm }) => {
      setSubmitting((pre) => ({ ...pre, open: true, action: "add" }));

      const data = {
        ...values,
        ...(isSubmitting?.subscription_mode !== "free" && {
          recurrence: isSubmitting?.subscription_mode,
        }),
      };

      SubscribeTool(data)
        .unwrap()
        .then((response) => {
          resetForm();
          HandleModalClose();
          toast.success(response?.message);
          if (refetchToolListOnHome) {
            refetchToolListOnHome();
          }
        })
        .catch((error) => {
          toast.error(
            (error?.data?.message ?? error?.message) || "Something went wrong"
          );
        })
        .finally(() => {
          setSubmitting({ open: false, action: "", subscription_mode: "" });
        });
    },
  });

  const handleClick = () => {
    navigateToolDetailsPage(tool_id);
  };

  const HandleModalClose = () => {
    if (!isSubmitting.open) {
      setOpenAddGptPluginModal(false);
      addToolsFormik.resetForm();
    }
  };

  const HandleSubcribePlugin = (mode) => {
    setSubmitting((pre) => ({ ...pre, subscription_mode: mode }));
    addToolsFormik.handleSubmit();
  };

  // Trial Package
  const addTrialToolsFormik = useFormik({
    initialValues: { tool_id: tool_id ?? "" },
    onSubmit: async (values, { resetForm }) => {
      setSubmitting((pre) => ({ ...pre, open: true, action: "add" }));

      const data = { ...values };

      SubscribeTrialTool(data)
        .unwrap()
        .then((response) => {
          resetForm();
          HandleModalClose();
          // toast.success(response.message, {
          // });
          toast.success((t) => (
            <span
              onClick={() => {
                handleClick();
                toast.dismiss(t.id); // Optionally close the toast after the click
              }}
              style={{ cursor: "pointer" }}
            >
              {response?.message}
            </span>
          ));
        })
        .catch((error) => {
          toast.error((t) => (
            <span
              onClick={() => {
                handleClick();
                toast.dismiss(t.id); // Optionally close the toast after the click
              }}
              style={{ cursor: "pointer" }}
            >
              {error?.data?.message}
            </span>
          ));
        })
        .finally(() => {
          setSubmitting({ open: false, action: "", subscription_mode: "" });
          HandleTrialModalClose();
        });
    },
  });

  const HandleTrialModalClose = () => {
    if (!isSubmitting.open) {
      setOpenTrialAddGptPluginModal(false);
      addTrialToolsFormik.resetForm();
    }
  };

  const Handle_Trial_Open_Add_Gpt_Plugin_Modal = () => {
    setOpenTrialAddGptPluginModal(true);
  };
  const HandleTrialSubcribePlugin = (mode) => {
    setSubmitting((pre) => ({ ...pre, subscription_mode: mode }));
    addTrialToolsFormik.handleSubmit();
  };

  const OpenToolRemove = (action) => {
    if (action == "delete") {
      setDeleteTool({ open: true, tool_id: tool_id });
    }
  };

  return (
    <>
      {auth?.user?.email && auth?.user?.fullname ? (
        <>
          {isSubscribedTools ? (
            <Button
              className={
                className ??
                `text-base h-auto rounded-full font-helvetica font-bold py-1.5 px-5 bg-[#FFF] text-[#545454]`
              }
              onPress={() => OpenToolRemove("delete")}
            >
              Remove
            </Button>
          ) : (
            <Button
              className={`text-base h-auto rounded-full font-helvetica font-bold py-1.5 px-[18.12px] min-w-[64.754px] hover:!bg-[#0a5cff] bg-[#0A84FF] text-white`}
              onPress={Handle_Trial_Open_Add_Gpt_Plugin_Modal}
              isDisabled={isSubmitting.open}
            >
              {"Try Now"}
            </Button>
          )}
        </>
      ) : (
        <Button
          as={Link}
          className={`text-base h-auto rounded-full font-helvetica font-bold py-1.5 px-5 bg-[#0A84FF] text-white`}
          href="/signin"
        >
          {"Try Now"}
        </Button>
      )}

      <Modal
        key="add-gpt-plugin-modal"
        size={"md"}
        isOpen={openAddGptPluginModal}
        onClose={HandleModalClose}
        onOpenChange={HandleModalClose}
        classNames={{ base: "text-white" }}
        hideCloseButton
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 capitalize">{`Select ${
            tool_category ?? ""
          } Subscription Type`}</ModalHeader>
          <ModalBody>
            <div className="flex justify-center gap-3 items-center w-full mb-5">
              {tool_monetization === "free" && (
                <Button
                  className="text-white helvetica-font font-bold w-auto !h-[34px] rounded-lg border-[1px] bg-transparent hover:bg-[#fff] hover:text-[#000] text-[14px] flex justify-center items-center leading-normal"
                  onPress={() => HandleSubcribePlugin("free")}
                  isDisabled={isSubmitting.open}
                  isLoading={
                    isSubmitting.open &&
                    isSubmitting.action === "add" &&
                    isSubmitting.subscription_mode === "free"
                  }
                >
                  {"Free"}
                </Button>
              )}
              {tool_monetization === "subscription" &&
                tool_per_use_price > 0 && (
                  <Button
                    className="text-white helvetica-font font-bold w-auto !h-[34px] rounded-lg border-[1px] bg-transparent hover:bg-[#fff] hover:text-[#000] text-[14px] flex justify-center items-center leading-normal"
                    onPress={() => HandleSubcribePlugin("per_use")}
                    isDisabled={isSubmitting.open}
                    isLoading={
                      isSubmitting.open &&
                      isSubmitting.action === "add" &&
                      isSubmitting.subscription_mode === "per_use"
                    }
                  >
                    {"Per Use"}
                  </Button>
                )}
              {tool_monetization === "subscription" &&
                tool_monthly_price > 0 && (
                  <Button
                    className="text-white helvetica-font font-bold w-auto !h-[34px] rounded-lg border-[1px] bg-transparent hover:bg-[#fff] hover:text-[#000] text-[14px] flex justify-center items-center leading-normal"
                    onPress={() => HandleSubcribePlugin("monthly")}
                    isDisabled={isSubmitting.open}
                    isLoading={
                      isSubmitting.open &&
                      isSubmitting.action === "add" &&
                      isSubmitting.subscription_mode === "monthly"
                    }
                  >
                    {"Monthly"}
                  </Button>
                )}
              {tool_monetization === "subscription" &&
                tool_annual_price > 0 && (
                  <Button
                    className="text-white helvetica-font font-bold w-auto !h-[34px] rounded-lg border-[1px] bg-transparent hover:bg-[#fff] hover:text-[#000] text-[14px] flex justify-center items-center leading-normal"
                    onPress={() => HandleSubcribePlugin("annual")}
                    isDisabled={isSubmitting.open}
                    isLoading={
                      isSubmitting.open &&
                      isSubmitting.action === "add" &&
                      isSubmitting.subscription_mode === "annual"
                    }
                  >
                    {"Annual"}
                  </Button>
                )}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        key="add-gpt-plugin-modal"
        size={"md"}
        isOpen={openTrialAddGptPluginModal}
        onClose={HandleTrialModalClose}
        onOpenChange={HandleTrialModalClose}
        classNames={{ base: "text-white" }}
        hideCloseButton
      >
        <ModalContent>
          <ModalHeader className="text-white helvetica-font font-normal text-center flex flex-col content-around items-center">
            <div className="mt-6">{"Confirmation "}</div>
          </ModalHeader>
          <ModalBody className="text-white helvetica-font font-normal text-center">
            {`Please confirm your trial package`}
          </ModalBody>

          <ModalFooter className="mx-auto flex mt-0 flex-col content-around items-center">
            <span className="mb-4">
              {tool_info?.free_trial?.cost > 0
                ? `With Free Trial you will get $${tool_info?.free_trial?.cost} worth of queries.`
                : tool_info?.free_trial?.query > 0
                ? `With Free Trial you will get ${tool_info?.free_trial?.query} queries.`
                : ""}
            </span>
            <Button
              className="text-base rounded-[12px] font-medium bg-[#343539] text-white  h-[43px] py-1.5 px-5 gap-1 min-w-[319px] hover:bg-[#535353]"
              onPress={() => HandleTrialSubcribePlugin()}
              isDisabled={isSubmitting.open}
              isLoading={isSubmitting.open}
            >
              {"Confirm"}
            </Button>
            <Button
              className="text-base rounded-[12px] font-medium bg-[#343539] text-white h-[43px] py-1.5 px-5 gap-1 min-w-[319px] hover:bg-[#535353]"
              color="primary"
              onPress={() => HandleTrialModalClose()}
            >
              {"Not Now"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Delete Workspace Modal */}
      <DeleteToolConfirmationModal
        deleteTool={deleteTool}
        setDeleteTool={setDeleteTool}
        // fetchWorkspace={}
        tool_info={tool_info}
        getSubscribedToolsData={getSubscribedToolsData}
        refetchToolListOnHome={refetchToolListOnHome}
      />
      <ToastService />
    </>
  );
};

export default ToolAddRemoveButton;
