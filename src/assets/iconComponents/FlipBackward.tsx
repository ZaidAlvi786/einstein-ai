import { SVGProps } from 'react';

const FlipBackward = (props: SVGProps<SVGSVGElement>) => {
  const { stroke = '#363F72', strokeWidth = '1.66667' } = props;

  return (
    <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0.5 5.00002H11.75C13.8211 5.00002 15.5 6.67895 15.5 8.75002C15.5 10.8211 13.8211 12.5 11.75 12.5H8M0.5 5.00002L3.83333 1.66669M0.5 5.00002L3.83333 8.33335"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default FlipBackward;
