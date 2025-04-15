import { useAuth } from "@/app/authContext/auth";
import { useAppSelector } from "@/app/lib/hooks";
import { Spinner } from "@nextui-org/react";
import { X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FileDropZone } from "./FileDropZone";
// import TextEditor from "./TextEditor";

const EditChatBlock = ({
  editingMessage,
  setEditModeIndex,
  setEditingMessage,
  message,
  index,
  getChatHistory,
  isHistoryApiLoading,
  file_url,
  attachedFiles,
  setAttachedFiles,
  acceptType
}: any) => {
  console.log("🚀 ~ file_url: edit chat blcok", file_url);
  const textareaRef = useRef(null);
  const ws = useAppSelector((state: any) => state.webSocket.ws);
  const connected = useAppSelector((state: any) => state.webSocket.connected);
  const searchParams: any = useSearchParams();
  // const chatHistoryID: any = searchParams?.get("chat") ?? null;
  const { id: chatHistoryID } = useAppSelector((state: any) => state.chat.activeChat);
  const auth: any = useAuth();
  console.log("🚀 ~ attachedFiles:", attachedFiles);
  const [isLoadingAttachedFiles, setIsLoadingAttachedFiles] = useState(false);
  const fileInputRefNew = useRef<HTMLInputElement | null>(null);
  // const editorRef = useRef<HTMLDivElement>(null);

  const activeGroup = useAppSelector(
    (state: any) => state.group.currentActiveGroup
  );
  const activeChat = useAppSelector((state: any) => state.chat.activeChat);
  const isViewPermission =
    activeChat?.role === "view" || activeChat?.permission_type === "view";
  const [isloading, setIsLoading] = useState(false);
  const activeChatModel = useAppSelector(
    (state: any) => state.chat.activeChatModel
  );

  useEffect(() => {
    // Adjust initial width and height based on content
    if (textareaRef.current) {
      autoResizeTextarea(textareaRef.current);
    }
    // if(editingMessage && editorRef.current){
    //   editorRef.current.innerHTML = editingMessage
    // }
  }, []);

  useEffect(() => {
    if (!isHistoryApiLoading) {
      setIsLoading(false);
    }
  }, [isHistoryApiLoading]);

  const autoResizeTextarea = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = element.scrollHeight + "px";
    element.style.width = "auto";
    element.style.width = element.scrollWidth + "px";
  };
  // Function to cancel edit
  const cancelEdit = () => {
    // Reset edit mode index to -1 to exit edit mode
    setEditModeIndex(-1);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditingMessage(e.target.value);
    autoResizeTextarea(e.target);
  };

  const hasTextContent = (element: HTMLElement | null): boolean => {
    if (!element) return false;
  
    // Extract text content, trim it, and check if there's actual text
    const text = element.textContent?.trim() || "";
    return text.length > 0;
  };
  

  
  const sendEditMessage = () => {
    if (editingMessage?.length === 0) return;    
    // if (!hasTextContent(editorRef.current)) return;
    if (isViewPermission) {
      toast.error("You have only permission to view.");
    } else {
      setIsLoading(true);
      const workspace_id_local = localStorage.getItem("workspace_id");
      if (connected && ws?.readyState === WebSocket.OPEN) {
        const data = {
          action: "edit",
          endpoint: "edit",
          request: {
            type: activeChatModel?.modelName ?? "", // Edit should be using the model that is selected in the input bar
            id: chatHistoryID ?? null,
            tool_id: activeChatModel?.id,
            new_prompt: editingMessage,
            // new_prompt: editorRef.current?.innerHTML,
            userID: auth?.user?.userID,
            index: index,
            workspace_id: activeChat?.role
              ? activeChat?.workspace_id
              : workspace_id_local, // activeChat?.role in case of shared chat
            file_url: attachedFiles.length > 0 ? attachedFiles : null,
          },
        };
        ws?.send(JSON.stringify(data));
        setTimeout(() => {
          getChatHistory();
        }, 1000);
      }
    }
  };

  const handlePressEnter = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendEditMessage();
    }
  };

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
    <div className="flex flex-col mt-4 mb-7 w-[98%] bg-[#3A3A3A] h-auto rounded-[32px]">
      <div className="relative group pr-5 pt-2 ml-auto">
        <FileDropZone
          fileInputRefNew={fileInputRefNew}
          onFilesSelected={handleFilesSelected}
          accept={acceptType}
          setAttachedFiles={setAttachedFiles}
          setIsLoading={setIsLoadingAttachedFiles}
          attachedFiles={attachedFiles}
        />
      </div>
      <textarea
        value={editingMessage}
        onChange={handleEditChange}
        className="px-7 py-4 border-0 !h-[52px] bg-[#3A3A3A] rounded-[32px] w-full focus:outline-none resize-none  max-msm:text-[15px] text-[#E4E4E4] helvetica-font font-normal tracking-[0.2px] leading-[28.8px] text-[17px] text-end overflow-hidden	"
        style={{ minWidth: "600px", maxWidth: "100%" }}
        ref={textareaRef}
        onKeyDown={handlePressEnter}
      />
{/* 
<TextEditor
          value={editingMessage}
          setValue={setEditingMessage}
          activeChatModel={activeChatModel}
          onKeyDown={handlePressEnter}
          editorRef={editorRef}
          isEdit={true}
        /> */}
      <div className="mt-3">
        <div className="flex justify-end items-center pb-5 pe-5">
          <button
            className="px-7 py-1 mr-3 rounded-full  font-helvetica font-bold h-[36px] pt-[6px] bg-[#1E1E1E] text-[#E9E9E9]"
            onClick={() => cancelEdit()}
          >{`Cancel`}</button>
          {(activeChatModel?.image_upload_support || activeChatModel?.document_upload_support || activeChatModel?.audio_upload_support) && (
            <div className="flex items-center 2xl:min-w-[25px] xl:min-w-[18px] 2xl:h-[25px] xl:h-[18px] ml-[4px] justify-center my-auto">
              <button
                className="px-6 py-1.5 mr-3  whitespace-nowrap bg-[#E9E9E9] text-center text-[#0F0F0F]  rounded-full font-helvetica font-bold text-[16px]"
                onClick={handleImageClick}
              >
                {isLoadingAttachedFiles ? (
                  <div className="flex justify-center items-center">
                    <Spinner color="default" size="sm" />
                  </div>
                ) : (
                  `Attach`
                )}
              </button>
            </div>
          )}

          <button
            className="px-6 py-1.5 whitespace-nowrap bg-[#E9E9E9] text-center text-[#0F0F0F]  rounded-full font-helvetica font-bold text-[16px]"
            onClick={() => sendEditMessage()}
          >
            {isloading ? (
              <div className="flex justify-center items-center">
                <Spinner color="default" size="sm" />
              </div>
            ) : (
              `Send`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditChatBlock;
