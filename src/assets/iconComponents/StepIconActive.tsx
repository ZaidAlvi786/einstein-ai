import * as React from 'react';
import type { SVGProps } from 'react';
const StepIconActive = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g filter="url(#filter0_d_6239_17487)">
      <g clip-path="url(#clip0_6239_17487)">
        <rect x="4" y="4" width="32" height="32" rx="16" fill="#F8F9FC" />
        <rect x="5" y="5" width="30" height="30" rx="15" fill="#3E4784" />
        <rect x="5" y="5" width="30" height="30" rx="15" stroke="#3E4784" strokeWidth="2" />
        <circle cx="20" cy="20" r="5" fill="white" />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_d_6239_17487"
        x="0"
        y="0"
        width="40"
        height="40"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feMorphology
          radius="2"
          operator="dilate"
          in="SourceAlpha"
          result="effect1_dropShadow_6239_17487"
        />
        <feOffset />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.619152 0 0 0 0 0.465529 0 0 0 0 0.930549 0 0 0 0.24 0"
        />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6239_17487" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_6239_17487"
          result="shape"
        />
      </filter>
      <clipPath id="clip0_6239_17487">
        <rect x="4" y="4" width="32" height="32" rx="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
export default StepIconActive;
