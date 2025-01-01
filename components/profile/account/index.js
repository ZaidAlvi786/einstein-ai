"use client";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import React, { useEffect, useCallback, useMemo, useState } from "react";
import baseAxios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { apiURL } from "@/config";
import profile from "../../../app/assets/image/user-icon.svg";
import { useAuth } from "../../../app/authContext/auth";
import { Input } from "@nextui-org/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import useBoolean from "@/app/hooks/useBoolean";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { CheckIcon, XCircleIcon } from "@heroicons/react/24/outline";
import UploadProfilePictureModal from "./UploadProfilePictureModal";
import axios from "@/app/http/axios";
import DeleteAccountConfirmtionModal from "./DeleteAccountConfirmtionModal";
import { useAppDispatch } from "@/app/lib/hooks";
import { setActiveChat } from "@/app/lib/features/chat/chatSlice";
import { setCurrentActiveGroup } from "@/app/lib/features/chat/groupSlice";
import { workspaceApi } from "@/app/lib/features/workspace/workspaceApi";
import { chatApi } from "@/app/lib/features/chat/chatApi";
import EmailNotificationsConfirmtionModal from "./EmailNotificationsConfirmtionModal";
import toast from "react-hot-toast";
import ToastService from "@/components/Toaster/toastService";
import InputField from "@/app/ui/InputField";
import FeedBackBtn from "@/components/Feedback/feedbackBtn";

