"use client";
import React, { useCallback } from "react";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation"; // Import useRouter

const RightClickSearchPlugin = ({
  menuOpen,
  setMenuOpen,
  position,
  selectSearchTool,
  setSearchText,
  OnRightclickPinned,
  activeModalHandler,
}) => {
  const router = useRouter(); // Use useRouter to access the router object
  const searchParams = useSearchParams();

  const handleClose = () => {
    setMenuOpen(false);
  };

  const createMultipleQueryString = useCallback(
    (paramsToUpdate) => {
      const newParams = new URLSearchParams(searchParams);

      Object.keys(paramsToUpdate).forEach((param) => {
        newParams.set(param, paramsToUpdate[param]);
      });

      return newParams.toString();
    },
    [searchParams]
  );

  const navigateToolDetailsPage = (e, tool_id) => {
    e.stopPropagation();
    if (!tool_id) return; // Ensure tool_id exists before navigating
    router.push(
      "/marketplace/tools-details" +
        "?" +
        createMultipleQueryString({ tool_id })
    );
  };

  return (
    <div
      className="absolute"
      style={{
        // top: `${position.y}px`,
        // left: `${position.x}px`,
        // display: menuOpen ? "block" : "none", // Show or hide based on menuOpen
        // zIndex: 1000, // Ensure it's on top
        top: `${40}px`,
        left: `${55}px`,
        display: menuOpen ? "block" : "none", // Show or hide based on menuOpen
        zIndex: 1000, // Ensure it's on top
      }}
    >
      {/* {menuOpen && ( */}
      <Menu open={menuOpen} onClose={() => {}}>
        <MenuHandler>
          <div></div>
        </MenuHandler>

        <MenuList
          className={`bg-[#2F2F2F] border-0 text-white shadow-md p-1.5 !z-[9999] rounded-xl absolute`}
        >
          <MenuItem
            onClick={() => {
              setSearchText(""), activeModalHandler(selectSearchTool);
            }}
            className="flex pt-2 gap-2 hover:bg-[#505050] cursor-pointer items-center"
          >
            <div className="w-6">
              <Image
                src={"svg/folder.svg"}
                width={20}
                height={20}
                alt="Open Tool"
              />
            </div>
            <div className="font-helvetica">{"Open Tool"}</div>
          </MenuItem>
          <MenuItem
            onClick={(e) => {
              e.preventDefault();
              navigateToolDetailsPage(e, selectSearchTool?.id);
            }}
            className="flex pt-2 gap-2 hover:bg-[#505050] cursor-pointer items-center z-50"
          >
            <div className="w-6">
              <Image
                src={"svg/info.svg"}
                width={25}
                height={25}
                alt="View Details"
              />
            </div>
            <div className="font-helvetica">{"View Details"}</div>
          </MenuItem>
          <MenuItem
            onClick={() => setSearchText("")}
            className="flex pt-2 gap-2 hover:bg-[#505050] cursor-pointer items-center"
          >
            <div className="w-6">
              <Image
                src={"svg/circle-add.svg"}
                width={20}
                height={20}
                alt="Add to Toglbox"
              />
            </div>
            <div className="font-helvetica">{"Add to Toglbox"}</div>
          </MenuItem>
          <MenuItem
            onClick={() => OnRightclickPinned(selectSearchTool)}
            className="flex pt-2 gap-2 hover:bg-[#505050] cursor-pointer items-center"
          >
            <div className="w-6">
              <Image
                src={"svg/pin-icon.svg"}
                width={20}
                height={20}
                alt="Pin to Toglbar"
              />
            </div>
            <div className="font-helvetica">{"Pin to Toglbar"}</div>
          </MenuItem>
        </MenuList>
      </Menu>
      {/* )} */}
    </div>
  );
};

export default RightClickSearchPlugin;
