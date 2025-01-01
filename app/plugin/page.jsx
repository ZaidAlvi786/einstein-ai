"use client";
import LetsMakeSomething from "@/components/chat/typedChatComponents/LetsMakeSomething";
import { Button, Input } from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import SearchIcon from "@/app/assets/svg/search-icon.svg";
import { useToolWebhookMutation } from "../lib/features/chat/chatApi";
import toast from "react-hot-toast";
import ToastService from "@/components/Toaster/toastService";

const Plugin = () => {
  const [ToolWebhook] = useToolWebhookMutation();
  const [value, setValue] = useState("");
  const [queryParams, setQueryParams] = useState({
    token: "",
    tool_id: "",
  });
  console.log("queryParams: ", queryParams);

  useEffect(() => {
    const getIframeUrl = localStorage.getItem("iFrameUrl");
    if (getIframeUrl) {
      const url = new URL(getIframeUrl);
      const searchParams = new URLSearchParams(url.search);
      const toolId = searchParams.get("tool_id");
      const token = searchParams.get("token");

      setQueryParams({
        token: token,
        toolId: toolId,
      });
    }
  }, []);

  const callWebHook = () => {
    const data = {
      tool_id: queryParams.toolId,
      tool_input: value,
      tool_output: "string",
      auth_token: queryParams.token,
    };

    ToolWebhook(data)
      .unwrap()
      .then((response) => {
        console.log("response: ", response);
      })
      .catch((error) => {
        toast.error(error?.data?.message);
      });
  };

  const handleGenerateText = () => {
    callWebHook();
  };

  return (
    <div className="w-full p-[60px] max-msm:pt-5 h-[800px] outline-none scrollbar-hide text-white text-lg ">
      <div>Welcome To Plugin</div>
      <LetsMakeSomething />
      <div className="m-auto">
        <div className="flex flex-row justify-center  gap-2 mt-[20px] max-msm:mt-0 mb-4 max-msm:ml-3 items-center h-[65px]">
          <div className="w-[600px]">
            <Input
              type="text"
              placeholder="Search text"
              classNames={{
                label: "text-white",
                input: [
                  "bg-[transparent]",
                  "placeholder:text-[#BABABA]",
                  "text-[14px]",
                  "font-normal",
                  "font-inter",
                  "group-data-[has-value=true]:text-white",
                  "caret-white",
                  "m-auto",
                  "w-full",
                ],

                inputWrapper: [
                  "bg-[#272727]",
                  "rounded-[24px]",
                  "data-[hover=true]:bg-[#232323]",
                  "group-data-[focus=true]:bg-[#232323]",
                  "group-data-[has-value=true]:text-white",
                  "h-[50px] px-4",
                  "m-auto",
                  "w-full",
                ],
              }}
              // value={filterType == "" ? searchTerm : ""}
              onValueChange={(value) => {
                setValue(value);
              }}
              // onClear={() => handleSearchChange("")}
              startContent={
                <SearchIcon
                  fill="#BABABA"
                  height={16}
                  width={16}
                  className="text-2xl text-[#BABABA] pointer-events-none flex-shrink-0"
                />
              }
            />
          </div>
          <Button onClick={handleGenerateText}>Submit</Button>
        </div>
      </div>
      <ToastService />
    </div>
  );
};

export default Plugin;
