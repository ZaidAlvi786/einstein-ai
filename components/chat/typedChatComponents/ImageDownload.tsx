import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import React from "react";

const ImageDownload = ({ imgUrl, fileName = "downloaded-image" }: any) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imgUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        onClick={handleDownload}
        className="bg-[#2a2929a1] mt-[10px] p-[3px] rounded-[5px]"
      >
        <ArrowDownTrayIcon className="text-white w-5 h-5" />
      </button>
    </div>
  );
};

export default ImageDownload;
