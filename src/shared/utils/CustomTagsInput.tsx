import { Textarea } from '@mantine/core';
import { UseFormReturn } from 'react-hook-form';
import { PropertyDetailsForm } from '@components/Properties/PropertyDetailsStep/schemas';

interface Props {
  methods: UseFormReturn<PropertyDetailsForm>;
}

export function DescriptionWithCounter({ methods }: Props) {
  const { register,  formState: { errors }, } = methods;

  return (
    <div>
      <Textarea
        label="Description"
        placeholder="Enter a description..."
        classNames={{ input: 'min-h-32' }}
        {...register('description')}
        error={errors.description?.message}
      />
    </div>
  );
}
