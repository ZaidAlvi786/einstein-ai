import { BarChart } from '@mantine/charts';

const legendItems = [
  {
    label: 'applied',
    color: 'Gray-200',
  },
  {
    label: 'accepted',
    color: 'brand-940',
  },
  {
    label: 'signed lease',
    color: 'brand-960',
  },
];

const mockData = [
  { month: 'Jan', applied: 30, accepted: 10, signedLease: 5 },
  { month: 'Feb', applied: 20, accepted: 5, signedLease: 3 },
  { month: 'Mar', applied: 25, accepted: 8, signedLease: 4 },
  { month: 'Apr', applied: 35, accepted: 15, signedLease: 7 },
  { month: 'May', applied: 40, accepted: 20, signedLease: 10 },
  { month: 'Jun', applied: 30, accepted: 12, signedLease: 6 },
  { month: 'Jul', applied: 25, accepted: 10, signedLease: 4 },
  { month: 'Aug', applied: 20, accepted: 8, signedLease: 3 },
  { month: 'Sep', applied: 30, accepted: 15, signedLease: 7 },
  { month: 'Oct', applied: 45, accepted: 25, signedLease: 15 },
  { month: 'Nov', applied: 50, accepted: 30, signedLease: 20 },
  { month: 'Dec', applied: 55, accepted: 35, signedLease: 25 },
];

export const ApplicationMetrics = () => (
  <div className="flex flex-col gap-5">
    <div className="flex justify-end">
      <div className="flex items-center gap-3">
        {legendItems.map(({ label, color }) => (
          <div className="flex items-center gap-2" key={label}>
            <div className={`w-2 h-2 rounded-full bg-${color}`}></div>
            <span className="capitalize text-sm font-normal text-Gray-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
    <BarChart
      h={170}
      data={mockData}
      dataKey="month"
      type="stacked"
      series={[
        { name: 'signedLease', color: '#363F72' },
        { name: 'accepted', color: '#4E5BA6' },
        { name: 'applied', color: '#EAECF0' },
      ]}
      barProps={{ barSize: 16 }}
      withTooltip={false}
      xAxisProps={{
        interval: 0,
        axisLine: { stroke: '#f4f6f8' },
        style: { fontSize: '12px', color: '#475467', fontWeight: '400' },
      }}
      yAxisProps={{ style: { fontSize: '12px', color: '#475467', fontWeight: '400' } }}
    />
    <div className="flex justify-center text-xs font-medium text-Gray-600">Month</div>
  </div>
);
