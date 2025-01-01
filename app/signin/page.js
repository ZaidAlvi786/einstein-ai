"use client";
import React, { useState, useRef, useEffect } from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { useRouter } from "next/navigation";
import axios from "axios";
import { apiURL } from "@/config";
import { useGoogleLogin } from "@react-oauth/google";
import InputField from "../ui/InputField";
import passwordValidator from "password-validator";

import Image from "next/image";
import eyeIcon from "../../public/svg/eye.svg";
import eyeSlashIcon from "../../public/svg/eyecross.svg";
import { useAuth } from "../../app/authContext/auth";
import SignInButton from "../ui/SignInButton";
import EmailSignInForm from "../signin/EmailSignInForm";
import toast from "react-hot-toast";
import ToastService from "@/components/Toaster/toastService";
// Main Component
const SignInOptions = () => {
  const router = useRouter();
  const auth = useAuth();
  const [showEmailSignIn, setShowEmailSignIn] = useState(false);
  const [showSignInOptions, setShowSignInOptions] = useState(true);
  const [user, setUser] = useState(null);
  console.log("user: ", user);

  const googleLoginRef = useRef(null);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setUser(codeResponse);
      console.log("codeResponse", codeResponse);
    },
    onError: (error) => toast.warning("Login with Google failed! " + error),
  });

  useEffect(() => {
    if (user && typeof window !== "undefined") {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user?.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user?.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          axios
            .post(`${apiURL}/auth/google_login`, res.data, {
              headers: { "Content-Type": "application/json" },
            })
            .then((response) => {
              if (response.status === 201) {
                toast.warning(response?.data?.message);
              }
              if (response.status === 200) {
                console.log("response: ==>", response);
                toast.success('Logged in successfully');
                const token = response?.data?.token
                auth.login({
                  userID: response?.data?.user_id,
                  email: response?.data?.email,
                  token,
                  fullname: response?.data?.name,
                  plan: response?.data?.plan ? response?.data?.plan : null,
                  price: response?.data?.price,
                  visitor_id: response?.data?.visitor_id,
                });
                router.push("/");
              }
            })
            .catch((error) => {
              toast.error(error);
            });
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  const toggleEmailSignIn = () => {
    setShowEmailSignIn((prev) => !prev);
    setShowSignInOptions(false);
  };

  const toggleSignInOptions = () => {
    setShowEmailSignIn(false);
    setShowSignInOptions(true);
    router.push("/");
  };

  const responseFacebook = async (response) => {
    if (response.accessToken) {
      const userData = {};
      if (
        auth &&
        auth.user &&
        auth.user.userID &&
        auth.user.plan == "free" &&
        (auth.user.email == "" || auth.user.email == null)
      ) {
        userData.id = auth.user.userID;
        userData.plan = "free";
        userData.accessToken = response.accessToken;
        userData.userID = response.userID;
      } else {
        userData.id = "";
        userData.plan = "free";
        userData.accessToken = response.accessToken;
        userData.userID = response.userID;
      }
      try {
        const response = await axios.post(`${apiURL}/auth/facebook`, userData);

        if (response) {
          toast.success("Logged in successfully");
          auth.login({
            userID: response?.data?.data?.user_id,
            email: response?.data?.data?.email,
            token: response?.data?.data?.token,
            fullname: response?.data?.data?.name,
            plan: response?.data?.data?.plan ? response?.data?.data?.plan : null,
            price: response?.data?.data?.price,
            visitor_id: response?.data?.data?.visitor_id,
          });
          router.push("/");
        }
      } catch (err) {
        toast.error(
          (err?.message ?? err?.data?.message) || "Something went wrong!"
        );
      }
    }
  };

  const componentClicked = (data) => {
    // console.log(data);
  };

  const buttonsData = [
    {
      type: "email",
      imageUrl: "svg/email.svg",
      altText: "Sign in with Email Icon",
      buttonText: "Sign in with Email",
      extraClasses: "bg-white text-gray-500 gap-1 text-[20px]",
      onClick: toggleEmailSignIn,
    },
    // ,
    // {
    //   type: "google",
    //   imageUrl: "svg/google.svg",
    //   altText: "Sign in with Google Icon",
    //   buttonText: "Sign in with Google",
    //   extraClasses: "bg-white text-gray-500 gap-1 text-[20px]",
    //   onClick: () => login(),
    // },
    // {
    //   type: "apple",
    //   imageUrl: "svg/apple.svg",
    //   altText: "Sign in with Apple Icon",
    //   buttonText: "Sign in with Apple",
    //   extraClasses: "bg-black text-white gap-1 text-[20px]",
    //   onClick: () => alert("Sign in with Apple clicked"),
    // },
    // {
    //   type: "facebook",
    //   imageUrl: "svg/facebook.svg",
    //   altText: "Sign in with Facebook Icon",
    //   buttonText: "Sign in with Facebook",
    //   extraClasses: "bg-[#1877F2] text-white gap-1 text-[20px]",
    //   onClick: () => alert("Sign in with Facebook clicked"),
    // },
  ];

  return (
    <div className="h-screen overflow-auto bg-cover bg-[url('/background.png')] flex flex-col items-center justify-center">
      {" "}
      {/* {showSignInOptions && (
        <div className="flex items-center justify-center min-h-screen">
          <section className="flex flex-col items-center px-7 pt-4 pb-6 text-xl font-medium text-white rounded-[10px] bg-[#2D2D2D] min-w-[400px]">
            <header className="flex justify-between w-full  mb-4"></header>
            <main className="w-full">
              {buttonsData.map((button, index) => (
                <React.Fragment key={index}>
                  {button.type == "facebook" ? (
                    <FacebookLogin
                      appId={process.env.NEXT_PUBLIC_FACEBOOK_API_ID}
                      autoLoad={false}
                      fields="name,email,picture"
                      onClick={componentClicked}
                      callback={responseFacebook}
                      icon="fa-facebook"
                      render={(renderProps) => (
                        <SignInButton
                          imageUrl={button.imageUrl}
                          altText={button.altText}
                          buttonText={button.buttonText}
                          extraClasses={button.extraClasses}
                          onClick={renderProps.onClick}
                        />
                      )}
                    />
                  ) : (
                    <SignInButton
                      imageUrl={button.imageUrl}
                      altText={button.altText}
                      buttonText={button.buttonText}
                      extraClasses={button.extraClasses}
                      onClick={button.onClick}
                    />
                  )}

                  {index !== buttonsData.length - 1 && <div className="h-4" />}
                </React.Fragment>
              ))}
              <div
                tabIndex="0"
                role="button"
                className="text-center mt-3 cursor-pointer text-white "
                onClick={() => router.push("/register")}
              >
                <span style={{ fontSize: "15px" }}>
                  &quot;Don&apos;t have an account? Register&quot;
                </span>
              </div>
            </main>
          </section>
        </div>
      )} */}
      {/* {showEmailSignIn && <EmailSignInForm onClose={toggleSignInOptions} />} */}
      <EmailSignInForm onClose={toggleSignInOptions} LoginWithGoogle={login} />
      <ToastService />
    </div>
  );
};

export default SignInOptions;
