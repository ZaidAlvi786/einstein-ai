import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

function DualSelect({ setRatio }) {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [leftOptions] = useState([
    { label: "1:1", value: "512x512" },
    { label: "3:2", value: "512x341.33" },
    { label: "16:9", value: "512x288" },
    { label: "21:9", value: "512x219.43" },
    { label: "3:1", value: "512x170.67" },
    { label: "4:1", value: "512x128" },
  ]);
  const [rightOptions] = useState([
    { label: "1:1", value: "512x512" },
    { label: "2:3", value: "512x768" },
    { label: "9:16", value: "512x910.22" },
    { label: "9:21", value: "512x1194.67" },
    { label: "1:3", value: "512x3072" },
    { label: "1:4", value: "512x2048" },
  ]);
  // const [leftOptions] = useState([
  //   { label: "1:1", value: "1280x1280" },
  //   { label: "3:2", value: "1280x853.33" },
  //   { label: "16:9", value: "1280x720" },
  //   { label: "21:9", value: "1280x548.57" },
  //   { label: "3:1", value: "1280x426.67" },
  //   { label: "4:1", value: "1280x320" },
  // ]);
  // const [rightOptions] = useState([
  //   { label: "1:1", value: "1280x1280" },
  //   { label: "2:3", value: "1280x1920" },
  //   { label: "9:16", value: "1280x2275.56" },
  //   { label: "9:21", value: "1280x2986.67" },
  //   { label: "1:3", value: "1280x3840" },
  //   { label: "1:4", value: "1280x5120" },
  // ]);
  const dropdownRef = useRef(null);

  const aspectMenuSpan = {
    color: "#FFF",
    fontFamily: "Nasalization",
    fontSize: "14.197px",
    fontWeight: 400,
  };

  const aspectMenuBtn = {
    width: "60px",
    height: "23px",
    borderRadius: "10px",
    padding: "10px",
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setShowOptions(false);
    setRatio(option.value);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {showOptions && (
        <div className="absolute z-10 mt-2 mb-3 w-[150px] rounded-[10px] shadow-md bottom-full">
          <div className="flex justify-start gap-3">
            <ul className="w-[60px] py-2 bg-[#2E353C] rounded-[10px] font-nasalization text-[14.2px] text-[#fff] text-center">
              <Image
                alt="ratio-desktop icon"
                width={32}
                height={12}
                src={"/svg/ratio-desktop.svg"}
                className="cursor-pointer ml-[13px] mt-[12px] mb-[6px]"
              />
              {leftOptions.map((option, index) => (
                <li
                  className={`cursor-pointer px-4 py-1.5 text-left hover:bg-[#14171a8a] ${
                    option === selectedOption ? "active-aspect-ratio" : ""
                  }`}
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                >
                  {option.label}
                </li>
              ))}
            </ul>
            <ul className="w-[60px] bg-[#2E353C] rounded-[10px] font-nasalization text-[14.2px] text-[#fff]">
              <Image
                alt="ration-mobile icon"
                width={16}
                height={12}
                src={"/svg/ratio-mobile.svg"}
                className="cursor-pointer ml-[24px] mt-[10px] mb-[3px]"
              />

              {rightOptions.map((option, index) => (
                <li
                  className={`cursor-pointer px-4 py-1.5 hover:bg-[#14171a8a] ${
                    option === selectedOption ? "active-aspect-ratio" : ""
                  }`}
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <button
        onClick={toggleOptions}
        style={aspectMenuBtn}
        className="border border-[#2E353C] bg-[#2E353C inline-flex items-center justify-content-between font-nasalization text-[14.2px] text-[#fff] min-w-[60px]"
      >
        <span className="inline-block" style={aspectMenuSpan}>
          {selectedOption ? selectedOption.label : "1:1"}
        </span>
        <svg
          className="h-4 w-4 text-[#fff]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 12a1 1 0 0 1-.707-.293l-4-4a1 1 0 1 1 1.414-1.414L10 10.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4A1 1 0 0 1 10 12z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}

export default DualSelect;