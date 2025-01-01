import {
  AlertErrorIcon,
  ArrowDown,
  DateIcon,
  Delete01,
  JpgIcon,
  PdfIcon,
  UploadCloud02Icon,
} from '@assets/iconComponents';
import { yupResolver } from '@hookform/resolvers/yup';
import { Checkbox, Select } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { RootState } from '@stores/index';
import CustomInput from '@utils/CustomInput';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { leaseDetailSchema, tenantIdentification } from './schema';
import StepButtons from './StepButtons';
import { formatFileSize } from '@utils/formatFileSize';

interface Props {
  step: number;
  handlers: {
    increment: () => void;
    decrement: () => void;
  };
}
const initialValues = {
  newTenant: false,
  tenantSocialSecurity: '',
  tenantDob: '',
  contenantSocialSecurity: '',
  coTtenantDob: '',
};
const TenantIdentificationForm = ({ step, handlers }: Props) => {
  const { newTenent } = useSelector((state: RootState) => state?.addTenent);
  

  const [tenantFiles, setTenantFiles] = useState<File[]>([]);
  const [coTenantFiles, setCoTenantFiles] = useState<File[]>([]);

  const [tenantCheck, setTenantCheck] = useState(true);
  const [coTenantCheck, setCoTenantCheck] = useState(true);
  const methods = useForm({
    resolver: yupResolver(tenantIdentification),
    defaultValues: initialValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    getValues,
    reset,
    ...form
  } = methods;

  useEffect(()=>{
  form.setValue("newTenant",newTenent)
  },[newTenent])


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
        {newTenent&&
         <div className="flex justify-revert items-center border border-solid border-error-300 border-[1px] rounded-[12px] cursor-pointer h-13 font-semibold text-sm p-1.5">
         <AlertErrorIcon className="me-3" /> ID is not yet verified, in order to proceed with the QTG, ID must be verified
       </div>
        }
        <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
        Tenant identification - Primary tenant
        </div>
        <fieldset className="grid-cols-2 grid gap-6 ">
          <CustomInput
            label="Social security*"
            placeholder="000-00-0000e"
            {...register('tenantSocialSecurity')}
            error={errors.tenantSocialSecurity?.message}
          />
          <CustomInput
            leftSection={<DateIcon className="size-5" />}
            label="Date of birth*"
            placeholder="Select day"
            {...register('tenantDob')}
            error={errors.tenantDob?.message}
          />
        </fieldset>
        <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
          Copy of ID
        </div>
        <div className="text-sm font-normal text-Gray-600 text-center w-3/4  mx-auto px-6 leading-5">
          Upload copy of ID. (this can be a passport, drivers lissence or any other goverment issued
          photo ID)
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
                {" "}
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
                    handleDelete({ file, type: 'tenant' });
                  }}
                />
              </div>
            ))}
        </div>
        <div>
          <div className="flex gap-3 ">
            <Checkbox
              checked={tenantCheck}
              onClick={() => setTenantCheck(!tenantCheck)}
              classNames={{
                label: 'text-gray-700 font-medium	text-base	',
                body: 'items-center',
                input: clsx('!rounded-[6px]', tenantCheck && '!bg-brand-970 !border-brand-970'),
              }}
              className="mt-1"
            />
            <div>
              <div className="text-Gray-700 text-base font-medium">I don’t have copy of ID</div>
              <div className="mt-0.5 text-Gray-600 text-base font-normal">
                {' '}
                Save my login details for next time.
              </div>
            </div>
          </div>
        </div>
          <>
            <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
              Tenant identification - Co-tenant
            </div>
            <fieldset className="grid-cols-2 grid gap-6 ">
              <CustomInput
                label="Social security*"
                placeholder="000-00-0000e"
                {...register('contenantSocialSecurity')}
                error={errors.contenantSocialSecurity?.message}
              />
              <CustomInput
                leftSection={<DateIcon className="size-5" />}
                label="Date of birth*"
                placeholder="Select day"
                {...register('coTtenantDob')}
                error={errors.coTtenantDob?.message}
              />
            </fieldset>
            <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
              Copy of ID - Co-tenant
            </div>
            <div className="text-sm font-normal text-Gray-600 text-center w-3/4  mx-auto px-6 leading-5">
              Upload copy of ID. (this can be a passport, drivers lissence or any other goverment
              issued photo ID)
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
                    </span>{
                      " "
                    }
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
                        <div className="text-sm font-medium leading-5  text-Gray-700">
                          {file?.name}
                        </div>
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
            <div>
              <div className="flex gap-3 ">
                <Checkbox
                  checked={coTenantCheck}
                  onClick={() => setCoTenantCheck(!coTenantCheck)}
                  classNames={{
                    label: 'text-gray-700 font-medium	text-base	',
                    body: 'items-center',
                    input: clsx(
                      '!rounded-[6px]',
                      coTenantCheck && '!bg-brand-970 !border-brand-970'
                    ),
                  }}
                  className="mt-1"
                />
                <div>
                  <div className="text-Gray-700 text-base font-medium">I don’t have copy of ID</div>
                  <div className="mt-0.5 text-Gray-600 text-base font-normal">
                    {' '}
                    Save my login details for next time.
                  </div>
                </div>
              </div>
            </div>
          </>
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

export default TenantIdentificationForm;
