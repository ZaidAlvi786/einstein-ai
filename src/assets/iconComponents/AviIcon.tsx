import { SVGProps } from 'react';

const AviIcon = (props: SVGProps<SVGSVGElement>) => {
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
      <rect x="1" y="18" width="23" height="16" rx="2" fill="#155EEF" />
      <path
        d="M5.95792 30H4.31019L6.82085 22.7273H8.80238L11.3095 30H9.66175L7.84002 24.3892H7.7832L5.95792 30ZM5.85494 27.1413H9.74698V28.3416H5.85494V27.1413ZM12.5906 22.7273L14.3484 28.2528H14.4158L16.1772 22.7273H17.8817L15.3746 30H13.3931L10.8825 22.7273H12.5906ZM20.2947 22.7273V30H18.7571V22.7273H20.2947Z"
        fill="white"
      />
    </svg>
  );
};

export default AviIcon;
