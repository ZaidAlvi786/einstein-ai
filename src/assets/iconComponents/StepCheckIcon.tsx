import * as React from 'react';
import type { SVGProps } from 'react';
const StepCheckIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="1" y="1" width="30" height="30" rx="15" fill="#3E4784" />
    <rect x="1" y="1" width="30" height="30" rx="15" stroke="#3E4784" strokeWidth="2" />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M22.7951 9.85346L13.2484 19.0668L10.7151 16.3601C10.2484 15.9201 9.51509 15.8935 8.98176 16.2668C8.46176 16.6535 8.31509 17.3335 8.63509 17.8801L11.6351 22.7601C11.9284 23.2135 12.4351 23.4935 13.0084 23.4935C13.5551 23.4935 14.0751 23.2135 14.3684 22.7601C14.8484 22.1335 24.0084 11.2135 24.0084 11.2135C25.2084 9.9868 23.7551 8.9068 22.7951 9.84013V9.85346Z"
      fill="white"
    />
  </svg>
);
export default StepCheckIcon;
