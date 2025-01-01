import type { SVGProps } from 'react';

const SvgArrowDown = (props: SVGProps<SVGSVGElement>) => {
  const { stroke = '#4E5BA6', strokeWidth = '1.66667' } = props;

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SvgArrowDown;
