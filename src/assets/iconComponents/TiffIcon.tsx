import { SVGProps } from 'react';

const TiffIcon = (props: SVGProps<SVGSVGElement>) => {
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
      <rect x="1" y="18" width="28" height="16" rx="2" fill="#3E4784" />
      <path
        d="M4.76429 23.995V22.7273H10.7373V23.995H8.51074V30H6.99086V23.995H4.76429ZM13.2586 22.7273V30H11.721V22.7273H13.2586ZM14.5237 30V22.7273H19.339V23.995H16.0613V25.728H19.0194V26.9957H16.0613V30H14.5237ZM20.3733 30V22.7273H25.1887V23.995H21.911V25.728H24.8691V26.9957H21.911V30H20.3733Z"
        fill="white"
      />
    </svg>
  );
};

export default TiffIcon;
