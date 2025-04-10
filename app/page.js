"use client";
import "regenerator-runtime/runtime";

import { useState, useEffect, useRef, Suspense } from "react";
import { useModelStatus } from "@/components/context/ModelStatusContext";
import Header from "@/components/layout/header";
import HistorySider from "@/components/layout/historysider";
import Model_Interface from "@/components/model_interface";
import { useAuth } from "./authContext/auth";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import axios from "axios";
import { apiURL } from "@/config";
import MobileDialog from "@/components/mobile_dialog";
import { useAppDispatch, useAppSelector } from "./lib/hooks";
import { setActiveChat } from "./lib/features/chat/chatSlice";
import Chat from "@/components/chat";
import toast from "react-hot-toast";
import { useGetToolLogoUrlListQuery, useGetUserQuery } from "./lib/features/chat/chatApi";
import { toolLogoLocalStorageKey } from "@/components/constants/ToolContants";
import MobileLandingPage from "@/components/chat/typedChatComponents/MobileLandingPage";
import { Analytics } from "@vercel/analytics/react";

const ClientJs = dynamic(() => import("../components/clientJs"), {
  ssr: false,
});

const nasalization = localFont({
  src: "./nasalization-rg.otf",
  variable: "--font-nasalization",
  display: "swap",
});
const montserrat = localFont({
  src: "./Montserrat-Regular.ttf",
  variable: "--font-montserrat",
});
const helvetica = localFont({
  src: "./Helvetica.ttf",
  variable: "--font-helvetica",
});
const helvetica_neue = localFont({
  src: "./Helvetica Neue.otf",
  variable: "--font-helvetica_neue",
});

