"use client";

import axios from "axios";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { useModelStatus } from "../context/ModelStatusContext";
import Img_History from "@/components/img_history";
import Text_History from "../text_history";
import "react-contexify/ReactContexify.css";
import Image from "next/image";
import { Tooltip, Button, Avatar, Switch, cn } from "@nextui-org/react";
import { Menu, Dropdown, ConfigProvider } from "antd";
import useAutosizeTextArea from "./useAutosizeTextArea";
import { apiURL } from "@/config";
import RegenerateIcon from "@/app/assets/svg/regenerate.svg";
import PrivacyPolicyModal from "./privacyPolicyModal";
import DualListBox from "./List";
import PaymentModal from "./PaymentModal";
import UpgradePaymentModal from "./UpgradePaymentModal";
import { Spinner } from "@nextui-org/react";
import ComingSoonFeature from "./coming_soon";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import {
  useLazyGetHistoryByIdQuery,
  useLazyGetImageDataByIDQuery,
  usePostChatMessageMutation,
} from "@/app/lib/features/chat/chatApi";
import {
  Bars3Icon,
  PlusIcon,
  ComputerDesktopIcon,
  TrashIcon,
  PencilIcon,
  CheckIcon,
} from "@heroicons/react/20/solid";
import useBoolean from "@/app/hooks/useBoolean";
import {
  setActiveChat,
  setChatRegenerate,
  setCurrentChatLastMsgIndex,
  setLastUnreadMsgIndex,
} from "@/app/lib/features/chat/chatSlice";
import PluginMenu from "./PluginMenu";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useCallback } from "react";
import PromptModal from "./PromptModal";
import DraggableIframe from "./DraggableIframe";
import VoiceIcon from "@/app/assets/svg/voiceIcon.svg";
import FeedBackBtn from "../Feedback/feedbackBtn";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import toast from "react-hot-toast";
import ToastService from "../Toaster/toastService";
import { VoiceRecognition } from "./VoiceRecognition";

import {
  textList,
  imgList,
  ratioList,
  defaultOptions,
  static_data,
  imgApiMapping,
} from "./chatConstants";

