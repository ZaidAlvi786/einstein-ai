import type { SVGProps } from 'react';

const BarChart05 = (props: SVGProps<SVGSVGElement>) => {
  const { stroke = '#667085', strokeWidth = '1.66667' } = props;

  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1.5 13.1667V16.5M11.5 5.66667V16.5M6.5 9.83333V16.5M16.5 1.5V16.5"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default BarChart05;
