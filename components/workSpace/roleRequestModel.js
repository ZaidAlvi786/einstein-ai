import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import RequestUser from "@/app/assets/svg/Requestuser.svg";

const RoleRequestModel = ({ open, setOpen }) => {

    const HandleModalClose = () => {
        setOpen({ open: false });
    };

    return (
        <>
            <Modal
                key="delete-workspace-modal"
                // size={"xl"}
                isOpen={open?.open}
               
                style={{
                    width: '442px',
                    height: '351px',
                }}
                onClose={() => HandleModalClose()}
                onOpenChange={() => HandleModalClose()}
                classNames={{
                    header: "2xl:py-[22px] 2xl:px-[65px] xl:py-[10px] xl:px-[30px]",
                    footer: "p-0 my-[25px]",
                    closeButton:"text-[28px] text-white p-0 right-2.5 top-2.5 [&>svg]:stroke-1",
                }}
            >
                <ModalContent>
                    <ModalHeader className="text-white helvetica-font font-normal text-center flex flex-col content-around items-center">
                        <div className="mt-12">
                            <RequestUser />
                        </div>
                        <div className="mt-3">{"Request to edit"}</div>
                    </ModalHeader>
                    <ModalBody className="text-white helvetica-font font-normal text-center flex-none mb-6">
                        {`In order to add edit the workspace you must request permission from the owner of the workspace.`}
                    </ModalBody>
                    <ModalFooter className="mx-auto flex mt-0 flex-col content-around items-center">
                        <Button
                            className="text-white font-bold text-sm font-helvetica border border-[#0A84FF] rounded-2xl bg-[#0A84FF] h-[43px] py-[6px] px-8 min-w-[290px] tracking-widest"
                        >
                            Send request
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default RoleRequestModel;
