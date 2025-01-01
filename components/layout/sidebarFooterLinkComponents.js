"use client"

import { useAuth } from "@/app/authContext/auth";
import {
  Badge,
  Button,
} from "@nextui-org/react";
import Link from "next/link";
import { useAppSelector } from "@/app/lib/hooks";
import { User } from "@nextui-org/react";
import { useGetUserQuery } from "@/app/lib/features/chat/chatApi";
import { useRouter } from "next/navigation";
import Image from "next/image";

const SidebarFooterLinkComponents = ({ overflowing }) => {
  const auth = useAuth();
  const router = useRouter();
  const sidebarSize = useAppSelector((state) => state.sidebarResize.width);
  const { data: getUserData, isLoading: getUserLoading } = useGetUserQuery(
    { email: auth?.user?.email },
    { skip: !(auth?.user?.email && auth?.user?.fullname) }
  );
  const connected = useAppSelector((state) => state.webSocket.connected);

  const handleRedirection = (e, link) => {
    e.preventDefault();
    router.push(link);
  };
  return (
    <>
      <div
        className={`flex items-center fixed bottom-2 mt-3 border-[#3e3e3e] bg-[#171717] pt-2 px-[12px] min-w-[183px] max-w-[500px] w-full stroke-[0.942px] stroke-[#565656] ${
          overflowing == true ? "border-t-[1px]" : "border-t-none"
        }`}
        style={{ width: sidebarSize }}
      >
        {auth && auth?.user?.fullname && auth?.user?.email ? (
    
          <div className="flex w-full relative">
            <div className="flex items-center justify-between w-full">
              <Button
                as={Link}
                href="/profile"
                className="bg-transparent pl-0 py-0 pr-2 m-0 min-w-[auto] relative"
              >
                <Badge
                  content=""
                  color={`${connected ? 'success' : 'danger'}`}
                  shape="circle"
                  size="sm"
                  className="absolute bottom-0 left-[12px]"
                >
                  <User
                    className="cursor-pointer"
                    description={
                      <p className="text-[#565656] font-medium text-[14px]">
                        {getUserData?.data?.full_name}
                      </p>
                    }
                    avatarProps={{
                      src: getUserData?.data?.profile_picture_url,
                      style: { height: 24, width: 24 },
                    }}
                  />
                </Badge>
              </Button>
            </div>
            <div className="flex justify-end items-center  gap-2">
              <a
                href="https://x.com/togl_ai"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/svg/xIcon.svg"
                  alt="Close Icon"
                  height={16.017}
                  width={16.017}
                  className="h-[16.017px] w-[16.017px] 4k:h-[36.18px] 4k:w-[36.18px] 2k:h-[18.18px] 2k:w-[18.18px]"
                />
              </a>
              <a
                href="https://discord.gg/gEfT7Rh4fR"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/svg/discordIcon.svg"
                  alt="Discord Icon"
                  height={16.017}
                  width={16.017}
                  className="h-[16.017px] w-[16.017px] 4k:h-[36.18px] 4k:w-[36.18px] 2k:h-[18.18px] 2k:w-[18.18px]"
                />
              </a>
            </div>
          </div>
        ) : (
          <div className="text-white font-helvetica w-full">
            <p className="font-bold text-[12.39px] mb-1.5 tracking-wider">{`Sign up or log in`}</p>
            <h6 className="text-[12.393px] font-normal">
              {`Get smarter responses, more plugins,`}
              <br /> {`advance features and more.`}
            </h6>
            <Button
              onClick={(e) => handleRedirection(e, "/register")}
              className="w-full flex text-sm  text-[#131313] bg-[#F8F8F8] my-3 font-bold font-helvetica"
            >{`Sign up`}</Button>
            <Button
              onClick={(e) => handleRedirection(e, "/signin")}
              className="w-full flex text-sm  text-[#E9E9E9] bg-[#3A3A3A] font-bold font-helvetica"
            >{`Log in`}</Button>
          </div>
        )}
      </div>
    </>
  );
};

export default SidebarFooterLinkComponents;
