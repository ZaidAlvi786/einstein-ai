import { UseFormReturn } from 'react-hook-form';
import { PropertyDetailsForm } from './schemas';
import { CrossedTitle } from '@components/CrossedTitle';
import { CustomInput } from '@utils/CustomInput';
import { DescriptionWithCounter } from '@utils/CustomTagsInput';
import clsx from 'clsx';

interface Props {
  methods: UseFormReturn<PropertyDetailsForm>;
}

export function PropertyDetailsStepInputs({ methods }: Props) {
  const {
    register,
    getValues,
    formState: { errors },
  } = methods;

  return (
    <div className="flex-1">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-3">
          <div className="flex items-start content-start gap-8 flex-wrap self-stretch">
            <div className="flex flex-col items-start gap-[6px] flex-0">
              <CustomInput
               className="w-full"
                label="Property name*"
                placeholder="Enter name of your property"
                {...register('name')}
                error={errors.name?.message}
              />
            </div>
            <div className="flex w-[165px] flex-col items-start gap-[6px]">
              <CustomInput
                label="Number of units*"
                type="text"
                min="0"
                {...register('units')}
                // value={getValues('units')}
                placeholder="0"
                error={errors.units?.message}
                classNames={{error: '!-bottom-[32px]'}}
                
              />
            </div>
          </div>
        </div>

        <div className="col-span-3">
          <DescriptionWithCounter methods={methods} />
        </div>
      </div>
    </div>
  );
}
