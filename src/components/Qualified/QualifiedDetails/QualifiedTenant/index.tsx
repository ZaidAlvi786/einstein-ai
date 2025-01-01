import { PieChart03Icon } from '@assets/iconComponents';
import BarChart05 from '@assets/iconComponents/BarChart05';
import DataFlow03 from '@assets/iconComponents/DataFlow03';
import { Button } from '@mantine/core';
import { useState } from 'react';
import { ApplicationSummary } from './ApplicationSummary';
import { ApplicationMetrics } from './ApplicationMetrics';
import { ApplicationFlowMap } from './ApplicationFlowMap';
import QualifiedTenantTable from './QualifiedTenantTable';

type ViewMode = 'summary' | 'metrics' | 'flowMap';

const viewModes: { mode: ViewMode; icon: JSX.Element; label: string }[] = [
  { mode: 'summary', icon: <PieChart03Icon />, label: 'Summary' },
  { mode: 'metrics', icon: <BarChart05 />, label: 'Metrics' },
  { mode: 'flowMap', icon: <DataFlow03 />, label: 'Flow map' },
];

export const QualifiedTenants = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('summary');

  const handleChangeViewMode = (mode: ViewMode) => () => setViewMode(mode);

  return (
    <>
      <div className="flex flex-col mt-5 rounded-[10px] bg-white p-6 gap-5 items-stretch border border-solid border-Gray-200 overflow-hidden h-[356px]">
        <Button.Group>
          {viewModes.map(({ mode, icon, label }) => (
            <Button
              key={mode}
              variant="default"
              leftSection={icon}
              className={`${viewMode === mode ? 'text-gray-800 bg-Gray-50' : 'text-Gray-700'}`}
              onClick={handleChangeViewMode(mode)}
            >
              {label}
            </Button>
          ))}
        </Button.Group>
        {viewMode === 'summary' && <ApplicationSummary />}
        {viewMode === 'metrics' && <ApplicationMetrics />}
        {viewMode === 'flowMap' && <ApplicationFlowMap />}
      </div>
      <QualifiedTenantTable />
    </>
  );
};
