import { ITabPaneProps, Tabs } from '@shared/components/tabs';
import React from 'react';

interface IEnrollTenantTabs {
  panes: ITabPaneProps[];
}

const EnrollTenantTabs: React.FC<IEnrollTenantTabs> = ({ panes }) => (
  <div className="p-2">
    <Tabs type="filled" currentSelectedTab={panes[0].key} />
  </div>
);

export default EnrollTenantTabs;
