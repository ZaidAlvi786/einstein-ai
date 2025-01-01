"use client";
import React, { useState } from "react";
import {
  Button,
  Input,
  Dropdown,
  DropdownItem,
  DropdownTrigger,
  DropdownMenu,
  Avatar,
  Divider,
} from "@nextui-org/react";
import Usericon from "@/app/assets/svg/user-icon.svg";
import Downarrow from "@/app/assets/svg/keyboard_arrow_down.svg";
import Copyicon from "@/app/assets/svg/copy-icon.svg";
import Trashicon from "@/app/assets/svg/trash-icon.svg";
import CreateWorkSpaceModal from "@/components/layout/CreateWorkSpaceModal";
import EditWorkSpaceModal from "@/components/layout/workspace/editWorkspace";
import DeleteWorkspaceConfirmationModal from "@/components/layout/workspace/deleteWorkspace";
import { useAuth } from "@/app/authContext/auth";
import { useGetAllWorkspacesQuery } from "@/app/lib/features/workspace/workspaceApi";
import Image from "next/image";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import RoleRequestModel from "@/components/workSpace/roleRequestModel";

const groupNotificationDataByDate = (data, current_loggedIn_user_id) => {

  const categorizedWorkspaces = data.reduce((acc, item) => {
    if (item?.members?.find((ele) => ele?.role === "owner")?.user_id === current_loggedIn_user_id) {
      acc.myWorkspace.push(item);
    } else {
      acc.sharedWorkspace.push(item);
    }

    return acc;
  }, { myWorkspace: [], sharedWorkspace: [] });

  return categorizedWorkspaces;
};

