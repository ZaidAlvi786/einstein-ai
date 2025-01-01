import { useState } from "react";
import {
    Avatar,
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
import RenewConfirmationModal from "./renewDialog";
import toast from "react-hot-toast";
import ToastService from "../Toaster/toastService";

const DeletePluginMenuConfirmationModal = ({
    deletePluginMenu,
    setDeletePluginMenu,
    pluginMenu_info,
    getSubscribedPluginMenuData,
    setUpdateMenu,
    setDeleteMenu,
    setRenewPluginMenu
}) => {
    const [CancelToolSubscription] = useCancelToolSubscriptionMutation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const tool_id = deletePluginMenu?.tool_id
    const [renewModel, setRenewModel] = useState({ open: false, tool_id: "", modelInfo: deletePluginMenu?.modelInfo });

    const formik = useFormik({
        initialValues: { tool_id },
        onSubmit: async (values, { resetForm }) => {
            setIsSubmitting((pre) => ({ ...pre, open: true, action: "remove" }));

            const data = { tool_id: tool_id };
            CancelToolSubscription(data).unwrap()
                .then((response) => {
                    const menuItems = localStorage.getItem('menuItemsOrder') ? JSON.parse(localStorage.getItem('menuItemsOrder')) : null;
                    const pinnedItems = localStorage.getItem('pinnedItemsOrder') ? JSON.parse(localStorage.getItem('pinnedItemsOrder')) : null;
                    if (menuItems?.filter(item => item.id == tool_id).length && menuItems && menuItems.length) {
                        const updatedMenuItems = menuItems.filter(item => item.id !== tool_id);
                        localStorage.setItem('menuItemsOrder', JSON.stringify(updatedMenuItems));
                        setDeleteMenu({ mainMenu: true, pinnedMenu: false })
                    }
                    if (pinnedItems?.filter(item => item.id == tool_id).length && pinnedItems && pinnedItems.length) {
                        const updatedPinnedItems = pinnedItems.filter(item => item.id !== tool_id);
                        localStorage.setItem('pinnedItemsOrder', JSON.stringify(updatedPinnedItems));
                        setDeleteMenu({ mainMenu: false, pinnedMenu: true })
                    }
                    resetForm();
                    if (!deletePluginMenu?.modelInfo?.price?.annual && !deletePluginMenu?.modelInfo?.price?.monthly && !deletePluginMenu?.modelInfo?.price?.per_use) {
                        return;
                    }
                    else {
                        setRenewPluginMenu({ open: true, tool_id: tool_id, modelInfo: deletePluginMenu?.modelInfo });
                    }
                    // toast.success(response?.message);
                })
                .catch((error) => {
                    console.log("###_error_### ", error);
                    toast.error((error?.data?.detail ?? error?.message) || "Something went wrong");
                })
                .finally(() => {
                    setIsSubmitting({ open: false, action: "", subscription_mode: "" });
                    HandleModalClose();
                });
        },
    });

    const HandleModalClose = () => {
        if (!isSubmitting?.open) {
            setDeletePluginMenu({ open: false, tool_id: "" });
            formik.resetForm();
        }
    };

    return (
        <>
            <Modal
                key="delete-workspace-modal"
                // size={"xl"}
                isOpen={deletePluginMenu?.open}
                hideCloseButton
                style={{
                    width: '442px',
                    height: '351px',
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
                            <Avatar
                                src={deletePluginMenu?.modelInfo?.iconSrc}
                                alt={deletePluginMenu?.modelInfo?.modelName}
                                radius="sm"
                                className="2xl:h-[36px] 2xl:w-[36px] xl:h-[36px] xl:w-[36px] h-[36px] w-[36px] bg-transparent"
                            />
                        </div>
                        <div className="mt-6">
                            {"Confirm Cancellation"}
                        </div>

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
                            {"Not Now"}
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>

        </>
    );
};

export default DeletePluginMenuConfirmationModal;
