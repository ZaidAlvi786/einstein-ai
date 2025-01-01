"use client";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useModelStatus } from "../context/ModelStatusContext";
import { useNewChat } from "../context/NewChatContext";
import "react-contexify/dist/ReactContexify.css";
import { Badge } from "@nextui-org/react";
import { getWebSocketURL } from "@/config";
import Workspace from "../historySidebar/Workspace";
import ChatHistoryList from "../historySidebar/ChatHistoryList";
import {
  useGetHistoryByWorkspaceIdQuery,
  useGetUnreadMessagesCountQuery,
  useGetUsersSharedRoomHistoryQuery,
} from "@/app/lib/features/chat/chatApi";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { setHistoryChatData } from "@/app/lib/features/chat/chatSlice";
import groupDataByDate from "@/app/utils/dateAndTime/groupDataByDate";
import useDebounce from "@/app/hooks/useDebounce";
import SidebarCategory from "../historySidebar/Category";
import {
  addMessage,
  setConnected,
  setError,
  setWebSocket,
} from "@/app/lib/features/socket/socketSlice";
import NotificationDrawer from "../notification/NotificationDrawer";
import NotificationIcon from "@/app/assets/svg/bell.svg";
import NotificationCloseIcon from "@/app/assets/svg/NotificationCloseIcon.svg";
import useBoolean from "@/app/hooks/useBoolean";
import { useOnClickOutside } from "@/app/hooks/useOnClickOutside";
import dynamic from "next/dynamic";
import SidebarSearchBoxComponent from "./sidebarSearchBox";
import {
  setSharedChatsOpen,
  setSharedChatsSearchLoading,
  setSharedChatsSearchValue,
} from "@/app/lib/features/sharedChats/sharedChatsSlice";
const SidebarFooterLinkComponents = dynamic(
  () => import("@/components/layout/sidebarFooterLinkComponents"),
  { ssr: false }
);
import SidebarMarketplaceLink from "@/components/layout/sidebarMarketplaceLink";
import SampleSplitter from "./ResizableComponent/SidebarSplitter";
import { useResizable } from "react-resizable-layout";
import { setSidebarSize } from "@/app/lib/features/SidebarResize/ResizeSlice";
import ToastService from "../Toaster/toastService";
import { Rnd } from "react-rnd";

