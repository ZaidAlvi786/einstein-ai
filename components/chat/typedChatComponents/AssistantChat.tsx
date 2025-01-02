"use client";
import React, { useEffect, useState } from "react";
import { AssistantAccessiblityFeatures } from "./AssistantAccessiblityFeatures";
import { AssistantChatProps } from "@/types/ChatTypes";
import { AssistantMessageVersionChangeComponent } from "./AssistantMessageVersionChangeComponent";
import { useAppSelector } from "@/app/lib/hooks";
import DynamicToolsSideChatPopup from "./DynamicToolsSideChatPopup";
import AddToGPTChat from "./AddToGPTChat";
import { Button, Image, Tooltip } from "@nextui-org/react";
import { useGetToolsCategoryByIdQuery } from "@/app/lib/features/chat/chatApi";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/authContext/auth";
import { staticToolsList } from "@/components/constants/ToolContants";
import ChatErrorMessage from "./ChatErrorMessage";
import toast from "react-hot-toast";
import DynamicToolSideChatModel from "./DynamicToolSideChatModel";

const AssistantChat: React.FC<AssistantChatProps> = ({
  message,
  index,
  setShowLoader,
  chatError,
  showGogleIcon,
  setShowReply,
  showReply,
  file_url,
}) => {
  const [currentMessageVersionIndex, setCurrentMessageVersionIndex] =
    useState(0);
  const ws = useAppSelector((state: any) => state.webSocket.ws);
  const connected = useAppSelector((state: any) => state.webSocket.connected);
  const activeChat = useAppSelector((state: any) => state.chat.activeChat);
  const [selectedText, setSelectedText] = useState("");
  const { data: toolCategory, refetch } = useGetToolsCategoryByIdQuery({
    tool_id: message?.content[0]?.tool_id,
  });
  const activeChatModel = useAppSelector(
    (state: any) => state.chat.activeChatModel
  );
  const searchParams: any = useSearchParams();
  const chatHistoryID: any = searchParams?.get("chat") ?? null;
  const auth: any = useAuth();

  const activeGroup = useAppSelector(
    (state: any) => state.group.currentActiveGroup
  );
  const isViewPermission =
    activeChat?.role === "view" || activeChat?.permission_type === "view";
  // Called by Regenerate function internally when the regenerate is due to the tools icon
  const DynamicToolsRegeneration = (request: any, tool_type: string) => {
    if (connected && ws?.readyState === WebSocket.OPEN) {
      let data = {};
      if (tool_type === "model") {
        data = {
          action: "model_chat",
          endpoint: "model",
          request: {
            ...request,
            source: "modelToolsIcon",
            prompt: "",
            file_url: file_url || null,
          },
        };
        ws?.send(JSON.stringify(data));
      } else if (tool_type === "gpt") {
        data = {
          action: "model_chat",
          request: {
            ...request,
            source: "gptToolsIcon",
            prompt: "",
            file_url: file_url || null,
          },
        };
        ws?.send(JSON.stringify(data));
      }
      setShowLoader({
        isloading: true,
        index: index,
        prompt: "",
      });
    }
  };

  useEffect(() => {
    if (message?.content?.length > 0) {
      setCurrentMessageVersionIndex(message?.content?.length - 1);
    }
  }, [message]);

  const handleTextSelection = () => {
    const selectedText = window.getSelection()?.toString();
    if (selectedText) {
      setSelectedText(selectedText);
      setShowReply({ ...showReply, index: index });
    }
  };

  const Regenerate = async () => {
    if (isViewPermission) {
      toast.error("You have only permission to view.");
    } else {
      const workspace_id_local = localStorage.getItem("workspace_id");

      if (auth && auth?.user && auth?.user?.userID) {
        // Check if the message is of type model or gpt or static gpt
        const is_static_tool = staticToolsList.includes(
          message?.type?.toLowerCase()
        );

        if (is_static_tool) {
          staticToolsRegeneration();
          return;
        }
        // refetch the category here
        await refetch();

        // For Dynamic GPT and Models
        const request = {
          type: message?.type ? message.type.toLocaleLowerCase() : "model_chat",
          index: index,
          request_type: "regenerate",
          tool_id: message?.content[0]?.tool_id,
          userID: auth?.user?.userID,
          workspace_id: activeChat?.role
            ? activeChat?.workspace_id
            : workspace_id_local, // activeChat?.role in case of shared chat,
          group_id: activeGroup?._id ?? "",
          id: chatHistoryID,
          source: "modelToolsIcon",
          prompt: "",
          context_tool_id:
            toolCategory?.category == "gpt"
              ? activeChatModel?.chat_model
              : null,
          file_url: file_url || null,
        };

        DynamicToolsRegeneration(request, toolCategory?.category);
        setShowLoader({
          isloading: true,
          index: index,
          prompt: "",
        });
      }
    }
  };

  // Called by Regenerate function internally when the regenerate is due to the text static gpts
  const staticToolsRegeneration = () => {
    const workspace_id_local = localStorage.getItem("workspace_id");
    if (connected && ws?.readyState === WebSocket.OPEN) {
      const data = {
        action: "regenerate",
        request: {
          type: message.type,
          index: index,
          id: chatHistoryID,
          userID: auth?.user?.userID,
          workspace_id: activeChat?.role
            ? activeChat?.workspace_id
            : workspace_id_local, // activeChat?.role in case of shared chat,
          group_id: activeGroup?._id ?? "",
          file_url: file_url || null,
        },
      };
      ws?.send(JSON.stringify(data));
      setShowLoader({
        isloading: true,
        index: index,
        prompt: "",
      });
    }
  };

  const onStaticToolModelClicked = (item: any) => {
    const workspace_id_local = localStorage.getItem("workspace_id");
    if (connected && ws?.readyState === WebSocket.OPEN) {
      const data = {
        action: "regenerate",
        endpoint: item.modelValue,
        request: {
          group_id: activeGroup?._id ?? "",
          id: chatHistoryID,
          index: index,
          source: "modelToolsIcon",
          tool_id: item.id,
          type: item.modelValue,
          userID: auth?.user?.userID,
          workspace_id: activeChat?.role
            ? activeChat?.workspace_id
            : workspace_id_local, // activeChat?.role in case of shared chat,
          file_url: file_url || null,
        },
      };
      ws?.send(JSON.stringify(data));
      setShowLoader({
        isloading: true,
        index: index,
        prompt: "",
      });
    }
  };

  const renderBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/); // Split by '**...**'
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index}>
            {part.slice(2, -2)} {/* Remove the '**' */}
          </strong>
        );
      }
      return part; // Return normal text without modification
    });
  };

  return (
    <div className="response-text">
      <div className="mt-0 max-w-max rounded-[20px] pl-[10px] flex items-start gap-4">
        {/* <DynamicToolsSideChatPopup
          currentMessageVersionIndex={currentMessageVersionIndex}
          onMenuToolSelection={DynamicToolsRegeneration}
          currentMessageIndex={index}
          type={message.type}
          message={message}
          onStaticToolModelClicked={onStaticToolModelClicked}
        /> */}
        <DynamicToolSideChatModel
          currentMessageVersionIndex={currentMessageVersionIndex}
          onMenuToolSelection={DynamicToolsRegeneration}
          currentMessageIndex={index}
          type={message.type}
          message={message}
          onStaticToolModelClicked={onStaticToolModelClicked}
        />
        {chatError.index !== index && (
          <span className="text-container relative">
            <div className="user-prompt relative">
              <div
                className={`absolute top-[-31px] transition-opacity duration-1000 flex items-center gap-1`}
              >
                {window.getSelection()?.toString() &&
                  showReply?.index === index && (
                    <Tooltip
                      content={<p className="text-[#FFF]">{"Reply"}</p>}
                      showArrow
                      placement="bottom"
                      delay={0}
                      closeDelay={0}
                      classNames={{
                        base: "before:bg-[#2E353C]",
                        content:
                          "bg-[#272727] text-sm font-normal leading-4 px-3 py-2",
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
                      <Image
                        src={"/svg/reply.svg"}
                        width={15}
                        height={15}
                        onClick={() => {
                          setShowReply({
                            message:
                              message.content[currentMessageVersionIndex]
                                ?.response &&
                              message.content[currentMessageVersionIndex],
                            index: index,
                            text: window.getSelection()?.toString(),
                            showInInput: true,
                          });
                          window.getSelection()?.removeAllRanges();
                        }}
                      />
                    </Tooltip>
                  )}
                {!isViewPermission && (
                  <AddToGPTChat
                    selectedText={selectedText}
                    setSelectedText={setSelectedText}
                    showGogleIcon={showGogleIcon}
                  />
                )}
              </div>
              <div
                className="text-[17px] text-[#E4E4E4] font-helvetica font-normal break-words leading-7"
                style={{ whiteSpace: "pre-wrap" }}
                onMouseUp={handleTextSelection}
              >
                {message.content[currentMessageVersionIndex]?.response &&
                  renderBoldText(
                    message.content[currentMessageVersionIndex]?.response
                  )}
              </div>
            </div>
          </span>
        )}
        {chatError.index === index && (
          <ChatErrorMessage chatError={chatError} Regenerate={Regenerate} />
        )}
      </div>
      {chatError.index !== index && (
        <div className="flex flex-row w-full pr-10 mt-4 ms-[60px]">
          <div className="flex flex-row gap-3 items-center">
            {message.content.length > 1 && (
              <AssistantMessageVersionChangeComponent
                currentMessageVersionIndex={currentMessageVersionIndex}
                message={message}
                setCurrentMessageVersionIndex={setCurrentMessageVersionIndex}
              />
            )}
            <AssistantAccessiblityFeatures
              Regenerate={Regenerate}
              message={message}
              currentMessageVersionIndex={currentMessageVersionIndex}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AssistantChat;
