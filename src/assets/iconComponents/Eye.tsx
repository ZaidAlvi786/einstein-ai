import { SVGProps } from 'react';

const Eye = (props: SVGProps<SVGSVGElement>) => {
  const { stroke = '#363F72', strokeWidth = '1.6667' } = props;

  return (
    <svg
      width="20"
      height="15"
      viewBox="0 0 20 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2.01677 8.09434C1.90328 7.91464 1.84654 7.82479 1.81477 7.6862C1.79091 7.5821 1.79091 7.41794 1.81477 7.31384C1.84654 7.17525 1.90328 7.0854 2.01677 6.90571C2.95461 5.42072 5.74617 1.66669 10.0003 1.66669C14.2545 1.66669 17.0461 5.42072 17.9839 6.9057C18.0974 7.0854 18.1541 7.17525 18.1859 7.31384C18.2098 7.41794 18.2098 7.5821 18.1859 7.6862C18.1541 7.82479 18.0974 7.91464 17.9839 8.09434C17.0461 9.57932 14.2545 13.3334 10.0003 13.3334C5.74617 13.3334 2.95461 9.57932 2.01677 8.09434Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.0003 10C11.381 10 12.5003 8.88073 12.5003 7.50002C12.5003 6.11931 11.381 5.00002 10.0003 5.00002C8.61962 5.00002 7.50034 6.11931 7.50034 7.50002C7.50034 8.88073 8.61962 10 10.0003 10Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Eye;
