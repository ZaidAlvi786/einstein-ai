import React from "react";
import EditTextIcon from "@/app/assets/svg/edit-text-Icon.svg";
import TooltipIcon from "./ToolTipIcon";
import { UserChatProps } from "@/types/ChatTypes";
import ReplyBlockUser from "./ReplyBlockUser";
import { Image } from "@nextui-org/react";

const UserChat: React.FC<UserChatProps> = ({
  message,
  setEditModeIndex,
  enterEditMode,
  Index,
}) => {
  console.log("message: UserChat", message);
  return (
    <div className="flex flex-col justify-end ml-2 max-w-xl items-end gap-2">
      {/* <Image
          src={"https://chat-media-einstein.s3.amazonaws.com/image/58eb16e3-8547-41b1-89a8-9767f93a139a.png"}
          // src={"https://chat-media-einstein.s3.amazonaws.com/image/52bb81b8-ee18-479e-a463-f2601da55e7b.png"}

          alt="attach-chat"
          width={'auto'}
          height={'auto'}
          style={{maxWidth: '530px', maxHeight: '225px', objectFit:'cover'}}
        /> */}
      {message?.reply && <ReplyBlockUser text={message?.reply} />}
      <div className="edit-input-field flex items-start justify-end gap-2.5 relative">
        <div
          className="mt-1 cursor-pointer edit-icon w-10 h-10 rounded-full bg-transparent shrink-0 hover:bg-[#272727] flex justify-center items-center"
          onClick={() => {
            enterEditMode(message?.content);
            setEditModeIndex(Index);
          }}
        >
          <TooltipIcon title="Edit" Icon={EditTextIcon} />
        </div>
        
        <div>
          <div className="max-w-max break-words text-[20px] text-[#FFF] font-helvetica font-normal leading-8 bg-[#272727] rounded-[20px] py-2 px-5">
            <div className="user-prompt">
              <div
                className="text-[17px] text-[#E4E4E4] font-helvetica font-normal break-words leading-7"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {message.content}
              </div>
            </div>
          </div>
          <div
            className="text-gray-500 text-[10px] mr-4"
            style={{ textAlign: "end" }}
          >
            {message.edited && "Edited"}
          </div>
        </div>
        <div className="flex justify-center items-center absolute -right-10"></div>
      </div>
    </div>
  );
};

export default UserChat;
