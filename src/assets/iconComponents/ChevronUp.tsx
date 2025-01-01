import { SVGProps } from 'react';

const ChevronUp = (props: SVGProps<SVGSVGElement>) => {
  const { stroke = '#363F72', strokeWidth = '1.66667' } = props;

  return (
    <svg
      width="12"
      height="8"
      viewBox="0 0 12 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11 6.5L6 1.5L1 6.5"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ChevronUp;
