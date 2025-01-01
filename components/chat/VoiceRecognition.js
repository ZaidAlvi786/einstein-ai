import { useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import VoiceIcon from "@/app/assets/svg/voiceIcon.svg";
import { useAppSelector } from "@/app/lib/hooks";
import toast from "react-hot-toast";

export const VoiceRecognition = ({ setValue, disabled, stopListening }) => {
    const activeChat = useAppSelector((state) => state.chat.activeChat);
  const isViewPermission =
    activeChat?.role === "view" || activeChat?.permission_type === "view";
  const startListening = () =>{
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    setValue('')
  }
 
  const {
    transcript,
    browserSupportsSpeechRecognition,
    listening,
    resetTranscript,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  useEffect(() => {
    if (!transcript) return;
    setValue(transcript);
  }, [transcript]);

  const handleVoiceIconClick = () => {
    if(isViewPermission) {
      return toast.error("You have only permission to view")
    }
    if (listening) {
      stopListening();
      resetTranscript();
    } else {
      startListening();
    }
  };

  return (
    <>
      <button
        disabled={disabled}
        className={`flex flex-col justify-center items-center cursor-pointer w-9 h-9 rounded-full ${
          listening ? "bg-[#41A9FF]" : ""
        }`}
        onClick={handleVoiceIconClick}
      >
        <VoiceIcon
          className={
            listening ? "[&>path]:fill-[#ffffff]" : "[&>path]:fill-[#6B6B6B]"
          }
        />
      </button>
    </>
  );
};
