import {
  ArrowDown,
  Delete01,
  JpgIcon,
  PdfIcon,
  UploadCloud02Icon,
  AlertErrorIcon,
  SvgDefaultUser01,
} from '@assets/iconComponents';
import { yupResolver } from '@hookform/resolvers/yup';
import { Badge, Select } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import CustomInput from '@utils/CustomInput';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { coApplicantchemas } from './schema';
import { statesList } from '@constants/app.constant';
import SkipModal from './SkipModal';
import StepButtons from '@components/Leasing/NewApplication/./StepButtons';
import { formatFileSize } from '@utils/formatFileSize';
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
interface Props {
  step: number;
  handlers: { increment: () => void; decrement: () => void };
}
const ApplicantDetailForm = ({ step, handlers }: Props) => {
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
  const handleContinue = async () => {
    // handlers.increment();
    await handleSubmit(onSubmit)();
  };
  const onSubmit = async (data: any) => {
    
    if (!isValid) {
      return;
    }
    handlers.increment();
  };
  const handleCancel = () => {
    handlers.decrement();
  };
  const proofIdFiles = watch('proofId');
  const copyIdFiles = watch('copyId');
  const [skipModal, setSkipModal] = useState(false);

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
  return (
    <div>
      <div className=" grid gap-6 p-6">
        <SkipModal skipModal={skipModal} setSkipModal={setSkipModal} />
        <div className="border-solid border border-gray-960  border-[1px] rounded-[12px] p-4  h-30 m-h-30">
          <div className="flex justify-between">
            <div className="flex">
              <div className="items-center self-center me-4">
                <SvgDefaultUser01 className="col-span-1 " />
              </div>
              <div className="self-center">
                <div className="text-base	font-medium	leading-6	text-gray-700  flex items-center ">
                  <span className="text-ellipsis max-w-32 whitespace-nowrap overflow-hidden">
                    Calvin Brown
                  </span>
                  <Badge
                    classNames={{
                      root: 'ms-1 bg-Gray-200 rounded-[6px] border border-gray-300 border-solid  border-[1px] drop-shadow-xs',
                      label:
                        'text-xs font-medium	leading-11 text-gray-700 capitalize  whitespace-nowrap overflow-hidden',
                    }}
                    variant="light"
                    className="h-3.2"
                  >
                    Primary tenant
                  </Badge>
                </div>
                <div className="font-normal	text-base	leading-6	text-gray-600">212-212-1100</div>
                <div className="font-normal	text-base	leading-6 text-gray-600 mt-0.5">
                  calvin@email.com
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2 ">
          Address
        </div>
        <fieldset className="grid-cols-2 grid gap-5 ">
          <CustomInput
            label="Address 1*"
            placeholder="Enter address 1"
            {...register('address1')}
            error={errors.address1?.message}
            onBlur={() => form.trigger('address1')}
          />
          <CustomInput
            label="Address 2"
            placeholder="Enter address 2"
            {...register('address2')}
            error={errors.address2?.message}
            onBlur={() => form.trigger('address2')}
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
                clearErrors('state');
                setValue('state', option.value);
              }}
              error={errors.state?.message}
              onBlur={() => form.trigger('state')}
            />
          </div>
          <div>
            <CustomInput
              placeholder="Enter Zip Code"
              label="Zip Code*"
              type="text"
              className={`w-full `}
              {...register('zip')}
              error={errors.zip?.message}
              onBlur={() => form.trigger('zip')}
            />
          </div>
        </fieldset>
        <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
          Proof of income
        </div>
        {errors && errors.proofId && (
          <div className="flex justify-revert items-center border border-solid border-error-300 border-[1px] rounded-[12px] cursor-pointer h-13 font-semibold text-sm p-1.5">
            <AlertErrorIcon className="me-3" /> In order to continue, please upload proof of income
          </div>
        )}

        <fieldset className="grid-cols-2 grid gap-6">
          <div>
            <CustomInput
              label="Monthly income*"
              placeholder="Enter income"
              {...register('monthlyIncome')}
              error={errors.monthlyIncome?.message}
              onBlur={() => form.trigger('monthlyIncome')}
            />
          </div>
          <div>
            <Select
              classNames={{
                option: 'mb-0.5 rounded-[8px]',
                dropdown: 'rounded-[8px] drop-shadow-lg shadow-lg',
              }}
              label="Source of income*"
              placeholder="Select"
              checkIconPosition="right"
              comboboxProps={{ dropdownPadding: 0 }}
              rightSection={<ArrowDown />}
              data={['Select1', 'Select2', 'Select3']}
              onChange={(_value, option) => {
                clearErrors('sourceOfIncome');
                setValue('sourceOfIncome', option.value);
              }}
              error={errors.sourceOfIncome?.message}
              onBlur={() => form.trigger('sourceOfIncome')}
            />
          </div>
        </fieldset>

        <div className="text-sm font-normal text-Gray-600 text-center px-12 leading-5">
          Upload last 2 paystubs or any other recent prooof of income showing monthly income *2 of
          rent
        </div>

        <Dropzone
          multiple={true}
          onDrop={(newfiles) => handleDrop({ newfiles, type: 'proofID' } as any)}
          onReject={() => {}}
          maxSize={5 * 1024 ** 2}
          className=" border border-solid border-gray-960 border-[2px] rounded-[12px] py-4 px-6 cursor-pointer  "
        >
          <div className="flex items-center justify-center ">
            <div className="flex items-center justify-center  border-gray-960 rounded-[8px] border-solid border border-[1px] w-10 h-10 me-2.5">
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
          <div className="grid-cols-2 grid gap-6">
            {proofIdFiles.map((file) => (
              <div className="flex justify-between border border-solid border-gray-960 border-[2px] rounded-[12px] py-4 px-6 cursor-pointer ">
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
        <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2 ">
          Copy of ID
        </div>
        {errors && errors.copyId && (
          <div className="flex justify-revert items-center border border-solid border-error-300 border-[1px] rounded-[12px] cursor-pointer h-13 font-semibold	text-sm p-1.5">
            <AlertErrorIcon className="me-3" /> In order to continue, please upload proof on income
          </div>
        )}
        <div className="text-sm font-normal text-Gray-600 text-center px-12 leading-5">
          Upload copy of ID. (this can be a passport, drivers lissence or any other goverment issued
          photo ID)
        </div>

        <Dropzone
          multiple={true}
          onDrop={(newfiles) => handleDrop({ newfiles, type: 'copyId' } as any)}
          onReject={() => {}}
          maxSize={5 * 1024 ** 2}
          className=" border border-solid border-gray-960 border-[2px] rounded-[12px] py-4 px-6 cursor-pointer  "
        >
          <div className="flex items-center justify-center ">
            <div className="flex items-center justify-center  border-gray-960 rounded-[8px] border-solid border border-[1px] w-10 h-10 me-2.5">
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
        {copyIdFiles && copyIdFiles.length > 0 && (
          <div className="grid-cols-2 grid gap-6">
            {copyIdFiles.map((file) => (
              <div className="flex justify-between border border-solid border-gray-960 border-[2px] rounded-[12px] py-4 px-6 cursor-pointer ">
                <div className="flex gap-3">
                  {file && file.type == 'application/pdf' ? <PdfIcon /> : <JpgIcon />}
                  <div>
                    <div className="text-sm font-medium leading-5  text-Gray-700">{file?.name}</div>
                    <div className="text-sm font-normal leading-5  text-Gray-600">
                      {formatFileSize(file?.size)}
                    </div>
                  </div>
                </div>
                <Delete01
                  onClick={() => handleDelete(file, 'copyId')}
                  className="text-gray-700 cursor-pointer "
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <StepButtons
        step={step}
        handlers={handlers}
        handleContinue={handleContinue}
        handleCancel={handleCancel}
        skipModal={() => setSkipModal(true)}
      />
    </div>
  );
};

export default ApplicantDetailForm;
