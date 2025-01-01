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
import { usePutChangeChatStateMutation } from "@/app/lib/features/chat/chatApi";

const DeleteChatConfirmationModal = ({
    deleteChat,
    setDeleteChat,
    chat_info
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [changeChatStateMutation] = usePutChangeChatStateMutation();
    const initialValues = {
        state: deleteChat?.state,
        msgIndex: deleteChat?.msgIndex,
    }
    const formik = useFormik({
        initialValues,
        onSubmit: async (values, { resetForm }) => {
            setIsSubmitting((pre) => ({ ...pre, open: true, action: "remove" }));
            // console.log('=====>values', values);
            let payload = { ...initialValues }
            try {
                await changeChatStateMutation(payload).unwrap();
                toast.success("Chat Deleted Successfully.");
            } catch (error) {
                toast.error("An error occurred while updating the pin status.");
            } finally {

                HandleModalClose();
            }
        },
    });

    const HandleModalClose = () => {
        if (!isSubmitting?.open) {
            setIsSubmitting({ open: false, action: '' });
            setDeleteChat({ open: false, state: '', msgIndex: 0, isDeleted: true });
            setDeletePluginMenu({ open: false, tool_id: "" });
            formik.resetForm();
        }
    };

    return (
        <>
            <Modal
                key="delete-workspace-modal"
                // size={"xl"}
                isOpen={deleteChat?.open}
                hideCloseButton
                style={{
                    width: '442px',
                    height: '251px',
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

                        <div className="mt-6">
                            {"Confirmation"}
                        </div>

                    </ModalHeader>
                    <ModalBody className="text-white helvetica-font font-normal text-center">
                        {`Are you sure you want to delete this chat ?`}
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

export default DeleteChatConfirmationModal;
