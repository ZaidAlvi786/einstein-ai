import { ArrowDown, DateIcon, Delete01, JpgIcon, PdfIcon, UploadCloud02Icon } from "@assets/iconComponents";
import { LeaseDetailsForm } from "@components/Properties/Tenant/schema";
import { Select } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import CustomInput from "@utils/CustomInput";
import clsx from "clsx";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

interface Props {
  methods: UseFormReturn<LeaseDetailsForm>;
}

export function LeaseDetails({ methods }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const { register, handleSubmit, watch, getValues, reset, ...form } = methods;

  const handleDrop = (files: File[]) => {
    const acceptedTypes = [
      'image/png',
      'image/jpeg',
      'image/gif',
      'image/svg+xml',
      'application/pdf',
    ];
    files.forEach((file) => {
      if (acceptedTypes.includes(file.type)) {
        setFile(file);
      }
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    } else {
      return (bytes / 1024).toFixed(2) + ' KB';
    }
  };

  return (
    <div className="flex flex-col items-start gap-4 self-stretch">
        <fieldset className="grid-cols-3 grid gap-6 ">
          <div className="flex flex-col items-start gap-2 flex-0">
            <Select
              classNames={{
                root: 'flex flex-col items-start gap-1.5 self-stretch',
                option: 'mb-0.5 rounded-[8px]',
                dropdown: 'rounded-[8px] drop-shadow-lg shadow-lg',
                label: '!mb-0'
              }}
              label="Lease type"
              placeholder="Select"
              checkIconPosition="right"
              comboboxProps={{ dropdownPadding: 0 }}
              rightSection={<ArrowDown />}
              data={['Select1', 'Select2', 'Select3']}
              {...register('type')}
              onChange={(_value, option) => {
                form.setValue('type', option.value);
              }}
              onBlur={() => form.trigger('type')}
            />
            <div className={clsx('text-sm  font-normal text-Gray-600 leading-5')}>
              This is a hint text to help user.
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 flex-0">
            <CustomInput
            classNames={{
                root: 'flex flex-col items-start gap-1.5 self-stretch',
                label: '!mb-0'
              }}
              leftSection={<DateIcon className="size-5" />}
              label="Lease start day"
              placeholder="Enter Date"
              {...register('startDay')}
            />
            <div className={clsx('', 'text-sm font-normal text-Gray-600 leading-5')}>
              This is a hint text to help user.
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 flex-0">
            <CustomInput
            classNames={{
                root: 'flex flex-col items-start gap-1.5 self-stretch',
                label: '!mb-0'
              }}
              leftSection={<DateIcon className="size-5" />}
              label="Lease end day"
              placeholder="Enter Date"
              {...register('endDay')}
            />
            <div className={clsx('', 'text-sm font-normal text-Gray-600 leading-5')}>
              This is a hint text to help user.
            </div>
          </div>
        </fieldset>
        <fieldset className="grid-cols-2 w-full grid gap-6 ">
          <div className="flex flex-col items-start gap-2 col-span-1 flex-0">
            <CustomInput
            classNames={{
                root: 'flex flex-col items-start gap-1.5 self-stretch',
                label: '!mb-0',
                wrapper:'w-full'
              }}
              label="Monthly rent"
              placeholder="$000"
              {...register('rent')}
            />
            <div className={clsx('', 'text-sm font-normal text-Gray-600 leading-5')}>
              [Amount committed on lease]
            </div>
          </div>
          <div className="flex flex-col col-span-1 items-start gap-2 flex-0">
            <CustomInput
            classNames={{
                root: 'flex flex-col items-start gap-1.5 self-stretch',
                label: '!mb-0',
                wrapper:'w-full'
              }}
              leftSection={<DateIcon className="size-5" />}
              label="Move in date"
              placeholder="Enter Date"
              {...register('moveInDate')}
            />
            <div className={clsx('', 'text-sm font-normal text-Gray-600 leading-5')}>
              [not the lease start day!]
            </div>
          </div>
        </fieldset>
        <div className="text-sm	font-medium rounded-[8px] w-full leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
            Lease agrrement
          </div>
          <div className="text-sm w-full font-normal text-Gray-600 text-center ">
            Upload a copy of singed lease agreement
          </div>
        <Dropzone
          multiple={false}
          onDrop={handleDrop}
          onReject={() => {}}
          maxSize={5 * 1024 ** 2}
          className="border-solid w-full border-gray-960 border-[2px] rounded-[12px] py-4 px-6 cursor-pointer"
        >
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center border-gray-960 rounded-[8px] border-solid  border-[1px] w-10 h-10 me-2.5">
              <UploadCloud02Icon className="!w-4 !h-4 !color-Gray-600" />
            </div>
            <div>
              <div>
                <span className="text-sm font-semibold text-Brand-700 leading-5">
                  Click to upload
                </span>
                <span className="text-sm font-normal text-Gray-600 leading-5">
                  or drag and drop
                </span>
              </div>
              <div className="text-xs font-normal text-Gray-600 leading-5">
                SVG, PNG, JPG or GIF (max. 800x400px)
              </div>
            </div>
          </div>
        </Dropzone>
        {file && (
          <div className="flex w-full justify-between border border-solid border-gray-960 border-[2px] rounded-[12px] py-4 px-6 cursor-pointer">
            <div className="flex gap-3">
              {file.type == 'application/pdf' ? <PdfIcon /> : <JpgIcon />}
              <div>
                <div className="text-sm font-medium leading-5 text-Gray-700">{file?.name}</div>
                <div className="text-sm font-normal leading-5 text-Gray-600">
                  {formatFileSize(file?.size)}{' '}
                </div>
              </div>
            </div>
            <Delete01 onClick={() => setFile(null)} className="text-gray-700 cursor-pointer" />
          </div>
        )}
    </div>
  );
}
