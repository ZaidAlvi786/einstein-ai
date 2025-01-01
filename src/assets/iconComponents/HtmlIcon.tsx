import { SVGProps } from 'react';

const HtmlIcon = (props: SVGProps<SVGSVGElement>) => {
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
      <rect x="1" y="18" width="35" height="16" rx="2" fill="#444CE7" />
      <path
        d="M4.64968 30V22.7273H6.18732V25.728H9.30877V22.7273H10.8429V30H9.30877V26.9957H6.18732V30H4.64968ZM11.8336 23.995V22.7273H17.8066V23.995H15.5801V30H14.0602V23.995H11.8336ZM18.7903 22.7273H20.6866L22.6895 27.6136H22.7747L24.7775 22.7273H26.6738V30H25.1824V25.2663H25.122L23.2399 29.9645H22.2243L20.3422 25.2486H20.2818V30H18.7903V22.7273ZM27.9407 30V22.7273H29.4783V28.7322H32.5962V30H27.9407Z"
        fill="white"
      />
    </svg>
  );
};

export default HtmlIcon;
