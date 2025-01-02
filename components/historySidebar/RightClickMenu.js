"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import PinIcon from "@/app/assets/svg/PinIcon.svg";
import UnPinIcon from "@/app/assets/svg/UnpinIcon.svg";
import { EllipsisHorizontalIcon, ShareIcon } from "@heroicons/react/20/solid";
import {
  useDuplicateChatIdMutation,
  useGetAllGroupByWorkspaceIdQuery,
  useGetHistoryByWorkspaceIdQuery,
  usePutChangeChatStateMutation,
  useTransferChatToAnotherGroupMutation,
} from "@/app/lib/features/chat/chatApi";
import { useGetAllWorkspacesQuery } from "@/app/lib/features/workspace/workspaceApi";
import { useAuth } from "@/app/authContext/auth";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { setActiveChat } from "@/app/lib/features/chat/chatSlice";
import MoveIcon from "@/app/assets/svg/move.svg";
import DuplicateChatIcon from "@/app/assets/svg/duplicate-chat.svg";
import DeleteIcon from "@/app/assets/svg/delete.svg";
import { Avatar } from "@nextui-org/react";
import ShareAndInviteModal from "./ShareAndInvite/ShareAndInviteModel";
import toast from "react-hot-toast";
import ToastService from "../Toaster/toastService";
import DeleteChatConfirmationModal from "./deleteConfirmation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ChatOperation = {
  Active: "Active",
  Pinned: "Pinned",
  Delete: "Delete",
  Share: "Share/Invite",
};

