import { PlusIcon } from "@heroicons/react/24/solid";
import { Modal, Tabs } from "antd";
import React, { useState } from "react";
import SearchIcon from "@/app/assets/svg/search-icon.svg";

import { Avatar, Button, Input, Spinner } from "@nextui-org/react";
import TabPane from "antd/es/tabs/TabPane";
import bgModal from "@/app/assets/image/bgModal.png";
// import modalLogo from '@/app/assets/image/modalLogo.svg'
import { CloseOutlined } from "@ant-design/icons";

import Image from "next/image";
import AddPromptBar from "./AddPromptBar";
const promptTxt = [
  "The warmth of a home is in the details.",
  "A blend of comfort and style.",
  "Relax in a space designed for you.",
  "Subtle tones bring harmony to your home.",
  "Soft lighting creates a peaceful ambiance.",
  "Surround yourself with beauty and comfort.",
  "Every corner tells a story.",
  "Modern design meets cozy living.",
  "Elegant and functional decor ideas.",
  "Find inspiration in every detail.",
];
const designTxt = [
  "Create spaces that reflect your personality.",
  "A touch of elegance in every detail.",
  "Comfort and style, perfectly balanced.",
  "Inspired by nature, designed for living.",
  "Let your home tell a story of comfort.",
  "Brighten your space with modern design.",
  "Find serenity in simple, elegant decor.",
  "Home is where design meets function.",
  "Timeless style for everyday living.",
  "Where warmth and beauty come together.",
];

function PromptModal({ open, setOpen }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeKey, setActiveKey] = useState("1");
  const [showCreatePrompt, setshowCreatePrompt] = useState(false);

  const onTabChange = (key) => {
    setActiveKey(key);
  };

  return (
    <Modal
      centered
      open={open}
      width={1000}
      onCancel={() => setOpen(false)}
      zIndex={99999}
      bodyStyle={{
        maxHeight: "90vh",
        overflowY: "auto",
        padding: 0,
        borderRadius: "20px",
        scrollbarWidth: "6px",
      }}
      footer={null}
      closeIcon={
        <CloseOutlined style={{ color: "white", fontSize: "16px" }} /> // Custom close icon with desired color and size
      }
    >
      <div
        style={{
          backgroundColor: "#171717",
          backgroundImage: `url("/bgModal.png")`, // Use the image import variable
          backgroundPosition: "center bottom", // Positioned at the bottom
          backgroundRepeat: "no-repeat", // Prevent image repetition
          backgroundSize: "contain", // Make sure the image stays in proportion
        }}
        className="min-h-screen text-white flex flex-col items-center py-5 px-4"
      >
        <div className="self-start flex items-center gap-2">
          {/* <Image src={modalLogo} width={30} height={30} /> */}
          <Image
            alt="dall-e icon"
            width={30}
            height={30}
            src={"/modalLogo.svg"}
          />
          <h2 className="font-nasalization  font-normal text-xl">Einstein</h2>
        </div>
        {!showCreatePrompt && (
          <div className="text-center">
            <h1
              style={{ fontSize: "40px" }}
              className=" font-nasalization font-normal mb-2"
            >
              Discover Thousands of Prompts
            </h1>
            <p
              className=" mb-2 font-normal"
              style={{ fontSize: "17px", color: "#E4E4E4" }}
            >
              Explore thousands of free prompts from the Einstein community.
            </p>

            <div className="flex items-center w-full max-w-xl rounded-md p-2 mb-2 prompt-modal-input m-auto">
              <Input
                type="text"
                placeholder="Search Community Prompts"
                classNames={{
                  label: "text-white",
                  input: [
                    "placeholder:text-[#6A6A6A]",
                    "text-[14px]",
                    "font-normal",
                    "font-inter",
                    "group-data-[has-value=true]:text-white",
                    "font-bold text-[#6A6A6A] text-sm font-helvetica caret-white",
                    "bg-transparent", // Keep background transparent
                    "focus:bg-transparent",
                  ],
                  inputWrapper: [
                    "bg-transparent",
                    "rounded-[25px]",
                    "group-data-[has-value=true]:text-white",
                    "h-[50px]",
                    "border",
                    "border-[#6A6A6A]",
                  ],
                }}
                isClearable={true}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClear={() => setSearchTerm("")}
                startContent={
                  <SearchIcon className="text-2xl  pointer-events-none flex-shrink-0" />
                }
                // endContent={isLoading ? <Spinner color="white" size="sm" className="flex items-center" /> : <></>}
              />
              <button
                className="transition-all duration-300 ease-in-out transform"
                onClick={() => setshowCreatePrompt(true)}
              >
                <PlusIcon className="w-7 h-7 text-[#ABABAB] ms-2 cursor-pointer hover:text-white" />
              </button>
            </div>
            <div>
              <div className="tabs-container">
                <Tabs
                  activeKey={activeKey}
                  onChange={onTabChange}
                  className="custom-tabs"
                >
                  <TabPane tab="Your Prompts" key="1">
                    <AddPromptBar data={promptTxt} isYours={true} />
                  </TabPane>
                  <TabPane tab="Design" key="2">
                    <AddPromptBar data={designTxt} isYours={false} />
                  </TabPane>
                  <TabPane tab="Music" key="3">
                    Music
                  </TabPane>
                  <TabPane tab="Programming" key="4">
                    Programming
                  </TabPane>
                  <TabPane tab="Productivity" key="5">
                    Productivity
                  </TabPane>
                  <TabPane tab="Writing" key="6">
                    Writing
                  </TabPane>
                  <TabPane tab="Data" key="7">
                    Data
                  </TabPane>
                  <TabPane tab="Categories" key="8">
                    Categories
                  </TabPane>
                </Tabs>
              </div>
            </div>
          </div>
        )}
        {showCreatePrompt && (
          <div className="text-center max-w-lg w-full">
            <h1
              style={{ fontSize: "40px" }}
              className=" font-nasalization font-normal mb-2"
            >
              Create Prompt
            </h1>
            <p
              className=" mb-2 font-normal"
              style={{ fontSize: "17px", color: "#E4E4E4" }}
            >
              Share your prompt with the Einstein community.
            </p>

            <div className={`flex  px-[10px]  bg-[#2F2F2FB2] rounded-3xl `}>
              {/* Attachment Icon */}
              <div className="flex items-center justify-center w-[30px] h-[30px] pt-3">
                <Image
                  alt="attach icon"
                  width={15}
                  height={25}
                  src={"svg/attach.svg"}
                  className={`cursor-pointer mx-auto w-[10px] h-[25px]`}
                />
              </div>

              {/* Text Area */}
              <textarea
                id="review-text"
                rows={7}
                className="leading-6  text-[#D0D0D0] resize-none overflow-y-auto py-[8px] px-[10px] text-[15px] font-normal w-full bg-transparent outline-none rounded-md "
                placeholder="Write Prompt"
              />
            </div>
            <div>
              <div className="w-full my-5 bg-[#272727] rounded-3xl flex justify-between  px-4 py-1 items-center">
                <Button className="bg-[#272727] p-0 text-[#AAAAAA] font-normal text-[16px]">
                  Select tags
                </Button>
              </div>
              <Button className="w-[70%] mt-3 rounded-3xl bg-[#007AFF] font-semibold text-[16px] text-[#F5F5F5]">
                Create Prompt
              </Button>
              <Button
                className=" my-1 bg-transparent text-[#FFFFFF] font-bold"
                onClick={() => setshowCreatePrompt(false)}
              >
                Return to Prompt Library
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default PromptModal;
