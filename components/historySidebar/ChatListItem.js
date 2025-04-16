"use client";

import React, { useState, useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  setActiveChat,
  setActiveChatModel,
  setChatRegenerate,
} from "@/app/lib/features/chat/chatSlice";
import ChatIcon from "../../app/assets/image/chat-icon.svg";
import RightClickMenu from "./RightClickMenu";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/app/authContext/auth";
import { Image, Tooltip } from "@nextui-org/react";
import { usePutUpdateChatTitleMutation } from "@/app/lib/features/chat/chatApi";
import toast from "react-hot-toast";
import { useOnClickOutside } from "@/app/hooks/useOnClickOutside";

const ChatListItem = ({
  idKey,
  setHoveredItem = () => {},
  isActive,
  isUnArchive,
  index,
  item,
  showEllipsis,
  handleClose = () => {},
  NewChat = () => {},
  getHistoryDetail = () => {},
}) => {
  const auth = useAuth();
  const titleInputRef = useRef(null);
  const dispatch = useAppDispatch();
  const [openMenu, setOpenMenu] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  // const activeChatId = searchParams.get("chat");
  const { id: activeChatId } = useAppSelector((state) => state.chat.activeChat);
  const [isTitleEdit, setisTitleEdit] = useState(false);
  const [titleText, setTitleText] = useState("");
  const [isContextMenuClick, setIsContextMenuClick] = useState(false);
  useOnClickOutside(titleInputRef, () => setisTitleEdit(false));


  const [updateChatTitle, { isLoading, isError, error, isSuccess }] =
    usePutUpdateChatTitleMutation();

  useEffect(() => {
    setisTitleEdit(false);
  }, [activeChatId]);

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    if (isTitleEdit && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isTitleEdit]);

  useEffect(() => {
    if (activeChatId === item?.id) {
      dispatch(setActiveChat(item));
      getHistoryDetail(item, "text");
    }
  }, [activeChatId]);

  const handleChatClick = () => {
    if (activeChatId === item?.id) {
      console.log("Edit");
      setisTitleEdit(true);
      setTitleText(item?.title);
    } else {
      // dispatch(setActiveChatModel({}));
      localStorage.setItem("activeChatLocalStorage", JSON.stringify(item));
      dispatch(setActiveChat(item));
      dispatch(
        setChatRegenerate({ canRegenerate: false, isRegenerating: false })
      );
      getHistoryDetail(item, "text");
      // router.push("/" + "?" + createQueryString("chat", item?.id || "new"));
      router.push("/");
    }
  };

  const handleUpdateTitle = (e) => {
    if (e.key === "Enter") {
      const payload = {
        chat_id: item?.id,
        title: titleText,
      };

      updateChatTitle(payload)
        .unwrap()
        .then((response) => {
          setisTitleEdit(false);
          dispatch(setActiveChat({ ...item, title: titleText }));
          toast.success(response?.message);
        });

      console.log("edit");
    }
  };

  return (
    <>
      <Tooltip
        content={<p className="text-[#FFF]">{item.title}</p>}
        showArrow
        placement="right"
        delay={1000}
        closeDelay={1000}
        classNames={{
          base: "before:bg-[#2E353C] w-[200px] ml-2",
          content: "bg-[#272727] text-sm font-normal leading-4 px-3 py-2",
        }}
        motionProps={{
          variants: {
            exit: {
              opacity: 0,
              transition: {
                duration: 0.1,
                ease: "easeIn",
              },
            },
            enter: {
              opacity: 1,
              transition: {
                duration: 0.15,
                ease: "easeOut",
              },
            },
          },
        }}
      >
        {/* {(auth && auth?.user?.fullname && auth?.user?.email) && <span className={`absolute left-0 top-[15px] w-1.5 h-1.5 ${(item?.has_unread_messages) ? "bg-[#41A9FF]" : "bg-transparent"} rounded-full shrink-0`} />} */}
        <li
          key={idKey}
          onMouseEnter={() => setHoveredItem(idKey)}
          onMouseLeave={() => setHoveredItem(null)}
          className={`flex gap-3 mb-1 justify-between items-center h-[34.522px] hover:bg-[#232323] px-[8px] cursor-pointer rounded-lg transition-all ${
            isActive ? "bg-[#232323]" : ""
          }`}
          draggable
          onDragStart={(event) => {
            if (event) {
              event?.dataTransfer?.setData("chat_id", item?.id);
            }
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            setIsContextMenuClick(true);
          }}
        >
          <div
            className="flex gap-3 items-center w-[91%] h-[34.522px] group"
            onClick={handleChatClick}
          >
            {isTitleEdit ? (
              <input
                ref={titleInputRef}
                className="text-[#E9E9E9] bg-[#232323] border-none outline-none w-full text-[12.39px]"
                value={titleText}
                onChange={(e) => setTitleText(e.target.value)}
                onKeyDown={(e) => handleUpdateTitle(e)}
              />
            ) : (
              <p
                className={`mb-0 ${
                  isActive ? "text-[#E9E9E9]" : "text-[#BABABA]"
                } group-hover:text-[#E9E9E9] font-normal 4k:text-[26px] 2k:text-[15px] text-[14.95px] w-full truncate font-helvetica capitalize`}
              >
                {item.title}
              </p>
            )}
          </div>
          {!isTitleEdit &&
            item.role !== "view" &&
            item.permission_type !== "view" && (
              <RightClickMenu
                NewChat={NewChat}
                showEllipsis={showEllipsis}
                index={index}
                isPinned={item.pinned}
                setOpenMenu={setOpenMenu}
                openMenu={openMenu}
                handleClose={handleClose}
                chatId={item.id}
                isUnArchive={isUnArchive}
                isContextMenuClick={isContextMenuClick}
                setIsContextMenuClick={setIsContextMenuClick}
              />
            )}
          {isTitleEdit && (
            <Image
              onClick={() => setisTitleEdit(false)}
              src={"/svg/closeIcon.svg"}
              alt="close Icon"
              width={14}
              height={17}
            />
          )}
        </li>
      </Tooltip>
    </>
  );
};

export default ChatListItem;
