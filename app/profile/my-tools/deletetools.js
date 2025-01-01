"use client";

import { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useFormik } from "formik";
import DeleteIcon from "@/app/assets/svg/delete.svg";
import DeleteToolConfirmationIcon from "@/app/assets/svg/tool-delete-confirmation.svg";
import { useDeleteWorkspaceMutation } from "@/app/lib/features/workspace/workspaceApi";
import { useCancelToolSubscriptionMutation } from "@/app/lib/features/chat/chatApi";
import toast from "react-hot-toast";
import ToastService from "@/components/Toaster/toastService";

const DeleteToolConfirmationModal = ({
  deleteTool,
  setDeleteTool,
  tool_info,
  getSubscribedToolsData,
  refetchToolListOnHome,
}) => {
  const [CancelToolSubscription] = useCancelToolSubscriptionMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const tool_id = deleteTool?.tool_id;
  const formik = useFormik({
    initialValues: { tool_id },
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting((pre) => ({ ...pre, open: true, action: "remove" }));

      const data = { tool_id: tool_id };
      CancelToolSubscription(data)
        .unwrap()
        .then((response) => {
          resetForm();
          toast.success(response?.message);
          if (refetchToolListOnHome) {
            refetchToolListOnHome();
          }
          setTimeout(() => {
            window.location.reload();
          }, 500);
        })
        .catch((error) => {
          console.log("###_error_### ", error);
          toast.error(
            (error?.data?.detail ?? error?.message) || "Something went wrong",
            "Failure"
          );
        })
        .finally(() => {
          setIsSubmitting({ open: false, action: "", subscription_mode: "" });
          HandleModalClose();
        });
    },
  });

  const HandleModalClose = () => {
    if (!isSubmitting?.open) {
      setDeleteTool({ open: false, tool_id: "" });
      formik.resetForm();
    }
  };

  return (
    <>
      <Modal
        key="delete-workspace-modal"
        // size={"xl"}
        isOpen={deleteTool?.open}
        hideCloseButton
        style={{
          width: "442px",
          height: "351px",
        }}
        onClose={() => HandleModalClose()}
        onOpenChange={() => HandleModalClose()}
        classNames={{
          header: "2xl:py-[22px] 2xl:px-[65px] xl:py-[10px] xl:px-[30px]",
          footer: "p-0 my-[25px]",
        }}
      >
        <ModalContent>
          <ModalHeader className="text-white helvetica-font font-normal text-center flex flex-col content-around items-center">
            <div className="mt-2">
              <DeleteToolConfirmationIcon />
            </div>
            <div className="mt-6">{"Confirm Cancellation"}</div>
          </ModalHeader>
          <ModalBody className="text-white helvetica-font font-normal text-center">
            {`If you remove this tool your subscription will be canceld, your service will end immediately.`}
          </ModalBody>
          <ModalFooter className="mx-auto flex mt-0 flex-col content-around items-center">
            <Button
              className="text-base rounded-[12px] font-medium bg-[#343539] text-white  h-[43px] py-1.5 px-5 gap-1 min-w-[319px] hover:bg-[#535353]"
              onPress={formik.handleSubmit}
              isLoading={isSubmitting?.open}
            >
              {isSubmitting?.open ? "Confirm" : "Confirm"}
            </Button>
            <Button
              className="text-base rounded-[12px] font-medium bg-[#343539] text-white h-[43px] py-1.5 px-5 gap-1 min-w-[319px] hover:bg-[#535353]"
              color="primary"
              disabled={isSubmitting?.open}
              onPress={() => HandleModalClose()}
            >
              {"Cancel"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ToastService />
    </>
  );
};

export default DeleteToolConfirmationModal;
