import React from 'react';
import { ITabPaneProps, Tabs } from '@shared/components/tabs';

interface IQualifiedTenantForm {
  panes: ITabPaneProps[];
  onChange: (value: string | null) => void;
}

const AddQualifiedTenantForm: React.FC<IQualifiedTenantForm> = ({ panes, onChange }) => (
  <div className="p-6">
    <Tabs panes={panes} currentSelectedTab={panes[0].key} type="filled" onTabChange={onChange} />
  </div>
);

export default AddQualifiedTenantForm;
