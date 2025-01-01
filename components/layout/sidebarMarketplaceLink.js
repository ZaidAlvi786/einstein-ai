"use client"

import { useAppSelector } from "@/app/lib/hooks";
import { useRouter } from "next/navigation";
import { handleRedirection } from "@/app/utils/navigation";
import MarketIcon from "@/app/assets/svg/marketplace.svg";

const SidebarMarketplaceLink = ({ overflowing }) => {
  const router = useRouter();
  const sidebarSize = useAppSelector((state) => state.sidebarResize.width);

  return (
    <div
      className="group flex items-center fixed bottom-14 h-[56px] bg-[#171717] border-t border-[#3e3e3e] hover:bg-[#393939] transition-colors duration-300 cursor-pointer px-4"
      style={{ width: sidebarSize }}
      onClick={(e) => handleRedirection(router, e, "/marketplace")}
    >
      <MarketIcon
        className="text-[#565656] transition-colors duration-300 group-hover:text-[#FFFFFF]"
        style={{ fontSize: "24px" }}
        aria-label="Marketplace Icon"
      />
      <span className="ml-2 text-[#565656] font-medium text-[14px] transition-colors duration-300 group-hover:text-[#FFFFFF]">
        Explore AI Tools
      </span>
    </div>
  );
};

export default SidebarMarketplaceLink;
