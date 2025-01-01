import { CompleteCheckIcon } from '@assets/iconComponents';
import { Button, Loader } from '@mantine/core';
import { APP_PATHS } from '@routes/app-paths';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface Props {
  step: number;
  handlers: { increment: () => void; decrement: () => void, set: (value: number) => void };

}

const ApplicationProssesing = ({ step, handlers }: Props) => {
  const [loaderVisible, setLoaderVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaderVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <div className="px-12 py-10">
        <div className="my-3 text-center">
          {loaderVisible ? <Loader size={60} color="#3E4784" /> : <CompleteCheckIcon />}
        </div>
        <div className="text-4xl font-semibold text-center leading-12 text-gray-900">
          Application {loaderVisible ? 'processing' : 'submited'}
        </div>
        <div className="text-center text-xl font-normal text-gray-600 leading-xxl mt-8">
          {loaderVisible
            ? 'Processing your application is underway. We appreciate your patience.'
            : 'We are prosessing the application, while it usely takes no longer than an hour, it might take up to 48 hours, we will notify you once the results are in.'}
        </div>
      </div>
      <div className="flex justify-end items-center border-t border-gray-960 border-solid p-4">
        <Button variant="outline" className="border-gray-300 text-gray-700 rounded-lg h-10">
          Done
        </Button>
        <Button
          onClick={() => {
            handlers.set(1);
          }}
          variant="outline"
          className="border-gray-300 ms-5 text-gray-700 rounded-lg h-10"
        >
          New application
        </Button>
      </div>
    </div>
  );
};

export default ApplicationProssesing;
