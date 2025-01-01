"use client"

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import ExclamationIcon from "@/app/assets/svg/exclamation-icon.svg";
import BillingCanc from "@/app/assets/svg/billingCanc.svg";
import Image from "next/image";
// import CanceledSubscription from "@/CanceledSubscription";

const classNames = {
  //   header: ["2xl:py-8", "2xl:px-[65px]", "xl:py-[22px]", "xl:px-[30px]"],
  header: ["2xl:py-5", "2xl:px-[60px]", "xl:py-[10px]", "xl:px-[30px]"],
  footer: ["p-0", "my-[25px] py-0"],
};

const RatingSuccessfullModel = ({ isOpen, onOpenChange, message }) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size={"md"}
      hideCloseButton
      classNames={classNames}
      className="bg-[#171717] rounded-3xl pb-3"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <div className="text-center">
              <ModalHeader className="text-white helvetica-font  flex justify-center p-3">
                <div className="flex flex-col p-0">
                  <div className="flex justify-center p-4">
                  <Image
                    src={"/svg/rating.svg"}
                    alt="profile-pic"
                    width={102}
                    height={102}
                  />
                  </div>
                  <div className="font-normal text-[40px] mt-3">Review Submitted</div>
                </div>
              </ModalHeader>
            </div>
            <ModalBody className="px-[28px] py-[20px] text-white text-center">
              <div className="max-w-xs mx-auto text-xl">
              Thank you for your feedback!
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default RatingSuccessfullModel;
