import { BarChart } from '@mantine/charts';

const data = [
  { month: 'Jan', value: 40 },
  { month: 'Feb', value: 12 },
  { month: 'Mar', value: 34 },
  { month: 'Apr', value: 25 },
  { month: 'May', value: 17 },
  { month: 'June', value: 40 },
  { month: 'Jul', value: 22 },
  { month: 'Aug', value: 45 },
  { month: 'Sep', value: 15 },
  { month: 'Oct', value: 50 },
  { month: 'Nov', value: 28 },
  { month: 'Dec', value: 34 },
];

const Graph = () => (
  <div className="w-full">
    <BarChart
      h={300}
      w="100%"
      data={data}
      dataKey="month"
      series={[{ name: 'value', color: '#363F72' }]}
      tickLine="none"
      withTooltip={false}
      strokeDasharray="0"
      xAxisLabel="Month"
      barProps={{ radius: 3, barSize: 20 }} // Add margin to adjust spacing
      xAxisProps={{
        interval: 0,
        axisLine: { stroke: '#f4f6f8' },
        style: { fontSize: '12px', color: '#475467', fontWeight: '400' },
      }}
      yAxisProps={{ style: { fontSize: '12px', color: '#475467', fontWeight: '400' } }}
    />
  </div>
);

export default Graph;
