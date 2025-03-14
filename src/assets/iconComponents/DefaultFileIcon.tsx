import { SVGProps } from 'react';

const DefaultFileIcon = (props: SVGProps<SVGSVGElement>) => {
  const { stroke = '#D0D5DD', strokeWidth = '1.5' } = props;

  return (
    <svg
      width="32"
      height="40"
      viewBox="0 0 32 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0.75 4C0.75 2.20508 2.20508 0.75 4 0.75H20C20.1212 0.75 20.2375 0.798159 20.3232 0.883885L31.1161 11.6768C31.2018 11.7625 31.25 11.8788 31.25 12V36C31.25 37.7949 29.7949 39.25 28 39.25H4C2.20507 39.25 0.75 37.7949 0.75 36V4Z"
        fill="white"
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export default DefaultFileIcon;
