import {
  ActivityIcon,
  ArrowNarrowLeftIcon,
  ArrowRightIcon,
  CheckCircle,
} from '@assets/iconComponents';
import { Badge, Button, Card, Tabs } from '@mantine/core';
import { useState } from 'react';
import { NoTaskActivity } from './NoTaskActivity';

const feedItemData = {
  name: 'Phoenix Baker',
  date: '02/05/2024',
  discription: 'Added 3 labels to the project',
  projectName: 'Marketing site redesign',
  relatedTo: ['Design', 'Product', 'Marketing'],
};
const feedItemsData = [feedItemData, feedItemData, feedItemData, feedItemData, feedItemData];
export function TaskActivity() {
  const [activeTab, setActiveTab] = useState('task');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activePage, setActivePage] = useState(1);
  const [total, setTotal] = useState(5);
  const getItemProps = (index: number) => ({
    variant: activePage === index ? 'filled' : 'text',
    color: 'gray',
    onClick: () => handlePageChange(index),
    className: activePage === index ? 'bg-gray-50 text-gray-800' : 'bg-white text-gray-600',
  });

  const handlePageChange = (page: number) => {
    setActivePage(page);
  };

  const next = () => {
    if (activePage < total) {
      handlePageChange(activePage + 1);
    }
  };

  const prev = () => {
    if (activePage > 1) {
      handlePageChange(activePage - 1);
    }
  };

  const handleTabChange = (value: string | null) => {
    if (value !== null) {
      setActiveTab(value);
    }
  };

  const handleFilterChange = (value: string | null) => {
    if (value !== null) {
      setActiveFilter(value);
    }
  };

  return (
    <div className="flex flex-col items-start self-stretch gap-4">
      <div className="flex flex-col items-start self-stretch">
        <Card
          classNames={{
            root: 'flex mt-0 p-0 items-start w-full self-stretch gap-4 drop-shadow-xs',
          }}
        >
          <div className="flex flex-col w-full items-start self-stretch gap-4">
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              classNames={{
                root: 'flex w-full flex-col items-start gap-2 self-stretch border-b border-solid border-Gray-200',
              }}
              color="teal"
              defaultValue="task"
            >
              <Tabs.List
                classNames={{
                  list: 'before:border-0 flex justify-center items-center self-stretch',
                }}
              >
                <Tabs.Tab
                  classNames={{
                    tab: `flex h-11 p-3 justify-center items-center gap-2 flex-0 ${activeTab === 'task' ? 'border-b-2' : ''}`,
                  }}
                  value="task"
                  color="#3E4784"
                  size={2}
                >
                  <div className="flex justify-center items-center gap-2">
                    <span
                      className={`text-base font-semibold leading-5 ${activeTab === 'task' ? 'text-Brand-700 ' : 'text-Gray-500'}`}
                    >
                      Tasks
                    </span>
                  </div>
                </Tabs.Tab>
                <Tabs.Tab
                  classNames={{
                    tab: `flex h-11 p-3 justify-center items-center gap-2 flex-0 ${activeTab === 'activity' ? 'border-b-2' : ''}`,
                  }}
                  value="activity"
                  color="#3E4784"
                  size={2}
                >
                  <div className="flex justify-center items-center gap-2">
                    <span
                      className={`text-base font-semibold leading-5 ${activeTab === 'activity' ? 'text-Brand-700' : 'text-Gray-500'}`}
                    >
                      Activity
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
              </Tabs.List>
              <Tabs.Panel value={'task'} pt="xs" className="w-full">
                <Tabs
                  value={activeFilter}
                  onChange={handleFilterChange}
                  classNames={{
                    root: 'flex w-full rounded-xl border bg-Gray-50 items-center justify-center p-1.5 gap-1 self-stretch border-solid border-Gray-200',
                  }}
                  color="teal"
                  defaultValue="all"
                >
                  <Tabs.List
                    classNames={{
                      list: 'before:border-0 flex justify-center items-center',
                    }}
                  >
                    <Tabs.Tab
                      classNames={{
                        tab: `hover:border-0 flex h-2.57 px-3 py-2 justify-center items-center gap-2 ${activeFilter === 'all' ? 'rounded-md border-transparent bg-white shadow-sm' : ''}`,
                      }}
                      value="all"
                      size={2}
                    >
                      <div className="flex justify-center items-center gap-2">
                        <span
                          className={`text-sm font-semibold leading-5 ${activeFilter === 'all' ? 'text-Brand-700 ' : 'text-Gray-500'}`}
                        >
                          All
                        </span>
                        <Badge
                          classNames={{
                            root: 'bg-white drop-shadow-xs flex items-center py-0.5 px-1.5 text-center border border-solid border-Gray-300',
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
                        tab: `hover:border-0 flex h-2.57 px-3 py-2 justify-center items-center gap-2 ${activeFilter === 'upcoming' ? 'rounded-md border-transparent bg-white shadow-sm' : ''}`,
                      }}
                      value="upcoming"
                      color="#3E4784"
                      size={2}
                    >
                      <div className="flex justify-center items-center gap-2">
                        <span
                          className={`text-sm font-semibold leading-5 ${activeFilter === 'upcoming' ? 'text-Brand-700' : 'text-Gray-500'}`}
                        >
                          Upcoming
                        </span>
                        <Badge
                          classNames={{
                            root: 'bg-Purple-50 drop-shadow-xs flex items-center py-0.5 px-1.5 text-center border border-solid border-Purple-200',
                            label: 'text-Purple-700 text-center text-xs leading-18 font-medium',
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
                        tab: `hover:border-0 flex h-2.57 px-3 py-2 justify-center items-center gap-2  ${activeFilter === 'past-due' ? 'rounded-md border-transparent bg-white shadow-sm' : ''}`,
                      }}
                      value="past-due"
                      color="#3E4784"
                      size={2}
                    >
                      <div className="flex justify-center items-center  gap-2">
                        <span
                          className={`text-sm font-semibold leading-5 ${activeFilter === 'past-due' ? 'text-Brand-700' : 'text-Gray-500'}`}
                        >
                          Past due
                        </span>
                        <Badge
                          classNames={{
                            root: 'bg-Error-50 flex items-center py-0.5 px-1.5 text-center border border-solid border-Error-200',
                            label: 'text-Error-700 text-center text-xs leading-18 font-medium',
                          }}
                          variant="outline"
                          size="lg"
                          radius="md"
                        >
                          2
                        </Badge>
                      </div>
                    </Tabs.Tab>
                  </Tabs.List>
                </Tabs>
                {feedItemsData.length ? (
                  feedItemsData.map((feedItem) => (
                    <div className="gap-4 flex flex-col items-start self-stretch">
                      <div className="flex px-4 items-start gap-3 self-stretch">
                        <div className="flex flex-col items-start gap-3 flex-0">
                          <div className="flex items-start flex-col gap-2.5 self-stretch">
                            <div className="flex justify-between items-center self-stretch">
                              <span className="text-Gray-700 text-sm font-medium leading-5">
                                {feedItem.name}
                              </span>
                              <span className="text-Error-700 text-xs font-semibold leading-18">
                                {feedItem.date}
                              </span>
                            </div>
                            <span className="text-sm text-Gray-600 leading-5 font-normal">
                              {feedItem.discription}{' '}
                              <span className="font-medium text-Brand-700">
                                {feedItem.projectName}
                              </span>
                            </span>
                          </div>
                          <div className="flex items-start gap-1">
                            {feedItem.relatedTo.map((type) => (
                              <Badge
                                classNames={{
                                  root: `rounded-[16px] border border-solid py-0.5 px-1.5 flex items-center ${
                                    type === 'Design'
                                      ? 'border-Brand-200 bg-Brand-50'
                                      : type === 'Product'
                                        ? 'border-Blue-200 bg-Blue-50'
                                        : type === 'Marketing'
                                          ? 'border-Indigo-200 bg-Indigo-50'
                                          : ''
                                  }`,
                                  label: ` text-center text-xs leading-18 font-medium ${
                                    type === 'Design'
                                      ? 'text-Brand-700 '
                                      : type === 'Product'
                                        ? 'text-Blue-700'
                                        : type === 'Marketing'
                                          ? 'text-Indigo-700'
                                          : ''
                                  }`,
                                }}
                                variant="outline"
                                size="lg"
                                radius="md"
                              >
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="h-px self-stretch bg-Gray-200"></div>
                    </div>
                  ))
                ) : (
                  <NoTaskActivity
                    title="No upcoming tasks"
                    description="All chut up! You have no upcoming taks due."
                    icon={<CheckCircle height={24} width={24} />}
                  />
                )}

                <div className="flex items-center justify-between w-full px-2 py-3 border-t border-gray-300 border-solid">
                  <Button
                    disabled={activePage === 1}
                    onClick={prev}
                    leftSection={<ArrowNarrowLeftIcon width={20} height={20} />}
                    variant="outline"
                    classNames={{ section: 'me-0' }}
                    className="flex p-2 justify-center items-center gap-2 rounded-lg text-gray-700 bg-white border-gray-300 border-solid border shadow-sm"
                  ></Button>
                  <div className="text-gray-700 text-sm">
                    {activePage}-5 of <span className="text-gray-700 font-medium	text-sm">24</span>
                  </div>
                  <Button
                    disabled={activePage === 10}
                    classNames={{ section: 'ms-0' }}
                    onClick={next}
                    rightSection={<ArrowRightIcon width={20} height={20} />}
                    variant="outline"
                    className="flex p-2 justify-center items-center gap-2 rounded-lg text-gray-700 bg-white border-gray-300 border-solid border shadow-sm"
                  ></Button>
                </div>
              </Tabs.Panel>
              <Tabs.Panel value={'activity'} pt="xs" className="w-full">
                {feedItemsData.length ? (
                  feedItemsData.map((feedItem) => (
                    <div className="gap-4 flex flex-col items-start self-stretch">
                      <div className="flex px-4 items-start gap-3 self-stretch">
                        <div className="flex flex-col items-start gap-3 flex-0">
                          <div className="flex items-start flex-col gap-2.5 self-stretch">
                            <div className="flex justify-between items-center self-stretch">
                              <span className="text-Gray-700 text-sm font-medium leading-5">
                                {feedItem.name}
                              </span>
                              <span className="text-Error-700 text-xs font-semibold leading-18">
                                {feedItem.date}
                              </span>
                            </div>
                            <span className="text-sm text-Gray-600 leading-5 font-normal">
                              {feedItem.discription}{' '}
                              <span className="font-medium text-Brand-700">
                                {feedItem.projectName}
                              </span>
                            </span>
                          </div>
                          <div className="flex items-start gap-1">
                            {feedItem.relatedTo.map((type) => (
                              <Badge
                                classNames={{
                                  root: `rounded-[16px] border border-solid py-0.5 px-1.5 flex items-center ${
                                    type === 'Design'
                                      ? 'border-Brand-200 bg-Brand-50'
                                      : type === 'Product'
                                        ? 'border-Blue-200 bg-Blue-50'
                                        : type === 'Marketing'
                                          ? 'border-Indigo-200 bg-Indigo-50'
                                          : ''
                                  }`,
                                  label: ` text-center text-xs leading-18 font-medium ${
                                    type === 'Design'
                                      ? 'text-Brand-700 '
                                      : type === 'Product'
                                        ? 'text-Blue-700'
                                        : type === 'Marketing'
                                          ? 'text-Indigo-700'
                                          : ''
                                  }`,
                                }}
                                variant="outline"
                                size="lg"
                                radius="md"
                              >
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="h-px self-stretch bg-Gray-200"></div>
                    </div>
                  ))
                ) : (
                  <NoTaskActivity
                    title="No reacent activity"
                    description="All chut up! You have no upcoming activity due."
                    icon={<ActivityIcon width={24} height={24} />}
                  />
                )}
                <div className="flex items-center justify-between w-full px-2 py-3 border-t border-gray-300 border-solid">
                  <Button
                    disabled={activePage === 1}
                    onClick={prev}
                    leftSection={<ArrowNarrowLeftIcon width={20} height={20} />}
                    variant="outline"
                    classNames={{ section: 'me-0' }}
                    className="flex p-2 justify-center items-center gap-2 rounded-lg text-gray-700 bg-white border-gray-300 border-solid border shadow-sm"
                  ></Button>
                  <div className="text-gray-700 text-sm">
                    {activePage}-5 of <span className="text-gray-700 font-medium	text-sm">24</span>
                  </div>
                  <Button
                    disabled={activePage === 10}
                    classNames={{ section: 'ms-0' }}
                    onClick={next}
                    rightSection={<ArrowRightIcon width={20} height={20} />}
                    variant="outline"
                    className="flex p-2 justify-center items-center gap-2 rounded-lg text-gray-700 bg-white border-gray-300 border-solid border shadow-sm"
                  ></Button>
                </div>
              </Tabs.Panel>
            </Tabs>
          </div>
        </Card>
      </div>
    </div>
  );
}
