import { GuaranteedMonthlyRent } from '@components/Properties/PropertyDasboard/GuaranteedMonthlyRent';
import { QualityTenant } from '@components/QualityTenantGuarantee';
import { Button } from '@mantine/core';
import { PlusIcon } from '@assets/iconComponents';
import { TaskActivity } from '@shared/components/TaskActivity';
import { ITabPaneProps, Tabs } from '@shared/components/tabs';
import QualityTenantPayment from '@components/QualityTenantPayment';
import QualityTenantGraphDetails from '../components/QualityTenantGuarantee/QualityTenantGraphDetails';
import { APP_PATHS } from '@routes/app-paths';
import { useNavigate } from 'react-router-dom';

export function QualityTenantGuarantees() {
  const panes: ITabPaneProps[] = [
    {
      title: 'Tenants',
      key: 'Tenants',
      component: <QualityTenantGraphDetails />,
      labelVariant: 'Number',
    },
    {
      title: 'Payment',
      key: 'Payment',
      component: <QualityTenantPayment />,
      labelVariant: 'Current',
    },
  ];

  const navigate = useNavigate();
  return (
    <div className="flex items-start self-stretch">
      <div className="flex flex-col items-start p-8 gap-6 flex-0 bg-Gray-50 self-stretch w-[67.25%]">
        <header className="w-full flex justify-end items-start gap-4 self-stretch">
          <div className="flex flex-col justify-center items-start gap-1 flex-0 self-stretch">
            <span className="self-stretch text-Gray-900 text-2xl font-semibold leading-8">
              Quality tenant guarantee
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
              onClick={() => navigate(APP_PATHS.qualityTenant.enrollTenant.get())}
            >
              Enroll tenants
            </Button>
          </div>
        </header>
        <QualityTenant />
        <Tabs currentSelectedTab={panes[0].key} panes={panes} type="filled" showLabel />
      </div>
      <div className="flex flex-col border-l border-gray-200 border-solid items-start flex-0 gap-4 max-w-xs-1 hidden xl:block w-[32.75%]">
        <div className="flex items-start self-stretch flex-col">
          <GuaranteedMonthlyRent />
          <TaskActivity />
        </div>
      </div>
    </div>
  );
}
