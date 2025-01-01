import { SVGProps } from 'react';

const JpegIcon = (props: SVGProps<SVGSVGElement>) => {
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
      <rect x="1" y="18" width="32" height="16" rx="2" fill="#3E4784" />
      <path
        d="M7.58993 22.7273H9.10982V27.7983C9.10982 28.267 9.00447 28.6742 8.79377 29.0199C8.58543 29.3655 8.29542 29.6319 7.92374 29.8189C7.55205 30.0059 7.12 30.0994 6.62757 30.0994C6.1896 30.0994 5.79187 30.0225 5.43439 29.8686C5.07928 29.7124 4.79756 29.4756 4.58922 29.1584C4.38089 28.8388 4.27791 28.4375 4.28027 27.9545H5.81081C5.81555 28.1463 5.85461 28.3108 5.928 28.4482C6.00376 28.5831 6.10674 28.6873 6.23695 28.7607C6.36953 28.8317 6.52578 28.8672 6.7057 28.8672C6.89509 28.8672 7.05489 28.8269 7.1851 28.7464C7.31768 28.6636 7.41829 28.5429 7.48695 28.3842C7.5556 28.2256 7.58993 28.0303 7.58993 27.7983V22.7273ZM10.3811 30V22.7273H13.2504C13.8021 22.7273 14.272 22.8326 14.6602 23.0433C15.0485 23.2517 15.3444 23.5417 15.548 23.9134C15.754 24.2827 15.857 24.7088 15.857 25.1918C15.857 25.6747 15.7528 26.1009 15.5445 26.4702C15.3361 26.8395 15.0343 27.1271 14.6389 27.3331C14.2459 27.5391 13.7701 27.642 13.2114 27.642H11.3825V26.4098H12.9628C13.2587 26.4098 13.5026 26.3589 13.6943 26.2571C13.8885 26.1529 14.0329 26.0097 14.1276 25.8274C14.2246 25.6428 14.2732 25.4309 14.2732 25.1918C14.2732 24.9503 14.2246 24.7396 14.1276 24.5597C14.0329 24.3774 13.8885 24.2365 13.6943 24.1371C13.5002 24.0353 13.254 23.9844 12.9557 23.9844H11.9188V30H10.3811ZM16.8557 30V22.7273H21.7563V23.995H18.3934V25.728H21.5042V26.9957H18.3934V28.7322H21.7705V30H16.8557ZM27.8012 25.0781C27.7515 24.9053 27.6817 24.7526 27.5917 24.62C27.5017 24.4851 27.3917 24.3714 27.2615 24.2791C27.1336 24.1844 26.9868 24.1122 26.8211 24.0625C26.6578 24.0128 26.4767 23.9879 26.2778 23.9879C25.9061 23.9879 25.5794 24.0803 25.2977 24.2649C25.0183 24.4496 24.8005 24.7183 24.6443 25.071C24.488 25.4214 24.4099 25.8499 24.4099 26.3565C24.4099 26.8632 24.4868 27.294 24.6407 27.6491C24.7946 28.0043 25.0124 28.2753 25.2941 28.4624C25.5758 28.647 25.9085 28.7393 26.292 28.7393C26.64 28.7393 26.9371 28.6778 27.1833 28.5547C27.4319 28.4292 27.6213 28.2528 27.7515 28.0256C27.8841 27.7983 27.9504 27.5296 27.9504 27.2195L28.2629 27.2656H26.3879V26.108H29.4312V27.0241C29.4312 27.6634 29.2963 28.2126 29.0264 28.6719C28.7565 29.1288 28.3848 29.4815 27.9113 29.7301C27.4378 29.9763 26.8957 30.0994 26.2849 30.0994C25.6031 30.0994 25.0041 29.9491 24.488 29.6484C23.9719 29.3454 23.5695 28.9157 23.2806 28.3594C22.9942 27.8007 22.8509 27.1378 22.8509 26.3707C22.8509 25.7812 22.9362 25.2557 23.1066 24.794C23.2794 24.33 23.5209 23.937 23.8311 23.6151C24.1412 23.2931 24.5022 23.0481 24.9142 22.88C25.3261 22.7119 25.7723 22.6278 26.2529 22.6278C26.6649 22.6278 27.0484 22.6882 27.4035 22.8089C27.7586 22.9273 28.0735 23.0954 28.3481 23.3132C28.6251 23.531 28.8512 23.7902 29.0264 24.0909C29.2016 24.3892 29.314 24.7183 29.3637 25.0781H27.8012Z"
        fill="white"
      />
    </svg>
  );
};

export default JpegIcon;
