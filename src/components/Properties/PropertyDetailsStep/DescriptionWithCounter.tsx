import { Textarea } from '@mantine/core';
import clsx from 'clsx';
// import { MultiUnitForm, UnitForm } from '../PropertyDasboard/Units/AddUnitModal/schema';

const DESCRIPTION_MAX_VALUE = 700;

interface Props {
  methods: any;
  label: 'single' | 'multiple';
  title: string;
  index: number;
}

export function DescriptionWithCounter({ methods, label, title, index }: Props) {
  const { watch, register } = methods;
  const descriptionLength = watch('description')?.length ?? 0;
  return (
    <div>
      <Textarea
        {...register('description')}
        label={title}
        placeholder="Add a short description..."
        classNames={{
          input: clsx(
            'focus:shadow-test border-gray-300 focus:border-brand-300 rounded-lg placeholder:text-gray-500 shadow-input text-md-regular h-22'
          ),
        }}
      />
      <div className="mt-2.5 text-sm-regular text-gray-600">
        {DESCRIPTION_MAX_VALUE - descriptionLength} characters left
      </div>
    </div>
  );
}
