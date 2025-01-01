import type { SVGProps } from 'react';

const DotsVertical = (props: SVGProps<SVGSVGElement>) => {
  const { stroke = '#667085', strokeWidth = '1.66667' } = props;

  return (
    <svg
      width="4"
      height="16"
      viewBox="0 0 4 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1.99984 8.83325C2.46007 8.83325 2.83317 8.46016 2.83317 7.99992C2.83317 7.53968 2.46007 7.16659 1.99984 7.16659C1.5396 7.16659 1.1665 7.53968 1.1665 7.99992C1.1665 8.46016 1.5396 8.83325 1.99984 8.83325Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.99984 2.99992C2.46007 2.99992 2.83317 2.62682 2.83317 2.16659C2.83317 1.70635 2.46007 1.33325 1.99984 1.33325C1.5396 1.33325 1.1665 1.70635 1.1665 2.16659C1.1665 2.62682 1.5396 2.99992 1.99984 2.99992Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.99984 14.6666C2.46007 14.6666 2.83317 14.2935 2.83317 13.8333C2.83317 13.373 2.46007 12.9999 1.99984 12.9999C1.5396 12.9999 1.1665 13.373 1.1665 13.8333C1.1665 14.2935 1.5396 14.6666 1.99984 14.6666Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DotsVertical;
