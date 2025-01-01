"use client"

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import React from 'react'
import { useMemo } from 'react'

const DeleteAccountConfirmtionModal = ({ isOpen, onClose, onConfirm, userData }) => {

    const userName = useMemo(() => userData?.full_name, [userData])

    return (
        <Modal
            key="confirmation-modal"
            size={"md"}
            isOpen={isOpen}
            onClose={onClose}
            classNames={{
                base: "text-white",
                closeButton: "hover:bg-white/5 active:bg-white/10",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Delete Account</ModalHeader>
                        <ModalBody>
                            <p>
                                Are you sure you want to delete <strong>{userName}</strong> account?
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                            <Button color="success" onPress={onConfirm}>
                                Confirm
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default DeleteAccountConfirmtionModal