const WorkspaceListInChatMenu = ({ item, key, chatId }) => {
  const auth = useAuth();
  const { data: allGroupsList } = useGetAllGroupByWorkspaceIdQuery(item?._id, {
    skip: !item?._id,
  });
  const activeWorkspace = useAppSelector(
    (state) => state.workspace.activeWorkspace
  );
  const activeGroup = useAppSelector((state) => state.group.currentActiveGroup);
  const [TransferChatToAnotherGroup] = useTransferChatToAnotherGroupMutation();

  const HandleMoveToChatToAnotherGroup = (chat_id, group_id, workspace_id) => {
    const data = {
      user_id: auth?.user?.userID,
      group_id,
      chat_id,
      workspace_id,
    };

    TransferChatToAnotherGroup(data)
      .unwrap()
      .then((response) => {
        console.log("Response : ", response);
      })
      .catch((error) => {
        console.log("Error : ", error);
        toast.error(error?.data?.message);
      });
  };

  const HandleMoveToChatToAnotherGroupV2 = (chat_id, workspace_id) => {
    const groupDetail = allGroupsList?.data?.find(
      (x) => x.workspace_id == workspace_id
    );
    const data = {
      user_id: auth?.user?.userID,
      group_id: groupDetail?._id,
      chat_id,
      workspace_id,
    };

    TransferChatToAnotherGroup(data)
      .unwrap()
      .then((response) => {
        console.log("Response : ", response);
      })
      .catch((error) => {
        console.log("Error : ", error);
        toast.error(error?.data?.message);
      });
  };

  return allGroupsList?.data?.length > 1 ? (
    <Menu key={key} placement="right-start" allowHover offset={15}>
      <MenuHandler>
        <MenuItem className="flex pt-2 gap-2 hover:bg-[#505050] cursor-pointer items-center py-1 px-[10px]">
          <Avatar className="h-8 w-8" src={item?.logo_url} showFallback />
          <div>
            <p className="font-bold text-white font-helvetica">{item?.name}</p>
            {/* <span className="font-medium text-xs text-[#818181] font-helvetica">{"Premium Plan 3 member"}</span> */}
          </div>
        </MenuItem>
      </MenuHandler>
      <MenuList className="bg-[#2F2F2F] border-0 text-white shadow-md p-1.5">
        {allGroupsList?.data?.map((group, index) => (
          <MenuItem
            onClick={() =>
              HandleMoveToChatToAnotherGroup(chatId, group?._id, item?._id)
            }
            key={index}
            className="flex pt-2 gap-2 hover:bg-[#505050] cursor-pointer items-center px-[10px]"
            disabled={activeGroup?._id === group?._id}
          >
            <div className="text-white capitalize font-helvetica">
              {group?.name}
            </div>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  ) : (
    <MenuItem
      key={key}
      className="flex pt-2 gap-2 hover:bg-[#505050] cursor-pointer items-center py-1 px-[10px]"
      disabled={activeWorkspace?._id === item?._id}
    >
      <Avatar className="h-8 w-8" src={item?.logo_url} showFallback />
      <div>
        <p
          className="font-bold text-white text-sm font-helvetica"
          onClick={() => HandleMoveToChatToAnotherGroupV2(chatId, item?._id)}
        >
          {item?.name}
        </p>
      </div>
    </MenuItem>
  );
};

const RightClickChatMenu = ({
  isPinned,
  showEllipsis,
  chatId,
  isUnArchive,
  NewChat = () => {},
  isContextMenuClick,
  setIsContextMenuClick,
}) => {
  const auth = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const activeChat = useAppSelector((state) => state.chat.activeChat);
  const activeWorkspace = useAppSelector(
    (state) => state.workspace.activeWorkspace
  );
  const activeGroup = useAppSelector((state) => state.group.currentActiveGroup);
  const [loadingOperations, setLoadingOperations] = useState([]);
  const [deleteChat, setDeleteChat] = useState({});
  const [openShareAndInviteModel, setOpenShareAndInviteModel] = useState({
    open: false,
    chat_id: "",
  });
  const { data: allGroupsList } = useGetAllGroupByWorkspaceIdQuery(
    activeWorkspace?._id,
    { skip: !activeWorkspace?._id }
  );
  const { data: allWorkSpaces } = useGetAllWorkspacesQuery(auth?.user?.userID, {
    skip: !auth?.user?.userID,
  });
  const [changeChatStateMutation] = usePutChangeChatStateMutation();
  const [TransferChatToAnotherGroup] = useTransferChatToAnotherGroupMutation();
  const [duplicateChat] = useDuplicateChatIdMutation();

  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const menuRef = useRef(null); // Reference for the menu container
  const triggerRef = useRef(null); // Reference for the menu container
  const {
    refetch: historyByWorkspaceIdRefetch,
  } = useGetHistoryByWorkspaceIdQuery(
    {
      workspace_id: activeWorkspace?._id,
      group_id: activeGroup?._id,
      search_text: '',
    },
    { skip: !activeWorkspace?._id || !activeGroup?._id }
  );

  useEffect(() => {
    if (isContextMenuClick) {
      handleClick(triggerRef.current, true);
    }
  }, [isContextMenuClick]);

  const updateChatHandler = async ({ state, key, workspaceId }) => {
    let payload = { state, msgIndex: chatId };
    setLoadingOperations((prev) => [...prev, key]);
    switch (key) {
      case "move":
        payload.workspace_id = workspaceId;
        break;
      default:
    }
    try {
      await changeChatStateMutation(payload).unwrap();
    } catch (error) {
      toast.error("An error occurred while updating the pin status.");
    } finally {
      setLoadingOperations((prev) => prev.filter((value) => value !== key));
      if (state === ChatOperation.Delete && activeChat?.id === chatId) {
        dispatch(setActiveChat({}));
        NewChat();
      }
      if (payload.state === "Pinned" || payload.state === "Active") {
        toast.success(
          `Chat ${
            payload.state === "Pinned" ? "Pinned" : "Unpin"
          } successfully.`
        );
      }
    }
  };
  useEffect(() => {
    if (deleteChat?.isDeleted === true) {
      dispatch(setActiveChat({}));
      NewChat();
    }
  }, [deleteChat?.isDeleted === true]);
  const deleteChatChatHandler = async ({ state, key, workspaceId }) => {
    setDeleteChat({
      open: true,
      state: state,
      isDeleted: false,
      msgIndex: chatId,
    });
  };

  const HandleMoveToChatToAnotherGroup = (chat_id, group_id) => {
    const data = {
      user_id: auth?.user?.userID,
      group_id,
      chat_id,
      workspace_id: activeWorkspace?._id,
    };

    TransferChatToAnotherGroup(data)
      .unwrap()
      .then((response) => {
        console.log("Response : ", response);
      })
      .catch((error) => {
        console.log("Error : ", error);
        toast.error(error?.data?.message);
      });
  };

  const HandleDuplicateChat = async ({ chat_id }) => {
    const data = {
      chat_id: chatId,
    };
    duplicateChat(data)
      .unwrap()
      .then((response) => {
        historyByWorkspaceIdRefetch();
      })
      .catch((error) => {
        console.log("Error : ", error);
        toast.error(error?.data?.message);
      });
  };

  const handleClick = (event, isContextMenuClick) => {
    setAnchorEl(isContextMenuClick ? event : event.currentTarget);
  };

  // Close menu
  const handleClose = () => {
    setAnchorEl(null);
    setIsContextMenuClick(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <>
      <div ref={menuRef}>
        <Menu
          placement="right-start"
          anchorEl={anchorEl}
          open={isOpen}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuHandler>
            <div>
              {showEllipsis || isOpen ? (
                <EllipsisHorizontalIcon
                  onClick={handleClick}
                  ref={triggerRef}
                  className="w-[17.62px] h-[17.62px] text-[#ABABAB]"
                />
              ) : isPinned ? (
                <Image
                  src={"/svg/pin-icon.svg"}
                  alt="model-img"
                  width={"4k" ? 24 : 10.622}
                  height={"4k" ? 24 : 10.622}
                  className="h-[13.27px] w-[13.27px] 4k:h-[25px] 4k:w-[25px]"
                />
              ) : (
                <></>
              )}
            </div>
          </MenuHandler>
          <MenuList className="flex flex-col bg-[#2F2F2F] border-0 text-white shadow-md gap-[10px] p-[10px] !z-[9999]">
            <MenuItem
              className="flex !py-0 h-[30px] gap-2 hover:bg-[#505050] cursor-pointer items-center  px-[10px]"
              disabled={loadingOperations.includes("pin")}
              onClick={() =>
                updateChatHandler({
                  state: isPinned ? ChatOperation.Active : ChatOperation.Pinned,
                  key: "pin",
                })
              }
            >
              <div className="h-[20px] w-[23px] flex justify-center items-center">
                {isPinned ? <UnPinIcon /> : <PinIcon />}
              </div>
              <div className="font-inter text-[14px] font-normal">
                {isPinned
                  ? `${
                      loadingOperations.includes("pin") ? "UnPinning" : "Unpin"
                    }`
                  : `${loadingOperations.includes("pin") ? "Pinning" : "Pin"}`}
              </div>
            </MenuItem>
            {allGroupsList?.data?.length > 0 ? (
              <Menu placement="right-start" allowHover offset={15}>
                <MenuHandler>
                  <MenuItem className="flex !py-[3px]  gap-2 hover:bg-[#505050] cursor-pointer items-center px-[10px]">
                    <div>
                      <MoveIcon />
                    </div>
                    <div className="font-inter text-[14px] font-normal">
                      {"Move to Group"}
                    </div>
                  </MenuItem>
                </MenuHandler>
                <MenuList className="bg-[#2F2F2F] border-0 !py-0 text-white shadow-md px-1.5">
                  {allGroupsList?.data?.map((item, key) => (
                    <MenuItem
                      onClick={() =>
                        HandleMoveToChatToAnotherGroup(chatId, item?._id)
                      }
                      key={key}
                      className="flex pt-2 gap-2 hover:bg-[#505050] cursor-pointer items-center px-[10px]"
                      disabled={activeGroup?._id === item?._id}
                    >
                      <div className="text-white capitalize font-helvetica text-[14px]">
                        {item.name}
                      </div>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            ) : (
              <MenuItem className="flex !py-0 gap-2 hover:bg-[#505050] cursor-pointer items-center px-[10px]">
                <div>
                  <MoveIcon />
                </div>
                <div className="font-inter text-[14px] font-normal">
                  {"Move to Group"}
                </div>
              </MenuItem>
            )}
            {allWorkSpaces?.data?.length > 0 ? (
              <Menu placement="right-start" allowHover offset={15}>
                <MenuHandler>
                  <MenuItem className="flex !py-0 h-[30px] gap-2 hover:bg-[#505050] cursor-pointer items-center px-[10px]">
                    <div>
                      <MoveIcon />
                    </div>
                    <div className="font-inter text-[14px] font-normal">
                      {"Move to Workspace"}
                    </div>
                  </MenuItem>
                </MenuHandler>
                <MenuList className="bg-[#2F2F2F] border-0  text-white text-[14px] shadow-md px-1.5">
                  {allWorkSpaces?.data?.map((item, key) => (
                    <WorkspaceListInChatMenu
                      key={key}
                      item={item}
                      chatId={chatId}
                    />
                  ))}
                </MenuList>
              </Menu>
            ) : (
              <MenuItem className="flex !py-0 h-[30px] gap-2 hover:bg-[#505050] cursor-pointer items-center px-[10px]">
                <div>
                  <MoveIcon />
                </div>
                <div className="font-inter text-[14px] font-normal">
                  {"Move to Workspace"}
                </div>
              </MenuItem>
            )}
            {auth?.user?.fullname && auth?.user?.email && (
              <>
                <MenuItem
                  className="flex gap-2 hover:bg-[#505050] cursor-pointer !py-0 h-[30px] items-center px-[10px]"
                  onClick={() => HandleDuplicateChat({ chat_id: chatId })}
                >
                  <div>
                    <DuplicateChatIcon />
                  </div>
                  <div className="font-inter text-[14px] font-normal">
                    {"Duplicate Chat"}
                  </div>
                </MenuItem>
                <MenuItem
                  className="flex gap-2 hover:bg-[#505050] cursor-pointer !py-0 h-[30px] items-center px-[10px]"
                  onClick={() =>
                    setOpenShareAndInviteModel({ open: true, chat_id: chatId })
                  }
                >
                  <div>
                    <ShareIcon className="h-[20px] w-[23px]" />
                  </div>
                  <div className="font-inter text-[14px] font-normal">
                    {loadingOperations.includes("share")
                      ? "Sharing Chat"
                      : "Share/Invite"}
                  </div>
                </MenuItem>
              </>
            )}
            <MenuItem
              className="flex gap-2 hover:bg-[#505050] cursor-pointer !py-0 h-[30px] items-center px-[10px]"
              disabled={loadingOperations.includes("delete")}
              onClick={() =>
                deleteChatChatHandler({
                  state: ChatOperation.Delete,
                  key: "delete",
                })
              }
            >
              <div>
                <DeleteIcon />
              </div>
              <div className="text-[#E54637] font-helvetica text-[14px]">
                {loadingOperations.includes("delete") ? "Deleting" : "Delete"}
              </div>
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
      {/* Share and Invite Model */}
      {openShareAndInviteModel?.open && (
        <ShareAndInviteModal
          isOpen={openShareAndInviteModel}
          onOpenChange={setOpenShareAndInviteModel}
        />
      )}
      <ToastService />
      <DeleteChatConfirmationModal
        deleteChat={deleteChat}
        setDeleteChat={setDeleteChat}
        chat_info={chatId}
      />
    </>
  );
};

export default RightClickChatMenu;