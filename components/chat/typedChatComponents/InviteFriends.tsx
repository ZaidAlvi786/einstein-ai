"use client";
import { useRef, useState } from "react";
import {
  Avatar,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Tooltip,
  User,
} from "@nextui-org/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import Downarrow from "@/app/assets/svg/keyboard_arrow_down.svg";
import Copyicon from "@/app/assets/svg/copy-icon.svg";
import Community from "@/app/assets/svg/community-icon.svg";
import useDebounce from "@/app/hooks/useDebounce";
import { useFetchUserDetailsForInviteQuery } from "@/app/lib/features/workspace/workspaceApi";
import { useEffect } from "react";
import {
  useAccessSharedChatWithLinkMutation,
  useChangeSharedChatUserRoleMutation,
  useGetSharedChatLinkAccessMutation,
  useGetSharedChatUsersQuery,
  useRemoveShareChatAccessLinkMutation,
  useRemoveShareChatUserMutation,
  useSendInviteForSharedChatMutation,
} from "@/app/lib/features/chat/chatApi";
import { useAuth } from "@/app/authContext/auth";
import Image from "next/image";
import axiosInstance from "@/app/http/axios";
import { useAppSelector } from "@/app/lib/hooks";
import toast from "react-hot-toast";
import ToastService from "@/components/Toaster/toastService";
import { useSendInviteToNonPlatformUserMutation } from "../../../app/lib/features/chat/chatApi";
import { UserPlus2 } from "lucide-react";
import { UserPlusIcon } from "@heroicons/react/24/outline";

