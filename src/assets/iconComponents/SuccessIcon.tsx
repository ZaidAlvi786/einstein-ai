import * as React from 'react';
import type { SVGProps } from 'react';
const SuccessIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    width="38"
    height="38"
    viewBox="0 0 38 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g opacity="0.3">
      <rect x="6" y="6" width="26" height="26" rx="13" stroke="#079455" strokeWidth="2" />
    </g>
    <g opacity="0.1">
      <rect x="1" y="1" width="36" height="36" rx="18" stroke="#079455" strokeWidth="2" />
    </g>
    <g clip-path="url(#clip0_6993_8341)">
      <path
        d="M15.2501 19.0001L17.7501 21.5001L22.7501 16.5001M27.3334 19.0001C27.3334 23.6025 23.6025 27.3334 19.0001 27.3334C14.3977 27.3334 10.6667 23.6025 10.6667 19.0001C10.6667 14.3977 14.3977 10.6667 19.0001 10.6667C23.6025 10.6667 27.3334 14.3977 27.3334 19.0001Z"
        stroke="#079455"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_6993_8341">
        <rect width="20" height="20" fill="white" transform="translate(9 9)" />
      </clipPath>
    </defs>
  </svg>
);
export default SuccessIcon;
