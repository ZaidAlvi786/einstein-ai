import { Button, Card, Menu } from '@mantine/core';
import { ArrowDown } from '@assets/iconComponents';
import QualityTenantGraph from './QualityTenantGraph';
import QualityTenantTable from './QualityTenantGraph/QualityTenantTable';

const QualityTenantGraphDetails = () => (
  <div className="w-full mt-4">
    <Card
      withBorder
      classNames={{
        root: 'w-full flex flex-row gap-3 bg-white rounded-[12px] border-secondary border-solid border-[1px] shadow-sm',
      }}
    >
      <div className="w-full grid grid-cols-12 gap-4">
        <div className="col-span-4 flex justify-between flex-col gap-4">
          <h3 className="text-lg font-semibold leading-7">March 2025</h3>
          <div className="flex flex-col gap-3">
            <p className="text-sm font font-medium leading-5 text-gray-700">Enrolled tenants</p>
            <h1 className="text-3xl font-semibold leading-10">134</h1>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm font font-medium leading-5 text-gray-700">
              Guaranteed monthly rent
            </p>
            <div className="flex gap-1">
              <span className="text-xl font-medium leading-7 mt-1">$</span>
              <h1 className="text-3xl font-semibold leading-10">18,880</h1>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm font font-medium leading-5 text-gray-600">
              To view select property
            </p>
            <Menu>
              <Menu.Target>
                <Button
                  className="border-2 focus:shadow-test topMenuDropDown border-solid border-brand-110 hover:bg-white hover:text-black rounded-lg hover:rounded-lg bg-white justify-between h-11 bg-white text-black w-fit"
                  rightSection={<ArrowDown />}
                >
                  <span className="font-medium text-base">View</span>
                </Button>
              </Menu.Target>
            </Menu>
          </div>
        </div>
        <div className="col-span-8">
          <QualityTenantGraph />
        </div>
      </div>
    </Card>

    <QualityTenantTable />
  </div>
);

export default QualityTenantGraphDetails;
