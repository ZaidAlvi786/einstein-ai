import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@nextui-org/react";

const ComingSoonFeature = ({navigateToMessageModel}) => {
  const descStyles = {
    margin: "0 auto",
    width: "800px",
    color: "#D0D0D0",
    textAlign: "center",
    fontFamily: "Helvetica",
    fontSize: "18px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "160%",
    letterSpacing: "0.18px"
  }

  const btnStyle = {
    borderRadius: "16px",
    width: "120px",
    height: "34px"

  }
  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <div className="flex flex-1 flex-col max-w-[930px] max-mxl:max-w-[700px] max-msm:max-w-[360px] w-full pt-[56px] mx-auto">
        <div className="flex flex-col bg-[#23272B] rounded-2xl">
          <div className="flex flex-row gap-3 items-center">
            <Image
              alt="logo"
              width={34}
              height={34}
              src={"/logo.png"}
              className="ml-7 mt-7"
            />
            <p className="text-[#FFF] text-base font-normal leading-normal font-nasalization mt-7">
              Einstein Models
            </p>
          </div>
          <div className="mt-9">
            <p className="text-[#D0D0D0] font-helvetica font-normal leading-7 tracking-[0.18px] text-[18px] text-center">
                    We thank you for your interest. These models are currently
                    in beta testing. To gain early access, please <br />{" "}
                    <a href="#" className="text-[#0A84FF]">
                      join our waitlist
                    </a>
                    . Meanwhile, feel free to use our text or image model
                    generation services
              </p>
          </div>

          <div className="flex gap-6 justify-center	mt-11 mb-8">
            <div>
              <Button style={btnStyle} onClick={()=>navigateToMessageModel('text')} color="primary" className="bg-[#0a84ff]">
                  Text 
              </Button>
            </div>

            <div>
              <Button style={btnStyle} color="primary" onClick={()=>navigateToMessageModel('image')} className="bg-[#0a84ff]">
                  Image
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonFeature;