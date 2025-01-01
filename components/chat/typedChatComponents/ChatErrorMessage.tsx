import { Button } from "@nextui-org/react";
import React from "react";

interface ChatErrObj {
  errMsg: string;
  index: number | null;
}

interface ChatErrorMessageProps {
  chatError: ChatErrObj;
  Regenerate: () => Promise<void>;
}

const ChatErrorMessage: React.FC<ChatErrorMessageProps> = ({
  chatError,
  Regenerate,
}) => {
  return (
    <div className="text-white bg-[#2D2322] border 4k:rounded-[32px] 4k:h-[126px] 4k:border-2 border-solid border-[#4C2727] w-[711px] flex items-center justify-between p-3 rounded-2xl"
      style={{
        height: "auto",
        minHeight: "63px",
      }}
    >
      <div
        className="flex items-center gap-3 text-base 4k:text-[32px] 4k:-tracking-[0.48px]"
        style={{ fontWeight: "500", paddingRight: "20px" }}
      >
        <span className="4k:h-[48px] w-[24px] h-[24px] 4k:w-[48px] flex-shrink-0">
          <img src="/svg/Information-circle.svg" />
        </span>
        {chatError.errMsg}
      </div>
      <div>
        <Button
          className="bg-[#F9F9F9] 4k:h-[76px] 4k:rounded-[38px] rounded-full text-[#131313] text-base 4k:text-[32px] 4k:-tracking-[0.48px]"
          style={{ fontWeight: "700" }}
          onClick={Regenerate}
        >
          <img src="/svg/SyncRetry.svg" />
          Regenerate
        </Button>
      </div>
    </div>
  );
};

export default ChatErrorMessage;
