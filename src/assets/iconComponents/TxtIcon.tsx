import { SVGProps } from 'react';

const TxtIcon = (props: SVGProps<SVGSVGElement>) => {
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
      <rect x="1" y="18" width="27" height="16" rx="2" fill="#344054" />
      <path
        d="M4.60121 23.995V22.7273H10.5742V23.995H8.34766V30H6.82777V23.995H4.60121ZM12.9996 22.7273L14.4663 25.206H14.5231L15.9968 22.7273H17.7333L15.5138 26.3636L17.783 30H16.0146L14.5231 27.5178H14.4663L12.9748 30H11.2134L13.4897 26.3636L11.256 22.7273H12.9996ZM18.4293 23.995V22.7273H24.4023V23.995H22.1758V30H20.6559V23.995H18.4293Z"
        fill="white"
      />
    </svg>
  );
};

export default TxtIcon;
