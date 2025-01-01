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
  //   header: ["2xl:py-8", "2xl:px-[65px]", "xl:py-[22px]", "xl:px-[30px]"],
  header: ["2xl:py-5", "2xl:px-[65px]", "xl:py-[10px]", "xl:px-[30px]"],
  footer: ["p-0", "my-[25px] py-0"],
};

const CancelSubscriptionModal = ({
  isOpenCancelSubsModal,
  setisOpenCancelSubsModal,
  setIsConfirm,
  isConfirm,
  handleCancelSubscription,
  isMutationLoading,
}) => {
  const toggleConfirm = () => {
    setIsConfirm(false);
    setisOpenCancelSubsModal(true);
  };
  return isOpenCancelSubsModal ? (
    <CanceledSubscription setisOpenCancelSubsModal={setisOpenCancelSubsModal} />
  ) : (
    <Modal
      isOpen={isConfirm}
      onOpenChange={setIsConfirm}
      //   setIsConfirm={setIsConfirm}
      size={"md"}
      hideCloseButton
      classNames={classNames}
      className="bg-[#171717]"
    >
      <ModalContent onClick={(e) => e.stopPropagation()}>
        {(onClose) => (
          <>
            <div className="text-center">
              <ModalHeader className="text-white helvetica-font  flex justify-center p-3">
                <div className="flex flex-col p-0">
                  <div className="flex justify-center p-4">
                    <BillingCanc />
                  </div>
                  <div classNames="font-normal">Confirm Cancellation</div>
                </div>
              </ModalHeader>
            </div>
            <ModalBody className="px-[28px] py-[0px] text-white text-center">
              <div className="max-w-xs mx-auto">
                If you cancel this subscription, your service will end immediately.
              </div>
            </ModalBody>

            <ModalFooter className="w-[300px] mx-auto flex flex-col ">
              <div className="flex flex-col gap-2">
                <Button
                  className="bg-[#343539] hover:bg-[#535353] rounded-[15px] hover:text-white font-normal h-[36px] text-sm "
                  color="primary"
                  // onClick={toggleConfirm}
                  onClick={handleCancelSubscription}
                  disabled={isMutationLoading?.isLoading ? true : false}
                >
                  {isMutationLoading.isLoading ? (
                    <Spinner size="sm" color="white" />
                  ) : (
                    "Confirm"
                  )}
                </Button>

                <Button
                  className="bg-[#343539] hover:bg-[#535353] rounded-[15px] hover:text-white font-normal h-[36px] text-sm "
                  onClick={onClose}
                >
                  Not Now
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CancelSubscriptionModal;
