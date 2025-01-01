import { SVGProps } from 'react';

const WysiwygItalic = (props: SVGProps<SVGSVGElement>) => {
  const { fill = '#98A2B3' } = props;

  return (
    <svg
      width="12"
      height="15"
      viewBox="0 0 12 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M4 0.5V3.5H6.21L2.79 11.5H0V14.5H8V11.5H5.79L9.21 3.5H12V0.5H4Z" fill={fill} />
    </svg>
  );
};

export default WysiwygItalic;
