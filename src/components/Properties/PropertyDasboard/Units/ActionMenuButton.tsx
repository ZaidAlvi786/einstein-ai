import { Button, Menu } from '@mantine/core';
import { ChevronDownIcon, Home02Icon, Trash01Icon } from '@assets/iconComponents';

interface ActionMenuButtonProps {
  setAction: (value: string | null) => void;
}

export function ActionMenuButton({ setAction }: ActionMenuButtonProps) {
  const onActionHandler = (action: string) => {
    setAction(action);
  };
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button
          variant="outline"
          className="border-gray-300"
          color="gray"
          rightSection={<ChevronDownIcon className="size-5" />}
        >
          Action
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Action on item:</Menu.Label>
        <Menu.Item leftSection={<Home02Icon />} onClick={() => onActionHandler('moveUnit')}>
          Move
        </Menu.Item>
        <Menu.Item leftSection={<Trash01Icon />} onClick={() => onActionHandler('deleteUnit')}>
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
