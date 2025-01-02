import React from "react";
import EditTextIcon from "@/app/assets/svg/edit-text-Icon.svg";
import TooltipIcon from "./ToolTipIcon";
import { UserChatProps } from "@/types/ChatTypes";
import ReplyBlockUser from "./ReplyBlockUser";
import { Image } from "@nextui-org/react";
import { AttachedImageBlock } from "./AttachedImageBlock";

const UserChat: React.FC<UserChatProps> = ({
  message,
  setEditModeIndex,
  enterEditMode,
  Index,
}) => {
  console.log("message: UserChat", message);
  return (
    <div className="flex flex-col justify-end ml-2 max-w-xl items-end gap-2">
      {message?.reply && <ReplyBlockUser text={message?.reply} />}
      <div>
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

          <div className="">
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
        </div>

        <div className="flex justify-center items-center absolute -right-10"></div>
      </div>
      {message?.file_url && message?.file_url?.length > 0 && (
        <div className="w-full flex justify-end items-center mt-2">
          <AttachedImageBlock attachedFiles={message?.file_url} />
        </div>
      )}
    </div>
  );
};

export default UserChat;
