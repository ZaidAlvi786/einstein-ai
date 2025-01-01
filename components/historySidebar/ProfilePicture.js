import React from "react";
import Link from "next/link";
import { useAuth } from "@/app/authContext/auth";
import { useAppSelector } from "@/app/lib/hooks";
import { Avatar } from "@nextui-org/react";

const ProfilePicture = ({ imageSrc, fullName }) => {
  const auth = useAuth();
  const activeWorkspace = useAppSelector((state) => state.workspace.activeWorkspace);

  return (
    <Link href={auth && auth?.user && auth?.user?.email ? "/profile" : "/signin"}>
      <Avatar
        src={activeWorkspace?.logo_url}
        showFallback={true}
        className="w-6 h-6"
        fallback={
          <div className="w-6 h-6 p-1">
            <img
              src={"/svg/user.svg"}
              alt="profile-pic"
              style={{ height: "100%", width: "100%" }}
            />
          </div>
        }
      />
    </Link>
  );
};

export default ProfilePicture;
