import type { SVGProps } from 'react';
const SvgEdit01 = (props: SVGProps<SVGSVGElement>) => {
  const { stroke = 'currentColor', strokeWidth = '2' } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16.11}
      height={16.11}
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M2.876 18.116c.046-.414.069-.62.132-.814a2 2 0 0 1 .233-.485c.111-.17.259-.317.553-.61L17 3a2.828 2.828 0 1 1 4 4L7.794 20.206c-.294.294-.442.442-.611.553a2 2 0 0 1-.485.233c-.193.063-.4.086-.814.132L2.5 21.5z"
      />
    </svg>
  );
};
export default SvgEdit01;
