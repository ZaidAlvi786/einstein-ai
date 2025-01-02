"use client";
import React, {
  SVGProps,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { VoiceRecognition } from "../VoiceRecognition";
import { Avatar, Image, Spinner } from "@nextui-org/react";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { useAuth } from "@/app/authContext/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { setActiveChat } from "@/app/lib/features/chat/chatSlice";
import axiosInstance from "@/app/http/axios";
import { ChatInputProps } from "@/types/ChatTypes";
import toast from "react-hot-toast";
import Link from "next/link";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "@/app/globals.css";
import SendIcon from "@/public/icons/svg/SendIcon";
import ReplyBlockInput from "./ReplyBlockInput";
import { useCreateEmptyChatMutation } from "@/app/lib/features/chat/chatApi";
import { FileDropZone } from "./FileDropZone";

const ChatInput: React.FC<ChatInputProps> = ({
  setShowLoader,
  scrollRef,
  showReply,
  setShowReply,
  showLoader,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth: any = useAuth();
  const fileInputRefNew = useRef<HTMLInputElement | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const activeChat = useAppSelector((state: any) => state.chat.activeChat);
  console.log("activeChat: ", activeChat);
  const ws = useAppSelector((state: any) => state.webSocket.ws);
  const connected = useAppSelector((state: any) => state.webSocket.connected);
  const [value, setValue] = useState<string>("");
  const activeChatModel = useAppSelector(
    (state: any) => state.chat.activeChatModel
  );
  console.log("activeChatModel: ", activeChatModel);
  const activeGroup = useAppSelector(
    (state: any) => state.group.currentActiveGroup
  );
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const [CreateEmptyChat] = useCreateEmptyChatMutation();
  const workspace_id_local = localStorage.getItem("workspace_id");
  const [attachedFiles, setAttachedFiles] = useState<any>([]);
  console.log("🚀 ~ attachedFiles:", attachedFiles);
  const [isLoadingAttachedFiles, setIsLoadingAttachedFiles] = useState(false);
  const [preview, setPreview] = useState<string[]>([]);

  const handleCreateEmptyChat = () => {
    if (value.length === 0) return; // only run if some text are there in chat input
    try {
      const data = {
        workspace_id: workspace_id_local,
        group_id: activeGroup?._id ?? "",
        chat_title: value.slice(0, 20),
      };
      let newChatId = null;
      CreateEmptyChat(data).then((res) => {
        newChatId = res.data.chat_id;
        TextGenerate(res.data.chat_id);
      });
      return newChatId;
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setValue("");
  };

  const TextGenerate = (chatId: string) => {
    if (value.length === 0 || showLoader?.isloading) return;
    if (Object.keys(activeChatModel).length === 0)
      return toast.error("Please subscribe any tool for chat");
    if (auth.user.price > 0) {
      if (value?.length) {
        if (connected && ws?.readyState === WebSocket.OPEN) {
          const data = {
            action: "model_chat",
            endpoint:
              activeChatModel?.category === "model"
                ? "model"
                : activeChatModel?.category === "gpt"
                ? "model_chat"
                : activeChatModel?.modelValue ?? "",
            request: {
              file_url: attachedFiles,
              userID: auth?.user?.userID,
              type: activeChatModel?.modelName ?? "",
              request_type: "chat",
              prompt: value,
              workspace_id: activeChat?.role
                ? activeChat?.workspace_id
                : workspace_id_local, // activeChat?.role in case of shared chat
              group_id: activeGroup?._id ?? "",
              id: chatId,
              // id: activeChat?.id ?? '',
              tool_id: activeChatModel?.id,
              index: 0,
              source: "inputBox",
              context_tool_id:
                activeChatModel.category === "gpt"
                  ? activeChatModel?.chat_model
                  : null,
              reply: showReply?.text || null, // selected text
            },
          };
          ws?.send(JSON.stringify(data));
          setValue("");
          setAttachedFiles([]);
          setPreview([]);
          setShowLoader({
            prompt: value,
            isloading: true,
            index: null,
            attachedFiles: attachedFiles,
          });
          setTimeout(() => {
            if (scrollRef.current) {
              scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
          }, 200);
        }
      }
      if (!activeChat?.id) {
        // selectFirstChatOnWorkspaceChange();
        const firstChat = {
          id: chatId,
          title: value.slice(0, 5),
          bot: value.slice(0, 5),
          thumbnail_url: "",
          user_messages_count: 2,
          has_unread_messages: true,
          updated_at: "",
          date: "",
          permission_type: "full",
          pinned: false,
        };
        dispatch(setActiveChat(firstChat));
        router.push(
          "/?" +
            createMultipleQueryString([
              { name: "chat", value: chatId ?? "new" },
            ])
        );
      }
    } else {
      toast.error(
        <span>
          You don't have enough credits to make this request. Please{" "}
          <Link href="/profile/billing">
            <a style={{ textDecoration: "underline", color: "inherit" }}>
              top up your account
            </a>
          </Link>
          .
        </span>
      );
    }
    // Stop the voice recognization (Mic)
    stopListening();
    // set initial value to the reply state
    setShowReply({ ...showReply, showInInput: false });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!activeChat?.id) {
        handleCreateEmptyChat();
      } else {
        TextGenerate(activeChat?.id);
      }
      if (textAreaRef.current) {
        // Temporarily reset height to auto to calculate scrollHeight correctly
        textAreaRef.current.style.height = "35px";
      }
    } else {
      adjustHeight();
    }
  };

  const selectFirstChatOnWorkspaceChange = async () => {
    const workspace_id_local = localStorage.getItem("workspace_id");
    try {
      const groupResponse = await axiosInstance.get(
        `/group/get-groups-by-workspace-id/${workspace_id_local}`
      );

      const groups = groupResponse?.data?.data;
      if (groups?.length > 0) {
        const chatResponse = await axiosInstance.get(
          `/ai/get-history-by-workspace-id?workspace_id=${workspace_id_local}&group_id=${activeGroup?._id}`
        );

        const chats = chatResponse?.data?.data;
        if (chats?.length > 0) {
          const firstChat = chats?.[0];
          console.log("firstChat: ", firstChat);
          if (firstChat) {
            dispatch(setActiveChat(firstChat));
            router.push(
              "/?" +
                createMultipleQueryString([
                  { name: "chat", value: firstChat?.id ?? "new" },
                ])
            );
          }
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const createMultipleQueryString = useCallback(
    (queryStringArray: any) => {
      const params = new URLSearchParams(searchParams);
      queryStringArray?.forEach(({ name, value }: any) => {
        params.set(name, value);
      });

      return params.toString();
    },
    [searchParams]
  );

  const adjustHeight = () => {
    if (textAreaRef.current) {
      // Temporarily reset height to auto to calculate scrollHeight correctly
      textAreaRef.current.style.height = "35px";

      // Calculate the new height, capping it at 226.75px
      const newHeight = Math.min(textAreaRef.current.scrollHeight, 216.75);

      // Apply the new height
      textAreaRef.current.style.height = `${newHeight}px`;

      console.log(
        "Content Height:",
        textAreaRef.current.scrollHeight,
        "New Height Set:",
        newHeight
      );
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const handleFilesSelected = (files: File[]) => {
    // Handle the selected files here
    console.log("Selected files:", files);
  };

  const handleImageClick = () => {
    if (fileInputRefNew.current) {
      fileInputRefNew.current.click();
    }
  };

  return (
    <div className="w-full relative flex flex-col gap-1 rounded-3xl 2xl:max-w-[700px] min-h-[52px] max-h-[226.75px] h-fit 2xl:min-h-[52px] xl:min-h-[52px] p-[6px] bg-[#272727] justify-center pb-[3.54px] pt-[3.54px] pl-[4.43px] pr-[2px]">
      <div className="absolute -right-[45px] leading-[0]">
        <VoiceRecognition
          setValue={setValue}
          disabled={false}
          stopListening={stopListening}
        />
      </div>
      {showReply?.showInInput && showReply?.text?.trim()?.length > 0 && (
        <ReplyBlockInput showReply={showReply} setShowReply={setShowReply} />
      )}
      {activeChatModel?.image_upload_support && (
        <FileDropZone
          fileInputRefNew={fileInputRefNew}
          onFilesSelected={handleFilesSelected}
          accept="image/*"
          setAttachedFiles={setAttachedFiles}
          setIsLoading={setIsLoadingAttachedFiles}
          preview={preview}
          setPreview={setPreview}
        />
      )}
      <div className={`flex items-end pr-[3px] w-full h-auto`}>
        <Avatar
          src={activeChatModel?.iconSrc || activeChatModel?.logo || ""}
          alt={activeChatModel?.modelName || ""}
          showFallback={true}
          className="p-[0px] xl:h-[36px] xl:w-[36px] h-[38px] w-[36px] cursor-pointer bg-transparent rounded-full shrink-0"
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
        {activeChatModel?.image_upload_support && (
          <div className="flex items-center 2xl:min-w-[25px] xl:min-w-[18px] 2xl:h-[25px] xl:h-[18px] ml-[4px] justify-center my-auto">
            {isLoadingAttachedFiles ? (
              <Spinner size="sm" color="white" />
            ) : (
              <Image
                alt="attach icon"
                width={11}
                height={20}
                src={"svg/attach.svg"}
                className={`cursor-pointer max-h-10 mx-auto 2xl:w-[10.15px] xl:w-[10.15px] 2xl:h-[18.46px] xl:h-[18.46px] `}
                onClick={handleImageClick}
              />
            )}
          </div>
        )}
        <textarea
          id="review-text"
          value={value}
          placeholder="Message"
          // rows={5}
          // maxLength={500}
          ref={textAreaRef}
          cols={0}
          className="min-h-[35px] h-[35px] snap-y leading-[22.661px] placeholder:text-[#AAA] text-white  tracking-[0.142px] resize-none overflow-y-auto scrollbar-thumb-[#c3cbd3] py-[6px] text-[14.163px] 2xl:text-[16px] xl:text-[14.163px] font-helvetica w-full bg-transparent outline-none rounded font-normal ml-2 max-h-[216.75px] custom-scrollbar"
          disabled={
            activeChat?.role === "view" ||
            activeChat?.permission_type === "view"
          }
          onChange={(e) => {
            if (Object.keys(activeChatModel).length > 0) {
              setValue(e.target.value);
              adjustHeight();
            } else {
              toast.error("Please subscribe any tool for chat");
            }
            // chatId is empty then call
            setValue(e.target.value);
          }}
          onKeyDown={(e) => {
            handleKeyDown(e);
          }}
        />
        <button
          className={`cursor-pointer flex-row mr-[0px] w-[44.8px] h-[38px] rounded-full flex items-center justify-center transition-all duration-75 ${
            value.length > 0 && !showLoader?.isloading
              ? "bg-[#0A84FF]"
              : "bg-[#121212]"
          }`}
          // onClick={TextGenerate}
          onClick={() =>
            !activeChat?.id
              ? handleCreateEmptyChat()
              : TextGenerate(activeChat?.id)
          }
          disabled={value.length === 0 || showLoader?.isloading}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
        >
          {/* <Image alt='send-icon' width={15} height={16} src='/svg/send.svg' /> */}
          <SendIcon
            color={
              isButtonHovered || (value.length > 0 && !showLoader?.isloading)
                ? "white"
                : ""
            }
          />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
