import ShieldTick from '@assets/iconComponents/ShieldTick';
import { TenantGuaranteeFeatures } from '@constants/app.constant';
import { Button, Card, List } from '@mantine/core';
import { TaskActivity } from '@shared/components/TaskActivity';

export function RightSideBar() {
  return (
    <div className="flex flex-col justify-center items-start self-stretch bg-white gap-6 py-6 px-4">
      <Card
        withBorder
        className="max-w-xs-2 p-0"
        classNames={{
          root: 'flex flex-col p-0 items-start self-stretch rounded-[12px] border-[2px] border-solid border-Success-600 bg-white',
        }}
      >
        <Card.Section
          classNames={{
            section:
              'flex mt-0 justify-center items-center self-stretch rounded-t-[12px] border-[2px] border-solid border-Success-600 bg-Success-600 gap-1 pr-5 pl-4 py-4',
          }}
        >
          <div className="flex justify-center items-center gap-4">
            <ShieldTick />
            <span className="text-white text-lg font-semibold leading-[28px]">
              Quality Tenant Guarantee
            </span>
          </div>
        </Card.Section>
        <div className="flex flex-col items-start self-stretch gap-4 pt-8 pb-6 px-4">
          <div className="flex flex-col justify-center items-center self-stretch gap-4">
            <div className="flex flex-col items-start self-stretch gap-5">
              <span className="text-Gray-600 text-sm leading-5 font-semibold text-center">
                Enroll tenants into the QualityTenantGuarantee program
              </span>
              <div className="flex flex-col items-center self-stretch px-4">
                <span className="text-Gray-600 text-base font-medium">For only</span>
                <div className="flex items-end gap-2">
                  <span className="text-Gray-700 text-4xl font-semibold tracking-tighter">4%</span>
                  <div className="flex pb-sm-3 gap-2.5">
                    <span className="text-Gray-600 text-base font-medium text-center">
                      of monthly rent
                    </span>
                  </div>
                </div>
                <span className="text-xs text-Gray-600 font-normal leading-18">
                  Paid monthly with annual commitment
                </span>
              </div>
              <div className="flex items-center self-stretch">
                <List>
                  {TenantGuaranteeFeatures.map((feature, index) => (
                    <List.Item
                      classNames={{
                        item: 'list-disc text-Gray-700 font-semibold text-xs leading-18',
                      }}
                      key={index}
                    >
                      {feature}
                    </List.Item>
                  ))}
                </List>
              </div>
            </div>
            <div className="text-Brand-700 text-sm leading-5 font-semibold cursor-pointer">
              See full details
            </div>
          </div>
          <Button
            variant="filled"
            className="border-solid w-full border-success-700 bg-success-600 rounded-[8px] hover:bg-success-500"
            style={{ boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)' }}
          >
            Enroll tenants
          </Button>
        </div>
      </Card>
      <TaskActivity />
    </div>
  );
}
