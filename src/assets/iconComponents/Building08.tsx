import { SVGProps } from 'react';

const Building08 = (props: SVGProps<SVGSVGElement>) => {
  const { stroke = '#3E4784', strokeWidth = '2' } = props;

  return (
    <svg
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1 20H19M4 17V9.00001M8 17V9.00001M12 17V9.00001M16 17V9.00001M18 6.00001L10.424 1.26501C10.2702 1.16887 10.1933 1.1208 10.1108 1.10206C10.0379 1.08549 9.96214 1.08549 9.88921 1.10206C9.80673 1.1208 9.72982 1.16887 9.576 1.26501L2 6.00001H18Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Building08;
