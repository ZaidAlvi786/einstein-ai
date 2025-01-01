import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import TextSelectorok from "../text_history/Reply";

function CopyLink() {
  const [isHidden, setIsHidden] = useState(true);
  const ref = useRef(null);
  const [activeTab, setActiveTab] = useState("tab1");

  useEffect(() => {
    // Function to handle clicks outside the div
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsHidden(true);
      }
    }

    // Add event listener when component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Content for each tab
  const tabContents = {
    tab1: (
      <div>
        Climate change represents a monumental challenge, threatening to disrupt
        ecosystems, economies, and livelihoods worldwide through extreme weather
        events and rising sea levels.
      </div>
    ),
    tab2: (
      <div>
        Climate change represents a monumental challenge, threatening to disrupt
        ecosystems,sing sea levels.
      </div>
    ),
    tab3: (
      <div>
        Climate change represents a monumental challenge, threatening to disrupt
        ecosystems, economies.
      </div>
    ),
    tab4: (
      <div>
        Climate change represents a monumental challenge, threatening to disrupt
        ecosystems, economies, and livelihoods worldwide through extreme weather
        events and rising sea levels.
      </div>
    ),
    tab5: (
      <div>
        Climate change represents a monumental challenge, threatening to disrupt
        ecosystems, economies, and livelihoods worldwide through extreme weather
        events and rising sea levels.
      </div>
    ),
  };

  return (
    <div
      className="flex rounded-3xl p-3 shadow-[0_0px_1px_0px_rgba(0,0,0,0.25)]"
      ref={ref}
    >
      <Image
        className="cursor-pointer"
        alt="copy icon"
        width={18}
        height={18}
        src={"svg/link-icon.svg"}
        onClick={() => setIsHidden(!isHidden)}
      />

      {/* Div to show/hide */}
      <div
        className={`mt-[53px] bg-[#1B1E24] p-0 min-w-[472px] max-w-[472px] rounded-[24px] absolute right-[60px] shadow-[0_0px_1px_0px_rgba(0,0,0,0.25)] backdrop-blur-md ${isHidden ? "hidden" : ""
          }`}
      >
        <header className="border-[#565656] border-b-1 px-[25px] py-[21px]">
          <h5 className="text-[#fff] text-[18px] font-normal leading-normal font-nasalization">
            Share Link
          </h5>
        </header>

        <div className="p-[25px] pt-[17px] pb-[16px]">
          <p className="pb-[25px] text-[#8E8E8E] text-[16px] font-normal font-helvetica">
            Messages you send after creating your link won’t be shared. Anyone
            with the URL will be able to view the shared Link.
          </p>
          <div className="border-[#5C5C5C] border  rounded-[16px] overflow-hidden mb-[16px]">
            <div className="inside_tabs p-[22px]">
              {/* <div className='border border-[#085fb7] rounded-[12px] px-[20px] py-[22px] relative'>
                                <Image className='absolute right-[10px] top-[10px]' alt="" width={12} height={112} src={"svg/close.svg"} />
                                <span className='text-[#8E8E8E] text-[12px] font-normal font-helvetica'>Replying to: </span>
                                <p className='text-[#fff] text-[14px] font-normal font-helvetica mt-[8px] border-l-1 border-[@fff] pl-[12px] py-[2px]'>a monumental challenge, threatening to disrupt ecosystems, economies, and livelihoods worldwide through extreme weather events</p>
                            </div> */}

              {/* Tabs */}
              <div className="flex">
                <button
                  className={`${activeTab === "tab1" ? "bg-[#2E353C] text-white" : "bg-none"
                    } py-[4px] px-[10px] h-[25px] mr-[10px] rounded-[16px] text-[#C2C2C2] text-[11.36px] font-normal leading-normal font-nasalization`}
                  onClick={() => setActiveTab("tab1")}
                >
                  GPT-4
                </button>
                <button
                  className={`${activeTab === "tab2" ? "bg-[#2E353C] text-white" : "bg-none"
                    } py-[4px] px-[10px] h-[25px] mr-[10px] rounded-[16px] text-[#C2C2C2] text-[11.36px] font-normal leading-normal font-nasalization`}
                  onClick={() => setActiveTab("tab2")}
                >
                  Gemini
                </button>
                <button
                  className={`${activeTab === "tab3" ? "bg-[#2E353C] text-white" : "bg-none"
                    } py-[4px] px-[10px] h-[25px] mr-[10px] rounded-[16px] text-[#C2C2C2] text-[11.36px] font-normal leading-normal font-nasalization`}
                  onClick={() => setActiveTab("tab3")}
                >
                  Mistral
                </button>
                <button
                  className={`${activeTab === "tab4" ? "bg-[#2E353C] text-white" : "bg-none"
                    } py-[4px] px-[10px] h-[25px] mr-[10px] rounded-[16px] text-[#C2C2C2] text-[11.36px] font-normal leading-normal font-nasalization`}
                  onClick={() => setActiveTab("tab4")}
                >
                  Perplexity
                </button>
                <button
                  className={`${activeTab === "tab4" ? "bg-[#2E353C] text-white" : "bg-none"
                    } py-[4px] px-[10px] h-[25px] mr-[10px] rounded-[16px] text-[#C2C2C2] text-[11.36px] font-normal leading-normal font-nasalization`}
                  onClick={() => setActiveTab("tab5")}
                >
                  Claude
                </button>
              </div>

              {/* Tab Content */}
              <div className="text-[14.4px] text-[#fff] font-normal font-helvetica pt-[17px] mb-[36px]">
                {tabContents[activeTab]}
              </div>
            </div>
            <div className="text-[#fff] text-[16px] bg-[#3A3A3A] border-[#5C5C5C] border-t-1 p[15px] pl-[21px] pr-[21px] pb-[10px] pt-[10px]">
              <p className="mb-[4px] font-helvetica font-normal flex">
                Biggest challenge facing humanity in the ne...
                <Image
                  className="flex justify-end"
                  alt="pencil icon"
                  width={16}
                  height={16}
                  src={"svg/Icon-pencil.svg"}
                />
              </p>
              <date className="text-[#8E8E8E] text-[16px] font-normal font-helvetica">
                February 2, 2024
              </date>
            </div>
          </div>
          <div className=" flex justify-end">
            <button className="text-[#fff] text-[16px] font-helvetica font-normal bg-[#0A84FF] rounded-[16px] px-11 py-2">
              Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CopyLink;