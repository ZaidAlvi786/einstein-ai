"use client";
import { useLazyGetHistoryByIdQuery } from "@/app/lib/features/chat/chatApi";
import { useAppSelector } from "@/app/lib/hooks";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ChatResponse, ChatRecord, LoaderState } from "@/types/ChatTypes";
import ChatBlock from "./typedChatComponents/ChatBlock";
import PluginMenu from "./typedChatComponents/PluginMenu";
import FeedBackBtn from "../Feedback/feedbackBtn";
import { ChatBlockPrompt } from "./ChatBlockPrompt";
import ChatInput from "./typedChatComponents/ChatInput";
import ToolPrivacyText from "./ToolPrivacyText";
import LetsMakeSomething from "./typedChatComponents/LetsMakeSomething";
import Loader from "./typedChatComponents/Loader";
import { socketActionsList } from "../constants/ToolContants";
import { ChatProps } from "@/types/ChatTypes";
import { useAuth } from "@/app/authContext/auth";
import { getWebSocketURL } from "@/config";
import DraggableIframe from "./DraggableIframe";
import toast from "react-hot-toast";
import ReplyBlockUser from "./typedChatComponents/ReplyBlockUser";
import { Image } from "@nextui-org/react";
import { AttachedFileBlock } from "./typedChatComponents/AttachedFileBlock";
import AddNewChat from "./typedChatComponents/AddNewChat";
import InviteFriends from "./typedChatComponents/InviteFriends";
import AnimatedChatLoader from "./typedChatComponents/AnimatedChatLoader/AnimatedChatLoader";
import { animationViewType } from "./chatConstants";

interface ChatError {
  index: number | null;
  errMsg: string;
  userMsg?: string;
}

const Chat: React.FC<ChatProps> = ({ chatHistoryID, NewChat }) => {
  const auth: any = useAuth();
  const [getHistoryByIdAPI, { isFetching: isHistoryApiLoading }] =
    useLazyGetHistoryByIdQuery();
  const [chatData, setChatData] = useState<ChatResponse>([]);
  console.log("chatData: ", chatData);
  const messages = useAppSelector((state: any) => state.webSocket.messages);
  const activeChatModel = useAppSelector(
    (state: any) => state.chat.activeChatModel
  );
  const [showReply, setShowReply] = useState({
    message: null,
    index: null,
    text: "",
    showInInput: false,
  });
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [chatError, setChatError] = useState<ChatError>({
    index: null,
    errMsg: "Contact Support Team for help: contact@togl.ai",
    userMsg: "",
  });

  const [showLoader, setShowLoader] = useState<LoaderState>({
    prompt: "",
    isloading: false,
    index: null,
    attachedFiles: [],
  });
  const [showAnimatedChatLoader, setShowAnimatedChatLoader] = useState(false)
  const [editModeIndex, setEditModeIndex] = useState(-1);
  const [editingMessage, setEditingMessage] = useState("");

  useEffect(() => {
    getChatHistory();
  }, [chatHistoryID]);

  useEffect(() => {
    if (!socketActionsList.includes(messages?.action)) return;
    if (messages?.status_code && messages?.status_code === 402) {
      // Show err
      toast.error(messages?.content?.message);
      setShowLoader({
        prompt: "",
        isloading: false,
        index: null,
        attachedFiles: [],
      });
      return;
    }
    if (messages?.status_code && messages?.status_code !== 200) {
      // Error Messages
      // handle error message using below sockets
      console.error("Error Messages in Messages");
      return;
    }
    if (chatHistoryID) {
      getChatHistory();
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 200);
      return;
    }
    setChatData([]);
  }, [messages]);

  useEffect(() => {
    if (showLoader?.isloading) {
      const model = animationViewType.find(model => model?.modelName === activeChatModel?.name)
      if (model) {
        setShowAnimatedChatLoader(true)
      }

    } else {
      setShowAnimatedChatLoader(false)
    }

  }, [showLoader])


  const getChatHistory = () => {
    if (!chatHistoryID) {
      setChatData([]);
      return;
    }

    getHistoryByIdAPI(chatHistoryID)
      .unwrap()
      .then((response: any) => {
        const messages = response.data.history;
        setChatData(messages);
        setShowLoader({
          prompt: "",
          isloading: false,
          index: null,
          attachedFiles: [],
        });
        setShowReply({
          message: null,
          index: null,
          text: "",
          showInInput: false,
        });
        setEditModeIndex(-1);
        if (messages?.length !== chatData.length) {
          // will not run in case of regenerate
          setTimeout(() => {
            if (scrollRef.current) {
              scrollRef.current.scrollTop =
                scrollRef.current.scrollHeight + 1000;
            }
          }, 200);
        }
      })
      .catch((error: any) => {
        console.error("Error fetching chat history:", error);
      });
  };

  const wsUrl = getWebSocketURL(auth?.user?.token);

  const wsRef: any = useMemo(() => {
    if (auth?.user?.userID) {
      // WS 101
      if (!wsUrl) return {};
      return new WebSocket(wsUrl);
    }
    return {};
  }, [wsUrl]);

  const parseIfJson = useCallback((data: any) => {
    try {
      const parsedData = JSON?.parse(data);
      return parsedData;
    } catch (e) {
      return data;
    }
  }, []);

  useEffect(() => {
    if (wsRef && auth?.user?.userID) {
      // WS 101
      wsRef.onmessage = (event: any) => {
        const IncomingMessage = parseIfJson(event?.data);
        if (IncomingMessage.type === "tool_trial_ended") {
        toast.error("You completed your free trial")
        }
        if (
          IncomingMessage.status_code &&
          IncomingMessage.status_code !== 200
        ) {
          var userPrompt = IncomingMessage?.prompt;
          if (IncomingMessage?.prompt) {
            userPrompt = IncomingMessage?.prompt;
          }
          // Set error message on Index ( show error on chat block)
          // setChatError({
          //   ...chatError,
          //   index: IncomingMessage.index,
          //   errMsg:
          //     IncomingMessage.content.message ||
          //     IncomingMessage.content.data ||
          //     "Something went wrong",
          //   userMsg: userPrompt,
          // });
        }
      };
      return () => {
        if (wsRef?.readyState === WebSocket.OPEN) {
          wsRef?.close();
        }
      };
    }
  }, [wsRef]);
  const [isIframeOpen, setIsIframeOpen] = useState(false); // State to manage Iframe visibility
  const [iFrameModel, setIFrameModel] = useState(null);

  const handleCloseIframe = () => {
    setIsIframeOpen(false); // Close the Iframe
  };
  const activeModalHandler = (model: any) => {
    // Set the URL and open the Iframe
    setIsIframeOpen(true);
    setIFrameModel(model);
  };

  const acceptType: any = activeChatModel?.image_upload_support
    ? "image/*"
    : activeChatModel?.document_upload_support
      ? ".pdf, .txt, .docx, .doc, .csv, .xlsx"
      : activeChatModel?.audio_upload_support
        ? ".mp3, .mpeg, .wav"
        : "*";
  return (
    <>
      <div className="max-w-[920px] chat-container mx-auto max-mxl:max-w-[900px] max-mlg:max-w-[800px] max-xl:max-w-[600px] max-msm:max-w-[360px] max-msm:mx-auto">
        <div
          ref={scrollRef}
          className="overflow-y-auto overflow-x-hidden w-full pt-[60px] max-msm:pt-5 h-calc-180px outline-none scrollbar-hide"
        >
          {chatData?.length > 0
            ? chatData.map((chatRecord: ChatRecord, index: number) => (
              <>
                <ChatBlock
                  key={index}
                  chatRecord={chatRecord}
                  index={index}
                  showLoader={showLoader}
                  setShowLoader={setShowLoader}
                  chatError={chatError}
                  setShowReply={setShowReply}
                  showReply={showReply}
                  setEditModeIndex={setEditModeIndex}
                  editModeIndex={editModeIndex}
                  getChatHistory={getChatHistory}
                  isHistoryApiLoading={isHistoryApiLoading}
                  editingMessage={editingMessage}
                  setEditingMessage={setEditingMessage}
                  acceptType={acceptType}
                />
              </>
            ))
            : !showLoader?.isloading && <LetsMakeSomething />}

          {showLoader?.isloading && showLoader.index === null && (
            <>
              {showReply?.text && <ReplyBlockUser text={showReply.text} />}
              <div className="w-full flex justify-end max-w-[60%] ml-auto">
                <div className="max-w-[700px] break-words text-[20px] text-[#FFF] font-helvetica font-normal leading-8 bg-[#272727] rounded-[20px] py-2 px-5 ">
                  <div className="user-prompt">
                    <div
                      className="text-[17px] text-[#E4E4E4] font-helvetica font-normal break-words leading-7"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {showLoader.prompt}
                    </div>
                    {/* <div
                      className="text-[17px] text-[#E4E4E4] font-helvetica font-normal break-words leading-7 user-prompt-47"
                      style={{ whiteSpace: "pre-wrap" }}
                      dangerouslySetInnerHTML={{ __html: showLoader.prompt }}
                    /> */}
                  </div>
                </div>
              </div>
              {showLoader?.attachedFiles?.length > 0 && (
                <div className="w-full flex justify-end items-center mt-2">
                  <AttachedFileBlock
                    attachedFiles={showLoader?.attachedFiles}
                  />
                </div>
              )}
              <Loader />
            </>
          )}
        </div>
      </div>

      <div
        className={`fixed bottom-0 flex flex-col align-items-end w-[-webkit-fill-available]  max-h-[258.75px] mb-3 mx-auto items-center max-xl:pr-2 
          `}
        style={{ width: "inherit" }}
      >
        <div className="flex flx-row pl-3 items-end 2xl:gap-[23px] xl:gap-[17px] w-full max-msm:mb-3 justify-center  max-h-[226.75px]">
          <div
            className="flex flex-row transition-all duration-300 ease-in-out justify-center min-h-[52px] max-h-[226.75px]"
            style={{ width: "90%" }}
          >
            <PluginMenu
              showDraggableModal={activeModalHandler}
              messages={messages}
            />
            <AddNewChat NewChat={NewChat} />
            <ChatInput
              setShowLoader={setShowLoader}
              scrollRef={scrollRef}
              showReply={showReply}
              setShowReply={setShowReply}
              showLoader={showLoader}
              editingMessage={editingMessage}
              acceptType={acceptType}
            />
          </div>
          <div>
            <ChatBlockPrompt />
          </div>
        </div>
        <ToolPrivacyText />
      </div>
      {isIframeOpen && (
        <DraggableIframe
          onClose={handleCloseIframe}
          iFrameModel={iFrameModel}
        />
      )}
      {auth && auth?.user && auth?.user?.email && auth?.user?.fullname && (
        <InviteFriends chatHistoryID={chatHistoryID} />
      )}
      {(showLoader?.isloading && showAnimatedChatLoader) &&
        <AnimatedChatLoader setShowAnimatedChatLoader={setShowAnimatedChatLoader} />}
    </>
  );
};

export default Chat;