const Chat = ({
  chatStatus,
  chatHistoryID,
  setChatStatus,
  chatHistoryData,
  historySideData,
  setHistorySideData,
  setChatHistoryID,
  setChatTitle,
  chatTitle,
  mobileStatus,
  imgHistoryID,
  setImgHistoryID,
  imgHistoryData,
  fullName,
  setFullName,
  setToggleStatus1,
  auth,
  messageModelType,
  navigateToMessageModel,
}) => {
  const dispatch = useAppDispatch();
  const activeChatModel = useAppSelector((state) => state.chat.activeChatModel);

  const allChatDetails = useAppSelector((state) => state.chat);
  const activeWorkspace = useAppSelector(
    (state) => state.workspace.activeWorkspace
  );
  const activeGroup = useAppSelector((state) => state.group.currentActiveGroup);
  const activeChat = useAppSelector((state) => state.chat.activeChat);
  const [getHistoryByIdAPI] = useLazyGetHistoryByIdQuery();
  const [postChatMessage] = usePostChatMessageMutation();

  const [errorMessage, setErrorMessage] = useState(
    "Something went wrong if this error persist.  Please contact us through our help center at einstein.com"
  );

  const textAreaPlaceholder = useMemo(
    () => `Message ${activeChatModel?.modelName || "AI"}`,
    [activeChatModel]
  );

  const { textStatus, setTextStatus } = useModelStatus();
  const { toggleStatus, setToggleStatus } = useModelStatus();
  const { settingModel, setSettingModel } = useModelStatus();
  const [imgHistory, setImgHistory] = useState([]);
  const { imgStatus, setImgStatus } = useModelStatus();
  const [loading, setLoading] = useState(false);
  const [ratioValue, setRatioValue] = useState("0");
  const [ratio, setRatio] = useState("512x512");
  const [switchStatus, setSwitchStatus] = useState(false);
  const [selected, setSelected] = useState("GPT-3.5");
  const [imgSelected, setImgSelected] = useState("Leonardo");
  const [tabSelected, setTabSelected] = useState("");
  const [modelType, setModelType] = useState("");
  const [imgModelType, setImgModelType] = useState("");
  const [textModel, setTextModel] = useState(0);
  const [imageModelIndex, setImageModelIndex] = useState(0);
  const [type, setType] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [blur, setBlur] = useState(false);
  const [value, setValue] = useState("");
  const [id, setID] = useState();
  const [showSearch, setShowSearch] = useState(false);
  const textAreaRef = useRef(null);
  const req_qa_box = useRef(null);
  const [inputPlaceholder, setInputPlaceholder] = useState("");
  const [isPrivacyPolicyModalOpen, setIsPrivacyPolicyModalOpen] =
    useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isUpgradePaymentModalOpen, setIsUpgradePaymentModalOpen] =
    useState(false);
  const pinnedMessageRef = useRef(null);

  const [pinnedMessageMsgIndex, setPinnedMessageMsgIndex] = useState(0);
  const [pinnedMessageMsgType, setPinnedMessageMsgType] = useState("");
  const [pinnedMessageIndex, setPinnedMessageIndex] = useState(0);
  const [pinnedMessageText, setPinnedMessageText] = useState("");
  const [pinMessageVisible, setPinMessageVisible] = useState(false); // State to control visibility of pinned message
  const OnSetPinnedMessageMsgIndex = (index) => {
    setPinnedMessageMsgIndex(index);
  };
  const [textAnimationIndex, setTextAnimationIndex] = useState(-1);
  const [replyStatus1, setReplyStatus1] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyMsgIndex, setReplyMsgIndex] = useState(0);
  const [replyIndex, setReplyIndex] = useState(0);
  const [contextMenueStatus, setContextMenueStatus] = useState(false);
  const [currentMsgErrorIndex, setCurrentMsgErrorIndex] = useState(-1);
  const [pattern, setPattern] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [messageRefs, setMessageRefs] = useState([]);
  const [messageRefs1, setMessageRefs1] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
  const [selectModelData, setSelectModelData] = useState(null);
  const searchInputRef = useRef(null);
  const [fileUrl, setFileUrl] = useState();
  const [isDisabled, setIsDisabled] = useState(false);
  const [showPrompt, setshowPrompt] = useState(false);
  const [showEnterPrompt, setshowEnterPrompt] = useState(false);
  const [privatePrompts, setPrivatePrompts] = useState(static_data);
  const [promptInputTxt, setPromptInputTxt] = useState("");
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [isIframeOpen, setIsIframeOpen] = useState(false); // State to manage Iframe visibility
  const [iframeUrl, setIframeUrl] = useState(""); // State to store the URL

  const isOpenShareChats = useAppSelector(
    (state) => state.sheredChats.isOpenShareChats
  );

  const activeModalHandler = (model) => {
    // Set the URL and open the Iframe
    setIframeUrl(model.url);
    setIsIframeOpen(true);
  };

  const handleCloseIframe = () => {
    setIsIframeOpen(false); // Close the Iframe
    setIframeUrl(""); // Clear the URL
  };

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const toggleEditMode = (id) => {
    setIsEditing(!isEditing);
  };

  const regenerateRef = useRef(null);

  const spinnerStyle = {
    position: "absolute",
    top: "16px",
    left: "15px",
  };
  const onSetRatio = (value) => {
    setRatio(value);
  };
  const OnSetPinnedMessageMsgType = (value) => {
    setPinnedMessageMsgType(value);
  };

  const OnSetPinnedMessageIndex = (index) => {
    setPinnedMessageIndex(index);
  };

  const OnSetPinnedMessageText = (text) => {
    if (text !== null && text !== "") {
      setPinMessageVisible(true);
      setPinnedMessageText(text);
    } else {
      setPinMessageVisible(false);
      setPinnedMessageText(text);
    }
  };
  const handlePrivacyPolicyClick = () => {
    setIsPrivacyPolicyModalOpen(true);
  };

  useEffect(() => {
    const msgRefs = {}; // Object to store references to each message
    if (chatHistory.length != 0) {
      // Assigning references to each message
      chatHistory.forEach((messages, groupIndex) => {
        messages.forEach((message, messageIndex) => {
          msgRefs[groupIndex + "_" + messageIndex] = React.createRef();
        });
      });
      setMessageRefs(msgRefs);
    } else if (imgHistory.length != 0) {
      imgHistory.forEach((messages, groupIndex) => {
        messages.forEach((message, messageIndex) => {
          msgRefs[groupIndex + "_" + messageIndex] = React.createRef();
        });
      });
      setMessageRefs1(msgRefs);
    }
  }, [chatHistory, imgHistory]);

  useEffect(() => {
    if (currentSearchIndex !== -1 && searchResults[currentSearchIndex]) {
      const msgIndex = searchResults[currentSearchIndex][0];
      const index = searchResults[currentSearchIndex][1];
      let ref = {};
      if (imgHistory.length != 0) {
        ref = messageRefs1[msgIndex + "_" + index];
      } else {
        ref = messageRefs[msgIndex + "_" + index];
      }

      if (ref && ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [currentSearchIndex, searchResults]);

  useEffect(() => {
    const results = [];
    if (chatHistory.length != 0) {
      chatHistory.forEach((messages, groupIndex) => {
        messages.forEach((message, messageIndex) => {
          if (message?.content?.includes(pattern)) {
            results.push([groupIndex, messageIndex]);
          }
        });
      });
    } else if (imgHistory.length != 0) {
      imgHistory.forEach((messages, groupIndex) => {
        messages.forEach((message, messageIndex) => {
          if (message?.content?.includes(pattern)) {
            results.push([groupIndex, messageIndex]);
          }
        });
      });
    }

    if (results.length > 0) {
      setSearchResults(results);
      const first = results[0];
      setCurrentSearchIndex(results.length > 0 ? 0 : -1);
      // const messageRef = messageRefs[first[0] + "_" + first[1]];
      // messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [pattern]);

  const searchPrevious = () => {
    setCurrentSearchIndex((prev) =>
      prev === -1
        ? -1
        : (prev - 1 + searchResults.length) % searchResults.length
    );
  };

  const searchNext = () => {
    setCurrentSearchIndex((prev) =>
      prev === -1 ? -1 : (prev + 1) % searchResults.length
    );
  };

  const handlePinClose = () => {
    let data = JSON.stringify({
      id: chatHistoryID,
      index: pinnedMessageIndex,
      msgIndex: pinnedMessageMsgIndex,
    });
    let type = "ai";

    if (pinnedMessageMsgType == "image") {
      data = JSON.stringify({
        id: imgHistoryID,
        index: pinnedMessageIndex,
        msgIndex: pinnedMessageMsgIndex,
      });
      type = "img";
    }
    axios
      .post(`${apiURL}/${type}/unPinnedMessage`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        if (response.status == 200) {
          setPinMessageVisible(false);
        }
      })
      .catch((err) => {
        toast.error(
          (err?.message ?? err?.data?.message) || "Something went wrong!"
        );
      });

    // Function to hide pinned message when close button is clicked
  };

  const changeModal = (number) => {
    if (messageModelType == "text") {
      setReplyStatus1(false);
      setTextModel(number);
      setSelected(textList[number]);
      setInputPlaceholder(`Message ${textList[number]}`);
    } else {
      setReplyStatus1(false);
      setImageModelIndex(number);
      setImgSelected(imgList[number]);
      setInputPlaceholder(`Message ${imgList[number]}`);
    }
  };

  const handleReplyClose = () => {
    setReplyStatus1(false);
    setReplyText("");
    setReplyIndex(0);
    setReplyMsgIndex(0);
  };

  const imageMenu = (
    <div className="mb-4">
      <Menu>
        <div className="mb-4">
          <Menu.Item>
            <Tooltip
              placement="right"
              content={
                <div className="text-base text-[#FFF] font-helvetica font-normal">
                  Specializes in creating unique, imaginative images from text
                  descriptions, showcasing creative and artistic abilities.
                </div>
              }
              classNames={{
                content: ["mx-6 py-2 px-0", "bg-[#2E353C]"],
              }}
              delay={0}
              closeDelay={0}
            >
              <div
                className="flex flex-row gap-2 my-2"
                onClick={() => changeModal(0)}
              >
                <Image
                  alt="dall-e icon"
                  width={24}
                  height={24}
                  src={"/models/dall-e.png"}
                />
                <p className="text-sm font-medium text-[#FFF] leading-normal">
                  DALL - E
                </p>
              </div>
            </Tooltip>
          </Menu.Item>
          <div className="border-b border-b-[#313535]"></div>
          <Menu.Item>
            <Tooltip
              placement="right"
              content={
                <div className="text-base text-[#FFF] font-helvetica font-normal">
                  An advanced iteration known for its capability to handle
                  complex image generation tasks with high accuracy.
                </div>
              }
              classNames={{
                content: ["mx-6 py-2 px-0", "bg-[#2E353C]"],
              }}
              delay={0}
              closeDelay={0}
            >
              <div
                className="flex flex-row gap-2 my-2"
                onClick={() => changeModal(1)}
              >
                <Image
                  alt="s-diffu icon"
                  width={24}
                  height={24}
                  src={"/models/s-diffu.png"}
                />
                <p className="text-sm font-medium text-[#FFF] leading-normal">
                  Stable Diffusion XL
                </p>
              </div>
            </Tooltip>
          </Menu.Item>
          <div className="border-b border-b-[#313535]"></div>
          <Menu.Item>
            <Tooltip
              placement="right"
              content={
                <div className="text-base text-[#FFF] font-helvetica font-normal">
                  Enhanced from Stable Diffusion 2, this model excels in complex
                  image synthesis, with improved text encoding and training.{" "}
                </div>
              }
              classNames={{
                content: ["mx-6 py-2 px-0", "bg-[#2E353C]"],
              }}
              delay={0}
              closeDelay={0}
            >
              <div
                className="flex flex-row gap-2 my-2"
                onClick={() => changeModal(2)}
              >
                <Image  alt="model-img" width={24} height={24} src={"/models/s-xl.png"} />
                <p className="text-sm font-medium text-[#FFF] leading-normal">
                  Stable Diffusion 2
                </p>
              </div>
            </Tooltip>
          </Menu.Item>
          <Menu.Item>
            <Tooltip
              placement="right"
              content={
                <div className="text-base text-[#FFF] font-helvetica font-normal">
                  Enhanced from Leonardo, this model excels in complex image
                  synthesis, with improved text encoding and training.{" "}
                </div>
              }
              classNames={{
                content: ["mx-6 py-2 px-0", "bg-[#2E353C]"],
              }}
              delay={0}
              closeDelay={0}
            >
              <div
                className="flex flex-row gap-2 my-2"
                onClick={() => changeModal(3)}
              >
                <Image
                  alt="leonardo-diffusion icon"
                  width={24}
                  height={24}
                  src={"/models/leonardo-diffusion-xl.png"}
                />
                <p className="text-sm font-medium text-[#FFF] leading-normal">
                  Leonardo
                </p>
              </div>
            </Tooltip>
          </Menu.Item>
        </div>
      </Menu>
    </div>
  );

  const textMenu = (
    <div className="mb-4">
      <Menu>
        <div className="mb-4">
          <Menu.Item>
            <Tooltip
              placement="right"
              content={
                <div className="text-base text-[#FFF] font-helvetica font-normal">
                  OpenAI’s top model, great with writing and math
                </div>
              }
              classNames={{
                content: ["mx-6 py-2 px-0", "bg-[#2E353C]"],
              }}
              delay={0}
              closeDelay={0}
            >
              <div
                className="flex flex-row gap-2 my-2"
                onClick={() => changeModal(1)}
              >
                <Image
                  alt="gpt4 icon"
                  width={24}
                  height={24}
                  src={"/models/gpt4.png"}
                />
                <p className="text-sm font-medium text-[#FFF] leading-normal">
                  ChatGPT - 4
                </p>
              </div>
            </Tooltip>
          </Menu.Item>
          <div className="border-b border-b-[#313535]"></div>
          <Menu.Item>
            <Tooltip
              placement="right"
              content={
                <div className="text-base text-[#FFF] font-helvetica font-normal">
                  Googles top model, great with writing and math
                </div>
              }
              classNames={{
                content: ["mx-6 py-2 px-0", "bg-[#2E353C]"],
              }}
              delay={0}
              closeDelay={0}
            >
              <div
                className="flex flex-row gap-2 my-2"
                onClick={() => changeModal(2)}
              >
                <Image
                  alt="gemini icon"
                  width={24}
                  height={24}
                  src={"/models/gemini.png"}
                />
                <p className="text-sm font-medium text-[#FFF] leading-normal">
                  Gemini
                </p>
              </div>
            </Tooltip>
          </Menu.Item>
          <div className="border-b border-b-[#313535]"></div>
          <Menu.Item>
            <Tooltip
              placement="right"
              content={
                <div className="text-base text-[#FFF] font-helvetica font-normal">
                  Has access to the internet and is always up to date
                </div>
              }
              classNames={{
                content: ["mx-6 py-2 px-0", "bg-[#2E353C]"],
              }}
              delay={0}
              closeDelay={0}
            >
              <div
                className="flex flex-row gap-2 my-2"
                onClick={() => changeModal(3)}
              >
                <Image
                  alt="perplexity icon"
                  width={24}
                  height={24}
                  src={"/models/perplexity.png"}
                />
                <p className="text-sm font-medium text-[#FFF] leading-normal">
                  Perplexity
                </p>
              </div>
            </Tooltip>
          </Menu.Item>
          <div className="border-b border-b-[#313535]"></div>
          <Menu.Item>
            <Tooltip
              placement="right"
              content={
                <div className="text-base text-[#FFF] font-helvetica font-normal">
                  Great for quick and concise answers
                </div>
              }
              classNames={{
                content: ["mx-6 py-2 px-0", "bg-[#2E353C]"],
              }}
              delay={0}
              closeDelay={0}
            >
              <div
                className="flex flex-row gap-2 my-2"
                onClick={() => changeModal(0)}
              >
                <Image
                  alt="gpt3 icon"
                  width={24}
                  height={24}
                  src={"/models/gpt3.png"}
                />
                <p className="text-sm font-medium text-[#FFF] leading-normal">
                  ChatGPT - 3.5
                </p>
              </div>
            </Tooltip>
          </Menu.Item>
          <div className="border-b border-b-[#313535]"></div>
          <Menu.Item>
            <Tooltip
              placement="right"
              content={
                <div className="text-base text-[#FFF] font-helvetica font-normal">
                  Great for quick responses
                </div>
              }
              classNames={{
                content: ["mx-5 py-2 px-0", "bg-[#2E353C]"],
              }}
              delay={0}
              closeDelay={0}
            >
              <div
                className="flex flex-row gap-2 my-2"
                onClick={() => changeModal(4)}
              >
                <Image
                  alt="mistral icon"
                  width={24}
                  height={24}
                  src={"/models/mistral.png"}
                />
                <p className="text-sm font-medium text-[#FFF] leading-normal">
                  Mistral
                </p>
              </div>
            </Tooltip>
          </Menu.Item>
          <Menu.Item>
            <Tooltip
              placement="right"
              content={
                <div className="text-base text-[#FFF] font-helvetica font-normal">
                  Collect your thoughts with Claude
                </div>
              }
              classNames={{
                content: ["mx-5 py-2 px-0", "bg-[#2E353C]"],
              }}
              delay={0}
              closeDelay={0}
            >
              <div
                className="flex flex-row gap-2 my-2"
                onClick={() => changeModal(5)}
              >
                <Image
                  alt="claude icon"
                  width={24}
                  height={24}
                  src={"/models/claude.png"}
                />
                <p className="text-sm font-medium text-[#FFF] leading-normal">
                  Claude
                </p>
              </div>
            </Tooltip>
          </Menu.Item>
          <div className="border-b border-b-[#313535]"></div>
          <Menu.Item>
            <Tooltip
              placement="right"
              content={
                <div className="text-base text-[#FFF] font-helvetica font-normal">
                  Auto selects the best model for you (coming soon!)
                </div>
              }
              classNames={{
                content: ["mx-5 py-2 px-0", "bg-[#2E353C]"],
              }}
              delay={0}
              closeDelay={0}
            >
              <div
                className="flex flex-row gap-2 my-2"
                onClick={() => changeModal(Math.floor(Math.random() * 5))}
              >
                <Image
                  alt="auto icon"
                  width={24}
                  height={24}
                  src={"/models/auto.png"}
                />
                <p className="text-sm font-medium text-[#FFF] leading-normal">
                  Auto select
                </p>
              </div>
            </Tooltip>
          </Menu.Item>
        </div>
      </Menu>
    </div>
  );

  useEffect(() => {
    setFullName(auth.user.fullname);
    if (switchStatus == true) return;
    else
      setTimeout(() => {
        req_qa_box.current.scrollTop = req_qa_box.current.scrollHeight;
      }, 0);
  }, [chatHistory, switchStatus, imgHistory, activeWorkspace]);

  useEffect(() => {
    setModelType(selected);
    setInputPlaceholder(`Message ${selected}`);
  }, [selected]);

  useEffect(() => {
    setImgModelType(imgSelected);
    setInputPlaceholder(`Message ${imgSelected}`);
  }, [imgSelected]);

  useEffect(() => {
    setChatHistory(chatHistoryData);
  }, [chatHistoryData]);

  useEffect(() => {
    setImgHistory(imgHistoryData);
  }, [imgHistoryData]);

  useEffect(() => {
    if (chatTitle == "New Chat") {
      setPinMessageVisible(false);
      setPinnedMessageText("");
      setPinnedMessageMsgType("");
      setPinnedMessageIndex(0);
      setPinnedMessageMsgIndex(0);
    }
  }, [chatTitle, activeWorkspace]);

  useEffect(() => {
    const getAuthMember =
      activeWorkspace?.members?.length > 0 &&
      activeWorkspace?.members?.find(
        (member) => member.user_id === auth?.user?.userID
      );

    if (messageModelType !== "video" && messageModelType !== "audio") {
      if (messageModelType == "text") {
        setShowSearch(false);
        setPattern("");
        if (!!activeChat?.id) {
          setID("");
          GetHistoryDataByID(activeChat.id);
          setPinMessageVisible(false);
        }
        if (
          getAuthMember?.role !== "owner" &&
          getAuthMember?.permission_type === "view"
        ) {
          setIsDisabled(true);
        }
        const textListIndex = textList.indexOf(selected);
        setTextModel(textListIndex);

        setInputPlaceholder(`Message ${textList[textListIndex || 0]}`);
      } else {
        setShowSearch(false);
        setPattern("");
        setPinMessageVisible(false);

        if (imgHistoryID != "") {
          setID("");
          GetHistoryDataByID(imgHistoryID);
        }
        const imgListIndex = imgList.indexOf(imgSelected);
        setImageModelIndex(imgListIndex);
        setInputPlaceholder(`Message ${imgList[imgListIndex || 0]}`);
      }
      setReplyStatus1(false);
      setReplyText("");
      setReplyIndex(0);
      setReplyMsgIndex(0);
      if (messageModelType == "image") {
        setFileUrl("");
        setFilePreviews([]);
      }
    }
  }, [
    chatHistoryID,
    imgHistoryID,
    messageModelType,
    activeWorkspace,
    activeChat,
  ]);
  useEffect(() => {
    textAreaRef.current.focus();
  });
  useAutosizeTextArea(textAreaRef.current, value);

  const GetHistoryDataByID = (id) => {
    if (id !== -1) {
      setCurrentMsgErrorIndex(-1);
      setReplyStatus1(false);
      if (messageModelType == "text") {
        getHistoryByIdAPI(id)
          .unwrap()
          .then((response) => {
            let a = [];
            dispatch(
              setLastUnreadMsgIndex({
                last_read_index: response?.last_read_index,
                chat_id: response?.data?._id,
              })
            );
            dispatch(
              setCurrentChatLastMsgIndex(response?.data?.history?.length - 1)
            );
            response.data.history.forEach((item, msgIndex) => {
              if (item?.length) {
                item.forEach((message, index) => {
                  if (message.pinned) {
                    setPinMessageVisible(true);
                    setPinnedMessageMsgIndex(msgIndex);
                    setPinnedMessageIndex(index);
                    setPinnedMessageText(message.content);
                  }
                });
              }
            });
            const textListIndex = textList.indexOf(response.data.type);
            setTextModel(textListIndex);

            setType(response.data.type);
            setSelected(textList[textListIndex]);
            setInputPlaceholder(`Message ${response.data.type}`);
            setChatHistory(response.data.history);
            setTextAnimationIndex(-1);
            const _idx = historySideData.findIndex((x) => x.id == -1);
            if (_idx > -1) {
              historySideData.splice(_idx, 1);
              setHistorySideData([...historySideData]);
            }
          });
      } else {
        getImageDataByID(id)
          .unwrap()
          .then((response) => {
            response.data.history.forEach((item, msgIndex) => {
              item.forEach((message, index) => {
                if (message.pinned) {
                  setPinMessageVisible(true);
                  setPinnedMessageMsgIndex(msgIndex);
                  setPinnedMessageIndex(index);
                  setPinnedMessageText(message.content);
                }
              });
            });
            const imgListIndex = imgList.indexOf(response.data.type);
            setImageModelIndex(imgListIndex);
            setImgSelected(imgList[imgListIndex]);
            setInputPlaceholder(`Message ${response.data.type}`);
            setImgModelType(response.data.type);
            setImgHistory(response.data.history);
            const _idx = historySideData.findIndex((x) => x.id == -1);
            if (_idx > -1) {
              historySideData.splice(_idx, 1);
              setHistorySideData([...historySideData]);
            }
          });
      }
      setIsDisabled(false);
    }
  };

  function removeTypeAndPinnedField(obj) {
    delete obj.type;
    delete obj.pinned;
    delete obj.reply;
    delete obj.file_url;
    return obj;
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (messageModelType == "text") {
        if (auth && auth?.user && auth?.user?.email && activeChat?.id) {
          TextGenerateUsingSocket();
        } else {
          if (value != "") TextGenerate();
        }
      } else {
        if (value != "") ImageGenerate();
        else return;
      }
    }
  };

  const handleChange = (event) => {
    const value = event.target?.value || "";
    !/^\s+/.test(value) && setValue(value);
  };

  const apiMapping = {
    "GPT-4": "gpt4",
    "GPT-3.5": "gpt3",
    Gemini: "gemini",
    Mistral: "mistral",
    Perplexity: "perplexity",
    Claude: "claude",
  };

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const workspace_id_route = searchParams.get("workspace");
  const param = useParams();

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const TextGenerate = () => {
    if (auth && auth?.user && auth?.user?.email && activeChat?.id) {
      TextGenerateUsingSocket();
    } else {
      if (value?.length) {
        setSwitchStatus(false);
        setChatStatus(true);
        let newHistory = [...chatHistory];

        const userContent = { role: "user", content: value };
        const loadingContent = { role: "loading" };

        if (fileUrl && fileUrl.trim() !== "") {
          userContent.file_url = fileUrl;
        }

        if (replyStatus1 === true && replyText && replyText.trim() !== "") {
          userContent.reply = replyText;
        }

        newHistory.push([userContent, loadingContent]);
        const loadingIndex = chatHistoryID == "" ? 0 : newHistory.length - 1;
        setTextAnimationIndex(loadingIndex);
        setChatHistory(newHistory);

        const handleResponse = (response, modelType, chatHistoryID) => {
          if (loadingIndex != -1) {
            if (response.id) {
              getHistoryByIdAPI(response.id)
                .unwrap()
                .then((res) => {
                  dispatch(
                    setActiveChat({
                      id: response.id,
                      pinned: res.data.pinned,
                      thumbnail_url: res.data.thumbnail_url,
                      title: res.data.chat_title,
                    })
                  );
                  router.push(
                    pathname + "?" + createQueryString("chat", response.id)
                  );
                })
                .catch((err) => {
                  dispatch(setActiveChat({ id: response.id }));
                  router.push(
                    pathname + "?" + createQueryString("chat", response.id)
                  );
                });
            }
            const updatedItem = [...newHistory[loadingIndex]];
            updatedItem[1].role = "assistant";
            updatedItem[1].content = response.data;
            updatedItem[1].type = modelType;
            updatedItem[1].tool_id = response.tool_id;

            const updatedHistory = [...newHistory];
            updatedHistory[loadingIndex] = updatedItem;

            setChatHistory(updatedHistory);

            if (chatHistoryID == "") {
              const _idx = historySideData.findIndex((x) => x.id == -1);
              if (_idx > -1) {
                historySideData.splice(_idx, 1);
              }
              setHistorySideData([
                {
                  id: response.id,
                  title: value,
                  bot: response.data,
                  date: response.date,
                  thumbnail_url: response.thumbnail_url,
                },
                ...historySideData,
              ]);
              setChatTitle(value);
            }
            setChatHistoryID(response.id);
          }
        };

        const requestData = {
          prompt: value,
          id: chatHistoryID,
          type: activeChatModel?.modelName,
          userID: auth.user.userID,
          // workspace_id: activeWorkspace?._id,
          workspace_id: isOpenShareChats
            ? activeChat.workspace_id
              ? activeChat.workspace_id
              : activeWorkspace?._id
            : activeWorkspace?._id,
          group_id: activeGroup?._id,
          ...(fileUrl && { file_url: fileUrl }),
          ...(replyStatus1 && { reply: replyText }),
        };

        if (chatHistoryID !== "") {
          const pastHistory = chatHistory.map((innerArray) =>
            innerArray.map((item) => {
              const newItem = { ...item }; // Create a new object to avoid modifying the original item
              if (Array.isArray(newItem.content)) {
                newItem.content = newItem.content[newItem.content.length - 1]; // Get the last item from the array as a string
              }
              return removeTypeAndPinnedField(newItem);
            })
          );

          requestData.pasthistory = pastHistory.flat();
        }

        setValue("");
        setFileUrl("");
        setBlur(false);
        if (replyStatus1 == true) {
          setReplyStatus1(false);
          setReplyMsgIndex(0);
          setReplyText("");
          setReplyIndex(0);
        }

        const apiName = activeChatModel?.modelValue;
        if (apiName) {
          setCurrentMsgErrorIndex(-1);
          setFilePreviews([]);
          setIsDisabled(true);

          // Set up timeout promise
          const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
              reject(new Error("Timeout"));
            }, 30000); // 30 seconds timeout
          });

          dispatch(
            setChatRegenerate({
              canRegenerate: false,
              isRegenerating: false,
            })
          );
          // Make API call and race it with timeout
          Promise.race([
            postChatMessage({
              apiName,
              requestData: JSON.stringify(requestData),
            }).unwrap(),
            timeoutPromise,
          ])
            .then((response) =>
              handleResponse(response, selected, chatHistoryID)
            )
            .catch((error) => {
              toast.error(error?.data?.message);
              if (error.response && error.response.status === 403) {
                if (auth.user.plan == "free") {
                  setIsUpgradePaymentModalOpen(true);
                } else {
                  setIsPaymentModalOpen(true);
                }
              } else if (error.message === "Timeout") {
                setCurrentMsgErrorIndex(loadingIndex);
                const updatedItem = [...newHistory[loadingIndex]];
                updatedItem[1].role = "assistant";
                updatedItem[1].content = "Refresh or Regenerate the response";
                updatedItem[1].type = modelType;
                updatedItem[1].isError = true;
                const updatedHistory = [...newHistory];
                updatedHistory[loadingIndex] = updatedItem;
                setChatHistory(updatedHistory);
                dispatch(
                  setChatRegenerate({
                    canRegenerate: true,
                    isRegenerating: false,
                  })
                );
              } else {
                setCurrentMsgErrorIndex(loadingIndex);
                const updatedItem = [...newHistory[loadingIndex]];
                updatedItem[1].role = "assistant";
                updatedItem[1].content =
                  error?.response?.data?.message ||
                  error?.message ||
                  errorMessage;
                updatedItem[1].type = modelType;
                updatedItem[1].isError = true;
                const updatedHistory = [...newHistory];
                updatedHistory[loadingIndex] = updatedItem;
                setChatHistory(updatedHistory);
                dispatch(
                  setChatRegenerate({
                    canRegenerate: true,
                    isRegenerating: false,
                  })
                );
                // Handle other errors
                console.error("An error occurred:", error.message);
              }
            })
            .finally(() => {
              setIsDisabled(false);
            });
        }
      }
    }
  };

  const ImageGenerate = () => {
    if (value?.length) {
      setSwitchStatus(false);
      setChatStatus(true);
      let newHistory = [...imgHistory];
      newHistory.push([{ role: "user", content: value }, { role: "loading" }]);
      setImgHistory(newHistory);
      const loadingIndex = newHistory.findIndex(
        (item) => item[1].role == "loading"
      );

      const handleResponse = (response, modelType, prompt, image_ratio) => {
        if (loadingIndex !== -1 && response.data) {
          const updatedItem = [...newHistory[loadingIndex]];
          updatedItem[1].role = "assistant";
          updatedItem[1].content = response.data.data;
          updatedItem[1].type = modelType;
          updatedItem[1].size = image_ratio;
          const updatedHistory = [...newHistory];
          updatedHistory[loadingIndex] = updatedItem;

          setImgHistory(updatedHistory);
          setImgHistoryID(response.data.id);

          if (imgHistoryID == "") {
            const _idx = historySideData.findIndex((x) => x.id == -1);
            if (_idx > -1) {
              historySideData.splice(_idx, 1);
            }
            setHistorySideData([
              {
                id: response.data.id,
                title: prompt,
                date: response.data.date,
                thumbnail_url: response.data.thumbnail_url,
              },
              ...historySideData,
            ]);
          }
        }
      };

      const requestData = {
        prompt: value,
        type: imgHistoryID == "" ? imgSelected : imgModelType,
        id: imgHistoryID == "" ? "" : imgHistoryID,
        userID: auth.user.userID,
        size: ratio,
        // workspace_id: activeWorkspace,
        workspace_id: isOpenShareChats
          ? activeChat.workspace_id
            ? activeChat.workspace_id
            : activeWorkspace
          : activeWorkspace,
      };

      if (imgHistoryID == "") {
        setChatTitle(value);
      }

      const apiUrl =
        imgHistoryID == ""
          ? `${apiURL}/img/${imgApiMapping[imgSelected]}`
          : `${apiURL}/img/${imgApiMapping[imgModelType]}`;

      setValue("");

      setIsDisabled(true);
      axios
        .post(apiUrl, JSON.stringify(requestData), {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          const image_ratio = ratio;
          handleResponse(
            response,
            requestData.type,
            requestData.prompt,
            image_ratio
          );
        })
        .catch((error) => {
          if (error.response && error.response.status === 403) {
            if (auth.user.plan == "free") {
              setIsUpgradePaymentModalOpen(true);
            } else {
              setIsPaymentModalOpen(true);
            }
          } else {
            const updatedItem = [...newHistory[loadingIndex]];
            updatedItem[1].role = "assistant";
            updatedItem[1].content = error.message || errorMessage;
            updatedItem[1].type = modelType;

            const updatedHistory = [...newHistory];
            updatedHistory[loadingIndex] = updatedItem;
            setImgHistory(updatedHistory);
            // Handle other errors
            console.error("An error occurred:", error.message);
            toast.error(
              (err?.message ?? err?.data?.message) || "Something went wrong!"
            );
          }
        })
        .finally(() => {
          setIsDisabled(false);
        });
    }
  };

  const clearHistory = () => {
    setChatHistory([]);
  };
  const clearInput = () => {
    setValue("");
  };

  const handleSelectionChange = (e) => {
    setRatioValue(e.target.value);
    setRatio(ratioList[e.target.value]);
  };

  const onClickPinnedMessage = (pinnedMessageIndex, pinnedMessageMsgIndex) => {
    let ref = {};
    if (imgHistory.length != 0) {
      ref = messageRefs1[pinnedMessageIndex + "_" + pinnedMessageMsgIndex];
    } else if (chatHistory.length != 0) {
      ref = messageRefs[pinnedMessageIndex + "_" + pinnedMessageMsgIndex];
    }
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const OnCheckEditPinnedMessage = (msgIndex, Index, type, currentText) => {
    if (type == "text" && pinnedMessageMsgType == "text") {
      if (pinnedMessageMsgIndex >= msgIndex && pinnedMessageIndex > Index) {
        setPinMessageVisible(false);
        setPinnedMessageIndex(0);
        setPinnedMessageMsgIndex(0);
        setPinnedMessageMsgType(null);
        setPinnedMessageText("");
      } else if (
        pinnedMessageMsgIndex == msgIndex &&
        pinnedMessageIndex == Index
      ) {
        setPinnedMessageText(currentText);
      }
    } else {
      if (pinnedMessageMsgIndex >= msgIndex && pinnedMessageIndex == Index) {
        setPinMessageVisible(false);
        setPinnedMessageIndex(0);
        setPinnedMessageMsgIndex(0);
        setPinnedMessageMsgType(null);
        setPinnedMessageText("");
      } else if (
        pinnedMessageMsgIndex == msgIndex &&
        pinnedMessageIndex == Index
      ) {
        setPinnedMessageText(currentText);
      }
    }
  };

  const OnSetModalType = (type) => {
    setTextModel(textList.indexOf(type));
    setInputPlaceholder(`Message ${type}`);
    setSelected(type);
  };

  const handleShowSearch = () => {
    setShowSearch(!showSearch);
  };

  const OnSetToggleStatus = (value) => {
    setToggleStatus1(value);
  };

  const OnSetCurrentMsgErrorIndex = (index) => {
    setCurrentMsgErrorIndex(index);
  };
  const OnSetReplyStatus = (status, index, msgIndex, text) => {
    if (status) {
      setReplyStatus1(status);
      setReplyText(text);
      setReplyIndex(index);
      setReplyMsgIndex(msgIndex);
    }
  };

  const OnSetContextMenueStatus = (value) => {
    setContextMenueStatus(value);
  };

  const OnSetIsUpgradePaymentModalOpen = (value) => {
    setIsUpgradePaymentModalOpen(value);
  };

  const OnSetIsPaymentModalOpen = (value) => {
    setIsPaymentModalOpen(value);
  };

  const fileInputRef = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [uploading, setUploading] = useState(false); // State for showing loader

  const handleImageClick = () => {
    fileInputRef.current.click(); // Simulate click on file input
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;
    const uploadedFilesArray = [];
    const filePreviewsArray = [];

    setUploading(true); // Show loader while uploading
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      uploadedFilesArray.push(file);

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          filePreviewsArray.push({
            name: file.name,
            type: file.type,
            preview: reader.result,
          });
          if (filePreviewsArray.length === files.length) {
            setFilePreviews([...filePreviewsArray]);
            // Hide loader after upload is complete
          }
        };
        reader.readAsDataURL(file);
      } else {
        filePreviewsArray.push({
          name: file.name,
          type: file.type,
          preview: null,
        });
        if (filePreviewsArray.length === files.length) {
          setFilePreviews([...filePreviewsArray]);
        }
      }
    }
    fileUpload(uploadedFilesArray);
    setUploadedFiles(files);
  };

  const fileUpload = (uploadFiles) => {
    const formData = new FormData();
    uploadFiles.forEach((file) => {
      formData.append("files", file);
    });

    axios
      .post(`${apiURL}/ai/uploadFile`, formData, {
        headers: {
          accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setUploading(false);
        if (response.status == 200) {
          setFileUrl(response?.data?.urls[0]);
        }
      })
      .catch((error) => {
        setUploading(false);
        setFilePreviews([]);
        toast.error(error?.message || "There's some issue please upload again");
      });
  };

  useEffect(() => {
    return () => {
      // Clear uploaded files and previews when component unmounts
      setUploadedFiles([]);
      setFilePreviews([]);
    };
  }, []);

  const getFileIcon = (fileType) => {
    if (fileType === "application/pdf") {
      return "/mc-file-pdf.png"; // Emoji for PDF icon
    } else if (fileType === "text/plain") {
      return "/mc-file-document.png"; // Emoji for text file icon
    } else if (fileType === "application/xls") {
      return "/mc-file-spreadsheet.png"; // Default emoji for other file types
    } else {
      return "/mc-file-pack.png";
    }
  };

  const regenerateMsgHandler = () => {
    if (regenerateRef.current) {
      regenerateRef.current.Regenerate(
        chatHistory.length - 1,
        chatHistoryID,
        modelType
      );
    }
  };

  const [isReplyText, setIsReplyText] = useState({
    open: false,
    msgIndex: null,
    text: "",
  });

  // Socket
  const ws = useAppSelector((state) => state.webSocket.ws);
  const connected = useAppSelector((state) => state.webSocket.connected);
  const messages = useAppSelector((state) => state.webSocket.messages);

  useEffect(() => {
    if (messages) {
      const currentChatId = activeChat?.id ?? "";

      if (
        messages?.hasOwnProperty("action") &&
        (messages?.action === "chat" || messages?.source === "inputBox")
      ) {
        if (
          messages?.hasOwnProperty("prompt") &&
          messages?.hasOwnProperty("user")
        ) {
          if (messages?.id === currentChatId) {
            // setChatHistory((pre) => [...pre, [{ role: "user", content: messages?.prompt ?? "", user_id: messages?.user?._id ?? "", user: messages?.user, reply: messages?.reply ?? "" }, { role: "loading", user_id: messages?.user?._id ?? "" }]]);
            setChatHistory((prev) => {
              const isLoadingPresent = prev?.some(
                ([entry]) =>
                  entry?.role === "loading" &&
                  entry?.user_id === messages?.user?._id
              );

              if (!isLoadingPresent) {
                return [
                  ...prev,
                  [
                    {
                      role: "user",
                      content: messages?.prompt ?? "",
                      user_id: messages?.user?._id ?? "",
                      user: messages?.user,
                      reply: messages?.reply ?? "",
                    },
                    {
                      role: "loading",
                      user_id: messages?.user?._id ?? "",
                    },
                  ],
                ];
              }

              return prev;
            });

            setValue("");
            setIsDisabled(true);
            setReplyStatus1(false);
          }
        } else if (
          // Regeneration block
          messages?.hasOwnProperty("content") &&
          messages?.hasOwnProperty("status_code")
        ) {
          if (messages?.status_code === 200) {
            if (messages?.content?.id === currentChatId) {
              setChatHistory((pre) => {
                const updatedItem = pre?.map((pre_item) => {
                  if (
                    pre_item[1]?.user_id === messages?.content?.user_id &&
                    pre_item[1]?.role === "loading"
                  ) {
                    return pre_item?.map((x) =>
                      x?.role === "loading"
                        ? {
                            ...x,
                            role: "assistant",
                            content: messages?.content?.data,
                            type: messages?.model ?? "",
                            tool_id: messages?.tool_id,
                          }
                        : x
                    );
                  } else {
                    return pre_item;
                  }
                });
                return updatedItem;
              });
            }
            // Error Handling
          } else if (
            messages?.status_code === 403 ||
            messages?.status_code === 500
          ) {
            if (messages?.id === currentChatId) {
              setChatHistory((pre) => {
                const updatedItem = pre?.map((pre_item, index) => {
                  if (
                    pre_item[1]?.user_id === messages?.user_id &&
                    pre_item[1]?.role === "loading"
                  ) {
                    setCurrentMsgErrorIndex(index);
                    return pre_item?.map((x) =>
                      x?.role === "loading"
                        ? {
                            ...x,
                            role: "assistant",
                            content: messages?.content?.message,
                            isError: true,
                            type: messages?.model ?? "",
                          }
                        : x
                    );
                  } else {
                    return pre_item;
                  }
                });
                return updatedItem;
              });
            }
          }
          setIsDisabled(false);
          setReplyStatus1(false);
        }
      }
    }
  }, [messages]);

  const TextGenerateUsingSocket = () => {
    const workspace_id_local = localStorage.getItem("workspace_id");
    if (value?.length && isDisabled === false) {
      if (connected && ws?.readyState === WebSocket.OPEN) {
        const data = {
          action: activeChatModel?.category === "model" ? "model_chat" : "chat",
          endpoint:
            activeChatModel?.category === "model"
              ? "model"
              : activeChatModel?.modelValue ?? "",
          request: {
            userID: auth?.user?.userID,
            type: activeChatModel?.modelName ?? "",
            prompt: value,
            workspace_id: isOpenShareChats // If it's sharedchat 
              ? activeChat.workspace_id
              : workspace_id_local // Some time workspace_id is not coming instead of it's showing in id key (Case: when we create new workspace then second message is not sending)
              ? workspace_id_local
              : activeChat.workspace_id // Some time workspace_id is not coming instead of it's showing in id key (Case: when we create new workspace then second message is not sending)
              ? activeChat.workspace_id
              : activeWorkspace?._id,
            group_id: activeGroup?._id ?? "",
            id: activeChat?.id ?? "",
            ...(fileUrl && { file_url: fileUrl }),
            ...(replyStatus1 && { reply: replyText }),
            tool_id: activeChatModel?.id,
            index: 0,
            source: "inputBox",
          },
        };
        ws?.send(JSON.stringify(data));

        setValue("");
        setIsDisabled(true);
        setReplyStatus1(false);
      }
    }
  };

  const clickPromptOpt = (prompt) => {
    setValue(prompt.text);
  };
  const handleTypePrompt = (text) => {
    setPromptInputTxt(text);
  };

  const handleAddPrompt = () => {
    setPrivatePrompts([{ text: promptInputTxt }, ...privatePrompts]);
    setPromptInputTxt("");
    setshowEnterPrompt(false);
  };
  const handleEditClick = (item) => {
    setEditingId(item.id);
    setText(item.text);
  };

  const handleDeleteClick = (id) => {
    setPrivatePrompts(privatePrompts.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setText("");
    }
  };

  const handleKeyDownPrompt = (e, index, item) => {
    if (e.key === "Enter") {
      privatePrompts.splice(index, 1, { id: item.id, text: text });
      setPrivatePrompts([...privatePrompts]);
      setEditingId(null);
      setText("");
    }
  };

  const msgRefs = useRef([]);

  return (
    <div
      className={`flex flex-1 flex-col max-mlg:px-2 ${
        mobileStatus == true ? "" : "max-mlg:hidden"
      }`}
    >
      {isIframeOpen && (
        <DraggableIframe url={iframeUrl} onClose={handleCloseIframe} />
      )}
      <div
        className="overflow-y-auto w-full pt-[60px] max-msm:pt-5 h-calc-180px outline-none"
        ref={req_qa_box}
      >
        {activeChatModel?.isCustomModel &&
        !chatStatus &&
        activeChatModel?.url &&
        activeChatModel?.token ? (
          <div className=" rounded-[20px] max-w-[860px]  w-full mx-auto my-auto h-full flex justify-center flex-col 2xl:max-w-[1109px] xl:max-w-[860px] lg:max-w-[860px]">
            {messageModelType == "text" ? (
              <>
                <div className="flex items-center justify-center">
                  <Switch
                    defaultSelected
                    color="default"
                    classNames={{
                      wrapper:
                        "border-2 border-[#5F5F5F] !bg-[transparent] h-9 w-16",
                      thumb: cn(
                        "w-6 h-6 border-2 shadow-lg",
                        "bg-[#5F5F5F] border-[#5F5F5F]",
                        "group-data-[selected=true]:ml-7"
                      ),
                    }}
                  >
                    <div className="text-[#5F5F5F] text-4xl font-normal font-helvetica">
                      Let’s make something.
                    </div>
                  </Switch>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-[41.52px] font-normal leading-normal font-nasalization text-[#6B6B6B] mb-[30px]">
                  What image should I make?
                </h2>

                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col bg-[#1B1E24] rounded-[20px] w-full mx-auto my-auto px-5 py-6 text-[#D0D0D0] text-[18px] leading-normal font-helvetica">
                    “Tarzan riding a lion”
                  </div>
                  <div className="flex flex-col bg-[#1B1E24] rounded-[20px] w-full mx-auto my-auto px-5 py-6 text-[#D0D0D0] text-[18px] leading-normal font-helvetica">
                    &quot;Detailed oil painting of Muhammad Ali&quot;
                  </div>
                  <div className="flex flex-col bg-[#1B1E24] rounded-[20px] w-full mx-auto my-auto px-5 py-6 text-[#D0D0D0] text-[18px] leading-normal font-helvetica">
                    &quot;Modern home in the hills of jungle&quot;
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            {blur ? (
              <div
                className={`z-10 fixed w-full h-[calc(100vh-140px)] backdrop-blur-[7px]`}
              ></div>
            ) : null}
            {chatStatus == true ? (
              messageModelType == "text" ? (
                <div className="flex flex-col w-full max-w-[920px] mx-auto max-mxl:max-w-[900px] max-mlg:max-w-[800px] max-xl:max-w-[600px] max-msm:max-w-[360px] max-msm:mx-auto">
                  {chatHistory.map((messages, msgIndex) => (
                    <div
                      key={msgIndex}
                      className="message-group"
                      ref={(el) => {
                        msgRefs.current[msgIndex] = el;
                      }}
                      data-index={msgIndex}
                    >
                      <span
                        key={msgIndex}
                        ref={messageRefs ? messageRefs[msgIndex] : null}
                      >
                        <Text_History
                          isReplyText={isReplyText}
                          setIsReplyText={setIsReplyText}
                          key={msgIndex}
                          ref={regenerateRef}
                          msgIndex={msgIndex}
                          chatData={messages}
                          chatHistory={chatHistory}
                          chatHistoryID={chatHistoryID}
                          id={id}
                          index={msgIndex}
                          loading={loading}
                          setChatHistory={setChatHistory}
                          setLoading={setLoading}
                          setSwitchStatus={setSwitchStatus}
                          setID={setID}
                          type={type}
                          setBlur={setBlur}
                          blur={blur}
                          setPinnedMessageText={OnSetPinnedMessageText}
                          setPinnedMessageIndex={OnSetPinnedMessageIndex}
                          setPinnedMessageMsgIndex={OnSetPinnedMessageMsgIndex}
                          setPinnedMessageMsgType={OnSetPinnedMessageMsgType}
                          checkEditPinnedMessage={OnCheckEditPinnedMessage}
                          setModelType={OnSetModalType}
                          setTextAnimationIndex={setTextAnimationIndex}
                          textAnimationIndex={textAnimationIndex}
                          setToggleStatus={OnSetToggleStatus}
                          setReplyStatus={OnSetReplyStatus}
                          setContextMenueStatus={OnSetContextMenueStatus}
                          contextMenueStatus={contextMenueStatus}
                          setCurrentMsgErrorIndex={OnSetCurrentMsgErrorIndex}
                          currentMsgErrorIndex={currentMsgErrorIndex}
                          errorMessage={errorMessage}
                          pattern={pattern}
                          setIsUpgradePaymentModalOpen={
                            OnSetIsUpgradePaymentModalOpen
                          }
                          auth={auth}
                          setIsPaymentModalOpen={OnSetIsPaymentModalOpen}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              ) : messageModelType === "image" ? (
                <div className="flex flex-col w-full max-w-[920px] mx-auto max-mxl:max-w-[900px] max-mlg:max-w-[800px] max-xl:max-w-[600px] max-msm:max-w-[360px] max-msm:mx-auto">
                  {imgHistory.map((data, msgIndex) => (
                    <div key={msgIndex} className="message-group">
                      {/* {data.map((image_data, index) => ( */}
                      <span
                        key={msgIndex}
                        ref={messageRefs1 ? messageRefs1[msgIndex] : null}
                      >
                        <Img_History
                          chatData={data}
                          msgIndex={msgIndex}
                          imgHistory={imgHistory}
                          imgHistoryID={imgHistoryID}
                          id={id}
                          index={msgIndex}
                          setTabSelected={setTabSelected}
                          loading={loading}
                          setImgHistory={setImgHistory}
                          setLoading={setLoading}
                          setSwitchStatus={setSwitchStatus}
                          setID={setID}
                          tabSelected={tabSelected}
                          ratio={ratio}
                          setPinnedMessageText={OnSetPinnedMessageText}
                          setPinnedMessageIndex={OnSetPinnedMessageIndex}
                          setPinnedMessageMsgIndex={OnSetPinnedMessageMsgIndex}
                          setPinnedMessageMsgType={OnSetPinnedMessageMsgType}
                          checkEditPinnedMessage={OnCheckEditPinnedMessage}
                          setToggleStatus={OnSetToggleStatus}
                          pattern={pattern}
                          auth={auth}
                          setCurrentMsgErrorIndex={OnSetCurrentMsgErrorIndex}
                          currentMsgErrorIndex={currentMsgErrorIndex}
                          errorMessage={errorMessage}
                          setIsUpgradePaymentModalOpen={
                            OnSetIsUpgradePaymentModalOpen
                          }
                          setIsPaymentModalOpen={OnSetIsPaymentModalOpen}
                          type={imgModelType}
                        />
                      </span>
                      {/* // ))} */}
                    </div>
                  ))}
                </div>
              ) : (
                <ComingSoonFeature
                  navigateToMessageModel={navigateToMessageModel}
                />
              )
            ) : (
              toggleStatus == 1 && (
                <>
                  <div className=" rounded-[20px] max-w-[860px]  w-full mx-auto my-auto h-full flex justify-center flex-col 2xl:max-w-[1109px] xl:max-w-[860px] lg:max-w-[860px]">
                    {/* <h2 className="font-helvetica gr-2 text-white inline-block text-transparent bg-clip-text text-[42px] font-normal leading-normal">
                      Hello, {fullName || "Human"}{" "}
                    </h2> */}
                    {messageModelType == "text" ? (
                      <>
                        {/* <h2 className="text-[42px] font-normal leading-normal font-helvetica text-[#6B6B6B] mb-[30px]">
                          How can I help you today?
                        </h2>
                        <div className="grid grid-cols-3 gap-3">
                          {defaultOptions.map((item, index) => (
                            <div
                              key={index}
                              className="bg-black rounded-[20px] w-full mx-auto my-auto px-3 pr-[25px] py-[18px] pb-[9px] text-white text-[17px] leading-normal font-normal font-helvetica flex items-start gap-[12px] min-h-[99px]"
                            >
                              <Image
                                alt={`icon-${index}`}
                                width={34}
                                height={34}
                                src={item.icon}
                              />
                              {item.text}
                            </div>
                          ))}
                        </div> */}

                        <div className="flex items-center justify-center">
                          <Switch
                            defaultSelected
                            color="default"
                            classNames={{
                              wrapper:
                                "border-2 border-[#5F5F5F] !bg-[transparent] h-[47px] w-[73px]",
                              thumb: cn(
                                "w-[30px] h-[30px] border-2 shadow-lg",
                                "bg-[#5F5F5F] border-[#5F5F5F]",
                                "group-data-[selected=true]:ml-7"
                              ),
                              label:
                                "text-[#5F5F5F] text-[31.03px] font-normal font-helvetica",
                            }}
                          >
                            {`Let’s make something.`}
                          </Switch>
                        </div>
                      </>
                    ) : (
                      <>
                        <h2 className="text-[41.52px] font-normal leading-normal font-nasalization text-[#6B6B6B] mb-[30px]">
                          What image should I make?
                        </h2>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="flex flex-col bg-[#1B1E24] rounded-[20px] w-full mx-auto my-auto px-5 py-6 text-[#D0D0D0] text-[18px] leading-normal font-helvetica">
                            “Tarzan riding a lion”
                          </div>
                          <div className="flex flex-col bg-[#1B1E24] rounded-[20px] w-full mx-auto my-auto px-5 py-6 text-[#D0D0D0] text-[18px] leading-normal font-helvetica">
                            &quot;Detailed oil painting of Muhammad Ali&quot;
                          </div>
                          <div className="flex flex-col bg-[#1B1E24] rounded-[20px] w-full mx-auto my-auto px-5 py-6 text-[#D0D0D0] text-[18px] leading-normal font-helvetica">
                            &quot;Modern home in the hills of jungle&quot;
                          </div>
                        </div>
                      </>
                    )}

                    {/* <div className="flex flex-row mt-[30px] gap-2 justify-center">
                      <Image
                        alt="logo"
                        width={30}
                        height={30}
                        src={"/einstein-logo.png"}
                        className=""
                      />
                      <p className="text-[#D0D0D0] text-[19px] font-normal leading-normal font-nasalization">
                        Einstein
                        <span className="text-[19px] font-normal leading-normal font-helvetica ml-[8px]">
                          {`is your AI toolbox. Discover hundreds of plugins `}
                          <a
                            href=""
                            className="font-medium  font-helvetica text-[#547AFF]"
                          >
                            here
                          </a>
                          .
                        </span>
                      </p>
                    </div> */}
                  </div>
                </>
              )
            )}
          </>
        )}
      </div>

      {messageModelType !== "video" && messageModelType !== "audio" ? (
        <div
          className={`fixed bottom-0 flex flex-col align-items-end w-[-webkit-fill-available] mb-3 mx-auto items-center max-xl:pr-2 ${
            blur == true ? "z-[999]" : ""
          }`}
        >
          <div
            className={`flex flex-row w-full items-end mb-2 mt-3 gap-2 ${
              messageModelType == "text" ? "hidden" : ""
            }`}
          >
            <div
              className={
                "ml-10 mt-[10px] font-nasalization text-sm font-normal text-[#FFF] leading-normal"
              }
            >
              Aspect Ratio
            </div>

            <DualListBox setRatio={onSetRatio} />
          </div>

          {allChatDetails.chatRegenerate.canRegenerate && (
            <div className="flex items-center justify-center gap-4 flex-col mb-4">
              <p className="text-white font-normal text-xs font-roboto">
                There was an error generating your response
              </p>
              <Button
                className="text-[#131313] bg-[#F9F9F9] font-normal text-base rounded-full"
                onClick={regenerateMsgHandler}
                isDisabled={allChatDetails.chatRegenerate.isRegenerating}
              >
                <RegenerateIcon setValue={setValue} />
                {allChatDetails.chatRegenerate.isRegenerating
                  ? "Regenerating"
                  : "Regenerate"}
              </Button>
            </div>
          )}
          <div className="flex flx-row pl-3 items-end 2xl:gap-[23px] xl:gap-[17px] w-full max-msm:mb-3 justify-center">
            <div
              className="flex flex-row transition-all duration-300 ease-in-out justify-center min-h-[52px] max-h-[133px]"
              style={{ width: showPrompt ? "70%" : "90%" }}
            >
              <PluginMenu showDraggableModal={activeModalHandler} />
              <div className="w-full relative flex flex-col gap-1 rounded-3xl  2xl:max-w-[700px] max-h-[133px] h-fit 2xl:min-h-[46px] xl:min-h-[39px] p-[6px] bg-[#272727] justify-center pb-[3.54px] pt-[3.54px] pl-[4.43px] pr-[2px]">
                <div className="absolute -right-[45px] leading-[0]">
                  <VoiceRecognition setValue={setValue} disabled={isDisabled} />
                </div>
                {replyStatus1 == true && (
                  <div className="min-w-[100%] flex flex-row w-full">
                    <div className="rounded-t-[1.5rem] rounded-b-[0.375rem] px-[1.25rem] py-[0.87rem] relative w-full bg-[#171717] mb-[8px]">
                      <div className="flex items-start gap-[18px] relative top-[3px]">
                        <span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="17"
                            height="17"
                            viewBox="0 0 17 17"
                            fill="none"
                          >
                            <path
                              d="M3.01037 3.54175C3.30217 3.54556 3.5378 3.78119 3.54162 4.073V5.48966C3.53397 6.2904 3.84868 7.06056 4.41491 7.62678C4.98114 8.19301 5.7513 8.50773 6.55203 8.50008H13.0616L9.71828 5.1355C9.59724 4.9226 9.63741 4.65455 9.81555 4.48649C9.99369 4.31844 10.2636 4.29393 10.4691 4.42716L14.7191 8.67716C14.7671 8.72629 14.8056 8.78394 14.8324 8.84716C14.8892 8.97823 14.8892 9.12693 14.8324 9.258C14.8056 9.32122 14.7671 9.37887 14.7191 9.428L10.4691 13.678C10.2617 13.8852 9.92569 13.8852 9.71828 13.678C9.51113 13.4706 9.51113 13.1346 9.71828 12.9272L13.0616 9.56258H6.55203C5.46835 9.57407 4.4257 9.14865 3.65937 8.38233C2.89305 7.616 2.46763 6.57335 2.47912 5.48966V4.073C2.48293 3.78119 2.71856 3.54556 3.01037 3.54175Z"
                              fill="#ABABAB"
                            />
                          </svg>
                        </span>
                        <p className="text-[#fff] text-[14px] font-normal font-helvetica line-clamp-2 max-h-[44px]">
                          “{replyText}”
                        </p>
                      </div>
                      <span onClick={handleReplyClose}>
                        <Image
                          className="absolute right-[16px] top-[12px] cursor-pointer"
                          alt="close icon"
                          width={9}
                          height={9}
                          src={"svg/close.svg"}
                        />
                      </span>
                    </div>
                  </div>
                )}

                {filePreviews.map((file, index) => (
                  <div key={index}>
                    {uploading ? (
                      <div style={spinnerStyle}>
                        <Spinner labelColor="foreground" />
                      </div>
                    ) : null}
                    <div className="flex gap-3 px-3 pt-2 pb-2" key={index}>
                      {file.type.startsWith("image/") ? (
                        <div className="w-14 h-14">
                          <img
                            src={file.preview}
                            alt="Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              border: "2px solid #383737",
                              borderRadius: "12px",
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          className="flex rounded-lg gap-2 py-1 px-2 "
                          style={{ border: "1px solid #89898d" }}
                        >
                          <div className="border border-[#383737] w-14 h-14">
                            <img
                              src={getFileIcon(file.type)}
                              alt="Preview"
                              style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "12px",
                              }}
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white">{file.name}</span>
                            <span className="text-slate-300">
                              {file.type.substring("application/".length)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <div
                  className={`flex items-center px-[3px] w-full h-auto ${
                    isDisabled ? "disabled-div" : ""
                  }`}
                >
                  <Avatar
                    src={activeChatModel?.iconSrc}
                    alt={activeChatModel?.modelName}
                    showFallback={true}
                    className="p-[0px] 2xl:h-[34px] 2xl:w-[34px] xl:h-[36px] xl:w-[36px] h-[36px] w-[36px] cursor-pointer bg-transparent rounded-full shrink-0"
                    fallback={
                      <div className="flex justify-center items-center w-[34px] h-[34px] cursor-pointer">
                        <Image
                          src={"/svg/user.svg"}
                          alt="tools-logo-img"
                          width={20}
                          height={20}
                        />
                      </div>
                    }
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                  />
                  {messageModelType == "text" &&
                  (activeChatModel?.modelName === "ChatGPT - 4" ||
                    activeChatModel?.modelName === "Gemini") ? (
                    <div className="flex items-center 2xl:min-w-[25px] xl:min-w-[18px] 2xl:h-[25px] xl:h-[18px] ml-[4px]">
                      <Image
                        alt="attach icon"
                        width={11}
                        height={20}
                        src={"svg/attach.svg"}
                        className={`cursor-pointer max-h-10 mx-auto 2xl:w-[10.15px] xl:w-[10.15px] 2xl:h-[18.46px] xl:h-[18.46px] `}
                        onClick={handleImageClick}
                      />
                    </div>
                  ) : null}

                  <textarea
                    id="review-text"
                    onChange={handleChange}
                    value={value}
                    onKeyDown={(e) => handleKeyDown(e)}
                    placeholder={blur ? "Reply" : textAreaPlaceholder}
                    ref={textAreaRef}
                    rows={5}
                    maxLength={500}
                    cols={0}
                    className="leading-[22.661px] text-[#AAA] tracking-[0.142px] reply-scrollbar resize-none overflow-y-auto py-[6px] text-[14.163px] 2xl:text-[16px] xl:text-[14.163px] helvetica-font w-full bg-transparent outline-none rounded font-normal ml-1 max-h-[15dvh]"
                    // disabled={
                    //   (activeChat?.role === "edit" ||
                    //   activeChat?.permission_type === "full")
                    //     ? false
                    //     : !isDisabled ? false : true
                    // }
                    disabled={
                      activeChat?.role === "view" ||
                      activeChat?.permission_type === "view" ||
                      isDisabled
                    }
                  />
                  <div
                    className={`cursor-pointer  flex-row mr-[0px] w-[44.8px] h-[38px] rounded-full flex items-center justify-center bg-[#121212]`}
                    onClick={() => {
                      if (messageModelType == "text") {
                        TextGenerate();
                      } else {
                        ImageGenerate();
                      }
                    }}
                  >
                    <Image
                      alt="send-icon"
                      width={15}
                      height={16}
                      src={"/svg/send.svg"}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              {showPrompt && (
                <div className="space-y-4 flex mr-7 flex-col transition-all duration-300 ease-in-out transform translate-x-0">
                  {showEnterPrompt && (
                    <div className="relative mb-[-5px]">
                      <textarea
                        placeholder="Enter prompt"
                        className="max-w-[205px] rounded-2xl text-white reply-scrollbar resize-none overflow-y-auto justify-items-center py-[10px] 2xl:text-[16px] xl:text-[14px] helvetica-font  bg-transparent outline-none pl-3 font-normal ml-1 pr-8"
                        style={{ background: "hsl(240 5% 26% / 1)" }}
                        rows={1}
                        value={promptInputTxt}
                        onChange={(e) => handleTypePrompt(e.target.value)}
                      />
                      <CheckIcon
                        className="absolute w-4 h-4 text-white cursor-pointer top-3 right-2"
                        onClick={handleAddPrompt}
                      />
                    </div>
                  )}
                  {privatePrompts?.length > 0 &&
                    privatePrompts.map((prompt, index) => {
                      return (
                        // <div className="relative w-full max-w-[235px]">
                        <div className="relative w-full max-w-[235px]">
                          {editingId === prompt.id ? (
                            <input
                              type="text"
                              value={text}
                              onChange={handleInputChange}
                              onKeyDown={(e) =>
                                handleKeyDownPrompt(e, index, prompt)
                              }
                              // onBlur={() => toggleEditMode(prompt.id)} // Exit edit mode when focus is lost
                              className="rounded-3xl font-bold text-white text-sm bg-gray-600 pr-[40px] pl-[18px] py-[12px] outline-none w-full"
                              autoFocus // Automatically focus when input becomes editable
                            />
                          ) : (
                            <Button
                              className="rounded-3xl font-bold text-white text-sm bg-[#272727] hover:bg-[#474747] pr-[40px] pl-[18px] py-[12px] text-start w-full cursor-pointer focus:outline-none"
                              // onClick={() => toggleEditMode(prompt.id)}
                              style={{ textWrap: "wrap", height: "auto" }}
                            >
                              {prompt.text}
                            </Button>
                          )}
                          <div
                            className="w-7 absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer transition-opacity duration-300 ease-in-out"
                            onClick={() => handleEditClick(prompt)}
                          >
                            {editingId === prompt.id ? (
                              <Image
                                onClick={() => handleDeleteClick(prompt.id)}
                                src={"/trashIcon.svg"}
                                alt="trashIcon-img"
                                width={15}
                                height={15}
                              />
                            ) : (
                              <Image
                                className="opacity-0 hover:opacity-100"
                                src={"/editIcon.svg"}
                                width={15}
                                height={15}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
              <div>
                {showPrompt && (
                  <div
                    className="flex flex-col mr-2 fixed transition-all duration-300 ease-in-out right-0 justify-center items-center gap-y-2"
                    style={{
                      bottom: "3rem",
                      transform: showPrompt
                        ? "translateY(-50px)"
                        : "translateY(0px)",
                    }} // Move up when shown
                  >
                    <button
                      className="transition-all duration-300 ease-in-out transform "
                      onClick={() => setshowEnterPrompt(true)}
                    >
                      <PlusIcon className="w-7 h-7 text-[#ABABAB] ms-4 cursor-pointer hover:text-white" />
                    </button>
                    <button
                      className="transition-all duration-300 ease-in-out transform "
                      onClick={() => setOpen(true)}
                    >
                      <ComputerDesktopIcon className="w-5 h-5 text-[#ABABAB] ms-4 cursor-pointer hover:text-white" />
                    </button>
                  </div>
                )}
                {/* <button
                  onClick={() => setshowPrompt(!showPrompt)}
                  className="bg-[#272727] rounded-full w-20 h-12 flex items-center fixed bottom-9 -right-9"
                >
                  <Bars3Icon className="w-5 h-5 text-white ms-4 cursor-pointer " />
                </button> */}
              </div>
            </div>
            <FeedBackBtn />
          </div>
          <div className="max-msm:hidden text-[#929292] text-[8.861px] font-normal font-Inter leading-normal mt-2">
            Togl can produce inaccurate information. Please use responsibly.{" "}
            <a
              className="font-normal"
              href="#"
              onClick={handlePrivacyPolicyClick}
              style={{ textDecoration: "underline" }}
            >
              Your privacy & Togl Apps
            </a>
          </div>
        </div>
      ) : null}

      {/* Privacy Policy Modal */}
      {isPrivacyPolicyModalOpen && (
        <PrivacyPolicyModal
          setIsPrivacyPolicyModalOpen={setIsPrivacyPolicyModalOpen}
        />
      )}
      {isPaymentModalOpen && (
        <PaymentModal
          auth={auth}
          status={isPaymentModalOpen}
          setIsPaymentModalOpen={setIsPaymentModalOpen}
        />
      )}
      {isUpgradePaymentModalOpen && (
        <UpgradePaymentModal
          auth={auth}
          status={isUpgradePaymentModalOpen}
          setIsUpgradePaymentModalOpen={setIsUpgradePaymentModalOpen}
        />
      )}
      <PromptModal setOpen={setOpen} open={open} />
      <ToastService />
    </div>
  );
};

export default Chat;
