// Registration Form Component
"use client";

import React, { useEffect, useState } from "react";
import passwordValidator from "password-validator";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { apiURL } from "@/config";
import { useAuth } from "../authContext/auth";
import { Button, Card, CardBody, CardHeader, Input, Spinner } from "@nextui-org/react";
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
    checkbox: false,
  });
  const [submitted, setSubmitted] = useState(false); // Track form submission
  const [isMobile, setIsMobile] = useState(false);

  const { value: isPasswordVisible, toggle: togglePasswordVisibility } =
    useBoolean(false);

  const {
    value: isConfirmPasswordVisible,
    toggle: toggleConfirmPasswordVisibility,
  } = useBoolean(false);
 useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
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
      toast.error(
        "Password must contain at least 8 characters including uppercase letters, lowercase letters, special characters, and digits. For example: MyP@ssw0rd, 123$Secure, StrongPass#99."
      );
      return false;
    }
    if (!userData.confirmpassword.trim()) {
      toast.error("Confirm Password is required");
      return false;
    } else if (userData.confirmpassword !== userData.password) {
      toast.error("Passwords do not match");
      return false;
    }
    if (!userData.checkbox) {
      toast.error("Please agree to terms and conditions");
      return false;
    }

    return true;
  };

  const GetShareChatLink = (token) => {
    const chatshare_chat_token = HandleLocalStorageState(
      "share_chat_token",
      "",
      "get"
    );
    if (chatshare_chat_token) {
      const body = { token: chatshare_chat_token };

      axios
        .post(`${apiURL}/auth/token`, body, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          HandleLocalStorageState("share_chat_token", "", "remove");
        })
        .catch((err) => {
          console.log("####_error_#### ", err);
          toast.error(
            (err?.message ?? err?.data?.message) || "Something went wrong!"
          );
        });
    }
  };

  const OnSuccessfullyRegistered = (token) => {
    localStorage.setItem("showTutorialPopup", true);
    GetShareChatLink(token);
    localStorage.removeItem("workspace_name");
    localStorage.removeItem("workspace_id");
    localStorage.removeItem("group");
    localStorage.removeItem("activeChatLocalStorage"); // removed prev activeChat during logout may be
    dispatch(setActiveChat({}));
    dispatch(setCurrentActiveGroup({}));
    dispatch(setActiveWorkspace({}));
    dispatch(workspaceApi.util.invalidateTags(["workspace-list"]));
    dispatch(
      chatApi.util.invalidateTags([
        "group-list",
        "history-chat-by-workspace-id",
      ])
    );
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
          setSubmitted(false);
          setTimeout(() => {
            if (response.data.status) {
              axios
                .post(
                  `${apiURL}/auth/token`,
                  {
                    username: userData?.email ?? "",
                    password: userData?.password ?? "",
                  },
                  {
                    headers: {
                      accept: "application/json",
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                  }
                )
                .then((resp) => {
                  const token = resp?.data?.access_token;
                  auth.login({
                    userID: response.data.data.user_id,
                    email: response.data.data.email,
                    token,
                    fullname: response.data.data.name,
                    plan: response.data.data.plan
                      ? response.data.data.plan
                      : null,
                    price: response.data.data.price,
                    visitor_id: response.data.data.visitor_id,
                  });
                  OnSuccessfullyRegistered(token);
                  localStorage.setItem("signup_process", "true");
                  window.location.href = "/subscription";
                  // router.push("/");
                  // setTimeout(() => {
                  //   window.location.reload(); // Reload only after redirect
                  // }, 500);
                })
                .catch((err) => {
                  console.error("Error get token :", err);
                  toast.error(
                    (err?.message ?? err?.data?.message) ||
                      "Something went wrong!"
                  );
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
      }).finally(() => {
        setSubmitted(false);
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

  return (
    <div className="flex h-screen w-full font-helvetica">
      <div className={`${isMobile ? "w-full" : "w-1/2" } flex items-center justify-center bg-white p-8 relative`}>
        <div className="fixed top-[30px] left-[20px]">
          <Image src="togl-icon.png" width={70} height={70} alt="logo" />
        </div>

        <div className="w-full max-w-sm">
          <form onSubmit={handleSubmit}>
            <h1 className="text-4xl font-bold mb-2 text-[#232323] ">Sign up</h1>
            <p className="text-gray-500 mb-6">
              Sign up to enjoy the feature of Revolutie
            </p>
            <div class="relative my-4">
              <input
                type="text"
                value={userData.fullname}
                onChange={handleInputChange}
                id="floating_outlined_fullname"
                name="fullname"
                class="block px-2.5 pb-2.5 pt-4 w-full text-base text-gray-900 bg-transparent rounded-lg border-2 border-[#D9D9D9] appearance-none dark:text-white dark:border-[#367AFF] dark:focus:border-[#367AFF] focus:outline-none focus:ring-0 focus:border-[#367AFF] peer"
                placeholder=" "
              />
              <label
                for="floating_outlined_fullname"
                class="absolute font-medium text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-[#367AFF] peer-focus:dark:text-[#367AFF] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Your Name
              </label>
            </div>
            <div class="relative my-4">
              <input
                type="text"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                id="floating_outlined_email"
                class="block px-2.5 pb-2.5 pt-4 w-full text-base text-gray-900 bg-transparent rounded-lg border-2 border-[#D9D9D9] appearance-none dark:text-white dark:border-[#367AFF] dark:focus:border-[#367AFF] focus:outline-none focus:ring-0 focus:border-[#367AFF] peer"
                placeholder=" "
              />
              <label
                for="floating_outlined_email"
                class="absolute font-medium text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-[#367AFF] peer-focus:dark:text-[#367AFF] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Email
              </label>
            </div>
            <div class="relative my-4">
              <input
                value={userData.password}
                onChange={handleInputChange}
                name="password"
                type={isPasswordVisible ? "text" : "password"}
                id="floating_outlined_password"
                class="block px-2.5 pb-2.5 pt-4 w-full text-base text-gray-900 bg-transparent rounded-lg border-2 border-[#D9D9D9] appearance-none dark:text-white dark:border-[#367AFF] dark:focus:border-[#367AFF] focus:outline-none focus:ring-0 focus:border-[#367AFF] peer"
                placeholder=" "
              />
              <div className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center">
                {isPasswordVisible ? (
                  <EyeSlashIcon
                    className="h-6 w-6 cursor-pointer flex-shrink-0 text-[#9A9A9A]"
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <EyeIcon
                    className="h-6 w-6 cursor-pointer flex-shrink-0 text-[#9A9A9A]"
                    onClick={togglePasswordVisibility}
                  />
                )}
              </div>

              <label
                for="floating_outlined_password"
                class="absolute font-medium text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-[#367AFF] peer-focus:dark:text-[#367AFF] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Password{" "}
              </label>
            </div>

            <div class="relative my-4">
              <input
                value={userData.confirmpassword}
                onChange={handleInputChange}
                name="confirmpassword"
                type={isConfirmPasswordVisible ? "text" : "password"}
                id="floating_outlined_confirm_password"
                class="block px-2.5 pb-2.5 pt-4 w-full text-base text-gray-900 bg-transparent rounded-lg border-2 border-[#D9D9D9] appearance-none dark:text-white dark:border-[#367AFF] dark:focus:border-[#367AFF] focus:outline-none focus:ring-0 focus:border-[#367AFF] peer"
                placeholder=" "
              />
              <div className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center">
                {isConfirmPasswordVisible ? (
                  <EyeSlashIcon
                    className="h-6 w-6 cursor-pointer flex-shrink-0 text-[#9A9A9A]"
                    onClick={toggleConfirmPasswordVisibility}
                  />
                ) : (
                  <EyeIcon
                    className="h-6 w-6 cursor-pointer flex-shrink-0 text-[#9A9A9A]"
                    onClick={toggleConfirmPasswordVisibility}
                  />
                )}
              </div>

              <label
                for="floating_outlined_confirm_password"
                class="absolute font-medium text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-[#367AFF] peer-focus:dark:text-[#367AFF] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Confirm Password{" "}
              </label>
            </div>
            <div className="flex justify-start pl-1 items-center my-4 gap-x-2">
          <input
    id="terms"
    type="checkbox"
    checked={userData.checkbox}
    onChange={(e) =>
      setUserData({ ...userData, checkbox: e.target.checked })
    }
    className="peer hidden"
  />
  <label
    htmlFor="terms"
    className={`
      w-[17px] h-[17px] rounded-sm cursor-pointer flex items-center justify-center
      border 
      ${userData.checkbox ? 'bg-blue-500 border-blue-500' : 'bg-transparent border-gray-300'}
    `}
  >
    {/* Optional checkmark (can be a ✓ or an SVG) */}
    {userData.checkbox && (
      <svg
        className="w-3 h-3 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    )}
  </label>

  <label htmlFor="terms" >
  <p className="text-[#818181] font-helvetica select-none">
              Agree to{" "}
              <a className="cursor-pointer text-[#3BADFF]">terms & services </a>{" "}
              & <a className="cursor-pointer text-[#3BADFF]">privacy policy</a>
            </p>
  </label>
          </div>
            <button
              type="submit"
              className="w-full bg-[#367AFF] text-white text-base py-2.5 rounded-lg font-semibold"
            >
              {submitted ? (
                    <Spinner size="sm" color="white" />
                  ) : (
                    "Sign up"
                  )}
              
            </button>
          </form>

          <div className="flex items-center text-center text-black my-5">
            <div className="flex-1 border-b-1.5 border-gray-300"></div>
            <span className="mx-2 text-gray-500 text-base">or</span>
            <div className="flex-1 border-b-1.5 border-gray-300"></div>
          </div>
          <button
            onClick={LoginWithGoogle}
            className="w-full flex items-center text-base text-[#232323] border-[#E6E8E7] justify-center border-2 py-3 rounded-lg font-semibold"
          >
            Continue with Google
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-4 h-4 ml-2"
            />
          </button>
          <p className="mt-4 text-center text-base  text-[#6C6C6C]">
            Already have an account?{" "}
            <Link href="/signin" className="text-[#367AFF] underline">
              Sign in
            </Link>
          </p>
         
        </div>
      </div>

      <div
        className={`${isMobile ? "hidden" : "w-1/2"} bg-cover bg-center`}
        style={{
          backgroundImage: "url(/svg/bg.svg)",
        }}
      ></div>
    </div>
  );
};
export default RegistrationForm;
