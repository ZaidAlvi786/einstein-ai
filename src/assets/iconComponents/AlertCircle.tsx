import * as React from 'react';
import type { SVGProps } from 'react';
const SvgAlertCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <g clipPath="url(#alert-circle_svg__a)">
      <path
        stroke={props.stroke ? props.stroke : '#F04438'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.333}
        d="M8 5.333V8m0 2.667h.007M14.667 8A6.667 6.667 0 1 1 1.333 8a6.667 6.667 0 0 1 13.334 0"
      />
    </g>
    <defs>
      <clipPath id="alert-circle_svg__a">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgAlertCircle;
