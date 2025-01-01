import { Button, Image } from "@nextui-org/react";
import React from "react";


const ReplyBlockInput = ({ showReply, setShowReply }: any) => {
  const handleCloseReplyBlock = () => {
    setShowReply({ message: "", index: null, text: "" });
    if (window.getSelection()?.toString()) {
      window.getSelection()?.removeAllRanges();
    }
  };
  return (
    <div className="w-[700px] rounded-[20px] py-1 flex flex-row justify-center items-center ">
      <div className="flex flex-row gap-[13px]   bg-black w-[97%] ml-[-9px] h-[73px] px-4 pt-2 rounded-t-3xl overflow-y-scroll ">
        <Image
          src={"/svg/reply.svg"}
          width={12}
          height={10}
          className="mt-[8px] transform scale-y-[-1]"
        />
        <p
          className="text-[#B3B3B3] text-[16px] font-normal leading-[24px]"
          style={{ width: "-webkit-fill-available" }}
        >
          "{showReply?.text && showReply?.text}"
        </p>
        <Button
          onClick={() => {
            handleCloseReplyBlock();
          }}
          className="bg-transparent p-1 w-fit min-w-fit h-fit "
        >
          <Image src={"/svg/close.svg"} width={15} height={15} />
        </Button>
      </div>
    </div>
  );
};

export default ReplyBlockInput;
