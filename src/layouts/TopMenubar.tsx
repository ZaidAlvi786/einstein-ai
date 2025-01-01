import { Menu, Button } from '@mantine/core';
import { Building03Icon, Building02Icon, ArrowDown } from '@assets/iconComponents';

export const TopMenubar = ({ title }: { title: string }) => (
  <Menu>
    <Menu.Target>
      <Button
        leftSection={<Building02Icon />}
        className="border-2 focus:shadow-test topMenuDropDown border-solid border-brand-110 hover:bg-white hover:text-black rounded-lg hover:rounded-lg bg-white justify-between h-11 bg-white text-black w-full"
        rightSection={<ArrowDown />}
      >
        <span className="font-medium  w-full" style={{ color: 'rgba(16,19,35,1)' }}>
          {title}
        </span>
      </Button>
    </Menu.Target>

    <Menu.Dropdown className="hover:bg-grey-50 text-rgba()16,19,35,1)">
      <Menu.Item
        color="rgba(16,19,35,1)"
        leftSection={<Building03Icon className="size-5 text-brand-940 " />}
      >
        <span className="font-medium text-base">Phoenix Baker</span>
      </Menu.Item>
      <Menu.Item
        color="rgba(16,19,35,1)"
        leftSection={<Building03Icon className="size-5 text-brand-940" />}
      >
        <span className="font-medium text-base">Phoenix Baker</span>
      </Menu.Item>
      <Menu.Item
        color="rgba(16,19,35,1)"
        leftSection={<Building03Icon className="size-5 text-brand-940" />}
      >
        <span className="font-medium text-base">Phoenix Baker</span>
      </Menu.Item>
      <Menu.Item
        color="rgba(16,19,35,1)"
        leftSection={<Building03Icon className="size-5 text-brand-940" />}
      >
        <span className="font-medium text-base">Demi Wilkinson</span>
      </Menu.Item>
      <Menu.Item
        color="rgba(16,19,35,1)"
        leftSection={<Building03Icon className="size-5 text-brand-940" />}
      >
        <span className="font-medium text-base">Candice Wu</span>
      </Menu.Item>
    </Menu.Dropdown>
  </Menu>
);
