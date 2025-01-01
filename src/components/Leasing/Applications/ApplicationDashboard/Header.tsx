import { PlusIcon } from '@assets/iconComponents';
import { Button } from '@mantine/core';
import { APP_PATHS } from '@routes/app-paths';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="flex gap-4 font-semibold items-center">
      <div className="text-[24px] leading-[32px] flex-1">Applications</div>
      <div className="gap-3 flex text-sm text-base font-semibold ">
        <Button
          size="md"
          variant="outline"
          className="bg-white text-Gray-700 hover:text-Gray-600 rounded-lg border-Gray-300"
          leftSection={<PlusIcon />}
        >
          Screen tenant
        </Button>
        <Button
          onClick={() => {
            navigate(APP_PATHS.leasing.application.new.get());
          }}
          size="md"
          variant="outline"
          className="bg-brand-970 rounded-lg border-Gray-300 text-white hover:bg-brand-960 hover:text-white"
          leftSection={<PlusIcon />}
        >
          New application
        </Button>
      </div>
    </div>
  );
};