const InviteFriends = ({ setIsOpen = () => {}, isOpen }: any) => {
  const auth: any = useAuth();
  const inputRef = useRef<any>(null);

  // const [selectedKeys, setSelectedKeys] = useState(new Set(["edit"]));
  const [selectedKeys, setSelectedKeys] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [inviteUserInfo, setInviteUserInfo] = useState<any>(null);
  const [shareChatsMembers, setWorkspaceMembers] = useState<any>([]);
  const [ChangeSharedChatUserRole] = useChangeSharedChatUserRoleMutation();
  const [SendInviteForSharedChat] = useSendInviteForSharedChatMutation();
  const [GetSharedChatLinkAccess] = useGetSharedChatLinkAccessMutation();
  const [RemoveShareChatAccessLink] = useRemoveShareChatAccessLinkMutation();
  const [RemoveShareChatUser] = useRemoveShareChatUserMutation();
  const [isDisabled, setIsDisabled] = useState<any>(false);
  const activeWorkspace = useAppSelector(
    (state: any) => state.workspace.activeWorkspace
  );
  const activeChatId = useAppSelector(
    (state: any) => state?.chat?.activeChat?.id
  );

  const [updateWorkspacesUserLoading, setUpdateWorkspacesUserLoading] =
    useState({ loading: false, user_id: "" });
  const debouncedSearchTerm = useDebounce(search, 500);
  const chat_id = JSON.parse(
    window.localStorage.getItem("activeChatLocalStorage") || "{}"
  )?.id;
  const {
    data: InviteUserData,
    isError: InviteUserisError,
    isSuccess: InviteUserisSuccess,
    error: InviteUserError,
    isFetching: InviteUserLoading,
  } = useFetchUserDetailsForInviteQuery(debouncedSearchTerm, {
    skip: !Boolean(search?.length),
  });
  const {
    data: ShareChatsUsersListData,
    isFetching: ShareChatsUsersIsFetching,
    isSuccess: ShareChatsUsersIsSuccess,
    refetch: ShareChatsUsersRefetch,
  } = useGetSharedChatUsersQuery(
    { params: { chat_id: chat_id } },
    { skip: !chat_id }
  );

  const [sendInviteToNonPlatformUser, { isLoading }] =
    useSendInviteToNonPlatformUserMutation();
  const HandleModalClose = () => {
    if (!updateWorkspacesUserLoading?.loading) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Refocus the input if it's rendered
    }
  }, [search, inviteUserInfo]);

  const handleSendInvite = () => {
    try {
      const data = {
        non_platfrom_user_email: search,
      };
      sendInviteToNonPlatformUser(data)
        .then((res: any) => {
          toast.success(res?.data?.message || "Email sent successfully.");
        })
        .catch((error) => {
          toast.error("Something went wrong.");
        });
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const HandleUpdateWorkspaceUser = (
    user_id: any,
    workspace_id: any,
    role: any,
    already_workspace_member: any,
    userInfo: any
  ): any => {
    setUpdateWorkspacesUserLoading({ loading: true, user_id });
    if (already_workspace_member) {
      if (role === "edit" || role === "view") {
        const data = {
          params: {
            role,
            participant_id: user_id,
            chat_id: chat_id,
          },
        };

        ChangeSharedChatUserRole(data)
          .unwrap()
          .then((response) => {
            ShareChatsUsersRefetch();
            if (response?.status === 200) {
              toast.success(response?.message);
            } else {
              toast.error(response?.message);
            }
          })
          .catch((error) => {
            console.log("## Error - EditWorkspaceUser ## ", error);
          })
          .finally(() => {
            setUpdateWorkspacesUserLoading({ loading: false, user_id: "" });
          });
      } else if (role === "delete") {
        const data = { participant_id: user_id, chat_id: chat_id };
        RemoveShareChatUser(data)
          .unwrap()
          .then((response) => {
            toast.success(response?.message);
          })
          .catch((error) => {
            if (error?.data?.message) {
              toast.error(error?.data?.message);
            }
          })
          .finally(() => {
            setUpdateWorkspacesUserLoading({ loading: false, user_id: "" });
          });
      }
    } else {
      if (role === "edit" || role === "view") {
        const data = {
          params: {
            role,
            participant_id: user_id,
            chat_id: chat_id,
            workspace_id,
          },
        };

        SendInviteForSharedChat(data)
          .unwrap()
          .then((response) => {
            ShareChatsUsersRefetch();
            if (response?.status === 200) {
              toast.success(response?.message);
            } else {
              toast.error(response?.message);
            }
          })
          .catch((error) => {
            console.log("#####_Error - SendInviteForSharedChat ## ", error);
          })
          .finally(() => {
            setUpdateWorkspacesUserLoading({ loading: false, user_id: "" });
          });
      } else if (role === "delete") {
        const data = { participant_id: user_id, chat_id: chat_id };
        RemoveShareChatUser(data)
          .unwrap()
          .then((response) => {
            toast.success(response?.message);
          })
          .catch((error) => {
            if (error?.data?.message) {
              toast.error(error?.data?.message);
            }
          })
          .finally(() => {
            setUpdateWorkspacesUserLoading({ loading: false, user_id: "" });
          });
      }
    }
  };

  useEffect(() => {
    if (InviteUserisSuccess && InviteUserLoading === false && InviteUserData) {
      setInviteUserInfo(InviteUserData);
    } else {
      setInviteUserInfo(null);
    }
  }, [
    InviteUserData,
    InviteUserisError,
    InviteUserisSuccess,
    InviteUserError,
    InviteUserLoading,
  ]);

  useEffect(() => {
    const getUserData = async (userEmail: any) => {
      try {
        const response = await axiosInstance.post(
          `/auth/getuser`,
          { email: userEmail },
          { headers: { "Content-Type": "application/json" } }
        );

        const userData = [
          {
            full_name: response?.data?.data?.full_name ?? "",
            email: response?.data?.data?.email ?? "",
            user_id: response?.data?.data?._id ?? "",
            profile_picture_url:
              response?.data?.data?.profile_picture_url ?? "",
            role: "owner",
            status: "active",
          },
        ];

        // setWorkspaceMembers(userData);
        setWorkspaceMembers((prev: any) => {
          const combinedMembers = [...prev, ...userData];

          // Filter out duplicates based on `user_id`
          const uniqueMembers = combinedMembers.filter(
            (member, index, self) =>
              index === self.findIndex((m) => m.user_id === member.user_id)
          );

          return uniqueMembers;
        });
      } catch (err: any) {
        toast.error(
          (err?.message ?? err?.data?.message) || "Something went wrong!"
        );

        setWorkspaceMembers([]);
      }
    };

    if (true) {
      if (
        Array.isArray(ShareChatsUsersListData?.data) &&
        ShareChatsUsersListData?.data?.length > 0
      ) {
        const newMembers =
          ShareChatsUsersListData?.data?.map((ele: any) => ({
            role: ele?.role,
            status: ele?.status,
            full_name: ele?.user?.full_name,
            profile_picture_url: ele?.user?.profile_picture_url,
            user_id: ele?.user_id,
          })) || [];

        const owners = newMembers.filter(
          (member: any) => member.role === "owner"
        );
        const nonOwners = newMembers.filter(
          (member: any) => member.role !== "owner"
        );
        const sortedMembers = [...owners, ...nonOwners];
        setWorkspaceMembers((prev: any) => {
          const combinedMembers = [...prev, ...sortedMembers];

          // Filter out duplicates based on `user_id`
          // const uniqueMembers = combinedMembers.filter( // commented because showing role owner for all users
          const uniqueMembers = sortedMembers.filter(
            (member, index, self) =>
              index === self.findIndex((m) => m.user_id === member.user_id)
          );
          return uniqueMembers;
        });
      } else {
        if (
          auth?.user?.email &&
          !Array.isArray(ShareChatsUsersListData?.data) &&
          !ShareChatsUsersIsSuccess
        ) {
          getUserData(auth?.user?.email);
        }
      }
    }
  }, [ShareChatsUsersIsFetching, ShareChatsUsersIsSuccess]);

  const handleCopyLink = () => {
    const data = {
      chat_id: chat_id,
      permission_type: selectedKeys,
    };
    GetSharedChatLinkAccess(data)
      .unwrap()
      .then((response) => {
        if (response.status === 200) {
          const { data } = response;
          const url = `${window.location.origin}/?access_link=${data?.access_link}&permission_type=${data?.permission_type}&share_chat=true`;
          navigator.clipboard.writeText(url);
          toast.success("Access link copied successfully!");
          HandleModalClose();
        }
      })
      .catch((error) => {
        toast.error(error?.data?.message);
      })
      .finally(() => {});
  };

  const handleDropDown = async (e: any) => {
    const valuesArray: any = Array.from(e);
    setSelectedKeys(valuesArray[0]);

    if (valuesArray[0] === "remove" || valuesArray[0] === "delete") {
      setIsDisabled(true);
      try {
        const response = await RemoveShareChatAccessLink({
          chat_id: chat_id,
        }).unwrap();
        if (response?.status === 200) {
          toast.success(response?.message);
        }
      } catch (error: any) {
        toast.error(error?.data?.message);
      } finally {
        setIsDisabled(false);
      }
    } else {
      setIsDisabled(false);
    }
  };

  const isValidEmail = (email: any) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  return (
    <div className="w-[250px] bg-[#272727] rounded-3xl absolute right-8 bottom-[32px] p-3">
      <div>
        <div className="text-[15.052px]	text-white mb-2 font-medium helvetica-font justify-between">{`Share this chat`}</div>
        <div className=" py-[0px] gap-[0px]">
          <div>
            <Input
              ref={inputRef}
              isClearable={false}
              color="primary"
              classNames={{
                label: "text-white",
                input: [
                  "!bg-transparent",
                  "placeholder:text-[#6A6A6A]",
                  "placeholder:!font-normal",
                  "text-[12px]",
                  "!font-normal",
                  "font-inter",
                  "group-data-[has-value=true]:text-white  ",
                  "font-medium text-[#6A6A6A] text-[12px] font-helvetica caret-white outline-0 placeholder:text-[#9B9B9B]",
                ],
                inputWrapper: [
                  "!bg-transparent",
                  "rounded-[8px]",
                  "data-[hover=true]:bg-[#232323]",
                  "group-data-[focus=true]:bg-[#232323]",
                  "group-data-[has-value=true]:text-white",
                  "h-[30px] outline-0 outline-[#424242] border-1 group-data-[focus=true]:border-[#0A84FF]",
                ],
              }}
              type="text"
              placeholder="Add people by username or email"
              labelPlacement="outside"
              label={""}
              variant="bordered"
              value={search}
              onChange={(event) => setSearch(event?.target?.value?.trimStart())}
              endContent={
                isValidEmail(search) && !inviteUserInfo?.full_name ? (
                  <button
                    onClick={() => handleSendInvite()}
                    className="text-white bg-[#0A84FF] px-1 py-1 rounded-[8px] text-[10px] w-[100px]"
                  >
                    {isLoading ? "Sending..." : "Send Invite"}
                  </button>
                ) : null
              }
            />
          </div>

          <div className="mt-3">
            <div>
              <p className="text-white text-[12.207px] font-bold helvetica-font mb-5 ml-1">{`People with access`}</p>
            </div>
            {InviteUserLoading ? (
              <>
                <div className="flex justify-center items-center mb-3">
                  <Spinner size="sm" color="default" />
                </div>
              </>
            ) : (
              <>
                {inviteUserInfo &&
                  !shareChatsMembers?.find(
                    (member: any) => member?.user_id === inviteUserInfo?.id
                  ) && (
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={inviteUserInfo?.profile_picture_url}
                          showFallback={true}
                          className="w-[23.639px] h-[23.639px] cursor-pointer"
                          fallback={
                            <Image
                              src={"/svg/user.svg"}
                              alt="profile-pic"
                              width={11.23}
                              height={14.21}
                            />
                          }
                        />
                        <p className="text-white text-[12.207px] font-medium helvetica-font mb-0">
                          {inviteUserInfo?.full_name}
                        </p>
                      </div>
                      {updateWorkspacesUserLoading?.user_id ===
                        inviteUserInfo?.id &&
                      updateWorkspacesUserLoading?.loading ? (
                        <Spinner size="sm" color="default" />
                      ) : (
                        <Dropdown
                          classNames={{
                            content:
                              "bg-[#171717] min-w-24 shadow-[0px 0px 1px 0px rgba(0, 0, 0, 0.25)]",
                          }}
                        >
                          <DropdownTrigger>
                            <p className="flex justify-end items-center text-[12.431px] !bg-transparent text-white font-normal helvetica-font cursor-pointer">
                              {`None`} <Downarrow className="ml-2" />
                            </p>
                          </DropdownTrigger>
                          <DropdownMenu
                            aria-label="Multiple selection example"
                            variant="flat"
                            closeOnSelect={true}
                            disallowEmptySelection
                            selectionMode="single"
                            onSelectionChange={({ currentKey }: any) => {
                              if (
                                currentKey === "edit" ||
                                currentKey === "view"
                              ) {
                                const userInfo = {
                                  full_name: inviteUserInfo?.full_name ?? "",
                                  email: inviteUserInfo?.email ?? "",
                                  user_id: inviteUserInfo?.id ?? "",
                                  profile_picture_url:
                                    inviteUserInfo?.profile_picture_url ?? "",
                                  role: currentKey,
                                };
                                HandleUpdateWorkspaceUser(
                                  inviteUserInfo?.id,
                                  activeWorkspace?._id,
                                  currentKey,
                                  false,
                                  userInfo
                                );
                              }
                            }}
                          >
                            <DropdownItem
                              key={"edit"}
                              className="text-white font-normal helvetica-font text-lg"
                            >
                              <p className="text-[12.431px]">Can Edit</p>
                            </DropdownItem>
                            <DropdownItem
                              key={"view"}
                              className="text-white font-normal helvetica-font hover:bg-transparent"
                            >
                              <p className="text-[12.431px]">Can View</p>
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      )}
                    </div>
                  )}
              </>
            )}

            <div className="max-h-[170px] h-full overflow-y-auto workspace-members-card">
              {shareChatsMembers?.map((member: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between mb-3"
                >
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={member?.profile_picture_url}
                      showFallback={true}
                      className="w-[26.639px] h-[26.639px] cursor-pointer"
                      fallback={
                        <Image
                          src={"/svg/user.svg"}
                          alt="profile-pic"
                          width={14}
                          height={17}
                        />
                      }
                    />
                    <p className="text-white text-[12.207px] font-medium helvetica-font mb-0">
                      {/* {member?.full_name}{" "}{member?.status === 'invited'? "(Pending)":" "} */}
                      {member?.full_name}{" "}
                      {member?.status === "invited"
                        ? "(Pending)"
                        : member?.status === "declined"
                        ? "(Declined)"
                        : ""}
                      {member?.user_id === auth?.user?.userID ? "(You)" : ""}
                    </p>
                  </div>
                  {member?.role === "owner" ? (
                    <p className="text-white font-normal text-[12.431px] helvetica-font mb-0">
                      Owner
                    </p>
                  ) : (
                    <>
                      {updateWorkspacesUserLoading?.user_id ===
                        member?.user_id &&
                      updateWorkspacesUserLoading?.loading ? (
                        <Spinner size="sm" color="default" />
                      ) : (
                        <Dropdown
                          classNames={{
                            content:
                              "bg-[#171717] min-w-24 shadow-[0px 0px 1px 0px rgba(0, 0, 0, 0.25)]",
                          }}
                        >
                          <DropdownTrigger>
                            <p className="flex justify-end items-center text-[10.431px] !bg-transparent text-white font-normal helvetica-font cursor-pointer">
                              {member.role === "edit" ? (
                                "Can Edit"
                              ) : member.role === "view" ? (
                                "Can View"
                              ) : member.role === "delete" ? (
                                "Remove"
                              ) : (
                                <></>
                              )}{" "}
                              <Downarrow className="ml-2" />
                            </p>
                          </DropdownTrigger>
                          <DropdownMenu
                            aria-label="Multiple selection example"
                            variant="flat"
                            closeOnSelect={true}
                            disallowEmptySelection
                            selectionMode="single"
                            onSelectionChange={({ currentKey }: any) => {
                              console.log("currentKey: ", currentKey);
                              if (
                                currentKey === "edit" ||
                                currentKey === "view"
                              ) {
                                HandleUpdateWorkspaceUser(
                                  member?.user_id,
                                  activeWorkspace?._id,
                                  currentKey,
                                  true,
                                  null
                                );
                              } else if (currentKey === "delete") {
                                HandleUpdateWorkspaceUser(
                                  member?.user_id,
                                  activeWorkspace?._id,
                                  currentKey,
                                  true,
                                  null
                                );
                              }
                            }}
                          >
                            <DropdownItem
                              key={"edit"}
                              className="text-white font-normal helvetica-font text-lg"
                            >
                              <p className="text-[12.431px]">Can Edit</p>
                            </DropdownItem>
                            <DropdownItem
                              key={"view"}
                              className="text-white font-normal helvetica-font hover:bg-transparent"
                              showDivider
                            >
                              <p className="text-[12.431px]">Can View</p>
                            </DropdownItem>
                            <DropdownItem
                              key={"delete"}
                              className="text-white font-normal helvetica-font hover:bg-transparent"
                            >
                              <p className="text-[12.431px]">Remove</p>
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 gap-[21.18px] flex flex-col">
            <div>
              <p className="text-white text-[12.207px] font-bold helvetica-font">
                General access
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div
                className={`flex items-center gap-1 ${
                  isDisabled ? "" : "cursor-pointer"
                }`}
                onClick={() => {
                  isDisabled ? "" : handleCopyLink();
                }}
              >
                <Copyicon width={21.311} height={21.311} />
                <p className="text-[#0A84FF] text-[12px] font-medium helvetica-font mb-0">
                  Copy link
                </p>
              </div>
              <Dropdown
                classNames={{
                  content: [
                    "bg-[#171717] min-w-24 text-[12.431px] font-normal shadow-[0px 0px 1px 0px rgba(0, 0, 0, 0.25)]",
                  ],
                }}
              >
                <DropdownTrigger>
                  <Button className="bg-transparent text-[12.431px] !h-[15px] pr-0 text-white font-normal helvetica-font outline-0 capitalize">
                    {/* {selectedKeys !== null ? `Can ${selectedKeys}` :`Select Permissions`} */}
                    {selectedKeys === "edit" || selectedKeys === "view"
                      ? `Can ${selectedKeys}`
                      : "Select Permissions"}
                    <Downarrow />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Multiple selection example"
                  variant="flat"
                  closeOnSelect={true}
                  selectionMode="single"
                  disallowEmptySelection
                  selectedKeys={selectedKeys}
                  onSelectionChange={(e) => handleDropDown(e)}
                >
                  <DropdownItem
                    key="edit"
                    className="text-white font-normal helvetica-font text-lg"
                  >
                    <p className="text-[12.431px] font-normal">Can Edit</p>
                  </DropdownItem>
                  <DropdownItem
                    key="view"
                    className="text-white font-normal helvetica-font hover:bg-transparent"
                    showDivider
                  >
                    <p className="text-[12.431px] font-normal">Can View</p>
                  </DropdownItem>
                  <DropdownItem
                    // key={null}
                    className="text-white font-normal helvetica-font hover:bg-transparent"
                  >
                    <p className="text-[12.431px] font-normal">Remove</p>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>
        <div className="justify-start px-[24px]">
          <div className="flex gap-3">
            {/* <Community />
                        <p className='text-white font-normal helvetica-font'>Publish to community</p> */}
          </div>
        </div>
      </div>
      <ToastService />
    </div>
  );
};

const AvatarGroups = ({ chatHistoryID }: any) => {
  const outSideRef = useRef<any>(null); // Reference for the menu container
  const auth: any = useAuth();

  const [show, setShow] = useState(false);
  const [shareChatsMembers, setWorkspaceMembers] = useState<any>([]);
  const chat_id = JSON.parse(
    window.localStorage.getItem("activeChatLocalStorage") || "{}"
  )?.id;
  const {
    data: ShareChatsUsersListData,
    isFetching: ShareChatsUsersIsFetching,
    isSuccess: ShareChatsUsersIsSuccess,
    refetch: ShareChatsUsersRefetch,
    isError,
  } = useGetSharedChatUsersQuery(
    { params: { chat_id: chatHistoryID } },
    { skip: !chatHistoryID }
  );
  

  useEffect(() => {
    if (chatHistoryID) {
      ShareChatsUsersRefetch();
    }
  }, [chatHistoryID]);
  useEffect(() => {
    if (
      Array.isArray(ShareChatsUsersListData?.data) &&
      ShareChatsUsersListData?.data?.length > 0
    ) {
      const newMembers =
        ShareChatsUsersListData?.data?.map((ele: any) => ({
          role: ele?.role,
          status: ele?.status,
          full_name: ele?.user?.full_name,
          profile_picture_url: ele?.user?.profile_picture_url,
          user_id: ele?.user_id,
        })) || [];

      const nonOwners = newMembers.filter(
        (member: any) => member.role !== "owner"
      );
      const sortedMembers = [...nonOwners];
      setWorkspaceMembers((prev: any) => {
        const combinedMembers = [...prev, ...sortedMembers];

        // Filter out duplicates based on `user_id`
        // const uniqueMembers = combinedMembers.filter( // commented because showing role owner for all users
        const uniqueMembers = sortedMembers.filter(
          (member, index, self) =>
            index === self.findIndex((m) => m.user_id === member.user_id)
        );
        return uniqueMembers;
      });
    }
  }, [ShareChatsUsersIsFetching, ShareChatsUsersIsSuccess]);
  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (outSideRef.current && !outSideRef.current.contains(event.target)) {
        setShow(false);
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [show]);
  return (
    <>
      {show ? (
        <div ref={outSideRef}>
          <InviteFriends />
        </div>
      ) : (
        <div
          className="flex justify-end mr-3 absolute bottom-[36px] right-[18px]"
          onClick={() => setShow(true)}
        >
          {(!isError && shareChatsMembers?.length > 0 && chatHistoryID && !ShareChatsUsersIsFetching) ? (
            <div className="flex -space-x-2 overflow-hidden bg-[#272727] p-2 rounded-3xl">
              {shareChatsMembers?.map((member: any, index: number) => (
                <>
                  {" "}
                  <Tooltip
                    content={<p className="text-[#FFF]">{member?.full_name}</p>}
                    showArrow
                    placement="top"
                    delay={0}
                    closeDelay={0}
                    classNames={{
                      base: "before:bg-[#2E353C] mb-2",
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
                    <Avatar
                      src={member?.profile_picture_url}
                      showFallback={true}
                      className="w-[35px] h-[35px] cursor-pointer"
                      fallback={
                        <Image
                          src={"/svg/user.svg"}
                          alt="profile-pic"
                          width={35}
                          height={35}
                          objectFit="cover"
                          className="w-[35px] h-[35px] "
                        />
                      }
                    />
                  </Tooltip>
                </>
              ))}
              <div
                className="text-xl text-white cursor-pointer my-auto"
                style={{
                  marginLeft: "8px",
                  marginRight: "3px",
                  fontSize: "26px",
                }}
              >
                <UserPlusIcon className="w-7 h-7 text-[#D2D2D2]" />
              </div>
            </div>
          ) :( !ShareChatsUsersIsFetching && chatHistoryID) ? (
            <div className="flex  bg-[#272727] py-3 px-5 items-center rounded-full text-white cursor-pointer">
              <span>Invite Friends</span>
              <div
                className="text-xl text-white cursor-pointer"
                style={{
                  marginLeft: "5px",
                  marginRight: "3px",
                  fontSize: "26px",
                  display: "flex",
                  alignItems: "center",
                  marginBlockEnd: "auto",
                }}
              >
                +
              </div>
            </div>
          ): ShareChatsUsersIsFetching && 
          <div className="flex  bg-[#272727] py-3 px-5 items-center rounded-full text-white cursor-pointer"> <Spinner size="sm" color="white" />
          </div>}
        </div>
      )}
    </>
  );
};

export default AvatarGroups;
