import { Button } from "@nextui-org/react";
import React from "react";

const AddPromptBar = ({ isYours = false,data }) => {
  return (
    <div className="py-5">
       {data.map((text, index) => (
        <div
          key={index}
          className="w-[120%] bg-[#272727] rounded-full flex justify-between py-3 px-5 items-center my-2"
          style={{ marginLeft: "-70px" }}
        >
          <p className="text-[#E4E4E4] font-normal" style={{ fontSize: "17px" }}>
            {text}
          </p>
          {isYours ? (
            <Button className=" h-[21px] bg-transparent text-[#007AFF] font-bold">
              Remove
            </Button>
          ) : (
            <Button className=" h-[21px] bg-[#007AFF] font-bold text-[#F5F5F5]">Add</Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AddPromptBar;
