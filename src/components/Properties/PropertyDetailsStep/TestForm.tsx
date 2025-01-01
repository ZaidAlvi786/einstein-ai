import { Button, Checkbox, TextInput } from '@mantine/core';
import { useForm } from 'react-hook-form';
export function TestForm(props: any) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
  });

  const onSubmit = () => {
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Checkbox label="isRequired" {...register('company.isRequired')} />
      <TextInput label="name" {...register('company.name')} />
      <Button type="submit">qweqe</Button>
    </form>
  );
}
