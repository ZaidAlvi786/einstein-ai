import { useDisclosure } from '@mantine/hooks';
import { Button } from '@mantine/core';
import { CrossedTitle } from '@components/CrossedTitle';
import { CustomInput } from '@utils/CustomInput';

export function HomePage() {
  const [isError, { toggle }] = useDisclosure();
  return (
    <div className="p-10">
      <CrossedTitle>Home page</CrossedTitle>
      <div className="flex flex-col items-center gap-6">
        <CustomInput
          w={512}
          label="Name"
          placeholder="Enter name"
          error={isError && 'Invalid name'}
        />
        <CustomInput
          w={512}
          label="Email"
          placeholder="olivia@untitledui.com"
          error={isError && 'Invalid email'}
          withIcons
        />
        <Button onClick={toggle} className="w-32 bg-brand-970 text-base font-semibold">
          Call error
        </Button>
      </div>
    </div>
  );
}
