"use client";
import 'regenerator-runtime/runtime';

import { useState, useEffect, useRef, Suspense } from "react";
import { useModelStatus } from "@/components/context/ModelStatusContext";
import Header from "@/components/layout/header";
import HistorySider from "@/components/layout/historysider";
import Model_Interface from "@/components/model_interface";
import { useAuth } from "./authContext/auth";
import { useRouter } from "next/navigation";
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
import { useGetToolLogoUrlListQuery } from "./lib/features/chat/chatApi";
import { toolLogoLocalStorageKey } from "@/components/constants/ToolContants";

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
  const messages = useAppSelector((state) => state.webSocket.messages);


  useEffect(() => {
    console.log('useEffect calll');
    const getIframeUrl = localStorage.getItem('iFrameUrl')
    console.log('getIframeUrl: ', getIframeUrl);
    
  },[])

  useEffect(() => {
    const iframe = document.getElementById('myIframe');
    if (iframe) {
        const iframeWindow = iframe.contentWindow;
        iframeWindow.addEventListener('load', () => {
            console.log('Iframe content loaded');
            localStorage.setItem("testTokenRemoveToDO")
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
    if (typeof window !== "undefined") { //call on page reload
      if (toolLogoList) {
        localStorage.setItem(toolLogoLocalStorageKey, JSON.stringify(toolLogoList.logos));
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
              />
              <div
                className={`ml-auto`}
                style={{ width: `calc(100% - ${sidebarSize}px)` }}
              >
                <script async src="https://w.appzi.io/w.js?token=Sv7eu"></script>
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
                {toggleStatus == 1 ? <Chat chatHistoryID={chatHistoryID}/> : <Model_Interface />}
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
