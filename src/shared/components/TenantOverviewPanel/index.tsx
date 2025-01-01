import { Tabs } from '@mantine/core';
import { TaskActivityPanel } from '@shared/components/TenantOverviewPanel/TaskActivityPanel';
import { MessagePanel } from '@shared/components/TenantOverviewPanel/MessagePanel';
import { ScreeningPanel } from '@shared/components/TenantOverviewPanel/ScreeningPanel';
import CustomBadge from '../CustomBadge';
interface Props {
  type?: string | undefined
}
export const TenantOverviewPanel = ({type}:Props) => {
  return (
    <Tabs
      variant="outline"
      color="#3E4784"
      defaultValue="tasks"
      classNames={{
        tabLabel: 'font-semibold text-[16px] leading-[24px] text-Brand-700',
        panel: 'max-h-[1000px] overflow-auto',
      }}
    >
      <Tabs.List
        grow
        className="font-semibold text-[16px] leading-[24px] gap-2 text-Gray-500"
        classNames={{ list: 'bg-white' }}
      >
        <Tabs.Tab
          value="tasks"
          rightSection={
            <CustomBadge borderColor="Gray-200" textColor="Gray-700" bgColor="Gray-50" label="3" />
          }
        >
          Tasks
        </Tabs.Tab>
        <Tabs.Tab
          value="messages"
          rightSection={
            <CustomBadge
              borderColor="success-200"
              textColor="Success-700"
              bgColor="Success-50"
              label="New"
            />
          }
        >
          Messages
        </Tabs.Tab>
        <Tabs.Tab
          value="screening"
          rightSection={
            <CustomBadge
              borderColor="Gray-200"
              textColor="Gray-700"
              bgColor="Gray-50"
              label="Processing"
            />
          }
        >
          Screening
        </Tabs.Tab>
      </Tabs.List>
      <div className="mt-10">
        <Tabs.Panel value="tasks">
          <TaskActivityPanel />
        </Tabs.Panel>
        <Tabs.Panel value="messages">
          <MessagePanel />
        </Tabs.Panel>
        <Tabs.Panel value="screening">
          <ScreeningPanel type={type} />
        </Tabs.Panel>
      </div>
    </Tabs>
  );
};
