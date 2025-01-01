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
const classNames = {
  //   header: ["2xl:py-8", "2xl:px-[65px]", "xl:py-[22px]", "xl:px-[30px]"],
  header: ["2xl:py-5", "2xl:px-[65px]", "xl:py-[10px]", "xl:px-[30px]"],
  footer: ["p-0", "my-[25px] py-0"],
};

const CanceledSubscription = ({ setisOpenCancelSubsModal }) => {
  return (
    <Modal
      isOpen={true}
      onOpenChange={() => setisOpenCancelSubsModal(false)}
      size={"md"}
      classNames={classNames}
      className="bg-[#171717]"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <div className="text-center">
              <ModalHeader className="text-white helvetica-font  flex justify-center p-3">
                <div className="flex flex-col p-0">
                  <div className="flex justify-center p-4">
                    <BillingCanc />
                  </div>
                  <div classNames="font-normal">Togl Pro</div>
                </div>
              </ModalHeader>
            </div>
            <ModalBody className="px-[28px] py-[0px] text-white text-center">
              <div className="max-w-xs mx-auto text-red">
                You’ve canceled your subscription
              </div>
              <div className="max-w-xs mx-auto">
                Your service will end immediately.
              </div>
            </ModalBody>

            <ModalFooter className="w-[300px] mx-auto flex flex-col ">
              <div className="flex flex-col gap-2">
                <Button
                  className="bg-[#343539] hover:bg-[#535353] rounded-[15px] hover:text-white font-normal h-[36px] text-sm "
                  color="primary"
                >
                  Renew: $99.99/month
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CanceledSubscription;