const Workspaces = () => {
  const auth = useAuth();
  const [selected, setSelected] = useState("plugin");
  const [selectedKeys, setSelectedKeys] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editWorkspace, setEditWorkspace] = useState({ open: false, workspaceData: null, });
  const [model, setModel] = useState({ open: false });
  const [deleteWorkspace, setDeleteWorkspace] = useState({ open: false, workspace_id: "" });

  const { data: allWorkSpaces, isFetching, refetch } = useGetAllWorkspacesQuery(auth?.user?.userID, { skip: !auth?.user?.userID });
  const WP = groupNotificationDataByDate(allWorkSpaces?.data ?? [], auth?.user?.userID);

  const closeModal = () => {
    setModalOpen(false);
  };

  const onFetchWorkspace = () => {
    refetch();
  };

  const UserRoleInWorkspace = (workspaceInfo, action) => {
    const membersRole = workspaceInfo?.members?.find((member) => member?.user_id === auth?.user?.userID);
    if (membersRole?.role === "owner" || membersRole?.role === "edit") {
      if (action === "delete") {
        setDeleteWorkspace({ open: true, workspace_id: workspaceInfo?._id });
      } else if (action === "edit") {
        setEditWorkspace({ open: true, workspaceData: workspaceInfo });
      }
    } else {
      setModel({ open: true });
    }
  };

  return (
    <>
      <div className="xl:max-w-[1000px] 2xl:max-w-[1250px] mx-auto w-full mt-12">
        <div className="mb-12">
          <h2 className="text-white text-[32px] font-bold font-helvetica mb-[14px]">
            Workspaces
          </h2>
          <p className="text-[#B5B5B5] font-bold">
            {`Whether you’re writing marketing copy, creating a slideshow, turning
          images into videos and more, find the tools you need to empower your
          work process.`}
          </p>
        </div>
        <div className="flex items-baseline	">
          <div className="w-full">
            <Tabs
              size="md"
              radius="full"
              aria-label="Tabs form"
              selectedKey={selected}
              onSelectionChange={setSelected}
              className="font-helvetica text-[#FFF] text-sm py-0"
              classNames={{
                tabContent: "text-[#fff] group-data-[selected=true]:text-[#000] font-bold",
                cursor: "bg-[#fff]",
                tabList: "p-0 bg-transparent",
                tab: "inline-flex items-center justify-center gap-2.5 px-5 py-1.5 rounded-full border border-[#E2E2E2] group-data-[selected=true]:text-[#000] ",
              }}
            >
              <Tab key="myWorkspace" title="My workspaces">
                <div className="w-full">
                  {(WP?.myWorkspace?.length > 0) ? (
                    <div className="grid grid-cols-12 gap-4 pb-12">
                      {WP?.myWorkspace?.map((workspace, index) => (
                        <div key={index} className="xl:col-span-4 lg:col-span-6">
                          <div className="workspace-card mt-4">
                            <div className="justify-between py-4 px-[24px]">
                              <div className="text-end text-[12px] text-white font-bold helvetica-font cursor-pointer" onClick={() => UserRoleInWorkspace(workspace, "edit")}>{`Edit`}</div>
                            </div>
                            <div className="py-[0px] gap-[0px] overflow-auto">
                              <div className="flex justify-center items-center w-full mb-10">
                                <Avatar
                                  src={workspace?.logo_url}
                                  showFallback={true}
                                  className="w-12 h-12 cursor-pointer"
                                  fallback={
                                    <Image
                                      src={"/svg/user.svg"}
                                      alt="profile-pic"
                                      width={14}
                                      height={17}
                                    />
                                  }
                                />
                              </div>
                              <div className="mb-10 px-[24px]">
                                <Input
                                  isClearable={false}
                                  color="primary"
                                  classNames={{
                                    label: "text-white",
                                    input: [
                                      "!bg-transparent",
                                      "placeholder:text-[#6A6A6A]",
                                      "text-[14px]",
                                      "font-normal",
                                      "font-inter",
                                      "group-data-[has-value=true]:text-white  ",
                                      "font-medium text-[#6A6A6A] text-sm font-helvetica caret-white outline-0 placeholder:text-[#9B9B9B]",
                                    ],
                                    inputWrapper: [
                                      "!bg-transparent",
                                      "rounded-[8px]",
                                      "data-[hover=true]:bg-[#232323]",
                                      "group-data-[focus=true]:bg-[#232323]",
                                      "group-data-[has-value=true]:text-white",
                                      "h-[35px] outline-0 outline-[#424242] border-1 group-data-[focus=true]:border-[#0A84FF]",
                                    ],
                                  }}
                                  type="text"
                                  placeholder="Company Research"
                                  labelPlacement="outside"
                                  label={
                                    <p
                                      className={`text-white font-bold helvetica-font mb-1 text-[12px]`}
                                    >
                                      Workspace name
                                    </p>
                                  }
                                  name="name"
                                  value={workspace?.name ?? ""}
                                  variant="bordered"
                                />
                              </div>
                              <div className="mb-4 px-[24px]">
                                <Input
                                  isClearable={false}
                                  color="primary"
                                  classNames={{
                                    label: "text-white",
                                    input: [
                                      "!bg-transparent",
                                      "placeholder:text-[#6A6A6A]",
                                      "text-[14px]",
                                      "font-normal",
                                      "font-inter",
                                      "group-data-[has-value=true]:text-white  ",
                                      "font-medium text-[#6A6A6A] text-sm font-helvetica caret-white outline-0 placeholder:text-[#9B9B9B]",
                                    ],
                                    inputWrapper: [
                                      "!bg-transparent",
                                      "rounded-[8px]",
                                      "data-[hover=true]:bg-[#232323]",
                                      "group-data-[focus=true]:bg-[#232323]",
                                      "group-data-[has-value=true]:text-white",
                                      "h-[35px] outline-0 outline-[#424242] border-1 group-data-[focus=true]:border-[#0A84FF]",
                                    ],
                                  }}
                                  type="text"
                                  placeholder="Add people by username or email"
                                  labelPlacement="outside"
                                  label={
                                    <p
                                      className={`text-white font-bold helvetica-font mb-1 text-[15px]`}
                                    >
                                      Share this workspace
                                    </p>
                                  }
                                  variant="bordered"
                                  isDisabled={true}
                                />
                              </div>
                              <div>
                                <div className="px-[24px]">
                                  <p className="text-white font-bold helvetica-font mb-5 ml-1 text-sm	">{`People with access`}</p>
                                </div>
                                <div className="max-h-[170px] h-[170px] overflow-y-auto px-[24px] workspace-members-card">
                                  {workspace?.members?.map((member, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between mb-3"
                                    >
                                      <div className="flex items-center gap-2">
                                        <Avatar
                                          src={member?.profile_picture_url}
                                          showFallback={true}
                                          className="w-8 h-8 cursor-pointer"
                                          fallback={
                                            <Image
                                              src={"/svg/user.svg"}
                                              alt="profile-pic"
                                              width={14}
                                              height={17}
                                            />
                                          }
                                        />
                                        <p className="text-white font-medium helvetica-font mb-0 text-sm">
                                          {member?.user?.full_name}{" "}
                                          {member?.user_id === auth?.user?.userID
                                            ? "(You)"
                                            : ""}
                                        </p>
                                      </div>
                                      <p className="flex justify-end items-center !bg-transparent text-white font-normal helvetica-font cursor-pointer text-sm">
                                        {member.role === "edit"
                                          ? "Can Edit"
                                          : member.role === "view"
                                            ? "Can View"
                                            : member.role === "delete"
                                              ? "Remove"
                                              : member.role === "owner"
                                                ? "Owner"
                                                : ""}{" "}
                                        {member.role === "owner" ? (
                                          ""
                                        ) : (
                                          <Downarrow className="ml-2" />
                                        )}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="mt-5 px-[24px]">
                                <div>
                                  <p className="text-white font-bold helvetica-font mb-5 text-sm">{`General access`}</p>
                                </div>
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-1 cursor-pointer">
                                    <Copyicon />
                                    <p className="text-[#0A84FF] font-medium helvetica-font mb-0 text-sm">
                                      Copy link
                                    </p>
                                  </div>
                                  <Dropdown
                                    classNames={{
                                      content:
                                        "bg-[#171717] min-w-24 shadow-[0px 0px 1px 0px rgba(0, 0, 0, 0.25)]",
                                    }}
                                  >
                                    <DropdownTrigger>
                                      <p className="flex justify-end items-center !bg-transparent text-white font-normal helvetica-font cursor-pointer text-sm">
                                        {selectedKeys === "edit"
                                          ? "Can Edit"
                                          : selectedKeys === "view"
                                            ? "Can View"
                                            : selectedKeys === "disable"
                                              ? "Disable"
                                              : "None"}{" "}
                                        <Downarrow className="ml-2" />
                                      </p>
                                    </DropdownTrigger>
                                    <DropdownMenu
                                      aria-label="Multiple selection example"
                                      variant="flat"
                                      closeOnSelect={true}
                                      selectionMode="single"
                                      disallowEmptySelection
                                      selectedKeys={selectedKeys}
                                      onSelectionChange={({ currentKey }) =>
                                        setSelectedKeys(currentKey)
                                      }
                                    >
                                      <DropdownItem
                                        key="edit"
                                        className="text-white font-normal helvetica-font text-lg"
                                      >
                                        <p className="text-sm">Can Edit</p>
                                      </DropdownItem>
                                      <DropdownItem
                                        key="view"
                                        className="text-white font-normal helvetica-font hover:bg-transparent"
                                        showDivider
                                      >
                                        <p className="text-sm">Can View</p>
                                      </DropdownItem>
                                      <DropdownItem
                                        key="disable"
                                        className="text-white font-normal helvetica-font hover:bg-transparent"
                                      >
                                        <p className="text-sm">Disable</p>
                                      </DropdownItem>
                                    </DropdownMenu>
                                  </Dropdown>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center pb-5 mt-5 px-[24px]">
                              <div className="flex gap-3"></div>
                              <div>
                                <Button
                                  className={`bg-[#313131] gap-1 rounded-xl helvetica-font text-[#E54637] text-sm font-medium h-auto py-[5px] px-[18px] !outline-none`}
                                  onPress={() => UserRoleInWorkspace(workspace, "delete")}
                                >
                                  <Trashicon /> Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <p className="text-[#BABABA] text-nowrap my-8">No data found.</p>
                    </div>
                  )}
                </div>
              </Tab>
              <Tab key="shareWithMe" title="Share with me">
                <div className="w-full">
                  {(WP?.sharedWorkspace?.length > 0) ? (
                    <div className="grid grid-cols-12 gap-4 pb-12">
                      {WP?.sharedWorkspace?.map((workspace, index) => (
                        <div key={index} className="xl:col-span-4 lg:col-span-6">
                          <div className="workspace-card mt-4">
                            <div className="justify-between py-4 px-[24px]">
                              <div className="text-end text-[12px] text-white font-bold helvetica-font cursor-pointer" onClick={() => UserRoleInWorkspace(workspace, "edit")}>{`Edit`}</div>
                            </div>
                            <div className="py-[0px] gap-[0px] overflow-auto">
                              <div className="flex justify-center items-center w-full mb-10">
                                <Avatar
                                  src={workspace?.logo_url}
                                  showFallback={true}
                                  className="w-12 h-12 cursor-pointer"
                                  fallback={
                                    <Image
                                      src={"/svg/user.svg"}
                                      alt="profile-pic"
                                      width={14}
                                      height={17}
                                    />
                                  }
                                />
                              </div>
                              <div className="mb-10 px-[24px]">
                                <Input
                                  isClearable={false}
                                  color="primary"
                                  classNames={{
                                    label: "text-white",
                                    input: [
                                      "!bg-transparent",
                                      "placeholder:text-[#6A6A6A]",
                                      "text-[14px]",
                                      "font-normal",
                                      "font-inter",
                                      "group-data-[has-value=true]:text-white  ",
                                      "font-medium text-[#6A6A6A] text-sm font-helvetica caret-white outline-0 placeholder:text-[#9B9B9B]",
                                    ],
                                    inputWrapper: [
                                      "!bg-transparent",
                                      "rounded-[8px]",
                                      "data-[hover=true]:bg-[#232323]",
                                      "group-data-[focus=true]:bg-[#232323]",
                                      "group-data-[has-value=true]:text-white",
                                      "h-[35px] outline-0 outline-[#424242] border-1 group-data-[focus=true]:border-[#0A84FF]",
                                    ],
                                  }}
                                  type="text"
                                  placeholder="Company Research"
                                  labelPlacement="outside"
                                  label={
                                    <p
                                      className={`text-white font-bold helvetica-font mb-1 text-[12px]`}
                                    >
                                      Workspace name
                                    </p>
                                  }
                                  name="name"
                                  value={workspace?.name ?? ""}
                                  variant="bordered"
                                />
                              </div>
                              <div className="mb-4 px-[24px]">
                                <Input
                                  isClearable={false}
                                  color="primary"
                                  classNames={{
                                    label: "text-white",
                                    input: [
                                      "!bg-transparent",
                                      "placeholder:text-[#6A6A6A]",
                                      "text-[14px]",
                                      "font-normal",
                                      "font-inter",
                                      "group-data-[has-value=true]:text-white  ",
                                      "font-medium text-[#6A6A6A] text-sm font-helvetica caret-white outline-0 placeholder:text-[#9B9B9B]",
                                    ],
                                    inputWrapper: [
                                      "!bg-transparent",
                                      "rounded-[8px]",
                                      "data-[hover=true]:bg-[#232323]",
                                      "group-data-[focus=true]:bg-[#232323]",
                                      "group-data-[has-value=true]:text-white",
                                      "h-[35px] outline-0 outline-[#424242] border-1 group-data-[focus=true]:border-[#0A84FF]",
                                    ],
                                  }}
                                  type="text"
                                  placeholder="Add people by username or email"
                                  labelPlacement="outside"
                                  label={
                                    <p
                                      className={`text-white font-bold helvetica-font mb-1 text-[15px]`}
                                    >
                                      Share this workspace
                                    </p>
                                  }
                                  variant="bordered"
                                  isDisabled={true}
                                />
                              </div>
                              <div>
                                <div className="px-[24px]">
                                  <p className="text-white font-bold helvetica-font mb-5 ml-1 text-sm	">{`People with access`}</p>
                                </div>
                                <div className="max-h-[170px] h-[170px] overflow-y-auto px-[24px] workspace-members-card">
                                  {workspace?.members?.map((member, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between mb-3"
                                    >
                                      <div className="flex items-center gap-2">
                                        <Avatar
                                          src={member?.profile_picture_url}
                                          showFallback={true}
                                          className="w-8 h-8 cursor-pointer"
                                          fallback={
                                            <Image
                                              src={"/svg/user.svg"}
                                              alt="profile-pic"
                                              width={14}
                                              height={17}
                                            />
                                          }
                                        />
                                        <p className="text-white font-medium helvetica-font mb-0 text-sm">
                                          {member?.user?.full_name}{" "}
                                          {member?.user_id === auth?.user?.userID
                                            ? "(You)"
                                            : ""}
                                        </p>
                                      </div>
                                      <p className="flex justify-end items-center !bg-transparent text-white font-normal helvetica-font cursor-pointer text-sm">
                                        {member.role === "edit"
                                          ? "Can Edit"
                                          : member.role === "view"
                                            ? "Can View"
                                            : member.role === "delete"
                                              ? "Remove"
                                              : member.role === "owner"
                                                ? "Owner"
                                                : ""}{" "}
                                        {member.role === "owner" ? (
                                          ""
                                        ) : (
                                          <Downarrow className="ml-2" />
                                        )}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="mt-5 px-[24px]">
                                <div>
                                  <p className="text-white font-bold helvetica-font mb-5 text-sm">{`General access`}</p>
                                </div>
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-1 cursor-pointer">
                                    <Copyicon />
                                    <p className="text-[#0A84FF] font-medium helvetica-font mb-0 text-sm">
                                      Copy link
                                    </p>
                                  </div>
                                  <Dropdown
                                    classNames={{
                                      content:
                                        "bg-[#171717] min-w-24 shadow-[0px 0px 1px 0px rgba(0, 0, 0, 0.25)]",
                                    }}
                                  >
                                    <DropdownTrigger>
                                      <p className="flex justify-end items-center !bg-transparent text-white font-normal helvetica-font cursor-pointer text-sm">
                                        {selectedKeys === "edit"
                                          ? "Can Edit"
                                          : selectedKeys === "view"
                                            ? "Can View"
                                            : selectedKeys === "disable"
                                              ? "Disable"
                                              : "None"}{" "}
                                        <Downarrow className="ml-2" />
                                      </p>
                                    </DropdownTrigger>
                                    <DropdownMenu
                                      aria-label="Multiple selection example"
                                      variant="flat"
                                      closeOnSelect={true}
                                      selectionMode="single"
                                      disallowEmptySelection
                                      selectedKeys={selectedKeys}
                                      onSelectionChange={({ currentKey }) =>
                                        setSelectedKeys(currentKey)
                                      }
                                    >
                                      <DropdownItem
                                        key="edit"
                                        className="text-white font-normal helvetica-font text-lg"
                                      >
                                        <p className="text-sm">Can Edit</p>
                                      </DropdownItem>
                                      <DropdownItem
                                        key="view"
                                        className="text-white font-normal helvetica-font hover:bg-transparent"
                                        showDivider
                                      >
                                        <p className="text-sm">Can View</p>
                                      </DropdownItem>
                                      <DropdownItem
                                        key="disable"
                                        className="text-white font-normal helvetica-font hover:bg-transparent"
                                      >
                                        <p className="text-sm">Disable</p>
                                      </DropdownItem>
                                    </DropdownMenu>
                                  </Dropdown>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center pb-5 mt-5 px-[24px]">
                              <div className="flex gap-3"></div>
                              <div>
                                <Button
                                  className={`bg-[#313131] gap-1 rounded-xl helvetica-font text-[#E54637] text-sm font-medium h-auto py-[5px] px-[18px] !outline-none`}
                                  onPress={() => UserRoleInWorkspace(workspace, "delete")}
                                >
                                  <Trashicon /> Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <p className="text-[#BABABA] text-nowrap my-8">No data found.</p>
                    </div>
                  )}
                </div>
              </Tab>
            </Tabs>
          </div>
          <Button className="text-white font-bold text-sm font-helvetica border border-[#0A84FF] rounded-full bg-[#0A84FF] h-auto py-[6px] px-8" onPress={() => setModalOpen(true)}>{`Create`}</Button>
        </div>
      </div >

      {/* Create New Workspace Modal */}
      < CreateWorkSpaceModal
        modalOpen={modalOpen}
        closeModal={closeModal}
        fetchWorkspace={onFetchWorkspace}
      />

      {/* Edit Workspace Modal */}
      < EditWorkSpaceModal
        editWorkspace={editWorkspace}
        setEditWorkspace={setEditWorkspace}
        fetchWorkspace={onFetchWorkspace}
      />

      {/* Delete Workspace Modal */}
      < DeleteWorkspaceConfirmationModal
        deleteWorkspace={deleteWorkspace}
        setDeleteWorkspace={setDeleteWorkspace}
        fetchWorkspace={onFetchWorkspace}
      />

      {/* workspace role request model */}
      < RoleRequestModel open={model} setOpen={setModel} />
    </>
  );
};

export default Workspaces;