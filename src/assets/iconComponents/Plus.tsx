import type { SVGProps } from 'react';

const SvgPlus = (props: SVGProps<SVGSVGElement>) => {
  const { stroke = 'currentColor', strokeWidth = '2' } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M12 5v14m-7-7h14"
      />
    </svg>
  );
};

export default SvgPlus;
