import { BarChart } from '@mantine/charts';

const legendItems = [
  {
    label: 'Pre-Qualified',
    color: 'Gray-200',
  },
  {
    label: 'Enrolled',
    color: 'brand-940',
  },
];

const mockData = [
  { month: 'Jan', preQualified: 30, enrolled: 10 },
  { month: 'Feb', preQualified: 20, enrolled: 5 },
  { month: 'Mar', preQualified: 25, enrolled: 8 },
  { month: 'Apr', preQualified: 35, enrolled: 15 },
  { month: 'May', preQualified: 40, enrolled: 20 },
  { month: 'Jun', preQualified: 30, enrolled: 12 },
  { month: 'Jul', preQualified: 25, enrolled: 10 },
  { month: 'Aug', preQualified: 20, enrolled: 8 },
  { month: 'Sep', preQualified: 30, enrolled: 15 },
  { month: 'Oct', preQualified: 45, enrolled: 25 },
  { month: 'Nov', preQualified: 50, enrolled: 30 },
  { month: 'Dec', preQualified: 55, enrolled: 35 },
];

export const ApplicationMetrics = () => (
  <div className="flex flex-col gap-5">
    <div className="flex justify-end">
      {/* <span className="font-semibold text-Gray-900 text-[18px] leading-[28px]">
          Applications over time
        </span> */}
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
        { name: 'enrolled', color: '#363F72' },
        { name: 'preQualified', color: '#EAECF0' },
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
