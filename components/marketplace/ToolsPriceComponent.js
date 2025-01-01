import React from 'react'

const ToolsPriceComponent = ({ price }) => {
    return (
        <div>
            <p className="text-[#FFF] text-center text-[14px] helvetica-font">
                {price > 0 ? `$${price}/m` : "Free"}
            </p>
        </div>
    );
}

export default ToolsPriceComponent