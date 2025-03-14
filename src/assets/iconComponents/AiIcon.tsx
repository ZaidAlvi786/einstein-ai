import { SVGProps } from 'react';

const AiIcon = (props: SVGProps<SVGSVGElement>) => {
  const { stroke = '#D0D5DD', strokeWidth = '1.5' } = props;

  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.75 4C7.75 2.20508 9.20508 0.75 11 0.75H27C27.1212 0.75 27.2375 0.798159 27.3232 0.883885L38.1161 11.6768C38.2018 11.7625 38.25 11.8788 38.25 12V36C38.25 37.7949 36.7949 39.25 35 39.25H11C9.20507 39.25 7.75 37.7949 7.75 36V4Z"
        fill="white"
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <path
        d="M27 0.5V8C27 10.2091 28.7909 12 31 12H38.5"
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <rect x="1" y="18" width="17" height="16" rx="2" fill="#E04F16" />
      <path
        d="M6.24405 30H4.59632L7.10698 22.7273H9.08851L11.5956 30H9.94789L8.12615 24.3892H8.06934L6.24405 30ZM6.14107 27.1413H10.0331V28.3416H6.14107V27.1413ZM14.0086 22.7273V30H12.471V22.7273H14.0086Z"
        fill="white"
      />
    </svg>
  );
};

export default AiIcon;
