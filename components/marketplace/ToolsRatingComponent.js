"use client";
import Image from 'next/image';
import React from 'react';

const ToolsRatingComponents = ({ total_rating, text_color="#FFF" }) => {

    return (
        <div>
            <p className={`text-[${text_color}] flex  gap-1 text-[14px] helvetica-font`}>
                {total_rating ?? 0}
                <span className='mt-[3px]'>
                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d='../../public/svg/rating.svg' />
                    </svg> */}
                    <Image src={"/svg/rating.svg"} alt="profile-pic" width={14} height={14} />
                </span>
            </p>
        </div>
    );
}

export default ToolsRatingComponents