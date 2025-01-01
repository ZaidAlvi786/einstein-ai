"use client";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useAuth } from "@/app/authContext/auth";
import CreateWorkSpaceModal from "../layout/CreateWorkSpaceModal";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  useAddWorkspaceMutation,
  useGetAllWorkspacesQuery,
  workspaceApi,
} from "@/app/lib/features/workspace/workspaceApi";
import {
  setActiveWorkspace,
  updateWorkspaces,
} from "@/app/lib/features/workspace/workspaceSlice";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { setCurrentActiveGroup } from "@/app/lib/features/chat/groupSlice";
import {
  chatApi,
  useAddGroupMutation,
  useSendNotificationToOwnerForNewJoiningMutation,
} from "@/app/lib/features/chat/chatApi";
import axios from "axios";
import { apiURL } from "@/config";
import { setActiveChat } from "@/app/lib/features/chat/chatSlice";
import axiosInstance from "@/app/http/axios";
import Dragindicator from "@/app/assets/svg/drag-indicator.svg";
import Moreicon from "@/app/assets/svg/more-icon.svg";
import Settingicon from "@/app/assets/svg/Settingicon.svg";
import Inviteicon from "@/app/assets/svg/Inviteicon.svg";
import Closeicon from "@/app/assets/svg/workspace-close.svg";
import Trashicon from "@/app/assets/svg/trash-icon.svg";
import Penicon from "@/app/assets/svg/pen.svg";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import DeleteWorkspaceConfirmationModal from "../layout/workspace/deleteWorkspace";
import Image from "next/image";
import EditWorkSpaceModal from "../layout/workspace/editWorkspace";
import { useOnClickOutside } from "@/app/hooks/useOnClickOutside";
import {
  setSharedChatsOpen,
  setSharedChatsSearchValue,
} from "@/app/lib/features/sharedChats/sharedChatsSlice";
import { Transition } from "@headlessui/react";
import { Fragment } from "react";
import CreateWorkspaceUsingInput from "../layout/workspace/createWorkspaceInput";
import toast from "react-hot-toast";
import ToastService from "../Toaster/toastService";
const Workspace = ({
  NewChat,
  getHistoryDetail = () => { },
  setChatStatus = () => { },
}) => {
  const auth = useAuth();
  const dispatch = useAppDispatch();
  const [workspaces, setWorkspaces] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteWorkspace, setDeleteWorkspace] = useState({
    open: false,
    workspace_id: "",
  });
  const [editWorkspace, setEditWorkspace] = useState({
    open: false,
    workspaceData: null,
  });
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeWorkspace = useAppSelector((state) => state.workspace.activeWorkspace);
  const activeWorkspaceName = useMemo(() => activeWorkspace?.name ?? "", [activeWorkspace]);
  const { data: allWorkSpaces, isLoading, refetch, isSuccess, error } = useGetAllWorkspacesQuery(auth?.user?.userID, { skip: !auth?.user?.userID, });
  const [addWorkspace] = useAddWorkspaceMutation();
  const [AddGroup] = useAddGroupMutation();
  const workspaceMenuContainerRef = useRef();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleToggleDropdown = (e) => {
    e?.preventDefault();
    setDropdownOpen((prev) => !prev);
  };

  useOnClickOutside(workspaceMenuContainerRef, () => setDropdownOpen(false));

  const createMultipleQueryString = useCallback((queryStringArray) => {
    const params = new URLSearchParams(searchParams);
    queryStringArray?.forEach(({ name, value }) => {
      params.set(name, value);
    });

    return params.toString();
  }, [searchParams]);

  useEffect(() => {
    const storedWorkspaceId = window.localStorage.getItem("workspace_id");
    if (activeWorkspace && activeWorkspace?._id) {
      router.push(
        pathname +
        "?" +
        createMultipleQueryString([
          { name: "workspace", value: activeWorkspace?._id },
        ])
      );
    } else if (storedWorkspaceId) {
      const data = allWorkSpaces?.data || [];
      const selectedActiveWorkspace = data.find(
        (workspace) => workspace._id === storedWorkspaceId
      );
      if (selectedActiveWorkspace !== -1) {
        dispatch(setActiveWorkspace(selectedActiveWorkspace));
      } else if (data?.length > 0) {
        dispatch(setActiveWorkspace(data[0]));
      }
      router.push(
        pathname +
        "?" +
        createMultipleQueryString([
          { name: "workspace", value: storedWorkspaceId },
        ])
      );
    }
  }, [activeWorkspace, pathname, router, allWorkSpaces]);

  useEffect(() => {
    dispatch(updateWorkspaces(workspaces || []));
  }, [workspaces]);

  const saveWorkspaceSession = useCallback((name, id) => {
    router.push(
      pathname +
      "?" +
      createMultipleQueryString([{ name: "workspace", value: id }])
    );
    window.localStorage.setItem("workspace_name", name);
    window.localStorage.setItem("workspace_id", id);
  }, []);

  useEffect(() => {
    const getAllWorkspaces = async () => {
      if (!isLoading) {
        if (isSuccess) {
          let workspace = allWorkSpaces?.data ?? [];
          if (auth?.user?.email && auth?.user?.fullname) {
            const newObject = {
              name: "Shared Chats",
              logo_url: "",
              status: "custom",
            };
            workspace = [
              ...workspace?.slice(0, 1),
              newObject,
              ...workspace?.slice(1),
            ];
          }
          setWorkspaces(workspace ?? []);

          const data = allWorkSpaces?.data || [];

          const storedWorkspaceId = window.localStorage.getItem("workspace_id");
          let activeWorkspaceId;

          if (storedWorkspaceId && data.some((workspace) => workspace._id === storedWorkspaceId)) {
            activeWorkspaceId = storedWorkspaceId;
          } else {
            activeWorkspaceId = data[0]._id;
            window.localStorage.setItem("workspace_id", activeWorkspaceId);
          }
          const selectedActiveWorkspace = data.find(
            (workspace) => workspace._id === storedWorkspaceId
          );
          if (selectedActiveWorkspace !== -1) {
            dispatch(setActiveWorkspace(selectedActiveWorkspace));
          } else if (data?.length > 0) {
            dispatch(setActiveWorkspace(data[0]));
          }
        } else {
          if (error?.status === 500) {
            try {
              const data = {
                user_id: auth.user.userID,
                name: "Workspace 1",
                members: [],
                logo_url: "",
              };
              const response = await addWorkspace(data).unwrap();
              if (response) {
                const value = { name: "Workspace 1", _id: response.id };
                saveWorkspaceSession(value);
                dispatch(setActiveWorkspace(value));
                refetch();
              }
            } catch (err) {
              toast.error(error?.data?.message);
              console.error("Error adding workspace:", err);
            }
          }
        }
      }
    };
    getAllWorkspaces();
  }, [allWorkSpaces, isSuccess, error]);

  const ChangeActiveGroup = (workspace_id) => {
    axios
      .get(apiURL + `/group/get-groups-by-workspace-id/${workspace_id}`)
      .then((response) => {
        const newGroupInfo = response?.data?.data[0] ?? {};
        dispatch(setCurrentActiveGroup(newGroupInfo));
        dispatch(setActiveChat({}));
        NewChat();
        window.localStorage.setItem("group", JSON.stringify(newGroupInfo));
        router.push(
          pathname +
          "?" +
          createMultipleQueryString([
            { name: "group", value: newGroupInfo?._id },
            { name: "chat", value: "new" },
          ])
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onFetchWorkspace = () => {
    refetch();
  };

  const messages = useAppSelector((state) => state.webSocket.messages);

  useEffect(() => {
    if (
      messages &&
      messages?.hasOwnProperty("type") &&
      messages?.type === "notification"
    ) {
      onFetchWorkspace();
    }
  }, [messages]);

  const openModal = () => {
    setModalOpen(true);
    setDropdownOpen(false);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const selectFirstChatOnWorkspaceChange = async (workspace_id) => {
    try {
      const groupResponse = await axiosInstance.get(
        `/group/get-groups-by-workspace-id/${workspace_id}`
      );

      const groups = groupResponse?.data?.data;
      if (groups?.length > 0) {
        const firstGroupId = groups[0]?._id;

        const chatResponse = await axiosInstance.get(
          `/ai/get-history-by-workspace-id?workspace_id=${workspace_id}&group_id=${firstGroupId}`
        );

        const chats = chatResponse?.data?.data;
        if (chats?.length > 0) {
          const firstChat = chats?.[0];
          if (firstChat) {
            dispatch(setActiveChat(firstChat));
            getHistoryDetail(firstChat, "text");
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

  const updateCurrentWorkspace = (workspace_id, workspace) => {
    if (workspace?.status === "custom") {
      shareAndChatsInvitetHandler();
    } else {
      if (workspace_id) {
        axiosInstance
          .get(`/workspace/getWorkspaceByUser/${auth?.user?.userID}`)
          .then(async (response) => {
            if (response?.data?.data?.length > 0) {
              const newlyCreatedWorkspace = response?.data?.data?.find(
                (workspace) => workspace._id === workspace_id
              );
              dispatch(setActiveWorkspace(newlyCreatedWorkspace));
              saveWorkspaceSession(
                newlyCreatedWorkspace?.name,
                newlyCreatedWorkspace?._id
              );
              const result = await AddGroup({
                name: "General",
                workspace_id: newlyCreatedWorkspace?._id,
                user_id: auth?.user?.userID,
              }).unwrap();

              if (result?.id) {
                ChangeActiveGroup(newlyCreatedWorkspace?._id);

                setTimeout(() => {
                  dispatch(
                    chatApi.util.invalidateTags([
                      "group-list",
                      "history-chat-by-workspace-id",
                    ])
                  );
                }, 500);
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        dispatch(setActiveWorkspace(workspace));
        saveWorkspaceSession(workspace?.name, workspace?._id);
        ChangeActiveGroup(workspace?._id);
      }
      selectFirstChatOnWorkspaceChange(workspace_id ?? workspace?._id);
      sendNotificationToOwnerForNewJoining(workspace_id ?? workspace?._id);
      setDropdownOpen(false);
    }
  };

  const UserRoleInWorkspace = (workspaceInfo, action) => {
    const membersRole = workspaceInfo?.members?.find(
      (member) => member?.user_id === auth?.user?.userID
    );
    if (
      membersRole?.role === "owner" ||
      membersRole?.permission_type === "edit"
    ) {
      if (action === "delete") {
        setDeleteWorkspace({ open: true, workspace_id: workspaceInfo?._id });
        setDropdownOpen(false);
      } else if (action === "edit") {
        setEditWorkspace({ open: true, workspaceData: workspaceInfo });
        setDropdownOpen(false);
      }
    } else {
      toast.error(`You don't have permission to ${action} this workspace!`);
      setDropdownOpen(false);
    }
  };

  const [SendNotificationToOwnerForNewJoining] =
    useSendNotificationToOwnerForNewJoiningMutation();

  const sendNotificationToOwnerForNewJoining = (workspace_id) => {
    SendNotificationToOwnerForNewJoining({ workspace_id })
      .unwrap()
      .then((response) => {
        console.log("###_Response_### ", response);
      })
      .catch((error) => {
        toast.error(error?.data?.message);
        console.log("###_Error_### ", error);
      });
  };

  const DropdownHeader = ({ isOpen, toggle }) => (
    <>
      <div
        onClick={toggle}
        className="flex w-full items-center gap-x-2 cursor-pointer select-none"
      >
       {activeWorkspace?.logo_url?<Avatar
          className="w-6 h-6"
          src={activeWorkspace?.logo_url}
        />: <Avatar
          className="w-6 h-6"
          name={activeWorkspace?.name?.[0]?.toUpperCase() || ''}
        />}
        <span className="flex items-center gap-x-2 text-[#ffffff] 4k:!text-[26px] text-[14.95px] font-helvetica font-medium">
          {activeWorkspaceName}
        </span>
        <Image src="/svg/chevronDown.svg"  alt="model-img" width={'4k' ? 13.33:7} height={'4k' ? 8:4} className={`h-[4px] w-[7px] 4k:h-[8px] 4k:w-[13.33px] text-[#D2D2D2] ${isOpen ? "rotate-180" : "rotate-0"}`} />
      </div>
    </>
  );

  const shareAndChatsInvitetHandler = () => {
    setDropdownOpen(false);
    dispatch(setSharedChatsOpen(true));
    dispatch(setSharedChatsSearchValue(""));
  };

  return (
    <>
      <div className="relative inline-block text-left">
        <DropdownHeader isOpen={isDropdownOpen} toggle={handleToggleDropdown} />
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
          show={isDropdownOpen}
          ref={workspaceMenuContainerRef}
        >
          <div className="absolute right-0 left-0 z-50 mt-2 origin-top-right rounded-[12px] bg-[#121212] overflow-hidden min-w-[312px] w-full trasnsition-card">
            <div className="py-0 trasnsition-card">
              <div className="max-h-[270px] h-full overflow-y-auto p-2">
                {workspaces &&
                  workspaces?.map((workspace, index) => (
                    <div key={`workspace-${index}`} >
                      <a
                        href="#"
                        className="text-gray-700 px-1.5 py-1.5 flex flex-row border-[#313535] items-center gap-3 hover:bg-[#2F2F2F] rounded-lg"
                        onClick={(event) => {
                          event?.preventDefault();
                          updateCurrentWorkspace(null, workspace);
                        }}
                      >
                        <Avatar
                          className="w-6 h-6 cursor-pointer"
                          radius="full"
                          src={workspace?.logo_url}
                          name={workspace?.name[0]?.toUpperCase()}
                          classNames={{
                            base: `w-9 h-9 max-msm:w-12 max-msm:h-12 ${workspace?.logo_url
                              ? "bg-transparent"
                              : "bg-radial-gradient"
                              } flex flex-row items-center justify-center shrink-0`,
                          }}
                        />
                        <div className="w-full">
                          <div className="flex items-center justify-between w-full">
                            <p className="flex flex-1 flex-col w-full text-sm text-[#fff] font-helvetica font-normal truncate">
                              {workspace.name}
                            </p>
                            {workspace?.status !== "custom" && (
                              <Dropdown
                                className="font-helvetica"
                                classNames={{
                                  content:
                                    "bg-[#2F2F2F] min-w-48 shadow-[0px 0px 1px 0px rgba(0, 0, 0, 0.25)] p-1.5",
                                }}
                                placement="bottom-start"
                              >
                                <DropdownTrigger>
                                  <div>
                                    {workspace.user_id === auth?.user?.userID && (
                                      <Moreicon />
                                    )}
                                  </div>
                                </DropdownTrigger>
                                <DropdownMenu classNames={{ base: "p-0" }}>
                                  <DropdownItem
                                    className="px-2.5 py-2 data-[hover=true]:bg-[#505050]"
                                    onPress={() =>
                                      UserRoleInWorkspace(workspace, "edit")
                                    }
                                    startContent={
                                      <>
                                        <Settingicon />
                                      </>
                                    }
                                  >
                                    <p className="text-white text-sm flex items-center font-normal gap-[11px]">{`Settings`}</p>
                                  </DropdownItem>
                                  <DropdownItem
                                    className="px-2.5 py-2 data-[hover=true]:bg-[#505050]"
                                    onPress={() =>
                                      UserRoleInWorkspace(workspace, "edit")
                                    }
                                    startContent={
                                      <>
                                        <Inviteicon />
                                      </>
                                    }
                                  >
                                    <p className="text-white text-sm flex items-center font-normal gap-[11px]">{`Invite members`}</p>
                                  </DropdownItem>
                                  <DropdownItem
                                    className="px-2.5 py-2 data-[hover=true]:bg-[#505050]"
                                    onPress={() =>
                                      UserRoleInWorkspace(workspace, "delete")
                                    }
                                    startContent={
                                      <>
                                        <Trashicon className="-left-[1px] relative" />
                                      </>
                                    }
                                  >
                                    <p className="text-[#E54637] text-sm flex items-center font-normal gap-[11px]">{`Delete`}</p>
                                  </DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            )}
                          </div>
                        </div>
                      </a>
                    </div>
                  ))}
                <CreateWorkspaceUsingInput
                  updateCurrentWorkspace={updateCurrentWorkspace}
                />
              </div>
            </div>
          </div>
        </Transition>
      </div>

      {/* Create New Workspace Modal */}
      <CreateWorkSpaceModal
        modalOpen={modalOpen}
        closeModal={closeModal}
        fetchWorkspace={onFetchWorkspace}
        updateCurrentWorkspace={updateCurrentWorkspace}
      />

      {/* Edit Workspace Modal */}
      <EditWorkSpaceModal
        editWorkspace={editWorkspace}
        setEditWorkspace={setEditWorkspace}
        fetchWorkspace={onFetchWorkspace}
      />

      {/* Delete Workspace Modal */}
      <DeleteWorkspaceConfirmationModal
        deleteWorkspace={deleteWorkspace}
        setDeleteWorkspace={setDeleteWorkspace}
        fetchWorkspace={onFetchWorkspace}
        setChatStatus={setChatStatus}
        workspaces={workspaces}
        updateCurrentWorkspace={updateCurrentWorkspace}
      />
      <ToastService />
    </>
  );
};

export default Workspace;
