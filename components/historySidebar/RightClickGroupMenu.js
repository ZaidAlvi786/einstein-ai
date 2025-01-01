"use client";
import React, { useState } from "react";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import RenameIcon from "../../app/assets/svg/rename.svg";
import MoveIcon from "../../app/assets/svg/move.svg";
import DeleteIcon from "../../app/assets/svg/delete.svg";
import { Avatar } from "@nextui-org/react";
import Edit_Group from "../group/edit_group";
import DeleteGroupConfirmtionModal from "../group/delete_group";
import { useAuth } from "@/app/authContext/auth";
import { useGetAllWorkspacesQuery } from "@/app/lib/features/workspace/workspaceApi";
import {
  useMoveAllChatToNewGroupMutation,
  useMoveGroupToAnotherWorkspaceMutation,
} from "@/app/lib/features/chat/chatApi";
import { useAppSelector } from "@/app/lib/hooks";
import toast from "react-hot-toast";

const RightClickGroupMenu = ({
  groupInfo,
  allGroupsList,
  HandleClickOnGroup,
  setAddOrEditGroup,
  DND,
}) => {
  const auth = useAuth();
  const { data: allWorkSpacesDetails } = useGetAllWorkspacesQuery(
    auth?.user?.userID,
    { skip: !auth?.user?.userID }
  );
  const [deleteGroupModel, setDeleteGroupModel] = useState({
    open: false,
    name: "",
    group_id: "",
  });
  const [activeGroupMenuId, setActiveGroupMenuId] = useState("");
  const [MoveGroupToAnotherWorkspace] =
    useMoveGroupToAnotherWorkspaceMutation();
  const [MoveAllChatToNewGroup] = useMoveAllChatToNewGroupMutation();
  const activeGroup = useAppSelector((state) => state.group.currentActiveGroup);
  const activeWorkspace = useAppSelector(
    (state) => state.workspace.activeWorkspace
  );
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleClick = (event) => {
    setCoords({ x: event.clientX, y: event.clientY - 100 });
    handleContextMenu(event);
  };

  // Handler to open the menu on right-click
  const handleContextMenu = (e) => {
    e.preventDefault();
    setActiveGroupMenuId(groupInfo?._id);
  };

  // Close menu handler
  const handleCloseMenu = () => {
    setActiveGroupMenuId("");
  };

  const handleGroupClick = (groupInfo) => {
    HandleClickOnGroup(groupInfo);
  };

  const HandleMoveToWorkspace = (group_id, workspace_id) => {
    const data = {
      user_id: auth?.user?.userID,
      group_id,
      workspace_id,
      status: "active",
    };

    MoveGroupToAnotherWorkspace(data)
      .unwrap()
      .then((response) => {
        console.log("Response : ", response);
      })
      .catch((error) => {
        console.log("Error : ", error);
        toast.error(error?.data?.message);
      });
  };

  const HandleMoveToAllChatToNewGroup = (new_group_id) => {
    const data = {
      user_id: auth?.user?.userID,
      old_group_id: groupInfo?._id,
      new_group_id,
      workspace_id: activeWorkspace?._id,
    };

    MoveAllChatToNewGroup(data)
      .unwrap()
      .then((response) => {
        console.log("Response : ", response);
      })
      .catch((error) => {
        console.log("Error : ", error);
      });
  };

  return (
    <>
      <p
        onClick={() => handleGroupClick(groupInfo)}
        onContextMenu={handleClick}
        className={`font-medium mb-0 ${
          activeGroup?._id === groupInfo?._id ? "text-white" : "text-[#E9E9E9]"
        } hover:text-white !tracking-normal 4k:!text-[26px] !text-[14px] font-bold truncate capitalize w-full font-inter`}
      >
        {groupInfo?.name}
      </p>

      <div
        style={{
          position: "absolute",
          left: `${coords.x}px`,
          top: `${coords.y}px`,
        }}
      >
        <Menu
          placement='left-start'
          open={activeGroupMenuId === groupInfo?._id}
          handler={() => handleCloseMenu(groupInfo)}
        >
          <MenuHandler>
            {/* <p onContextMenu={handleContextMenu} className={`font-bold mb-0 ${(activeGroup?._id === groupInfo?._id) ? 'text-white' : 'text-[#ababab]'} hover:text-white font-bold text-sm truncate capitalize w-full font-helvetica`}>{groupInfo?.name}</p> */}
            <p></p>
          </MenuHandler>
          <MenuList
            className={`bg-[#2F2F2F] border-0 text-white shadow-md p-1.5 !z-[9999] `}
          >
            <MenuItem
              onClick={() =>
                setAddOrEditGroup({
                  mode: "edit",
                  groupInfo: {
                    name: groupInfo?.name,
                    group_id: groupInfo?._id,
                  },
                })
              }
              className='flex pt-2 gap-2 hover:bg-[#505050] cursor-pointer items-center'
            >
              <div>
                <RenameIcon />
              </div>
              <div className='font-helvetica'>{"Rename"}</div>
            </MenuItem>
            {allGroupsList?.length > 0 ? (
              <Menu placement='right-start' allowHover offset={15}>
                <MenuHandler>
                  <MenuItem className='flex pt-2 gap-2 hover:bg-[#505050] cursor-pointer items-center'>
                    <div>
                      <MoveIcon />
                    </div>
                    <div className='font-helvetica'>
                      {"Move all chats to Group"}
                    </div>
                  </MenuItem>
                </MenuHandler>
                <MenuList className='bg-[#2F2F2F] border-0 text-white shadow-md p-1.5 z-[9999]'>
                  {allGroupsList?.map((item, key) => (
                    <MenuItem
                      onClick={() => HandleMoveToAllChatToNewGroup(item?._id)}
                      key={key}
                      className='flex pt-2 gap-2 hover:bg-[#505050] cursor-pointer items-center'
                      disabled={activeGroup?._id === item?._id}
                    >
                      <div className='text-white capitalize font-helvetica'>
                        {item.name}
                      </div>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            ) : (
              <MenuItem className='flex pt-2 gap-2 hover:bg-[#505050] cursor-pointer items-center'>
                <div>
                  <MoveIcon />
                </div>
                <div className='font-helvetica'>{"Move to Group"}</div>
              </MenuItem>
            )}
            {allWorkSpacesDetails?.data?.length > 0 ? (
              <Menu placement='right-start' allowHover offset={15}>
                <MenuHandler>
                  <MenuItem className='flex pt-2 gap-2 hover:bg-[#505050] cursor-pointer items-center'>
                    <div>
                      <MoveIcon />
                    </div>
                    <div className='font-helvetica'>{"Move to Workspace"}</div>
                  </MenuItem>
                </MenuHandler>
                <MenuList className='bg-[#2F2F2F] border-0 text-white shadow-md p-1.5 z-[9999]'>
                  {allWorkSpacesDetails?.data?.map((item, key) => (
                    <MenuItem
                      onClick={() =>
                        HandleMoveToWorkspace(groupInfo?._id, item?._id)
                      }
                      key={key}
                      className='flex pt-2 gap-2 hover:bg-[#505050] cursor-pointer items-center px-2 py-1'
                      disabled={activeWorkspace?._id === item?._id}
                    >
                      <Avatar
                        className='h-8 w-8'
                        src={item?.logo_url}
                        showFallback
                      />
                      <div>
                        <p className='font-bold text-white text-sm font-helvetica'>
                          {item?.name}
                        </p>
                        {/* <span className="font-medium text-xs text-[#818181] font-helvetica">{"Premium Plan 3 member"}</span> */}
                      </div>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            ) : (
              <MenuItem className='flex pt-2 gap-2 hover:bg-[#505050] cursor-pointer items-center'>
                <div>
                  <MoveIcon />
                </div>
                <div className='font-helvetica'>{"Move to Workspace"}</div>
              </MenuItem>
            )}
            <MenuItem
              onClick={() =>
                setDeleteGroupModel({
                  open: true,
                  name: groupInfo?.name,
                  group_id: groupInfo?._id,
                })
              }
              className='flex pt-2 gap-2 hover:bg-[#505050] cursor-pointer items-center'
            >
              <div>
                <DeleteIcon />
              </div>
              <div className='font-helvetica text-[#E54637]'>{"Delete"}</div>
            </MenuItem>
          </MenuList>
        </Menu>
      </div>

      {/* Delete Group Model */}
      <DeleteGroupConfirmtionModal
        deleteGroupModel={deleteGroupModel}
        setDeleteGroupModel={setDeleteGroupModel}
      />
    </>
  );
};

export default RightClickGroupMenu;
