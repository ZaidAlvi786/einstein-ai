"use client"

import React, { useState } from "react";

function LikeButton() {
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <div>
      <Tooltip
        content={
          <p className="text-[#FFF]">
            {liked ? "Liked Response" : "Like Response"}
          </p>
        }
        showArrow
        placement="bottom"
        delay={0}
        closeDelay={0}
        classNames={{
          base: ["before:bg-[##2E353C]"],
          content: ["bg-[#2E353C] text-sm font-normal leading-4 px-3 py-2"],
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
        {liked ? (
          <Image
            alt="liked icon"
            width={16}
            height={21}
            src={"svg/Icon-heart-red.svg"}
            className="cursor-pointer"
            onClick={toggleLike}
          />
        ) : (
          <Image
            alt="like icon"
            width={16}
            height={21}
            src={"svg/Icon-heart.svg"}
            className="cursor-pointer"
            onClick={toggleLike}
          />
        )}
      </Tooltip>
    </div>
  );
}

export default LikeButton;
