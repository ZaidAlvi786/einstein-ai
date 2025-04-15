import { Button, Image } from "@nextui-org/react";
import React from "react";
import XIcon from "@/app/assets/svg/xIcon.svg";
import Discord from "@/app/assets/svg/discord.svg";
import Linkedin from "@/app/assets/svg/linkedin.svg";
import ReactPlayer from 'react-player/lazy'

const MobileLandingPage = () => {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-between p-6 pt-3">
      <div className="flex flex-col items-center gap-[20px]">
      <div className="flex justify-between items-center w-full">
        <div className="flex gap-1.5 items-center">
          <Image
            src="togl.svg"
            className="opacity-100"
            width={25.9}
            height={16.8}
            alt="logo"
          />
          <p className="font-nasalization font-normal text-xl">Togl</p>
        </div>
        <Button
          onClick={() => {
            window.open("https://calendly.com/bmb-111/meeting", "_blank");
          }}
          className="bg-transparent border border-[#09090B] text-[#A1A1AA] px-6 py-3 rounded-full font-semibold"
        >
          Book a demo
        </Button>
      </div>
      <div className="text-center">
        <h1 className="text-sm  text-[#A7D3FF] font-helvetica font-light">
          Only available on desktop
        </h1>
        <h2 className="text-3xl font-bold mt-2 text-gredient-mlp px-2">The Best of AI in <br/> One Place</h2>
      </div>

      <div className="w-full flex justify-center mt-6 max-w-[550px]">
      {/* <iframe
                width="100%"
                height="500px"
                src="https://www.youtube.com/embed/Vpx3P21EKlo?si=3lwhrsUi_pzC_y-N" // Embed URL for YouTube video
                title="Togl Tutorial"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen // Enables fullscreen mode
                style={{ borderRadius: "16px" }} // Add styling if needed
              ></iframe> */}
               <ReactPlayer
              url={"https://www.youtube.com/embed/Vpx3P21EKlo?si=3lwhrsUi_pzC_y-N"}
              playing
              className="event-vid-player"
              width="100%"
              height="260px"
              loop
              controls
            />
      </div>

      <div className="text-start mt-6 font-helvetica px-6">
        <p className="text-sm">
          Make one account and access 1000’s of the best AI products.
        </p>
        <p className="text-sm mt-2">Manage subscriptions in one dashboard.</p>
        <p className="text-sm mt-2">
          Always the newest and best AI. <span>(It’s a free market)</span>
        </p>
      </div>

      <div className="mt-6">
        <Button
          onClick={() => {
            window.open("https://calendly.com/bmb-111/meeting", "_blank");
          }}
          className="bg-[#0A84FF]  text-white px-6 py-3 rounded-full font-semibold font-helvetica"
        >
          Book a demo
        </Button>
      </div>
      </div>
      <div className="flex justify-center mt-6 space-x-5 items-center">
        <XIcon onClick={() => window.open("https://x.com/togl_ai", "_blank")} />
        <Discord
          onClick={() =>
            window.open("https://discord.com/invite/gEfT7Rh4fR", "_blank")
          }
        />
        <Linkedin
          onClick={() =>
            window.open("https://www.linkedin.com/company/toglai/", "_blank")
          }
        />
      </div>
    </div>
  );
};

export default MobileLandingPage;
