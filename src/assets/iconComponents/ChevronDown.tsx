import type { SVGProps } from 'react';

const SvgChevronDown = (props: SVGProps<SVGSVGElement>) => {
  const { stroke = '#344054', strokeWidth = '1.6667' } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      fill="none"
      viewBox="0 0 20 20"
      {...props}
    >
      <path
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="m5 7.5 5 5 5-5"
      />
    </svg>
  );
};

export default SvgChevronDown;
