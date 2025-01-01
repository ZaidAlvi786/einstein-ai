"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useModelStatus } from "../context/ModelStatusContext";
import {
  Tabs,
  Tab,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { apiURL } from "@/config";
import ReactMarkDown from "../Markdown";
import toast from "react-hot-toast";

const ContextMenu = ({
  position,
  onClose,
  index,
  imgHistoryID,
  msgIndex,
  setPinnedMessageIndex,
  setUnpinnedMessageIndex,
  contextedMenuPinnedStatus,
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
      id: imgHistoryID,
      index: 0,
      msgIndex: msgIndex,
    });

    axios
      .post(`${apiURL}/img/updatePinnedMessage`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        if (response.status == 200) {
          setPinnedMessageIndex(msgIndex, 0);
        }
      }).catch(err => {
        toast.error((err?.message ??  err?.data?.message) || "Something went wrong!")

      });

    onClose();
  };

  const handleUnpinMessage = () => {
    let data = JSON.stringify({
      id: imgHistoryID,
      index: 0,
      msgIndex: msgIndex,
    });
    let type = "img";

    axios
      .post(`${apiURL}/${type}/unPinnedMessage`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        if (response.status == 200) {
          setUnpinnedMessageIndex(msgIndex, 0);
        }
      }).catch(err => {
        toast.error((err?.message ??  err?.data?.message) || "Something went wrong!")

      })
    onClose();
    // Function to hide pinned message when close button is clicked
  };

  const handleReply = (index, chatHistoryID) => {
    onClose();
  };

  const handleDeleteChat = (index, chatHistoryID) => {
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="absolute z-10  border-gray-300 rounded shadow"
      style={{ top: position.y, left: position.x }}
    >
      <div className="flex flex-col min-w-[180px] px-3.5 py-2.5 text-sm text-white rounded-3xl border border-solid bg-neutral-900 border-zinc-800 max-w-[200px]">
        {contextedMenuPinnedStatus ? (
          <div
            className="flex gap-3.5 font-nasalization"
            onClick={() => handleUnpinMessage()}
          >
            <img
              loading="lazy"
              src="svg/pin.svg"
              className="shrink-0 aspect-square w-[19px]"
            />
            <img
              loading="lazy"
              src="/Close.png"
              className="shrink-0 aspect-square w-[19px] h-[19px] -ml-[33px] mt-[0px]"
            />
            Unpin Message
          </div>
        ) : (
          <div
            className="flex gap-3.5 font-nasalization"
            onClick={() => handlePinMessage()}
          >
            <img
              loading="lazy"
              src="svg/pin.svg"
              className="shrink-0 aspect-square w-[19px]"
            />
            Pin Message
          </div>
        )}

        {/* <hr className="border-t border-white opacity-20 my-1" />
        <div
          className="flex gap-4 mt-2 whitespace-nowrap font-nasalization "
          onClick={() => handleReply()}
        >
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/90b7eeeb6bf39af11ebb11cb9ec49d25a1ca4ad8248115a41ea1e336ff1f80dd?apiKey=6de9a78aeb4b4f99a25ac6d0f9462b85&"
            className="shrink-0 self-start aspect-[1.14] fill-stone-300 w-[17px]"
          />
          Reply
        </div>
        <hr className="border-t border-white opacity-20 my-1" />
        <div
          className="flex gap-3.5 mt-2 text-pink-500 font-nasalization "
          onClick={() => handleDeleteChat()}
        >
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/6e27d9edb44a4b1cc6c6733ac25ffa0e13bd9f56222deb91bf014d92c06f39d5?apiKey=6de9a78aeb4b4f99a25ac6d0f9462b85&"
            className="shrink-0 w-5 aspect-[0.95]"
          />
          Delete Chat
        </div> */}
      </div>
    </div>
  );
};

