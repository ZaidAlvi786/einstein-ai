import React, { useEffect, useState } from 'react';
import CustomInput from '@utils/CustomInput';
import {
  ArrowDown,
  DateIcon,
  Delete01,
  JpgIcon,
  PdfIcon,
  UploadCloud02Icon,
} from '@assets/iconComponents';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Badge, Button, Checkbox, Select } from '@mantine/core';
import StepButtons from './StepButtons';

import { formatFileSize } from '@utils/formatFileSize';
import { proofOfIncome } from './schema';
import { statesList } from '@constants/app.constant';

interface Props {
  step: number;
  handlers: {
    increment: () => void;
    decrement: () => void;
  };
}
interface TenantForm {
  tenantMonthlyIncome: string;
  tenantSourceOfIncom: string;
}
interface CoTenantForm {
  cotenantMonthlyIncome: string;
  cotenantSourceOfIncom: string;
}
const ProofOfIncome = ({ step, handlers }: Props) => {


  const [tenantFiles, setTenantFiles] = useState<File[]>([]);
  const [coTenantFiles, setCoTenantFiles] = useState<File[]>([]);

  const [tenantList, setTenantList] = useState<TenantForm[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showFields, setshowfields] = useState(true);
  

  const methods = useForm({
    resolver: yupResolver(proofOfIncome),
    // defaultValues: initialValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    getValues,
    ...form
  } = methods;

  const handleEdit = (index: number) => {
    const tenant = tenantList[index];
    setEditIndex(index);
    setshowfields(true);
    // form.reset(tenant);
  };

  const handleContinue = async () => {
    await handleSubmit(onSubmit)();
    // handlers.increment();
  };

  const onSubmit = async (data: any) => {
    if (!isValid) {
      return;
    }
    handlers.increment();
    console.log(data, 'data step3');
  };

  const handleCancel = () => {
    form.clearErrors();
    handlers.decrement();
  };

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
      if (type === 'tenant') {
        setTenantFiles((prevFiles) => [...prevFiles, ...filteredFiles]);
      }
      if (type == 'co-tenant') {
        setCoTenantFiles((prevFiles) => [...prevFiles, ...filteredFiles]);
      }
    }
  };
  const handleDelete = ({ file, type }: any) => {
    if (type === 'tenant') {
      setTenantFiles((prevFiles) => prevFiles.filter((value) => value.name !== file.name));
    }
    if (type == 'co-tenant') {
      setCoTenantFiles((prevFiles) => prevFiles.filter((value) => value.name !== file.name));
    }
  };
  return (
    <>
      <div className=" grid gap-6 p-6">
        <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2 ">
          Address
        </div>
        <fieldset className="grid-cols-2 grid gap-5 ">
          <CustomInput
            label="Address 1*"
            placeholder="Enter address 1"
            {...register('address_1')}
            error={errors.address_1?.message}
            onBlur={() => form.trigger('address_1')}
          />
          <CustomInput
            label="Address 2"
            placeholder="Enter address 2"
            {...register('address_2')}
            error={errors.address_2?.message}
            onBlur={() => form.trigger('address_2')}
          />
        </fieldset>
        <fieldset className="grid grid-cols-3 gap-5 ">
          <div>
            <CustomInput
              placeholder="Enter City"
              label="City*"
              type="text"
              className={`w-full `}
              {...register('city')}
              error={errors.city?.message}
              onBlur={() => form.trigger('city')}
            />
          </div>
          <div>
            <Select
              label="State*"
              placeholder="Select State"
              checkIconPosition="right"
              rightSection={<ArrowDown />}
              data={statesList}
              className={`w-full `}
              {...register('state')}
              onChange={(_value, option) => {
                form.setValue('state', option.value);
                form.clearErrors('state');
              }}

              error={errors.state?.message}
            />
          </div>
          <div>
            <CustomInput
              placeholder="Enter Zip Code"
              label="Zip Code*"
              type="text"
              className={`w-full `}
              {...register('zip_code')}
              error={errors.zip_code?.message}
              onBlur={() => form.trigger('zip_code')}
            />
          </div>
        </fieldset>
        <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
          Proof of income
        </div>
        <fieldset className="grid-cols-2 grid gap-6 ">
          <CustomInput
            label="Monthly income*"
            placeholder="000-00-0000"
            {...register('monthlyIncome')}
            error={errors.monthlyIncome?.message}
            onBlur={() => form.trigger('monthlyIncome')}
            onChange={(e) => {
              form.clearErrors('monthlyIncome');
              form.setValue('monthlyIncome', e.target.value);
            }}
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
            data={[
              'Full time',
              'Part time',
              'Self employed',
              'Investment',
              'Gov.benefits',
              'Others',
            ]}
            {...register('sourceOfIncom')}
            onChange={(_value, option) => {
              form.clearErrors('sourceOfIncom');
              form.setValue('sourceOfIncom', option.value);
            }}
            error={errors.sourceOfIncom?.message}
            onBlur={() => form.trigger('sourceOfIncom')}
          />
        </fieldset>
        <div className="text-sm font-normal text-Gray-600 text-center w-3/4  mx-auto px-6 leading-5">
          Upload last 2 paystubs or any other recent prooof of income showing monthly income *2 of
          rent
        </div>

        <Dropzone
          multiple={true}
          // accept={IMAGE_MIME_TYPE}
          onDrop={(newfiles) => handleDrop({ newfiles, type: 'tenant' } as any)}
          onReject={() => {}}
          maxSize={5 * 1024 ** 2}
          className=" border border-solid border-Gray-200 shadow-xs border-[1px] rounded-[12px] py-4 px-6 cursor-pointer  "
        >
          <div className="flex items-center justify-center ">
            <div className="flex items-center justify-center border-Gray-200 shadow-xs rounded-[8px] border-solid border border-[1px] w-10 h-10 me-2.5">
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
          {tenantFiles.length > 0 &&
            tenantFiles.map((file, index) => (
              <div
                className="flex justify-between border border-solid border-Gray-200 border-[1px] rounded-[12px] py-4 px-6 cursor-pointer"
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
                    handleDelete({ file, type: 'tenant' });
                  }}
                />
              </div>
            ))}
        </div>
        <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
          Tenant identification
        </div>
        <fieldset className="grid-cols-2 grid gap-6 ">
          <CustomInput
            label="Social security"
            placeholder="000-00-0000e"
            {...register('socialSecurity')}
            error={errors.socialSecurity?.message}
          />
          <CustomInput
            leftSection={<DateIcon className="size-5" />}
            label="Date of birth"
            placeholder="Select day"
            {...register('dob')}
            error={errors.dob?.message}
          />
        </fieldset>
        <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
          ID verification
        </div>
        <div className="text-sm font-normal text-Gray-600 text-center w-3/4  mx-auto px-6 leading-5">
          Upload copy of ID. (this can be a passport, drivers lissence or any other goverment issued
          photo ID)
        </div>

        <Dropzone
          multiple={true}
          accept={IMAGE_MIME_TYPE}
          onDrop={(newfiles) => handleDrop({ newfiles, type: 'co-tenant' } as any)}
          onReject={() => {}}
          maxSize={5 * 1024 ** 2}
          className=" border border-solid border-Gray-200 shadow-xs border-[1px] rounded-[12px] py-4 px-6 cursor-pointer  "
        >
          <div className="flex items-center justify-center ">
            <div className="flex items-center justify-center border-Gray-200 shadow-xs rounded-[8px] border-solid border border-[1px] w-10 h-10 me-2.5">
              <UploadCloud02Icon className="!w-4 !h-4 !color-Gray-600" />
            </div>
            <div>
              <div>
                <span className="text-sm font-semibold text-Brand-700 leading-5">
                  Click to upload
                </span>{' '}
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
      </div>
      <StepButtons
        step={step}
        handlers={handlers}
        handleContinue={handleContinue}
        handleCancel={handleCancel}
      />
    </>
  );
};

export default ProofOfIncome;
