import React, { useEffect, useState } from "react";
import Responseicon from "@/app/assets/svg/response-icon.svg";
import { ResponseIconButtonProps } from "@/types/ChatTypes";
import { Image } from "@nextui-org/react";
import { ToolsLogoInfo } from "@/types/ToolTypes";
import {
  toolsStaticIdMapping,
  toolLogoLocalStorageKey,
} from "@/components/constants/ToolContants";

export const ResponseIconButton: React.FC<ResponseIconButtonProps> = ({
  message,
  currentIndex,
}) => {
  const [toolUrls, setToolUrls] = useState<ToolsLogoInfo>();

  useEffect(() => {
    const storedList = localStorage.getItem(toolLogoLocalStorageKey);
    if (storedList) {
      const parsedData = JSON.parse(storedList) as ToolsLogoInfo;
      setToolUrls(parsedData);
    }
  }, []);

  const getLogoUrlFromMessage = () => {
    if (!toolUrls) {
      return null;
    }
    const toolId =
      message.content[currentIndex].tool_id ||
      toolsStaticIdMapping[message.content[currentIndex].name];

      return toolUrls[toolId as string]?.logo;
  };

  const logoUrl = getLogoUrlFromMessage();

  return (
    <button
      className="group inline-flex items-center justify-center w-max"
      type="button"
    >
      <Image
        alt="modal-img"
        width={27}
        height={27}
        data-nimg={1}
        className="cursor-pointer mb-[2px]"
        src={logoUrl || ""} 
        style={{ color: "transparent", width:"27px", height:"27px", objectFit:'cover' }}
      />
      <div className="w-[29px] h-[29px] flex items-center rounded-full bg-black absolute opacity-0 group-hover:opacity-70 justify-center">
        <Responseicon />
      </div>
    </button>
  );
};
