import { Button, TextInput } from '@mantine/core';
import { PlusIcon } from '@assets/iconComponents';
import { TaskActivity } from '@shared/components/TaskActivity';
import { ITabPaneProps, Tabs } from '@shared/components/tabs';
import { QualifiedSlider } from '@components/Qualified/QualifiedSlider';
import { QualifiedTenants } from '@components/Qualified/QualifiedDetails/QualifiedTenant';
import { QualifiedOverViewCard } from '@components/Qualified/QualifiedOverViewCard';
import { QualifiedApplication } from '@components/Qualified/QualifiedDetails/QualifiedApplication';
import SearchSm from '@assets/iconComponents/SearchSm';
import { APP_PATHS } from '@routes/app-paths';
import { useNavigate } from 'react-router-dom';

const Qualified = () => {
  const panes: ITabPaneProps[] = [
    {
      title: 'Tenants',
      key: 'Tenants',
      component: <QualifiedTenants />,
      labelVariant: 'Number',
    },
    {
      title: 'Applications',
      key: 'Applications',
      component: <QualifiedApplication />,
      labelVariant: 'Number',
    },
    {
      title: 'Prospects',
      key: 'Prospects',
      component: <QualifiedTenants />,
      labelVariant: 'Number',
    },
  ];
  const navigation = useNavigate();

  return (
    <div className="flex items-start self-stretch">
      <div className="flex flex-col items-start p-8 gap-6 flex-0 bg-Gray-50 self-stretch w-[67.25%]">
        <header className="w-full flex justify-end items-start gap-4 self-stretch">
          <div className="flex flex-col justify-center items-start gap-1 flex-0 self-stretch">
            <span className="self-stretch text-Gray-900 text-2xl font-semibold leading-8">
              Qualified
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              classNames={{
                section: 'w-5 h-5 m-0',
                root: 'flex gap-1 px-3 py-2 justify-center items-center rounded-[8px] border-[1px] border-Gray-blue-300 shadow-xs text-base h-11',
                inner: 'flex gap-1.5 justify-center shadow-xs text-base',
              }}
              className="bg-white hover:bg-white text-Brand-700 hover:text-Brand-700 text-sm font-semibold leading-5"
              leftSection={<PlusIcon />}
            >
              Qualify prospects
            </Button>
            <Button
              classNames={{
                section: 'w-5 h-5 m-0',
                root: 'flex gap-1 px-3 py-2 justify-center items-center rounded-[8px] border-[1px] border-Gray-blue-300 shadow-xs text-base h-11',
                inner: 'flex gap-1.5 justify-center shadow-xs text-base',
              }}
              className="bg-white hover:bg-white text-Brand-700 hover:text-Brand-700 text-sm font-semibold leading-5"
              leftSection={<PlusIcon />}
            >
              New screening
            </Button>
            <Button
              classNames={{
                section: 'w-5 h-5 m-0',
                root: 'flex gap-1 px-3 py-2 justify-center rounded-[8px] shadow-xs text-base h-11',
                inner: 'flex gap-1.5 justify-center shadow-xs text-base',
              }}
              className="bg-brand-960 hover:bg-brand-970 text-sm font-semibold leading-5"
              leftSection={<PlusIcon />}
              onClick={() => navigation(APP_PATHS.qualified.qualifyTenant.get())}
            >
              Qualify tenants
            </Button>
          </div>
        </header>

        <QualifiedSlider />

        {/* <div className="flex gap-3"> */}
        <Tabs currentSelectedTab={panes[0].key} panes={panes} type="filled" showLabel />

        {/* <div className=" text-Gray-600 font-medium text-xs">
            <TextInput leftSection={<SearchSm />} placeholder="Search unit, name, address." />
          </div>
        </div> */}
      </div>
      <div className="flex flex-col border-l border-gray-200 border-solid items-start flex-0 gap-4 max-w-xs-1">
        <div className="flex items-start self-stretch flex-col">
          <QualifiedOverViewCard />
          <TaskActivity />
        </div>
      </div>
    </div>
  );
};

export default Qualified;
