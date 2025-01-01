"use client";
import React, { Suspense, useCallback } from "react";
import { useAuth } from "../authContext/auth";
import Link from "next/link";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import HistorySider from "@/components/layout/historysider";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { usePathname, useRouter } from "next/navigation";
import WhiteEarth from "@/app/assets/image/white_earth.png";
import Image from "next/image";
import AddToolsDropdown from "@/components/marketplace/Tools/AddToolsDropdown";
import { useAppSelector } from "../lib/hooks";
import LeftArrow from "@/app/assets/svg/left-arrow.svg";
import RightArrow from "@/app/assets/svg/right-arrow.svg";
const navLinks = [
  { href: "/marketplace", label: "Home" },
  { href: "/marketplace/models", label: "Models" },
  { href: "/marketplace/plugins", label: "Plugins" },
  // { href: "/marketplace/gpts", label: "Egos" },
  { href: "/marketplace/gpts", label: "GPT's" },
  // { href: "/marketplace/widgets", label: "Widgets" },
  // { href: "/marketplace/developer-community", label: "Developer Community" },
  // { href: "/marketplace/prompts", label: "Prompts" },
  // { href: "/marketplace/chats", label: "Chats" },
  // { href: "/marketplace/workspaces", label: "Workspaces" },
  // { href: "/profile/creators", label: "Creators" },
];

const Layout = ({ children }) => {
  const auth = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const sidebarSize = useAppSelector((state) => state.sidebarResize.width);

  // Find the index of the current active link
  const currentIndex = navLinks.findIndex((link) => link.href === pathname);

  // Handle Previous Button Click
  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      const prevLink = navLinks[currentIndex - 1];
      router.push(prevLink.href);
    }
  }, [currentIndex, router]);

  // Handle Next Button Click
  const handleNext = useCallback(() => {
    if (currentIndex < navLinks.length - 1) {
      const nextLink = navLinks[currentIndex + 1];
      router.push(nextLink.href);
    }
  }, [currentIndex, router]);

  const handleRedirection = (e, link) => {
    e.preventDefault();
    router.push(link);
  };

  return (
    <div className='h-screen flex flex-col bg-[#101010]'>
      <div className='flex flex-1 flex-row overflow-auto pb-2 max-msm:bg-[#cf5151]'>
        <HistorySider auth={auth} />
        <div
          className={`ml-auto`}
          style={{ width: `calc(100% - ${sidebarSize}px)` }}
        >
          <Navbar
            classNames={{
              item: "text-[#ABABAB] data-[active=true]:text-white hover:text-white",
              content: "data-[active=true]:text-white",
              base: "justify-start bg-transparent",
              wrapper: "!max-w-full gap-[40.44px]",
            }}
          >
            <NavbarBrand className='grow-0 min-w-[31.51px]'>
              <div className='flex gap-[19.51px] items-center cursor-pointer'>
                {/* Previous Button */}
                <button
                  onClick={handlePrev}
                  disabled={currentIndex <= 0}
                  className={` rounded-full ${
                    currentIndex <= 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-[#D2D2D2] hover:text-white"
                  }`}
                  aria-label='Previous'
                >
                  <LeftArrow className='h-[10.03px] w-[6px]' />
                </button>

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  disabled={currentIndex >= navLinks.length - 1}
                  className={` rounded-full ${
                    currentIndex >= navLinks.length - 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-[#D2D2D2] hover:text-white"
                  }`}
                  aria-label='Next'
                >
                  <RightArrow className='h-[11.03px] w-[6px]' />
                </button>
              </div>
              {/* <span className="ml-[26px] flex-shrink-0">
                <Link href={`/marketplace`}>
                  <Image src={WhiteEarth} className="w-[24px] h-[24px]" />
                </Link>
              </span> */}
            </NavbarBrand>
            <NavbarContent className={`hidden sm:flex gap-6`} justify='start'>
              {navLinks.map((link, index) => (
                <NavbarItem key={index} isActive={pathname === link.href}>
                  <p
                    onClick={(e) => handleRedirection(e, link.href)}
                    className={`${
                      pathname === link.href
                        ? "text-white font-semibold px-[5px] py-0 rounded-[5px] border-solid "
                        : "text-sm font-helvetica cursor-pointer"
                    }`}
                  >
                    {link.label}
                  </p>
                </NavbarItem>
              ))}
            </NavbarContent>
            <NavbarContent justify='end'>
              <NavbarItem>
                <Link
                  className='text-white helvetica-font font-bold text-[14px]'
                  href={"/profile/my-tools"}
                >
                  My Tools
                </Link>
              </NavbarItem>
              <NavbarItem>
                <AddToolsDropdown />
              </NavbarItem>
            </NavbarContent>
          </Navbar>
          <Suspense>{children}</Suspense>
        </div>
      </div>
    </div>
  );
};

export default Layout;
