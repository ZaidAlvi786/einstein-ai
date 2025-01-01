import { ArrowUpIcon, Building07Icon, PlusIcon, Home03Icon } from '@assets/iconComponents';
import { CustomBreadcrumbs } from '@components/CustomBreadcrumbs';
import { Tabs, Card, Image, Button, Badge } from '@mantine/core';
import img from '@assets/img/apartment.jpg';
import { useNavigate } from 'react-router-dom';
import { APP_PATHS } from '@routes/app-paths';
import { useState } from 'react';

interface HeaderProps {
  activeTab?: string | null;
  setActiveTab?: (value: string) => void;
  unitData?: any;
}

export function Header({ activeTab, setActiveTab, unitData }: HeaderProps) {
  const navigate = useNavigate();
  const [propertyTab, setpropertyTab] = useState(activeTab || 'units');
  const handleAddProperty = () => {
    navigate(APP_PATHS.properties.new.get());
  };

  const handleTabChange = (value: string | null) => {
    if (value !== null) {
      setpropertyTab(value);
      setActiveTab?.(value);
    }
  };

  return (
    <>
      <div className="flex pt-6 px-8 pb-8 w-full">
        <div className="flex flex-col items-start gap-4 self-stretch w-full">
          <div className="flex items-start self-stretch gap-8">
            <div className="flex w-[160px] h-[120px]  justify-center items-center">
              <div className="shrink-0 border-4 border-solid border-white  bg-gray-100 shadow-lg">
                <div className="flex justify-center items-center w-[160px] h-[120px] ">
                  <Home03Icon />
                </div>
              </div>
            </div>
            <div className="flex justify-between items-start flex-0">
              <div className="flex flex-col items-start gap-1 self-stretch">
                <div className="flex items-start gap-[10px] self-stretch">
                  <div className="text-gray-900 text-base	font-semibold	leading-6">
                    Whitestone Apartments
                  </div>
                </div>
                <div className="text-gray-900 text-[30px]	font-semibold	leading-[38px]">Unit 101</div>
                <div className="text-gray-700 text-base	font-medium	leading-6">123 Main St, #101</div>
                <div className="text-gray-700 text-base	font-medium	leading-6">New York NY 11100</div>
              </div>
              <div className="flex flex-col justify-center items-end gap-3">
                <Button
                  classNames={{
                    section: 'w-5 h-5 m-0',
                    root: 'flex gap-1.5 py-2 px-3 justify-center rounded-[8px] shadow-xs text-base h-11',
                    inner: 'flex gap-1.5 justify-center shadow-xs text-base',
                  }}
                  className="bg-brand-960 hover:bg-brand-970 text-base font-semibold"
                  leftSection={<PlusIcon />}
                  onClick={() => {
                    navigate(APP_PATHS.leasing.application.new.get());
                  }}
                >
                  New Application
                </Button>

                <Button
                  size="md"
                  variant="outline"
                  className="bg-white text-sm text-[#363F72] text-base font-semibold border-gray-300 border-[1px] border-solid rounded-[8px]"
                  leftSection={<PlusIcon />}
                  onClick={() => {
                    navigate(APP_PATHS.properties.addTenant.get());
                  }}
                >
                  Add tenant
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
