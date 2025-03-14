import { SVGProps } from 'react';

const WysiwygLink = (props: SVGProps<SVGSVGElement>) => {
  const { fill = '#98A2B3' } = props;

  return (
    <svg
      width="20"
      height="11"
      viewBox="0 0 20 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1.9 5.5C1.9 3.79 3.29 2.4 5 2.4H9V0.5H5C2.24 0.5 0 2.74 0 5.5C0 8.26 2.24 10.5 5 10.5H9V8.6H5C3.29 8.6 1.9 7.21 1.9 5.5ZM6 6.5H14V4.5H6V6.5ZM15 0.5H11V2.4H15C16.71 2.4 18.1 3.79 18.1 5.5C18.1 7.21 16.71 8.6 15 8.6H11V10.5H15C17.76 10.5 20 8.26 20 5.5C20 2.74 17.76 0.5 15 0.5Z"
        fill={fill}
      />
    </svg>
  );
};

export default WysiwygLink;
