import * as React from 'react';
import type { SVGProps } from 'react';
const SkipInfoIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    width="56"
    height="56"
    viewBox="0 0 56 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="4" y="4" width="48" height="48" rx="24" fill="#FEF0C7" />
    <rect x="4" y="4" width="48" height="48" rx="24" stroke="#FFFAEB" strokeWidth="8" />
    <path
      d="M28 24V28M28 32H28.01M38 28C38 33.5228 33.5228 38 28 38C22.4772 38 18 33.5228 18 28C18 22.4772 22.4772 18 28 18C33.5228 18 38 22.4772 38 28Z"
      stroke="#DC6803"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default SkipInfoIcon;
