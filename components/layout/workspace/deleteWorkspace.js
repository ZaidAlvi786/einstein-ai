import { useState } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useFormik } from "formik";
import DeleteIcon from "@/app/assets/svg/delete.svg";
import { useDeleteWorkspaceMutation } from "@/app/lib/features/workspace/workspaceApi";
import toast from "react-hot-toast";
import ToastService from "@/components/Toaster/toastService";

const DeleteWorkspaceConfirmationModal = ({
  deleteWorkspace,
  setDeleteWorkspace,
  fetchWorkspace,
  setChatStatus,
  workspaces,
  updateCurrentWorkspace
}) => {
  const [DeleteWorkspace] = useDeleteWorkspaceMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: { name: "" },
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);

      DeleteWorkspace(deleteWorkspace?.workspace_id)
        .unwrap()
        .then((response) => {
          if (response?.status === 200) {            
            setDeleteWorkspace({ open: false, workspace_id: "" });
            setChatStatus(false);
            updateCurrentWorkspace(null, workspaces[0]) // to show the Personal workspace chats on active chat window
            resetForm();
            router.push("/");
            
            if (fetchWorkspace) {
              fetchWorkspace();
            }
            toast.success(response?.message);
          } else {
            toast.error(response?.message);
          }
        })
        .catch((error) => {
          if (error?.data?.message) {
            toast.error(error?.data?.message);
          }
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    },
  });

  const HandleModalClose = () => {
    if (!isSubmitting) {
      setDeleteWorkspace({ open: false, workspace_id: "" });
      formik.resetForm();
    }
  };

  return (
    <>
      <Modal
        key="delete-workspace-modal"
        size={"sm"}
        isOpen={deleteWorkspace?.open}
        hideCloseButton
        onClose={() => HandleModalClose()}
        onOpenChange={() => HandleModalClose()}
        classNames={{
          header: "2xl:py-[22px] 2xl:px-[65px] xl:py-[22px] xl:px-[30px]",
          footer: "p-0 my-[25px]",
        }}
      >
        <ModalContent>
          <ModalHeader className="text-white helvetica-font font-normal text-center">{`Are you sure you want to delete this workspace?`}</ModalHeader>
          <ModalFooter className="mx-auto flex mt-0">
            <Button
              className="text-base rounded-[12px] font-medium bg-[#0A84FF] text-white h-auto py-1.5 px-5 gap-1 min-w-[125px]"
              color="primary"
              disabled={isSubmitting}
              onPress={() => HandleModalClose()}
            >
              {"Cancel"}
            </Button>
            <Button
              className="text-base rounded-[12px] font-medium bg-[#313131] text-[#E54637] h-auto py-1.5 px-5 gap-1 min-w-[125px]"
              onPress={formik.handleSubmit}
              isLoading={isSubmitting}
              startContent={isSubmitting ? <></> : <DeleteIcon />}
            >
              {isSubmitting ? "Deleting" : "Delete"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ToastService/>
    </>
  );
};

export default DeleteWorkspaceConfirmationModal;
