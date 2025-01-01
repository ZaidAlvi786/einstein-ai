import { PlusIcon } from "@assets/iconComponents";
import { Button } from "@mantine/core";
import { APP_PATHS } from "@routes/app-paths";
import { useNavigate } from "react-router-dom";

export function Header(){
  const navigate = useNavigate();
    return (
        <div className="flex gap-4 font-semibold items-center self-stretch">
        <div className="text-2xl leading-8 text-Gray-900 flex-1">Leases</div>
        <div className="gap-3 flex text-sm text-base font-semibold items-center">
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
                navigate(APP_PATHS.leasing.addLease.get());
              }}
            size="md"
            variant="outline"
            className="bg-brand-970 rounded-lg border-Gray-300 text-white hover:bg-brand-960 hover:text-white"
            leftSection={<PlusIcon />}
          >
            New lease
          </Button>
        </div>
      </div>
    )
}