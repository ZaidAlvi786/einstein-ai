// addToolsDropdown.js
"use client"
import { Button } from "@nextui-org/react";
import { useState } from "react";
import AddIcon from "@/app/assets/svg/add.svg";
import CreateToolsModel from "@/components/marketplace/AddToolModel";
import Image from "next/image";
import { useOnClickOutside } from "@/app/hooks/useOnClickOutside";
import { useRef } from "react";
import Closeicon from "@/app/assets/svg/workspace-close.svg";
import AddGptModel from "@/components/marketplace/AddGptModel";
import { Fragment } from "react";
import { Transition } from "@headlessui/react";
import { useAuth } from "@/app/authContext/auth";
import Link from "next/link";

const AddToolsDropdown = () => {
  const auth = useAuth();
  const [addToolModelGpt, setAddToolModelGpt] = useState({
    open: false,
    isEditable: false,
    tool_details: null,
    category: ''
    
  });
  const [addToolPluginWidget, setAddToolPluginWidget] = useState({
    open: false,
    category: "",
  });
  const [openCreateToolDropdown, setOpenCreateToolDropdown] = useState(false);
  const searChChatContainerRef = useRef();
  useOnClickOutside(searChChatContainerRef, () =>
    setOpenCreateToolDropdown(false)
  );

  const DropdownHeader = ({ toggle }) => (
    <>
      {auth?.user?.email && auth?.user?.fullname ? (
        <Button
          className="text-white helvetica-font font-bold rounded-full border-[1px] bg-transparent text-[14px] flex items-center justify-center w-[94px] h-[34px] gap-[5px] px-[4px]"
          startContent={<AddIcon className="" />}
          onClick={toggle}
        >
          {`Create`}
        </Button>
      ) : (
        <Button
          as={Link}
          className="text-white helvetica-font font-bold rounded-full border-[1px] bg-transparent text-[14px] flex items-center justify-center w-[94px] h-[34px] gap-[5px] px-[4px]"
          startContent={<AddIcon className="" />}
          href="/signin"
        >
          {`Create`}
        </Button>
      )}
    </>
  );

  const handleToggle = (e) => {
    e?.preventDefault();
    setOpenCreateToolDropdown((prev) => !prev);
  };

  const handleClickOnPluginWidget = (tools) => {
    if (tools === "plugin" || tools === "widget") {
      setOpenCreateToolDropdown(false);
      setAddToolPluginWidget({ open: true, category: tools });
    }

    if (tools === "gpt") {
      setOpenCreateToolDropdown(false);
      setAddToolModelGpt({ open: true, category: tools });
    }

    if (tools === "model") {
      setOpenCreateToolDropdown(false);
      setAddToolPluginWidget({ open: true, category: tools });
    }
  };

  return (
    <>
      <div className="inline-block text-left">
        <div className="flex items-center h-full">
          <DropdownHeader toggle={handleToggle} />
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
          show={openCreateToolDropdown}
          ref={searChChatContainerRef}
        >
          <div className="fixed right-7 z-50 top-[70px] origin-top-right rounded-[24px] bg-[#171717] overflow-hidden max-w-[472px] w-full trasnsition-card">
            <div className="p-5">
              <div className="text-[20px] text-white text-center font-medium mb-7 relative select-none">
                {`Add a Tool to Togl`}
                <Closeicon
                  className="cursor-pointer absolute right-0 top-[5px]"
                  onClick={() => setOpenCreateToolDropdown(false)}
                />
              </div>
              <div className="flex flex-col gap-[13px]">
                <div
                  className="p-3 border border-[#424242] rounded-[7px] cursor-pointer hover:bg-[#505050] transition-all hover:bg-opacity-80 focus:bg-blue-gray-50 focus:bg-opacity-80 active:bg-blue-gray-50 active:bg-opacity-80 hover:text-blue-gray-900 focus:text-blue-gray-900 active:text-blue-gray-900"
                  onClick={() => handleClickOnPluginWidget("plugin")}
                >
                  <div className="font-bold text-[15px] text-white mb-2 font-roboto">
                    {`Create Plugin`}
                  </div>
                  <p className="text-[16px] text-[#9B9B9B] whitespace-normal -tracking-[0.1px] font-helvetica">{`Integrate your tool seamlessly with Togl. Enjoy dedicated display space and full monetization options.`}</p>
                </div>
                {/* <div
                  className="p-3 border border-[#424242] rounded-[7px] cursor-pointer hover:bg-[#505050] transition-all hover:bg-opacity-80 focus:bg-blue-gray-50 focus:bg-opacity-80 active:bg-blue-gray-50 active:bg-opacity-80 hover:text-blue-gray-900 focus:text-blue-gray-900 active:text-blue-gray-900"
                  onClick={() => handleClickOnPluginWidget("widget")}
                >
                  <div className="font-bold text-[15px] text-white mb-2 font-roboto">
                    {`Add Widget`}
                  </div>
                  <p className="text-[16px] text-[#9B9B9B] whitespace-normal -tracking-[0.1px] font-helvetica">{`Reusable interactive component added to the interface, acting as a persistent popup with dynamic behaviors.`}</p>
                </div> */}
                <div
                  className="p-3 border border-[#424242] rounded-[7px] cursor-pointer hover:bg-[#505050] transition-all hover:bg-opacity-80 focus:bg-blue-gray-50 focus:bg-opacity-80 active:bg-blue-gray-50 active:bg-opacity-80 hover:text-blue-gray-900 focus:text-blue-gray-900 active:text-blue-gray-900"
                  onClick={() => handleClickOnPluginWidget("gpt")}
                >
                  <div className="font-bold text-[15px] text-white mb-2 font-roboto">
                    {`Create GPT`}
                  </div>
                  <p className="text-[16px] text-[#9B9B9B] whitespace-normal -tracking-[0.1px] font-helvetica">{`Select a model tailored to your needs, fine-tuned with the specific context you provide.`}</p>
                </div>
                {/* <div
                  className="p-3 border border-[#424242] rounded-[7px] cursor-pointer hover:bg-[#505050] transition-all hover:bg-opacity-80 focus:bg-blue-gray-50 focus:bg-opacity-80 active:bg-blue-gray-50 active:bg-opacity-80 hover:text-blue-gray-900 focus:text-blue-gray-900 active:text-blue-gray-900"
                  onClick={() => window.open("https://github.com/Einstein-AI/models.git")}
                >
                  <div className="font-bold text-[15px] text-white mb-2 font-roboto">
                    {`Add Model`}
                  </div>
                  <p className="text-[16px] text-[#9B9B9B] whitespace-normal -tracking-[0.1px] font-helvetica">{`A model of your choice, fine-tuned with specific information that is provided.`}</p>
                </div> */}
                <a
                //   href={"https://github.com/Einstein-AI/Frontend.git"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 border border-[#424242] rounded-[7px] cursor-pointer hover:bg-[#505050] transition-all hover:bg-opacity-80 focus:bg-blue-gray-50 focus:bg-opacity-80 active:bg-blue-gray-50 active:bg-opacity-80 hover:text-blue-gray-900 focus:text-blue-gray-900 active:text-blue-gray-900"
                  onClick={() => handleClickOnPluginWidget("model")}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-bold text-[15px] text-white font-roboto">
                      {`Create Embedded Tool`}
                    </div>
                  </div>
                  <p className="text-[16px] text-[#9B9B9B] whitespace-normal -tracking-[0.1px] font-helvetica">{`Add your model and allow it to be queried directly from the Togl chat input bar.`}</p>
                  {/* <div className="flex gap-2 mt-3">
                    <Button
                      className="text-white helvetica-font font-bold rounded-full border-[1px] bg-transparent text-[14px] flex items-center justify-center h-[34px] gap-[5px] px-[8px]"
                      //   startContent={<AddIcon className="" />}
                      onClick={() => handleClickOnPluginWidget("model")}
                    >
                      {`Publish Model`}
                    </Button>
                    <Button
                      className="text-white helvetica-font font-bold rounded-full border-[1px] bg-transparent text-[14px] flex items-center justify-center h-[34px] gap-[5px] px-[8px]"
                      //   startContent={<AddIcon className="" />}
                      //   onClick={toggle}
                      onClick={() => window.open("https://github.com/Einstein-AI/Frontend.git")}

                    >
                      {`Vist Repo`}
                    </Button>
                  </div> */}
                </a>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      {/* Create a plugin/widget model */}
      <CreateToolsModel
        open={addToolPluginWidget}
        setOpen={setAddToolPluginWidget}
      />

      {/* Create a Gpts model */}
      <AddGptModel open={addToolModelGpt} setOpen={setAddToolModelGpt} generateRandomImage={!addToolModelGpt.isEditable}/>
    </>
  );
};

export default AddToolsDropdown;
