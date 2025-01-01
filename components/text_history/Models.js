"use client"

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
import Gpticon from "@/app/assets/svg/gpt4.png";
import { useAuth } from "@/app/authContext/auth";
import { useGetUserToolsQuery } from "@/app/lib/features/chat/chatApi";
import { useAppSelector } from "@/app/lib/hooks";

const filteredModelsAndGptsData = (data) => {
  return data?.reduce(
    (acc, tool) => {
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

const ModelsImages = ({ model_img, onMenuSelection, msgIndex, type }) => {
  const auth = useAuth();
  const activeWorkspaceId = useAppSelector(
    (state) => state?.workspace.activeWorkspace?._id
  );
  const activeGroupId = useAppSelector(
    (state) => state?.group?.currentActiveGroup?._id
  );
  const activeChatId = useAppSelector((state) => state?.chat?.activeChat?.id);
  const { data: getUserToolsData } = useGetUserToolsQuery(
    {},
    { skip: !(auth?.user?.email && auth?.user?.fullname) }
  );

  const result = filteredModelsAndGptsData(
    getUserToolsData?.subscribed_tools ?? []
  );

  return (
    <div className="relative" id="models_icons" style={{ zIndex: "0" }}>
      <Dropdown
        placement="left-start"
        classNames={{
          base: "before:bg-default-200",
          content:
            "py-1 px-1 from-white to-default-200 dark:from-default-50 dark:to-black",
        }}
      >
        <DropdownTrigger>
          <Button
            variant="bordered"
            className="border-0 min-w-max px-0 !outline-none flex-shrink-0 relative group transition-all w-9 h-9"
          >
            <Image
              alt="modal-img"
              width={27}
              height={27}
              src={model_img}
              className="cursor-pointer mb-[2px]"
            />
            <div className="w-[29px] h-[29px] flex items-center rounded-full  bg-black absolute opacity-0 group-hover:opacity-70 justify-center">
              <Responseicon />
            </div>
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          variant="faded"
          classNames={{
            base: "bg-[#171717]",
          }}
          disabledKeys={["notfoundmodels", "notfoundgpts"]}
        >
          <DropdownSection>
            <DropdownItem
              isVirtualized={true}
              endContent={
                <Link href={`/marketplace`}>
                  <EarthIcon className="text-[#858584]" />
                </Link>
              }
              classNames={{
                title: "text-[#858584] text-sm	font-bold	font-helvetica",
                base: "!bg-transparent !border-0",
              }}
            >
              {`Models`}
            </DropdownItem>
          </DropdownSection>

          <DropdownSection classNames={{ MenuItem: "p-0" }}>
            {result?.model?.length > 0 ? (
              result?.model?.map((item) => (
                <DropdownItem
                  key={`${item?.id}`}
                  classNames={{
                    title: "text-[#CCCCCC] text-sm font-helvetica",
                    base: "p-0 my-2 mx-1 !bg-transparent !border-0",
                  }}
                  startContent={
                    <Avatar
                      src={item?.logo}
                      alt={"tools-image"}
                      showFallback={true}
                      radius="sm"
                      className="2xl:h-[34px] 2xl:w-[34px] xl:h-[28px] xl:w-[28px] h-[28px] w-[28px] cursor-pointer bg-transparent"
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
                      type,
                      index: msgIndex,
                      tool_id: item?.id,
                      userID: auth?.user?.userID,
                      workspace_id: activeWorkspaceId,
                      group_id: activeGroupId,
                      id: activeChatId,
                    };
                    onMenuSelection(request, "model");
                  }}
                >
                  {item?.name}
                </DropdownItem>
              ))
            ) : (
              <DropdownItem
                classNames={{
                  title: "text-[#CCCCCC] text-sm font-helvetica",
                  base: "p-0 my-2 mx-1 !bg-transparent !border-0",
                }}
                key={"notfoundmodels"}
              >
                {"No subscribed models found."}
              </DropdownItem>
            )}
          </DropdownSection>

                <DropdownSection title="GPTs" classNames={{ heading: "text-sm font-helvetica text-sm mb-2 block" }}>
                    {(result?.gpt?.length > 0) ? (
                        result?.gpt?.map((item) => (
                            <DropdownItem
                                key={`${item?.id}`}
                                classNames={{
                                    title: "text-[#CCCCCC] text-sm font-helvetica",
                                    base: "p-0 my-2 mx-1 !bg-transparent !border-0",
                                }}
                                startContent={
                                    <Avatar
                                        src={item?.logo}
                                        alt={"tools-image"}
                                        showFallback={true}
                                        radius='sm'
                                        className="2xl:h-[34px] 2xl:w-[34px] xl:h-[28px] xl:w-[28px] h-[28px] w-[28px] cursor-pointer bg-transparent"
                                        fallback={<Image src={"/svg/user.svg"} alt="tools-logo-img" width={50} height={50} />}
                                    />
                                }
                                onClick={() => {
                                    const request = {
                                        type,
                                        index: msgIndex,
                                        userID: auth?.user?.userID,
                                        workspace_id: activeWorkspaceId,
                                        group_id: activeGroupId,
                                        id: activeChatId,
                                        context_tool_id: item?.id,
                                    };
                                    onMenuSelection(request, 'gpt');
                                }}
                            >
                                {item?.name}
                            </DropdownItem>
                        ))
                    ) : (
                        <DropdownItem
                            classNames={{
                                title: "text-[#CCCCCC] text-sm font-helvetica",
                                base: "p-0 my-2 mx-1 !bg-transparent !border-0",
                            }}
                            key={"notfoundgpts"}
                        >
                            {"No subscribed gpts found."}
                        </DropdownItem>
                    )}
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>
    </div>);
}

export default ModelsImages;
