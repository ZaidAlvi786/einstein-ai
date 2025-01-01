import { Tabs as Tab } from '@mantine/core';
import { ReactNode } from 'react';
import { Status } from '@components/Status';
import classes from './index.module.css';

type TTabsType = 'basic' | 'filled';

export interface ITabPaneProps {
  title: string;
  key: string;
  component: ReactNode;
  labelContent?: string;
  labelVariant?: string;
}

interface ICommonTabsProps {
  panes?: ITabPaneProps[];
  currentSelectedTab: string;
  className?: string;
  showLabel?: boolean;
  onTabChange?: (value: string | null) => void;
}

interface ITabsProps extends ICommonTabsProps {
  type: TTabsType;
}

export const Tabs: React.FC<ITabsProps> = ({ type, ...props }) => {
  switch (type) {
    case 'basic':
      return <BasicTabs />;
    case 'filled':
      return <FilledTabs {...props} />;
    default:
      return <BasicTabs />;
  }
};

export const BasicTabs: React.FC = () => <p>Basic</p>;

export const FilledTabs: React.FC<ICommonTabsProps> = ({
  currentSelectedTab = '',
  panes,
  showLabel = false,
}) => (
  <Tab defaultValue={currentSelectedTab} variant="unstyled" classNames={classes}>
    <Tab.List grow>
      {panes?.map((pane) => (
        <Tab.Tab key={pane.key} value={pane.key}>
          <div className="flex items-center gap-2">
            {pane.title}
            {showLabel && <Status statusValue={pane.labelVariant || ['Number']} tab="" />}
          </div>
        </Tab.Tab>
      ))}
    </Tab.List>
    {panes?.map(
      (pane) =>
        pane.component && (
          <Tab.Panel key={pane.key} value={pane.key} className="w-full">
            {pane.component}
          </Tab.Panel>
        )
    )}
  </Tab>
);
