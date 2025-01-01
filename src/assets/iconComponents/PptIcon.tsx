import { SVGProps } from 'react';

const PptIcon = (props: SVGProps<SVGSVGElement>) => {
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
      <path d="M27 0.5V8C27 10.2091 28.7909 12 31 12H38.5" stroke={stroke} strokeWidth="1.5" />
      <rect x="1" y="18" width="26" height="16" rx="2" fill="#E62E05" />
      <path
        d="M4.81765 30V22.7273H7.68697C8.23858 22.7273 8.70851 22.8326 9.09677 23.0433C9.48503 23.2517 9.78095 23.5417 9.98455 23.9134C10.1905 24.2827 10.2935 24.7088 10.2935 25.1918C10.2935 25.6747 10.1893 26.1009 9.981 26.4702C9.77267 26.8395 9.47082 27.1271 9.07546 27.3331C8.68247 27.5391 8.20662 27.642 7.6479 27.642H5.81907V26.4098H7.39933C7.69525 26.4098 7.9391 26.3589 8.13086 26.2571C8.32499 26.1529 8.4694 26.0097 8.5641 25.8274C8.66116 25.6428 8.70969 25.4309 8.70969 25.1918C8.70969 24.9503 8.66116 24.7396 8.5641 24.5597C8.4694 24.3774 8.32499 24.2365 8.13086 24.1371C7.93673 24.0353 7.69052 23.9844 7.39222 23.9844H6.35529V30H4.81765ZM11.2923 30V22.7273H14.1616C14.7132 22.7273 15.1831 22.8326 15.5714 23.0433C15.9596 23.2517 16.2556 23.5417 16.4592 23.9134C16.6651 24.2827 16.7681 24.7088 16.7681 25.1918C16.7681 25.6747 16.6639 26.1009 16.4556 26.4702C16.2473 26.8395 15.9454 27.1271 15.5501 27.3331C15.1571 27.5391 14.6812 27.642 14.1225 27.642H12.2937V26.4098H13.8739C14.1699 26.4098 14.4137 26.3589 14.6055 26.2571C14.7996 26.1529 14.944 26.0097 15.0387 25.8274C15.1358 25.6428 15.1843 25.4309 15.1843 25.1918C15.1843 24.9503 15.1358 24.7396 15.0387 24.5597C14.944 24.3774 14.7996 24.2365 14.6055 24.1371C14.4113 24.0353 14.1651 23.9844 13.8668 23.9844H12.8299V30H11.2923ZM17.4899 23.995V22.7273H23.4629V23.995H21.2363V30H19.7164V23.995H17.4899Z"
        fill="white"
      />
    </svg>
  );
};

export default PptIcon;
