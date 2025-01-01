import { Button, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen flex-col gap-8">
      <Title>404 Error</Title>
      <p>Oops! This page doesn&apos;t exist.</p>
      <Button
        className="w-80"
        onClick={() => {
          navigate(-1);
        }}
      >
        Back
      </Button>
    </div>
  );
};
