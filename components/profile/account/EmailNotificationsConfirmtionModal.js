"use client"

import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import axiosInstance from '@/app/http/axios';
import toast from 'react-hot-toast';
import ToastService from '@/components/Toaster/toastService';

const EmailNotificationsConfirmtionModal = ({ isEmailNotificationsConfirmtionModal, setIsEmailNotificationsConfirmtionModal }) => {

    const [isSubmitting, setIsSubmitting] = useState(false);

    const formik = useFormik({
        initialValues: { email_notifications: (isEmailNotificationsConfirmtionModal?.email_notifications ? false : true), email: isEmailNotificationsConfirmtionModal?.email },
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            setIsSubmitting(true);

            axiosInstance.post(`/auth/update`, values, { headers: { "Content-Type": "application/json" } })
                .then((response) => {
                    if (response?.status === 200) {
                        setIsEmailNotificationsConfirmtionModal((pre) => ({ ...pre, email_notifications: values?.email_notifications, open: false }));
                        resetForm();
                        toast.success("Your Email notifications has been updated.");
                    } else {
                        toast.error("Something went wrong!");
                    }
                })
                .catch((error) => {
                    if (error?.response?.data?.message) {
                        toast.error(error?.response?.data?.message);
                    }
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        },
    });

    const HandleModalClose = () => {
        if (!isSubmitting) {
            setIsEmailNotificationsConfirmtionModal((pre) => ({ ...pre, open: false }));
            formik.resetForm();
        }
    };

    return (<>
        <Modal
            key="email-notifications-confirmation-modal"
            isOpen={isEmailNotificationsConfirmtionModal?.open}
            onClose={() => HandleModalClose()}
            onOpenChange={() => HandleModalClose()}
            classNames={{ base: "text-white", closeButton: "hover:bg-white/5 active:bg-white/10" }}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">{`Email Notifications`}</ModalHeader>
                <ModalBody>
                    <p className='text-white'>Would you like to {(!isEmailNotificationsConfirmtionModal?.email_notifications) ? 'enable' : 'disable'} email notifications?</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" disabled={isSubmitting} onPress={() => HandleModalClose()}>{"Cancel"}</Button>
                    <Button color="success" isLoading={isSubmitting} onPress={formik.handleSubmit}>{(!isEmailNotificationsConfirmtionModal?.email_notifications) ? (isSubmitting ? "Enabling" : "Enable") : (isSubmitting ? "Disabling" : "Disable")}</Button>
                </ModalFooter>
            </ModalContent>
        <ToastService />
        </Modal>
    </>);
}

export default EmailNotificationsConfirmtionModal