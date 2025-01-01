// Registration Form Component
"use client"

import React, { useState } from "react";
import passwordValidator from "password-validator";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { apiURL } from "@/config";
import { useAuth } from "../authContext/auth";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import UserIcon from "@/app/assets/svg/UserMake.svg";
import LockIcon from "@/app/assets/svg/lock-key.svg";
import MailIcon from "@/app/assets/svg/mail.svg";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import useBoolean from "../hooks/useBoolean";
import { useAppDispatch } from "../lib/hooks";
import { setActiveChat } from "../lib/features/chat/chatSlice";
import { setCurrentActiveGroup } from "../lib/features/chat/groupSlice";
import { setActiveWorkspace } from "../lib/features/workspace/workspaceSlice";
import { workspaceApi } from "../lib/features/workspace/workspaceApi";
import { chatApi } from "../lib/features/chat/chatApi";
import HandleLocalStorageState from "../utils/localStorage/localStorageState";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import ToastService from "@/components/Toaster/toastService";

const RegistrationForm = ({ onClose, LoginWithGoogle }) => {
  const auth = useAuth();
  const [formErrors, setFormErrors] = useState({});
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [userData, setUserData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const [submitted, setSubmitted] = useState(false); // Track form submission

  const { value: isPasswordVisible, toggle: togglePasswordVisibility } = useBoolean(false);

  const { value: isConfirmPasswordVisible, toggle: toggleConfirmPasswordVisibility } = useBoolean(false);

  const schema = new passwordValidator();

  // Add properties to it
  schema
    .is()
    .min(8) // Minimum length 8
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .symbols();

  // Signup Logic Functions
  const ValidateEmail = (email) => {
    let validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return email.match(validRegex);
  };

  const validateForm = () => {
    if (userData.fullname == "") {
      toast.error("Username is required.");
      return false;
    } else if (userData.fullname.trim().length < 3) {
      toast.error("Full Name must be at least 3 characters long.");
      return false;
    }

    if (!userData.email.trim()) {
      toast.error("Email is required.");
      return false;
    } else if (!ValidateEmail(userData.email)) {
      toast.error("Email is invalid.");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      toast.error("Invalid Email.");
      return false;
    }
    if (!userData.password.trim()) {
      toast.error("Password is required.");
      return false;
    } else if (!schema.validate(userData.password)) {
      toast.error("Password must contain at least 8 characters including uppercase letters, lowercase letters, special characters, and digits. For example: MyP@ssw0rd, 123$Secure, StrongPass#99.");
      return false;
    }
    if (!userData.confirmpassword.trim()) {
      toast.error("Confirm Password is required");
      return false;
    } else if (userData.confirmpassword !== userData.password) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  const GetShareChatLink = (token) => {
    const chatshare_chat_token = HandleLocalStorageState('share_chat_token', "", "get");
    if (chatshare_chat_token) {
      const body = { token: chatshare_chat_token };

      axios.post(`${apiURL}/auth/token`, body, { headers: { "Authorization": `Bearer ${token}` } })
        .then((response) => {
          HandleLocalStorageState('share_chat_token', "", "remove");
        })
        .catch((err) => {
          console.log("####_error_#### ", err);
        toast.error((err?.message ??  err?.data?.message) || "Something went wrong!")

        })
    }
  };

  const OnSuccessfullyRegistered = (token) => {
    GetShareChatLink(token);
    localStorage.removeItem("workspace_name");
    localStorage.removeItem("workspace_id");
    localStorage.removeItem("group");

    dispatch(setActiveChat({}));
    dispatch(setCurrentActiveGroup({}));
    dispatch(setActiveWorkspace({}));
    dispatch(workspaceApi.util.invalidateTags(['workspace-list']));
    dispatch(chatApi.util.invalidateTags(['group-list', 'history-chat-by-workspace-id']));
  };

  const SignUp = (userData) => {
    if (auth && auth.user && auth.user.userID && auth.user.plan == "free") {
      userData.id = auth.user.userID;
      userData.plan = "free";
    } else {
      userData.id = "";
      userData.plan = "free";
    }
    setSubmitted(true);
    axios
      .post(`${apiURL}/auth/signup`, userData, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        if (response.status === 200) {
          toast.success(response?.data?.message);
          setTimeout(() => {
            if (response.data.status) {
              axios.post(`${apiURL}/auth/token`, { username: userData?.email ?? "", password: userData?.password ?? "" }, { headers: { "accept": "application/json", "Content-Type": "application/x-www-form-urlencoded" } })
                .then((resp) => {
                  const token = resp?.data?.access_token;
                  auth.login({
                    userID: response.data.data.user_id,
                    email: response.data.data.email,
                    token,
                    fullname: response.data.data.name,
                    plan: response.data.data.plan ? response.data.data.plan : null,
                    price: response.data.data.price,
                    visitor_id: response.data.data.visitor_id,
                  });
                  OnSuccessfullyRegistered(token);
                  window.location.href = "/";
                  // router.push("/");
                  // setTimeout(() => {
                  //   window.location.reload(); // Reload only after redirect
                  // }, 500);
                })
                .catch((err) => {
                  console.error("Error get token :", err);
        toast.error((err?.message ??  err?.data?.message) || "Something went wrong!")

                });
            }
          }, 2000); // 3000 milliseconds = 3 seconds
        } else {
          toast.error(response?.data?.message);
        }
      })
      .catch((error) => {
        if (error?.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Server error:", error?.response?.data);
          toast.error(error?.response?.data?.message);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response from server:", error?.request);
          toast.error("No response from server");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error:", error?.message);
          toast.error("An error occurred: " + error?.message);
        }
      });
  };

  const handleInputChange = (e) => {
    // validateForm(userData);
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      SignUp(userData);
    }
  };

  const [password1, setPassword1] = useState("");

  return (
    <Card className="max-w-[421px] w-full shadow-modal bg-[#171717] rounded-[22px]">
      <form onSubmit={handleSubmit}>
        <CardHeader className="p-[19px]">
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-1.5">
              <Image
                src="togl.svg"
                width={25.9}
                height={16.8}
                alt="logo"
              />
              <p className="font-nasalization font-normal text-xl">Togl</p>
            </div>
            <XMarkIcon className="w-5 h-5 text-white cursor-pointer" onClick={onClose} />
          </div>
        </CardHeader>
        <CardBody className="px-[18px]">
          <div className="text-center">
            <h1 className="font-semibold text-[43px] text-white capitalize font-helvetica">Create account</h1>
            <p className="text-[11px] font-normal mt-0.5 capitalize font-helvetica">We Will never share your information with anyone.</p>
          </div>
          <div className="flex flex-col gap-[15px]">
            <div className="flex flex-col mt-10">
              <Input
                type="text"
                placeholder="Username"
                name="fullname"
                value={userData.fullname}
                onChange={handleInputChange}
                classNames={{
                  input: [
                    "placeholder:text-[#818181]",
                    "placeholder:font-normal",
                    "text-[16px]",
                    "font-normal",
                    "font-helvetica",
                    "pl-[12px]"
                  ],
                  base:'bg-[#0D0D0D] rounded-[5px] py-1',
                  inputWrapper: [
                    "bg-[#0D0D0D]",
                    "data-[hover=true]:bg-[#0D0D0D]",
                    "group-data-[focus=true]:bg-[#0D0D0D]",
                  ]
                }}
                startContent={
                  <UserIcon className={`text-2xl pointer-events-none flex-shrink-0 ${formErrors.email ? "text-red-700" : "text-[#B0B0B0]"}`} />
                }
              />
            </div>
            <div className="flex flex-col mt-0">
              <Input
                type="email"
                placeholder="Email Address"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                classNames={{
                  input: [
                    "placeholder:text-[#818181]",
                    "placeholder:font-normal",
                    "text-[16px]",
                    "font-normal",
                    "font-helvetica",
                    "pl-[12px]"
                  ],
                  base:'bg-[#0D0D0D] rounded-[5px] py-1',
                  inputWrapper: [
                    'bg-[#0D0D0D]',
                    "data-[hover=true]:bg-[#0D0D0D]",
                    "group-data-[focus=true]:bg-[#0D0D0D]",
                  ]
                }}
                startContent={
                  <MailIcon className="text-2xl pointer-events-none flex-shrink-0 text-[#B0B0B0]" />
                }
              />
            </div>
            <div className="flex flex-col mt-0">
              <Input
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={userData.password}
                onChange={(e) => {
                  handleInputChange(e);
                  setPassword1(e.target.value);
                }}
                classNames={{
                  input: [
                    "placeholder:text-[#818181]",
                    "placeholder:font-normal",
                    "text-[16px]",
                    "font-normal",
                    "font-helvetica",
                    "pl-[12px]"
                  ],
                  base:'bg-[#0D0D0D] rounded-[5px] py-1',
                  inputWrapper: [
                    "bg-[#0D0D0D]",
                    "data-[hover=true]:bg-[#0D0D0D]",
                    "group-data-[focus=true]:bg-[#0D0D0D]",
                  ]
                }}
                startContent={
                  <LockIcon className="text-2xl pointer-events-none flex-shrink-0 text-[#B0B0B0]" />
                }
                endContent={
                  isPasswordVisible ? <EyeSlashIcon className="h-4 w-4 cursor-pointer flex-shrink-0 text-[#B0B0B0]" onClick={togglePasswordVisibility} /> : <EyeIcon className="h-4 w-4 cursor-pointer flex-shrink-0 text-[#B0B0B0]" onClick={togglePasswordVisibility} />
                }
              />
            </div>
            <div>
              <Input
                type={isConfirmPasswordVisible ? "text" : "password"}
                name="confirmpassword"
                value={userData.confirmpassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                classNames={{
                  input: [
                    "placeholder:text-[#818181]",
                    "placeholder:font-normal",
                    "text-[16px]",
                    "font-normal",
                    "font-helvetica",
                    "pl-[12px]"
                  ],
                  base:'bg-[#0D0D0D] rounded-[5px] py-1',
                  inputWrapper: [
                    "bg-[#0D0D0D]",
                    "data-[hover=true]:bg-[#0D0D0D]",
                    "group-data-[focus=true]:bg-[#0D0D0D]",
                  ]
                }}
                startContent={
                  <LockIcon className="text-2xl pointer-events-none flex-shrink-0 text-[#B0B0B0]" />
                }
                endContent={
                  isConfirmPasswordVisible ? <EyeSlashIcon className="h-4 w-4 cursor-pointer flex-shrink-0 text-[#B0B0B0]" onClick={toggleConfirmPasswordVisibility} /> : <EyeIcon className="h-4 w-4 cursor-pointer flex-shrink-0 text-[#B0B0B0]" onClick={toggleConfirmPasswordVisibility} />
                }
              />
            </div>
          </div>
          <div className="flex flex-col mt-[37px] font-helvetica">
            <Button type="submit" className="bg-[#F8F8F8] text-[#131313] font-semibold text-base px-[50px] rounded-md w-[385px] h-[46px]">Create Account</Button>
          </div>
          <div className="flex items-center justify-center flex-col gap-2.5 mt-3">
            <p className="text-sm font-normal capitalize font-helvetica">Already have an account <Link className="text-[#3BADFF]" href="/signin">Sign In</Link></p>
            <Image
              alt="google icon"
              width={24}
              height={24}
              src="google.png"
              className="cursor-pointer"
              onClick={LoginWithGoogle}
            />
          </div>
        </CardBody>
      </form>
      <ToastService/>
    </Card>
  );
};
export default RegistrationForm;
