import React, { useEffect, useRef, useState } from "react";
import AssistantChat from "./AssistantChat";
import UserChat from "./UserChat";
import { ChatRecord } from "@/types/ChatTypes";
import Loader from "./Loader";
import EditChatBlock from "./EditChatBlock";

interface showLoaderProp {
  prompt: string;
  isloading: boolean;
  index: number | null;
}

interface ChatBlockProps {
  chatRecord: ChatRecord;
  index: number;
  setShowLoader: any;
  showLoader: showLoaderProp;
  chatError: any;
  setShowReply: any;
  showReply: any;
  editModeIndex:any;
  setEditModeIndex:any;
  getChatHistory:any;
  isHistoryApiLoading:boolean
}

const ChatBlock: React.FC<ChatBlockProps> = ({
  chatRecord,
  index,
  setShowLoader,
  showLoader,
  chatError,
  setShowReply,
  showReply,
  editModeIndex,
  setEditModeIndex,
  getChatHistory,
  isHistoryApiLoading
}) => {
  console.log("index: chatblock ", index);
  const [showGogleIcon, setShowGogleIcon] = useState(false);
  const [editingMessage, setEditingMessage] = useState("");


  const enterEditMode = (message: string) => {
    setEditingMessage(message);
  };

  return (
    <div
      onMouseEnter={() => setShowGogleIcon(true)}
      onMouseLeave={() => setShowGogleIcon(false)}
    >
      <div key={`${index}-user`} className={`flex justify-end mb-2.5`}>
        {editModeIndex === index ? (
          <EditChatBlock
            message={chatRecord[1]}
            index={index}
            editingMessage={editingMessage}
            setEditingMessage={setEditingMessage}
            setEditModeIndex={setEditModeIndex}
            getChatHistory={getChatHistory}
            isHistoryApiLoading={isHistoryApiLoading}
          />
        ) : (
          <div
            className={`p-2.5 rounded-md max-w-[70%] break-words bg-user-color`}
          >
            <UserChat
              message={chatRecord[0]}
              Index={index}
              setEditModeIndex={setEditModeIndex}
              enterEditMode={enterEditMode}
            />
          </div>
        )}
      </div>
      <div key={`${index}-assistant`} className={`flex justify-start mb-2.5`}>
        <div className={`p-2.5 rounded-md w-full`}>
          {showLoader?.isloading && showLoader?.index === index ? (
            <Loader />
          ) : (
            <AssistantChat
              setShowLoader={setShowLoader}
              message={chatRecord[1]}
              index={index}
              chatError={chatError}
              showGogleIcon={showGogleIcon}
              setShowReply={setShowReply}
              showReply={showReply}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBlock;
