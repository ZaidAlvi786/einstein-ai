import { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  skeleton,
  Spinner,
} from "@nextui-org/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import Usericon from "@/app/assets/svg/user-icon.svg";
import Downarrow from "@/app/assets/svg/keyboard_arrow_down.svg";
import Copyicon from "@/app/assets/svg/copy-icon.svg";
import Community from "@/app/assets/svg/community-icon.svg";
import Close from "@/app/assets/svg/close-icon.svg";
import Leftarrow from "@/app/assets/svg/left-arrow.svg";
import Plusicon from "@/app/assets/svg/plus.svg";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRef } from "react";
import axiosInstance from "@/app/http/axios";
import {
  useAddMemberMutation,
  useEditWorkspaceMutation,
  useEditWorkspaceUserMutation,
  useFetchUserDetailsForInviteQuery,
  useRemoveMemberMutation,
} from "@/app/lib/features/workspace/workspaceApi";
import Link from "next/link";
import Image from "next/image";
import useDebounce from "@/app/hooks/useDebounce";
import { useAuth } from "@/app/authContext/auth";
import toast from "react-hot-toast";
import ToastService from "@/components/Toaster/toastService";
import {
  useGetSharedChatLinkAccessMutation,
  useGetSharedWorkspaceLinkAccessMutation,
  useRemoveOldWorkspaceAccessLinkMutation,
  useSendInviteToNonPlatformUserMutation,
} from "@/app/lib/features/chat/chatApi";

