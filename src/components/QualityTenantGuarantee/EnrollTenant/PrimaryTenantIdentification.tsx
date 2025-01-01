import { DateIcon, Delete01, JpgIcon, PdfIcon, UploadCloud02Icon } from '@assets/iconComponents';
import { coApplicantchemas } from '@components/Leasing/NewApplication/schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Checkbox } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import CustomInput from '@utils/CustomInput';
import React from 'react';
import { useForm } from 'react-hook-form';
const initialValues = {
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
  monthlyIncome: '',
  sourceOfIncome: '',
  proofId: [],
  copyId: [],
};
const PrimaryTenantIdentification = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
    clearErrors,
    ...form
  } = useForm({
    resolver: yupResolver(coApplicantchemas),
    defaultValues: initialValues,
  });
  const proofIdFiles = watch('proofId');
  const copyIdFiles = watch('copyId');
  const handleDrop = ({ newfiles, type }: any) => {
    const acceptedTypes = [
      'image/png',
      'image/jpeg',
      'image/gif',
      'image/svg+xml',
      'application/pdf',
    ];
    const filteredFiles = newfiles.filter((file: any) => acceptedTypes.includes(file.type));

    if (filteredFiles.length > 0) {
      if (type === 'proofID') {
        clearErrors('proofId');
        const updatedFiles = [...(proofIdFiles || []), ...filteredFiles];
        setValue('proofId', updatedFiles);
      }
      if (type === 'copyId') {
        clearErrors('copyId');
        const updatedFiles = [...(copyIdFiles || []), ...filteredFiles];
        setValue('copyId', updatedFiles);
      }
    }
  };
  console.log(errors, 'file');

  const handleDelete = (file: any, type: any) => {
    if (type === 'proofID') {
      const updatedFiles = (proofIdFiles ?? []).filter(
        (value) => value && value.name !== file.name
      );
      setValue('proofId', updatedFiles);
    }
    if (type === 'copyId') {
      const updatedFiles = (copyIdFiles ?? []).filter((value) => value && value.name !== file.name);
      setValue('copyId', updatedFiles);
    }
  };
  const formatFileSize = (bytes: number | undefined): string => {
    if (bytes && bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    } else if (bytes) {
      return (bytes / 1024).toFixed(2) + ' KB';
    } else {
      return '';
    }
  };
  return (
    <div className="p-6">
      <div className="bg-Gray-50 rounded-[8px] text-center p-3 text-sm font-medium text-Gray-600">
        Tenant identification - Primary tenant
      </div>
      <fieldset className="grid grid-cols-2 gap-5 mt-6">
        <CustomInput label="Social security" placeholder="000-00-0000" />
        <CustomInput label="Date of birth" placeholder="Select day" leftSection={<DateIcon />} />
      </fieldset>
      <div className="bg-Gray-50 rounded-[8px] mt-6 text-center p-3 text-sm font-medium text-Gray-600">
        Copy of ID - Primary tenant
      </div>
      <div className=" mt-6 text-center p-3 text-sm font-normal text-Gray-600">Upload...</div>
      <div className="mt-6">
        <Dropzone
          multiple={true}
          onDrop={(newfiles) => handleDrop({ newfiles, type: 'proofID' } as any)}
          onReject={() => {}}
          maxSize={5 * 1024 ** 2}
          className="  border-solid border-Gray-200 border-[1px] rounded-[12px] py-4 px-6 cursor-pointer  "
        >
          <div className="flex items-center justify-center ">
            <div className="flex items-center justify-center  border-Gray-200 rounded-[8px] border-solid  border-[1px] w-10 h-10 me-2.5">
              <UploadCloud02Icon className="!w-4 !h-4 !color-Gray-600" />
            </div>
            <div>
              <div>
                <span className="text-sm font-semibold text-Brand-700 leading-5">
                  Click to upload
                </span>
                <span className="text-sm font-normal text-Gray-600  leading-5">
                  {' '}
                  or drag and drop
                </span>
              </div>
              <div className="text-xs font-normal  text-Gray-600 leading-5">
                SVG, PNG, JPG or GIF (max. 800x400px)
              </div>
            </div>
          </div>
        </Dropzone>
        {proofIdFiles && proofIdFiles.length > 0 && (
          <div className="grid-cols-2 grid gap-6 mt-4">
            {proofIdFiles.map((file) => (
              <div className="flex justify-between col-span-12 border-solid border-Gray-200 border-[1px] rounded-[12px] py-4 px-6 cursor-pointer ">
                <div className="flex gap-3">
                  {file && file.type == 'application/pdf' ? <PdfIcon /> : <JpgIcon />}
                  <div>
                    <div className="text-sm font-medium leading-5  text-Gray-700">{file?.name}</div>
                    <div className="text-sm font-normal leading-5  text-Gray-600">
                      {formatFileSize(file?.size)}{' '}
                    </div>
                  </div>
                </div>
                <Delete01
                  onClick={() => handleDelete(file, 'proofID')}
                  className="text-gray-700 cursor-pointer "
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <Checkbox
          defaultChecked
          classNames={{
            label: 'text-gray-700 font-medium	text-base',
            body: 'items-center',
          }}
          className="mt-1"
          color="#3E4784"
        />
        <div>
          <div className="text-Gray-700 text-base font-medium">I don’t have copy of ID</div>
          <div className="mt-0.5 text-Gray-600 text-base font-normal">
            Save my login details for next time.
          </div>
        </div>
      </div>
      <div className="bg-Gray-50 rounded-[8px] mt-6 text-center p-3 text-sm font-medium text-Gray-600">
        Tenant identification - Co-tenant
      </div>

      <fieldset className="grid grid-cols-2 gap-5 mt-6">
        <CustomInput label="Social security" placeholder="000-00-0000" />
        <CustomInput label="Date of birth" placeholder="Select day" leftSection={<DateIcon />} />
      </fieldset>
      <div className="bg-Gray-50 rounded-[8px] mt-6 text-center p-3 text-sm font-medium text-Gray-600">
        Copy of ID - Co-tenant
      </div>
      <div className=" mt-6 text-center p-3 text-sm font-normal text-Gray-600">Upload...</div>

      <div className="mt-6">
        <Dropzone
          multiple={true}
          onDrop={(newfiles) => handleDrop({ newfiles, type: 'proofID' } as any)}
          onReject={() => {}}
          maxSize={5 * 1024 ** 2}
          className="  border-solid border-Gray-200 border-[1px] rounded-[12px] py-4 px-6 cursor-pointer  "
        >
          <div className="flex items-center justify-center ">
            <div className="flex items-center justify-center  border-Gray-200 rounded-[8px] border-solid  border-[1px] w-10 h-10 me-2.5">
              <UploadCloud02Icon className="!w-4 !h-4 !color-Gray-600" />
            </div>
            <div>
              <div>
                <span className="text-sm font-semibold text-Brand-700 leading-5">
                  Click to upload
                </span>
                <span className="text-sm font-normal text-Gray-600  leading-5">
                  {' '}
                  or drag and drop
                </span>
              </div>
              <div className="text-xs font-normal  text-Gray-600 leading-5">
                SVG, PNG, JPG or GIF (max. 800x400px)
              </div>
            </div>
          </div>
        </Dropzone>
        {proofIdFiles && proofIdFiles.length > 0 && (
          <div className="grid-cols-2 grid gap-6 mt-4">
            {proofIdFiles.map((file) => (
              <div className="flex justify-between col-span-12 border-solid border-Gray-200 border-[1px] rounded-[12px] py-4 px-6 cursor-pointer ">
                <div className="flex gap-3">
                  {file && file.type == 'application/pdf' ? <PdfIcon /> : <JpgIcon />}
                  <div>
                    <div className="text-sm font-medium leading-5  text-Gray-700">{file?.name}</div>
                    <div className="text-sm font-normal leading-5  text-Gray-600">
                      {formatFileSize(file?.size)}{' '}
                    </div>
                  </div>
                </div>
                <Delete01
                  onClick={() => handleDelete(file, 'proofID')}
                  className="text-gray-700 cursor-pointer "
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-3 mt-6">
        <Checkbox
          defaultChecked
          classNames={{
            label: 'text-gray-700 font-medium	text-base',
            body: 'items-center',
          }}
          className="mt-1"
          color="#3E4784"
        />
        <div>
          <div className="text-Gray-700 text-base font-medium">I don’t have copy of ID</div>
          <div className="mt-0.5 text-Gray-600 text-base font-normal">
            Save my login details for next time.
          </div>
        </div>
      </div>
      <div className="bg-Gray-50 rounded-[8px] text-center p-3 text-sm font-medium text-Gray-600">
        Lease agreements
      </div>
      <div className=" mt-6 text-center p-3 text-sm font-normal text-Gray-600">
        Upload a copy of singed lease agreement
      </div>
      <div className="mt-6">
        <Dropzone
          multiple={true}
          onDrop={(newfiles) => handleDrop({ newfiles, type: 'proofID' } as any)}
          onReject={() => {}}
          maxSize={5 * 1024 ** 2}
          className="  border-solid border-Gray-200 border-[1px] rounded-[12px] py-4 px-6 cursor-pointer  "
        >
          <div className="flex items-center justify-center ">
            <div className="flex items-center justify-center  border-Gray-200 rounded-[8px] border-solid  border-[1px] w-10 h-10 me-2.5">
              <UploadCloud02Icon className="!w-4 !h-4 !color-Gray-600" />
            </div>
            <div>
              <div>
                <span className="text-sm font-semibold text-Brand-700 leading-5">
                  Click to upload
                </span>
                <span className="text-sm font-normal text-Gray-600  leading-5">
                  {' '}
                  or drag and drop
                </span>
              </div>
              <div className="text-xs font-normal  text-Gray-600 leading-5">
                SVG, PNG, JPG or GIF (max. 800x400px)
              </div>
            </div>
          </div>
        </Dropzone>
        {proofIdFiles && proofIdFiles.length > 0 && (
          <div className="grid-cols-2 grid gap-6 mt-4">
            {proofIdFiles.map((file) => (
              <div className="flex justify-between col-span-12 border-solid border-Gray-200 border-[1px] rounded-[12px] py-4 px-6 cursor-pointer ">
                <div className="flex gap-3">
                  {file && file.type == 'application/pdf' ? <PdfIcon /> : <JpgIcon />}
                  <div>
                    <div className="text-sm font-medium leading-5  text-Gray-700">{file?.name}</div>
                    <div className="text-sm font-normal leading-5  text-Gray-600">
                      {formatFileSize(file?.size)}{' '}
                    </div>
                  </div>
                </div>
                <Delete01
                  onClick={() => handleDelete(file, 'proofID')}
                  className="text-gray-700 cursor-pointer "
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrimaryTenantIdentification;
