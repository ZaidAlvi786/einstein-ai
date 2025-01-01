import { SVGProps } from 'react';

const WysiwygBulletList = (props: SVGProps<SVGSVGElement>) => {
  const { fill = '#98A2B3' } = props;

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
        d="M2.25 6C1.42 6 0.75 6.67 0.75 7.5C0.75 8.33 1.42 9 2.25 9C3.08 9 3.75 8.33 3.75 7.5C3.75 6.67 3.08 6 2.25 6ZM2.25 0C1.42 0 0.75 0.67 0.75 1.5C0.75 2.33 1.42 3 2.25 3C3.08 3 3.75 2.33 3.75 1.5C3.75 0.67 3.08 0 2.25 0ZM2.25 12C1.42 12 0.75 12.68 0.75 13.5C0.75 14.32 1.43 15 2.25 15C3.07 15 3.75 14.32 3.75 13.5C3.75 12.68 3.08 12 2.25 12ZM5.25 14.5H19.25V12.5H5.25V14.5ZM5.25 8.5H19.25V6.5H5.25V8.5ZM5.25 0.5V2.5H19.25V0.5H5.25Z"
        fill={fill}
      />
    </svg>
  );
};

export default WysiwygBulletList;
