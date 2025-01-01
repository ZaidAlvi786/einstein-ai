import { ITabPaneProps, Tabs } from '@shared/components/tabs';
import React from 'react';
import QualityPaymentTable from '../QualityPaymentTable';

const QualityTenantPaymentTabs = () => {
  const panes: ITabPaneProps[] = [
    {
      title: 'Invoices',
      key: 'Invoices',
      component: <QualityPaymentTable />,
    },
    {
      title: 'Transactions',
      key: 'Transactions',
      component: <QualityPaymentTable />,
    },
  ];
  return (
    <div className="mt-4">
      <Tabs currentSelectedTab={panes[0].key} panes={panes} type="filled" />
    </div>
  );
};

export default QualityTenantPaymentTabs;
