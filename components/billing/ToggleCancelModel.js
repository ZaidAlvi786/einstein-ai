import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import ExclamationIcon from "@/app/assets/svg/exclamation-icon.svg";
import BillingCanc from "@/app/assets/svg/billingCanc.svg";
import CanceledSubscription from "./CanceledSubscription";
// import CanceledSubscription from "@/CanceledSubscription";

const classNames = {
  header: ["2xl:py-[40px]", "2xl:px-[65px]", "xl:py-[0px]", "xl:px-[30px]"],
  footer: ["p-0", "my-[10px] py-5"],
};

const CancelSubscriptionModal = ({
  isModalVisible,
  setIsModalVisible,
  handleToggleOn,
  handleCancel,
  handleConfirmCancel,
  isMutationLoading,
}) => {
  const toggleConfirm = () => {
    setIsModalVisible(false);
  };
  const handleClose = () => {
    setIsAutoCredit(false);
    setIsModalVisible(false);
  };
  return (
    isModalVisible && (
      <Modal
        isOpen={true}
        onOpenChange={(isModalVisible) => {
          setIsModalVisible(false);
          // if (!isModalVisible) {
          //   handleToggleOn(false); // Set auto credit to false when closing
          // }
        }}
        size={"md"}
        classNames={classNames}
        className="bg-[#1E1E1E] min-h-[351px]"
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <>
              <div className="text-center ">
                <ModalHeader className="text-white helvetica-font  flex justify-center mt-2">
                  <div className="max-w-[301px] mx-auto font-medium text-[31px] mt-10 mb-7">
                    Auto Credit Top-Ups
                  </div>
                </ModalHeader>
              </div>
              <ModalBody className="px-[28px] py-[0px] text-white text-center text-[12px] pt-10px ">
                <div className="max-w-[202px] mx-auto font-bold text-[20px]">
                  Confirm Cancellation
                </div>
                <div className="mx-auto max-w-[230px] text-[14px]">
                  If you cancel this subscription, your service will end now.
                </div>
              </ModalBody>

              <ModalFooter className="w-[300px] mx-auto flex flex-col ">
                <div className="flex flex-col gap-3">
                  {isMutationLoading?.isLoading ? (
                    <Button
                      className="bg-[#343539] h-[43px] hover:bg-[#535353] rounded-[15px] hover:text-white font-normal text-sm "
                      color="primary"
                    >
                      <Spinner size="sm" />
                    </Button>
                  ) : (
                    <Button
                      className="bg-[#343539] h-[43px] hover:bg-[#535353] rounded-[15px] hover:text-white font-normal text-sm "
                      color="primary"
                      onClick={() => handleConfirmCancel()}
                    >
                      Confirm
                    </Button>
                  )}

                  <Button
                    className="bg-[#343539] hover:bg-[#535353] rounded-[15px] hover:text-white font-normal h-[43px] text-sm "
                    onClick={() => handleCancel(false)}
                  >
                    Not Now
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    )
  );
};

export default CancelSubscriptionModal;
