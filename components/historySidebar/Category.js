"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import PlusIcon from "../../app/assets/svg/plus.svg";
import Image from "next/image";
import RightClickGroupMenu from "./RightClickGroupMenu";
import Add_Group from "../group/add_group";
import {
  useAddGroupMutation,
  useGetAllGroupByWorkspaceIdQuery,
  useReorderGroupsMutation,
  useTransferChatToAnotherGroupMutation,
} from "@/app/lib/features/chat/chatApi";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { useAuth } from "@/app/authContext/auth";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { setCurrentActiveGroup } from "@/app/lib/features/chat/groupSlice";
import Edit_Group from "../group/edit_group";
import { Tooltip } from "@nextui-org/react";
import { setActiveChat } from "@/app/lib/features/chat/chatSlice";
import toast from "react-hot-toast";

const SidebarCategory = ({ NewChat, scrollToBottom, setHeight, overflow }) => {
  const auth = useAuth();
  const dispatch = useAppDispatch();
  const [AddGroup] = useAddGroupMutation();
  const [TransferChatToAnotherGroup] = useTransferChatToAnotherGroupMutation();
  const [ReorderGroups] = useReorderGroupsMutation();
  const activeWorkspace = useAppSelector(
    (state) => state.workspace.activeWorkspace
  );
  const { data, isLoading, isError, error } = useGetAllGroupByWorkspaceIdQuery(
    activeWorkspace?._id,
    { skip: !activeWorkspace?._id }
  );
  const [addOrEditGroup, setAddOrEditGroup] = useState({
    mode: "",
    groupInfo: {},
  });
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dragItem = useRef();
  const dragOverItem = useRef();
  const [groupData, setGroupData] = useState(data?.data);

  useEffect(() => {
    setGroupData(data?.data ?? []);
    if (
      data === undefined &&
      isError === true &&
      error?.data?.detail === "404: Group not found" &&
      isLoading === false
    ) {
      // Add general group
      const AddGeneralGroup = async (data) => {
        const result = await AddGroup(data).unwrap();
      };

      AddGeneralGroup({
        name: "General",
        workspace_id: activeWorkspace?._id,
        user_id: auth?.user?.userID,
      });
    }

    if (data?.data.length > 0) {
      // set group container initial height
      setHeight(data?.data.length * 38);
    }
  }, [data, isLoading, isError]);

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const HandleClickOnGroup = (groupInfo) => {
    dispatch(setCurrentActiveGroup(groupInfo));
    router.push(pathname + "?" + createQueryString("group", groupInfo?._id));
    window.localStorage.setItem("group", JSON.stringify(groupInfo));
  };

  useEffect(() => {
    if (searchParams.has("group") === false) {
      if (window.localStorage.getItem("group")) {
        const storeGroupInfo = JSON?.parse(
          window.localStorage.getItem("group")
        );
        HandleClickOnGroup(storeGroupInfo);
      } else if (data?.data?.length > 0) {
        HandleClickOnGroup(data?.data[0]);
      }
    } else {
      const group = window.localStorage.getItem("group");
      if (group && group != "undefined") {
        const storeGroupInfo = JSON?.parse(group);
        HandleClickOnGroup(storeGroupInfo);
      }
    }
  }, [searchParams, data]);

  const createMultipleQueryString = useCallback(
    (paramsToUpdate) => {
      const newParams = new URLSearchParams(searchParams);

      Object.keys(paramsToUpdate).forEach((param) => {
        newParams.set(param, paramsToUpdate[param]);
      });

      return newParams.toString();
    },
    [searchParams]
  );

  const HandleClickOnGroupMenu = (groupInfo) => {
    dispatch(
      setCurrentActiveGroup({
        ...groupInfo,
        _id: groupInfo?._id ?? groupInfo?.id,
      })
    );
    dispatch(setActiveChat({}));
    // if (auth.user.price > 0) {
    NewChat();
    router.push(
      "/" +
        "?" +
        createMultipleQueryString({
          chat: "new",
          group: groupInfo?._id ?? groupInfo?.id,
        })
    );
    // } else {
    //   toast.error("You don't have enough credits to make this request. Please top up your account.");
    // }
    window.localStorage.setItem(
      "group",
      JSON.stringify({ ...groupInfo, _id: groupInfo?._id ?? groupInfo?.id })
    );
  };

  const HandleMoveToChatToAnotherGroup = (chat_id, group_id) => {
    const data = {
      user_id: auth?.user?.userID,
      group_id,
      chat_id,
      workspace_id: activeWorkspace?._id,
    };

    TransferChatToAnotherGroup(data)
      .unwrap()
      .then((response) => {
        console.log("Response : ", response);
      })
      .catch((error) => {
        console.log("Error : ", error);
        toast.error(error?.data?.message);
      });
  };

  const dragStart = (e, position) => {
    dragItem.current = position;
  };

  const dragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const HandleChangeGroupOrder = (reordering_list) => {
    const data = {
      reordering_list,
    };

    ReorderGroups(data)
      .unwrap()
      .then((response) => {
        console.log("Response : ", response);
      })
      .catch((error) => {
        console.log("Error : ", error);
        toast.error(error?.data?.message);
      });
  };

  const drop = (e) => {
    const copyListItems = [...groupData];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setGroupData(copyListItems);

    const newly_reordering_list = copyListItems?.map((item, index) => ({
      group_id: item?._id,
      order: index,
    }));
    HandleChangeGroupOrder(newly_reordering_list);
  };

  return (
    <>
      <ul className='flex flex-col gap-[7px]'>
        {groupData &&
          groupData?.map((item, index) => (
            <React.Fragment key={index}>
              {addOrEditGroup?.mode === "edit" &&
              addOrEditGroup.groupInfo?.group_id === item?._id ? (
                <Edit_Group
                  addOrEditGroup={addOrEditGroup}
                  setAddOrEditGroup={setAddOrEditGroup}
                />
              ) : (
                <li
                  key={index}
                  className={`flex gap-3 justify-between items-center px-[8px] cursor-pointer rounded-lg transition-all`}
                  onDragOver={(e) => {
                    e?.preventDefault();
                  }}
                  onDrop={(event) => {
                    const chat_id = event?.dataTransfer?.getData("chat_id");
                    if (chat_id) {
                      HandleMoveToChatToAnotherGroup(chat_id, item?._id);
                    }
                  }}
                  onDragStart={(event) => dragStart(event, index)}
                  onDragEnter={(event) => dragEnter(event, index)}
                  onDragEnd={drop}
                  draggable
                >
                  <div className='flex justify-between items-center w-full'>
                    <RightClickGroupMenu
                      DND={{ dragStart, dragEnter, index }}
                      HandleClickOnGroup={HandleClickOnGroupMenu}
                      groupInfo={item}
                      allGroupsList={data?.data}
                      setAddOrEditGroup={setAddOrEditGroup}
                    />
                    <div className='rounded text-sm text-[#E9E9E9] font-medium flex gap-1 justify-center items-center'>
                      <Tooltip
                        content={"New Chat"}
                        placement='left'
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
                        <div className='hover:cursor-pointer flex-shrink-0 4k:h-[34px] 4k:w-[34px] w-[19.22px] h-[19.18px]'>
                          <Image
                            src={"/svg/edit.svg"}
                            alt="editIcon"
                            width={"4k" ? 34 : 14}
                            height={"4k" ? 34 : 14}
                            className='hover:cursor-pointer flex-shrink-0 4k:h-[34px] 4k:w-[34px] w-[18px] h-[17.86px]'
                            onClick={() => HandleClickOnGroupMenu(item)}
                          />
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                </li>
              )}
            </React.Fragment>
          ))}
        {addOrEditGroup?.mode === "add" ? (
          <Add_Group
            addOrEditGroup={addOrEditGroup}
            setAddOrEditGroup={setAddOrEditGroup}
            HandleClickOnGroupMenu={HandleClickOnGroupMenu}
          />
        ) : (
          <></>
        )}
      </ul>

      <div className='flex py-1 px-2.5 justify-end absolute right-[10px] bottom-[-7px] w-full z-[-1]'>
        <div className='back_main'>
          <button
            className={`plusButton ${
              addOrEditGroup?.mode === "add" ? "!left-[-15.647px]" : ""
            } ${overflow == true ? "!left-[-15.647px]" : ""} ${
              groupData?.length > 1 ? "left-[-12.5px]" : "left-[-16.18px]"
            }`}
            onClick={() => {
              setAddOrEditGroup({ mode: "add", groupInfo: {} });
              scrollToBottom();
            }}
          >
            <PlusIcon className='plusIcon flex-shrink-0' />
          </button>
          <div className='addGroup'>Add Group</div>
        </div>
      </div>
    </>
  );
};

export default SidebarCategory;
