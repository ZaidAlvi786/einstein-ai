import React, { useState, useRef, useEffect } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import {
  Image,
  Modal,
  ModalContent,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";
import { useAppSelector } from "@/app/lib/hooks";
import { useLazyGetHistoryByIdQuery } from "@/app/lib/features/chat/chatApi";
import ReactMarkDown from "@/components/Markdown";

const ChatExportModal = ({ isOpen, setIsOpen, chatId }: any) => {
  const [format, setFormat] = useState("pdf");
  const chatRef: any = useRef(null);
  const { id: chat_id } = useAppSelector((state: any) => state.chat.activeChat);
  const [chatData, setChatData] = useState([]);
  const [getHistoryByIdAPI, { isFetching: isHistoryApiLoading }] =
    useLazyGetHistoryByIdQuery();

  useEffect(() => {
    if (!chatId) return;
    getChatHistory();
  }, [chatId]);
  const getChatHistory = () => {
    getHistoryByIdAPI(chatId)
      .unwrap()
      .then((response: any) => {
        const messages = response.data.history;
        setChatData(messages);
      })
      .catch((error: any) => {
        console.error("Error fetching chat history:", error);
      });
  };
  const handleExportPdf = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 210;
    const pageHeight = 297;
    const marginLeft = 10;
    const marginRight = 10;
    const paddingTop = 20;
    const paddingBottom = 20;
    const contentWidth = pageWidth - marginLeft - marginRight;
    const contentHeight = pageHeight - paddingTop - paddingBottom;

    // Function to replace images/audio with S3 URL text
    const replaceMediaWithText = async () => {
      const images = chatRef.current.querySelectorAll("img");
      const audios = chatRef.current.querySelectorAll("audio");

      for (let img of images) {
        if (img.src.includes("s3.amazonaws.com")) {
          const imgPlaceholder = document.createElement("p");
          imgPlaceholder.innerText = `[Image: ${img.src}]`;
          img.replaceWith(imgPlaceholder);
        }
      }

      for (let audio of audios) {
        if (audio.currentSrc.includes("s3.amazonaws.com")) {
          const audioPlaceholder = document.createElement("p");
          audioPlaceholder.innerText = `[Audio File: ${audio.currentSrc}]`;
          audio.replaceWith(audioPlaceholder);
        }
      }
    };

    await replaceMediaWithText(); // Replace media elements before capturing

    const canvas = await html2canvas(chatRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let yOffset = 0;
    let pageIndex = 0;

    while (yOffset < canvas.height) {
      const pageCanvas = document.createElement("canvas");
      const pageCtx: any = pageCanvas.getContext("2d");
      pageCanvas.width = canvas.width;
      pageCanvas.height = (contentHeight * canvas.width) / contentWidth;
      pageCtx.drawImage(
        canvas,
        0,
        yOffset,
        canvas.width,
        pageCanvas.height,
        0,
        0,
        pageCanvas.width,
        pageCanvas.height
      );
      const pageImgData = pageCanvas.toDataURL("image/png");

      if (pageIndex > 0) pdf.addPage();
      pdf.addImage(pageImgData, "PNG", marginLeft, paddingBottom, imgWidth, 0);

      yOffset += pageCanvas.height;
      pageIndex++;
    }

    pdf.save("chat_export.pdf");
  };

  const handleExportWord = async () => {
    if (!chatRef.current) return;

    const chatDiv = chatRef.current;
    const images = chatDiv.getElementsByTagName("img");
    const buttons = chatDiv.getElementsByTagName("button"); // Select all buttons

    // Hide all buttons before exporting
    Array.from(buttons).forEach((btn: any) => btn.remove());

    // Convert all images to Base64
    const imagePromises = Array.from(images).map(async (img: any) => {
      try {
        const response = await fetch(img.src);
        const blob = await response.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            img.src = reader.result as string; // Convert img src to Base64
            resolve(null);
          };
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error("Error loading image:", error);
      }
    });

    // Wait for all images to be converted
    await Promise.all(imagePromises);

    // Construct the HTML content with images embedded
    const content = `<!DOCTYPE html>
      <html>
        <head><meta charset="UTF-8"></head>
        <body>${chatDiv.innerHTML}</body>
      </html>`;

    const blob = new Blob([content], {
      type: "application/msword",
    });

    saveAs(blob, "chat_export.doc");

    // Do NOT show buttons again after export (keeping them hidden)
  };

  const handleExport = async () => {
    if (chatRef.current) {
      if (format === "pdf") {
        handleExportPdf();
      } else if (format === "word") {
        // const blob = new Blob([chatRef.current.innerHTML], {
        //   type: "application/msword",
        // });
        handleExportWord();
        // saveAs(blob, "chat_export.doc");
      } else if (format === "html") {
        const chatDiv = chatRef.current;
        const Box = chatDiv.getElementsByClassName("calloutDiv");
        console.log("Box: ", Box);
        if (Box) {
          Box[0].style.maxWidth = "100%";
          Box[0].style.width = "100%";
        }

        const buttons = chatDiv.getElementsByTagName("button");
        Array.from(buttons).forEach((btn: any) => btn.remove());
        const blob = new Blob([chatRef.current.innerHTML], {
          type: "text/html",
        });
        saveAs(blob, "chat_export.html");
      }
    }
  };

  return (
    <Modal
      key="export-chat-modal"
      size="4xl"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      classNames={{
        base: "text-white bg-[#171717] z-[9999] p-6 pb-6",
        closeButton: "hover:bg-[#232323] active:bg-[#232323]",
      }}
      scrollBehavior="outside"
      isDismissable={false}
    >
      <ModalContent>
        <header className="flex justify-between items-center pb-4 pt-4 border-b-2 border-[#bcbcbc5e]">
          <h1 className="text-2xl font-bold">Export Chat</h1>
        </header>
        <div className="p-4">
          <label className="block mb-2 font-bold font-helvetica">
            Select Export Format:
          </label>
          <div className="flex gap-3 items-center">
            <Select
              selectedKeys={[format]} // Use selectedKeys instead of value
              onSelectionChange={(keys) => {
                const selectedValue = Array.from(keys)[0] as string; // Extract the selected value
                setFormat(selectedValue);
              }}
              className="p-2 rounded w-[200px] text-white"
            >
              <SelectItem key="pdf" className="text-white">
                PDF
              </SelectItem>
              <SelectItem key="word" className="text-white">
                Word
              </SelectItem>
              <SelectItem key="html" className="text-white">
                HTML
              </SelectItem>
            </Select>

            <button
              onClick={handleExport}
              className="border-1 p-1.5 h-fit rounded-xl text-white hover:bg-gray-600"
            >
              Download
            </button>
          </div>
        </div>
        <div
          ref={chatRef}
          className="chat-preview p-4 bg-white text-black rounded-md"
        >
          <div className="flex gap-1.5 items-center">
            <div className="flex justify-center items-center px-2 rounded-md py-1">
              <Image
                draggable={false}
                src="togl.png"
                width={100}
                height={format === "pdf" ? 50 : 30}
                alt="logo"
              />
            </div>
            {/* <p className="font-nasalization font-normal text-xl">Togl</p> */}
          </div>
          <hr className="mt-4" />
          {!isHistoryApiLoading ? (
            chatData.map((message: any, index: any) => (
              // <div key={index} className={`p-3 rounded-md `}>
              //   <strong>{message[0].user?.full_name || "User"}:</strong>{" "}
              //   {message[0].content}
              //   <div className="assistant-response mt-2">
              //     {message[1]?.content?.map((resp: any, idx: any) => (
              //       <p key={idx} className="text-sm text-black">
              //         {resp.response}
              //       </p>
              //     ))}
              //   </div>
              // </div>
              <div key={index} className="p-3 rounded-md">
                <strong>{message[0].user?.full_name || "User"}:</strong>{" "}
                <span
                  dangerouslySetInnerHTML={{ __html: message[0].content }}
                  className="text-[17px] text-black font-helvetica font-bold break-words leading-7 user-prompt-47 export-chat-model-text"
                >
                  {/* {message[0].content} */}
                </span>
                {message[0]?.file_url && message[0]?.file_url?.length > 0 && (
                  <div className="w-full flex flex-col gap-2 mt-2">
                    {message[0]?.file_url.map((file: string, index: number) =>
                      format === "pdf" ? (
                        <a
                          key={index}
                          href={file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          📎 {file}
                        </a>
                      ) : (
                        <Image
                          key={index}
                          src={file}
                          width={100}
                          height={100}
                          alt="attachment"
                        />
                      )
                    )}
                  </div>
                )}
                <div className="assistant-response mt-2">
                  {message[1]?.content?.map((resp: any, idx: any) => (
                    <ReactMarkDown
                      key={idx}
                      data={resp.response}
                      highlightedText={""}
                      highlightedTextColor="yellow"
                      handleTextSelection={() => {}}
                      openExportModel={true}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-[300px]">
              <Spinner className="mt-2 " size="md" color="default" />
            </div>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
};

export default ChatExportModal;
