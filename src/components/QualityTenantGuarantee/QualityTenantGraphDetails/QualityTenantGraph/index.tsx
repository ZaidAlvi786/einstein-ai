import { Card } from '@mantine/core';
import { ITabPaneProps, Tabs } from '@shared/components/tabs';
import Graph from './Graph';

const panes: ITabPaneProps[] = [
  {
    title: 'Enrolled tenants',
    key: 'Enrolled tenants',
    component: null,
  },
  {
    title: 'Guaranteed rent',
    key: 'Guaranteed rent',
    component: null,
  },
];
const QualityTenantGraph = () => (
  <Card
    withBorder
    classNames={{
      root: 'flex flex-col gap-2 items-start bg-white rounded-[12px] border-secondary border-solid border-[1px] shadow-sm',
    }}
  >
    <div className="w-full flex justify-between gap-8 mb-1 ">
      <h3 className="text-lg font-semibold leading-7">QTG over time</h3>
      <Tabs currentSelectedTab={panes[0].key} type="filled" panes={panes} />
    </div>
    <Graph />
  </Card>
);

export default QualityTenantGraph;
