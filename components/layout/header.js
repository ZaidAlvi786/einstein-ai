"use client";

import React, { useEffect, useState } from "react";
import { Tooltip, Button } from "@nextui-org/react";
import Image from "next/image";
import EarthIcon from "@/app/assets/svg/earth.svg";
import UserIcon from "@/app/assets/svg/user.svg";
import { useAppSelector } from "@/app/lib/hooks";
import SearchIcon from "@/app/assets/image/SearchIcon.png";
import UsersIcon from "@/app/assets/image/UserIcon.png";
import Link from "next/link";
import ShareAndInviteModal from "../historySidebar/ShareAndInvite/ShareAndInviteModel";
import { useRef } from "react";
import { useOnClickOutside } from "@/app/hooks/useOnClickOutside";
import { Input } from "@nextui-org/react";
import SmallSearchIcon from "@/app/assets/svg/searchIcon.svg";
import UserCreateIcon from "@/app/assets/svg/usercreate.svg";
import { Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useAccessSharedChatWithLinkMutation,
  useAccessSharedWorkspaceWithLinkMutation,
} from "@/app/lib/features/chat/chatApi";
import toast from "react-hot-toast";
import SERACHICON from "@/app/assets/svg/topbar_search_icon.svg";
import USERICON from "@/app/assets/svg/topbar_user_icon.svg";

