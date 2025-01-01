import * as React from 'react';
import type { SVGProps } from 'react';
const SvgLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 38 38"
    {...props}
  >
    <g filter="url(#logo_svg__a)">
      <g clipPath="url(#logo_svg__b)">
        <rect width={32} height={32} x={3} y={2} fill="#fff" rx={8} />
        <rect width={32} height={32} x={3} y={2} fill="url(#logo_svg__c)" rx={8} />
        <path
          fill="#D0D5DD"
          fillRule="evenodd"
          d="M19 4.039c-7.71 0-13.961 6.25-13.961 13.961 0 7.71 6.25 13.961 13.961 13.961 7.71 0 13.961-6.25 13.961-13.961 0-7.71-6.25-13.961-13.961-13.961M4.961 18c0-7.753 6.286-14.039 14.039-14.039S33.039 10.247 33.039 18 26.753 32.039 19 32.039 4.961 25.753 4.961 18"
          clipRule="evenodd"
        />
        <path
          fill="#D0D5DD"
          fillRule="evenodd"
          d="M19 14.078a3.922 3.922 0 1 0 0 7.845 3.922 3.922 0 0 0 0-7.845M15 18a4 4 0 1 1 8 0 4 4 0 0 1-8 0"
          clipRule="evenodd"
        />
        <path
          fill="#D0D5DD"
          fillRule="evenodd"
          d="M19 15.32a2.68 2.68 0 1 0 0 5.36 2.68 2.68 0 0 0 0-5.36M16.243 18a2.757 2.757 0 1 1 5.514 0 2.757 2.757 0 0 1-5.514 0"
          clipRule="evenodd"
        />
        <path fill="#D0D5DD" d="M18.961 2h.078v32h-.078z" />
        <path fill="#D0D5DD" d="M35 17.96v.079H3v-.078z" />
        <path
          fill="#D0D5DD"
          d="M29.602 2h.078v32h-.078zM13.64 2h.078v32h-.077zM24.282 2h.077v32h-.078zM8.32 2h.078v32H8.32z"
        />
        <path
          fill="#D0D5DD"
          d="M35 28.602v.077H3v-.077zM35 12.64v.078H3v-.077zM35 23.281v.078H3v-.078zM35 7.32v.078H3V7.32z"
        />
        <g filter="url(#logo_svg__d)">
          <circle cx={19} cy={18} r={8} fill="url(#logo_svg__e)" />
        </g>
        <g filter="url(#logo_svg__f)">
          <path
            fill="#fff"
            fillOpacity={0.2}
            d="M3 18h32v3.2c0 4.48 0 6.72-.872 8.432a8 8 0 0 1-3.496 3.496C28.92 34 26.68 34 22.2 34h-6.4c-4.48 0-6.72 0-8.432-.872a8 8 0 0 1-3.496-3.496C3 27.92 3 25.68 3 21.2z"
          />
        </g>
      </g>
      <rect
        width={31.8}
        height={31.8}
        x={3.1}
        y={2.1}
        stroke="#D0D5DD"
        strokeWidth={0.2}
        rx={7.9}
      />
    </g>
    <defs>
      <filter
        id="logo_svg__a"
        width={38}
        height={38}
        x={0}
        y={0}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={1} />
        <feGaussianBlur stdDeviation={1} />
        <feColorMatrix values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.06 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_196_6808" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={1} />
        <feGaussianBlur stdDeviation={1.5} />
        <feColorMatrix values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.1 0" />
        <feBlend in2="effect1_dropShadow_196_6808" result="effect2_dropShadow_196_6808" />
        <feBlend in="SourceGraphic" in2="effect2_dropShadow_196_6808" result="shape" />
      </filter>
      <filter
        id="logo_svg__d"
        width={22}
        height={22}
        x={8}
        y={8}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={1} />
        <feGaussianBlur stdDeviation={1} />
        <feColorMatrix values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.06 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_196_6808" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={1} />
        <feGaussianBlur stdDeviation={1.5} />
        <feColorMatrix values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.1 0" />
        <feBlend in2="effect1_dropShadow_196_6808" result="effect2_dropShadow_196_6808" />
        <feBlend in="SourceGraphic" in2="effect2_dropShadow_196_6808" result="shape" />
      </filter>
      <filter
        id="logo_svg__f"
        width={42}
        height={26}
        x={-2}
        y={13}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feGaussianBlur in="BackgroundImageFix" stdDeviation={2.5} />
        <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_196_6808" />
        <feBlend in="SourceGraphic" in2="effect1_backgroundBlur_196_6808" result="shape" />
      </filter>
      <linearGradient
        id="logo_svg__c"
        x1={19}
        x2={19}
        y1={2}
        y2={34}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#fff" />
        <stop offset={1} stopColor="#D0D5DD" />
      </linearGradient>
      <linearGradient
        id="logo_svg__e"
        x1={15}
        x2={23}
        y1={26}
        y2={10}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#53389E" />
        <stop offset={1} stopColor="#6941C6" />
      </linearGradient>
      <clipPath id="logo_svg__b">
        <rect width={32} height={32} x={3} y={2} fill="#fff" rx={8} />
      </clipPath>
    </defs>
  </svg>
);
export default SvgLogo;