const EditWorkSpaceModal = ({
  editWorkspace,
  setEditWorkspace,
  fetchWorkspace,
}) => {
  const auth = useAuth();
  const fileInput = useRef();
  const inputRef = useRef(null); 
  const [selectedKeys, setSelectedKeys] = useState("edit");
  const [isDisabled, setIsDisabled] = useState(false);

  const [EditWorkspace] = useEditWorkspaceMutation();
  const [EditWorkspaceUser] = useEditWorkspaceUserMutation();
  const [AddMember] = useAddMemberMutation();
  const [RemoveMember] = useRemoveMemberMutation();
  const [initialValues, setInitialValues] = useState({
    name: "",
    logo_url: "",
  });
  const [workspaceMembers, setWorkspaceMembers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isfileSubmitting, setIsFileSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [inviteUserInfo, setInviteUserInfo] = useState(null);
  const [updateWorkspacesUserLoading, setUpdateWorkspacesUserLoading] =
    useState({ loading: false, user_id: "" });
  const [GetSharedWorkspaceLinkAccess] =
    useGetSharedWorkspaceLinkAccessMutation();
  const [RemoveOldWorkspaceAccessLink] =
    useRemoveOldWorkspaceAccessLinkMutation();
  const debouncedSearchTerm = useDebounce(search, 500);
  const {
    data: InviteUserData,
    isError: InviteUserisError,
    isSuccess: InviteUserisSuccess,
    error: InviteUserError,
    isFetching: InviteUserLoading,
  } = useFetchUserDetailsForInviteQuery(debouncedSearchTerm, {
    skip: !Boolean(search?.length),
  });
    const [sendInviteToNonPlatformUser, {isLoading}] =
    useSendInviteToNonPlatformUserMutation();

  const CreateWorkSpaceValidationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .max(255, "Workspace name must not be greater than 255 characters.")
      .required("Workspace name field is required."),
  });

  const fileOrUrlSchema = Yup.object().shape({
    image: Yup.mixed()
      .required("Image is required.")
      .test(
        "file-type-or-url",
        "Only JPG, PNG, SVG files or a valid URL are allowed",
        (value) => {
          if (!value) return true; // If no value provided, validation passes
          if (typeof value === "string") {
            // Check if it's a URL
            const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
            if (urlPattern.test(value)) {
              return true;
            }
          }
          // Check if it's a file and matches the types
          return ["image/jpeg", "image/png", "image/svg+xml"].includes(
            value.type
          );
        }
      ),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: CreateWorkSpaceValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);

      const data = {
        workspace_id: editWorkspace?.workspaceData?._id,
        name: values?.name?.trim(),
        logo_url: values?.logo_url,
      };

      EditWorkspace(data)
        .unwrap()
        .then((response) => {
          if (response?.status === 200) {
            resetForm();
            if (fetchWorkspace) {
              fetchWorkspace();
            }
            HandleWorkspaceClose();
            toast.success(response.message);
          } else {
            toast.error(response.message);
          }
        })
        .catch((error) => {
          toast.error(error?.data?.message ?? error?.message);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    },
  });

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();  // Refocus the input if it's rendered
    }
  }, [search, inviteUserInfo]);

  useEffect(() => {
    if (editWorkspace?.open) {
      setInitialValues({
        name: editWorkspace?.workspaceData?.name ?? "",
        logo_url: editWorkspace?.workspaceData?.logo_url ?? "",
      });

      const newMembers = editWorkspace?.workspaceData?.members?.map((ele) => ({
        role: ele?.role,
        status: ele?.status,
        permission_type: ele?.permission_type,
        full_name: ele?.user?.full_name,
        profile_picture_url: ele?.user?.profile_picture_url,
        user_id: ele?.user_id,
      }));

      const ownerDetails = editWorkspace?.workspaceData?.members?.filter(
        (x) => x?.role == "owner" && x?.user_id == auth?.user?.userID
      );
      setIsOwner(ownerDetails.length);
      setWorkspaceMembers(newMembers ?? []);
    }
  }, [auth, editWorkspace?.open]);

  const HandleWorkspaceClose = () => {
    if (isSubmitting === false) {
      setEditWorkspace({ open: false, workspaceData: null });
      formik.resetForm();
      setSearch("");
      setInviteUserInfo(null);
    }
  };

  const handleChangeOnWorkspaceImage = (event) => {
    const image = event?.target?.files[0];

    if (image) {
      fileOrUrlSchema
        .validate({ image })
        .then(({ image }) => {
          setIsFileSubmitting(true);
          const formData = new FormData();
          formData.append("image", image);

          axiosInstance
            .post("/ai/uploadImage", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            })
            .then((response) => {
              const url = response?.data?.url;
              formik.setFieldValue("logo_url", url);
            })
            .catch((error) => {
              // Handle error
              toast.error(error.message);
            })
            .finally(() => {
              setIsFileSubmitting(false);
            });
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }
  };

  const HandleUpdateWorkspaceUser = (
    user_id,
    workspace_id,
    role,
    already_workspace_member,
    userInfo
  ) => {
    setUpdateWorkspacesUserLoading({ loading: true, user_id });
    if (already_workspace_member) {
      if (role === "edit" || role === "view") {
        const data = { workspace_id, role, member_id: user_id };

        EditWorkspaceUser(data)
          .unwrap()
          .then((response) => {
            if (response?.status === 400) {
              toast.error(response?.message);
            } else if (response?.status === 200) {
              setWorkspaceMembers((pre) =>
                pre?.map((pre_user) =>
                  pre_user?.user_id === user_id
                    ? { ...pre_user, role, permission_type:role }
                    : pre_user
                )
              );

              toast.success(response?.message);
            }
          })
          .catch((error) => {
            toast.error(error?.data?.message);
          })
          .finally(() => {
            setUpdateWorkspacesUserLoading({ loading: false, user_id: "" });
          });
      } else if (role === "delete") {
        const data = { workspace_id, member_id: user_id };

        RemoveMember(data)
          .unwrap()
          .then((response) => {
            setWorkspaceMembers((pre) =>
              pre?.filter((item) => item?.user_id !== user_id)
            );
            setInviteUserInfo(null)
            toast.success(response);
          })
          .catch((error) => {
            if (error?.data?.message) {
              toast.error(response?.message);
            }
          })
          .finally(() => {
            setUpdateWorkspacesUserLoading({ loading: false, user_id: "" });
          });
      }
    } else {
      if (role === "edit" || role === "view") {
        const data = { workspace_id, user_id, role, status: "active" };

        AddMember(data)
          .unwrap()
          .then((response) => {
            if (response?.status === 400) {
              toast.error(response?.message);
            } else {
              setWorkspaceMembers((pre) => [...pre, { ...userInfo }]);
              setInviteUserInfo({ ...inviteUserInfo, permission_type: role });
              toast.success(response);
            }
          })
          .catch((error) => {
            toast.error(error?.data);
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
  const handleCopyLink = async() => {
    const workspace_id_local = await localStorage.getItem("workspace_id")
    const data = {
      workspace_id: workspace_id_local ? workspace_id_local : editWorkspace?.workspaceData?._id,
      permission_type: selectedKeys,
    };
    GetSharedWorkspaceLinkAccess(data)
      .unwrap()
      .then((response) => {
        if (response.status === 200) {
          const { data } = response;
          const url = `${window.location.origin}/?access_link=${data?.access_link}&permission_type=${data?.permission_type}&workspace=true`;
          navigator.clipboard.writeText(url);
          toast.success("Access link copied successfully!");
        }
      })
      .catch((error) => {
        toast.error(error?.data?.message);
      })
      .finally(() => {
        setUpdateWorkspacesUserLoading({ loading: false, user_id: "" });
      });
  };
  const handleKeys = (currentKey) => {
    setSelectedKeys(currentKey);
    if (
      currentKey.toLowerCase() == "remove" ||
      currentKey.toLowerCase() == "delete"
    ) {
      setIsDisabled(true);
      RemoveOldWorkspaceAccessLink({
        workspace_id: editWorkspace?.workspaceData?._id,
      })
        .unwrap()
        .then((response) => {
          if (response.status === 200) {
            const { data } = response;
            toast.success(response?.message);
            // HandleModalClose();
          }
        })
        .catch((error) => {
          toast.error(error?.data?.message);
        })
        .finally(() => {});
    } else {
      setIsDisabled(false);
    }
  };
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  
  const handleSendInvite = () => {
    try {
      const data = {
        non_platfrom_user_email: search,
      };
      sendInviteToNonPlatformUser(data).then((res) => {
        console.log("res: ", res);
        toast.success(res?.data?.message || "Email sent successfully.")
      }).catch(error=>{
      console.log('error: ', error);
        toast.error(res?.data?.message || "Something went wrong.")
      });
    } catch (error) {
      console.log("error: ", error);
    }
  };
  return (
    <Modal
      isOpen={editWorkspace?.open}
      size={"md"}
      hideCloseButton
      onClose={() => HandleWorkspaceClose()}
      onOpenChange={() => HandleWorkspaceClose()}
      classNames={{
        header: ["2xl:py-6", "2xl:px-[25px]", "xl:py-[22px]", "xl:px-[30px]"],
        footer: ["p-0", "my-[25px]"],
        base: ["2xl:h-auto"],
      }}
    >
      <ModalContent>
        <ModalHeader className="text-[14.222px]	text-white font-bold helvetica-font items-center justify-between">
          <div className="flex items-center	gap-2.5">
            <Leftarrow /> Edit Workspace
          </div>
          <Close
            className="cursor-pointer"
            onClick={() => HandleWorkspaceClose()}
          />
        </ModalHeader>
        <ModalBody className="px-[24px] py-[0px] gap-[0px]">
          <div className="flex justify-center items-center w-full mb-5 ">
            {isfileSubmitting ? (
              <Spinner color="default" />
            ) : formik.values.logo_url ? (
              <Avatar
                src={formik.values.logo_url}
                className="w-[42.667px] h-[42.667px] cursor-pointer"
                onClick={() => fileInput.current.click()}
              />
            ) : (
              <label
                onClick={() => fileInput.current.click()}
                className="w-[42.667px] h-[42.667px] bg-[#757575] rounded-full flex justify-center items-center cursor-pointer"
              >
                <Plusicon width={15.556} height={15.556} />
              </label>
            )}

            <input
              ref={fileInput}
              type="file"
              className="hidden"
              onChange={handleChangeOnWorkspaceImage}
            />
          </div>
          <div className="mb-4">
            <Input
              isClearable={false}
              color="primary"
              classNames={{
                label: "text-white",
                input: [
                  "!bg-transparent",
                  "placeholder:text-[#6A6A6A]",
                  "text-[14.222px]",
                  "font-normal",
                  "font-inter",
                  "group-data-[has-value=true]:text-white  ",
                  "text-[#6A6A6A] placeholder:text-[14.222px] placeholder:text-normal font-helvetica caret-white outline-0 placeholder:text-[#9B9B9B]",
                ],
                inputWrapper: [
                  "!bg-transparent",
                  "rounded-[6.222px]",
                  "data-[hover=true]:bg-[#232323]",
                  "group-data-[focus=true]:bg-[#232323]",
                  "group-data-[has-value=true]:text-white",
                  "h-[42.667px] outline-0 outline-[#424242] border-[0.889px] group-data-[focus=true]:border-[#0A84FF]",
                ],
              }}
              type="text"
              placeholder="Company Research"
              labelPlacement="outside"
              label={
                <p
                  className={`${
                    formik.errors.name && formik.touched.name
                      ? "text-danger"
                      : "text-white"
                  } font-bold helvetica-font mb-1 text-[13.333px]`}
                >
                  Workspace name
                </p>
              }
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              variant="bordered"
              isInvalid={formik.errors.name && formik.touched.name}
              errorMessage={
                formik.errors.name && formik.touched.name && formik.errors.name
              }
             
            />
          </div>
          <div className="mb-4">
            <Input
             ref={inputRef} 
              isClearable={false}
              color="primary"
              classNames={{
                label: "text-white",
                input: [
                  "!bg-transparent",
                  "placeholder:text-[#6A6A6A]",
                  "text-[14.222px]",
                  "font-normal",
                  "font-inter",
                  "group-data-[has-value=true]:text-white  ",
                  "placeholder:font-normal placeholder:text-[14.222px] text-[#6A6A6A]  font-helvetica caret-white outline-0 placeholder:text-[#9B9B9B]",
                ],
                inputWrapper: [
                  "!bg-transparent",
                  "rounded-[6.222px]",
                  "data-[hover=true]:bg-[#232323]",
                  "group-data-[focus=true]:bg-[#232323]",
                  "group-data-[has-value=true]:text-white",
                  "h-[42.667px] outline-0 outline-[#424242] border-[0.889px] group-data-[focus=true]:border-[#0A84FF]",
                ],
              }}
              type="text"
              placeholder="Add people by username or email"
              labelPlacement="outside"
              label={
                <p
                  className={`text-white font-medium helvetica-font mb-1 text-[13.333px]`}
                >
                  Share this workspace
                </p>
              }
              variant="bordered"
              value={search}
              onChange={(event) => setSearch(event?.target?.value?.trimStart())}
              endContent={
                isValidEmail(search) && !inviteUserInfo?.full_name ? (
                  <button
                  onClick={() => handleSendInvite()}
                    className="text-white bg-[#0A84FF] px-1 py-1 rounded-[8px] text-[12px] w-[100px]"

                  >
                    {isLoading ? "Sending..."  :"Send Invite"} 
                  </button>
                ) : null
              }
            />
          </div>
          <div>
            <div>
              <p className="text-white text-[13.333px] font-bold helvetica-font mb-5 ml-1">{`People with access`}</p>
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
                  !workspaceMembers?.find(
                    (member) => member?.user_id === inviteUserInfo?.id
                  ) && (
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={inviteUserInfo?.profile_picture_url}
                          showFallback={true}
                          className="w-[26.667px] h-[26.667px] cursor-pointer"
                          fallback={
                            <Image
                              src={"/svg/user.svg"}
                              alt="profile-pic"
                              width={11.25}
                              height={14.22}
                            />
                          }
                        />
                        <p className="text-white text-[14.222px] font-medium helvetica-font mb-0">
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
                            <p className="flex justify-end items-center text-[12.444px] !bg-transparent text-white font-normal helvetica-font cursor-pointer">
                           
                              {`${
                                inviteUserInfo.permission_type === "edit"
                                  ? "Can Edit"
                                  : inviteUserInfo.permission_type === "view"
                                  ? "Can View"
                                  : 'Select permission' 
                              }`}{" "}
                              <Downarrow className="ml-2" width={10.051} height={5.962} />
                            </p>
                          </DropdownTrigger>
                          <DropdownMenu
                            aria-label="Multiple selection example"
                            variant="flat"
                            closeOnSelect={true}
                            disallowEmptySelection
                            selectionMode="single"
                            onSelectionChange={({ currentKey }) => {
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
                                  permission_type: currentKey,
                                };
                                HandleUpdateWorkspaceUser(
                                  inviteUserInfo?.id,
                                  editWorkspace?.workspaceData?._id,
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
                              <p className="text-[12.444px]">Can Edit</p>
                            </DropdownItem>
                            <DropdownItem
                              key={"view"}
                              className="text-white font-normal helvetica-font hover:bg-transparent"
                            >
                              <p className="text-[12.444px]">Can View</p>
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      )}
                    </div>
                  )}
              </>
            )}
            {workspaceMembers?.map((member, index) =>
              member?.role === "owner" ? (
                <div
                  key={index}
                  className="flex items-center justify-between mb-3"
                >
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={member?.profile_picture_url}
                      showFallback={true}
                      className="w-[26.667px] h-[26.667px] cursor-pointer"
                      fallback={
                        <Image
                          src={"/svg/user.svg"}
                          alt="profile-pic"
                          width={11.25}
                          height={14.22}
                        />
                      }
                    />
                    <p className="text-white text-[14.222px] font-medium helvetica-font mb-0">
                      {member?.full_name}{" "}
                      {member?.user_id === auth?.user?.userID ? "(You)" : ""}
                    </p>
                  </div>
                  <p className="text-white font-normal text-[12.444px] helvetica-font mb-0">
                    Owner
                  </p>
                </div>
              ) : (
                <div
                  key={index}
                  className="flex items-center justify-between mb-3"
                >
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={member?.profile_picture_url}
                      showFallback={true}
                      className="w-[26.667px] h-[26.667px] cursor-pointer"
                      fallback={
                        <Image
                          src={"/svg/user.svg"}
                          alt="profile-pic"
                          width={11.25}
                          height={14.22}
                        />
                      }
                    />
                    <p className="text-white text-[14.222px] font-medium helvetica-font mb-0">
                      {member?.full_name}
                    </p>
                  </div>
                  {updateWorkspacesUserLoading?.user_id === member?.user_id &&
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
                        <p className="flex justify-end items-center text-[12.444px] !bg-transparent text-white font-normal helvetica-font cursor-pointer">
                          {member.permission_type === "edit" ? (
                            "Can Edit"
                          ) : member.permission_type === "view" ? (
                            "Can View"
                          ) : member.permission_type === "delete" ? (
                            "Remove"
                          ) : (
                            <></>
                          )}{" "}
                          <Downarrow className="ml-2" width={10.051} height={5.962} />
                        </p>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Multiple selection example"
                        variant="flat"
                        closeOnSelect={true}
                        disallowEmptySelection
                        selectionMode="single"
                        onSelectionChange={({ currentKey }) => {
                          if (currentKey === "edit" || currentKey === "view") {
                            HandleUpdateWorkspaceUser(
                              member?.user_id,
                              editWorkspace?.workspaceData?._id,
                              currentKey,
                              true,
                              null
                            );
                          } else if (currentKey === "delete") {
                            HandleUpdateWorkspaceUser(
                              member?.user_id,
                              editWorkspace?.workspaceData?._id,
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
                          <p className="text-[12.444px]">Can Edit</p>
                        </DropdownItem>
                        <DropdownItem
                          key={"view"}
                          className="text-white font-normal helvetica-font hover:bg-transparent"
                          showDivider
                        >
                          <p className="text-[12.444px]">Can View</p>
                        </DropdownItem>
                        <DropdownItem
                          key={"delete"}
                          className="text-white font-normal helvetica-font hover:bg-transparent"
                        >
                          <p className="text-[12.444px]">Remove</p>
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  )}
                </div>
              )
            )}

           
          </div>
          {isOwner ? (
            <div className="mt-5">
              <div>
                <p className="text-white text-[13.333px] font-bold helvetica-font mb-5">{`General access`}</p>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`flex items-center gap-1 ${
                    isDisabled ? "" : "cursor-pointer"
                  }`}
                  onClick={isDisabled ? "" : handleCopyLink}
                >
                  <Copyicon height={17.556} width={17.556} />
                  <p className="text-[#0A84FF] text-[12.444px] font-medium helvetica-font mb-0">
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
                    <p className="flex justify-end items-center text-[12.444px] !bg-transparent text-white font-normal helvetica-font cursor-pointer">
                      {selectedKeys === "edit" ? (
                        "Can Edit"
                      ) : selectedKeys === "view" ? (
                        "Can View"
                      ) : selectedKeys === "remove" ? (
                        "Remove"
                      ) : (
                        <></>
                      )}{" "}
                      <Downarrow className="ml-2" width={10.051} height={5.962} />
                    </p>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Multiple selection example"
                    variant="flat"
                    closeOnSelect={true}
                    selectionMode="single"
                    disallowEmptySelection
                    onSelectionChange={({ currentKey }) =>
                      handleKeys(currentKey)
                    }
                  >
                    <DropdownItem
                      key="edit"
                      className="text-white font-normal helvetica-font text-lg"
                    >
                      <p className="text-[12.444px]">Can Edit</p>
                    </DropdownItem>
                    <DropdownItem
                      key="view"
                      className="text-white font-normal helvetica-font hover:bg-transparent"
                      showDivider
                    >
                      <p className="text-[12.444px]">Can View</p>
                    </DropdownItem>
                    <DropdownItem
                      key="remove"
                      className="text-white font-normal helvetica-font hover:bg-transparent"
                    >
                      <p className="text-[12.444px]">Remove</p>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          ) : (
            ""
          )}
        </ModalBody>
        {/* <ModalFooter className="justify-between px-[24px] items-center">
          <Link href={"/marketplace"} className="flex gap-3">
            <Community className="text-[#7A7A7A]" />
            <p className="text-[#7A7A7A] font-normal helvetica-font">
              Publish to community
            </p>
          </Link>
          <div>
            <Button
              className={`bg-[#0A84FF] rounded-xl	font-medium text-base	h-auto py-[5px] ${
                isSubmitting ? "px-[15px]" : "px-[40px]"
              }`}
              onPress={formik.handleSubmit}
              isLoading={isSubmitting}
            >
              {isSubmitting ? "Updating" : "Update"}
            </Button>
          </div>
        </ModalFooter> */}
        <ModalFooter className="justify-center  items-center  !mb-[30px]">
          <div>
            <Button
              className={`bg-[#0A84FF] rounded-xl	font-medium text-base	h-auto py-[5px] ${
                isSubmitting ? "px-[15px]" : "px-[40px]"
              }`}
              onPress={formik.handleSubmit}
              isLoading={isSubmitting}
            >
              {isSubmitting ? "Updating" : "Update"}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
      <ToastService />
    </Modal>
  );
};

export default EditWorkSpaceModal;
