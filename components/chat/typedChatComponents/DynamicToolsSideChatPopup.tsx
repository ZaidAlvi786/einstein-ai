import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";
import Responseicon from "@/app/assets/svg/response-icon.svg";
import EarthIcon from "@/app/assets/svg/earth.svg";
import { useAuth } from "@/app/authContext/auth";
import {
  useGetUserToolsQuery,
} from "@/app/lib/features/chat/chatApi";
import { useAppSelector } from "@/app/lib/hooks";
import { ToolsLogoInfo } from "@/types/ToolTypes";
import {
  toolsStaticIdMapping,
  toolLogoLocalStorageKey,
} from "@/components/constants/ToolContants";
import { useState, useEffect } from "react";
import { DynamicToolsSideChatPopupProps } from "@/types/ToolTypes";
import { staticTools } from "../chatConstants";
import toast from "react-hot-toast";

function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const filteredModelsAndGptsData = (data: any) => {
  return data?.reduce(
    (acc: any, tool: any) => {
      if (tool?.category === "model") {
        acc?.model?.push(tool);
      } else if (tool?.category === "gpt") {
        acc?.gpt?.push(tool);
      }
      return acc;
    },
    { model: [], gpt: [] }
  );
};

const DynamicToolsSideChatPopup: React.FC<DynamicToolsSideChatPopupProps> = ({
  currentMessageVersionIndex,
  onMenuToolSelection,
  currentMessageIndex,
  type,
  message,
  onStaticToolModelClicked,
}) => {
  const auth = useAuth() as any;
  const activeWorkspaceId = useAppSelector(
    (state: any) => state?.workspace.activeWorkspace?._id
  );
  const activeGroupId = useAppSelector(
    (state: any) => state?.group?.currentActiveGroup?._id
  );
  const activeChatId = useAppSelector(
    (state: any) => state?.chat?.activeChat?.id
  );
  const activeChat = useAppSelector((state: any) => state.chat.activeChat);

  const isViewPermission =
    activeChat?.role === "view" || activeChat?.permission_type === "view";

  const { data: getUserToolsData } = useGetUserToolsQuery(
    {},
    { skip: !(auth?.user?.email && auth?.user?.fullname) }
  );

  const result = filteredModelsAndGptsData(
    getUserToolsData?.subscribed_tools ?? []
  );
  // console.log(getUserToolsData, "resultresultresultresult");

  const [toolUrls, setToolUrls] = useState<ToolsLogoInfo>();

  useEffect(() => {
    const storedList = localStorage.getItem(toolLogoLocalStorageKey);
    if (storedList) {
      const parsedData = JSON.parse(storedList) as ToolsLogoInfo;
      setToolUrls(parsedData);
    }
  }, []);

  const getLogoUrlFromMessage = () => {
    if (!toolUrls) {
      return null;
    }
    const toolId =
      message?.content[currentMessageVersionIndex]?.tool_id ||
      toolsStaticIdMapping[message?.content[currentMessageVersionIndex]?.name];

    return toolUrls[toolId as string]?.logo;
  };

  const logoUrl = getLogoUrlFromMessage() || "/svg/user.svg";

  const showAlert = () => {
    if (isViewPermission) {
      toast.error("You have only permission to view.");
    }
  };

  return (
    <div
      className="relative 4k:h-[54px] h-[27px] mt-[2px]"
      id="models_icons"
      style={{ zIndex: "0" }}
    >
      <Dropdown
        placement="left-start"
        classNames={{
          base: "before:bg-default-200",
          content: "py-[11px] px-[11px] bg-[#121212] rounded-[12px]",
        }}
      >
        <DropdownTrigger>
          <Button
            variant="bordered"
            className="border-0 min-w-max px-0 !outline-none flex-shrink-0 relative group transition-all 4k:h-[54px] 4k:w-[54px] w-[27px] h-[27px]"
            onClick={showAlert}
          >
            <Image
              alt="modal-img"
              width={27}
              height={27}
              src={logoUrl}
              className="cursor-pointer"
            />
            {!isViewPermission && (
              <div className="w-[27px] h-[27px] 4k:h-[54px] 4k:w-[54px] flex items-center rounded-full  bg-black absolute opacity-0 group-hover:opacity-70 justify-center">
                <Responseicon />
              </div>
            )}
          </Button>
        </DropdownTrigger>
        {!isViewPermission && (
          <DropdownMenu
            variant="faded"
            classNames={{
              base: "bg-[#121212]",
              list: "flex flex-col gap-[7.75px]",
            }}
            disabledKeys={["notfoundmodels", "notfoundgpts"]}
          >
            <DropdownSection className="mb-[4px]">
              <DropdownItem
                className="p-0 mb-0"
                isVirtualized={true}
                endContent={
                  <Link href={`/marketplace`}>
                    <EarthIcon className="text-[#858584]" />
                  </Link>
                }
                classNames={{
                  title:
                    "text-[#858584] text-sm leading-normal	font-normal	font-helvetica",
                  base: "!bg-transparent !border-0 mb-0",
                }}
              >
                {`Models`}
              </DropdownItem>
            </DropdownSection>

            <DropdownSection className="mb-0">
              {result?.model?.length > 0
                ? result?.model?.map((item: any) => (
                    <DropdownItem
                      key={`${item?.id}`}
                      classNames={{
                        title:
                          "text-[#CCCCCC] text-sm font-bold font-helvetica",
                        base: "p-0 my-0 mx-0 !bg-transparent !border-0",
                      }}
                      startContent={
                        <Avatar
                          src={item?.logo}
                          alt={"tools-image"}
                          showFallback={true}
                          radius="sm"
                          className="2xl:h-[34px] rounded-[100.189px] 2xl:w-[34px] xl:h-[34px] xl:w-[34px] h-[34px] w-[34px] cursor-pointer bg-transparent"
                          fallback={
                            <Image
                              src={"/svg/user.svg"}
                              alt="tools-logo-img"
                              width={50}
                              height={50}
                            />
                          }
                        />
                      }
                      onClick={() => {
                        const request = {
                          type: type,
                          index: currentMessageIndex,
                          tool_id: item?.id,
                          userID: auth?.user?.userID,
                          workspace_id: activeWorkspaceId,
                          group_id: activeGroupId,
                          id: activeChatId,
                        };
                        onMenuToolSelection(request, "model");
                      }}
                    >
                      {item?.name}
                    </DropdownItem>
                  ))
                : ""}
              {staticTools.map((item: any) => (
                <DropdownItem
                  key={`${item?.id}`}
                  classNames={{
                    title: "text-[#CCCCCC] font-bold text-sm font-helvetica",
                    base: "p-0 my-0 mx-0 !bg-transparent !border-0 mt-2",
                  }}
                  startContent={
                    <Avatar
                      src={item?.logo}
                      alt={"tools-image"}
                      showFallback={true}
                      radius="sm"
                      className="2xl:h-[34px] rounded-[50px] 2xl:w-[34px] xl:h-[34px] xl:w-[34px] h-[34px] w-[34px] cursor-pointer bg-transparent"
                      fallback={
                        <Image
                          src={"/svg/user.svg"}
                          alt="tools-logo-img"
                          width={50}
                          height={50}
                        />
                      }
                    />
                  }
                  onClick={() => {
                    onStaticToolModelClicked(item);
                  }}
                >
                  {item?.name}
                </DropdownItem>
              ))}
            </DropdownSection>

            <DropdownSection
              title="GPTs"
              classNames={{
                base: "mt-[12px]",
                heading:
                  "text-[#858584] p-0 font-helvetica text-sm mb-[13px] block",
                group: "!pt-0 flex flex-col gap-[8px]",
              }}
            >

              {result?.gpt?.length > 0 ? (
                result?.gpt?.map((item: any) => (
                  <DropdownItem
                    key={`${item?.id}`}
                    classNames={{
                      title: "text-[#CCCCCC] font-bold text-sm font-helvetica",
                      base: "p-0 my-0 mx-0 !bg-transparent !border-0",
                    }}
                    startContent={
                      <Avatar
                        src={item?.logo}
                        alt={"tools-image"}
                        showFallback={true}
                        radius="sm"
                        className="2xl:h-[34px] rounded-[50px] 2xl:w-[34px] xl:h-[34px] xl:w-[34px] h-[34px] w-[34px] cursor-pointer bg-transparent"
                        fallback={
                          <Image
                            src={"/svg/user.svg"}
                            alt="tools-logo-img"
                            width={50}
                            height={50}
                          />
                        }
                      />
                    }
                    onClick={() => {
                      const request = {
                        type: item?.chat_model,
                        index: currentMessageIndex,
                        userID: auth?.user?.userID,
                        workspace_id: activeWorkspaceId,
                        group_id: activeGroupId,
                        id: activeChatId,
                        context_tool_id: item?.chat_model,
                      };
                      onMenuToolSelection(request, "gpt");
                    }}
                  >
                    {item?.name}
                  </DropdownItem>
                ))
              ) : ( // check if above case-1 gpt's length is also 0 then show  
                 <DropdownItem
                  classNames={{
                    title: "text-[#CCCCCC] text-sm font-helvetica",
                    base: "p-0 my-0 mx-1 !bg-transparent !border-0",
                  }}
                  key={"notfoundgpts"}
                >
                  {"No subscribed gpts found."}
                </DropdownItem>
              )}
            </DropdownSection>
          </DropdownMenu>
        )}
      </Dropdown>
    </div>
  );
};

export default DynamicToolsSideChatPopup;
