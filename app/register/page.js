"use client";
import React, { useState, useRef, useEffect } from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import InputField from "../ui/InputField";
import { apiURL } from "@/config";
import RegistrationForm from "./RegistrationForm";
import DigitCodeConfirmation from "./DigitCodeConfirmation";
import RegisterButton from "../ui/RegisterButton";
import { useAuth } from "../../app/authContext/auth";
import toast from "react-hot-toast";
import ToastService from "@/components/Toaster/toastService";

const RegistrationOptions = () => {
  const router = useRouter();
  const auth = useAuth();
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showRegistrationOptions, setShowRegistrationOptions] = useState(true);
  const [showEmailCodeForm, setShowEmailCodeForm] = useState(false);
  const [user, setUser] = useState(null);
  console.log("user: ", user);

  const googleLoginRef = useRef(null);

  const login = useGoogleLogin({
    // onSuccess: (codeResponse) => setUser(codeResponse),
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
          console.log("user data: ", res.data);
          axios
            .post(`${apiURL}/auth/google_login`, res.data, {
              headers: { "Content-Type": "application/json" },
            })
            .then((response) => {
              if (response.status === 201) {
                toast.warning(response.data.message);
              }
              if (response.status === 200) {
                toast.success("Logged in successfully");
                auth.login({
                  userID: response.data.user_id,
                  email: response.data.email,
                  token: response.data.token,
                  fullname: response.data.name,
                  plan: response.data.plan ? response.data.plan : null,
                  price: response.data.price,
                  visitor_id: response.data.visitor_id,
                });
                router.push("/");
                setTimeout(() => {
                  window.location.reload(); // Reload only after redirect
                }, 500);
              }
            })
            .catch((error) => {
              toast.error(error, "Error");
            });
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  const toggleRegistrationForm = () => {
    router.push("/");
    setShowRegistrationForm(true);
    setShowRegistrationOptions(false);
    setShowEmailCodeForm(false);
  };

  const toggleRegistrationOptions = () => {
    router.push("/");
    setShowRegistrationForm(false);
    setShowRegistrationOptions(true);
  };

  const toggleEmailCodeForm = () => {
    setShowEmailCodeForm(true);
    setShowRegistrationOptions(false);
    setShowRegistrationForm(false);
  };

  const handleDigitCodeConfirmation = () => {
    toggleEmailCodeForm();
  };

  const buttonsData = [
    {
      type: "email",
      imageUrl: "svg/email.svg",
      altText: "Register with Email Icon",
      buttonText: "Register with Email",
      extraClasses: "bg-white text-gray-500 gap-1 text-[20px]",
      onClick: toggleRegistrationForm,
    },
    // ,
    // {
    //   type: "google",
    //   imageUrl: "svg/google.svg",
    //   altText: "Register with Google Icon",
    //   buttonText: "Register with Google",
    //   extraClasses: "bg-white text-gray-500 gap-1 text-[20px]",
    //   onClick: () => login(),
    // },
    // {
    //   type: "apple",
    //   imageUrl: "svg/apple.svg",
    //   altText: "Register with Apple Icon",
    //   buttonText: "Register with Apple",
    //   extraClasses: "bg-black text-white gap-1 text-[20px]",
    //   onClick: () => alert("Register with Apple clicked"),
    // },
    // {
    //   type: "facebook",
    //   imageUrl: "svg/facebook.svg",
    //   altText: "Register with Facebook Icon",
    //   buttonText: "Register with Facebook",
    //   extraClasses: "bg-blue-600 text-white gap-1 text-[20px]",
    //   onClick: () => alert("Register with Facebook clicked"),
    // },
  ];

  const [showPassword2, setShowPassword2] = useState(false);

  const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
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
          // console.log(response);
          auth.login({
            userID: response.data.data.user_id,
            email: response.data.data.email,
            token: response.data.data.token,
            fullname: response.data.data.name,
            plan: response.data.data.plan ? response.data.data.plan : null,
            price: response.data.data.price,
            visitor_id: response.data.data.visitor_id,
          });
          router.push("/");
        }
      } catch (err) {
        toast.error(
          (err?.message ?? err?.data?.message) || "Something went wrong!"
        );

        // generateMessage(e.response.data);
      }
    }
  };

  const componentClicked = (data) => {
    // console.log(data);
  };

  return (
    <div className="h-screen overflow-auto bg-cover bg-[url('/background.png')] flex flex-col items-center justify-center">
      {/* {showRegistrationOptions && (
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
                        <RegisterButton
                          imageUrl={button.imageUrl}
                          altText={button.altText}
                          buttonText={button.buttonText}
                          extraClasses={button.extraClasses}
                          onClick={renderProps.onClick}
                        />
                      )}
                    />
                  ) : (
                    <RegisterButton
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
                className="text-center mt-3 cursor-pointer text-white"
                onClick={() => router.push("/signin")}
              >
                <span style={{ fontSize: "15px" }}>Have account? Sign In</span>
              </div>
            </main>
          </section>
        </div>
      )} */}
      {/* {showRegistrationForm && ( */}
      <RegistrationForm
        onClose={toggleRegistrationOptions}
        LoginWithGoogle={login}
      />
      {/* )} */}
      {showEmailCodeForm && (
        <DigitCodeConfirmation onClose={toggleRegistrationForm} />
      )}
      <ToastService />
    </div>
  );
};

export default RegistrationOptions;
