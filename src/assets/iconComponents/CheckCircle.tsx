import type { SVGProps } from 'react';

const SvgCheckCircle = (props: SVGProps<SVGSVGElement>) => {
  const { stroke = '#344054', strokeWidth = '2' } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      {...props}
    >
      <path
        d="M8.74999 14L12.25 17.5L19.25 10.5M25.6667 14C25.6667 20.4434 20.4433 25.6667 14 25.6667C7.55667 25.6667 2.33333 20.4434 2.33333 14C2.33333 7.55672 7.55667 2.33337 14 2.33337C20.4433 2.33337 25.6667 7.55672 25.6667 14Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default SvgCheckCircle;
