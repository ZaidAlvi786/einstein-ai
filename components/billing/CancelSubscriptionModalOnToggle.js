const { Modal, Image, Button } = require("@nextui-org/react");

const CancelSubscriptionModalOnToggle = ({
  setIsModalVisible,
  isModalVisible,
  handleCancel,
}) => {
  return (
    <Modal
      open={isModalVisible}
      onCancel={handleCancel}
      footer={null}
      centered
      className="custom-modal"
      width={300} // Adjust width to match the design
      bodyStyle={{
        padding: "20px",
        textAlign: "center",
        backgroundColor: "#1F1F1F",
        borderRadius: "10px",
      }}
      closeIcon={<span style={{ color: "white" }}>X</span>}
    >
      <div className="text-center">
        <p className="text-white font-bold text-sm">
          You are subscribed to Gemini
        </p>
        <div className="flex justify-center items-center gap-2 my-3">
          <Image
            alt="gemini icon"
            width={40}
            height={40}
            src={"/models/gemini.png"}
          />
          <p className="text-white text-sm font-bold">$8.99/Month</p>
        </div>
        <p className="text-white text-sm mb-6 font-normal">
          Do you want to cancel this subscription?
        </p>
        <div className="flex flex-col gap-2">
          <Button
            className="bg-[#414141] hover:bg-[#E54637] hover:text-white text-[#E54637] font-normal rounded-md h-[36px] text-sm"
            block
            onClick={() => alert("Cancelled")}
          >
            Cancel Subscription
          </Button>
          <Button
            className="bg-[#414141]  text-white font-normal rounded-md h-[36px] text-sm"
            block
            onClick={handleCancel}
          >
            View Details
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CancelSubscriptionModalOnToggle;
