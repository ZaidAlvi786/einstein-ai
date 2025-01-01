import type { SVGProps } from 'react';

const SvgUsers04 = (props: SVGProps<SVGSVGElement>) => {
  const { stroke = 'black', strokeWidth = '2' } = props;

  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 34 39"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M33 37.5C33 34.7089 33 33.3133 32.6555 32.1777C31.8799 29.6209 29.8791 27.6201 27.3223 26.8445C26.1867 26.5 24.7911 26.5 22 26.5H12C9.20888 26.5 7.81331 26.5 6.67772 26.8445C4.12091 27.6201 2.12008 29.6209 1.34448 32.1777C1 33.3133 1 34.7089 1 37.5M26 10.5C26 15.4706 21.9706 19.5 17 19.5C12.0294 19.5 8 15.4706 8 10.5C8 5.52944 12.0294 1.5 17 1.5C21.9706 1.5 26 5.52944 26 10.5Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SvgUsers04;
