import React, { useCallback, useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import InformationCircleIcon from "@/app/assets/svg/Information-circle-icon.svg";
import PinIcon from "@/app/assets/svg/pin.svg";
import TrashIcon from "@/app/assets/svg/trash-icon.svg";
import { useRouter, useSearchParams } from "next/navigation";
import ToolsDetailsModal from "@/components/toolsDetailsComponents/toolsDetailModal";

const TogleBoxRightClick = ({
  tool,
  visibleDropdownId,
  setVisibleDropdownId,
  openCancelSubsModal,
  isPinned,
  PinnedToTogleBar,
  UnPinnedToTogleBar
}: any) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showtoolDetailModal, setShowtoolDetailModal] = useState(false);
  const [tool_id, setToolId] = useState("");
  
  const closeDropdown = () => {
    setVisibleDropdownId(null);
  };
  const navigateToolDetailsPage = (model: any) => {
    setToolId(model.id);
    setShowtoolDetailModal(true);
  };
  const createMultipleQueryString = useCallback(
    (paramsToUpdate: any) => {
      const newParams = new URLSearchParams(searchParams);

      Object.keys(paramsToUpdate).forEach((param) => {
        newParams.set(param, paramsToUpdate[param]);
      });

      return newParams.toString();
    },
    [searchParams]
  );
  return (
    <> 
    <Dropdown
      classNames={{
        content:
          "py-[11px] px-[8px] rounded-[12px] bg-[#2F2F2F] min-w-[203px] min-h-[55px]",
      }}
      isOpen={visibleDropdownId === tool.id}
      onClose={closeDropdown}
    >
      <DropdownTrigger>
        <button className="block"></button>
      </DropdownTrigger>
      <DropdownMenu
        classNames={{
          list: "gap-[13px]",
        }}
        aria-label="Dynamic Actions"
      >
        {/* {!isToolFromStatic(tool) && ( */}
        <DropdownItem
          classNames={{
            base: "flex items-center gap-[8px] px-4 py-2 rounded-md cursor-pointer text-white", // Base styles for all items
            // hover: "bg-[#505050]", // Hover effect
            // focus: "outline-none bg-[#3D3D3D]", // Focus effect
          }}
          key="action1"
          onClick={() => navigateToolDetailsPage(tool)}
        >
          <div className="flex items-center gap-[8px]">
            <span className="w-[24px] h-[24px]">
              <InformationCircleIcon width={24} height={24} />
            </span>
            <span className="text-[#fff] text-[14px] font-normal">
              View Details
            </span>
          </div>
        </DropdownItem>
        {/* )} */}
        {isPinned ? (
          <DropdownItem
            key="action2"
            onClick={() => UnPinnedToTogleBar(tool.id)}
          >
            <div className="flex items-center gap-[8px]">
              <span className="w-[24px] h-[24px]">
                <PinIcon width={24} height={24} fill="#fff" />
              </span>
              <span className="text-[#fff] text-[14px] font-normal">
                Unpinned to Toglebar
              </span>
            </div>
          </DropdownItem>
        ) : (
          <DropdownItem key="action2" onClick={() => PinnedToTogleBar(tool.id)}>
            <div className="flex items-center gap-[8px]">
              <span className="w-[24px] h-[24px]">
                <PinIcon width={24} height={24} fill="#fff" />
              </span>
              <span className="text-[#fff] text-[14px] font-normal">
                Pin to Toglbar
              </span>
            </div>
          </DropdownItem>
        )}
        {tool?.subscription_id && (
          <DropdownItem
            key="action3"
            onClick={() => openCancelSubsModal(tool?.subscription_id)}
          >
            <div className="flex items-center gap-[8px]">
              <span className="w-[24px] h-[24px]">
                <TrashIcon width={24} height={24} />
              </span>
              <span className="text-[#E54637] text-[14px] font-normal">
                Remove Tool
              </span>
            </div>
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
    {showtoolDetailModal && 
                                  (
                                    <ToolsDetailsModal
                                      setShowtoolDetailModal={setShowtoolDetailModal}
                                      showtoolDetailModal={showtoolDetailModal}
                                      tool_id={tool_id}
                                    />
                                  )}</>
  );
};

export default TogleBoxRightClick;
