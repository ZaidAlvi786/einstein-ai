import { Image } from "@nextui-org/react";
import React from "react";

const ReplyBlockUser = ({ text }: any) => {
  return (
    <div className=" rounded-[20px] py-1 flex flex-row items-center justify-end">
      <div className="w-[700px] flex flex-row gap-[13px] transparent ml-[-9px] px-4 pt-2 rounded-t-3xl overflow-y-scroll max-w-fit max-h-max py-1 items-center">
        <Image src={"/svg/reply.svg"} width={12} height={10} className="transform scale-y-[-1]" />
        <p
          className="text-[#B3B3B3] text-[16px] font-normal leading-[24px]"
          style={{ width: "-webkit-fill-available" }}
        >
          "{text}"
        </p>
      </div>
    </div>
  );
};

export default ReplyBlockUser;
