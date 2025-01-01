import { TagsInput } from '@mantine/core';
import { CustomInput } from '@utils/CustomInput';
import { UseFormReturn } from 'react-hook-form';
import { DescriptionWithCounter } from '@components/Properties/PropertyDetailsStep/DescriptionWithCounter';
import { AlertCircleIcon } from '@assets/iconComponents';
import { FileDropzone } from './FileDropzone';
import { MultiUnitForm } from './schema';

interface Props {
  methods: UseFormReturn<MultiUnitForm>;
}

export function UnitModalFormData({ methods }: Props) {
  const {
    register,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = methods;

  const amenities = (watch('amenities')?.length && watch('amenities')) || undefined;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 mt-5">
        <CustomInput
          label="Name*"
          placeholder="Enter model name"
          error={errors.name?.message} // Error message for 'name'
          {...register('name')}
        />
        <CustomInput
          label="Units in this model*"
          placeholder="0"
          type="number"
          min="1"
          error={errors.unitsInModel?.message} // Error message for 'unitsInModel'
          {...register('unitsInModel')}
        />
      </div>

      <h4 className="mt-6 leading-5 font-medium text-sm text-center h-9 text-gray-600 bg-gray-50 p-2">
        Model details
      </h4>

      <div className="grid grid-cols-4 gap-4 mt-5">
        <CustomInput
          type="number"
          min="0"
          label="Bedrooms*"
          placeholder="0"
          error={errors.bedrooms?.message} // Error message for 'bedrooms'
          {...register('bedrooms')}
        />
        <CustomInput
          type="number"
          min="0"
          label="Bathrooms*"
          placeholder="0"
          error={errors.bathrooms?.message} // Error message for 'bathrooms'
          {...register('bathrooms')}
        />
        <CustomInput
          type="number"
          min="0"
          label="Sq. feet*"
          placeholder="0"
          error={errors.square_feet?.message} // Error message for 'sqfeet'
          {...register('square_feet')}
        />
        <CustomInput
          type="number"
          min="0"
          label="Market rent"
          placeholder="0"
          error={errors.market_rent?.message} // Error message for 'market_rent'
          {...register('market_rent')}
        />

        <div className="col-span-2">
          <TagsInput
            value={amenities}
            onChange={(value: string[]) => {
              setValue('amenities', value); // Set value and clear errors
              clearErrors('amenities');
            }}
            rightSection={
              errors.amenities ? <AlertCircleIcon className="size-4 text-error-500" /> : ''
            }
            label="Amenities"
            className="custom-tag"
            placeholder="Enter Amenities"
            error={errors.amenities?.message} // Error message for 'amenities'
          />
        </div>

        <div className="col-span-2">
          <DescriptionWithCounter
            title="Description"
            label="multiple"
            index={1}
            {...register('description')}
            methods={methods}
          />
        </div>

        <h4 className="col-span-4 leading-5 font-medium text-sm text-center h-9 text-gray-600 bg-gray-50 p-2">
          Model photos
        </h4>

        <div className="col-span-4">
          <div className="leading-5 font-medium text-sm text-gray-700 my-2">Photos</div>
          <FileDropzone
            methods={methods}
            index={1}
            unitType="multiple"
            error={errors.photos?.message} // Error message for 'images'
          />
        </div>
      </div>
    </>
  );
}
