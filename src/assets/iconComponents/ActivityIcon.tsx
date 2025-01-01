import * as React from 'react';
import type { SVGProps } from 'react';
const ActivityIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      d="M22 12H18L15 21L9 3L6 12H2"
      stroke="#344054"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default ActivityIcon;