export default function Home() {
  const auth = useAuth();
  const router = useRouter()
  const dispatch = useAppDispatch();
  const { settingModel, setSettingModel } = useModelStatus();
  const { toggleStatus, setToggleStatus } = useModelStatus();
  const [chatStatus, setChatStatus] = useState(false);
  const [chatHistoryID, setChatHistoryID] = useState("");
  const [chatHistoryData, setChatHistoryData] = useState([]);
  const [historySideData, setHistorySideData] = useState([]);
  const [chatTitle, setChatTitle] = useState("New Chat");
  const [mobileStatus, setMobileStatus] = useState(false);
  const [userActive, setUserActive] = useState(false);
  const [clickChat, setClickChat] = useState(false);
  const [messageModelType, setMessageModelType] = useState("text"); // message type e.g text,image,video, audio
  const [loading, setLoading] = useState(true);
  const [activeWorkspace, setActiveWorkspace] = useState(0);
  const [navigateToMessageModel, setNavigateToMessageModel] = useState("");
  const sidebarSize = useAppSelector((state) => state.sidebarResize.width);
  const { data: toolLogoList } = useGetToolLogoUrlListQuery();
  const [onboardingToPlatformPlan] = useOnboardingToPlatformPlanMutation();
  const [setAutoTopupStatus] = useSetAutoTopupStatusMutation();
    const [AttachPaymentMethodToCustomer] =
      useAttachPaymentMethodToCustomerMutation();
  const messages = useAppSelector((state) => state.webSocket.messages);
  const [isMobile, setIsMobile] = useState(false);
  const [showTutorialModel, setShowTutorialModel] = useState(false);
  const [showPaymentPopup, setshowPaymentPopup] = useState(false);
  const [showSubscribePopup, setshowSubscribePopup] = useState(false);
  const { setBlurSideBar,blurSideBar } = useBlurSideBar();

  const searchParams = useSearchParams();
  const payment_status = searchParams?.get("payment_success") ?? null;
    const {
      data: getUserData,
      refetch: refetchUserData,
      isLoading: getUserLoading,
    } = useGetUserQuery({ email: auth?.user?.email });
    // console.log('getUserData: ', getUserData);
 const { data: cardsList, isFetching: cardsListLoading,refetch:refetchCardsList } =
 useGetCustomersCardsQuery(
   { user_id: auth?.user?.userID },
   { skip: !auth?.user?.userID && !auth?.user?.email }
  );
    useEffect(() => {
      // setTimeout(() => {   
        if(getUserData?.data?.plan && getUserData?.data?.plan === "free" && payment_status === null){
          setBlurSideBar(true)
          setshowSubscribePopup(true)
        }else {
          // setBlurSideBar(false)
          setshowSubscribePopup(false)
        }
      // }, 1000);
    }, [getUserData]);

    useEffect(() => {
      if(cardsList?.payment_methods && cardsList?.payment_methods.length > 0){
      attachPaymentMethod(cardsList?.payment_methods[0]?.card_id)
      }
    }, [cardsList])
    
    
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
  useEffect(() => {
    if (payment_status === 'true') {
      onboardingPlan()
      setBlurSideBar(true);
      setshowPaymentPopup({
        isOpen: true,
        success: true
      });
    } else if (payment_status === 'false') {
      setBlurSideBar(true);
      setshowPaymentPopup({
        isOpen: true,
        success: false
      });
      localStorage.removeItem("stripe_process_plan")
    }
  }, [payment_status]);


    const onboardingPlan = () => {
      const plan =  JSON.parse(localStorage.getItem("stripe_process_plan"))
      const plan_type = plan?.plan_type === "Per month" ? "monthly" : "yearly";
      const plan_id = plan?.plan_id;
      const data = {
        params: {
          plan_id,
          plan_type,
        },
      };
      onboardingToPlatformPlan(data)
        .unwrap()
        .then((response) => {
          refetchUserData()
         
        })
        .catch((error) => {
          // setisLoading({ plan_id: null });
          if (error?.data?.message) {
            toast.error(error?.data?.message);
          }
        }).finally(() => {
          localStorage.removeItem("stripe_process_plan")
        })
    };
  
const attachPaymentMethod = (payment_method_id) => {
  const data = { params: { payment_method_id: payment_method_id } };
  AttachPaymentMethodToCustomer(data).unwrap().then((response) => {
    const data = {
      status: true,
      amount: 5,
    };
    if (payment_status === 'true') {
    handleTopUpStatus(data);}
  })

}
    
      const handleTopUpStatus = (data) => {
        setAutoTopupStatus(data)
          .unwrap()
          .then((response) => {
            // toast.success("Set Auto Credit Top-Ups Successfully!");
            // setisLoading({ plan_id: null });
          })
          .catch((error) => {
            if (error?.data?.message) {
              toast.error(error?.data?.message);
            }
          });
      };

      
  useEffect(() => {
    const iframe = document.getElementById("myIframe");
    if (iframe) {
      const iframeWindow = iframe.contentWindow;
      iframeWindow.addEventListener("load", () => {
        console.log("Iframe content loaded");
        localStorage.setItem("testTokenRemoveToDO");
      });
    }
  }, []);

  const NewChat = () => {
    setToggleStatus(1);
    setChatStatus(false);
    setChatHistoryID("");
    setChatHistoryData([]);
    setSettingModel(false);
    setChatTitle("New Chat");
    dispatch(setActiveChat({}));
    localStorage.removeItem("activeChatLocalStorage"); // removed prev activeChat during logout may be
    const time = new Date();
    const _idx = historySideData.findIndex((x) => x.id == -1);
    if (_idx == -1) {
      setHistorySideData([
        {
          id: -1,
          title: "New Chat",
          bot: "",
          date: time.toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
          thumbnail_url: "",
        },
        ...historySideData,
      ]);
    }
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      //call on page reload
      if (toolLogoList) {
        localStorage.setItem(
          toolLogoLocalStorageKey,
          JSON.stringify(toolLogoList.logos)
        );
      }
    }
  }, [toolLogoList]);

  const getUserData1 = (visitor_id) => {
    axios
      .post(
        `${apiURL}/auth/getuser`,
        { visitor_id },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((response) => {
        auth.login({
          userID: response.data.data.user_id,
          email: response.data.data.email,
          token: response.data.data.token,
          fullname: response.data.data.name,
          plan: response.data.data.plan,
          price: response.data.data.price,
          visitor_id: response.data.data.visitor_id,
        });

        setLoading(false);
      })
      .catch((err) => {
        toast.error(
          (err?.message ?? err?.data?.message) || "Something went wrong!"
        );
      });
  };
  const [fingerPrint, setFingerPrint] = useState("");

  const onSetFingerPrint = (fingerprint) => {
    if (fingerprint != null) {
      setFingerPrint(fingerprint);
    }
  };

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && fingerPrint != "") {
        if (auth && auth.user) {
          if (
            auth.user.email &&
            (auth.user.email !== null || auth.user.email !== "")
          ) {
            setLoading(false);
          } else {
            getUserData1(fingerPrint);
          }
        } else {
          getUserData1(fingerPrint);
        }
      }
    } catch (error) {
      console.error("Error accessing navigator:", error);
    }
  }, [fingerPrint]);

  const onSetActiveWorkspace = (value) => {
    if (value != 0) {
      setActiveWorkspace(value);
      NewChat();
    }
  };

  return (
    <Suspense>
      {!isMobile ? (
        <div
          className={`${nasalization.variable} ${montserrat.variable} ${helvetica.variable} ${helvetica_neue.variable} h-screen flex flex-col max-msm:bg-[#000]`}
        >
          {loading ? (
            <div className={`flex flex-col w-full items-start z-[999]`}>
              <div className="flex flex-row mb-10">
                <div className="w-[100px]  mt-4">
                  <div className="snippet" data-title="dot-pulse">
                    <div className="stage">
                      <div className="single-dot-loader"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-1 flex-row pb-2 overflow-auto">
                <HistorySider
                  NewChat={NewChat}
                  setChatHistoryID={setChatHistoryID}
                  setChatStatus={setChatStatus}
                  historySideData={historySideData}
                  setChatTitle={setChatTitle}
                  setClickChat={setClickChat}
                  setMessageModelType={setMessageModelType}
                  auth={auth}
                  navigateToMessageModel={navigateToMessageModel}
                  setNavigateToMessageModel={setNavigateToMessageModel}
                  showTutorialModel={showTutorialModel}
                  setShowTutorialModel={setShowTutorialModel}
                />
                <div
                  className={`ml-auto`}
                  style={{ width: `calc(100% - ${sidebarSize}px)` }}
                >
                  <script
                    async
                    src="https://w.appzi.io/w.js?token=Sv7eu"
                  ></script>
                  <Header
                    setUserActive={setUserActive}
                    userActive={userActive}
                    clickChat={clickChat}
                    setClickChat={setClickChat}
                    setMobileStatus={setMobileStatus}
                    settingModelStatus={settingModel}
                    auth={auth}
                    setActiveWorkspace={onSetActiveWorkspace}
                    showTutorialModel={showTutorialModel}
                    setShowTutorialModel={setShowTutorialModel}
                  />
                  {toggleStatus == 1 ? (
                    <Chat chatHistoryID={chatHistoryID} NewChat={NewChat} />
                  ) : (
                    <Model_Interface />
                  )}
                </div>
              </div>
            </>
          )}
          <ClientJs setFingerPrint={onSetFingerPrint} />
          <MobileDialog />
        </div>
      ) : (
        <MobileLandingPage />
      )}
      <PaymentSuccessModal
        isOpen={showPaymentPopup}
        setIsopen={setshowPaymentPopup}
        setShowTutorialModel={setShowTutorialModel}
      />
      <SubscribeModal 
       isOpen={showSubscribePopup}
      setIsopen={setshowSubscribePopup}
      />
      <Analytics />
    </Suspense>
  );
}

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { CheckCircle, FrownIcon } from "lucide-react";
import { useBlurSideBar } from "@/components/context/blurSideBarContext";
import { useAttachPaymentMethodToCustomerMutation, useGetCustomersCardsQuery, useOnboardingToPlatformPlanMutation, useSetAutoTopupStatusMutation } from "./lib/features/payment/paymentApi";
import Image from "next/image";

