import type { SVGProps } from 'react';

const SvgArrowBlockRight = (props: SVGProps<SVGSVGElement>) => {
  const { stroke = '#98A2B3', strokeWidth = '1.66667' } = props;

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
        d="M17.5 10L11.6667 4.16669V7.50002H3.16667C2.93331 7.50002 2.81663 7.50002 2.7275 7.54543C2.6491 7.58538 2.58536 7.64912 2.54541 7.72752C2.5 7.81665 2.5 7.93333 2.5 8.16669V11.8334C2.5 12.0667 2.5 12.1834 2.54541 12.2725C2.58536 12.3509 2.6491 12.4147 2.7275 12.4546C2.81663 12.5 2.93331 12.5 3.16667 12.5H11.6667V15.8334L17.5 10Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SvgArrowBlockRight;
