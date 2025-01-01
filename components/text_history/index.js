"use client"

import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useModelStatus } from "../context/ModelStatusContext";
import Image from "next/image";
import Link from "next/link";
import {
  Tabs,
  Tab,
  Tooltip,
  Avatar,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@nextui-org/react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ReactMarkDown from "../Markdown";
import { apiURL } from "@/config";
import { useDisclosure } from "@nextui-org/react";
import { Typewriter } from "../chat/typeWriter";
import TextSelectorok from "./Reply";
import LeftIcon from "@/app/assets/svg/Icon-left.svg";
import CopyIcon from "@/app/assets/svg/Icon-copy.svg";
import RegenerateIcon from "@/app/assets/svg/regenerate.svg";
// import HeartRedIcon from "@/app/assets/svg/Icon-heart-red.svg";
// import HeartIcon from "@/app/assets/svg/Icon-heart.svg";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartRedIcon } from "@heroicons/react/24/solid";
import RegenIcon from "@/app/assets/svg/regen.svg";
import ErrorIcon from "@/app/assets/svg/error-icon.svg";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { setChatRegenerate } from "@/app/lib/features/chat/chatSlice";
import EditTextIcon from "@/app/assets/svg/edit-text-Icon.svg";
import VolumeIcon from "@/app/assets/svg/volumeIcon.svg";
import ReplyIcon from "@/app/assets/svg/replyIcon.svg";
import DeleteIcon from "@/app/assets/svg/delete.svg";
import AddToGptIcon from "@/app/assets/svg/add_to_gpt_icon.svg";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Responseicon from "@/app/assets/svg/response-icon.svg";
import Gpticon from "@/app/assets/svg/gpt4.png";
import EarthIcon from "@/app/assets/svg/earth.svg";
import Plusicon from "@/app/assets/svg/plus.svg";
import Righticon from "@/app/assets/svg/right-icon.svg";
import MoreIcon from "@/app/assets/svg/more-icon.svg";
import ModelsImages from "./Models";
import toast from "react-hot-toast";

const Models_Plugins_Items = [
  {
    iconSrc: "/models/gpt4.png",
    modelName: "gpt4",
    modelValue: "gpt4",
    regenerateModelName: "gpt4",
  },
  {
    iconSrc: "/models/gemini.png",
    modelName: "gemini",
    modelValue: "gemini",
    regenerateModelName: "gemini",
  },
  {
    iconSrc: "/models/perplexity.png",
    modelName: "perplexity",
    modelValue: "perplexity",
    regenerateModelName: "perplexity",
  },
  {
    iconSrc: "/models/gpt3.png",
    modelName: "gpt3",
    modelValue: "gpt3",
    regenerateModelName: "gpt3",
  },
  {
    iconSrc: "/models/mistral.png",
    modelName: "mistral",
    modelValue: "mistral",
    regenerateModelName: "mistral",
  },
  {
    iconSrc: "/models/claude.png",
    modelName: "laude",
    modelValue: "claude",
    regenerateModelName: "claude",
  },
];

const Text_History = React.forwardRef(
  (
    {
      setIsReplyText,
      isReplyText,
      chatData,
      chatHistory,
      chatHistoryID,
      id,
      msgIndex,
      index,
      loading,
      setChatHistory,
      setLoading,
      setSwitchStatus,
      setID,
      type,
      setBlur,
      blur,
      setPinnedMessageText,
      setPinnedMessageIndex,
      setPinnedMessageMsgIndex,
      setPinnedMessageMsgType,
      checkEditPinnedMessage,
      setModelType,
      auth,
      setTextAnimationIndex,
      textAnimationIndex,
      setToggleStatus,
      setContextMenueStatus,
      contextMenueStatus,
      setReplyStatus,
      pattern,
      setIsUpgradePaymentModalOpen,
      setIsPaymentModalOpen,
      currentMsgErrorIndex,
      setCurrentMsgErrorIndex,
      errorMessage,
    },
    ref
  ) => {
    const dispatch = useAppDispatch();
    const [tabSelected, setTabSelected] = useState(type);
    const [copyStatus, setCopyStatus] = useState(false);
    const { textStatus, setTextStatus } = useModelStatus();
    const [vote, setVote] = useState(false);
    const [deVote, setDeVote] = useState(false);
    const [data, setData] = useState(null);
    const [copyIcon, setCopyIcon] = useState({
      open: false,
      index: 0,
      copyStatus: false,
    });
    const [modelList, setModelList] = useState([
      "GPT-3.5",
      "GPT-4",
      "Gemini",
      "Perplexity",
      "Mistral",
      "Claude",
    ]);
    const [tooltipModelList, setTooltipModelList] = useState([
      "GPT-3.5",
      "GPT-4",
      "Gemini",
      "Perplexity",
      "Mistral",
      "Claude",
    ]);
    const [editingMessage, setEditingMessage] = useState("");
    const [editModeIndex, setEditModeIndex] = useState(-1);
    const textareaRef = useRef(null);
    const [contextMenuPosition, setContextMenuPosition] = useState(null); // State to store context menu position
    const [contextedMenuPinnedStatus, setContextedMenuPinnedStatus] =
      useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [contextedMenuIndex, setContextedMenuIndex] = useState();
    const [currentMsgIndex, setCurrentMsgIndex] = useState(0);
    const [totalMsg, setTotalMsg] = useState(0);
    const [currentMsg, setCurrentMsg] = useState("");
    const [highlightedText, setHighlightedText] = useState("api");
    const [userChatData, setUserChatData] = useState(null);
    const [imageModelIndex, setImageModelIndex] = useState(0);
    const activeChat = useAppSelector((state) => state.chat.activeChat);
    const lastUnreadMsgIndex = useAppSelector(
      (state) => state.chat.last_unread_msg_index
    );
    const [value, setValue] = useState("");
    // Socket
    const ws = useAppSelector((state) => state.webSocket.ws);
    const connected = useAppSelector((state) => state.webSocket.connected);
    const messages = useAppSelector((state) => state.webSocket.messages);

    useEffect(() => {
      // let selectData = chatData?.find((x) => x?.type == type || x?.role == "loading");
      let selectData = chatData?.find((x) => x?.type === type);
      if (!selectData) {
        selectData =
          chatData?.find((x) => x?.type) ||
          chatData?.find((x) => x?.role === "loading");
      }
      const userData = chatData?.find((x) => x?.role == "user");
      setUserChatData(userData);
      if (!selectData) {
        selectData = { type, content: "", role: "assistant" };
      }
      setTabSelected(selectData.type);
      setData(selectData);
    }, [chatData, chatData?.isError, msgIndex, currentMsgErrorIndex]);

    useEffect(() => {
      setTabSelected(type);
    }, [type]);
    // Function to handle right-click on user messages
    const handleContextMenu = (e, index, pinned = false) => {
      const selection = window.getSelection();

      if (
        !(selection && selection?.toString()?.length > 0) &&
        e.type === "contextmenu" &&
        e.clientX !== 0 &&
        e.clientY !== 0
      ) {
        // Only set context menu position on right-click
        e.preventDefault();
        setContextMenuPosition({ x: e.clientX, y: e.clientY });
        setContextedMenuIndex(index);

        setContextedMenuPinnedStatus(pinned);
        setContextMenueStatus(true);
      }
    };

    const getMatchModelType = (type) => {
      return chatData?.findIndex((x) => x?.type === type) > -1;
    };

    const enterEditMode = (message) => {
      setEditingMessage(message);
    };

    const handleEditChange = (e) => {
      setEditingMessage(e.target.value);
      autoResizeTextarea(e.target);
    };

    const autoResizeTextarea = (element) => {
      element.style.height = "auto";
      element.style.height = element.scrollHeight + "px";
      element.style.width = "auto";
      element.style.width = element.scrollWidth + "px";
    };

    // Function to cancel edit
    const cancelEdit = () => {
      // Reset edit mode index to -1 to exit edit mode
      setEditModeIndex(-1);
    };

    const submitEdit = (index, msgIndex) => {
      setTextAnimationIndex(-1);
      const updatedChatHistory = [...chatHistory];
      const _index = updatedChatHistory[msgIndex]?.findIndex(
        (x) => x?.role == "user"
      );
      const messageType = updatedChatHistory?.[msgIndex]?.[1]?.type;
      const model = Models_Plugins_Items?.find(
        (model) =>
          model?.modelName === messageType ||
          model?.modelValue === messageType ||
          model?.regenerateModelName === messageType
      );
      const modelType = model?.regenerateModelName;
      updatedChatHistory[msgIndex] = updatedChatHistory[msgIndex]?.map(
        (item, idx) =>
          idx === (_index ?? 0) ? { ...item, content: editingMessage } : item
      );
      updatedChatHistory[msgIndex].splice(1);
      updatedChatHistory.splice(msgIndex + 1);
      setModelType(modelType);
      const pastHistory = updatedChatHistory.map((item) => [...item]);

      const sumData = {
        type: modelType,
        history: pastHistory,
        id: chatHistoryID,
        number: (_index - 1) / 2,
        userID: auth?.user?.userID,
      };

      updatedChatHistory[msgIndex].push({ role: "loading" });
      checkEditPinnedMessage(msgIndex, _index, "text", editingMessage);
      setCurrentMsgErrorIndex(-1);
      setChatHistory(updatedChatHistory);
      setLoading(true);
      setID(msgIndex);

      axios
        .post(`${apiURL}/ai/edit`, JSON.stringify(sumData), {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          setTextAnimationIndex(msgIndex);
          setChatHistory(response.data.response_data);
        })
        .catch((error) => {
          // console.log("###_EDIT_CHAT_ERROR_### ", error?.response?.data);
          // if (error.response && error.response.status === 403) {
          //   if (auth.user.plan == "free") {
          //     setIsUpgradePaymentModalOpen(true);
          //   } else {
          //     setIsPaymentModalOpen(true);
          //   }
          // } else {
          //   console.log(error);
          //   console.log(error.detail);
          //   // Handle other errors
          //   const errorData = {
          //     content: error.response.data.detail || errorMessage,
          //     type: data.new_type,
          //     role: "user",
          //   };
          //   setUserChatData(errorData);
          //   setCurrentMsgErrorIndex(msgIndex);
          //   console.error("An error occurred:", error.message);
          // }
          setTextAnimationIndex(-1);
          setCurrentMsgErrorIndex(msgIndex);
          setChatHistory((pre) => {
            const updatedItem = pre?.map((pre_item, pre_index) => {
              if (pre_index === msgIndex) {
                return pre_item?.map((x) => {
                  if (x?.role === "loading") {
                    return {
                      ...x,
                      role: "assistant",
                      isError: true,
                      isErrorMsg:
                        error?.response?.data?.message ??
                        "Something went wrong!",
                    };
                  } else {
                    return x;
                  }
                });
              } else {
                return pre_item;
              }
            });
            return updatedItem;
          });
        })
        .finally(() => {
          setLoading(false);
          setID(-1);
        });
    };

    const handleLoading = () => {
      // Handling loading state
      setLoading(true);
      setEditModeIndex(-1); // Reset edit mode index
      setEditingMessage(""); // Reset editing message
    };

    useEffect(() => {
      // Adjust initial width and height based on content
      if (textareaRef.current) {
        autoResizeTextarea(textareaRef.current);
      }
    }, []);

    useEffect(() => {
      if (pattern.length > 0) {
        setHighlightedText(pattern);
      }
    }, [pattern]);

    // const Regenerate = (msgIndex, chatHistoryID, typeOfModel) => {
    // console.log('typeOfModel: ', typeOfModel);
    //   if (auth && auth?.user && auth?.user?.email) {
    //     const tool_id = chatHistory?.[msgIndex]?.[1]?.content?.[0]?.tool_id
    //     if (tool_id) {
    //       const request = {
    //         type: "model",
    //         index: msgIndex,
    //         tool_id: tool_id,
    //         userID: auth?.user?.userID,
    //         workspace_id: activeWorkspace?._id ?? "",
    //         group_id: activeGroup?._id ?? "",
    //         id: chatHistoryID,
    //         source: "modelToolsIcon",
    //         prompt: "",
    //       }
    //       const category = "model";
    //       onToolsIconMenuChange(request, category);
    //     } else {
    //       TextReGenerateUsingSocket(msgIndex, chatHistoryID, typeOfModel);
    //     }
    //   } else {
    //     setTextAnimationIndex(-1);
    //     setID(msgIndex);
    //     let pasthistory = [];
    //     chatHistory.slice(0, msgIndex + 1).map((item) => {
    //       let data = item.slice(0, 1); // Remove the last element of the array
    //       pasthistory.push(data);
    //     });
    //     const index = chatData?.findIndex((x) => x?.type == typeOfModel);
    //     const type = Models_Plugins_Items?.find(
    //       (model) => model?.modelName === typeOfModel
    //     )?.regenerateModelName;

    //     setCurrentMsgErrorIndex(-1);
    //     let data = {
    //       historyData: pasthistory,
    //       type: type,
    //       index: msgIndex,
    //       id: chatHistoryID,
    //       userID: auth.user.userID,
    //     };
    //     setChatHistory(chatHistory);
    //     let a = [...chatHistory];

    //     // Set up timeout promise
    //     const timeoutPromise = new Promise((resolve, reject) => {
    //       setTimeout(() => {
    //         reject(new Error("Timeout"));
    //       }, 30000); // 30 seconds timeout
    //     });
    //     dispatch(
    //       setChatRegenerate({ canRegenerate: true, isRegenerating: true })
    //     );
    //     setLoading(true);
    //     // Make API call and race it with timeout
    //     Promise.race([
    //       axios.post(`${apiURL}/ai/regenerate`, data, {
    //         headers: { "Content-Type": "application/json" },
    //       }),
    //       timeoutPromise,
    //     ])
    //       .then((response) => {
    //         console.log(response.data.data);
    //         const chat_content = response.data.data;
    //         setCurrentMsgIndex(chat_content.length - 1);
    //         setTotalMsg(chat_content.length);
    //         setCurrentMsg(chat_content[chat_content.length - 1]);
    //         setTextAnimationIndex(msgIndex);
    //         setID(-1);

    //         // a[msgIndex] = a[msgIndex]?.map((item, idx) => (idx === (index ?? 0)) ? { ...item, content: [...response?.data?.data] } : item);
    //         setChatHistory((pre) => {
    //           const updatedItem = pre?.map((pre_item, pre_index) => {
    //             if (pre_index === msgIndex) {
    //               return pre_item?.map((x, x_index) =>
    //                 x_index === (index ?? 0)
    //                   ? { ...x, content: [...response?.data?.data] }
    //                   : x
    //               );
    //             } else {
    //               return pre_item;
    //             }
    //           });
    //           return updatedItem;
    //         });
    //         dispatch(
    //           setChatRegenerate({ canRegenerate: false, isRegenerating: false })
    //         );
    //       })
    //       .catch((error) => {
    //         console.log("###_regenerate_error_###", error);
    //         dispatch(
    //           setChatRegenerate({ canRegenerate: true, isRegenerating: false })
    //         );
    //         handleError(
    //           error,
    //           error?.response?.data?.message || errorMessage,
    //           a,
    //           msgIndex,
    //           index
    //         );
    //         // if (error.message === "Timeout") {
    //         //   handleError(error, "Refresh or Regenerate the response", a, msgIndex, index);
    //         // } else if (error.response && error.response.status === 403) {
    //         //   if (auth.user.plan == "free") {
    //         //     setIsUpgradePaymentModalOpen(true);
    //         //   } else {
    //         //     setIsPaymentModalOpen(true);
    //         //   }
    //         // } else {
    //         //   handleError(error, error.message || errorMessage, a, msgIndex, index);
    //         // }
    //       })
    //       .finally(() => {
    //         // setChatHistory((pre) => {
    //         //   const updatedItem = pre?.map((pre_item, pre_index) => {
    //         //     if (pre_index === msgIndex) {
    //         //       return pre_item?.map((x, x_index) => (x_index === index) ? { ...x, role: "assistant", type: typeOfModel } : x);
    //         //     } else {
    //         //       return pre_item;
    //         //     }
    //         //   });
    //         //   return updatedItem;
    //         // });
    //         setLoading(false);
    //         setModelType(chatHistory[msgIndex][index].type);
    //       });
    //   }
    // };


    const Regenerate = (msgIndex, chatHistoryID, onCLickData) => {
      // if (auth && auth?.user && auth?.user?.email) {
      if (auth && auth?.user && auth?.user?.userID) { // WS 101
        const type = Models_Plugins_Items?.find(
          (model) => model?.modelValue === onCLickData?.type
        )?.regenerateModelName;
        if (onCLickData?.type === "model" || onCLickData?.type === "whisper") {
          const request = {
            type: "model",
            index: msgIndex,
            tool_id: onCLickData?.tool_id,
            userID: auth?.user?.userID,
            workspace_id: activeWorkspace?._id ?? "",
            group_id: activeGroup?._id ?? "",
            id: chatHistoryID,
            source: "modelToolsIcon",
            prompt: "",
          };
          onToolsIconMenuChange(request, onCLickData?.type);
        } else {
          // TextReGenerateUsingSocket(msgIndex, chatHistoryID, onCLickData?.type);
          TextReGenerateUsingSocket(msgIndex, chatHistoryID, type);
        }
      } else {
        setTextAnimationIndex(-1);
        setID(msgIndex);
        let pasthistory = [];
        chatHistory.slice(0, msgIndex + 1).map((item) => {
          let data = item.slice(0, 1); // Remove the last element of the array
          pasthistory.push(data);
        });
        const index = chatData?.findIndex((x) => x?.type == onCLickData?.type);
        const type = Models_Plugins_Items?.find(
          (model) => model?.modelName === onCLickData?.type
        )?.regenerateModelName;

        setCurrentMsgErrorIndex(-1);
        let data = {
          historyData: pasthistory,
          type: type,
          index: msgIndex,
          id: chatHistoryID,
          userID: auth.user.userID,
        };
        setChatHistory(chatHistory);
        let a = [...chatHistory];

        // Set up timeout promise
        const timeoutPromise = new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error("Timeout"));
          }, 30000); // 30 seconds timeout
        });
        dispatch(
          setChatRegenerate({ canRegenerate: true, isRegenerating: true })
        );
        setLoading(true);
        // Make API call and race it with timeout
        Promise.race([
          axios.post(`${apiURL}/ai/regenerate`, data, {
            headers: { "Content-Type": "application/json" },
          }),
          timeoutPromise,
        ])
          .then((response) => {
            const chat_content = response.data.data;
            setCurrentMsgIndex(chat_content.length - 1);
            setTotalMsg(chat_content.length);
            setCurrentMsg(chat_content[chat_content.length - 1]);
            setTextAnimationIndex(msgIndex);
            setID(-1);

            // a[msgIndex] = a[msgIndex]?.map((item, idx) => (idx === (index ?? 0)) ? { ...item, content: [...response?.data?.data] } : item);
            setChatHistory((pre) => {
              const updatedItem = pre?.map((pre_item, pre_index) => {
                if (pre_index === msgIndex) {
                  return pre_item?.map((x, x_index) =>
                    x_index === (index ?? 0)
                      ? { ...x, content: [...response?.data?.data] }
                      : x
                  );
                } else {
                  return pre_item;
                }
              });
              return updatedItem;
            });
            dispatch(
              setChatRegenerate({ canRegenerate: false, isRegenerating: false })
            );
          })
          .catch((error) => {
            dispatch(
              setChatRegenerate({ canRegenerate: true, isRegenerating: false })
            );
            handleError(
              error,
              error?.response?.data?.message || errorMessage,
              a,
              msgIndex,
              index
            );
            // if (error.message === "Timeout") {
            //   handleError(error, "Refresh or Regenerate the response", a, msgIndex, index);
            // } else if (error.response && error.response.status === 403) {
            //   if (auth.user.plan == "free") {
            //     setIsUpgradePaymentModalOpen(true);
            //   } else {
            //     setIsPaymentModalOpen(true);
            //   }
            // } else {
            //   handleError(error, error.message || errorMessage, a, msgIndex, index);
            // }
          })
          .finally(() => {
            // setChatHistory((pre) => {
            //   const updatedItem = pre?.map((pre_item, pre_index) => {
            //     if (pre_index === msgIndex) {
            //       return pre_item?.map((x, x_index) => (x_index === index) ? { ...x, role: "assistant", type: typeOfModel } : x);
            //     } else {
            //       return pre_item;
            //     }
            //   });
            //   return updatedItem;
            // });
            setLoading(false);
            setModelType(chatHistory[msgIndex][index].type);
          });
      }
    };
    React.useImperativeHandle(ref, () => ({
      Regenerate,
    }));

    const handleError = (
      error,
      errorMsg,
      chatHistoryArray,
      msgIndex,
      index
    ) => {
      setTextAnimationIndex(-1);
      setID(-1);
      setLoading(false);
      setCurrentMsgErrorIndex(msgIndex);
      setChatHistory((pre) => {
        const updatedItem = pre?.map((pre_item, pre_index) => {
          if (pre_index === msgIndex) {
            return pre_item?.map((x, x_index) => {
              if (x_index === index) {
                if (Array.isArray(x?.content)) {
                  setCurrentMsg(null);
                }
                return {
                  ...x,
                  isError: true,
                  isErrorMsg: errorMsg ?? "Something went wrong!",
                };
              } else {
                return x;
              }
            });
          } else {
            return pre_item;
          }
        });
        return updatedItem;
      });
    };

    const replyFunction = (text, typeOfModel) => {
      // setBlur(true);
      // setID(index);
      const index = chatData?.findIndex((x) => x?.type == typeOfModel);
      setReplyStatus(text ? true : false, index, msgIndex, text);
    };

    const onCancel = () => {
      setBlur(false);
    };

    const onSetPinnedMessageIndex = (msgIndex, index) => {
      setPinnedMessageMsgIndex(msgIndex);
      setPinnedMessageIndex(index);
      setPinnedMessageText(chatHistory[msgIndex][index].content);
      setPinnedMessageMsgType("text");
      const updatedChatHistory = chatHistory.map((msg, i) => {
        return msg.map((item, j) => ({
          ...item,
          pinned: j === index && i === msgIndex ? true : false,
        }));

        return msg;
      });

      setChatHistory(updatedChatHistory);
    };

    const onSetUnpinnedMessageIndex = (msgIndex, index) => {
      setPinnedMessageMsgIndex(0);
      setPinnedMessageIndex(0);
      setPinnedMessageText("");
      setPinnedMessageMsgType("");
      const updatedChatHistory = [...chatHistory];
      delete updatedChatHistory[msgIndex][index].pinned;
      setChatHistory(updatedChatHistory);
    };

    const onChangeTabSelected = (outerText, chatHistoryID) => {
      if (outerText != "" && !outerText.includes("\n")) {
        setTextAnimationIndex(-1);
        setCurrentMsgErrorIndex(-1);

        const pastHistory = [
          ...chatHistory.slice(0, msgIndex), // Slice from the beginning to the element before msgIndex
          chatHistory[msgIndex].slice(0, 1), // Slice the last element separately
        ].flatMap((item) => item);

        setSwitchStatus(true);
        setID(chatHistoryID);
        setModelType(outerText);

        const selectData = chatData?.find((x) => x?.type == outerText);
        setTabSelected(outerText);
        if (selectData) {
          setData(selectData);
        } else {
          let sumData = {
            old_type: type,
            new_type: outerText,
            history: pastHistory,
            id: chatHistoryID,
            number: msgIndex,
            userID: auth.user.userID,
          };
          Summarize(sumData, msgIndex, index);
        }
      }
    };

    const [selectedText, setSelectedText] = useState("");
    const [showReplyIcon, setShowReplyIcon] = useState(false);
    const [selectionCoordinates, setSelectionCoordinates] = useState({
      x: 0,
      y: 0,
    });

    useEffect(() => {
      document.addEventListener("mouseup", handleOutsideClick);

      return () => {
        document.removeEventListener("mouseup", handleOutsideClick);
      };
    }, []);

    const handleTextSelection = () => {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();

      if (selectedText !== "") {
        setSelectedText(selectedText);
        setShowReplyIcon(true);
        const selectionRange = selection.getRangeAt(0);
        const rect = selectionRange.getBoundingClientRect();
        const parentRect =
          selection.anchorNode.parentElement.getBoundingClientRect();
        setSelectionCoordinates({
          x: rect.left - parentRect.left + rect.width / 2,
          y: rect.top - parentRect.top,
        });
      } else {
        setShowReplyIcon(false);
      }
    };

    const handleReplyIconClick = () => {
      const textarea = document.getElementById("review-textaad");
      textarea.value = ""; // Clear existing text
      const newText = selectedText;
      textarea.value = newText;
      setShowReplyIcon(false);
      setSelectedText("");
    };

    const handleOutsideClick = (event) => {
      if (!event.target.closest(".text-container")) {
        setShowReplyIcon(false);
      }
    };

    const [liked, setLiked] = useState(false);

    const toggleLike = () => {
      setLiked(!liked);
    };

    const Summarize = (data, msgIndex, index) => {
      // const updatedChatHistory = [...chatHistory];
      // updatedChatHistory[msgIndex].push({ role: "loading" });

      setChatHistory((pre) => {
        const updatedItem = pre?.map((pre_item, pre_item_index) => {
          if (pre_item_index === msgIndex) {
            return [...pre_item, { role: "loading" }];
          } else {
            return pre_item;
          }
        });
        return updatedItem;
      });

      // setChatHistory(updatedChatHistory);
      setLoading(true);
      setCurrentMsgErrorIndex(-1);
      setTabSelected(data.new_type);
      setData({ role: "loading" });

      // Set up timeout promise
      const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error("Timeout"));
        }, 30000); // 30 seconds timeout
      });

      const handleError = (error, errorMsg) => {
        const errorData = {
          content: errorMsg,
          type: data.new_type,
          role: "assistant",
        };
        setCurrentMsgErrorIndex(msgIndex);
        setData(errorData);
        // updatedChatHistory[msgIndex][updatedChatHistory[msgIndex]?.length - 1 || 0] = errorData;

        setChatHistory((pre) => {
          const updatedItem = pre?.map((pre_item, pre_item_index) => {
            if (pre_item_index === msgIndex) {
              return pre_item?.map((x) =>
                x?.role === "loading" ? { ...newData, isError: true } : x
              );
            } else {
              return pre_item;
            }
          });
          return updatedItem;
        });
        console.error("An error occurred:", error.message);
      };

      // Make API call and race it with timeout
      Promise.race([
        axios.post(`${apiURL}/ai/summarize`, data, {
          headers: { "Content-Type": "application/json" },
        }),
        timeoutPromise,
      ])
        .then((response) => {
          const newData = {
            content: response.data.data,
            type: data.new_type,
            role: "assistant",
          };

          setChatHistory((pre) => {
            const updatedItem = pre?.map((pre_item, pre_item_index) => {
              if (pre_item_index === msgIndex) {
                return pre_item?.map((x) =>
                  x?.role === "loading" ? { ...newData } : x
                );
              } else {
                return pre_item;
              }
            });
            return updatedItem;
          });

          setLoading(false);
          setTextAnimationIndex(msgIndex);
          setData(newData);
        })
        .catch((error) => {
          if (error.response && error.response.status === 403) {
            if (auth.user.plan == "free") {
              setIsUpgradePaymentModalOpen(true);
            } else {
              setIsPaymentModalOpen(true);
            }
          } else if (error.message === "Timeout") {
            handleError(error, "Refresh or Regenerate the response");
          } else {
            handleError(error, error?.response?.data?.detail || errorMessage);
          }
        })
        .finally(() => {
          setLoading(false);
          setTextAnimationIndex(msgIndex);
          // setChatHistory(updatedChatHistory);
        });
    };

    function handleTypingEnd() {
      // Reset textAnimationIndex when typing ends
      setTextAnimationIndex(-1);
      if (Array.isArray(data?.content ?? "")) {
        setCurrentMsg(data?.content[data?.content?.length - 1]);
      }
    }

    useEffect(() => {
      // Adjust initial width and height based on content
      if (Array.isArray(data?.content || "") && data.content.length > 0) {
        setCurrentMsgIndex(data.content.length - 1);
        setTotalMsg(data.content.length);
        setCurrentMsg(data.content[data.content.length - 1]);
      } else {
        setCurrentMsg(data?.content);
      }
    }, [data]);

    const handleLeftClick = () => {
      if (currentMsgIndex > 0) {
        setCurrentMsgIndex(currentMsgIndex - 1);
        setCurrentMsg(data.content[currentMsgIndex - 1]);
      }
    };

    const handleRightClick = () => {
      if (currentMsgIndex < totalMsg - 1) {
        setCurrentMsgIndex(currentMsgIndex + 1);
        setCurrentMsg(data.content[currentMsgIndex + 1]);
      }
    };

    const handleToggleStatus = () => {
      setToggleStatus(0);
    };

    const onSetReplyText = (text, selecttextmsgIndex) => {
      // setReplyStatus(text ? true : false, index, msgIndex, text);
      setIsReplyText({
        open: text?.length > 0 ? true : false,
        msgIndex: Number(selecttextmsgIndex),
        text,
      });
    };

    const onReplyIconClick = () => {
      replyFunction(isReplyText?.text, data?.type);
      setIsReplyText({ open: false, msgIndex: null, text: "" });
    };

    const activeWorkspace = useAppSelector(
      (state) => state.workspace.activeWorkspace
    );
    const activeGroup = useAppSelector(
      (state) => state.group.currentActiveGroup
    );

    const [tooltip, setTooltip] = useState({ isOpen: false, text: "Copy" });
    const HandleCopyTextOnClipboard = (content) => {
      setTooltip({ isOpen: true, text: "Copy" });
      navigator?.clipboard
        ?.writeText(content)
        .then(() => {
          setTooltip({ isOpen: true, text: "Copied" });
          setTimeout(() => setTooltip({ isOpen: false, text: "Copy" }), 1500);
        })
        .catch((err) => {
          console.error("Copy failed: ", err);
        });
    };

    useEffect(() => {
      if (messages) {
        const currentChatId = activeChat?.id ?? "";

        if (messages?.id === currentChatId) {
          if (messages?.action === "regenerate") {
            if (
              messages?.hasOwnProperty("prompt") &&
              messages?.hasOwnProperty("user")
            ) {
              setTextAnimationIndex(-1);
              setID(messages?.index);
              setLoading(true);
              let pasthistory = [];
              chatHistory.slice(0, messages?.index + 1).map((item) => {
                let data = item.slice(0, 1);
                pasthistory.push(data);
              });
              setCurrentMsgErrorIndex(-1);
              dispatch(
                setChatRegenerate({
                  canRegenerate: false,
                  isRegenerating: true,
                })
              );

              setChatHistory((pre) => {
                const updatedItem = pre?.map((pre_item) => {
                  if (pre_item[messages?.index]) {
                    return pre_item?.map((x) =>
                      x?.role === "assistant" &&
                      x?.type === messages?.model_type
                        ? {
                            ...x,
                            role: "assistant",
                            type: messages?.model_type ?? "",
                          }
                        : x
                    );
                  } else {
                    return pre_item;
                  }
                });
                return updatedItem;
              });
            } else if (
              messages?.hasOwnProperty("content") &&
              messages?.hasOwnProperty("status_code")
            ) {
              if (messages?.status_code === 200) {
                setID(-1);
                setLoading(false);
                const chat_content = messages?.content?.data;
                setCurrentMsgIndex(chat_content?.length - 1);
                setTotalMsg(chat_content?.length);
                setCurrentMsg(chat_content[chat_content?.length - 1]);
                setChatHistory((pre) => {
                  const updatedItem = pre?.map((pre_item) => {
                    if (pre_item[messages?.index]) {
                      return pre_item?.map((x) =>
                        x?.role === "assistant" &&
                        x?.type === messages?.model_type
                          ? {
                              ...x,
                              role: "assistant",
                              content: chat_content,
                              type: messages?.model_type ?? "",
                            }
                          : x
                      );
                    } else {
                      return pre_item;
                    }
                  });
                  return updatedItem;
                });
                // setChatHistory((pre) => {
                //   const updatedItem = pre?.map((pre_item) => {
                //     if (pre_item[messages?.index]) {
                //       return pre_item?.map((x) => {
                //         if ((x?.role === "assistant") && (x?.type === messages?.model_type)) {

                //           const chat_content = Array?.isArray(x?.content) ? [...x?.content, messages?.content?.data] : [x?.content, messages?.content?.data];
                //           setCurrentMsgIndex(chat_content?.length - 1);
                //           setTotalMsg(chat_content?.length);
                //           setCurrentMsg(chat_content[chat_content?.length - 1]);

                //           return ({ ...x, content: chat_content });
                //         } else {
                //           return (x);
                //         }
                //       });
                //     } else {
                //       return pre_item;
                //     }
                //   });
                //   return updatedItem;
                // });
                setTextAnimationIndex(messages?.index);
                dispatch(
                  setChatRegenerate({
                    canRegenerate: false,
                    isRegenerating: false,
                  })
                );
              } else if (messages?.status_code !== 200) {
                setCurrentMsgErrorIndex(messages?.index);
                msgIndex = messages?.index;
                setTextAnimationIndex(-1);
                setID(-1);
                setLoading(false);
                setCurrentMsg(null);
                setChatHistory((pre) => {
                  const updatedItem = pre?.map((pre_item, index) => {
                    if (index === messages?.index) {
                      return pre_item?.map((x) => {
                        const modelType = Models_Plugins_Items?.find(
                          (model) =>
                            model?.regenerateModelName === messages?.model_type
                        )?.modelName;

                        if (x?.role === "assistant" && x?.type === modelType) {
                          // return ({ ...x, isError: true, isErrorMsg: messages?.content?.message ?? "Something went wrong!" });
                          return {
                            ...x,
                            isError: true,
                            isErrorMsg:
                              "There was an error generating your response",
                          };
                        } else {
                          return x;
                        }
                      });
                    } else {
                      return pre_item?.map((x) => {
                        const modelType = Models_Plugins_Items?.find(
                          (model) =>
                            model?.regenerateModelName === messages?.model_type
                        )?.modelName;
                        if (x?.role === "assistant" && x?.type === modelType) {
                          delete x.isError;
                          delete x.isErrorMsg;
                          return x;
                        } else {
                          return x;
                        }
                      });
                    }
                  });
                  return updatedItem;
                });
                dispatch(
                  setChatRegenerate({
                    canRegenerate: false,
                    isRegenerating: false,
                  })
                );
                if (msgIndex === messages?.index) {
                  const errorData = {
                    content: "There was an error generating your response",
                    isErrorMsg: "There was an error generating your response",
                    isError: true,
                    type: messages.model_type,
                    role: "assistant",
                  };
                  setData(errorData);
                }
              }
            }
          } else if (
            messages?.action === "model_chat" &&
            messages?.source === "modelToolsIcon"
          ) {
            if (
              messages?.hasOwnProperty("prompt") &&
              messages?.hasOwnProperty("user")
            ) {
              setTextAnimationIndex(-1);
              setCurrentMsgErrorIndex(-1);
              setID(messages?.index);
              setLoading(true);
              dispatch(
                setChatRegenerate({
                  canRegenerate: false,
                  isRegenerating: true,
                })
              );

              setChatHistory((pre) => {
                const updatedItem = pre?.map((pre_item) => {
                  if (pre_item[messages?.index]) {
                    return pre_item?.map((x) =>
                      x?.role === "assistant" &&
                      x?.type === messages?.model_type
                        ? { ...x, type: messages?.model_type ?? "" }
                        : x
                    );
                  } else {
                    return pre_item;
                  }
                });
                return updatedItem;
              });
            } else if (
              messages?.hasOwnProperty("content") &&
              messages?.hasOwnProperty("status_code")
            ) {
              if (messages?.status_code === 200) {
                setID(-1);
                setLoading(false);
                setChatHistory((pre) => {
                  const updatedItem = pre?.map((pre_item, pre_item_index) => {
                    if (pre_item[messages?.index]) {
                      return pre_item?.map((x, x_index) => {
                        if (
                          x?.role === "assistant" &&
                          x?.type === messages?.model_type
                        ) {
                          const chat_content = Array?.isArray(x?.content)
                            ? [...x?.content, messages?.content?.data]
                            : [x?.content, messages?.content?.data];
                          setCurrentMsgIndex(chat_content?.length - 1);
                          setTotalMsg(chat_content?.length);
                          setCurrentMsg(chat_content[chat_content?.length - 1]);

                          return { ...x, content: chat_content };
                        } else {
                          return x;
                        }
                      });
                    } else {
                      return pre_item;
                    }
                  });
                  return updatedItem;
                });
                setTextAnimationIndex(messages?.index);
                dispatch(
                  setChatRegenerate({
                    canRegenerate: false,
                    isRegenerating: false,
                  })
                );
              } else if (messages?.status_code !== 200) {
                setCurrentMsgErrorIndex(messages?.index);
                setTextAnimationIndex(-1);
                setID(-1);
                setLoading(false);
                setCurrentMsg(null);
                setChatHistory((pre) => {
                  const updatedItem = pre?.map((pre_item) => {
                    if (pre_item[messages?.index]) {
                      return pre_item?.map((x) => {
                        if (
                          x?.role === "assistant" &&
                          x?.type === messages?.model_type
                        ) {
                          return {
                            ...x,
                            isError: true,
                            isErrorMsg:
                              messages?.content?.message ??
                              "Something went wrong!",
                          };
                        } else {
                          return x;
                        }
                      });
                    } else {
                      return pre_item;
                    }
                  });
                  return updatedItem;
                });
                dispatch(
                  setChatRegenerate({
                    canRegenerate: false,
                    isRegenerating: false,
                  })
                );
              }
            }
          }
        }
      }
    }, [messages]);

    const getCurrentModelImage = (model) => {
      const currentModel = Models_Plugins_Items?.find(
        (item) =>
          item?.modelName === model ||
          item?.modelValue === model ||
          item?.regenerateModelName === model
      )?.iconSrc;
      return currentModel ?? "";
    };

    const TextReGenerateUsingSocket = (
      msgIndex,
      chatHistoryID,
      typeOfModel
    ) => {
      if (connected && ws?.readyState === WebSocket.OPEN) {
        setTextAnimationIndex(-1);
        setID(msgIndex);
        let pasthistory = [];
        chatHistory.slice(0, msgIndex + 1).map((item) => {
          let data = item.slice(0, 1);
          pasthistory.push(data);
        });
        setCurrentMsgErrorIndex(-1);
        const type = Models_Plugins_Items?.find(
          (model) => model?.modelName === typeOfModel
        )?.regenerateModelName;
        const data = {
          action: "regenerate",
          request: {
            type: type ? type : typeOfModel,
            index: msgIndex,
            id: chatHistoryID,
            userID: auth?.user?.userID,
            workspace_id: activeWorkspace?._id ?? "",
            group_id: activeGroup?._id ?? "",
            ...(pasthistory?.length > 0 && { historyData: pasthistory }),
          },
        };
        setChatHistory(chatHistory);
        // Send the msg object as a JSON-formatted string.
        ws?.send(JSON.stringify(data));
      }
    };

    const onToolsIconMenuChange = (request, category) => {
      if (connected && ws?.readyState === WebSocket.OPEN) {
        if (category === "model") {
          const data = {
            action: "model_chat",
            endpoint: "model",
            request: { ...request, source: "modelToolsIcon", prompt: "" },
          };
          ws?.send(JSON.stringify(data));
        } else if (category === "gpt") {
          const data = {
            action: "regenerate",
            request: { ...request, source: "gptToolsIcon", prompt: "" },
          };
          ws?.send(JSON.stringify(data));
        }
      }
    };
    useEffect(() => {
      // Scroll to the current index
      const element = document.querySelector(
        `[data-index='${chatHistory?.length - 1}']`
      );
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, [chatHistory?.length]);
    return (
      <>
        {/* {chatHistory?.length - 1 !== lastUnreadMsgIndex?.last_read_index &&
          lastUnreadMsgIndex?.last_read_index === msgIndex && (
            <div className="flex justify-center items-center w-full my-5">
              <hr className="bg-[#0A84FF] h-[1px] w-full border-t-0" />
              <p
                className={`flex justify-center items-center text-[#0A84FF] text-nowrap mx-2`}
              >{`September 19, 2024`}</p>
              <hr className="bg-[#0A84FF] h-[1px] w-full border-t-0" />
              <span class="text-white text-xs font-medium px-2 py-1 rounded bg-[#0A84FF] font-helvetica">
                New
              </span>
            </div>
          )} */}

        <div
          key={index}
          className="flex flex-col w-full"
          id={`message_${msgIndex}`}
        >
          {/* user compannent */}
          {userChatData ? (
            <div className={`flex justify-end w-full mb-0 pr-5 max-mxl:pr-0`}>
              {editModeIndex === index ? (
                <div className="flex flex-col mt-4 mb-7 w-full bg-[#3A3A3A] h-32 rounded-[32px]">
                  <textarea
                    value={editingMessage}
                    onChange={handleEditChange}
                    className="px-7 py-4 border-0 bg-[#3A3A3A] rounded-[32px] w-auto focus:outline-none resize-none  max-msm:text-[15px] text-[#E4E4E4] helvetica-font font-normal tracking-[0.2px] leading-[28.8px] text-[17px] text-end overflow-hidden	"
                    style={{ minWidth: "600px", maxWidth: "100%" }}
                    ref={textareaRef}
                  />
                  <div className="mt-3">
                    <div className="flex justify-end items-center pb-5 pe-5">
                      <button
                        className="px-7 py-1 mr-3 rounded-full  font-helvetica font-bold h-[36px] pt-[6px] bg-[#1E1E1E] text-[#E9E9E9]"
                        onClick={() => cancelEdit(index)}
                      >{`Cancel`}</button>
                      <button
                        className="px-6 py-1.5 whitespace-nowrap bg-[#E9E9E9] text-center text-[#0F0F0F]  rounded-full font-helvetica font-bold text-[16px]"
                        onClick={() => {
                          handleLoading();
                          submitEdit(index, msgIndex);
                        }}
                      >{`Send`}</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`flex flex-col flex-wrap justify-end content-end	 w-full mb-0 pr-5 max-mxl:pr-0`}
                >
                  {userChatData?.file_url ? (
                    <div className="w-[260px] h-[260px] mb-3	ml-auto mr-8">
                      <img
                        src={userChatData?.file_url}
                        alt="uploaded-image"
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "10px",
                        }}
                      />
                    </div>
                  ) : null}

                  <div className="flex flex-col">
                    <div className="flex flex-wrap flex-row mt-0 my-10 items-center justify-end">
                      <div className="flex flex-col justify-end ml-2 max-w-xl	">
                        {userChatData?.reply && (
                          <div className="flex flex-row ">
                            <div className="mb-[8px]">
                              <div className="flex items-start gap-[18px] mr-8">
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
                                <p className="text-[#B3B3B3] text-[17px] mb-[13px] font-normal font-helvetica line-clamp-2 max-h-[55px]">
                                  “{userChatData.reply}”
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="edit-input-field flex items-center justify-end gap-2.5 relative">
                          {auth?.user?.userID === userChatData?.user_id && (
                            <Tooltip
                              content={<p className="text-[#FFF]">Edit</p>}
                              showArrow
                              placement="top"
                              delay={0}
                              closeDelay={0}
                              classNames={{
                                base: "before:bg-[#272727]",
                                content:
                                  "bg-[#272727] text-sm font-normal leading-4 px-3 py-2",
                              }}
                              motionProps={{
                                variants: {
                                  exit: {
                                    opacity: 0,
                                    transition: {
                                      duration: 0.1,
                                      ease: "easeIn",
                                    },
                                  },
                                  enter: {
                                    opacity: 1,
                                    transition: {
                                      duration: 0.15,
                                      ease: "easeOut",
                                    },
                                  },
                                },
                              }}
                            >
                              <div
                                onClick={() => {
                                  enterEditMode(userChatData?.content);
                                  setEditModeIndex(index);
                                }}
                                className="cursor-pointer edit-icon w-10 h-10 rounded-full bg-transparent shrink-0 hover:bg-[#272727] flex justify-center items-center"
                              >
                                <EditTextIcon />
                              </div>
                            </Tooltip>
                          )}
                          <div className="max-w-max	break-words text-[20px] text-[#FFF] font-helvetica font-normal leading-8 bg-[#272727] rounded-[20px] py-2 px-5">
                            <ReactMarkDown
                              data={userChatData?.content}
                              highlightedText={highlightedText}
                            />
                          </div>
                          <div className="flex justify-center items-center absolute -right-10">
                            {auth?.user?.userID !== userChatData?.user_id && (
                              <Tooltip
                                content={
                                  <p className="text-[#FFF]">
                                    {userChatData?.user?.full_name}
                                  </p>
                                }
                                showArrow
                                placement="top"
                                delay={0}
                                closeDelay={0}
                                classNames={{
                                  base: "before:bg-[#272727]",
                                  content:
                                    "bg-[#272727] text-sm font-normal leading-4 px-3 py-2",
                                }}
                                motionProps={{
                                  variants: {
                                    exit: {
                                      opacity: 0,
                                      transition: {
                                        duration: 0.1,
                                        ease: "easeIn",
                                      },
                                    },
                                    enter: {
                                      opacity: 1,
                                      transition: {
                                        duration: 0.15,
                                        ease: "easeOut",
                                      },
                                    },
                                  },
                                }}
                              >
                                <div className="cursor-pointer">
                                  <Avatar
                                    src={
                                      userChatData?.user?.profile_picture_url
                                    }
                                    showFallback={true}
                                    className="w-8 h-8 cursor-pointer"
                                    fallback={
                                      <Image
                                        src={"/svg/user.svg"}
                                        alt="profile-pic"
                                        width={14}
                                        height={17}
                                      />
                                    }
                                  />
                                </div>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* popup menue */}
          {contextMenuPosition && (
            <ContextMenu
              setUserChatData={setUserChatData}
              setData={setData}
              setChatHistory={setChatHistory}
              chatHistory={chatHistory}
              position={contextMenuPosition}
              onClose={() => setContextMenuPosition(null)}
              index={index}
              chatHistoryID={chatHistoryID}
              msgIndex={msgIndex}
              setPinnedMessageIndex={onSetPinnedMessageIndex}
              setUnpinnedMessageIndex={onSetUnpinnedMessageIndex}
              contextedMenuPinnedStatus={contextedMenuPinnedStatus}
              currentMsg={currentMsg}
              // Add any necessary props or actions for the context menu component
            />
          )}

          {/* loader */}
          {data?.role == "loading" ? (
            <div className="flex flex-row justify-center mb-2">
              <div className="w-[100px] bg-[#23272B] rounded-[20px] mt-4">
                <div className="snippet" data-title="dot-pulse">
                  <div className="stage">
                    <div className="dot-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* assistant chat */}
          {data?.role != "assistant" ? null : (
            <div
              className={`flex flex-col w-full items-start ${
                blur && index == id ? "z-[999]" : null
              }`}
            >
              {loading == true && id == index ? (
                <div className="flex flex-row justify-center w-full mb-2">
                  <div className="w-[100px] bg-[#23272B] rounded-[20px] mt-4">
                    <div className="snippet" data-title="dot-pulse">
                      <div className="stage">
                        <div className="dot-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col max-w-max mr-[138px] max-mxl:mr-[220px] max-xl:mr-[100px] max-msm:mr-12 mb-0">
                  <div className="response-text">
                    {Array.isArray(data?.content || "") ? (
                      <div
                        className={`mt-0 max-w-max rounded-[20px] pl-[10px] flex items-start gap-4 ${
                          currentMsgErrorIndex === msgIndex && "text-red-600"
                        }`}
                        onContextMenu={(e) => {
                          const index = chatData?.findIndex(
                            (x) => x?.type == data?.type
                          );
                          return handleContextMenu(e, index, data?.pinned);
                        }}
                      >
                        <ModelsImages
                          model_img={getCurrentModelImage(data?.type)}
                          onMenuSelection={onToolsIconMenuChange}
                          msgIndex={msgIndex}
                          type={data?.type}
                        />

                        {textAnimationIndex == msgIndex ? (
                          <Typewriter
                            text={currentMsg}
                            delay={1}
                            onTypingEnd={handleTypingEnd}
                            highlightedText={highlightedText}
                          />
                        ) : (
                          <>
                            <TextSelectorok
                              setReplyText={onSetReplyText}
                              msgIndex={msgIndex}
                              ReRenderChildren={
                                currentMsg ?? currentMsgErrorIndex
                              }
                            >
                              {currentMsgErrorIndex === msgIndex ? (
                                <>
                                  {data?.isError ? (
                                    <div className="bg-[#2D2322] min-w-[720px] w-full text-white text-base py-4 px-4 rounded-2xl	border border-[#4C2727] flex gap-4">
                                      <ErrorIcon className="shrink-0" />
                                      <p>{data?.isErrorMsg}</p>
                                    </div>
                                  ) : (
                                    <div>{data?.isErrorMsg}</div>
                                  )}
                                </>
                              ) : (
                                <ReactMarkDown
                                  data={
                                    typeof currentMsg === "object"
                                      ? currentMsg?.response
                                      : currentMsg
                                  }
                                  highlightedText={highlightedText}
                                />
                              )}
                            </TextSelectorok>
                          </>
                        )}
                      </div>
                    ) : (
                      <div
                        className={`mt-0 max-w-max rounded-[20px] pl-[10px] flex items-start gap-4 ${
                          currentMsgErrorIndex === msgIndex && "text-red-600"
                        }`}
                        onContextMenu={(e) => {
                          const index = chatData?.findIndex(
                            (x) => x?.type == data?.type
                          );
                          return handleContextMenu(e, index, data?.pinned);
                        }}
                      >
                        <ModelsImages
                          model_img={getCurrentModelImage(data?.type)}
                          onMenuSelection={onToolsIconMenuChange}
                          msgIndex={msgIndex}
                          type={data?.type}
                        />

                        <div className="relative">
                          <div className="absolute top-[-28px] text-white">
                            {isReplyText?.msgIndex === msgIndex &&
                              isReplyText?.open && (
                                <div className="flex justify-start items-center gap-1">
                                  <div className="group">
                                    <svg
                                      onClick={onReplyIconClick}
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="transition-colors duration-200"
                                      width={20}
                                      height={20}
                                      viewBox="0 0 18 18"
                                      fill="none"
                                    >
                                      <path
                                        className="fill-gray-400 group-hover:fill-white transition-colors duration-200"
                                        d="M3.18745 14.25C3.49642 14.246 3.74591 13.9965 3.74995 13.6875V12.1875C3.74185 11.3397 4.07508 10.5242 4.67461 9.92467C5.27415 9.32513 6.08961 8.99191 6.93745 9H13.8299L10.2899 12.5625C10.1618 12.7879 10.2043 13.0717 10.3929 13.2497C10.5816 13.4276 10.8674 13.4536 11.0849 13.3125L15.5849 8.8125C15.6358 8.76048 15.6765 8.69944 15.7049 8.6325C15.765 8.49372 15.765 8.33628 15.7049 8.1975C15.6765 8.13056 15.6358 8.06952 15.5849 8.0175L11.0849 3.5175C10.8653 3.29816 10.5096 3.29816 10.2899 3.5175C10.0706 3.73711 10.0706 4.09289 10.2899 4.3125L13.8299 7.875H6.93745C5.79001 7.86284 4.68603 8.31328 3.87463 9.12468C3.06323 9.93609 2.61278 11.0401 2.62495 12.1875V13.6875C2.62899 13.9965 2.87848 14.246 3.18745 14.25Z"
                                        fill="#ABABAB"
                                      />
                                    </svg>
                                  </div>

                                  <Dropdown
                                    placement="left-start"
                                    classNames={{
                                      base: "before:bg-default-200",
                                      content:
                                        "py-1 px-1 bg-[#171717] min-w-[270px]",
                                    }}
                                  >
                                    <DropdownTrigger>
                                      <div className="group">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="transition-colors duration-200"
                                          width={25}
                                          height={25}
                                          viewBox="0 0 24 24"
                                          fill="none"
                                        >
                                          <path
                                            className="fill-gray-400 group-hover:fill-white transition-colors duration-200"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M20.4764 8.90909H21.5673C22.4565 8.91504 23.1759 9.63442 23.1818 10.5236V12.2036C23.1818 13.0953 22.459 13.8182 21.5673 13.8182H20.7273V14.7673C20.7951 16.4285 19.5081 17.8324 17.8473 17.9091H16.1237C15.3333 17.8975 14.5846 17.5529 14.0618 16.96C13.5499 16.3515 12.7952 16.0002 12 16.0002C11.2048 16.0002 10.4502 16.3515 9.9382 16.96C9.41545 17.5529 8.66672 17.8975 7.87639 17.9091H6.15275C4.4919 17.8324 3.20496 16.4285 3.27275 14.7673V13.8182H2.41093C1.51924 13.8182 0.796387 13.0953 0.796387 12.2036V10.5236C0.802335 9.63442 1.52172 8.91504 2.41093 8.90909H3.50184C3.90678 7.7866 4.95979 7.02826 6.15275 7H17.8473C19.0322 7.03711 20.0744 7.79386 20.4764 8.90909ZM2.45457 10.5236V12.1818L3.27275 12.1709V10.5236H2.45457ZM19.0909 14.7673C19.1545 15.5237 18.6021 16.1924 17.8473 16.2727H16.1237C15.7974 16.2706 15.4892 16.1225 15.2837 15.8691C14.4553 14.9298 13.2633 14.3917 12.0109 14.3917C10.7586 14.3917 9.56657 14.9298 8.7382 15.8691C8.53266 16.1225 8.22448 16.2706 7.8982 16.2727H6.15275C5.39791 16.1924 4.84554 15.5237 4.90911 14.7673V10.1418C4.84554 9.38538 5.39791 8.71672 6.15275 8.63636H17.8473C18.6021 8.71672 19.1545 9.38538 19.0909 10.1418V14.7673ZM20.7273 10.5345V12.1818L21.5455 12.1927V10.5345H20.7273Z"
                                            fill="#ADADAD"
                                          />
                                          <path
                                            className="fill-gray-400 group-hover:fill-white transition-colors duration-200"
                                            d="M9.8182 11.2982H6.54548C6.09361 11.2982 5.7273 11.6645 5.7273 12.1164C5.7273 12.5682 6.09361 12.9345 6.54548 12.9345H9.8182C10.2701 12.9345 10.6364 12.5682 10.6364 12.1164C10.6364 11.6645 10.2701 11.2982 9.8182 11.2982Z"
                                            fill="#ADADAD"
                                          />
                                          <path
                                            className="fill-gray-400 group-hover:fill-white transition-colors duration-200"
                                            d="M15.96 11.5382C15.8828 11.4583 15.79 11.3951 15.6873 11.3527C15.4871 11.2764 15.2657 11.2764 15.0655 11.3527C14.9628 11.3951 14.8699 11.4583 14.7927 11.5382C14.6452 11.6945 14.5632 11.9014 14.5637 12.1164C14.5594 12.2209 14.578 12.3252 14.6182 12.4218C14.6593 12.5226 14.7185 12.615 14.7927 12.6945C14.9513 12.8467 15.1621 12.9326 15.3818 12.9345C15.487 12.9337 15.591 12.9114 15.6873 12.8691C15.7881 12.828 15.8805 12.7688 15.96 12.6945C16.1115 12.5399 16.1975 12.3328 16.2 12.1164C16.2004 12.0075 16.1781 11.8998 16.1346 11.8C16.0919 11.7033 16.0329 11.6147 15.96 11.5382Z"
                                            fill="#ADADAD"
                                          />
                                          <path
                                            className="fill-gray-400 group-hover:fill-white transition-colors duration-200"
                                            d="M13.5055 11.3636C13.3052 11.2873 13.0839 11.2873 12.8837 11.3636C12.7826 11.4032 12.6927 11.4668 12.6218 11.5491C12.4663 11.701 12.3796 11.9099 12.3818 12.1273C12.3831 12.2314 12.4016 12.3346 12.4364 12.4327C12.4776 12.5361 12.5409 12.6291 12.6218 12.7055C12.7751 12.8589 12.9831 12.9453 13.2 12.9455C13.3052 12.9446 13.4092 12.9223 13.5055 12.88C13.6062 12.8389 13.6987 12.7797 13.7782 12.7055C13.9278 12.5496 14.0135 12.3433 14.0182 12.1273C14.018 11.9104 13.9317 11.7024 13.7782 11.5491C13.701 11.4692 13.6082 11.406 13.5055 11.3636Z"
                                            fill="#ADADAD"
                                          />
                                          <path
                                            className="fill-gray-400 group-hover:fill-white transition-colors duration-200"
                                            d="M18.1418 11.5273C17.9052 11.2957 17.5536 11.2271 17.2473 11.3527C17.1487 11.398 17.0569 11.4567 16.9746 11.5273C16.9031 11.609 16.8443 11.7009 16.8 11.8C16.7791 11.9007 16.7791 12.0047 16.8 12.1055C16.7783 12.2098 16.7783 12.3175 16.8 12.4218C16.8414 12.5192 16.9006 12.608 16.9746 12.6836C17.0509 12.7646 17.144 12.8279 17.2473 12.8691C17.3471 12.9126 17.4548 12.9349 17.5637 12.9345C17.669 12.935 17.7732 12.9127 17.8691 12.8691C17.9724 12.8279 18.0655 12.7646 18.1418 12.6836C18.2158 12.608 18.275 12.5192 18.3164 12.4218C18.3512 12.3199 18.3697 12.2131 18.3709 12.1055C18.3687 12.0014 18.3503 11.8984 18.3164 11.8C18.2686 11.7028 18.2101 11.6113 18.1418 11.5273Z"
                                            fill="#ADADAD"
                                          />
                                        </svg>
                                      </div>
                                    </DropdownTrigger>
                                    <DropdownMenu
                                      variant="faded"
                                      classNames={{ base: "bg-[#171717]" }}
                                    >
                                      <DropdownSection>
                                        <DropdownItem
                                          isVirtualized={true}
                                          startContent={
                                            <div>
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="transition-colors  duration-200"
                                                width={25}
                                                height={25}
                                                viewBox="0 0 24 24"
                                                fill="none"
                                              >
                                                <path
                                                  className="fill-gray-400 transition-colors duration-200"
                                                  fillRule="evenodd"
                                                  clipRule="evenodd"
                                                  d="M20.4764 8.90909H21.5673C22.4565 8.91504 23.1759 9.63442 23.1818 10.5236V12.2036C23.1818 13.0953 22.459 13.8182 21.5673 13.8182H20.7273V14.7673C20.7951 16.4285 19.5081 17.8324 17.8473 17.9091H16.1237C15.3333 17.8975 14.5846 17.5529 14.0618 16.96C13.5499 16.3515 12.7952 16.0002 12 16.0002C11.2048 16.0002 10.4502 16.3515 9.9382 16.96C9.41545 17.5529 8.66672 17.8975 7.87639 17.9091H6.15275C4.4919 17.8324 3.20496 16.4285 3.27275 14.7673V13.8182H2.41093C1.51924 13.8182 0.796387 13.0953 0.796387 12.2036V10.5236C0.802335 9.63442 1.52172 8.91504 2.41093 8.90909H3.50184C3.90678 7.7866 4.95979 7.02826 6.15275 7H17.8473C19.0322 7.03711 20.0744 7.79386 20.4764 8.90909ZM2.45457 10.5236V12.1818L3.27275 12.1709V10.5236H2.45457ZM19.0909 14.7673C19.1545 15.5237 18.6021 16.1924 17.8473 16.2727H16.1237C15.7974 16.2706 15.4892 16.1225 15.2837 15.8691C14.4553 14.9298 13.2633 14.3917 12.0109 14.3917C10.7586 14.3917 9.56657 14.9298 8.7382 15.8691C8.53266 16.1225 8.22448 16.2706 7.8982 16.2727H6.15275C5.39791 16.1924 4.84554 15.5237 4.90911 14.7673V10.1418C4.84554 9.38538 5.39791 8.71672 6.15275 8.63636H17.8473C18.6021 8.71672 19.1545 9.38538 19.0909 10.1418V14.7673ZM20.7273 10.5345V12.1818L21.5455 12.1927V10.5345H20.7273Z"
                                                  fill="#ADADAD"
                                                />
                                                <path
                                                  className="fill-gray-400 transition-colors duration-200"
                                                  d="M9.8182 11.2982H6.54548C6.09361 11.2982 5.7273 11.6645 5.7273 12.1164C5.7273 12.5682 6.09361 12.9345 6.54548 12.9345H9.8182C10.2701 12.9345 10.6364 12.5682 10.6364 12.1164C10.6364 11.6645 10.2701 11.2982 9.8182 11.2982Z"
                                                  fill="#ADADAD"
                                                />
                                                <path
                                                  className="fill-gray-400 transition-colors duration-200"
                                                  d="M15.96 11.5382C15.8828 11.4583 15.79 11.3951 15.6873 11.3527C15.4871 11.2764 15.2657 11.2764 15.0655 11.3527C14.9628 11.3951 14.8699 11.4583 14.7927 11.5382C14.6452 11.6945 14.5632 11.9014 14.5637 12.1164C14.5594 12.2209 14.578 12.3252 14.6182 12.4218C14.6593 12.5226 14.7185 12.615 14.7927 12.6945C14.9513 12.8467 15.1621 12.9326 15.3818 12.9345C15.487 12.9337 15.591 12.9114 15.6873 12.8691C15.7881 12.828 15.8805 12.7688 15.96 12.6945C16.1115 12.5399 16.1975 12.3328 16.2 12.1164C16.2004 12.0075 16.1781 11.8998 16.1346 11.8C16.0919 11.7033 16.0329 11.6147 15.96 11.5382Z"
                                                  fill="#ADADAD"
                                                />
                                                <path
                                                  className="fill-gray-400 transition-colors duration-200"
                                                  d="M13.5055 11.3636C13.3052 11.2873 13.0839 11.2873 12.8837 11.3636C12.7826 11.4032 12.6927 11.4668 12.6218 11.5491C12.4663 11.701 12.3796 11.9099 12.3818 12.1273C12.3831 12.2314 12.4016 12.3346 12.4364 12.4327C12.4776 12.5361 12.5409 12.6291 12.6218 12.7055C12.7751 12.8589 12.9831 12.9453 13.2 12.9455C13.3052 12.9446 13.4092 12.9223 13.5055 12.88C13.6062 12.8389 13.6987 12.7797 13.7782 12.7055C13.9278 12.5496 14.0135 12.3433 14.0182 12.1273C14.018 11.9104 13.9317 11.7024 13.7782 11.5491C13.701 11.4692 13.6082 11.406 13.5055 11.3636Z"
                                                  fill="#ADADAD"
                                                />
                                                <path
                                                  className="fill-gray-400 transition-colors duration-200"
                                                  d="M18.1418 11.5273C17.9052 11.2957 17.5536 11.2271 17.2473 11.3527C17.1487 11.398 17.0569 11.4567 16.9746 11.5273C16.9031 11.609 16.8443 11.7009 16.8 11.8C16.7791 11.9007 16.7791 12.0047 16.8 12.1055C16.7783 12.2098 16.7783 12.3175 16.8 12.4218C16.8414 12.5192 16.9006 12.608 16.9746 12.6836C17.0509 12.7646 17.144 12.8279 17.2473 12.8691C17.3471 12.9126 17.4548 12.9349 17.5637 12.9345C17.669 12.935 17.7732 12.9127 17.8691 12.8691C17.9724 12.8279 18.0655 12.7646 18.1418 12.6836C18.2158 12.608 18.275 12.5192 18.3164 12.4218C18.3512 12.3199 18.3697 12.2131 18.3709 12.1055C18.3687 12.0014 18.3503 11.8984 18.3164 11.8C18.2686 11.7028 18.2101 11.6113 18.1418 11.5273Z"
                                                  fill="#ADADAD"
                                                />
                                              </svg>
                                            </div>
                                          }
                                          endContent={
                                            <div className="plus-icon">
                                              <svg
                                                width="17"
                                                height="17"
                                                viewBox="0 0 17 17"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path
                                                  d="M15.0833 7.16667H10.5C10.0398 7.16667 9.66667 6.79357 9.66667 6.33333V1.75C9.66667 1.05964 9.10702 0.5 8.41667 0.5C7.72631 0.5 7.16667 1.05964 7.16667 1.75V6.33333C7.16667 6.79357 6.79357 7.16667 6.33333 7.16667H1.75C1.05964 7.16667 0.5 7.72631 0.5 8.41667C0.5 9.10702 1.05964 9.66667 1.75 9.66667H6.33333C6.79357 9.66667 7.16667 10.0398 7.16667 10.5V15.0833C7.16667 15.7737 7.72631 16.3333 8.41667 16.3333C9.10702 16.3333 9.66667 15.7737 9.66667 15.0833V10.5C9.66667 10.0398 10.0398 9.66667 10.5 9.66667H15.0833C15.7737 9.66667 16.3333 9.10702 16.3333 8.41667C16.3333 7.72631 15.7737 7.16667 15.0833 7.16667Z"
                                                  fill="#858584"
                                                />
                                              </svg>
                                            </div>
                                          }
                                          classNames={{
                                            title:
                                              "text-[#858584] text-sm	font-bold	font-helvetica",
                                            base: "!bg-transparent !border-0",
                                          }}
                                        >
                                          {`Your GPTs`}
                                        </DropdownItem>
                                      </DropdownSection>
                                      <DropdownSection
                                        classNames={{
                                          MenuItem: "p-0",
                                          group:
                                            "max-h-[165px] overflow-auto pr-[8px] -mr-[8px] !scrollbar-thumb-red !scrollbar-track-white",
                                        }}
                                      >
                                        <DropdownItem
                                          classNames={{
                                            title:
                                              "text-[#CCCCCC] text-[14px] font-helvetica flex items-center justify-between",
                                            disabled:
                                              "opacity-50 cursor-not-allowed",
                                            base: "p-[4px] !hover:bg-[#383838] !border-0",
                                          }}
                                          startContent={
                                            <div className="bg-[#95A01F] w-[34px] h-[34px] flex items-center rounded-[50%]" />
                                          }
                                          endContent={
                                            <>
                                              <p className="text-[#77FF61] font-helvetica font-bold text-[10px] flex items-center gap-1">
                                                {`Added`}
                                                <Righticon />
                                              </p>
                                            </>
                                          }
                                        >
                                          {`Joe Rogan GPT`}
                                        </DropdownItem>
                                        <DropdownItem
                                          classNames={{
                                            title:
                                              "text-[#CCCCCC] text-[14px] font-helvetica flex items-center justify-between ",
                                            disabled:
                                              "opacity-50 cursor-not-allowed",
                                            base: "p-[4px] !hover:bg-[#383838] !border-0",
                                          }}
                                          startContent={
                                            <div className="bg-[#F29D4F] w-[34px] h-[34px] flex items-center rounded-[50%]" />
                                          }
                                          endContent={
                                            <>
                                              <MoreIcon />
                                            </>
                                          }
                                        >
                                          {`Elon Musk GPT`}
                                        </DropdownItem>
                                        <DropdownItem
                                          classNames={{
                                            title:
                                              "text-[#CCCCCC] text-[14px] font-helvetica",
                                            disabled:
                                              "opacity-50 cursor-not-allowed",
                                            base: "p-[4px] !hover:bg-[#383838] !border-0",
                                          }}
                                          startContent={
                                            <div className="bg-[#5916E7] w-[34px] h-[34px] flex items-center rounded-[50%]"></div>
                                          }
                                        >
                                          {`Jermey Watts GPT`}
                                        </DropdownItem>
                                        <DropdownItem
                                          classNames={{
                                            title:
                                              "text-[#CCCCCC] text-[14px] font-helvetica",
                                            disabled:
                                              "opacity-50 cursor-not-allowed",
                                            base: "p-[4px] !hover:bg-[#383838] !border-0",
                                          }}
                                          startContent={
                                            <div className="bg-[#984E4E] w-[34px] h-[34px] flex items-center rounded-[50%]" />
                                          }
                                        >
                                          {`Alex Hormozi GPT`}
                                        </DropdownItem>
                                        <DropdownItem
                                          classNames={{
                                            title:
                                              "text-[#CCCCCC] text-[14px] font-helvetica",
                                            disabled:
                                              "opacity-50 cursor-not-allowed",
                                            base: "p-[4px] !hover:bg-[#383838] !border-0",
                                          }}
                                          startContent={
                                            <div className="bg-[#984E4E] w-[34px] h-[34px] flex items-center rounded-[50%]" />
                                          }
                                        >
                                          {`Alex Hormozi GPT`}
                                        </DropdownItem>
                                      </DropdownSection>
                                    </DropdownMenu>
                                  </Dropdown>
                                </div>
                              )}
                          </div>
                          {textAnimationIndex == msgIndex ? (
                            <Typewriter
                              text={data?.content}
                              delay={1}
                              onTypingEnd={handleTypingEnd}
                              highlightedText={highlightedText}
                            />
                          ) : (
                            <>
                              <TextSelectorok
                                setReplyText={onSetReplyText}
                                msgIndex={msgIndex}
                                ReRenderChildren={
                                  data?.content ||
                                  currentMsgErrorIndex ||
                                  data?.isError
                                }
                              >
                                {currentMsgErrorIndex === msgIndex ? (
                                  <>
                                    {data?.isError ? (
                                      <div className="bg-[#2D2322] min-w-[720px] w-full text-white text-base py-4 px-4 rounded-2xl	border border-[#4C2727] flex gap-4 items-center">
                                        <ErrorIcon className="shrink-0" />
                                        <p>{data?.isErrorMsg}</p>
                                        <Button
                                          className="text-[#131313] bg-[#F9F9F9] font-bold text-base rounded-full flex items-center ml-auto h-[38px]"
                                          onClick={() =>
                                            Regenerate(
                                              msgIndex,
                                              chatHistoryID,
                                              data
                                            )
                                          }
                                        >
                                          <RegenerateIcon setValue={setValue} />
                                          <p>Regenerating</p>
                                        </Button>
                                      </div>
                                    ) : (
                                      <div className="bg-[#2D2322] min-w-[720px] w-full text-white text-base py-4 px-4 rounded-2xl	border border-[#4C2727] flex gap-4">
                                        <ErrorIcon className="shrink-0" />
                                        <p>{data?.isErrorMsg}</p>
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <ReactMarkDown
                                    data={data?.content}
                                    highlightedText={highlightedText}
                                  />
                                )}
                              </TextSelectorok>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    <div
                      className={`flex flex-row w-full pr-10 mt-4 ms-[60px] reply-btn`}
                    >
                      {data?.isError === true ? (
                        <></>
                      ) : (
                        <>
                          <div className="flex flex-row gap-3 items-center">
                            {Array.isArray(data?.content || "")  && (
                            <div className="flex text-[#fff] text-[14.2px] font-helvetica mt-[3px] select-none">
                              <div onClick={handleLeftClick}>
                                <ChevronLeftIcon
                                  stroke={
                                    currentMsgIndex > 0 ? "#ffffff" : "#6F6F6F"
                                  }
                                  height={23}
                                  width={20}
                                />
                              </div>
                              <p className="text-[#fff] text-[14.2px] font-helvetica tracking-[2px]">
                                {currentMsgIndex + 1} / {totalMsg}
                              </p>
                              <div onClick={handleRightClick}>
                                <ChevronRightIcon
                                  stroke={
                                    currentMsgIndex + 1 ===
                                    data?.content?.length
                                      ? "#6F6F6F"
                                      : "#ffffff"
                                  }
                                  height={23}
                                  width={20}
                                />
                              </div>
                            </div>
                            )}

                            <Tooltip
                              content={<p className="text-[#FFF]">Listen</p>}
                              showArrow
                              placement="bottom"
                              delay={0}
                              closeDelay={0}
                              classNames={{
                                base: "before:bg-[#2E353C]",
                                content:
                                  "bg-[#272727] text-sm font-normal leading-4 px-3 py-2",
                              }}
                              motionProps={{
                                variants: {
                                  exit: {
                                    opacity: 0,
                                    transition: {
                                      duration: 0.1,
                                      ease: "easeIn",
                                    },
                                  },
                                  enter: {
                                    opacity: 1,
                                    transition: {
                                      duration: 0.15,
                                      ease: "easeOut",
                                    },
                                  },
                                },
                              }}
                            >
                              <div className="group cursor-pointer">
                                <VolumeIcon className="text-[#6F6F6F] group-hover:text-white" />
                              </div>
                            </Tooltip>

                            <Tooltip
                              content={
                                <p className="text-[#FFF]">{tooltip.text}</p>
                              }
                              showArrow
                              placement="bottom"
                              delay={0}
                              closeDelay={0}
                              classNames={{
                                base: "before:bg-[##2E353C]",
                                content:
                                  "bg-[#272727] text-sm font-normal leading-4 px-3 py-2",
                              }}
                              motionProps={{
                                variants: {
                                  exit: {
                                    opacity: 0,
                                    transition: {
                                      duration: 0.1,
                                      ease: "easeIn",
                                    },
                                  },
                                  enter: {
                                    opacity: 1,
                                    transition: {
                                      duration: 0.15,
                                      ease: "easeOut",
                                    },
                                  },
                                },
                              }}
                              isOpen={tooltip.isOpen}
                              onOpenChange={(open) =>
                                setTooltip((pre) => ({ ...pre, isOpen: open }))
                              }
                            >
                              <div
                                onClick={() =>
                                  HandleCopyTextOnClipboard(data?.content)
                                }
                              >
                                <CopyIcon className="cursor-pointer text-[#6F6F6F] hover:text-white" />
                              </div>
                            </Tooltip>

                            <Tooltip
                              content={
                                <p className="text-[#FFF]">Regenerate</p>
                              }
                              showArrow
                              placement="bottom"
                              delay={0}
                              closeDelay={0}
                              classNames={{
                                base: "before:bg-[#2E353C]",
                                content:
                                  "bg-[#272727] text-sm font-normal leading-4 px-3 py-2",
                              }}
                              motionProps={{
                                variants: {
                                  exit: {
                                    opacity: 0,
                                    transition: {
                                      duration: 0.1,
                                      ease: "easeIn",
                                    },
                                  },
                                  enter: {
                                    opacity: 1,
                                    transition: {
                                      duration: 0.15,
                                      ease: "easeOut",
                                    },
                                  },
                                },
                              }}
                            >
                              <div
                                onClick={() =>
                                  Regenerate(msgIndex, chatHistoryID, data)
                                }
                              >
                                <RegenIcon className="cursor-pointer text-[#6F6F6F] hover:text-white" />
                              </div>
                            </Tooltip>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </>
    );
  }
);

export default Text_History;

const ContextMenu = ({
  setChatHistory,
  chatHistory,
  position,
  onClose,
  index,
  chatHistoryID,
  msgIndex,
  setPinnedMessageIndex,
  setUnpinnedMessageIndex,
  contextedMenuPinnedStatus,
  currentMsg,
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [onClose]);

  const handlePinMessage = () => {
    let data = JSON.stringify({
      id: chatHistoryID,
      index: index,
      msgIndex: msgIndex,
    });

    axios
      .post(`${apiURL}/ai/updatePinnedMessage`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        if (response.status == 200) {
          setPinnedMessageIndex(msgIndex, index);
        }
      })
      .catch((err) => {
        toast.error(
          (err?.message ?? err?.data?.message) || "Something went wrong!"
        );
      });

    onClose();
  };

  const handleReply = (index, chatHistoryID) => {
    onClose();
  };

  const handleDeleteChat = () => {
    const indexArr = chatHistory.reduce(function (a, e, i) {
      a.push(i);
      return a;
    }, []);
    let data = JSON.stringify({
      id: chatHistoryID,
      chatIndex: msgIndex,
      msgIndices: indexArr,
    });

    axios
      .post(`${apiURL}/ai/deleteMessage`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        if (response.status == 200) {
          const _chatHistory = [...chatHistory];
          _chatHistory.splice(msgIndex, 1);
          setChatHistory(_chatHistory);
        }
      })
      .catch((err) => {
        toast.error(
          (err?.message ?? err?.data?.message) || "Something went wrong!"
        );
      });
    onClose();
  };

  const handleUnpinMessage = () => {
    let data = JSON.stringify({
      id: chatHistoryID,
      index: index,
      msgIndex: msgIndex,
    });
    let type = "ai";

    axios
      .post(`${apiURL}/${type}/unPinnedMessage`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        if (response.status == 200) {
          setUnpinnedMessageIndex(msgIndex, index);
        }
      })
      .catch((err) => {
        toast.error(
          (err?.message ?? err?.data?.message) || "Something went wrong!"
        );
      });
    onClose();
    // Function to hide pinned message when close button is clicked
  };

  const HandleAddToGPT = () => {
    onClose();
  };

  const HandleCopyToClipboard = () => {
    navigator?.clipboard?.writeText(currentMsg);
    onClose();
  };

  return (
    <>
      <div
        ref={menuRef}
        className="absolute z-10 border-gray-300 rounded shadow"
        style={{ top: position.y, left: position.x }}
      >
        <div className="flex gap-0 flex-col min-w-[180px] p-2 text-sm text-white rounded-xl bg-[#2F2F2F] max-w-[200px]">
          <div
            className="flex gap-2 hover:bg-[#505050] cursor-pointer items-center rounded-md px-2 py-1.5"
            onClick={HandleCopyToClipboard}
          >
            <div className="h-6 w-6 flex flex-col items-center justify-center">
              <CopyIcon className="text-white" />
            </div>
            <div className="font-helvetica text-white">{"Copy"}</div>
          </div>
          <div
            className="flex gap-2 hover:bg-[#505050] cursor-pointer items-center rounded-md px-2 py-1.5"
            onClick={HandleAddToGPT}
          >
            <div>
              <AddToGptIcon className="text-white" />
            </div>
            <div className="font-helvetica text-white">{"Add to GPT"}</div>
          </div>
          <div
            className="flex gap-2 hover:bg-[#505050] cursor-pointer items-center rounded-md px-2 py-1.5"
            onClick={handleDeleteChat}
          >
            <div>
              <DeleteIcon />
            </div>
            <div className="font-helvetica text-[#E54637]">{"Delete"}</div>
          </div>
        </div>
      </div>
    </>
  );
};
