import { Tooltip } from "@nextui-org/react";
import React from "react";

type TooltipIconProps = {
  title: string; // Tooltip text
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; // Icon component
  onClick?: () => void; // Optional click handler
};

const TooltipIcon: React.FC<TooltipIconProps> = ({ title, Icon, onClick }) => {
  return (
    <Tooltip
      content={<p className="text-[#FFF]">{title}</p>}
      showArrow
      placement="bottom"
      delay={0}
      closeDelay={0}
      classNames={{
        base: "before:bg-[#2E353C]",
        content: "bg-[#272727] text-sm font-normal leading-4 px-3 py-2",
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
        className="group cursor-pointer"
        onClick={onClick}
      >
        <Icon className="text-[#6F6F6F] group-hover:text-white" />
      </div>
    </Tooltip>
  );
};

export default TooltipIcon;
