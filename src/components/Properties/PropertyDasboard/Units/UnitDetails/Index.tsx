import { useEffect, useState } from 'react';
import { Header } from './Header';
import { Badge, Button, Tabs } from '@mantine/core';
import { GuaranteedMonthlyRent } from '../../GuaranteedMonthlyRent';
import { ChevronDownIcon, ChevronUp, ChevronUpIcon, Users01Icon } from '@assets/iconComponents';
import { CustomButtonTabs } from '@shared/components/CustomButtonTabs';
import { TenantsData } from './TenantsData';
import { applicationsTabData, tenantData } from '@components/mocks';
import { RightSideBar } from './RightSideBar';
import { ApplicationData } from './Applications/ApplicationData';
import { UnitDetailsTab } from './Details';
import { TaskActivity } from '@shared/components/TaskActivity';

const rightSideBarData = {
  title: 'Market rent',
  rent: '$2,0000',
  description: 'out of $192,000',
  icon: <Users01Icon height={24} width={24} />,
  cardData1: '0 active tenants',
  cardData2: '0 active lease',
  buttonTitle: '',
};
const tenantTabs = {
  tab1: 'Active',
  tab2: 'Scheduled',
  tab3: 'Past',
};
const applicationTabs = {
  tab1: 'Open',
  tab2: 'Schedule',
  tab3: 'Closed',
};
export function UnitDetails() {
  const [unitTab, setUnitTab] = useState<string>('tenants');
  const [activeButton, setActiveButton] = useState('Active');
  const [taskActivity, setTaskActivity] = useState([1,2])
  const [showPastTenant, setShowPastTenant] = useState(false)
  const [pastTenantTitles, setPastTenantTitles] = useState('Show')
  useEffect(() => {
    if (unitTab === 'applications') setActiveButton('Open');
  }, [unitTab]);
  useEffect(() => {
    const section = document.getElementById(activeButton.toLowerCase());
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeButton]);
  const toogleView = ()=> {
    if (showPastTenant == false) {
      setShowPastTenant(true)
    } else {
      setShowPastTenant(false)
    }
  }
  return (
    <div className="flex items-start self-stretch">
      <div className="flex flex-col items-start flex-0 self-stretch">
        <header className="w-full">
          <Header />
        </header>
        <Tabs
          keepMounted={false}
          value={unitTab}
          onChange={(val) => setUnitTab?.(val || unitTab)}
          classNames={{
            root: 'flex w-full pt-4 flex-col items-start self-stretch ',
            panel: 'w-full !pt-0',
            list: 'px-8',
          }}
          color="teal"
          defaultValue="tenants"
        >
          <Tabs.List
            classNames={{
              list: 'before:border-0 flex justify-center items-center self-stretch',
            }}
          >
            <Tabs.Tab
              classNames={{
                tab: `flex h-11 p-3 justify-center items-center gap-2 flex-0 ${unitTab === 'tenants' ? 'border-b-2' : 'border-b border-solid border-Gray-200'}`,
              }}
              value="tenants"
              color="#3E4784"
              size={2}
            >
              <div className="flex justify-center items-center gap-2">
                <span
                  className={`text-base font-semibold leading-5 ${unitTab === 'tenants' ? 'text-Brand-700' : 'text-Gray-500'}`}
                >
                  Tenants
                </span>
                <Badge
                  classNames={{
                    root: 'bg-Gray-50 flex items-center py-0.5 px-1.5 text-center border border-solid border-Gray-200',
                    label: 'text-Gray-700 text-center text-xs leading-18 font-medium',
                  }}
                  variant="outline"
                  size="lg"
                  radius="md"
                >
                  2
                </Badge>
              </div>
            </Tabs.Tab>
            <Tabs.Tab
              classNames={{
                tab: `flex h-11 p-3 justify-center items-center gap-2 flex-0 ${unitTab === 'applications' ? 'border-b-2' : 'border-b border-solid border-Gray-200'}`,
              }}
              value="applications"
              color="#3E4784"
              size={2}
            >
              <div className="flex justify-center items-center gap-2">
                <span
                  className={`text-base font-semibold leading-5 ${unitTab === 'applications' ? 'text-Brand-700' : 'text-Gray-500'}`}
                >
                  Applications
                </span>
                <Badge
                  classNames={{
                    root: 'bg-Gray-50 flex items-center py-0.5 px-1.5 text-center border border-solid border-Gray-200',
                    label: 'text-Gray-700 text-center text-xs leading-18 font-medium',
                  }}
                  variant="outline"
                  size="lg"
                  radius="md"
                >
                  2
                </Badge>
              </div>
            </Tabs.Tab>
            <Tabs.Tab
              classNames={{
                tab: `flex h-11 p-3 justify-center items-center gap-2 flex-0 ${unitTab === 'details' ? 'border-b-2' : 'border-b border-solid border-Gray-200'}`,
              }}
              value="details"
              color="#3E4784"
              size={2}
            >
              <div className="flex justify-center items-center gap-2">
                <span
                  className={`text-base font-semibold leading-5 ${unitTab === 'details' ? 'text-Brand-700' : 'text-Gray-500'}`}
                >
                  Details
                </span>
              </div>
            </Tabs.Tab>
          </Tabs.List>
          <div className="flex items-start flex-0 self-stretch">
            <Tabs.Panel value={'tenants'} pt="xs" >
              <div className="flex flex-col pt-10 pb-8 h-screen bg-Gray-50 px-8 items-center gap-6 flex-0 self-stretch">
                <CustomButtonTabs
                  setActiveButton={setActiveButton}
                  activeButton={activeButton}
                  tabsTitle={tenantTabs}
                />
                <div className="flex flex-col max-h-svh overflow-x-auto items-center gap-6 flex-0 self-stretch">
                  <div id="active" className="w-full">
                    <TenantsData tenantStatus="Active tenants" tenantsData={tenantData} />
                  </div>
                  <div id="scheduled" className="w-full">
                    <TenantsData tenantStatus="Scheduled move in" tenantsData={tenantData} />
                  </div>
                  <div className='flex justify-center w-full items-center gap-1.5'>
                    {!showPastTenant ? ( <ChevronUpIcon height={20} width={20} stroke='#363F72' />):(
                      <ChevronDownIcon />
                    )}
                    <span className='text-Brand-700 text-sm font-semibold leading-5 cursor-pointer' onClick={()=> toogleView()}>{!showPastTenant ? 'Show': 'Hide'} past tenant</span>
                  </div>
                  {showPastTenant && ( 
                  <div id="past" className="w-full">
                    <TenantsData tenantStatus="Past tenants" tenantsData={tenantData} />
                  </div>
                  )}
                </div>
              </div>
            </Tabs.Panel>
            <Tabs.Panel value={'applications'} pt="xs">
              <div className="flex flex-col pt-10 pb-8 h-screen bg-Gray-50 px-8 items-center gap-6 flex-0 self-stretch">
                <CustomButtonTabs
                  setActiveButton={setActiveButton}
                  activeButton={activeButton}
                  tabsTitle={applicationTabs}
                />
                <div className="flex flex-col max-h-svh overflow-x-auto items-center gap-6 flex-0 self-stretch">
                <div id="open" className="w-full">
                  <ApplicationData
                    applicationStatus="Open"
                    applicationsData={applicationsTabData}
                  />
                  </div>
                  <div id="schedule" className="w-full">
                  <ApplicationData
                    applicationStatus="Scheduled move in"
                    applicationsData={applicationsTabData}
                  />
                  </div>
                  <div id="closed" className="w-full">
                  <ApplicationData
                    applicationStatus="Closed"
                    applicationsData={applicationsTabData}
                  />
                  </div>
                  </div>
              </div>
            </Tabs.Panel>
            <Tabs.Panel value={'details'} pt="xs">
              <div className="flex flex-col bg-Gray-50 pt-10 pb-8 px-8 items-center gap-6 flex-0 self-stretch">
                <UnitDetailsTab />
              </div>
            </Tabs.Panel>
          </div>
        </Tabs>
      </div>
      <div className="flex flex-col border-l border-gray-200 border-solid items-start flex-0 gap-4 max-w-xs-1">
        <div className="flex items-start self-stretch flex-col">
          <RightSideBar rightSideBarProps={rightSideBarData} />
          {taskActivity.map((_, index) => <TaskActivity key={index} />)}
        </div>
      </div>
    </div>
  );
}
