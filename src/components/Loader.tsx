import { LoadingOverlay } from '@mantine/core';
import { useSelector } from 'react-redux';

export function Loader() {
  const isLoading = useSelector((state: RootState) => state.auth.signUp.isLoading);
  
  return (
    <>
      
      {isLoading && <LoadingOverlay
      className='fixed'
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 0.5 }}
      />
     }
    </>
  );
}

interface RootState {
  auth: any;
}
