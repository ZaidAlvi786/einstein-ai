import { Accordion, TextInput, Text, Progress } from '@mantine/core';
import { NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { sidebarEntries } from './sidebarEntries';
import { LogomarkIcon, SearchLgIcon, XCloseIcon } from '@assets/iconComponents';

export const LeftSidebarMenu = () => {
  const { pathname } = useLocation();

  return (
    <aside className="bg-brand-960 text-md-semibold px-4 py-8 w-80 fixed h-screen hidden 1024:block overflow-y-scroll no-scrollbar z-[2]">
      <div className="flex items-center gap-2.5">
        <LogomarkIcon className="size-8" />
        <span className="text-brand-120 text-logo">RentSet</span>
      </div>
      <TextInput
        className="mt-6"
        placeholder="Search"
        leftSection={<SearchLgIcon className="text-brand-120" />}
        classNames={{
          input: 'bg-brand-970 border-none textInput font-normal text-base',
        }}
      />
      <Accordion
        classNames={{
          content: 'p-0 pl-2',
        }}
        className="mt-6"
      >
        {sidebarEntries.map((entry) => {
          if (entry.children) {
            const isActive = pathname.startsWith(entry.href);
            return (
              <Accordion.Item key={entry.title} value={entry.title} className="border-none">
                <Accordion.Control
                  icon={entry.icon}
                  classNames={{
                    label: 'py-2 text-md-semibold ',
                    icon: 'text-brand-120',
                  }}
                  className={clsx(
                    'pl-3 pr-2 mt-2 text-brand-120 hover:bg-brand-970 rounded-md',
                    isActive && 'text-main bg-brand-970'
                  )}
                >
                  {entry.title}
                </Accordion.Control>

                <Accordion.Panel className="flex flex-col px-0">
                  {entry.children.map((child) => (
                    <NavLink
                      key={child.href}
                      to={child.href}
                      className="flex mt-2 items-center hover:bg-brand-970 text-brand-120 px-3 py-2 gap-3 rounded-md"
                      onClick={() => {}}
                    >
                      {child.icon}
                      <span className="text-brand-120">{child.title}</span>
                    </NavLink>
                  ))}
                </Accordion.Panel>
              </Accordion.Item>
            );
          }

          return (
            <Accordion.Item key={entry.title} value={entry.title} className="border-none">
              <NavLink
                key={entry.href}
                to={entry.href}
                className={
                  'flex items-center hover:bg-brand-970 text-brand-120 px-3 py-2 gap-3 rounded-md mt-2'
                }
              >
                {entry.icon}
                <span className="text-brand-120 text-base font-semibold">{entry.title}</span>
              </NavLink>
            </Accordion.Item>
          );
        })}
      </Accordion>
      <div className="bg-brand-970 p-3 text-white rounded-md mt-24">
        <Text className="font-semibold text-base justify-between flex" size="md">
          Used space
          <XCloseIcon className="size-6 text-brand-120" />
        </Text>
        <Text className="font-normal text-base mt-2 mb-2 text-brand-110" size="md">
          Your team has used 80% of your available space. Need more?
        </Text>
        <Progress classNames={{section:"bg-white"}}  value={50} />
        <div className="flex mt-4 items-center content-center gap-2">
          <Text className="font-normal text-base flex items-center text-brand-110" size="md">
            Dismiss
          </Text>
          <Text className="font-semibold text-base ms-2 text-brand-75" size="md">
            Upgrade plan
          </Text>
        </div>
      </div>
    </aside>
  );
};
