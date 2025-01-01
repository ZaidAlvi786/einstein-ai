import type { SVGProps } from 'react';

const StepIconBase = (props: SVGProps<SVGSVGElement>) => {
  const { fill = 'white' } = props;

  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="4" cy="4" r="4" fill={fill} />
    </svg>
  );
};

export default StepIconBase;
