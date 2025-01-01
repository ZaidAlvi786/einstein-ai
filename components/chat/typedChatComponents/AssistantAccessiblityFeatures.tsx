import React, { useState } from "react";
import CopyIcon from "@/app/assets/svg/Icon-copy.svg";
import RegenIcon from "@/app/assets/svg/regen.svg";
import VolumeIcon from "@/app/assets/svg/volumeIcon.svg";
import TooltipIcon from "./ToolTipIcon";

export const AssistantAccessiblityFeatures = ({
  Regenerate,
  message,
  currentMessageVersionIndex,
}: any) => {
  const [showCopiedToolTip, setShowCopiedToolTip] = useState(false);
  const HandleCopyTextOnClipboard = () => {
    navigator?.clipboard
      ?.writeText(message?.content[currentMessageVersionIndex]?.response)
      .then(() => {
        setShowCopiedToolTip(true);
        setTimeout(() => {
          setShowCopiedToolTip(false);
        }, 1000);
      })
      .catch((err) => {
        console.error("Copy failed: ", err);
      });
  };

  const HandleTextToSpeech = () => {
    const text = message?.content[currentMessageVersionIndex]?.response;
    if (text) {
      const utterance = new SpeechSynthesisUtterance(text); 
      utterance.lang = "en-US"; 
      speechSynthesis.speak(utterance); 
    } else {
      console.error("No text available to speak");
    }
  };

  return (
    <div className="flex gap-4 items-center">
      {/* <TooltipIcon
        title="Listen"
        Icon={VolumeIcon}
        onClick={() => HandleTextToSpeech()}
      /> */}

      <TooltipIcon
        key={showCopiedToolTip ? "copied" : "copy"} // Force re-mount when title changes
        title={showCopiedToolTip ? "Copied" : "Copy"}
        Icon={CopyIcon}
        onClick={HandleCopyTextOnClipboard}
      />

      <TooltipIcon title="Regenerate" Icon={RegenIcon} onClick={Regenerate} />
    </div>
  );
};
