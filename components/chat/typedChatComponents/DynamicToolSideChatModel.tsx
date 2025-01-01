import React, { useCallback, useRef } from "react";
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
  useUnsubscribeToolMutation,
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
import { Transition } from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import InformationCircleIcon from "@/app/assets/svg/Information-circle-icon.svg";
import Trashicon from "@/app/assets/svg/trash-icon.svg";
import { Fragment } from "react";
import { useOnClickOutside } from "@/app/hooks/useOnClickOutside";
import AddToGptIcon from "@/app/assets/svg/add_to_gpt_icon.svg";
import { useRouter, useSearchParams } from "next/navigation";
import CancelSubscriptionModal from "../../billing/CancelSubscriptionModal";

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
  const router = useRouter();
  const searchParams = useSearchParams();

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const workspaceMenuContainerRef = useRef<HTMLElement>();
  useOnClickOutside(workspaceMenuContainerRef, () => setDropdownOpen(false));
  const [isOpenCancelSubsModal, setisOpenCancelSubsModal] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [removeToolSubsId, setRemoveToolSubsId] = useState<any>(null);

  const result = filteredModelsAndGptsData(
    getUserToolsData?.subscribed_tools ?? []
  );
  const [UnsubscribeTool, isMutationLoading] = useUnsubscribeToolMutation();

  console.log("🚀 ~ result:", result);
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
  const handleToggleDropdown = (e: any) => {
    e?.preventDefault();
    setDropdownOpen((prev) => !prev);
  };

  const createMultipleQueryString = useCallback(
    (paramsToUpdate: any) => {
      const newParams = new URLSearchParams(searchParams);

      Object.keys(paramsToUpdate).forEach((param) => {
        newParams.set(param, paramsToUpdate[param]);
      });

      return newParams.toString();
    },
    [searchParams]
  );

  const navigateToolDetailsPage = (model: any) => {
    router.push(
      "/marketplace/tools-details" +
        "?" +
        createMultipleQueryString({ tool_id: model.id })
    );
  };

  const openCancelSubsModal = (model: any) => {
    console.log("🚀  openCancelSubsModal  model:", model);
    setRemoveToolSubsId(model);
    setIsConfirm(true);
    setDropdownOpen(false);
  };

  const menuItems = JSON.parse(localStorage.getItem("menuItemsOrder") || "[]");
  const pinnedPlugins = JSON.parse(
    localStorage.getItem("pinnedItemsOrder") || "[]"
  );

  const handleRemove = () => {
    try {
      UnsubscribeTool({ subscription_id: removeToolSubsId?.subscription_id })
        .unwrap()
        .then((response) => {
          toast.success(response?.message);
          setTimeout(() => {
            window.location.reload();
          }, 700);
          const removeFromTogleBox = menuItems.filter(
            (item: any) =>
              item.subscription_id !== removeToolSubsId?.subscription_id
          );
          const removeFromTogleBar = pinnedPlugins.filter(
            (item: any) =>
              item.subscription_id !== removeToolSubsId?.subscription_id
          );
          localStorage.setItem(
            "menuItemsOrder",
            JSON.stringify([...removeFromTogleBox])
          );
          localStorage.setItem(
            "pinnedItemsOrder",
            JSON.stringify([...removeFromTogleBar])
          );
        })
        .catch((error) => {
          toast.error(
            (error?.data?.detail ?? error?.message) || "Something went wrong"
          );
        });
    } catch (error) {
      console.log("error: ", error);
    }
    // if (fromPinned) {
    //   const filtered = pinnedPlugins.filter((item) => item.id !== id);
    //   setPinnedPlugins(filtered);
    //   localStorage.setItem("pinnedItemsOrder", JSON.stringify(filtered));
    // } else {
    //   const filtered = menuItems.filter((item) => item.id !== id);
    //   setMenuItems(filtered);
    //   localStorage.setItem("menuItemsOrder", JSON.stringify(filtered));
    // }
  };

  return (
    <div
      className="relative 4k:h-[54px] h-[27px] mt-[2px]"
      id="models_icons"
      // style={{ zIndex: "99" }}
    >
      <Button
        variant="bordered"
        className="border-0 min-w-max px-0 !outline-none flex-shrink-0 relative group transition-all 4k:h-[54px] 4k:w-[54px] w-[27px] h-[27px]"
        onClick={handleToggleDropdown}
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
        <div className="absolute border flex max-h-[300px] overflow-y-auto flex-col gap-2 border-gray-800/20 shadow p-3 px-3 right-0 left-0 z-50 mt-2 origin-top-right rounded-[12px] bg-black min-w-[252px] w-full trasnsition-card">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[#858584] text-sm	font-regular	font-helvetica mb-1">
                {`Models`}
              </span>
              <Link href={`/marketplace`}>
                <EarthIcon className="text-[#858584]" />
              </Link>
            </div>
            {result?.model?.length > 0 ? (
              result?.model?.map((item: any) => {
                return (
                  <div
                    key={item?.id}
                    className={
                      "text-[#CCCCCC] flex items-center justify-between rounded-xl cursor-pointer text-sm font-helvetica !bg-transparent !border-0 p-2 hover:!bg-gray-500 hover:!bg-opacity-15"
                    }
                    onClick={() => {
                      const request = {
                        type: type,
                        index: currentMessageIndex,
                        request_type: "regenerate",
                        tool_id: item?.id,
                        userID: auth?.user?.userID,
                        workspace_id: activeWorkspaceId,
                        group_id: activeGroupId,
                        id: activeChatId,
                      };
                      onMenuToolSelection(request, "model");
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span>
                        {" "}
                        <Avatar
                          src={item?.logo}
                          alt={"tools-image"}
                          showFallback={true}
                          radius="sm"
                          className="2xl:h-[24px] 2xl:w-[24px] xl:h-[24px] xl:w-[24px] h-[24px] w-[24px] cursor-pointer bg-transparent rounded-full"
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
                      {item?.name}
                    </div>
                    <span>
                      <Dropdown
                        className="font-helvetica"
                        classNames={{
                          content:
                            "bg-[#2F2F2F] min-w-48 shadow-[0px 0px 1px 0px rgba(0, 0, 0, 0.25)] p-1.5",
                        }}
                        placement="bottom-start"
                        closeOnSelect={true}
                      >
                        <DropdownTrigger>
                          <div>
                            <EllipsisHorizontalIcon className="w-5 h-5 text-[#ABABAB]" />
                          </div>
                        </DropdownTrigger>
                        <DropdownMenu classNames={{ base: "p-0" }}>
                          <DropdownItem
                            onClick={() => navigateToolDetailsPage(item)}
                            className="px-2.5 py-2 data-[hover=true]:bg-[#505050]"
                            startContent={
                              <>
                                <InformationCircleIcon />
                              </>
                            }
                          >
                            <p className="text-white text-sm flex items-center font-normal gap-[11px]">{`View Details`}</p>
                          </DropdownItem>

                          {item?.subscription_id && (
                            <DropdownItem
                              onClick={() => openCancelSubsModal(item)}
                              className="px-2.5 py-2 data-[hover=true]:bg-[#505050]"
                              startContent={
                                <>
                                  <Trashicon className="-left-[1px] relative" />
                                </>
                              }
                            >
                              <p className="text-[#E54637] text-sm flex items-center font-normal gap-[11px]">{`Remove Tool`}</p>
                            </DropdownItem>
                          )}
                        </DropdownMenu>
                      </Dropdown>
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className={"text-[#CCCCCC] text-sm font-helvetica"}>
                  {"No Model found."}
                </span>
              </div>
            )}
          </div>
          {/* <div>
            {staticTools?.length > 0 &&
              staticTools.map((item: any) => {
                return (
                  <div
                    key={item?.id}
                    className={
                      "text-[#CCCCCC] flex items-center justify-between rounded-xl cursor-pointer text-sm font-helvetica !bg-transparent !border-0 p-2 hover:!bg-gray-500 hover:!bg-opacity-15"
                    }
                  >
                    <div
                      className="flex items-center gap-2"
                      onClick={() => {
                        onStaticToolModelClicked(item);
                      }}
                    >
                      <span>
                        {" "}
                        <Avatar
                          src={item?.logo}
                          alt={"tools-image"}
                          showFallback={true}
                          radius="sm"
                          className="2xl:h-[24px] 2xl:w-[24px] xl:h-[24px] xl:w-[24px] h-[24px] w-[24px] cursor-pointer bg-transparent rounded-full"
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
                      {item?.name}
                    </div>
                  </div>
                );
              })}
          </div> */}
          <div>
            <span className="text-[#858584] text-sm	font-regular	font-helvetica mb-1">
              {`GPTs`}
            </span>
            {result?.gpt?.length > 0 ? (
              result?.gpt?.map((item: any) => {
                return (
                  <div
                    key={item?.id}
                    className={
                      "text-[#CCCCCC] flex items-center justify-between rounded-xl cursor-pointer text-sm font-helvetica !bg-transparent !border-0 p-2 hover:!bg-gray-500 hover:!bg-opacity-15"
                    }
                    onClick={() => {
                      const request = {
                        type: item?.chat_model,
                        index: currentMessageIndex,
                        userID: auth?.user?.userID,
                        request_type: "regenerate",
                        tool_id: item?.id,
                        workspace_id: activeWorkspaceId,
                        group_id: activeGroupId,
                        id: activeChatId,
                        context_tool_id: item?.chat_model,
                      };
                      onMenuToolSelection(request, "gpt");
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span>
                        {" "}
                        <Avatar
                          src={item?.logo}
                          alt={"tools-image"}
                          showFallback={true}
                          radius="sm"
                          className="2xl:h-[24px] 2xl:w-[24px] xl:h-[24px] xl:w-[24px] h-[24px] w-[24px] cursor-pointer bg-transparent rounded-full"
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
                      {item?.name}
                    </div>
                    <span>
                      <Dropdown
                        className="font-helvetica"
                        classNames={{
                          content:
                            "bg-[#2F2F2F] min-w-48 shadow-[0px 0px 1px 0px rgba(0, 0, 0, 0.25)] p-1.5",
                        }}
                        placement="bottom-start"
                        closeOnSelect={true}
                      >
                        <DropdownTrigger>
                          <div>
                            <EllipsisHorizontalIcon className="w-5 h-5 text-[#ABABAB]" />
                          </div>
                        </DropdownTrigger>
                        <DropdownMenu classNames={{ base: "p-0" }}>
                          <DropdownItem
                            onClick={() => navigateToolDetailsPage(item)}
                            className="px-2.5 py-2 data-[hover=true]:bg-[#505050]"
                            startContent={
                              <>
                                <InformationCircleIcon />
                              </>
                            }
                          >
                            <p className="text-white text-sm flex items-center font-normal gap-[11px]">{`View Details`}</p>
                          </DropdownItem>

                          {item?.subscription_id && (
                            <DropdownItem
                              onClick={() => openCancelSubsModal(item)}
                              className="px-2.5 py-2 data-[hover=true]:bg-[#505050]"
                              startContent={
                                <>
                                  <Trashicon className="-left-[1px] relative" />
                                </>
                              }
                            >
                              <p className="text-[#E54637] text-sm flex items-center font-normal gap-[11px]">{`Remove Tool`}</p>
                            </DropdownItem>
                          )}
                        </DropdownMenu>
                      </Dropdown>
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className={"text-[#CCCCCC] text-sm font-helvetica"}>
                  {"No GPTs found."}
                </span>
              </div>
            )}
          </div>
        </div>
      </Transition>
      <CancelSubscriptionModal
        isOpenCancelSubsModal={isOpenCancelSubsModal}
        setisOpenCancelSubsModal={(v: any) => setisOpenCancelSubsModal(v)}
        setIsConfirm={setIsConfirm}
        isConfirm={isConfirm}
        handleCancelSubscription={handleRemove}
        isMutationLoading={false}
      />
    </div>
  );
};

export default DynamicToolsSideChatPopup;
