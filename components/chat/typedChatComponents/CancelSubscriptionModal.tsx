import { useUpdateToolMutation } from "@/app/lib/features/chat/chatApi";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";
import BillingCanc from "@/app/assets/svg/billingCanc.svg";
import { Checkbox } from "antd";
import { usePathname } from "next/navigation";

const classNames = {
  header: ["2xl:py-5", "2xl:px-[65px]", "xl:py-[10px]", "xl:px-[30px]"],
  footer: ["p-0", "my-[25px] py-0"],
};

const CancelSubscriptionModal = ({
  isOpenCancelSubsModal,
  setisOpenCancelSubsModal,
  tool_id,
}: any) => {
  const pathname = usePathname();
  const [UpdateTool] = useUpdateToolMutation();
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const toggleConfirm = () => {
    setisOpenCancelSubsModal(false);
  };

  const deleteConfirm = () => {
    if (!isCheckboxChecked) {
      toast.error("Please check 'I Understand' to proceed with deletion.");
      return;
    }
    UpdateTool({ tool_id: tool_id, is_deleted: true })
      .unwrap()
      .then((response) => {
        toast.success("Tool deleted successfully oooo");
        setisOpenCancelSubsModal(false);
        setTimeout(() => {
          if (pathname === "/") {
            window.location.reload();
          } else {
            window.location.href = "/profile/creators";
          }
        }, 1000);
      })
      .catch((error) => {
        toast.error(error?.data?.message);
        console.log("###_error_### ", error);
      });
  };
  return (
    <Modal
      isOpen={isOpenCancelSubsModal}
      onOpenChange={toggleConfirm}
      //   setIsConfirm={setIsConfirm}
      size={"md"}
      classNames={classNames}
      className="bg-[#171717]"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <div className="text-center">
              <ModalHeader className="text-white helvetica-font  flex justify-center pt-3 pl-3 pr-3 !pb-2">
                <div className="flex flex-col p-0">
                  <div className="flex justify-center p-4">
                    <BillingCanc />
                  </div>
                  <div className="text-xl font-normal">
                    Are you sure you want to delete?
                  </div>
                </div>
              </ModalHeader>
            </div>
            <ModalBody className="px-[28px] py-[0px] text-white ">
              <div className="max-w-xs mx-auto text-[13px] font-normal px-3.5">
                <div>Clicking “Delete” will </div>
                <div
                  className={`list-disc ml-4 text-[14px] font-normal  
       `}
                  style={{ overflow: "hidden" }}
                >
                  <ul className="list-disc text-start ml-4">
                    <li>
                      Schedule the app to be deleted at the end of this pay
                      period.
                    </li>
                    <li>Remove the app from the marketplace.</li>
                    <li>Halt any new subscriptions.</li>
                  </ul>
                </div>
                <div className="my-1">
                  Note: Per the Creator Agreement app creators must maintain
                  functionality until end of pay period. Failure to do so will
                  result in refund request.
                </div>
                <Checkbox
                  onChange={() => setIsCheckboxChecked(!isCheckboxChecked)}
                  checked={isCheckboxChecked}
                  className="custom-checkbox text-white text-[10px]"
                >
                  I Understand
                </Checkbox>
              </div>
            </ModalBody>

            <ModalFooter className="w-[300px] mx-auto flex flex-col ">
              <div className="flex flex-col gap-2">
                <Button
                  className="bg-[#533938] hover:bg-[#EE4142] rounded-[15px] hover:text-white font-normal h-[36px] text-sm "
                  color="primary"
                  onClick={deleteConfirm}
                >
                  Delete
                </Button>

                <Button
                  className="bg-[#343539] hover:bg-[#535353] rounded-[15px] hover:text-white font-normal h-[36px] text-sm "
                  onClick={toggleConfirm}
                >
                  Decline
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
