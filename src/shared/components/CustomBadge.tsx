import { Box, BoxProps } from '@mantine/core';

interface CustomBadgeProps extends BoxProps {
  borderColor: string;
  textColor: string;
  bgColor: string;
  label?: string;
}

const CustomBadge: React.FC<CustomBadgeProps> = ({
  borderColor,
  textColor,
  bgColor,
  label = '',
  className,
  ...rest
}) => {
  return (
    <Box
      className={`rounded-[6px] border border-solid border-${borderColor} py-0.5 px-2 text-${textColor} bg-${bgColor} ${className}`}
      {...rest}
    >
      {label}
    </Box>
  );
};

export default CustomBadge;
