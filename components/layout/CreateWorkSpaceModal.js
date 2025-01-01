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
  useAddWorkspaceMutation,
  useFetchUserDetailsForInviteQuery,
} from "@/app/lib/features/workspace/workspaceApi";
import Link from "next/link";
import Image from "next/image";
import useDebounce from "@/app/hooks/useDebounce";
import { useAuth } from "@/app/authContext/auth";
import toast from "react-hot-toast";
import ToastService from "../Toaster/toastService";

const CreateWorkSpaceModal = ({
  modalOpen,
  closeModal,
  updateCurrentWorkspace,
}) => {
  const auth = useAuth();
  const fileInput = useRef();
  const [selectedKeys, setSelectedKeys] = useState("edit");
  const [addWorkspace] = useAddWorkspaceMutation();
  const [initialValues] = useState({
    name: "",
    members: [],
    logo_url: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isfileSubmitting, setIsFileSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [inviteUserInfo, setInviteUserInfo] = useState(null);
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
    onSubmit: async (values, { resetForm }) => {
      if (inviteUserInfo?.role) {
        setIsSubmitting(true);

        const newMembers = values?.members?.map((member) => ({
          ...member,
          status: "active",
        }));

        const data = {
          user_id: auth?.user?.userID,
          members: newMembers,
          name: values?.name?.trim(),
          logo_url: values?.logo_url,
        };


        addWorkspace(data)
          .unwrap()
          .then((response) => {
            if (!!response.id) {
              resetForm();
              HandleWorkspaceClose();
              if (updateCurrentWorkspace) {
                updateCurrentWorkspace(response?.id, null);
              }
              toast.success(response.message);
            }
          })
          .catch((error) => {
            toast.error(error?.data?.message ?? error?.message);
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      } else {
        toast.error("Select access user permission");
      }
    },
  });

  useEffect(() => {
    const getUserData = (userEmail) => {
      axiosInstance
        .post(
          `/auth/getuser`,
          { email: userEmail },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((response) => {
          formik.setFieldValue("members", [
            {
              full_name: response?.data?.data?.full_name ?? "",
              email: response?.data?.data?.email ?? "",
              user_id: response?.data?.data?._id ?? "",
              profile_picture_url:
                response?.data?.data?.profile_picture_url ?? "",
              role: "owner",
            },
          ]);
        })
        .catch((err) => {
        toast.error((err?.message ??  err?.data?.message) || "Something went wrong!")

        });
    };
    const userEmail = auth?.user?.email;
    if (!!userEmail) getUserData(userEmail);
  }, [auth, modalOpen]);

  const HandleWorkspaceClose = () => {
    if (isSubmitting === false) {
      closeModal();
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

  return (
    <Modal
      isOpen={modalOpen}
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
        <ModalHeader className="text-[16px]	text-white font-bold helvetica-font justify-between">
          <div className="flex items-center	gap-2.5">
            <Leftarrow /> Create Workspace
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
                className="w-12 h-12 cursor-pointer"
                onClick={() => fileInput.current.click()}
              />
            ) : (
              <label
                onClick={() => fileInput.current.click()}
                className="w-12 h-12 bg-[#757575] rounded-full flex justify-center items-center cursor-pointer"
              >
                <Plusicon width={20} height={20} />
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
                  className={`${formik.errors.name && formik.touched.name
                      ? "text-danger"
                      : "text-white"
                    } font-bold helvetica-font mb-1 text-[15px]`}
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
              value={search}
              onChange={(event) => setSearch(event?.target?.value?.trimStart())}
            />
          </div>

          <div>
            <div>
              <p className="text-white font-bold helvetica-font mb-5 ml-1">{`People with access`}</p>
            </div>
            {formik?.values?.members?.map((member, index) =>
              member.role === "owner" ? (
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
                    <p className="text-white font-medium helvetica-font mb-0">
                      {member?.full_name}{" "}
                      {member?.user_id === auth?.user?.userID ? "(You)" : ""}
                    </p>
                  </div>
                  <p className="text-white font-normal text-sm helvetica-font mb-0">
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
                    <p className="text-white font-medium helvetica-font mb-0">
                      {member?.full_name}
                    </p>
                  </div>
                  <Dropdown
                    classNames={{
                      content:
                        "bg-[#171717] min-w-24 shadow-[0px 0px 1px 0px rgba(0, 0, 0, 0.25)]",
                    }}
                  >
                    <DropdownTrigger>
                      <p className="flex justify-end items-center !bg-transparent text-white font-normal helvetica-font cursor-pointer">
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
                      onSelectionChange={({ currentKey }) => {
                        if (currentKey === "edit" || currentKey === "view") {
                          const updatedMembers = formik?.values?.members?.map(
                            (item) =>
                              item.user_id === member.user_id
                                ? { ...item, role: currentKey }
                                : item
                          );
                          formik.setFieldValue("members", updatedMembers);
                        } else if (currentKey === "delete") {
                          const filteredMembers =
                            formik?.values?.members?.filter(
                              (item) => item.user_id !== member.user_id
                            );
                          formik.setFieldValue("members", filteredMembers);
                        }
                      }}
                    >
                      <DropdownItem
                        key={"edit"}
                        className="text-white font-normal helvetica-font text-lg"
                      >
                        <p className="text-base">Can Edit</p>
                      </DropdownItem>
                      <DropdownItem
                        key={"view"}
                        className="text-white font-normal helvetica-font hover:bg-transparent"
                        showDivider
                      >
                        <p className="text-base">Can View</p>
                      </DropdownItem>
                      <DropdownItem
                        key={"delete"}
                        className="text-white font-normal helvetica-font hover:bg-transparent"
                      >
                        <p className="text-base">Remove</p>
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              )
            )}

            {InviteUserLoading ? (
              <>
                <div className="flex justify-center items-center mb-3">
                  <Spinner size="sm" color="default" />
                </div>
              </>
            ) : (
              <>
                {inviteUserInfo &&
                  !formik.values?.members?.find(
                    (member) => member?.user_id === inviteUserInfo?.id
                  ) && (
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={inviteUserInfo?.profile_picture_url}
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
                        <p className="text-white font-medium helvetica-font mb-0">
                          {inviteUserInfo?.full_name}
                        </p>
                      </div>
                      <Dropdown
                        classNames={{
                          content:
                            "bg-[#171717] min-w-24 shadow-[0px 0px 1px 0px rgba(0, 0, 0, 0.25)]",
                        }}
                      >
                        <DropdownTrigger>
                          <p className="flex justify-end items-center !bg-transparent text-white font-normal helvetica-font cursor-pointer">
                            {`Select permission`} <Downarrow className="ml-2" />
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
                              const updatedMembers = [
                                ...formik?.values?.members,
                                {
                                  full_name: inviteUserInfo?.full_name ?? "",
                                  email: inviteUserInfo?.email ?? "",
                                  user_id: inviteUserInfo?.id ?? "",
                                  profile_picture_url:
                                    inviteUserInfo?.profile_picture_url ?? "",
                                  role: currentKey,
                                },
                              ];
                              formik.setFieldValue("members", updatedMembers);
                              setInviteUserInfo({
                                ...inviteUserInfo,
                                role: currentKey,
                              });
                            }
                          }}
                        >
                          <DropdownItem
                            key={"edit"}
                            className="text-white font-normal helvetica-font text-lg"
                          >
                            <p className="text-base">Can Edit</p>
                          </DropdownItem>
                          <DropdownItem
                            key={"view"}
                            className="text-white font-normal helvetica-font hover:bg-transparent"
                          >
                            <p className="text-base">Can View</p>
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  )}
              </>
            )}
          </div>

          {/* <div className="mt-5">
            <div>
              <p className="text-white font-bold helvetica-font mb-5">{`General access`}</p>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1 cursor-pointer">
                <Copyicon />
                <p className="text-[#0A84FF] font-medium helvetica-font mb-0">Copy link</p>
              </div>
              <Dropdown classNames={{ content: "bg-[#171717] min-w-24 shadow-[0px 0px 1px 0px rgba(0, 0, 0, 0.25)]" }}>
                <DropdownTrigger>
                  <p className="flex justify-end items-center !bg-transparent text-white font-normal helvetica-font cursor-pointer">{(selectedKeys === "edit") ? "Can Edit" : (selectedKeys === "view") ? "Can View" : (selectedKeys === "disable") ? "Disable" : (<></>)} <Downarrow className="ml-2" /></p>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Multiple selection example"
                  variant="flat"
                  closeOnSelect={true}
                  selectionMode="single"
                  disallowEmptySelection
                  onSelectionChange={({ currentKey }) => {
                    setSelectedKeys(currentKey);
                  }}
                >
                  <DropdownItem key="edit" className="text-white font-normal helvetica-font text-lg">
                    <p className="text-base">Can Edit</p>
                  </DropdownItem>
                  <DropdownItem key="view" className="text-white font-normal helvetica-font hover:bg-transparent" showDivider>
                    <p className="text-base">Can View</p>
                  </DropdownItem>
                  <DropdownItem key="disable" className="text-white font-normal helvetica-font hover:bg-transparent">
                    <p className="text-base">Disable</p>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div> */}
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
              className={`bg-[#0A84FF] rounded-xl	font-medium text-base	h-auto py-[5px] ${isSubmitting ? "px-[15px]" : "px-[40px]"}`}
              onPress={formik.handleSubmit}
              isLoading={isSubmitting}
            >
              {isSubmitting ? "Creating" : "Create"}
            </Button>
          </div>
        </ModalFooter> */}
        /
        <ModalFooter className="justify-center  items-center !mt-0 !mb-[30px]">
          <div>
            <Button
              className={`bg-[#0A84FF] rounded-xl	font-medium text-base	h-auto py-[5px] ${isSubmitting ? "px-[15px]" : "px-[40px]"
              }`}
              onPress={formik.handleSubmit}
              isLoading={isSubmitting}
            >
              {isSubmitting ? "Creating" : "Create"}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
      <ToastService/>
    </Modal>
  );
};

export default CreateWorkSpaceModal;
