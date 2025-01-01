import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import ExclamationIcon from "@/app/assets/svg/exclamation-icon.svg";

const classNames = {
  header: ["2xl:py-8", "2xl:px-[65px]", "xl:py-[22px]", "xl:px-[30px]"],
  footer: ["p-0", "my-[25px]"],
};

const CancelSubscriptionModal = ({ isOpen, onOpenChange = () => {} }) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size={"md"}
      hideCloseButton
      classNames={classNames}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <div className="text-center">
              <ModalHeader className="text-white helvetica-font font-normal">
                Are you sure you want to cancel your Einstein Ultra account?
              </ModalHeader>
            </div>
            <ModalBody className="px-[28px] py-[0px] gap-[15px]">
              <div className="flex gap-2 ">
                <div className="mt-1">
                  <ExclamationIcon className="text-[#E54637]" />
                </div>
                <p className="text-white helvetica-font 2xl:text-base xl:text-[13px] items-start font-normal">
                  If an account balance remains, you will receive your final
                  invoice on the next billing date
                </p>
              </div>
              <div className="flex gap-2">
                <div className="">
                  <ExclamationIcon className="text-[#E54637]" />
                </div>
                <p className="text-white helvetica-font 2xl:text-base xl:text-xs items-start font-normal">
                  All paid tools will be removed.
                </p>
              </div>
              <div className="flex gap-2">
                <div className="">
                  <ExclamationIcon className="text-[#E54637]" />
                </div>
                <p className="text-white helvetica-font 2xl:text-base xl:text-xs items-start font-normal">
                  You will have access to your chats for 30 days.
                </p>
              </div>
            </ModalBody>
            <ModalFooter className="w-[120px] mx-auto flex flex-col ">
              <Button
                className="w-full text-xs text-white h-[26px] rounded-[9px] font-medium"
                color="primary"
                onPress={onClose}
              >
                Don’t Cancel
              </Button>
              <Button
                className="w-full text-xs h-[26px] rounded-[9px] font-medium bg-[#313131] text-[#E54637]"
                onPress={onClose}
              >
                Cancel
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CancelSubscriptionModal;