const Img_History = ({
  chatData,
  imgHistory,
  imgHistoryID,
  id,
  index,
  loading,
  setImgHistory,
  setLoading,
  setSwitchStatus,
  setID,
  ratio,
  setPinnedMessageText,
  setPinnedMessageIndex,
  setPinnedMessageMsgIndex,
  setPinnedMessageMsgType,
  msgIndex,
  checkEditPinnedMessage,
  setToggleStatus,
  auth,
  pattern,
  setIsUpgradePaymentModalOpen,
  setIsPaymentModalOpen,
  currentMsgErrorIndex,
  setCurrentMsgErrorIndex,
  errorMessage,
  type,
}) => {
  const { imgStatus, setImgStatus } = useModelStatus();
  const [imageList, setImageList] = useState([
    "DALL-E",
    "Stable Diffusion XL",
    "Stable Diffusion 2",
    "Leonardo",
  ]);
  const tooltipModalContent = [
    "DALL-E",
    "Stable Diffusion XL",
    "Stable Diffusion 2",
    "Leonardo",
  ];
  const [tabSelected, setTabSelected] = useState(type);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [heart, setHeart] = useState(false);
  const [upScale, setUpScale] = useState(false);
  const [number, setNumber] = useState();
  const [editingMessage, setEditingMessage] = useState("");
  const [editModeIndex, setEditModeIndex] = useState(-1);
  const textareaRef = useRef(null);
  const [contextMenuPosition, setContextMenuPosition] = useState(null);
  const [contextedMenuIndex, setContextedMenuIndex] = useState();
  const [contextedMenuPinnedStatus, setContextedMenuPinnedStatus] =
    useState(false);
  const [highlightedText, setHighlightedText] = useState("");
  const [userChatData, setUserChatData] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    let selectData = chatData?.find(
      (x) => x?.type == type || x?.role == "loading"
    );
    const userData = chatData?.find((x) => x?.role == "user");
    setUserChatData(userData);
    if (!selectData) {
      selectData = { type, content: [], role: "assistant" };
    }
    setData(selectData);
  }, [chatData, msgIndex]);

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

  const submitEdit = (index, model_type, msgIndex) => {

    const updatedChatHistory = [...imgHistory];
    const _index = updatedChatHistory[msgIndex]?.findIndex(
      (x) => x?.role == "user"
    );

    updatedChatHistory[msgIndex][_index].content = editingMessage;
    // updatedChatHistory[msgIndex].splice(index + 1); // Remove messages after the edited message
    // updatedChatHistory.splice(msgIndex + 1); // Remove messages after the edited message

    // let pasthistory = [];
    // updatedChatHistory.forEach((item) => {
    //   let data = [...item]; // Create a shallow copy of the item
    //   pasthistory.push(data);
    // });

    const pastHistory = updatedChatHistory.map((item) => [...item]);

    let sumData = {
      type: model_type,
      id: imgHistoryID,
      history: pastHistory,
      prompt: editingMessage,
      number: (index - 1) / 2,
      size: ratio,
      userID: auth.user.userID,
    };

    updatedChatHistory[msgIndex][_index] = { role: "loading" };
    setImgHistory(updatedChatHistory);

    // if (
    //   updatedChatHistory[msgIndex][index].hasOwnProperty("pinned") &&
    //   updatedChatHistory[msgIndex][index].pinned === true
    // ) {
    //   // The key "pinned" exists and its value is true
    //   onSetPinnedMessageIndex(msgIndex, index);
    // }

    checkEditPinnedMessage(msgIndex, _index, "image", editingMessage);

    // Mocking API call, replace it with your actual API call
    setTimeout(() => {
      let a = [...updatedChatHistory];
      setCurrentMsgErrorIndex(-1);
      axios
        .post(`${apiURL}/img/edit`, sumData, {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          a[msgIndex] = [{ role: "user", content: "loading" }, response.data];
          setImgHistory(a);
          setData(a[msgIndex]);
        })
        .catch((error) => {
          if (error.response && error.response.status === 403) {
            if (auth.user.plan == "free") {
              setIsUpgradePaymentModalOpen(true);
            } else {
              setIsPaymentModalOpen(true);
            }
          } else {
            setCurrentMsgErrorIndex(msgIndex);
            const errorData = {
              content: error.message || errorMessage,
              type: data.new_type,
              role: "user",
            };
            setUserChatData(errorData);
            updatedChatHistory[msgIndex][_index] = errorData;
            setImgHistory(updatedChatHistory);

            // a[pasthistory.length - 1].push(error.message || errorMessage);
            // Handle other errors
        toast.error((error?.message ??  error?.data?.message) || "Something went wrong!")

          }
        })
        .finally(() => {
          setLoading(false);
        });
    }, 2000); // Mock API response time (2 seconds)
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

  const download = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "image.jpg");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const Summarize = (data, id, msgIndex) => {
    data.userID = auth.user.userID;
    let a = [...imgHistory];
    a[msgIndex].push({ role: "loading" });
    setCurrentMsgErrorIndex(-1);

    axios
      .post(`${apiURL}/img/summarize`, data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        const newData = {
          content: response.data.data,
          type: data.new_type,
          role: "assistant",
        };
        a[msgIndex][a[msgIndex]?.length - 1 || 0] = newData;
        setData(newData);
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          if (auth.user.plan == "free") {
            setIsUpgradePaymentModalOpen(true);
          } else {
            setIsPaymentModalOpen(true);
          }
        } else {
          setCurrentMsgErrorIndex(msgIndex);
          const errorData = {
            content: error.message || errorMessage,
            type: data.new_type,
            role: "assistant",
          };
          setData(errorData);
          a[msgIndex][a[msgIndex]?.length - 1 || 0] = errorData; // Handle other errors
        }
      })
      .finally(() => {
        setLoading(false);
        setImgHistory(a);
      });
  };

  // const getDataByType = (id, i) => {
  //   axios
  //     .get(`${apiURL}/img/getImageDataByID/${id}`, {
  //       headers: { "Content-Type": "application/json" },
  //     })
  //     .then((response) => {
  //       let a = [...imgHistory];
  //       let b = [];
  //       response.data.data.history[(i - 1) / 2].map((item, index) => {
  //         if (item.type == tabSelected) b.push(item);
  //       });
  //       a[i] = b[0];
  //       setLoading(false);
  //       setImgHistory(a);
  //     });
  // };

  const handleOpen = (i) => {
    onOpen();
    setID(i);
  };

  const heartFunc = () => {
    if (heart == false) setHeart(true);
    else setHeart(false);
  };

  const onSetPinnedMessageIndex = (msgIndex, index) => {
    setPinnedMessageMsgIndex(msgIndex);
    setPinnedMessageIndex(index);
    setPinnedMessageText(imgHistory[msgIndex][index].content);
    setPinnedMessageMsgType("image");

    const updatedImageHistory = imgHistory.map((msg, i) => {
      return msg.map((item, j) => ({
        ...item,
        pinned: j === index && i === msgIndex ? true : false,
      }));

      return msg;
    });

    setImgHistory(updatedImageHistory);
  };

  const onSetUnpinnedMessageIndex = (msgIndex, index) => {
    setPinnedMessageMsgIndex(0);
    setPinnedMessageIndex(0);
    setPinnedMessageText("");
    setPinnedMessageMsgType("");
    const updatedImageHistory = [...imgHistory];
    delete updatedImageHistory[msgIndex][index].pinned;
    setImgHistory(updatedImageHistory);
  };

  const handleToggleStatus = () => {
    setToggleStatus(0);
  };

  useEffect(() => {
    if (pattern.length > 0) {
      setHighlightedText(pattern);
    }
  }, [pattern]);

  return (
    <div key={index} className="flex flex-col w-full">
      {userChatData ? (
        <div className={`flex justify-end w-full mb-4 pr-5 max-mxl:pr-0`}>
          {editModeIndex === index ? (
            <div className="flex flex-col mt-4">
              <textarea
                value={editingMessage}
                onChange={handleEditChange}
                className="px-3 py-2 border border-white rounded-md w-auto focus:outline-none focus:ring focus:border-blue-300 resize-none text-white bg-transparent"
                style={{
                  minWidth: "600px",
                  maxWidth: "100%",
                  minHeight: "100px",
                }}
                ref={textareaRef}
              />
              <div className="mt-3">
                <div className="flex  justify-end items-center">
                  <button
                    className="px-2 py-1 whitespace-nowrap rounded-md bg-blue-500 hover:bg-blue-700 text-white mr-2"
                    onClick={() => {
                      handleLoading(); // Call handleLoading to handle loading state
                      let model_type =
                        index + 1 < imgHistory.length &&
                        imgHistory[index + 1].type !== undefined
                          ? imgHistory[index + 1].type
                          : "DALL-E";
                      submitEdit(index, model_type, msgIndex);
                    }}
                  >
                    Submit & Save
                  </button>
                  <button
                    className="px-2 py-1 text-white rounded-md border border-indigo-400 border-solid text-center"
                    onClick={() => cancelEdit(index)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="flex flex-wrap flex-row mt-4"
              onContextMenu={(e) =>
                handleContextMenu(e, index, userChatData?.pinned)
              }
            >
              <Tooltip
                content={<p className="text-[#FFF]">Edit</p>}
                showArrow
                placement="bottom"
                delay={0}
                closeDelay={0}
                classNames={{
                  base: ["before:bg-[##2E353C]"],
                  content: [
                    "bg-[#2E353C] text-sm font-normal leading-4 px-3 py-2",
                  ],
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
                <div className="flex items-center">
                  <Image
                    alt="edit icon"
                    width={16}
                    height={21}
                    onClick={() => {
                      enterEditMode(userChatData?.content);
                      setEditModeIndex(index);
                    }}
                    src={"svg/edit.svg"}
                    className="cursor-pointer"
                    style={{ marginRight: "8px" }}
                  />
                </div>
              </Tooltip>

              <div
                className={`max-w-[650px] max-xl:max-w-[400px] max-msm:max-w-[250px] break-words text-[20px] text-[#FFF] font-helvetica font-normal leading-8 bg-[#0A84FF] rounded-[20px] py-1 px-5 ${
                  currentMsgErrorIndex === msgIndex && "text-red-600"
                }`}
              >
                {currentMsgErrorIndex === msgIndex ? (
                  <div>{userChatData.content}</div>
                ) : (
                  userChatData?.content && (
                    <ReactMarkDown
                      data={userChatData.content}
                      highlightedText={highlightedText}
                    />
                  )
                )}
              </div>
            </div>
          )}
        </div>
      ) : null}

      {userChatData && contextMenuPosition && (
        <ContextMenu
          position={contextMenuPosition}
          onClose={() => setContextMenuPosition(null)}
          index={index}
          imgHistoryID={imgHistoryID}
          msgIndex={msgIndex}
          setPinnedMessageIndex={onSetPinnedMessageIndex}
          setUnpinnedMessageIndex={onSetUnpinnedMessageIndex}
          contextedMenuPinnedStatus={contextedMenuPinnedStatus}
          // Add any necessary props or actions for the context menu component
        />
      )}

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
      {data?.role != "assistant" ? null : (
        <div className="flex flex-col w-full">
          <div className="flex flex-row gap-2 mb-2">
            <div className="flex flex-wrap gap-0 p-0 mt-6">
              <Tabs
                size="sm"
                radius="lg"
                variant="light"
                selectedKey={tabSelected || type}
                onSelectionChange={setTabSelected}
                onClick={(e) => {
                  setUpScale(false);

                  const selectData = chatData?.find(
                    (x) => x?.type == e.target.outerText
                  );
                  setTabSelected(e.target.outerText);
                  setSwitchStatus(true);
                  if (selectData) {
                    setData(selectData);
                  } else {
                    let sumData = {
                      new_type: e.target.outerText,
                      id: imgHistoryID,
                      prompt: userChatData?.content,
                      number: msgIndex,
                      size: ratio,
                    };

                    setLoading(true);
                    setID(index);
                    let x = {
                      id: msgIndex,
                      historyID: imgHistoryID,
                    };
                    Summarize(sumData, index, msgIndex);
                  }

                  // axios
                  //   .post(`${apiURL}/img/getType/`, x, {
                  //     headers: {
                  //       "Content-Type": "application/json",
                  //     },
                  //   })
                  //   .then((response) => {
                  //     if (response.data.data.indexOf(tabSelected) == -1) {
                  //       console.log("sumData:", sumData);
                  //       console.log("index:", index);

                  //     } else getDataByType(imgHistoryID, index);
                  //   });
                }}
                classNames={{
                  tabList: "w-full relative border-divider p-0 gap-0",
                  cursor: "w-full bg-[#2E353C] p-0",
                  tabContent:
                    "group-data-[selected=true]:text-[#FFF] p-0 font-nasalization",
                  panel: "text-[100px]",
                }}
                aria-label="Tabs variants"
              >
                {imgStatus.map(
                  (item, index) =>
                    item && (
                      <Tab
                        className="px-2"
                        key={imageList[index]}
                        title={
                          <p
                            className={`${
                              getMatchModelType(imageList[index])
                                ? "text-white"
                                : ""
                            }`}
                          >
                            {imageList[index]}
                          </p>
                        }
                      />
                      // </Tooltip>
                    )
                )}
              </Tabs>
            </div>
            <div
              className="flex flex-wrap mt-6 cursor-pointer"
              onClick={() => {
                setToggleStatus(0);
              }}
            >
              <Tooltip
                content={
                  <div>
                    <p className="text-[#FFF]">
                      Add more{" "}
                      <Link
                        href=""
                        onClick={handleToggleStatus}
                        className="text-[#0A84FF]"
                      >
                        models
                      </Link>
                    </p>
                  </div>
                }
                showArrow
                placement="top"
                delay={0}
                closeDelay={0}
                classNames={{
                  base: ["before:bg-[##2E353C]"],
                  content: [
                    "bg-[#2E353C] text-sm font-normal leading-4 px-3 py-2",
                  ],
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
                <Image
                  alt="model-plus icon"
                  width={16}
                  height={16}
                  src={"svg/modelplus.svg"}
                />
              </Tooltip>
            </div>
          </div>
          {loading == true && id == index ? (
            <div className="flex flex-row w-full justify-center mb-2">
              <div className="w-[100px] bg-[#23272B] rounded-[20px] mt-4">
                <div className="snippet" data-title="dot-pulse">
                  <div className="stage">
                    <div className="dot-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`grid ${
                upScale == true ? "grid-cols-1" : "grid-cols-2"
              } gap-1 max-w-[720px] mb-2 w-full`}
            >
              {data?.content?.map((item, i) => (
                <div
                  key={i}
                  onClick={() => handleOpen(index)}
                  className={`${upScale == true ? "hidden" : ""}`}
                >
                  <Image
                    alt="img"
                    width={360}
                    height={256}
                    src={item.url}
                    className={`${
                      data.size == "512x512"
                        ? "aspect-[1/1]"
                        : data.size == "512x341.33"
                        ? "aspect-[3/2]"
                        : data.size == "512x288"
                        ? "aspect-[16/9]"
                        : data.size == "512x219.43"
                        ? "aspect-[21/9]"
                        : data.size == "512x170.67"
                        ? "aspect-[3/1]"
                        : data.size == "512x128"
                        ? "aspect-[4/1]"
                        : data.size == "512x768"
                        ? "aspect-[2/3]"
                        : data.size == "512x910.22"
                        ? "aspect-[9/16]"
                        : data.size == "512x1194.67"
                        ? "aspect-[9/21]"
                        : data.size == "512x3072"
                        ? "aspect-[1/3]"
                        : data.size == "512x2048"
                        ? "aspect-[1/4]"
                        : "aspect-[1/1]"
                    }`}
                  />
                </div>
              ))}
              {upScale == true ? (
                <Image
                  alt="img"
                  width={720}
                  height={256}
                  src={data.content[number].url}
                  onClick={() => handleOpen(index)}
                  className={`${
                    data.size == "1024x1024"
                      ? "aspect-1/1"
                      : data.size == "1152x896"
                      ? "aspect-9/7"
                      : data.size == "1216x832"
                      ? "aspect-19/13"
                      : data.size == "1344x768"
                      ? "aspect-7/4"
                      : data.size == "896x1152"
                      ? "aspect-7/9"
                      : data.size == "832x1216"
                      ? "aspect-13/19"
                      : data.size == "768x1344"
                      ? "aspect-4/7"
                      : data.size == "640x1536"
                      ? "aspect-5/12"
                      : "aspect-1/1"
                  }`}
                />
              ) : null}

              <Modal
                size="3xl"
                isOpen={isOpen}
                onClose={onClose}
                shouldCloseOnOverlayClick={true}
                hideCloseButton
                className="bg-[#181818] overflow-auto"
                classNames={{
                  backdrop:
                    "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
                }}
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col justify-end items-end gap-1 z-[999]">
                        <div className="flex flex-row gap-6 z-[999]">
                          <Image
                            alt="img"
                            width={24}
                            height={24}
                            className="cursor-pointer"
                            src={`${
                              heart == false
                                ? "/svg/heart.svg"
                                : "/svg/heart_active.svg"
                            }`}
                            onClick={() => heartFunc()}
                          />
                          <Image
                            alt="img"
                            width={24}
                            height={24}
                            className="cursor-pointer"
                            src={"/svg/external.svg"}
                          />
                          <Image
                            alt="img"
                            width={24}
                            height={24}
                            className="cursor-pointer"
                            src={"/svg/download.svg"}
                            onClick={() => download(data.content[number].url)}
                          />
                          <Image
                            alt="img"
                            width={18}
                            height={18}
                            onClick={() => onClose()}
                            className="cursor-pointer"
                            src={"/svg/close.svg"}
                          />
                        </div>
                      </ModalHeader>
                      <ModalBody>
                        {upScale == false ? (
                          <div className="grid grid-cols-2 max-w-[1000px] mx-auto my-auto gap-1 w-full">
                            {data.content.map((item, i) => (
                              <Image
                                key={i}
                                alt="img"
                                width={500}
                                height={180}
                                className={`${
                                  data.size == "1024x1024"
                                    ? "aspect-1/1"
                                    : data.size == "1152x896"
                                    ? "aspect-9/7"
                                    : data.size == "1216x832"
                                    ? "aspect-19/13"
                                    : data.size == "1344x768"
                                    ? "aspect-7/4"
                                    : data.size == "896x1152"
                                    ? "aspect-7/9"
                                    : data.size == "832x1216"
                                    ? "aspect-13/19"
                                    : data.size == "768x1344"
                                    ? "aspect-4/7"
                                    : data.size == "640x1536"
                                    ? "aspect-5/12"
                                    : "aspect-1/1"
                                }`}
                                src={item.url}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 max-w-[800px] mx-auto my-auto gap-1 w-full">
                            <Image
                              alt="img"
                              width={800}
                              height={180}
                              className={`${
                                data.size == "1024x1024"
                                  ? "aspect-1/1"
                                  : data.size == "1152x896"
                                  ? "aspect-9/7"
                                  : data.size == "1216x832"
                                  ? "aspect-19/13"
                                  : data.size == "1344x768"
                                  ? "aspect-7/4"
                                  : data.size == "896x1152"
                                  ? "aspect-7/9"
                                  : data.size == "832x1216"
                                  ? "aspect-13/19"
                                  : data.size == "768x1344"
                                  ? "aspect-4/7"
                                  : data.size == "640x1536"
                                  ? "aspect-5/12"
                                  : "aspect-1/1"
                              }`}
                              src={data.content[number].url}
                            />
                          </div>
                        )}
                      </ModalBody>
                      <ModalFooter></ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </div>
          )}
          {loading == false && (
            <div className="flex flex-row gap-11 font-base font-helvetica font-medium leading-normal ml-3">
              <p
                className="text-[#FFF] cursor-pointer"
                onClick={() => {
                  setNumber(0);
                  setUpScale(true);
                }}
              >
                P1
              </p>
              <p
                className="text-[#FFF] cursor-pointer"
                onClick={() => {
                  setNumber(1);
                  setUpScale(true);
                }}
              >
                P2
              </p>
              <p
                className="text-[#FFF] cursor-pointer"
                onClick={() => {
                  setNumber(2);
                  setUpScale(true);
                }}
              >
                P3
              </p>
              <p
                className="text-[#FFF] cursor-pointer"
                onClick={() => {
                  setNumber(3);
                  setUpScale(true);
                }}
              >
                P4
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Img_History;