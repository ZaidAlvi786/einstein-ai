import React from "react";
import Image from "next/image";
import { AssistantMessageVersionChangeProps } from "@/types/ChatTypes";

export const AssistantMessageVersionChangeComponent: React.FC<
  AssistantMessageVersionChangeProps
> = ({
  currentMessageVersionIndex,
  message,
  setCurrentMessageVersionIndex,
}) => {
  const handlePreviousClick = () => {
    if (currentMessageVersionIndex > 0) {
      setCurrentMessageVersionIndex(currentMessageVersionIndex - 1);
    }
  };

  const handleNextClick = () => {
    if (currentMessageVersionIndex < message.content.length - 1) {
      setCurrentMessageVersionIndex(currentMessageVersionIndex + 1);
    }
  };

  return (
    <>
      <div className='flex text-[#fff] text-[14.2px] font-helvetica select-none'>
        <button onClick={handlePreviousClick}>
          <Image
            alt='Previous'
            width={7}
            height={12}
            src={`svg/Icon-left.svg`}
            className='cursor-pointer mr-[5px] mt-[3px]'
          />
        </button>
        <div className='text-[#fff] text-[14.2px] font-helvetica tracking-[2px] mt-[3px]'>
          {currentMessageVersionIndex + 1} / {message.content.length}
        </div>
        <button onClick={handleNextClick}>
          <Image
            alt='Next'
            width={7}
            height={12}
            src={`svg/Icon-right.svg`}
            className='cursor-pointer ml-[3px] mt-[3px]'
          />
        </button>
      </div>
    </>
  );
};
