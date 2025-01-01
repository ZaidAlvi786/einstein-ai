import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-row justify-center mb-2">
      <div className="w-[100px] bg-[#23272B] rounded-[20px] mt-4">
        <div className="snippet" data-title="dot-pulse">
          <div className="stage">
            <div className="dot-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
