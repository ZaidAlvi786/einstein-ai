import { SVGProps } from 'react';

const XCircle = (props: SVGProps<SVGSVGElement>) => {
  const { stroke = 'white', strokeWidth = '1.66667' } = props;

  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M16.5002 9.50001L9.50016 16.5M9.50016 9.50001L16.5002 16.5M24.6668 13C24.6668 19.4433 19.4435 24.6667 13.0002 24.6667C6.55684 24.6667 1.3335 19.4433 1.3335 13C1.3335 6.55669 6.55684 1.33334 13.0002 1.33334C19.4435 1.33334 24.6668 6.55669 24.6668 13Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default XCircle;
