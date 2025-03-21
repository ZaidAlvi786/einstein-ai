import { SVGProps } from 'react';

const WysiwygBold = (props: SVGProps<SVGSVGElement>) => {
  const { fill = '#98A2B3' } = props;

  return (
    <svg
      width="11"
      height="15"
      viewBox="0 0 11 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8.6 7.29C9.57 6.62 10.25 5.52 10.25 4.5C10.25 2.24 8.5 0.5 6.25 0.5H0V14.5H7.04C9.13 14.5 10.75 12.8 10.75 10.71C10.75 9.19 9.89 7.89 8.6 7.29ZM3 3H6C6.83 3 7.5 3.67 7.5 4.5C7.5 5.33 6.83 6 6 6H3V3ZM6.5 12H3V9H6.5C7.33 9 8 9.67 8 10.5C8 11.33 7.33 12 6.5 12Z"
        fill={fill}
      />
    </svg>
  );
};

export default WysiwygBold;
