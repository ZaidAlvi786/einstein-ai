import React, { useState, useRef, useEffect } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { Avatar, Button, Image } from "@nextui-org/react";
import {
  useCreateEmptyChatMutation,
  useGenerateDataTokenForToolsMutation,
  useGetToolDetailsGuestQuery,
} from "@/app/lib/features/chat/chatApi";
import { useAuth } from "@/app/authContext/auth";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/app/lib/hooks";


const DraggableIframe = ({ onClose, iFrameModel }) => {
  console.log("iFrameModel: ", iFrameModel);
  const auth = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 150, y: 40 });
  // const [size, setSize] = useState({ width: 600, height: 600 });
  const [size, setSize] = useState({ width: "85vw", height: "90vh" });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [showInfoPopup, setshowInfoPopup] = useState(false);
  const [GenerateDataTokenForTools] = useGenerateDataTokenForToolsMutation();
  const resizableRef = useRef(null);
  const searchParams = useSearchParams();
  const chat_id = searchParams.get("chat");
  const group_id = searchParams.get("group");
  const workspace_id = localStorage.getItem("workspace_id");
    const [CreateEmptyChat] = useCreateEmptyChatMutation();
    const workspace_id_local = localStorage.getItem("workspace_id");
     const activeGroup = useAppSelector(
        (state) => state.group.currentActiveGroup
      );

  const {
    data: getToolDetailsGuestData,
    isLoading: getToolDetailsGuestLoading,
    refetch,
  } = useGetToolDetailsGuestQuery(
    {
      IsLoggedIn: auth?.user?.email && auth?.user?.fullname,
      tool_id: iFrameModel?.id,
    },
    { skip: !iFrameModel?.id }
  );
  console.log("getToolDetailsGuestData: ", getToolDetailsGuestData);
  const [webhookToken, setWebhookToken] = useState(null);
  const [chatId, setChatId] = useState(null)


  useEffect(() => {
    generateTokenForCustomTools();
  }, [iFrameModel, chatId]);

  useEffect(() => {
    if(chat_id === 'new'){
      handleCreateEmptyChat()
    }else{
      setChatId(chat_id)
    }

  },[chat_id])

  const handleCreateEmptyChat = () => {    
    try {
      const data = {
        workspace_id: workspace_id_local,
        group_id: activeGroup?._id ?? "",
        chat_title: "",
      };
      CreateEmptyChat(data).then((res) => {
        setChatId(res.data.chat_id)
      });
    } catch (error) {
      console.log("error:", error);
    }
  };

  const generateTokenForCustomTools = () => {
    if(!chatId) return;

    const data = {
      tool_id: iFrameModel?.id ?? "",
      chat_id:chatId,
      workspace_id,
      group_id,
      send_to_chat: true,
    };
    GenerateDataTokenForTools(data)
      .unwrap()
      .then((response) => {
        setWebhookToken(response?.data);
        const newIframeUrl =
          iFrameModel.url +
          "?token=" +
          response?.data +
          "&tool_id=" +
          iFrameModel.id;
        localStorage.setItem("iFrameUrl", newIframeUrl);
        setTimeout(() => {
          toast.success("token", response?.data);
        }, 2000);
      })
      .catch((error) => {
        toast.error(error?.data?.message);
      });
  };

  // Handle mouse down for starting drag
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  // Handle dragging
  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  // Stop dragging on mouse up
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Bind mousemove and mouseup to the window
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    // Cleanup listeners when unmounting or dragging stops
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, offset]);

  const handleReduceSize = () => {
    if (size.width === "85vw") {
      setSize({ width: "600px", height: "600px" });
    } else {
      setSize({ width: "85vw", height: "90vh" });
    }
  };

  return (
    <div
      ref={resizableRef}
      className="draggable-window"
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        width: `${size.width}`,
        height: `${size.height}`,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#181818",
        zIndex: 50000,
        borderRadius: "10px",
      }}
    >
      <div
        className="window-bar"
        style={{
          padding: "10px",
          backgroundColor: "#272727",
          cursor: "move",
          display: "flex",
          justifyContent: "space-between",
          borderRadius: "10px 10px 0 0",
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="text-white flex items-center gap-2">
          <div>
            <Avatar
              // src={"/svg/user.svg"}
              src={iFrameModel.logo}
              showFallback={true}
              alt="similar-tools-logo"
              className="w-9 h-9 cursor-pointer"
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
          <div
            className="text-[20px]"
            style={{ lineHeight: "32px", fontWeight: "400" }}
          >
            {iFrameModel.modelName}
          </div>
        </div>
        <span
          className="window-close flex gap-3 items-center relative"
          style={{ color: "white" }}
        >
          <Image
            src={"/svg/Information-circle-white.svg"}
            alt="profile-pic"
            width={25}
            height={25}
            onMouseEnter={() => setshowInfoPopup(true)}
            style={{ cursor: "pointer" }}
          />

          <Image
            src={"/svg/MinusCircle.svg"}
            alt="profile-pic"
            width={24}
            height={24}
            onClick={onClose}
            style={{ cursor: "pointer" }}
          />
          <Image
            src={"/svg/minimize.svg"}
            alt="profile-pic"
            width={24}
            height={24}
            onClick={() => handleReduceSize()}
            style={{ cursor: "pointer" }}
          />

          {/* information popup */}
          {showInfoPopup && (
            <div
              className="bg-[#2F2F2F] absolute left-[-335px] w-[342px] h-[226px] top-[35px] rounded-md p-5 cursor-auto"
              onMouseLeave={() => setshowInfoPopup(false)}
            >
              <div className="flex justify-between">
                <div>{getToolDetailsGuestData.tool.name}</div>
                <Image
                  src={"/svg/Arrow-Right-Up.svg"}
                  alt="profile-pic"
                  width={24}
                  height={24}
                />
              </div>
              <div
                className="mt-4"
                style={{
                  lineHeight: "16.7px",
                  fontWeight: "400",
                  fontSize: 14,
                  color: "#BABABA",
                }}
              >
                {getToolDetailsGuestData.tool.introtext}
              </div>

              <div className="flex justify-between items-center mt-2">
                <div className="flex gap-1 items-center">
                  <Image
                    src="/svg/chatOpenAi.svg"
                    style={{ width: "21px", height: "16px" }}
                  />
                  <div
                    style={{
                      lineHeight: "19.6px",
                      fontWeight: "400",
                      fontSize: 14,
                      color: "#B9B9B9",
                      textTransform: "capitalize",
                    }}
                  >
                    {getToolDetailsGuestData?.tool?.chat_model}
                  </div>
                </div>
                <div
                  style={{
                    lineHeight: "19.6px",
                    fontWeight: "400",
                    fontSize: 14,
                    marginBottom: "7px",
                  }}
                >
                  .
                </div>
                <div
                  style={{
                    lineHeight: "19.6px",
                    fontWeight: "400",
                    fontSize: 14,
                    color: "#B9B9B9",
                    textTransform: "capitalize",
                  }}
                >
                  {getToolDetailsGuestData?.tool?.category}
                </div>

                <div
                  style={{
                    lineHeight: "19.6px",
                    fontWeight: "400",
                    fontSize: 14,
                    marginBottom: "7px",
                  }}
                >
                  .
                </div>
                {getToolDetailsGuestData?.tool?.total_ratings > 0 ? (
                  <div className="flex gap-1 items-center">
                    <div
                      style={{
                        lineHeight: "19.6px",
                        fontWeight: "400",
                        fontSize: 14,
                        color: "#B9B9B9",
                      }}
                    >
                      {getToolDetailsGuestData?.tool?.total_ratings}
                    </div>
                    <Image
                      src={"/svg/StarIcon.svg"}
                      alt="profile-pic"
                      width={12}
                      height={13}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      lineHeight: "19.6px",
                      fontWeight: "400",
                      fontSize: 14,
                      color: "#B9B9B9",
                    }}
                  >
                    No Ratings
                  </div>
                )}

                <div
                  style={{
                    lineHeight: "19.6px",
                    fontWeight: "400",
                    fontSize: 14,
                    marginBottom: "7px",
                  }}
                >
                  .
                </div>
                <div className="flex gap-2 items-center">
                  <div
                    style={{
                      lineHeight: "19.6px",
                      fontWeight: "400",
                      fontSize: 14,
                      color: "#B9B9B9",
                      marginRight: "-5px",
                    }}
                  >
                    {getToolDetailsGuestData?.tool?.total_views}
                  </div>
                  <Image
                    src={"/svg/Person.svg"}
                    alt="profile-pic"
                    width={12}
                    height={13}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center mt-6 text-[10px]">
                <Button
                  className="w-[99px] h-[26.32px] rounded bg-transparent  border border-white text-[10.12px]"
                  style={{ fontWeight: "700" }}
                >
                  $
                  {Number(
                    getToolDetailsGuestData?.tool?.price?.per_use
                  ).toFixed(2)}{" "}
                  Per Use
                </Button>
                or
                <Button
                  className="bg-[#0A84FF] w-[99px] h-[26.32px] rounded text-[10.12px]"
                  style={{ fontWeight: "700" }}
                >
                  Subscribe
                </Button>
              </div>
              <div className="text-center mt-3 text-[#BABABA] text-sm">
                7 free uses left
              </div>
            </div>
          )}
        </span>
      </div>
      <div
        className="window-body"
        style={{
          padding: "20px",
          height: "calc(100% - 60px)",
          background: "#181818",
        }}
      >
        {console.log(
          'iFrameModel.url+"?token="+webhookToken: ',
          iFrameModel.url +
            "?token=" +
            webhookToken +
            "&tool_id=" +
            iFrameModel.id
        )}
        <iframe
          src={
            iFrameModel.url +
            "?token=" +
            webhookToken +
            "&tool_id=" +
            iFrameModel.id
          }
          width="100%"
          height="100%"
          title="Iframe Content"
          id="myIframe"
        />
      </div>
    </div>
  );
};

export default DraggableIframe;
