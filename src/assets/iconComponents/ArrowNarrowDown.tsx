import * as React from 'react';
import type { SVGProps } from 'react';
const SvgArrowNarrowDown = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m0 0 6-6m-6 6-6-6"
    />
  </svg>
);
export default SvgArrowNarrowDown;
