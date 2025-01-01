import { ArrowDown, Delete01, JpgIcon, PdfIcon, UploadCloud02Icon } from '@assets/iconComponents';
import { Image, Progress, Select } from '@mantine/core';
import rentManager from '@assets/icons/rent-manager.svg';
import buildium from '@assets/icons/buildium-logo.svg';
import { Dropzone } from '@mantine/dropzone';
import { useState } from 'react';
import RentManagementForm from './RentManagementForm';
import { AddNewPropertyModel } from './AddNewPropertyModel';

const BulkTenantForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [openModel, setOpenModel] = useState<boolean>(false);
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

  const handleOpenModel = () => {
    setOpenModel(true);
  };

  return (
    <div className="">
      <div className="mt-4 text-sm font-medium rounded-[8px] leading-5 flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
        Feed import
      </div>
      <div className="grid grid-cols-4 gap-5 mt-4">
        <div className="border-[1px] border-solid border-Gray-200 drop-shadow-sm rounded-[12px] p-4 cursor-pointer">
          <Image src={rentManager} alt="rent-manager" />
        </div>
        <div className="border-[1px] border-solid border-Gray-200 drop-shadow-sm rounded-[12px] p-4 cursor-pointer">
          <Image src={rentManager} alt="rent-manager" />
        </div>
        <div className="border-[1px] border-solid border-Gray-200 drop-shadow-sm rounded-[12px] p-4 cursor-pointer">
          <Image src={rentManager} alt="rent-manager" />
        </div>
        <div className="border-[1px] border-solid border-Gray-200 drop-shadow-sm rounded-[12px] p-4 cursor-pointer">
          <Image src={buildium} alt="buildium" />
        </div>
      </div>
      {/* <RentManagementForm /> */}
      <div className="mt-4 text-sm font-medium rounded-[8px] leading-5 flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
        File upload
      </div>
      <div className="mt-4">
        <Select
          classNames={{
            option: 'mb-0.5 rounded-[8px]',
            dropdown: 'rounded-[8px] drop-shadow-lg shadow-lg',
          }}
          label="Property"
          placeholder="Select"
          checkIconPosition="right"
          comboboxProps={{ dropdownPadding: 0 }}
          rightSection={<ArrowDown />}
          data={[
            { value: 'Phoenix Baker', label: 'Phoenix Baker' },
            { value: 'Olivia Rhye', label: 'Olivia Rhye' },
            { value: 'Lana Steiner', label: 'Lana Steiner' },
            { value: 'add-new', label: '+ Add New' },
          ]}
          value={'Phoenix Baker'}
          onChange={(value) => {
            if (value === 'add-new') {
              handleOpenModel();
            }
          }}
        />
      </div>
      <div className="text-Gray-600 font-normal text-sm mt-2">
        This is a hint text to help user.
      </div>
      <div className="mt-6">
        <div className="text-Gray-700 text-sm font-medium">
          Please upload your properties rent roll report of the last 12 months.
        </div>
        <Dropzone
          multiple={false}
          onDrop={handleDrop}
          onReject={() => {}}
          maxSize={5 * 1024 ** 2}
          className="border-solid mt-4 border-Gray-200 border-[1px] rounded-[12px] py-4 px-24 cursor-pointer  "
        >
          <div className="flex flex-col gap-2 items-center justify-center ">
            <div className="flex items-center justify-center  border-gray-960 rounded-[8px] border-solid border border-[1px] w-10 h-10 me-2.5">
              <UploadCloud02Icon className="!w-4 !h-4 !color-Gray-600" />
            </div>
            <div>
              <div>
                <span className="text-sm font-semibold text-Brand-700 leading-5 mr-1">
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
        {file && (
          <div className="w-full flex flex-col  gap-3 mt-4  border-solid border-Gray-200 border-[1px] rounded-[12px] py-4 px-6 cursor-pointer ">
            <div className="flex justify-between gap-3">
              <div className="flex items-center gap-3">
                {file.type == 'application/pdf' ? <PdfIcon /> : <JpgIcon />}
                <div className="flex flex-col">
                  <div className="text-sm font-medium leading-5  text-Gray-700">{file?.name}</div>
                  <div className="text-sm font-normal leading-5  text-Gray-600">
                    {formatFileSize(file?.size)}{' '}
                  </div>
                </div>
              </div>
              <Delete01 onClick={() => setFile(null)} className="text-gray-700 cursor-pointer " />
            </div>

            <div className="w-full grid grid-cols-12 items-center gap-2 ml-12">
              <div className="col-span-10">
                <Progress value={40} color="#3E4784" />
              </div>
              <div className="text-Gray-700 text-sm font-medium col-span-2">40%</div>
            </div>
          </div>
        )}
      </div>
      {openModel && (
        <AddNewPropertyModel
          addPropertyModalOpen={openModel}
          setAddPropertyModalOpen={setOpenModel}
        />
      )}
    </div>
  );
};

export default BulkTenantForm;
