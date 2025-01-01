import * as React from 'react';
import type { SVGProps } from 'react';
const SvgCheckIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="10"
    height="8"
    viewBox="0 0 10 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M1.25 4L3.75 6.5L8.75 1.5"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default SvgCheckIcon;
