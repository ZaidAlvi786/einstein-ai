import { SVGProps } from 'react';

const WavIcon = (props: SVGProps<SVGSVGElement>) => {
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
      <rect x="1" y="18" width="30" height="16" rx="2" fill="#DD2590" />
      <path
        d="M6.42836 30L4.34739 22.7273H6.02708L7.23091 27.7805H7.29128L8.61941 22.7273H10.0576L11.3822 27.7912H11.4461L12.6499 22.7273H14.3296L12.2487 30H10.7501L9.36515 25.245H9.30833L7.92694 30H6.42836ZM15.6737 30H14.026L16.5367 22.7273H18.5182L21.0253 30H19.3776L17.5558 24.3892H17.499L15.6737 30ZM15.5708 27.1413H19.4628V28.3416H15.5708V27.1413ZM22.3064 22.7273L24.0642 28.2528H24.1317L25.893 22.7273H27.5976L25.0905 30H23.1089L20.5983 22.7273H22.3064Z"
        fill="white"
      />
    </svg>
  );
};

export default WavIcon;