const Header = ({
  setUserActive,
  userActive,
  chatTitle,
  clickChat,
  setClickChat,
  setMobileStatus,
  setChatTitle,
  settingModelStatus,
  auth,
  setActiveWorkspace,
}) => {
  const activeChat = useAppSelector((state) => state.chat.activeChat);
  const activeGroup = useAppSelector((state) => state.group.currentActiveGroup);
  const [openShareAndInviteModel, setOpenShareAndInviteModel] = useState({
    open: false,
    chat_id: "",
  });
  const [searchChatValue, setSearchChatValue] = useState("");

  const searChChatContainerRef = useRef();
  const searchParams = useSearchParams();
  const [isAccessLinkSubmit, setIsAccessLinkSubmit] = useState();
  const [AccessSharedChatWithLink] = useAccessSharedChatWithLinkMutation();
  const [AccessSharedWorkspaceWithLink] =
    useAccessSharedWorkspaceWithLinkMutation();
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(-1)
  const [highlights, setHighlights] = useState([])

  const [isShowSearchChats, setIsShowSearchChats] = useState(false);

  const resetHighlights = (chatContainer) => {
    chatContainer.querySelectorAll('.highlight').forEach((highlight) => {
      const parent = highlight.parentNode;
      parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
      parent.normalize();
    });
    setHighlights([])
    setCurrentHighlightIndex(-1);
  };

  useOnClickOutside(searChChatContainerRef, () => {
    setIsShowSearchChats(false)
    const chatContainer = document.querySelector('.chat-container');
    resetHighlights(chatContainer)
  });
  const router = useRouter();


  const HandleFindTextInChat = () => {
    // const result = window?.find(searchChatValue);
    // Clear previous highlights
    const searchValue = searchChatValue; 
    if (!searchValue) return;

    const chatContainer = document.querySelector('.chat-container');
    if (!chatContainer) return;
    resetHighlights(chatContainer)
  
    const newHighlights = [];

    const walker = document.createTreeWalker(chatContainer, NodeFilter.SHOW_TEXT, null);

    while (walker.nextNode()) {
      const node = walker.currentNode;
      const textContent = node.textContent;

      const regex = new RegExp(searchValue, 'gi');
      const matches = [...textContent.matchAll(regex)];

      if (matches.length > 0) {
        let currentIndex = 0;

        matches.forEach((match) => {
          const [matchText] = match;
          const matchStart = match.index;

          const beforeMatch = textContent.slice(currentIndex, matchStart);

          const highlight = document.createElement('span');
          highlight.className = 'highlight';
          highlight.style.backgroundColor = 'yellow';
          highlight.textContent = matchText;

          const parent = node.parentNode;
          if (beforeMatch) parent.insertBefore(document.createTextNode(beforeMatch), node);
          parent.insertBefore(highlight, node);
          newHighlights.push(highlight); 
          currentIndex = matchStart + matchText.length;
        });

        const remainingText = textContent.slice(currentIndex);
        if (remainingText) {
          node.textContent = remainingText;
        } else {
          node.remove();
        }
      }
    }
    setHighlights(newHighlights)

    if (newHighlights.length > 0) {
      const newCurrentHighlightIndex = 0;
      setCurrentHighlightIndex(newCurrentHighlightIndex)
      scrollToHighlight(newCurrentHighlightIndex);
    }
  };

  const DropdownHeader = useCallback(
    ({ toggle }) => (
      <div className={`cursor-pointer h-[20px] w-[19px]`} onClick={toggle}>
        {/* <Image
        alt="search-icon"
        src={SearchIcon}
        width={"100%"}
        height={"100%"}
        objectFit={"contain"}
      /> */}
        <SERACHICON />
      </div>
    ),
    [isShowSearchChats]
  );

  const handleToggle = (e) => {
    e?.preventDefault();
    setIsShowSearchChats((prev) => !prev);
    if(searchChatValue){
      HandleFindTextInChat()
    }
  };

  const handleRedirection = (e, link) => {
    e.preventDefault();
    router.push(link);
  };
  useEffect(() => {
    if (
      !isAccessLinkSubmit &&
      searchParams.get("access_link") &&
      searchParams.get("permission_type")
    ) {
      const user = localStorage.getItem("enstine_auth")
        ? JSON.parse(localStorage.getItem("enstine_auth"))
        : null;
      if (user.email) {
        const payload = {
          access_link: searchParams.get("access_link")
            ? searchParams.get("access_link")
            : "",
          permission_type: searchParams.get("permission_type")
            ? searchParams.get("permission_type")
            : "",
        };
        const _from = searchParams.get("workspace")
          ? searchParams.get("workspace")
          : "";
        const APIName = _from
          ? AccessSharedWorkspaceWithLink
          : AccessSharedChatWithLink;
        APIName(payload)
          .unwrap()
          .then((res) => {
            setIsAccessLinkSubmit(true);
            toast.success(res.message);
            router.push("/");
          })
          .catch((err) => {
            setIsAccessLinkSubmit(true);
            toast.error("Failed to Request !");
          })
          .finally(() => {
            setIsAccessLinkSubmit(true);
          });
      } else {
        router.push("/signin");
      }
    }
  }, [!isAccessLinkSubmit]);

  const goToPreviousHighlight = () => {
    if (highlights.length === 0) return;
    const newCurrentHighlightIndex = (currentHighlightIndex - 1 + highlights.length) % highlights.length;
    setCurrentHighlightIndex(newCurrentHighlightIndex)
    scrollToHighlight(newCurrentHighlightIndex);
  };

  const scrollToHighlight = (index) => {
    const currentHighlights = highlights
    if (currentHighlights[index]) {
      currentHighlights.forEach((el, i) => el.classList.toggle('active-highlight', i === index));
      currentHighlights[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const goToNextHighlight = () => {
    if (highlights.length === 0) return;
    const newCurrentHighlightIndex = (currentHighlightIndex + 1) % highlights.length;
    setCurrentHighlightIndex(newCurrentHighlightIndex)
    scrollToHighlight(newCurrentHighlightIndex);
  };

  return (
    <>
      <div className='flex justify-between px-[12px] max-mlg:px-0 py-[14px] items-center'>
        <div className='flex items-center gap-1.5 text-[12.393px]	text-[E9E9E9] font-helvetica font-medium w-full truncate capitalize'>
          <p className='cursor-pointer ml-0.5 !text-[#E9E9E9] font-medium'>
            {activeGroup?.name && `${activeGroup?.name}`}
          </p>
          <span className='h-[2.656px] w-[2.656px] rounded-full bg-[#D9D9D9] mx-0.5' />
          <p className='cursor-pointer !text-[#E9E9E9] font-medium'>
            {activeChat?.title ? activeChat?.title : "New Chat"}
          </p>
        </div>

        {auth && auth?.user && auth?.user?.email ? (
          <div className='flex flex-row gap-4'>
            <div as='div' className='relative inline-block text-left'>
              <div className='flex items-center h-full'>
                <DropdownHeader toggle={handleToggle} />
              </div>
              <Transition
                as={Fragment}
                enter='transition ease-out duration-100'
                enterFrom='transform opacity-0 scale-95'
                enterTo='transform opacity-100 scale-100'
                leave='transition ease-in duration-75'
                leaveFrom='transform opacity-100 scale-100'
                leaveTo='transform opacity-0 scale-95'
                show={isShowSearchChats}
                ref={searChChatContainerRef}
              >
                <div className='absolute top-10 -right-2.5 z-50 origin-top-right rounded-[24px] bg-[#232323] min-w-[352px]'>
                  <div className='flex flex-row items-center gap-3 h-[52px] justify-between pl-[15px]'>
                    {/* <div className="">
                      <p className="text-[#C6C6C6] font-medium font-helvetica text-[17px] whitespace-nowrap">
                        6 matches
                      </p>
                    </div> */}
                    <div className='flex items-center'>
                      <button onClick={goToNextHighlight}                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={2}
                          stroke='#C6C6C6'
                          className='size-6'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='m19.5 8.25-7.5 7.5-7.5-7.5'
                          />
                        </svg>
                      </button>
                      <button
                        onClick={goToPreviousHighlight}>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={2}
                          stroke='#C6C6C6'
                          className='size-6'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='m4.5 15.75 7.5-7.5 7.5 7.5'
                          />
                        </svg>
                      </button>
                    </div>
                    <div className='h-[52px] w-72'>
                      <Input
                        type='text'
                        placeholder='Search'
                        radius='full'
                        classNames={{
                          inputWrapper:
                            "!h-[52px] !py-0 rounded-tl-none rounded-tr-full rounded-br-full rounded-bl-none group-data-[focus-visible=true]:!ring-0 group-data-[focus-visible=true]:!ring-transparent group-data-[focus-visible=true]:!ring-offset-0 group-data-[focus-visible=true]:!ring-offset-transparent data-[hover=true]:!bg-[#272727]",
                          input: "text-[17px] caret-white",
                          innerWrapper: "pb-0",
                        }}
                        startContent={
                          <div>
                            <SmallSearchIcon />
                          </div>
                        }
                        endContent={
                          <>
                            <button
                              disabled={searchChatValue?.length <= 0}
                              onClick={HandleFindTextInChat}
                              className={`py-[5px] px-[11px] rounded-full bg-[#F8F8F8] text-[13px] font-bold font-helvetica`}
                            >
                              {`Done`}
                            </button>
                          </>
                        }
                        value={searchChatValue}
                        onValueChange={(val) =>
                          setSearchChatValue(val?.trimStart())
                        }
                      />
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
            {activeChat?.id ? (
              <Tooltip
                content={<p className='text-[#FFF]'>Share Chat</p>}
                showArrow
                placement='bottom'
                delay={0}
                closeDelay={0}
                classNames={{
                  base: ["before:bg-[##2E353C]"],
                  content: [
                    "bg-[#272727] text-sm font-normal leading-4 px-3 py-2",
                  ],
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
                <div
                  className={`cursor-pointer h-[20px] w-[22px]`}
                  onClick={() =>
                    setOpenShareAndInviteModel({
                      open: true,
                      chat_id: activeChat?.id,
                    })
                  }
                >
                  {/* <Image
                  alt="users-icon"
                  src={UsersIcon}
                  width={"100%"}
                  height={"100%"}
                  objectFit={"contain"}
                /> */}
                  <USERICON />
                </div>
              </Tooltip>
            ) : (
              <div
                className={`cursor-pointer h-[20px] w-[22px]`}
                onClick={() =>
                  toast("Start a chat before sharing.", {
                    duration: 2000,
                  })
                }
              >
                {/* <Image
                alt="users-icon"
                src={UsersIcon}
                width={"100%"}
                height={"100%"}
                objectFit={"contain"}
              /> */}
                <USERICON />
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Share and Invite Model */}
      <ShareAndInviteModal
        isOpen={openShareAndInviteModel}
        onOpenChange={setOpenShareAndInviteModel}
      />
    </>
  );
};

export default Header;