const HistorySider = ({
  NewChat = () => {},
  setChatHistoryID = () => {},
  setChatStatus = () => {},
  historySideData,
  setChatTitle = () => {},
  setClickChat = () => {},
  auth,
  setMessageModelType = () => {},
  navigateToMessageModel,
  setNavigateToMessageModel = () => {},
}) => {
  const scrollableGroupContainerRef = useRef(null);
  const { toggleStatus, setToggleStatus } = useModelStatus();
  const { newChatData, setNewChatData } = useNewChat([]);
  const [overflow, setOverflow] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const [generateType, setGenerateType] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [retryDelay, setRetryDelay] = useState(1000); // Initial delay in milliseconds
  const [wsRef, setWsRef] = useState(null);

  const searchValue = useAppSelector(
    (state) => state.sheredChats.sharedChatsSearchValue
  );
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const activeWorkspace = useAppSelector(
    (state) => state.workspace.activeWorkspace
  );
  const activeGroup = useAppSelector((state) => state.group.currentActiveGroup);
  const activeChat = useAppSelector((state) => state.chat.activeChat);
  const isOpenShareChats = useAppSelector(
    (state) => state.sheredChats.isOpenShareChats
  );
  const messages = useAppSelector((state) => state.webSocket.messages);

  const {
    data: historyByWorkspaceIdData,
    isFetching: historyByWorkspaceIdFetching,
    refetch: historyByWorkspaceIdRefetch,
  } = useGetHistoryByWorkspaceIdQuery(
    {
      workspace_id: activeWorkspace?._id,
      group_id: activeGroup?._id,
      search_text: debouncedSearchValue,
    },
    { skip: !activeWorkspace?._id || !activeGroup?._id }
  );
  const {
    data: getUsersSharedRoomHistoryData,
    isFetching: getUsersSharedRoomHistoryFetching,
    refetch: getUsersSharedRoomHistoryRefetch,
  } = useGetUsersSharedRoomHistoryQuery(
    { start: 0, limit: 100, search: debouncedSearchValue },
    {
      skip: !(
        Boolean(auth?.user?.email) &&
        Boolean(auth?.user?.fullname) &&
        isOpenShareChats
      ),
    }
  );
  const dispatch = useAppDispatch();

  const [height, setHeight] = useState(128); // initial height in pixels
  const [maxHeight, setMaxHeight] = useState(200); // max height in pixels
  const minHeight = 30; // min height in pixels

  useEffect(() => {
    if (isOpenShareChats) {
      dispatch(setSharedChatsSearchLoading(getUsersSharedRoomHistoryFetching));
    } else {
      dispatch(setSharedChatsSearchLoading(historyByWorkspaceIdFetching));
    }
  }, [
    historyByWorkspaceIdFetching,
    getUsersSharedRoomHistoryFetching,
    isOpenShareChats,
  ]);

  //Dynamically update slider limit
  useEffect(() => {
    const calculateMaxHeight = () => {
      const element = document.getElementById("groups_height_calculation");
      if (element) {
        const totalHeight = Array.from(element.children).reduce(
          (acc, child) => acc + child.getBoundingClientRect().height,
          0
        );
  
        setMaxHeight(Math.min(totalHeight, 200));
      }
    };
  
    calculateMaxHeight();
  
    const observer = new ResizeObserver(calculateMaxHeight);
    const element = document.getElementById("groups_height_calculation");
    if (element) observer.observe(element);
  
    return () => {
      if (element) observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const element = document.getElementById("groups_height_calculation");
    if (element) {
      const isOverflowing = element.scrollHeight > element.clientHeight;
      if (isOverflowing == true) {
        setOverflow(true);
      } else {
        setOverflow(false);
      }
    }
  }, [height]);

  const chatListRef = useRef(null);

  useEffect(() => {
    const element = chatListRef.current;

    if (!element) return;

    const observer = new ResizeObserver(() => {
      const isCurrentlyOverflowing =
        element.scrollHeight > element.clientHeight;
      setOverflowing(isCurrentlyOverflowing);
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isOpenShareChats && auth?.user?.token) {
      // auth?.user?.token - Added condition because when we doing logout from profile screen than App is crashing
      getUsersSharedRoomHistoryRefetch();

      if (getUsersSharedRoomHistoryData?.data) {
        dispatch(
          setHistoryChatData(
            groupDataByDate(getUsersSharedRoomHistoryData?.data ?? [])
          )
        );
      }
    } else {
      if (historyByWorkspaceIdData?.data) {
        dispatch(
          setHistoryChatData(
            groupDataByDate(historyByWorkspaceIdData?.data ?? [])
          )
        );
      }
    }
  }, [
    historyByWorkspaceIdData,
    getUsersSharedRoomHistoryData,
    isOpenShareChats,
  ]);

  useEffect(() => {
    setNewChatData(historySideData || []);
  }, [historySideData]);

  const getHistoryDetail = useCallback((item, chatType = "text") => {
    if (item?.id !== -1) {
      if (chatType === "text") {
        setChatStatus(true);
        setChatHistoryID(item.id);
        setChatTitle(item.title);
        setClickChat(true);
        if (chatListRef.current) {
          const element = chatListRef.current;
          const isOverflowing = element.scrollHeight > element.clientHeight;

          if (isOverflowing == true) {
            setOverflowing(true);
          } else {
            setOverflowing(false);
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    if (activeChat?.id) getHistoryDetail(activeChat);
  }, [activeChat]);

  useEffect(() => {
    if (navigateToMessageModel == "text") {
      getMessageModelTypeData(0, "text", false, "New Chat");
      setNavigateToMessageModel("");
    }
  }, [navigateToMessageModel]);

  const getMessageModelTypeData = (
    generateType,
    messageModelType,
    chatStatus,
    chatTitle
  ) => {
    setGenerateType(generateType);
    setMessageModelType(messageModelType);
    setChatStatus(chatStatus);
    setChatTitle(chatTitle);
  };
  const parseIfJson = useCallback((data) => {
    try {
      const parsedData = JSON?.parse(data);
      return parsedData;
    } catch (e) {
      return data;
    }
  }, []);

  const wsUrl = getWebSocketURL(auth?.user?.token);

  // const wsRef = useMemo(() => {
  //   // if (auth?.user?.email && auth?.user?.fullname) {
  //   if (auth?.user?.userID) {
  //     // WS 101
  //     if (!wsUrl) return {};
  //     return new WebSocket(wsUrl);
  //   }
  //   return {};
  // }, [wsUrl]);

  useMemo(() => {
    if (auth?.user?.userID && wsUrl) {
      const ws = new WebSocket(wsUrl);
      setWsRef(ws);
    }
  }, [auth?.user?.userID, wsUrl]);

  useEffect(() => {
    if (!wsRef) return;
    // if (wsRef && auth?.user?.email && auth?.user?.fullname) {
    if (wsRef && auth?.user?.userID) {
      // WS 101
      dispatch(setWebSocket(wsRef));

      wsRef.onopen = () => {
        dispatch(setConnected(true));
        setRetryCount(0); // Reset retry count on successful connection
        setRetryDelay(1000); // Reset retry delay to initial value
      };

      wsRef.onmessage = (event) => {
        const IncomingMessage = parseIfJson(event?.data);
        dispatch(addMessage(IncomingMessage));
      };

      wsRef.onerror = (error) => {
        dispatch(setError(error));
        // Retry connection
        handleReconnect();
      };

      wsRef.onclose = () => {
        dispatch(setConnected(false));
        // Retry connection
        handleReconnect();
      };

      return () => {
        if (wsRef?.readyState === WebSocket.OPEN) {
          wsRef?.close();
        }
      };
    }
  }, [wsRef]);

  const handleReconnect = () => {
    if (retryCount < 10) {
      // Max retry attempts
      setTimeout(() => {
        console.log(`Reconnecting... Attempt ${retryCount + 1}`);

        // Increment retry delay (Exponential backoff)
        setRetryDelay((prev) => prev * 2);
        setRetryCount((prev) => prev + 1);

        // Attempt to reconnect
        const newWs = new WebSocket(wsUrl);
        setWsRef(newWs);
      }, retryDelay); // Retry after the delay
    } else {
      console.error("Max retry attempts reached");
    }
  };

  const {
    value: shouldShowNotificationMenu,
    toggle: toggleShowNotificationMenu,
    setFalse: closeShowNotificationMenu,
  } = useBoolean(false);
  const notificationMenuContainerRef = useRef();
  useOnClickOutside(notificationMenuContainerRef, () =>
    closeShowNotificationMenu()
  );

  const {
    data: getUnreadMessagesCountData,
    isError: getUnreadMessagesCountIsError,
    refetch,
  } = useGetUnreadMessagesCountQuery(
    {},
    { skip: !auth?.user?.email || !auth?.user?.fullname }
  );

  useEffect(() => {
    if (messages && messages?.type === "notification") {
      try {
        if (getUnreadMessagesCountIsError === false) {
          refetch();
        }
      } catch (error) {
        console.log("###_get_unread_messages_count_data_error_### ", error);
      }
    }

    if (messages && messages?.status_code === 200) {
      if (isOpenShareChats) {
        getUsersSharedRoomHistoryRefetch();
      } else {
        if (!historyByWorkspaceIdFetching && historyByWorkspaceIdData) {
          // to prevent refetch before initiate
          historyByWorkspaceIdRefetch();
        }
      }
    }
  }, [messages, isOpenShareChats]);

  const shareAndChatsInvitetHandler = () => {
    dispatch(setSharedChatsOpen(!isOpenShareChats));
    dispatch(setSharedChatsSearchValue(""));
  };

  // resize the sidebar
  // const sidebarSize = useAppSelector((state) => state.sidebarResize.width);
  // const getInitialWidth = () => {
  //   if (sidebarSize) {
  //     return sidebarSize; // Use the Redux value if available
  //   }
  //   return window.innerWidth >= 2560 ? 590 : 261.13; // Default based on resolution
  // };
  // const {
  //   isDragging: isFileDragging,
  //   position: fileW,
  //   splitterProps: fileDragBarProps,
  // } = useResizable({
  //   axis: "x",
  //   initial: getInitialWidth(), // Dynamically set the initial value
  //   min: 183,
  //   max: 500,
  // });

  // const dispatch = useAppDispatch();
  const sidebarSize = useAppSelector((state) => state.sidebarResize.width);
  const getResizableConfig = useCallback(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 2560) {
        return {
          initial: 590,
          min: 300,
          max: 1000,
        };
      } else if (window.innerWidth >= 1920) {
        return {
          initial: 295,
          min: 182,
          max: 500,
        };
      } else {
        return {
          initial: 261.13,
          min: 183,
          max: 500,
        };
      }
    }
    // Default fallback
    return {
      initial: sidebarSize || 261.13,
      min: 183,
      max: 500,
    };
  }, [sidebarSize]);

  // Fetch initial configuration
  const { initial, min, max } = getResizableConfig();

  // Resizable logic for the sidebar (horizontal resizing)
  const {
    isDragging: isFileDragging,
    position: fileW,
    splitterProps: fileDragBarProps,
  } = useResizable({
    axis: "x",
    initial,
    min,
    max,
  });

  // Update Redux state with resized width (debounced to prevent excessive updates)
  useEffect(() => {
    if (fileW > min && fileW < max && fileW !== sidebarSize) {
      dispatch(setSidebarSize(fileW));
    }
  }, [fileW, min, max, sidebarSize, dispatch]);

  // Function to calculate the initial height of group list
  const newFn = () => {
    if (typeof document !== "undefined") {
      const height = document
        .getElementById("groups_height_calculation")
        ?.getBoundingClientRect()?.height;
      return height || 0;
    }
    return 0; // Fallback
  };

  // Resizable logic for the group list (vertical resizing)
  const {
    isDragging: isGroupListDragging,
    position: groupListH,
    splitterProps: groupListDragBarProps,
  } = useResizable({
    axis: "y",
    initial: newFn(),
    min: 30,
    max: 200,
  });

  // Handle dynamic screen size changes
  useEffect(() => {
    const handleResize = () => {
      const {
        initial: newInitial,
        min: newMin,
        max: newMax,
      } = getResizableConfig();
      // Optional: Update resizable logic dynamically (requires additional setup)
      // console.log("Screen resized", { newInitial, newMin, newMax });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getResizableConfig]);

  // useEffect(() => {
  //   if (fileW > 182 && fileW < 501) {
  //     dispatch(setSidebarSize(fileW));
  //   }
  // }, [fileW]);

  // For scrooling group container div to bottom
  const scrollToBottom = () => {
    if (scrollableGroupContainerRef.current) {
      setTimeout(() => {
        scrollableGroupContainerRef.current.scrollTo({
          top: scrollableGroupContainerRef.current.scrollHeight + 50, // Adding extra offset
          behavior: "smooth",
        });
      }, 100); // Delay to ensure content has loaded fully
    }
  };

  return (
    <>
      <div
        className={`flex flex-col min-w-[183px] max-w-[500px] 4k:max-w-[1000px] 4k:min-w-[300px] w-full fixed z-[9999] h-full bg-[#171717]`}
        style={{ width: sidebarSize }}
      >
        <div className='bg-[#202020] pt-4 !shadow-groupMenu mb-[20px] relative'>
          {isOpenShareChats ? (
            <div className='flex justify-between items-center px-[12px]'>
              <div
                className='flex flex-row items-center gap-2 cursor-pointer'
                onClick={shareAndChatsInvitetHandler}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  height={25}
                  width={25}
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={2}
                  stroke='currentColor'
                  className='size-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15.75 19.5 8.25 12l7.5-7.5'
                    stroke='#fff'
                  />
                </svg>
                <p className='text-sm	text-white font-helvetica font-bold w-full'>{`Shared Chats`}</p>
              </div>
            </div>
          ) : (
            <div className='flex justify-between items-center px-[12px]'>
              <div className='flex flex-row'>
                {/* <ProfilePicture /> */}
                <Workspace
                  NewChat={NewChat}
                  getHistoryDetail={getHistoryDetail}
                  setChatStatus={setChatStatus}
                />
              </div>
              {shouldShowNotificationMenu ? (
                <NotificationCloseIcon className='mr-1 cursor-pointer' />
              ) : (
                <Badge
                  onClick={toggleShowNotificationMenu}
                  color='primary'
                  size='md'
                  classNames={{ badge: "!border-0 cursor-pointer" }}
                  content={getUnreadMessagesCountData?.total_unread_count}
                  isInvisible={
                    !getUnreadMessagesCountData?.total_unread_count > 0
                  }
                  shape='circle'
                >
                  <NotificationIcon
                    className='mr-1 cursor-pointer'
                    onClick={toggleShowNotificationMenu}
                  />
                </Badge>
              )}
            </div>
          )}
          <div className='flex flex-row gap-2 mt-[20px] max-msm:mt-0 mb-4 max-msm:ml-3 items-center h-[35px] px-[12px]'>
            <SidebarSearchBoxComponent />
          </div>
          {isOpenShareChats === false && (
            <div style={{ position: "relative", width: "100%" }}>
              <Rnd
                size={{ width: "100%", height }}
                minHeight={minHeight}
                maxHeight={maxHeight}
                enableResizing={{ bottom: true }}
                disableDragging
                onResizeStop={(e, direction, ref, delta, position) => {
                  setHeight(ref.offsetHeight);
                }}
                style={{
                  backgroundColor: "#202020",
                  color: "#fff",
                  paddingLeft: "12px",
                  paddingRight: "4px",
                  position: "relative",
                }}
                className="chat-list-scrollbar group_scroll"
              >
                <div
                  id="groups_height_calculation"
                  ref={scrollableGroupContainerRef}
                  style={{
                    overflowY: "auto",
                    height: "100%",
                    paddingBottom: "12px",
                  }}
                >
                  <SidebarCategory
                    NewChat={NewChat}
                    scrollToBottom={scrollToBottom}
                    setHeight={setHeight}
                    overflow={overflow}
                  />
                </div>
              </Rnd>
            </div>
          )}
        </div>
        <div
          className='overflow-auto chat-list-scrollbar pe-2 mb-28 py-[16px] px-[12px] pt-0'
          ref={chatListRef}
        >
          <ChatHistoryList
            getHistoryDetail={getHistoryDetail}
            NewChat={NewChat}
          />
        </div>
        <SidebarMarketplaceLink overflowing={true} />
        <SidebarFooterLinkComponents overflowing={true} />

        <SampleSplitter
          classNames={`absolute w-1 -right-1 h-screen cursor-col-resize`}
          isDragging={isFileDragging}
          {...fileDragBarProps}
        />
      </div>

      <NotificationDrawer
        shouldShowNotificationMenu={shouldShowNotificationMenu}
        notificationMenuContainerRef={notificationMenuContainerRef}
      />
      <ToastService />
    </>
  );
};

export default HistorySider;
