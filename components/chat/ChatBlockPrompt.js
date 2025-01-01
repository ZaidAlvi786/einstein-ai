import React, { useState } from 'react'
import { ComputerDesktopIcon, PlusIcon } from "@heroicons/react/24/outline";

export const ChatBlockPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false)
  return (
    <div>
    {showPrompt && (
      <div
        className="flex flex-col mr-2 fixed transition-all duration-300 ease-in-out right-0 justify-center items-center gap-y-2"
        style={{
          bottom: "3rem",
          transform: showPrompt
            ? "translateY(-50px)"
            : "translateY(0px)",
        }}
      >
        <button
          className="transition-all duration-300 ease-in-out transform "
       
        >
          <PlusIcon className="w-7 h-7 text-[#ABABAB] ms-4 cursor-pointer hover:text-white" />
        </button>
        <button
          className="transition-all duration-300 ease-in-out transform "
        >
          <ComputerDesktopIcon className="w-5 h-5 text-[#ABABAB] ms-4 cursor-pointer hover:text-white" />
        </button>
      </div>
    )}
  
  </div>
  )
}
