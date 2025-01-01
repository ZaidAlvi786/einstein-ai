import { BarChart05Icon, DataFlow03Icon, PieChart03Icon } from '@assets/iconComponents';
import { Button } from '@mantine/core';
import { useState } from 'react';
import { Summary } from './Summary';
import { Metrics } from './Metrics';
import { FlowMap } from './FlowMap';

type ViewMode = 'summary' | 'metrics' | 'flowMap';

const viewModes: { mode: ViewMode; icon: JSX.Element; label: string }[] = [
  { mode: 'summary', icon: <PieChart03Icon />, label: 'Summary' },
  { mode: 'metrics', icon: <BarChart05Icon />, label: 'Metrics' },
  { mode: 'flowMap', icon: <DataFlow03Icon />, label: 'Flow map' },
];

export const TenantLeaseDashboard = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('summary');

  const handleChangeViewMode = (mode: ViewMode) => () => setViewMode(mode);

  return (
    <div className="flex flex-col rounded-[10px] bg-white p-6 gap-5 items-stretch border border-solid border-Gray-200 overflow-hidden">
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
      {viewMode === 'summary' && <Summary />}
      {viewMode === 'metrics' && <Metrics />}
      {viewMode === 'flowMap' && <FlowMap />}
    </div>
  );
};
