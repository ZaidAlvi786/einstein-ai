import React from "react";
import "./style.css";
import Image from "next/image";
import { Button, Tooltip } from "@nextui-org/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useAppSelector } from "@/app/lib/hooks";
import { animationViewType } from "../../chatConstants";

const AnimatedChatLoader = ({ setShowAnimatedChatLoader }: any) => {
  const activeChatModel = useAppSelector(
    (state: any) => state.chat.activeChatModel
  );
  const model:any = animationViewType.find((model: any) => {
    return model?.modelName === activeChatModel?.name;
  });

  function formatText(text: any) {
    const maxLength = 84;
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  }
  return (
    <div className="absolute top-5 z-[99999] " style={{ width: "inherit" }}>
      <div className="card example-2">
        <div className="inner">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-x-3 pl-1">
              <Image
                src={activeChatModel?.logo}
                width={30}
                height={30}
                className="rounded-md"
                alt=""
              />
              {model.text.length > 84 ? ( // show tooltip only when text length greater than 84
                <Tooltip
                  content={<p className="text-[#FFF]">{model?.text}</p>}
                  showArrow
                  placement="bottom"
                  delay={0}
                  closeDelay={0}
                  classNames={{
                    base: "before:bg-[#2E353C] mt-4",
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
                  <span className="text-base text-[#AAAAAA] font-helvetica cursor-pointer">
                    {model ? formatText(model.text) : ""}
                  </span>
                </Tooltip>
              ) : (
                <span className="text-base text-[#AAAAAA] font-helvetica cursor-pointer">
                  {model ? formatText(model.text) : ""}
                </span>
              )}
            </div>
            <div
              className="right-[8px] p-2 absolute rounded-full bg-[#121212] active:opacity-70 cursor-pointer  transition-all duration-300 "
              onClick={() => setShowAnimatedChatLoader(false)}
            >
              <XMarkIcon className="w-8 h-w-8 text-[#6B6B6B] font-thin" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedChatLoader;
