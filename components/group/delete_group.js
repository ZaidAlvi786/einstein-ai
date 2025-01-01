import { useDeleteGroupMutation } from '@/app/lib/features/chat/chatApi';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from '@nextui-org/react';
import { useFormik } from 'formik';
import { useState } from 'react';
import toast from 'react-hot-toast';
// import ToastService from '../Toaster/toastService';

const DeleteGroupConfirmtionModal = ({ deleteGroupModel, setDeleteGroupModel }) => {

    const [isSubmitting, setSubmitting] = useState(false);
    const [DeleteGroup] = useDeleteGroupMutation();

    const formik = useFormik({
        initialValues: { name: "" },
        enableReinitialize: true,
        onSubmit: async (values, { resetForm }) => {
            setSubmitting(true);

            DeleteGroup(deleteGroupModel?.group_id).unwrap()
                .then((response) => {
                    setDeleteGroupModel({ open: false, name: "", group_id: "" });
                    resetForm();
                    toast.success("Group Deleted Successfully!");
                })
                .catch((error) => {
                    console.log("Error : ", error);
                    if (error?.data?.message) {
                        toast.error(error?.data?.message);
                    }
                })
                .finally(() => {
                    setSubmitting(false);
                });
        },
    });

    const HandleModalClose = () => {
        if (!isSubmitting) {
            setDeleteGroupModel({ open: false, name: "", group_id: "" });
            formik.resetForm();
        }
    };

    return (<>
        <Modal
            key="edit-group-modal"
            size={"md"}
            isOpen={deleteGroupModel?.open}
            onClose={() => HandleModalClose()}
            onOpenChange={() => HandleModalClose()}
            classNames={{
                base: "text-white",
                closeButton: "hover:bg-[#232323] active:bg-[#232323]",
            }}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Delete Group</ModalHeader>
                <ModalBody>
                    <p>Are you sure you want to delete <strong>{deleteGroupModel?.name}</strong> Group ?</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" disabled={isSubmitting} variant="bordered" onPress={() => HandleModalClose()}>Close</Button>
                    <Button color="primary" disabled={isSubmitting} onPress={formik.handleSubmit}>{isSubmitting ? <Spinner color="white" size="sm" /> : "Delete"}</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
       {/* Toast is working with other service */}
      {/* <ToastService/> */}  

    </>);
}

export default DeleteGroupConfirmtionModal