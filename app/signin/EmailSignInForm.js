"use client";
import InputField from "../ui/InputField";
import passwordValidator from "password-validator";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { apiURL } from "@/config";
import axios from "axios";
import { useAuth } from "../authContext/auth";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Spinner,
} from "@nextui-org/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import UserIcon from "@/app/assets/svg/UserMake.svg";
import LockIcon from "@/app/assets/svg/lock-key.svg";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import useBoolean from "../hooks/useBoolean";
import { setActiveWorkspace } from "../lib/features/workspace/workspaceSlice";
import { workspaceApi } from "../lib/features/workspace/workspaceApi";
import { chatApi } from "../lib/features/chat/chatApi";
import { setActiveChat } from "../lib/features/chat/chatSlice";
import { setCurrentActiveGroup } from "../lib/features/chat/groupSlice";
import { useAppDispatch } from "../lib/hooks";
import toast from "react-hot-toast";
import { Check } from "lucide-react";

function EmailSignInForm({ onClose, LoginWithGoogle }) {
  const auth = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const schema = new passwordValidator();
  const [KeepMeLoggedIn, setKeepMeLoggedIn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { value: isPasswordVisible, toggle: togglePasswordVisibility } =
    useBoolean(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  // Add properties to it
  schema
    .is()
    .min(8) // Minimum length 8
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .symbols();

  const OnLoginSuccess = () => {
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

  const SignIn = (logData) => {
    setIsLoading(true);
    axios
      .post(`${apiURL}/auth/signin`, logData, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        if (response.status === 201) {
          toast.error(response?.data?.message);
        }
        if (response.status === 200) {
          toast.success("Logged in successfully");
          setIsLoading(false);
          axios
            .post(
              `${apiURL}/auth/token`,
              {
                username: logData?.email ?? "",
                password: logData?.password ?? "",
              },
              {
                headers: {
                  accept: "application/json",
                  "Content-Type": "application/x-www-form-urlencoded",
                },
              }
            )
            .then((resp) => {
              if (response.status === 200) {
                auth.login({
                  userID: response?.data?.user_id,
                  email: response?.data?.email,
                  token: resp?.data?.access_token ?? "",
                  fullname: response?.data.name,
                  plan: response?.data?.plan ? response?.data?.plan : null,
                  price: response?.data?.price,
                  visitor_id: response?.data?.visitor_id,
                });
                OnLoginSuccess();
                // router.push("/");
                // setTimeout(() => {
                //   window.location.reload(); // Reload only after redirect
                // }, 1000);
                if (response?.data?.plan === "paid") {
                  window.location.href = "/";
                } else {
                  window.location.href = "/subscription";
                }
              }
            })
            .catch((error) => {
              console.error("Error get token :", error);
              toast.error(
                (error?.message ?? error?.data?.message) ||
                  "Something went wrong!"
              );
            });
        }
      })
      .catch((error) => {
        console.error("Error signing in:", error);
        toast.error(
          (error?.response?.data?.message ?? error?.data?.message) ||
            "Something went wrong!"
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const validateForm = () => {
    if (email == "") {
      toast.error("Email is required.");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Invalid Email.");
      return false;
    }

    if (password === "") {
      toast.error("Password is required.");
      return false;
    }
    // else
    // if (!schema.validate(password)) {
    //   errors.password =
    //     "Password must contain at least 8 characters including uppercase letters, lowercase letters, special characters, and digits. For example: MyP@ssw0rd, 123$Secure, StrongPass#99";
    // }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const logData = { email, password }; // If it's a username

      SignIn(logData);
    }
  };

  return (
    // <Card className="max-w-[421px] w-full shadow-modal bg-[#171717] rounded-[22px]">
    //   <form onSubmit={handleSubmit} >
    //     <CardHeader className="p-[19px]">
    //       <div className="flex justify-between items-center w-full">
    //         <div className="flex gap-1.5">
    //           <Image
    //              src="togl.svg"
    //              width={25.9}
    //              height={16.8}
    //             alt="logo"
    //           />
    //           <p className="font-nasalization font-normal text-xl">Togl</p>
    //         </div>
    //         <XMarkIcon className="w-5 h-5 text-white cursor-pointer" onClick={onClose} />
    //       </div>
    //     </CardHeader>
    //     <CardBody className="px-[18px]">
    //       <div className="text-center">
    //         <h1 className="font-helvetica font-semibold text-[43px] text-white capitalize">Sign in</h1>
    //         <p className="font-helvetica text-[11px] font-normal mt-0.5 capitalize">We Will never share your information with anyone.</p>
    //       </div>
    //       <div className="mb-[64px]">
    //         <div className="flex flex-col mt-10 mb-[15px]">
    //           <Input
    //             type="text"
    //             placeholder="Username or email"
    //             name="email"
    //             aria-label="Username or Email"
    //             onChange={(e) => setEmail(e.target.value)}
    //             classNames={{
    //               input: [
    //                 "bg-[#0D0D0D]",
    //                 "placeholder:text-[#818181]",
    //                 "placeholder:font-normal",
    //                 "text-[16px]",
    //                 "font-normal",
    //                 "h-[46px]",
    //                 "font-helvetica",
    //                 "pl-[12px]"
    //               ],
    //               inputWrapper: [
    //                 "bg-[#0D0D0D]",
    //                 "rounded-[5px]",
    //                 "data-[hover=true]:bg-[#0D0D0D]",
    //                 "group-data-[focus=true]:bg-[#0D0D0D]",
    //                 "h-[46px]"
    //               ]
    //             }}
    //             startContent={
    //               <UserIcon className="text-2xl pointer-events-none flex-shrink-0 text-[#B0B0B0]" />
    //             }
    //           />
    //         </div>
    //         <div className="flex flex-col mt-0">
    //           <Input
    //             type={isPasswordVisible ? "text" : "password"}
    //             placeholder="Password"
    //             aria-label="Password"
    //             value={password}
    //             onChange={(e) => setPassword(e.target.value)}
    //             classNames={{
    //               input: [
    //                 "bg-[#0D0D0D]",
    //                 "placeholder:text-[#818181]",
    //                 "placeholder:font-normal",
    //                 "text-[16px]",
    //                 "font-normal",
    //                 "h-[46px]",
    //                 "font-helvetica",
    //                 "pl-[12px]"
    //               ],
    //               inputWrapper: [
    //                 "bg-[#0D0D0D]",
    //                 "rounded-[5px]",
    //                 "data-[hover=true]:bg-[#0D0D0D]",
    //                 "group-data-[focus=true]:bg-[#0D0D0D]",
    //                 "h-[46px]"
    //               ]
    //             }}
    //             startContent={
    //               <LockIcon className="text-2xl pointer-events-none flex-shrink-0 text-[#B0B0B0]" />
    //             }
    //             endContent={
    //               isPasswordVisible ? <EyeSlashIcon className="h-4 w-4 cursor-pointer flex-shrink-0 text-[#B0B0B0]" onClick={togglePasswordVisibility} /> : <EyeIcon className="h-4 w-4 cursor-pointer flex-shrink-0 text-[#B0B0B0]" onClick={togglePasswordVisibility} />
    //             }
    //           />
    //         </div>
    //       </div>
    //       <div className="flex flex-col mt-5 font-worksans">
    //         <Button type="submit" className="bg-[#F8F8F8] text-[#131313] font-semibold text-base px-[50px] rounded-md w-[385px] h-[46px]">Sign In</Button>
    //       </div>
    //       <div className="flex items-center justify-center flex-col gap-2.5 mt-3">
    //         <p className="text-sm font-normal font-worksans capitalize">Don't have an account, <Link className="text-[#3BADFF]" href="/register">Sign Up</Link></p>
    //         <Image
    //           alt="google icon"
    //           width={24}
    //           height={24}
    //           src="google.png"
    //           className="cursor-pointer"
    //           onClick={LoginWithGoogle}
    //         />
    //       </div>
    //     </CardBody>
    //   </form>
    // </Card>
    <div className="flex h-screen w-full font-helvetica">
      <div
        className={`${
          isMobile ? "w-full" : "w-1/2"
        } flex items-center justify-center bg-white p-8`}
      >
        <div className="fixed top-[30px] left-[20px]">
          <Image src="togl-icon.png" width={70} height={70} alt="logo" />
        </div>
        <div className="w-full max-w-sm">
          <form onSubmit={handleSubmit}>
            <h1 className="text-4xl font-bold mb-2 text-[#232323]  font-helvetica">
              Sign in
            </h1>
            <p className="text-[#969696] text-base mb-6">
              Please login to continue to your account.
            </p>
            <div class="relative my-4">
              <input
                type="text"
                onChange={(e) => setEmail(e.target.value)}
                id="floating_outlined_email"
                class="block px-2.5 pb-2.5 pt-4 w-full text-base text-gray-900 bg-transparent rounded-lg border-2 border-[#D9D9D9] appearance-none dark:text-white dark:border[#367AFF] dark:focus:border-[#367AFF] focus:outline-none focus:ring-0 focus:border-[#367AFF] peer"
                placeholder=" "
              />
              <label
                for="floating_outlined_email"
                class="absolute text-base font-medium text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-[#367AFF] peer-focus:dark:text-[#367AFF] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Email
              </label>
            </div>
            <div class="relative my-4">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <div className="flex items-center mb-4">
              {/* <input type="checkbox" id="keepLoggedIn" className="w-[15px] h-[15px] mr-2 border2 border-[#000000] bg-white" /> */}
              {KeepMeLoggedIn ? (
                <div
                  className="w-[15px] h-[15px] mr-2 bg-[#367AFF] flex justify-center items-center cursor-pointer"
                  // style={{ border: "1px solid" }}
                  onClick={() => setKeepMeLoggedIn(false)}
                >
                  <Check className="w-3 h-3 text-white font-bold" />
                </div>
              ) : (
                <div
                  className="w-[15px] h-[15px] mr-2 cursor-pointer"
                  style={{ border: "1px solid black" }}
                  onClick={() => setKeepMeLoggedIn(true)}
                ></div>
              )}
              {/* <Input type="checkbox" id="keepLoggedIn" className="w-[15px] h-[15px] mr-2 border2 border-[#000000] bg-white"/> */}
              <label
                htmlFor="keepLoggedIn"
                className="text-[#232323] text-md font-medium cursor-pointer font-inter"
                onClick={() => setKeepMeLoggedIn(!KeepMeLoggedIn)}
              >
                Keep me logged in
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-[#367AFF] text-white text-base py-2.5 rounded-lg font-semibold"
            >
              {isLoading ? <Spinner size="sm" color="white" /> : "Sign in"}
            </button>
          </form>

          <div className="flex items-center text-center text-black my-5">
            <div className="flex-1 border-b-1.5 border-gray-300"></div>
            <span className="mx-2 text-gray-500">or</span>
            <div className="flex-1 border-b-1.5 border-gray-300"></div>
          </div>
          <button
            onClick={LoginWithGoogle}
            className="w-full flex text-base items-center text-[#232323] border-[#E6E8E7] justify-center border-2 py-3 rounded-lg font-semibold"
          >
            Sign in with Google
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-4 h-4 ml-2"
            />
          </button>
          <p className="mt-4 text-center text-base  font-helvetica  text-[#6C6C6C]">
            Need an account?{" "}
            <Link href="/register" className="text-[#367AFF] underline">
              Create one
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
}
export default EmailSignInForm;
