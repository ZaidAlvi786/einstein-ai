import { LoadingOverlay } from '@mantine/core';

interface props {
  visible: boolean;
}

export function LoaderCircle({ visible }: props) {
  return (
    <>
      <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: 'sm', blur: 0.5 }} />
    </>
  );
}
