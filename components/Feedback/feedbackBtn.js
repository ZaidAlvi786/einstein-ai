import { Button } from "@nextui-org/react";
import React from "react";

const FeedBackBtn = () => {
  return (
    <>
      <div className='fixed right-0 bottom-0'>
        <Button className='h-[38px] w-[111px] text-xs  rounded-none rounded-tl-lg bg-[#272727] hover:bg-[#424242] font-medium px-4'>
          {`Give Feedback`}
        </Button>
      </div>
    </>
  );
};

export default FeedBackBtn;
