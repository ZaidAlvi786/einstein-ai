import { Button, TextInput } from '@mantine/core';
import { UnitCards } from './UnitCards';
import { SearchLgIcon } from '@assets/iconComponents';

export function UnitsTab() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between">
        <h3>Unit mix</h3>
        <Button className='bg-brand-970'>Add unit model</Button>
      </div>
      <UnitCards />
      <div className="flex justify-between gap-4">
        <h4 className="leading-7 font-semibold text-lg	 text-gray-900">208 Units</h4>
        <TextInput
          leftSection={<SearchLgIcon className="size-5" />}
          placeholder="Unit name"
          classNames={{ input: 'rounded-lg' }}
          className="max-w-80 w-full"
        />
        <Button className='bg-brand-970'>Add unit</Button>
      </div>
      {/* <UnitsTable /> */}
    </div>
  );
}
