import { SVGProps } from 'react';

const WysiwygOrderedList = (props: SVGProps<SVGSVGElement>) => {
  const { fill = '#98A2B3' } = props;

  return (
    <svg
      width="19"
      height="17"
      viewBox="0 0 19 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0 13.5H2V14H1V15H2V15.5H0V16.5H3V12.5H0V13.5ZM1 4.5H2V0.5H0V1.5H1V4.5ZM0 7.5H1.8L0 9.6V10.5H3V9.5H1.2L3 7.4V6.5H0V7.5ZM5 1.5V3.5H19V1.5H5ZM5 15.5H19V13.5H5V15.5ZM5 9.5H19V7.5H5V9.5Z"
        fill={fill}
      />
    </svg>
  );
};

export default WysiwygOrderedList;