function PaymentSuccessModal({ setIsopen, isOpen, setShowTutorialModel }) {
  const router = useRouter();
  const handleContinue = () => {
    setIsopen({
      isOpen: false,
      success: false
    });
    const signup_process = localStorage.getItem("signup_process");
    if (signup_process) {
      setShowTutorialModel(true);
      localStorage.removeItem("signup_process");
  }}
  return (
    <Modal isOpen={isOpen.isOpen} onClose={() => setIsopen({
      isOpen: false,
      success: false
    })} isDismissable>
      <ModalContent>
        {isOpen.success ? 
        <ModalBody className="py-10 px-6 text-center flex items-center">
          <CheckCircle className="text-green-500 mx-auto mb-2" size={48} />
          <h2 className="text-green-500 text-lg font-bold">SUCCESS</h2>
          <p className="font-semibold mt-2 text-white">
            Thank you for Subscribe!
          </p>
          <Button
            color="success"
            className="mt-4 text-white w-fit px-5 py-2 min-h-fit h-fit"
            onPress={() => handleContinue()}
          >
            Continue
          </Button>
        </ModalBody>
        :
        <ModalBody  className="py-10 px-6 text-center flex items-center">
          <FrownIcon className="text-red-500 mx-auto mb-2" size={48} />
          <h2 className="text-red-500 text-lg font-bold">ERROR</h2>
          <p className="font-semibold mt-2 text-white">
            Payment failed. Please try again.
          </p>
          <Button
            color="error"
            className="mt-4 text-white w-fit px-5 py-2 min-h-fit h-fit border-2 border-white"
            onPress={() => {setIsopen({
              isOpen: false,
              success: false
            }); router.push("/subscription")}}
          >
            Try again
          </Button>
        </ModalBody>}
      </ModalContent>
    </Modal>
  );
}


function SubscribeModal({ setIsopen, isOpen }) {
  const router = useRouter();
  return (
    <Modal isOpen={isOpen} hideCloseButton>
      <ModalContent>
        <ModalBody className="py-10  text-center flex items-center">
          <Image src="/togl.svg" width={50} height={50}/>
        
          <p className="font-semibold mt-2 text-white text-[20px]">
           Subscribe to Togl
          </p>
          <Button
            className="mt-4 text-white w-fit px-5 py-2 min-h-fit h-fit border-1 border-white bg-transparent"
            onPress={() => router.push("/subscription")}
          >
            Subscribe
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
