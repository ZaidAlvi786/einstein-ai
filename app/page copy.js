"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useModelStatus } from "@/components/context/ModelStatusContext";
import Header from "@/components/layout/header";
import Chat from "@/components/chat";
import HistorySider from "@/components/layout/historysider";
import Model_Interface from "@/components/model_interface";
import { useAuth } from "./authContext/auth";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
// import { generateFingerprint } from "../utils/helper";
import axios from "axios";
import { apiURL } from "@/config";
// import { ClientJS } from "clientjs";
import Stripe from "stripe";
import MobileDialog from "@/components/mobile_dialog";
import { useAppDispatch, useAppSelector } from "./lib/hooks";
import { setActiveChat } from "./lib/features/chat/chatSlice";
import { useMemo } from "react";

const ClientJs = dynamic(() => import("../components/clientJs"), {
  ssr: false,
});

const inter = Inter({ subsets: ["latin"] });
const nasalization = localFont({
  src: "./nasalization-rg.otf",
  variable: "--font-nasalization",
  display: 'swap',
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
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { settingModel, setSettingModel } = useModelStatus();
  const { toggleStatus, setToggleStatus } = useModelStatus();
  const [chatStatus, setChatStatus] = useState(false);
  const [chatHistoryID, setChatHistoryID] = useState("");
  const [imgHistoryID, setImgHistoryID] = useState("");
  const [chatHistoryData, setChatHistoryData] = useState([]);
  const [imgHistoryData, setImgHistoryData] = useState([]);
  const [historySideData, setHistorySideData] = useState([]);
  const [chatTitle, setChatTitle] = useState("New Chat");
  const [mobileStatus, setMobileStatus] = useState(false);
  const [userActive, setUserActive] = useState(false);
  const [clickChat, setClickChat] = useState(false);
  const [imageModel, setImageModel] = useState(false); // message type e.g text,image,video, audio
  const [messageModelType, setMessageModelType] = useState("text"); // message type e.g text,image,video, audio
  const [fullName, setFullName] = useState("Human");
  const [loading, setLoading] = useState(true);
  const [activeWorkspace, setActiveWorkspace] = useState(0);
  const [navigateToMessageModel, setNavigateToMessageModel] = useState("");

  const NewChat = () => {
    setToggleStatus(1);
    setChatStatus(false);
    setChatHistoryID("");
    setImgHistoryID("");
    setChatHistoryData([]);
    setImgHistoryData([]);
    setSettingModel(false);
    setChatTitle("New Chat");
    dispatch(setActiveChat({}));
    const time = new Date();
    const _idx = historySideData.findIndex(x => x.id == -1)
    if (_idx == -1) {
      setHistorySideData([{
        id: -1,
        title: "New Chat",
        bot: "",
        date: time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
        thumbnail_url: "",
      },
      ...historySideData]);
    }
  };

  const onSetToggleStatus = (value) => {
    setToggleStatus(0);
    setSettingModel(true);
  };

  // const createNewUser = async () => {
  //   const client = new ClientJS();
  //   const fingerprint = client.getFingerprint();

  //   await axios
  //     .get(`${apiURL}/auth/createNewUser?visitor_id=${fingerprint}`, {
  //       headers: { "Content-Type": "application/json" },
  //     })
  //     .then((response) => {
  //       console.log("createnewuser", response);

  //       if (response.status == 200) {
  //         auth.login({
  //           userID: response.data.data.user_id,
  //           email: response.data.data.email,
  //           token: response.data.data.token,
  //           fullname: response.data.data.name,
  //           plan: response.data.data.plan,
  //           price: response.data.data.price,
  //           visitor_id: response.data.data.visitor_id,
  //         });
  //         setLoading(false);
  //       }
  //     });
  // };

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
        console.log(err);
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
      // Handle error when navigator is not defined
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
      <div className={`${nasalization.variable} ${montserrat.variable} ${helvetica.variable} ${helvetica_neue.variable} h-screen flex flex-col max-msm:bg-[#000]`} >
        {loading ? ( // Show the loader when loading is true
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
                setImgHistoryID={setImgHistoryID}
                setChatStatus={setChatStatus}
                historySideData={historySideData}
                setHistorySideData={setHistorySideData}
                setChatTitle={setChatTitle}
                setChatHistoryData={setChatHistoryData}
                setImgHistoryData={setImgHistoryData}
                setMobileStatus={setMobileStatus}
                setClickChat={setClickChat}
                mobileStatus={mobileStatus}
                setMessageModelType={setMessageModelType}
                messageModelType={messageModelType}
                setToggleStatus1={onSetToggleStatus}
                auth={auth}
                activeWorkspace={activeWorkspace}
                setActiveWorkspace={setActiveWorkspace}
                navigateToMessageModel={navigateToMessageModel}
                setNavigateToMessageModel={setNavigateToMessageModel}
              />
              <div className="w-calc-295px ml-auto">
                <Header
                  setUserActive={setUserActive}
                  userActive={userActive}
                  clickChat={clickChat}
                  setClickChat={setClickChat}
                  setMobileStatus={setMobileStatus}
                  settingModelStatus={settingModel}
                  auth={auth}
                  setActiveWorkspace={onSetActiveWorkspace}
                />
                {toggleStatus == 1 ? (
                  <Chat
                    NewChat={NewChat}
                    chatHistoryID={chatHistoryID}
                    historySideData={historySideData}
                    setHistorySideData={setHistorySideData}
                    setChatStatus={setChatStatus}
                    setChatHistoryID={setChatHistoryID}
                    chatStatus={chatStatus}
                    chatHistoryData={chatHistoryData}
                    setChatTitle={setChatTitle}
                    chatTitle={chatTitle}
                    mobileStatus={mobileStatus}
                    messageModelType={messageModelType}
                    imgHistoryID={imgHistoryID}
                    setImgHistoryID={setImgHistoryID}
                    imgHistoryData={imgHistoryData}
                    fullName={fullName}
                    setFullName={setFullName}
                    setToggleStatus1={onSetToggleStatus}
                    auth={auth}
                    activeWorkspace={activeWorkspace}
                    navigateToMessageModel={setNavigateToMessageModel}
                  />
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
    </Suspense>
  );
}