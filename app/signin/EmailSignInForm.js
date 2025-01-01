"use client"
import InputField from "../ui/InputField";
import passwordValidator from "password-validator";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { apiURL } from "@/config";
import axios from "axios";
import { useAuth } from "../authContext/auth";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import UserIcon from "@/app/assets/svg/UserMake.svg";
import LockIcon from "@/app/assets/svg/lock-key.svg";
import Link from 'next/link'
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import useBoolean from "../hooks/useBoolean";
import { setActiveWorkspace } from "../lib/features/workspace/workspaceSlice";
import { workspaceApi } from "../lib/features/workspace/workspaceApi";
import { chatApi } from "../lib/features/chat/chatApi";
import { setActiveChat } from "../lib/features/chat/chatSlice";
import { setCurrentActiveGroup } from "../lib/features/chat/groupSlice";
import { useAppDispatch } from "../lib/hooks";
import toast from "react-hot-toast";

function EmailSignInForm({ onClose, LoginWithGoogle }) {
  const auth = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const schema = new passwordValidator();

  const { value: isPasswordVisible, toggle: togglePasswordVisibility } = useBoolean(false);

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

    dispatch(setActiveChat({}));
    dispatch(setCurrentActiveGroup({}));
    dispatch(setActiveWorkspace({}));
    dispatch(workspaceApi.util.invalidateTags(['workspace-list']));
    dispatch(chatApi.util.invalidateTags(['group-list', 'history-chat-by-workspace-id']));
  };

  const SignIn = (logData) => {
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

          axios.post(`${apiURL}/auth/token`, { username: logData?.email ?? "", password: logData?.password ?? "" }, { headers: { "accept": "application/json", "Content-Type": "application/x-www-form-urlencoded" } })
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
                window.location.href = "/";
              }
            })
            .catch((error) => {
              console.error("Error get token :", error);
              toast.error((error?.message ??  error?.data?.message) || "Something went wrong!")
            });

        }
      })
      .catch((error) => {
        console.error("Error signing in:", error);
        toast.error((error?.response?.data?.message ??  error?.data?.message) || "Something went wrong!")
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
    <Card className="max-w-[421px] w-full shadow-modal bg-[#171717] rounded-[22px]">
      <form onSubmit={handleSubmit} >
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
            <h1 className="font-helvetica font-semibold text-[43px] text-white capitalize">Sign in</h1>
            <p className="font-helvetica text-[11px] font-normal mt-0.5 capitalize">We Will never share your information with anyone.</p>
          </div>
          <div className="mb-[64px]">
            <div className="flex flex-col mt-10 mb-[15px]">
              <Input
                type="text"
                placeholder="Username or email"
                name="email"
                aria-label="Username or Email"
                onChange={(e) => setEmail(e.target.value)}
                classNames={{
                  input: [
                    "bg-[#0D0D0D]",
                    "placeholder:text-[#818181]",
                    "placeholder:font-normal",
                    "text-[16px]",
                    "font-normal",
                    "h-[46px]",
                    "font-helvetica",
                    "pl-[12px]"
                  ],
                  inputWrapper: [
                    "bg-[#0D0D0D]",
                    "rounded-[5px]",
                    "data-[hover=true]:bg-[#0D0D0D]",
                    "group-data-[focus=true]:bg-[#0D0D0D]",
                    "h-[46px]"
                  ]
                }}
                startContent={
                  <UserIcon className="text-2xl pointer-events-none flex-shrink-0 text-[#B0B0B0]" />
                }
              />
            </div>
            <div className="flex flex-col mt-0">
              <Input
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Password"
                aria-label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                classNames={{
                  input: [
                    "bg-[#0D0D0D]",
                    "placeholder:text-[#818181]",
                    "placeholder:font-normal",
                    "text-[16px]",
                    "font-normal",
                    "h-[46px]",
                    "font-helvetica",
                    "pl-[12px]"
                  ],
                  inputWrapper: [
                    "bg-[#0D0D0D]",
                    "rounded-[5px]",
                    "data-[hover=true]:bg-[#0D0D0D]",
                    "group-data-[focus=true]:bg-[#0D0D0D]",
                    "h-[46px]"
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
          </div>
          <div className="flex flex-col mt-5 font-worksans">
            <Button type="submit" className="bg-[#F8F8F8] text-[#131313] font-semibold text-base px-[50px] rounded-md w-[385px] h-[46px]">Sign In</Button>
          </div>
          <div className="flex items-center justify-center flex-col gap-2.5 mt-3">
            <p className="text-sm font-normal font-worksans capitalize">Don't have an account, <Link className="text-[#3BADFF]" href="/register">Sign Up</Link></p>
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
    </Card>
  );
}
export default EmailSignInForm;
