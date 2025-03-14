import { SVGProps } from 'react';

const DotsHorizontal = (props: SVGProps<SVGSVGElement>) => {
  const { stroke = '#667085', strokeWidth = '1.66667' } = props;

  return (
    <svg
      width="16"
      height="4"
      viewBox="0 0 16 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.99992 2.83335C8.46016 2.83335 8.83325 2.46026 8.83325 2.00002C8.83325 1.53978 8.46016 1.16669 7.99992 1.16669C7.53968 1.16669 7.16659 1.53978 7.16659 2.00002C7.16659 2.46026 7.53968 2.83335 7.99992 2.83335Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.8333 2.83335C14.2935 2.83335 14.6666 2.46026 14.6666 2.00002C14.6666 1.53978 14.2935 1.16669 13.8333 1.16669C13.373 1.16669 12.9999 1.53978 12.9999 2.00002C12.9999 2.46026 13.373 2.83335 13.8333 2.83335Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.16659 2.83335C2.62682 2.83335 2.99992 2.46026 2.99992 2.00002C2.99992 1.53978 2.62682 1.16669 2.16659 1.16669C1.70635 1.16669 1.33325 1.53978 1.33325 2.00002C1.33325 2.46026 1.70635 2.83335 2.16659 2.83335Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DotsHorizontal;
