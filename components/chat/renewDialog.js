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

const RenewConfirmationModal = ({
    renewPluginMenu,
    setRenewPluginMenu
}) => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const tool_id = renewPluginMenu?.tool_id
    const formik = useFormik({
        initialValues: { tool_id },
        onSubmit: async (values, { resetForm }) => {
            setIsSubmitting((pre) => ({ ...pre, open: true, action: "remove" }));

            const data = { tool_id: tool_id };
        },
    });

    const HandleModalClose = () => {
        // if (!isSubmitting?.open) {
        setRenewPluginMenu({ open: false, tool_id: "", modelInfo: null });
        //     formik.resetForm();
        // }
    };

    return (
        <>
            <Modal
                key="delete-workspace-modal"
                // size={"xl"}
                isOpen={renewPluginMenu?.open}
                style={{
                    width: '442px',
                    height: '351px',
                }}
                onClose={() => HandleModalClose()}
                onChange={() => HandleModalClose()}
                classNames={{
                    header: "2xl:py-[22px] 2xl:px-[65px] xl:py-[10px] xl:px-[30px]",
                    footer: "p-0 my-[25px]",
                }}
            >
                <ModalContent>
                    <ModalHeader className="text-white helvetica-font font-normal text-center flex flex-col content-around items-center">

                        <div className="mt-2">
                            <Avatar
                                src={renewPluginMenu?.modelInfo?.iconSrc}
                                alt={renewPluginMenu?.modelInfo?.modelName}
                                radius="sm"
                                className="2xl:h-[36px] 2xl:w-[36px] xl:h-[36px] xl:w-[36px] h-[36px] w-[36px] bg-transparent"
                            />
                        </div>
                        <div className="mt-6">
                            {`${renewPluginMenu?.modelInfo?.modelName}`}
                        </div>

                    </ModalHeader>
                    <ModalBody className=" helvetica-font font-normal text-center">
                        <p className="text-red-700 font-bold">{`You’ve canceled your subscription`}</p>
                        <p className="text-white">{`Your service will end immediately.`}</p>
                    </ModalBody>
                    <ModalFooter className="mx-auto flex mt-0 flex-col content-around items-center">
                        <Button
                            className="text-base rounded-[12px] font-medium bg-[#343539] text-white  h-[43px] py-1.5 px-5 gap-1 min-w-[319px] hover:bg-[#535353]"
                            onPress={formik.handleSubmit}
                            isLoading={isSubmitting?.open}
                        >
                            {'Renew: $9.99/month'}
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default RenewConfirmationModal;
