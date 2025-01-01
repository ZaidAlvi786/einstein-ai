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
import moment from "moment";
const classNames = {
  //   header: ["2xl:py-8", "2xl:px-[65px]", "xl:py-[22px]", "xl:px-[30px]"],
  header: ["2xl:py-5", "2xl:px-[65px]", "xl:py-[10px]", "xl:px-[30px]"],
  footer: ["p-0", "my-[25px] py-0"],
};

const ViewInvoiceModal = ({
  setisOpenCancelSubsModal,
  isOpenCancelSubsModal,
  selectedInvoice,
}) => {
  return (
    <Modal
      isOpen={isOpenCancelSubsModal}
      onOpenChange={() => setisOpenCancelSubsModal(false)}
      size={"md"}
      classNames={classNames}
      className="bg-[#171717]"
    >
      <ModalContent>
        {(onClose) => (
          <>
           <ModalHeader className="text-white helvetica-font  flex justify-center pt-3 pl-3 pr-3 !pb-2">
                <div className="flex flex-col p-0">
                  <div className="flex justify-center p-4">
                    <div>Invoice Details</div>
                  </div>
                </div>
              </ModalHeader>
            <ModalBody className="px-[28px] py-[0px] text-white">
              <div>
                <div className="max-w-xs text-red text-[15px] text-[#565656]">Invoice Id</div>
                <div >{selectedInvoice?.invoice_id}</div>
              </div>
              <div>
                <div className="max-w-xs text-red text-[15px] text-[#565656]">Invoice Date</div>
                <div>{moment(selectedInvoice?.invoice_date).format("DD MMM YYYY")}</div>
              </div>
              <div>
                <div className="max-w-xs text-red text-[15px] text-[#565656]">Type</div>
                <div>{selectedInvoice.payment_source}</div>
              </div>
              <div>
                <div className="max-w-xs text-red text-[15px] text-[#565656]">Amount</div>
                <div>${selectedInvoice.invoice_amount}</div>
              </div>
             
            </ModalBody>

            <ModalFooter className="w-[300px] mx-auto flex flex-col ">
            <Button
                  className="bg-[#343539] hover:bg-[#535353] rounded-[15px] hover:text-white font-normal h-[36px] text-sm "
                  color="primary"
                  onClick={() => setisOpenCancelSubsModal(false)}
                >
                  Close
                </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ViewInvoiceModal;