const Account = () => {
  const auth = useAuth();
  const dispatch = useAppDispatch();
  const [showEdit, setshowEdit] = useState({
    full_name: false,
    email: false,
    company_name: false,
    job_title: false,
    use_case: false,
    language: "en",
    image: false,
    unique_handle: false,
    logo: false,
  });
  const router = useRouter();
  console.log("showEdit: ", showEdit);

  // Use the useBoolean hook for managing password visibility toggle
  const { value: isPasswordVisible, toggle: togglePasswordVisibility } =
    useBoolean(false);

  const [loading, setLoading] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [langLoading, setLangLoading] = useState(false);
  const [isLogoutConfirmModal, setIsLogoutConfirmModal] = useState(false);
  const [tryToEditField, setTryToEditField] = useState(null);
  const [
    isEmailNotificationsConfirmtionModal,
    setIsEmailNotificationsConfirmtionModal,
  ] = useState({
    open: false,
    email_notifications: false,
    email: auth?.user?.email ?? "",
  });

  const [userData, setUserData] = useState({
    full_name: "",
    email: "",
    company_name: "",
    job_title: "",
    use_case: "",
    language: "en",
    image: "",
    unique_handle: "",
  });
  console.log("userData: ", userData);

  const [isEditing, setIsEditing] = useState({
    full_name: false,
    email: false,
    company_name: false,
    job_title: false,
    use_case: false,
    language: false,
    unique_handle: false,
    password: false,
  });

  const [editEnable, setEditEnable] = useState({
    full_name: false,
    email: false,
    company_name: false,
    job_title: false,
    use_case: false,
    language: false,
    unique_handle: false,
    password: false,
  });

  const validationSchema = () => {
    let schema = {};

    // Conditionally add validation rules based on isEditing[key]
    if (isEditing.full_name) {
      schema.full_name = Yup.string().required("Full Name is required");
    }
    if (isEditing.email) {
      schema.email = Yup.string()
        .email("Invalid email")
        .matches(
          /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          "Invalid email format"
        )
        .required("Email is required");
    }

    if (isEditing.job_title) {
      schema.job_title = Yup.string().required("Job Title is required");
    }
    if (isEditing.language) {
      schema.language = Yup.string().required("Language is required");
    }
    if (isEditing.password) {
      schema.password = Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(
          /[!@#$%^&*(),.?":{}|<>]/,
          "Password must contain at least one symbol"
        )
        .required("Password is required");
    }
    if (isEditing.unique_handle) {
      schema.unique_handle = Yup.string().required("Unique Handle is required");
    }

    return Yup.object().shape(schema);
  };

  const formik = useFormik({
    initialValues: {
      full_name: userData?.full_name || "",
      email: userData?.email || "",
      job_title: userData?.job_title || "",
      password: userData?.password || "",
      // password: "",
      language: userData?.language || "en",
      unique_handle: userData?.unique_handle || "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // Identify the key that is currently in edit mode
      let editedKey = Object.keys(isEditing).find((key) => isEditing[key]);

      // Construct the payload with only the edited field's data
      let updatedUserData = {
        ...userData,
        [editedKey]: values[editedKey],
      };

      // Compare current values with previous values
      const isSameValue =
        JSON.stringify(userData[editedKey]) ===
        JSON.stringify(values[editedKey]);
      if (isSameValue) {
        const field = accountData.find((detail) => detail.id === editedKey);
        toast.error(`No changes made to ${field.title}!`);
        return;
      }

      // You can perform axios POST request here to update the user data
      baseAxios
        .post(
          `${apiURL}/auth/update`,
          { [editedKey]: values[editedKey], email: values.email },
          {
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            toast.success(response.data.message);
            // Update auth.user.fullname if necessary
            auth.setUser({
              ...auth.user,
              fullname: updatedUserData.full_name,
              email: updatedUserData.email,
            });
            formik.resetForm(updatedUserData);
            setUserData((userData) => ({ ...userData, ...updatedUserData }));
            // Set isEditing to false for the edited field
            setIsEditing((prevState) => ({
              ...prevState,
              [editedKey]: false,
            }));
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error(
            (err?.message ?? err?.data?.message) || "Something went wrong!"
          );
        });
    },
  });

  useEffect(() => {
    const getUserData = (userEmail) => {
      setLoading(true);

      baseAxios
        .post(
          `${apiURL}/auth/getuser`,
          { email: userEmail },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((response) => {
          setUserData({
            ...userData,
            ...response?.data?.data,
            image: response?.data?.data?.profile_picture_url,
          });
          setIsEmailNotificationsConfirmtionModal((pre) => ({
            ...pre,
            email_notifications:
              response?.data?.data?.email_notifications ?? false,
            email: response?.data?.data?.email,
          }));
        })
        .catch((err) => {
          console.log(err);
          toast.error(
            (err?.message ?? err?.data?.message) || "Something went wrong!"
          );
        })
        .finally(() => {
          setLoading(false);
        });
    };
    const userEmail = auth?.user?.email;
    if (!!userEmail) getUserData(userEmail);
  }, [auth]);

  useEffect(() => {
    const fetchAvailableLanguages = async () => {
      setLangLoading(true);
      setLoading(true);
      try {
        const response = await axios.get(`/auth/get-available-languages`);
        setAvailableLanguages(response.data.data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLangLoading(false);
      }
    };
    const userEmail = auth?.user?.email;
    if (!!userEmail) fetchAvailableLanguages();
  }, [auth]);

  // useEffect(() => {
  //     console.log("profile auth", auth);
  //     if (auth && auth.user !== null && auth.user.email != null) {
  //         let user_email = auth.user.email;
  //         // setEmail(user_email);
  //         setUserData({ ...userData, email: user_email });
  //         setLoading(false);
  //     } else {
  //         router.push("/");
  //     }
  // }, []);

  const toggleEditMode = (key) => {
    // Check if any field is currently in edit mode
    const anyEditing = Object.values(isEditing).some((editing) => editing);

    if (anyEditing) {
      // If any field is already in edit mode, open a confirmation modal
      const newFieldTitle = accountData.find((detail) => detail.id === key);
      if (newFieldTitle !== -1) setTryToEditField(newFieldTitle.title);
      setConfirmModalOpen(true);
    } else {
      // Toggle edit mode for the specified key
      setIsEditing((prevState) => {
        const updatedState = {};
        // Set only the specified key to true for edit mode, all others to false
        Object.keys(prevState).forEach((stateKey) => {
          updatedState[stateKey] = stateKey === key;
        });
        return updatedState;
      });
    }
  };

  const handleCancelEdit = (key) => {
    setIsEditing((prevState) => ({
      ...prevState,
      [key]: false,
    }));
  };

  const updateHandler = useCallback(
    (key, anyTrue) => {
      setshowEdit({ ...showEdit, key: false });
      const isEdit = isEditing[key];
      if (isEdit || anyTrue) {
        formik.handleSubmit(key);
      } else {
        toggleEditMode(key);
      }
    },
    [isEditing, formik]
  );

  const deleteAccountHandler = useCallback(() => {
    setIsDeletingAccount(true);
    axios
      .delete("/auth/delete-account-by-id", { data: { user_id: userData._id } })
      .then((response) => {
        toast.success(response.data.message);
        auth.logout();
        router.push("/");
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setIsDeleteModalOpen(false);
        setIsDeletingAccount(false);
      });
  }, [userData]);

  const Reset_Workspace_Chat_Group = () => {
    localStorage.removeItem("workspace_name");
    localStorage.removeItem("workspace_id");
    localStorage.removeItem("group");
    localStorage.removeItem("enstine_auth");

    dispatch(setActiveChat({}));
    dispatch(setCurrentActiveGroup({}));

    // Alternatively, you can refetch specific endpoints if necessary
    dispatch(workspaceApi.util.invalidateTags(["workspace-list"]));
    dispatch(
      chatApi.util.invalidateTags([
        "group-list",
        "history-chat-by-workspace-id",
      ])
    );
  };

  const logoutHandler = useCallback(() => {
    auth.logout();
    setConfirmModalOpen(false);
    Reset_Workspace_Chat_Group();
    localStorage.clear()
    window.location.href = "/";
    // router.push("/");
    //   setTimeout(() => {
  //     window.location.reload();
  //   }, 500);
  }, []);

  const logoutConfirmModalHandler = useCallback(() => {
    setIsLogoutConfirmModal(true);
    setConfirmModalOpen(true);
  }, []);

  const accountData = useMemo(() => {
    let langLabel = "N/A";
    const lang = availableLanguages.find(
      (option) => option.id === userData.language
    );
    if (lang) {
      langLabel = lang.name;
    }
    return [
      {
        id: "full_name",
        title: "Name",
        value: userData.full_name,
        shouldDisplayValue: true,
        action: [
          {
            title: "Change Name",
            onClick: () => updateHandler("full_name"),
            type: "primary",
            updateTitle: "Update name",
            inputType: "input",
          },
        ],
      },
      {
        id: "email",
        title: "Email",
        value: userData.email,
        isUnderline: true,
        shouldDisplayValue: true,
        action: [
          {
            title: "Change email",
            onClick: () => updateHandler("email"),
            type: "primary",
            updateTitle: "Update email",
            inputType: "input",
          },
        ],
      },
      {
        id: "job_title",
        title: "Job title",
        value: userData.job_title,
        shouldDisplayValue: true,
        action: [
          {
            title: "Change job title",
            onClick: () => updateHandler("job_title"),
            type: "primary",
            updateTitle: "Update job title",
            inputType: "input",
          },
        ],
      },
      {
        id: "password",
        title: "Password",
        value: "",
        shouldDisplayValue: false,
        action: [
          {
            title: "Change password",
            onClick: () => updateHandler("password"),
            type: "primary",
            updateTitle: "Update password",
            inputType: "password",
          },
          {
            title: "Enable two-factor authentication",
            onClick: () => updateHandler("authentication"),
            type: "primary",
          },
        ],
      },
      {
        id: "language",
        title: "Language",
        displayValue: langLabel,
        value: userData?.language,
        shouldDisplayValue: true,
        action: [
          {
            title: "Change language",
            onClick: () => updateHandler("language"),
            type: "primary",
            updateTitle: "Update language",
            inputType: "autoComplete",
            options: availableLanguages,
            placeholder: "Select an language",
          },
        ],
      },
      {
        id: "unique_handle",
        title: "Unique handle",
        value: userData.unique_handle,
        shouldDisplayValue: true,
        action: [
          {
            title: "Change handle",
            onClick: () => updateHandler("unique_handle"),
            type: "primary",
            updateTitle: "Update handle",
            inputType: "input",
          },
        ],
      },
      {
        id: "followers",
        title: "Followers",
        value: userData?.followers,
        shouldDisplayValue: false,
        action: [
          {
            title: "Change handle",
            onClick: () => updateHandler("followers"),
            type: "primary",
          },
        ],
      },
      {
        id: "deletedChats",
        title: "Deleted Chats",
        value: userData?.deletedChats,
        shouldDisplayValue: false,
        action: [
          {
            title: "Chats",
            onClick: () => updateHandler("deletedChats"),
            type: "primary",
          },
        ],
      },
      {
        id: "emailNotifications",
        title: "Email Notifications",
        value: isEmailNotificationsConfirmtionModal?.email_notifications,
        shouldDisplayValue: false,
        action: [
          {
            title: `${
              isEmailNotificationsConfirmtionModal?.email_notifications
                ? "Enable"
                : "Disable"
            }`,
            onClick: () =>
              setIsEmailNotificationsConfirmtionModal((prev) => ({
                ...prev,
                open: true,
              })),
            type: "primary",
          },
        ],
      },
      {
        id: "deleteAccount",
        title: "Account",
        value: userData.plan,
        shouldDisplayValue: false,
        action: [
          {
            title: "Logout",
            onClick: logoutConfirmModalHandler,
            type: "primary",
          },
          {
            title: isDeletingAccount ? "Deleting account" : "Delete account",
            onClick: () => setIsDeleteModalOpen(true),
            type: "danger",
            isLoading: isDeletingAccount,
          },
        ],
      },
    ];
  }, [
    userData,
    availableLanguages,
    updateHandler,
    deleteAccountHandler,
    setIsDeleteModalOpen,
    isEmailNotificationsConfirmtionModal?.email_notifications,
  ]);

  const confirmHandler = () => {
    // Handle confirmation to switch to edit mode
    setIsEditing((prevState) => {
      const updatedState = {};
      // Set all keys to false for edit mode
      Object.keys(prevState).forEach((stateKey) => {
        updatedState[stateKey] = false;
      });
      return updatedState;
    });
    formik.resetForm();
    setConfirmModalOpen(false);
  };

  const handleUpload = (image) => {
    setUserData((userData) => ({ ...userData, image }));
    // Close modal after upload
    setIsProfilePicModalOpen(false);
    baseAxios
      .post(`${apiURL}/auth/update`, {
        profile_picture_url: image,
        email: userData.email,
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          let updatedUserData = {
            ...userData,
            profile_picture_url: image,
          };
          toast.success(response?.data?.message);
          auth.setUser({ ...auth.user, profile_picture_url: image });
          formik.resetForm(updatedUserData);
          setUserData((userData) => ({ ...userData, ...updatedUserData }));
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(
          (err?.message ?? err?.data?.message) || "Something went wrong!"
        );
      });
  };

  return (
    <div className="max-w-[865px] pb-12 w-full mx-auto px-1.5 flex flex-col lg:justify-normal min-[1800px]:justify-center">
      <Modal
        key="confirmation-modal"
        size={"md"}
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        classNames={{
          base: "text-white",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {isLogoutConfirmModal ? `Logout Confirmation` : `Save Changes`}
              </ModalHeader>
              <ModalBody>
                {isLogoutConfirmModal ? (
                  <p>
                    Are you sure <strong>{auth?.user?.fullname}</strong> want to
                    logout?
                  </p>
                ) : (
                  <p>
                    Are you sure you want to switch to editing{" "}
                    <strong>{tryToEditField}</strong>? Your previous changes
                    will not be saved.
                  </p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="success"
                  onPress={
                    isLogoutConfirmModal ? logoutHandler : confirmHandler
                  }
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <UploadProfilePictureModal
        isOpen={isProfilePicModalOpen}
        onClose={() => setIsProfilePicModalOpen(false)}
        onUpload={handleUpload}
      />
      <DeleteAccountConfirmtionModal
        isOpen={isDeleteModalOpen}
        userData={userData}
        onConfirm={deleteAccountHandler}
        onClose={() => setIsDeleteModalOpen(false)}
      />
      <EmailNotificationsConfirmtionModal
        isEmailNotificationsConfirmtionModal={
          isEmailNotificationsConfirmtionModal
        }
        setIsEmailNotificationsConfirmtionModal={
          setIsEmailNotificationsConfirmtionModal
        }
      />
      {loading ? (
        <div
          key="loader-state"
          className="w-full h-screen flex justify-center  items-center"
        >
          <Spinner label="Loading..." color="success" labelColor="success" />
        </div>
      ) : (
        userData && (
          <>
            <div
              key="loaded-state"
              className="flex gap-9 items-start  mt-24 text-white "
            >
              <div
                className="relative flex items-center flex-col justify-center"
                onMouseEnter={() => setshowEdit({ ...showEdit, logo: true })}
                onMouseLeave={() => setshowEdit({ ...showEdit, logo: false })}
              >
                <div
                  onClick={() => setIsProfilePicModalOpen(true)}
                  className={`${
                    showEdit.logo && "blur-sm"
                  } w-32 h-32 rounded-full shadow-[0px_0px_2.62px_0px_#0000001A] custom-gradient flex justify-center items-center`}
                  // onMouseEnter={() => setshowEdit({ ...showEdit, logo: true })}
                  // onMouseLeave={() => setshowEdit({ ...showEdit, logo: false })}
                  // onClick={() => setIsProfilePicModalOpen(true)}
                >
                  {userData?.image ? (
                    <Image
                      src={userData?.image}
                      alt="profile-pic"
                      key="userImage"
                      width={128}
                      height={128}
                      className="rounded-full bg-cover h-full w-full object-cover"
                    />
                  ) : !userData?.full_name ? (
                    <Image
                      src={profile}
                      alt="profile-pic"
                      key="userNameImage"
                      width={53}
                      height={68}
                    />
                  ) : (
                    <p className="  text-5xl text-[#E9ECEF] font-helvetica font-medium leading-normal">
                      {userData.full_name?.at(0)?.toUpperCase()}
                    </p>
                  )}
                </div>
                {showEdit.logo && (
                  <Image
                    src={"/svg/edit_icon_white.svg"}
                    className="absolute top-11 cursor-pointer"
                    width={32}
                    height={32}
                    onClick={() => setIsProfilePicModalOpen(true)}
                  />
                )}
                {/* <Button
              className="bg-transparent helvetica-font text-white p-0 m-0"
              onClick={() => setIsProfilePicModalOpen(true)}
            >
              Edit
            </Button> */}
              </div>
              <div className="flex flex-col justify-between h-[112px]">
                <h6 className="text-base font-bold text-[#D0D0D0] helvetica-font">
                  {" "}
                  Name
                </h6>
                <div
                  className="flex items-baseline gap-4"
                  onMouseEnter={() =>
                    setshowEdit({ ...showEdit, full_name: true })
                  }
                  onMouseLeave={() =>
                    setshowEdit({ ...showEdit, full_name: false })
                  }
                >
                  <p
                    className={`text-[64px] font-normal ${
                      isEditing["full_name"] ? "hidden" : "block"
                    }`}
                  >
                    {userData?.full_name}
                  </p>

                  {/* <div
                    className=""
                   
                  > */}
                  {showEdit.full_name && (
                    <Image
                      onClick={() => updateHandler("full_name")}
                      src={"/svg/edit-icon.svg"}
                      className={`inline  cursor-pointer ${
                        isEditing["full_name"] ? "hidden" : "block"
                      }`}
                      width={32}
                      height={32}
                    />
                  )}
                  {/* </div> */}

                  {/* {userDetail.id === "full_name" && ( */}
                  <div className="relative flex items-center gap-2">
                    <Input
                      name={"full_name"}
                      type="text"
                      value={formik.values["full_name"]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      style={{
                        width: "271px",
                        backgroundColor: "#232323",
                      }}
                      className={`profile-input ${
                        isEditing["full_name"] ? "block" : "hidden"
                      }`}
                      height={40}
                      radius="lg"
                      classNames={{
                        label: "text-white",
                        input: [
                          "bg-[#232323]",
                          "text-black/90 dark:text-white/90",
                        ],
                        innerWrapper: [
                          "bg-[#232323]",
                          "data-[hover=true]:bg-[#232323]",
                          "group-data-[focus=true]:bg-[#232323]",
                        ],
                      }}
                    />
                    {/* {index === 0 && ( */}
                    <XCircleIcon
                      className={`h-6 w-6 text-[#E99A8B] cursor-pointer absolute -right-14 top-2  ${
                        isEditing["full_name"] ? "block" : "hidden"
                      }`}
                      onClick={() => handleCancelEdit("full_name")}
                    />
                    {/* )} */}

                    {/* {showEdit.full_name &&
              (isEditing["full_name"] ? ( */}
                    <Image
                      src={"/check.png"}
                      className={`absolute right-[-20px] top-3.5 cursor-pointer ${
                        isEditing["full_name"] ? "block" : "hidden"
                      }`}
                      width={13}
                      height={13}
                      onClick={() => updateHandler("full_name")}
                    />
                  </div>
                  {/* )} */}
                </div>
              </div>
            </div>
            <div className="border-b-1 my-10 border-[#3C3C3C]"></div>
            <div className=" flex flex-col gap-y-10">
              <div className="flex items-center text-white gap-x-5 w-[500px]">
                <p className="w-[150px] text-base font-bold text-[#D0D0D0] helvetica-font">
                  Email
                </p>
                <div
                  className="relative flex items-center gap-2"
                  onMouseEnter={() => setshowEdit({ ...showEdit, email: true })}
                  onMouseLeave={() =>
                    setshowEdit({ ...showEdit, email: false })
                  }
                >
                  {/* <Input
              style={{ width: "271px" }}
              height={40}
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
            /> */}
                  <Input
                    disabled={!isEditing["email"]}
                    name={"email"}
                    type="text"
                    value={formik.values["email"]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={{ width: "271px", backgroundColor: "#232323" }}
                    className="profile-input"
                    height={40}
                    radius="lg"
                    classNames={{
                      label: "text-white",
                      input: [
                        "bg-[#232323]",
                        "text-black/90 dark:text-white/90",
                      ],
                      innerWrapper: [
                        "bg-[#232323]",
                        "data-[hover=true]:bg-[#232323]",
                        "group-data-[focus=true]:bg-[#232323]",
                      ],
                    }}
                  />
                  {showEdit.email &&
                    (isEditing["email"] ? (
                      ""
                    ) : (
                      <Image
                        src={"/svg/edit-icon.svg"}
                        className="absolute right-3 top-3.5 cursor-pointer"
                        width={13}
                        height={13}
                        onClick={() => updateHandler("email")}
                      />
                    ))}
                  {isEditing["email"] && (
                    <>
                      {" "}
                      <Image
                        src={"/check.png"}
                        // className="absolute right-3 top-3.5 cursor-pointer"
                        className="absolute right-[-20px] top-3.5 cursor-pointer"
                        width={13}
                        height={13}
                        onClick={() => updateHandler("email")}
                      />
                      <XCircleIcon
                        className={`h-6 w-6 text-[#E99A8B] cursor-pointer absolute -right-14 top-2  ${
                          isEditing["email"] ? "block" : "hidden"
                        }`}
                        onClick={() => handleCancelEdit("email")}
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center text-white gap-x-5 w-[500px]">
                <p className="w-[150px] text-base font-bold text-[#D0D0D0] helvetica-font">
                  Job Title
                </p>
                <div
                  className="relative flex  items-center gap-2"
                  onMouseEnter={() =>
                    setshowEdit({ ...showEdit, job_title: true })
                  }
                  onMouseLeave={() =>
                    setshowEdit({ ...showEdit, job_title: false })
                  }
                >
                  {/* <Input
              style={{ width: "271px" }}
              height={40}
              value={userData.job_title}
              onChange={(e) =>
                setUserData({ ...userData, job_title: e.target.value })
              }
            /> */}
                  <Input
                    disabled={!isEditing["job_title"]}
                    name={"job_title"}
                    type="text"
                    value={formik.values["job_title"]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={{ width: "271px" }}
                    className="profile-input"
                    height={40}
                    radius="lg"
                    classNames={{
                      label: "text-white",
                      input: [
                        "bg-[#232323]",
                        "text-black/90 dark:text-white/90",
                      ],
                      innerWrapper: "bg-[#232323]",
                    }}
                  />
                  {/* {showEdit.job_title &&
                      (isEditing["job_title"] ? (
                        <Image
                          src={"/check.png"}
                          className="absolute right-3 top-3.5 cursor-pointer"
                          width={13}
                          height={13}
                          onClick={() => updateHandler("job_title")}
                        />
                      ) : (
                        <Image
                          src={"/svg/edit-icon.svg"}
                          className="absolute right-3 top-3.5 cursor-pointer"
                          width={13}
                          height={13}
                          onClick={() => updateHandler("job_title")}
                        />
                      ))} */}
                  {showEdit.job_title &&
                    (isEditing["job_title"] ? (
                      ""
                    ) : (
                      <Image
                        src={"/svg/edit-icon.svg"}
                        className="absolute right-3 top-3.5 cursor-pointer"
                        width={13}
                        height={13}
                        onClick={() => updateHandler("job_title")}
                      />
                    ))}
                  {isEditing["job_title"] && (
                    <>
                      {" "}
                      <Image
                        src={"/check.png"}
                        // className="absolute right-3 top-3.5 cursor-pointer"
                        className="absolute right-[-20px] top-3.5 cursor-pointer"
                        width={13}
                        height={13}
                        onClick={() => updateHandler("job_title")}
                      />
                      <XCircleIcon
                        className={`h-6 w-6 text-[#E99A8B] cursor-pointer absolute -right-14 top-2  ${
                          isEditing["job_title"] ? "block" : "hidden"
                        }`}
                        onClick={() => handleCancelEdit("job_title")}
                      />
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center text-white gap-x-5 w-[500px]">
                <p className="w-[150px] text-base font-bold text-[#D0D0D0] helvetica-font">
                  password
                </p>
                <div
                  className={`relative flex ${
                    isEditing["password"] ? "w-[64.9%]" : "w-[59%]"
                  }  pass-input items-center gap-2`}
                  onMouseEnter={() =>
                    setshowEdit({ ...showEdit, password: true })
                  }
                  onMouseLeave={() =>
                    setshowEdit({ ...showEdit, password: false })
                  }
                >
                  {/* <Input
              style={{ width: "271px", paddingRight: "20px" }}
              height={40}
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
              type="password"
            /> */}
                  <Input
                    disabled={!isEditing["password"]}
                    name={"password"}
                    value={formik.values["password"]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your password"
                    //   size="sm"
                    radius="lg"
                    classNames={{
                      label: "text-white",
                      input: [
                        "bg-[#232323]",
                        "text-black/90 dark:text-white/90",
                      ],
                      innerWrapper: "bg-[#232323]",
                    }}
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={togglePasswordVisibility}
                      >
                        {isPasswordVisible ? (
                          <EyeIcon className="h-4 w-4 text-[#D0D0D0]" />
                        ) : (
                          <EyeSlashIcon className="h-4 w-4 text-[#D0D0D0]" />
                        )}
                      </button>
                    }
                    type={isPasswordVisible ? "text" : "password"}
                    className="max-w-xs profile-input"
                  />
                  {/* {showEdit.password &&
                      (isEditing["password"] ? (
                        <Image
                          src={"/check.png"}
                          className="absolute right-8 top-3 cursor-pointer"
                          width={13}
                          height={13}
                          onClick={() => updateHandler("password")}
                        />
                      ) : (
                        <Image
                          src={"/svg/edit-icon.svg"}
                          className="absolute right-8 top-3 cursor-pointer"
                          width={13}
                          height={13}
                          onClick={() => updateHandler("password")}
                        />
                      ))} */}

                  {showEdit.password &&
                    (isEditing["password"] ? (
                      ""
                    ) : (
                      <Image
                        src={"/svg/edit-icon.svg"}
                        className="absolute right-3 top-3.5 cursor-pointer"
                        width={13}
                        height={13}
                        onClick={() => updateHandler("password")}
                      />
                    ))}
                  {isEditing["password"] && (
                    <>
                      {" "}
                      <Image
                        src={"/check.png"}
                        // className="absolute right-3 top-3.5 cursor-pointer"
                        className="absolute right-[-20px] top-3.5 cursor-pointer"
                        width={13}
                        height={13}
                        onClick={() => updateHandler("password")}
                      />
                      <XCircleIcon
                        className={`h-6 w-6 text-[#E99A8B] cursor-pointer absolute -right-14 top-2  ${
                          isEditing["password"] ? "block" : "hidden"
                        }`}
                        onClick={() => handleCancelEdit("password")}
                      />
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center text-white gap-x-5 w-[500px] ">
                <p className="w-[150px] text-base font-bold text-[#D0D0D0] helvetica-font">
                  language
                </p>
                <div className="w-[59%] language-dropdown">
                  {accountData?.map((userDetail, i) => {
                    return userDetail?.action.map((action, index) => {
                      // Check if the action is of inputType "autoComplete"
                      if (action?.inputType === "autoComplete") {
                        return (
                          <Autocomplete
                            key={action?.id || index} // Ensure a unique key is provided for each item
                            name={userDetail?.id}
                            placeholder={action?.placeholder}
                            inputProps={{
                              classNames: {
                                inputWrapper: "bg-[#232323]",
                                width: "271px",
                                height: "40px",
                              },
                            }}
                            size="sm"
                            radius="sm"
                            onSelectionChange={async (value) => {
                              formik.setFieldValue(userDetail.id, value);
                              formik.setFieldTouched(userDetail.id, true);
                              if (value != formik?.values?.language) {
                                setIsEditing({
                                  ...isEditing,
                                  language: true,
                                });
                                await updateHandler("language", true);
                              }
                            }}
                            onBlur={formik.handleBlur}
                            selectedKey={formik.values[userDetail.id]}
                          >
                            {action?.options?.map((language) => (
                              <AutocompleteItem
                                key={language?.id}
                                value={language?.id}
                                className="text-white"
                              >
                                {language?.name}
                              </AutocompleteItem>
                            ))}
                          </Autocomplete>
                        );
                      }
                    });
                  })}
                </div>
              </div>
            </div>
            <div className="border-b-1 mt-10 mb-1 border-[#3C3C3C]"></div>
            <div className="flex items-center justify-between text-white gap-x-5  mt-0">
              <Button
                className="bg-transparent text-sm font-bold"
                onClick={logoutConfirmModalHandler}
              >
                Logout
              </Button>
              <Button
                className="bg-transparent text-[#E99A8B] text-sm font-bold"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                Delete Account
              </Button>
            </div>
            <ToastService />
          </>
        )
      )}
    </div>
  );
};

export default Account;
