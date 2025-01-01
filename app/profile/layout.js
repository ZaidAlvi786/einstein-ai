"use client";
import React, { Suspense } from "react";
import { useAuth } from "../authContext/auth";
import Link from "next/link";
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import HistorySider from "@/components/layout/historysider";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { usePathname, useRouter } from "next/navigation";
import AddIcon from "@/app/assets/svg/add.svg";
import { useAppSelector } from "../lib/hooks";
import AddToolsDropdown from "@/components/marketplace/Tools/AddToolsDropdown";

const Layout = ({ children }) => {
  const auth = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const sidebarSize = useAppSelector((state) => state.sidebarResize.width);

  const navLinks = [
    { href: "/profile", label: "Profile" },
    { href: "/profile/my-tools", label: "My Tools" },
    { href: "/profile/billing", label: "Billing" },
    { href: "/profile/workspaces", label: "Workspaces" },
    // {
    //   href: "/profile/creators",
    //   label: pathname === "/profile/my-tools" ? "" : "Creator Dashboard",
    // },
    // { href: '/profile/notifications', label: 'Notifications' },
    // { href: '/profile/following', label: 'Following' }
  ];

  const navigateToHomePage = () => {
    router.push("/");
  };
  const handleRedirection = (e, link) => {
    e.preventDefault();
    router.push(link);
  };
  return (
    <div className='h-screen flex flex-col'>
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
              wrapper: "!max-w-full",
            }}
          >
            <NavbarBrand className='grow-0'>
              <div
                className='flex gap-1 items-center cursor-pointer'
                onClick={navigateToHomePage}
              >
                <ChevronLeftIcon className='w-5 h-5 text-[#D2D2D2]' />
                <p className='text-white font-normal text-[13px] font-inter'>
                  Back to chat
                </p>
              </div>
            </NavbarBrand>
            <NavbarContent
              className={`hidden sm:flex gap-4 pl-5`}
              justify='start'
            >
              {navLinks.map((link, index) => (
                <NavbarItem key={index} isActive={pathname === link.href}>
                  <p
                    onClick={(e) => handleRedirection(e, link.href)}
                    className='text-sm font-helvetica cursor-pointer'
                  >
                    {link.label}
                  </p>
                </NavbarItem>
              ))}
            </NavbarContent>

            {/* <NavbarContent justify="end">
                                <NavbarItem>
                                    <Link className="text-white helvetica-font font-bold text-[14px]" href="#">Creator dashboard</Link>
                                </NavbarItem>
                                <NavbarItem>
                                    <Button
                                        className="text-white helvetica-font font-bold rounded-full border-[1px] bg-transparent text-[14px] flex items-center justify-center w-[94px] h-[34px] gap-[5px] px-[4px]"
                                        startContent={<AddIcon className="" />}
                                    >
                                        Create
                                    </Button>
                                </NavbarItem>
                            </NavbarContent> */}
            {/* {pathname === "/profile/my-tools" && ( */}
            <NavbarContent justify='end'>
              <NavbarItem>
                <Link
                  className='text-white helvetica-font font-bold text-[14px]'
                  href='/profile/creators'
                >
                  Creator Dashboard
                </Link>
              </NavbarItem>
              <NavbarItem>
                {/* <Button
                    className="text-white helvetica-font font-bold rounded-full border-[1px] bg-transparent text-[14px] flex items-center justify-center w-[94px] h-[34px] gap-[5px] px-[4px]"
                    startContent={<AddIcon className="" />}
                  >
                    Create
                  </Button> */}
                <AddToolsDropdown />
              </NavbarItem>
            </NavbarContent>
            {/* )} */}
          </Navbar>

          <Suspense>{children}</Suspense>
        </div>
      </div>
    </div>
  );
};

export default Layout;
