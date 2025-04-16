"use client";

import { useAppSelector } from "@/app/lib/hooks";
import { useRouter } from "next/navigation";
import { handleRedirection } from "@/app/utils/navigation";
import MarketIcon from "@/app/assets/svg/marketplace.svg";
import { Button, Image } from "@nextui-org/react";
import { PlusIcon } from "@heroicons/react/20/solid";

const SidebarMarketplaceLink = ({ getUserData }) => {
  const router = useRouter();
  const sidebarSize = useAppSelector((state) => state.sidebarResize.width);

  return (
    <div>
      {getUserData?.data?.plan === "free" && (
        <div
          className="group bg-[#171717] flex items-center fixed bottom-20 h-[60px] transition-colors duration-300 cursor-pointer justify-center "
          style={{ width: sidebarSize }}
        >
          <Button
            onClick={() => router.push("/profile/buy-subscription")}
            className="bg-[#0A84FF] text-white !px-5 !min-w-fit gap-x-[5px] !h-auto absolute !py-[13px] rounded-full flex  items-center justify-center overflow-hidden group transition-all duration-300"
            style={{ transformOrigin: "right center" }}
          >
            <Image
              src={"/svg/diamondIcon.svg"}
              alt="diamond-icon"
              width={20}
              height={20}
            />

            <span className=" text-[14px] font-[500] font-helvetica whitespace-nowrap text-[#E6E6E6]">
              Upgrade Plan
            </span>
          </Button>
        </div>
      )}
      <div
        className="group bg-[#171717] flex items-center fixed bottom-5 h-[60px] transition-colors duration-300 cursor-pointer justify-center "
        style={{ width: sidebarSize }}
        onClick={(e) => handleRedirection(router, e, "/marketplace")}
      >
        {/* <MarketIcon
        className="text-[#565656] transition-colors duration-300 group-hover:text-[#FFFFFF]"
        style={{ fontSize: "24px" }}
        aria-label="Marketplace Icon"
      />
      <span className="ml-2 text-[#565656] font-medium text-[14px] transition-colors duration-300 group-hover:text-[#FFFFFF]">
        Explore AI Tools
      </span> */}
        <Button
          onClick={() => router.push("/marketplace")}
          className="bg-[#272727] text-white  !px-5 gap-x-[5px] !min-w-fit !h-auto absolute !py-[13px] rounded-full flex  items-center justify-center overflow-hidden group transition-all duration-300"
          style={{ transformOrigin: "right center" }}
        >
          <PlusIcon className="text-[#CDCDCD] w-[20px] h-[20px] font-normal font-helvetica" />

          <span className=" text-[14px] font-[500] font-helvetica whitespace-nowrap text-[#CDCDCD]">
            Add AI Tools
          </span>
        </Button>
      </div>
    </div>
  );
};

export default SidebarMarketplaceLink;