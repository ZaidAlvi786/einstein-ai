import { ArrowDown, Delete01, JpgIcon, PdfIcon, UploadCloud02Icon } from '@assets/iconComponents';
import { Select } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import CustomInput from '@utils/CustomInput';
import React, { useState } from 'react'
import { UseFormReturn } from 'react-hook-form';
import { ProofOfIncome } from '../schema';
import { formatFileSize } from '@utils/formatFileSize';
interface Props {
  methods: UseFormReturn<ProofOfIncome>;
}

const LandLordStates = ({methods}:Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    getValues,
    ...form
  } = methods;

  const [coTenantFiles, setCoTenantFiles] = useState<File[]>([]);

    const handleDrop = ({ newfiles, type }: any) => {
        const acceptedTypes = [
          'image/png',
          'image/jpeg',
          'image/gif',
          'image/svg+xml',
          'application/pdf',
        ];
        const filteredFiles = newfiles.filter((file: any) => acceptedTypes.includes(file.type));
    
        if (filteredFiles?.length > 0) {
          if (type == 'co-tenant') {
            setCoTenantFiles((prevFiles) => [...prevFiles, ...filteredFiles]);
          }
        }
      };
      const handleDelete = ({ file, type }: any) => {
        if (type == 'co-tenant') {
          setCoTenantFiles((prevFiles) => prevFiles.filter((value) => value.name !== file.name));
        }
      };
  return (
    <>
    <fieldset className="grid-cols-2 grid gap-6 ">
    <CustomInput
      label="Monthly income*"
      placeholder="000-00-0000"
      {...register('primaryMonthlyIncome')}
      error={errors.primaryMonthlyIncome?.message}
     
    />
 
    <Select
      classNames={{
        option: 'mb-0.5 rounded-[8px]',
        dropdown: 'rounded-[8px] drop-shadow-lg shadow-lg',
      }}
      label="Source of income*"
      placeholder="Select all that apply"
      checkIconPosition="right"
      comboboxProps={{ dropdownPadding: 0 }}
      rightSection={<ArrowDown />}
      data={['Full time', 'Part time', 'Self employed','Investment','Gov.benefits','Others']}
      {...register('primarySourceOfIncom')}
      onChange={(_value, option) => {
        form.clearErrors('primarySourceOfIncom');
        form.setValue('primarySourceOfIncom', option.value);
      }}
      error={errors.primarySourceOfIncom?.message}
      onBlur={() => form.trigger('primarySourceOfIncom')}
    />
  </fieldset>
  <div className="text-sm font-normal text-Gray-600 text-center w-3/4  mx-auto px-6 leading-5">
    Upload last 2 paystubs or any other recent prooof of income showing monthly income *2 of
    rent
  </div>

  <Dropzone
    multiple={true}
    // accept={IMAGE_MIME_TYPE}
    onDrop={(newfiles) => handleDrop({ newfiles, type: 'co-tenant' } as any)}
    onReject={() => {}}
    maxSize={5 * 1024 ** 2}
    className=" border border-solid border-Gray-200 shadow-xs border-[1px] rounded-[12px] py-4 px-6 cursor-pointer  "
  >
    <div className="flex items-center justify-center ">
      <div className="flex items-center justify-center  border-Gray-200 shadow-xs rounded-[8px] border-solid border border-[1px] w-10 h-10 me-2.5">
        <UploadCloud02Icon className="!w-4 !h-4 !color-Gray-600" />
      </div>
      <div>
        <div>
          <span className="text-sm font-semibold text-Brand-700 leading-5">
            Click to upload
          </span>
          <span className="text-sm font-normal text-Gray-600  leading-5">
            or drag and drop
          </span>
        </div>
        <div className="text-xs font-normal  text-Gray-600 leading-5">
          SVG, PNG, JPG or GIF (max. 800x400px)
        </div>
      </div>
    </div>
  </Dropzone>
  <div className="grid-cols-2 grid gap-5">
    {coTenantFiles.length > 0 &&
      coTenantFiles.map((file, index) => (
        <div
          className="flex justify-between border border-solid border-Gray-200 shadow-xs border-[1px] rounded-[12px] py-4 px-6 cursor-pointer"
          key={index}
        >
          <div className="flex gap-3">
            {/* {file.type=="image/jpeg" && <JpgIcon />} */}
            {file.type == 'application/pdf' ? <PdfIcon /> : <JpgIcon />}

            <div>
              <div className="text-sm font-medium leading-5  text-Gray-700">{file?.name}</div>
              <div className="text-sm font-normal leading-5  text-Gray-600">
                {formatFileSize(file?.size)}{' '}
              </div>
            </div>
          </div>
          <Delete01
            className="text-gray-700 cursor-pointer "
            onClick={() => {
              handleDelete({ file, type: 'co-tenant' });
            }}
          />
        </div>
      ))}
      
  </div>
  </>
  )
}

export default LandLordStates