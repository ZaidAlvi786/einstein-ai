import { setActiveChat } from "@/app/lib/features/chat/chatSlice";
import { setCurrentActiveGroup } from "@/app/lib/features/chat/groupSlice";
import { useAppDispatch } from "@/app/lib/hooks";
import { Button, Image, Tooltip } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";

const AddNewChat = ({ NewChat }: any) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const HandleClickOnGroupMenu = async () => {
    const groupInfo: any = await JSON.parse(
      window.localStorage.getItem("group") || "{}"
    );
    dispatch(
      setCurrentActiveGroup({
        ...groupInfo,
        _id: groupInfo?._id ?? groupInfo?.id,
      })
    );
    dispatch(setActiveChat({}));
    localStorage.removeItem("activeChatLocalStorage");

    NewChat();
    router.push("/");
    window.localStorage.setItem(
      "group",
      JSON.stringify({ ...groupInfo, _id: groupInfo?._id ?? groupInfo?.id })
    );
  };
  return (
    <Tooltip
      content={"New Chat"}
      placement="left"
      delay={0}
      closeDelay={0}
      classNames={{
        content:
          "bg-[#343434] text-sm font-normal leading-normal rounded-md px-[8px] py-[2px] helvetica-font text-white",
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
      offset={10}
    >
        <div
        className="mr-7 mt-2 hover:cursor-pointer flex-shrink-0 4k:h-[34px] 4k:w-[34px] w-[19.22px] h-auto flex items-end mb-[8px]"
        
      >
      <Button
        className={`bg-transparent p-0 min-w-9 h-9 w-9 rounded-full`}
        onClick={() => NewChat()}
      >
        <Image
          src={"/svg/edit_gray.svg"}
          alt="editIcon"
          width={19}
          height={19}
          className="hover:cursor-pointer  flex-shrink-0"
          onClick={() => {
            HandleClickOnGroupMenu();
            localStorage.removeItem("activeChatLocalStorage");
          }}
          radius="none"
        />
      </Button>
      </div>
      
    </Tooltip>
  );
};

export default AddNewChat;
