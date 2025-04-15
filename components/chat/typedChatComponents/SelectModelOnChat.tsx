import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Avatar, Button, Tooltip } from "@nextui-org/react";

import { useAuth } from "@/app/authContext/auth";
import { useGetUserToolsQuery, useGetPinnedToolsQuery } from "@/app/lib/features/chat/chatApi";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";

import { Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useOnClickOutside } from "@/app/hooks/useOnClickOutside";
import { setActiveChatModel } from "@/app/lib/features/chat/chatSlice";

const SelectModelOnChatPopup = ({ setDropdownOpen, dropdownOpen }: any) => {
  const auth = useAuth() as any;
  const dispatch = useAppDispatch();
  const [pinnedPlugins, setPinnedPlugins] = useState<any>([]);

  const activeChatModel = useAppSelector(
    (state: any) => state.chat.activeChatModel
  );

  const { data: getUserToolsData } = useGetUserToolsQuery(
    {},
    { skip: !(auth?.user?.email && auth?.user?.fullname) }
  );
  const { data: getPinnedToolsId, refetch } = useGetPinnedToolsQuery({});
  const workspaceMenuContainerRef = useRef<HTMLElement>();
  useOnClickOutside(workspaceMenuContainerRef, () => setDropdownOpen(false));

  useEffect(() => {
    if (getPinnedToolsId?.data) {
      const pinnedIds = getPinnedToolsId.data;
      if (getUserToolsData?.subscribed_tools?.length > 0) {
        const { pinnedTools, filterMenuTools } =
          getUserToolsData.subscribed_tools.reduce(
            (
              acc: { pinnedTools: any[]; filterMenuTools: any[] },
              tool: any
            ) => {
              if (pinnedIds.includes(tool.id)) {
                acc.pinnedTools.push(tool);
              } else {
                acc.filterMenuTools.push(tool);
              }
              return acc;
            },
            { pinnedTools: [], filterMenuTools: [] }
          );
        const sortedPinnedTools = pinnedTools.sort(
          (a: any, b: any) => pinnedIds.indexOf(a.id) - pinnedIds.indexOf(b.id)
        );
        setPinnedPlugins(sortedPinnedTools);
      }
    }
  }, [getPinnedToolsId, getUserToolsData]);

  const handleToggleDropdown = (e: any) => {
    e?.preventDefault();
    if (getUserToolsData?.subscribed_tools?.length > 0) {
      setDropdownOpen((prev: any) => !prev);
    }
  };
  const activeModalHandler = (model: any) => {
    dispatch(setActiveChatModel(model));
    setDropdownOpen(false);
  };

  return (
    <div
      className="relative flex items-center"
      id="models_icons"
      style={{ zIndex: "99", marginBottom:"2px" }}
    >
      <Button
        variant="bordered"
        className="border-0 min-w-max px-0 !outline-none flex-shrink-0 relative group transition-all w-[36px] h-[36px] rounded-full"
        onClick={handleToggleDropdown}
      >
         <Tooltip
                    showArrow={true}
                    content={activeChatModel?.name || ""}
                    classNames={{
                      base: "before:bg-[#2F2F2F]",
                      content: "text-white bg-[#2F2F2F]",
                    }}
                    placement="top"
                  >
        <Avatar
          alt="modal-img"
          src={activeChatModel?.iconSrc || activeChatModel?.logo || ""}
          className="cursor-pointer w-[36px] h-[36px]"
          fallback={
            <div className="flex justify-center items-center w-[34px] h-[34px] cursor-pointer">
              <Image
                src="/svg/earth.svg"
                alt="tools-logo-img"
                width={20}
                height={20}
              />
            </div>
          }
        />
        </Tooltip>
      </Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        show={dropdownOpen}
        ref={workspaceMenuContainerRef as React.Ref<HTMLElement>}
      >
        <div
          style={{ scrollbarWidth: "none" }}
          className="absolute bottom-[50px] border flex max-h-[450px]  overflow-y-auto flex-col gap-2 border-gray-800/20 shadow p-1 px-1 right-0 left-[-12px] z-50 mt-2 origin-bottom-right rounded-full bg-[#272727] min-w-max w-full trasnsition-card"
        >
          <div>
           {pinnedPlugins?.length > 0 &&
              pinnedPlugins?.map((item: any) => {
                return (
                  <Tooltip
                    showArrow={true}
                    content={item?.name}
                    classNames={{
                      base: "before:bg-[#2F2F2F]",
                      content: "text-white bg-[#2F2F2F]",
                    }}
                    placement="left"
                  >
                    <div
                      onClick={() => activeModalHandler(item)}
                      key={item?.id}
                      className={
                        "text-[#CCCCCC] flex items-center justify-between rounded-xl cursor-pointer text-sm font-helvetica !bg-transparent !border-0 p-2 hover:!bg-gray-500 hover:!bg-opacity-15"
                      }
                    >
                      <div className="flex items-center gap-2">
                        <span>
                          {" "}
                          <Avatar
                            src={item?.logo}
                            alt={"tools-image"}
                            showFallback={true}
                            radius="sm"
                            className="2xl:h-[36px] 2xl:w-[36px] xl:h-[36px] xl:w-[36px] h-[36px] w-[36px] cursor-pointer bg-transparent rounded-full"
                            fallback={
                              <Image
                                src={"/svg/user.svg"}
                                alt="tools-logo-img"
                                width={50}
                                height={50}
                              />
                            }
                          />
                        </span>
                      </div>
                    </div>
                  </Tooltip>
                );
              })}
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default SelectModelOnChatPopup;
