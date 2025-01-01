import {
  ArrowDown,
  Delete01,
  JpgIcon,
  PdfIcon,
  PlusIcon,
  SvgReview,
  UploadCloud02Icon,
  Users01Icon,
} from '@assets/iconComponents';
import SvgAlertCircle from '@assets/iconComponents/AlertCircle';
import { Select } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import ImageCard from '@shared/components/ImageCard';
import CustomInput from '@utils/CustomInput';
import { useState } from 'react';

const EnrollIncomeProof = () => {
  const [file, setFile] = useState<File | null>(null);
  const [openCoTenant, setOpenCoTenant] = useState<boolean>(false);
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
    <div className="p-6">
      <div className="mt-4 text-sm font-medium rounded-[8px] leading-5 flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
        Proof of income
      </div>
      <div className="bg-white border-solid border-[1px] border-Gray-300 rounded-[12px] mt-6">
        <div className="flex gap-3 items-start p-4">
          <div>
            <SvgAlertCircle />
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-Gray-700 text-sm font-semibold">Verify monthly income</div>
            <div className="text-Gray-600 text-sm font-normal leading-5">
              Tenant is resding on property 3 months or less. In order to be enrolled in the QTG
              program, you need to submit proof of income of 2* on monthly rent.
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 text-sm font-medium rounded-[8px] leading-5 flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
        Primary tenant
      </div>
      <div className="mt-6">
        <ImageCard
          subTitle="$3,000/month-2 years"
          title={
            <div className="text-Gray-700 font-medium text-base">
              Sales rep <span className="font-normal">at </span>T-Mobile
            </div>
          }
          nestChildren={
            <div className="text-Gray-700 font-medium text-base">
              Reference <span className="font-normal">John Leaver</span>
            </div>
          }
          statusValue="Full time employee"
        />
      </div>
      <div className="mt-6 grid grid-cols-2 gap-5">
        <CustomInput label="Monthly income*" placeholder="Enter first name" />
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
          data={['Phoenix Baker', 'Olivia Rhye', 'Lana Steiner']}
          value={'Phoenix Baker'}
        />
      </div>
      <div className="text-Gray-600 text-sm font-normal leading-5 mt-6 text-center">
        Upload last 2 paystubs or any other recent prooof of income showing monthly income *2 of
        rent
      </div>
      <div className="mt-6">
        <Dropzone
          multiple
          onDrop={handleDrop}
          onReject={() => {}}
          maxSize={5 * 1024 ** 2}
          className="  border-solid border-Gray-200 border-[1px] rounded-[12px] py-4 px-6 cursor-pointer  "
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
          <div className="flex justify-between  border-solid border-Gray-200 border-[1px] rounded-[12px] py-4 px-6 cursor-pointer mt-6 ">
            <div className="flex gap-3">
              {file.type == 'application/pdf' ? <PdfIcon /> : <JpgIcon />}

              <div>
                <div className="text-sm font-medium leading-5  text-Gray-700">{file?.name}</div>
                <div className="text-sm font-normal leading-5  text-Gray-600">
                  {formatFileSize(file?.size)}{' '}
                </div>
              </div>
            </div>
            <Delete01 onClick={() => setFile(null)} className="text-gray-700 cursor-pointer " />
          </div>
        )}
      </div>
      {openCoTenant && (
        <div className="mt-6">
          <div className="mt-4 text-sm font-medium rounded-[8px] leading-5 flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
            Co-tenant
          </div>
          <div className="mt-6 grid grid-cols-2 gap-5">
            <CustomInput label="Monthly income*" placeholder="Enter first name" />
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
              data={['Phoenix Baker', 'Olivia Rhye', 'Lana Steiner']}
              value={'Phoenix Baker'}
            />
          </div>
          <div className="text-Gray-600 text-sm font-normal leading-5 mt-6 text-center">
            Upload last 2 paystubs or any other recent prooof of income showing monthly income *2 of
            rent
          </div>
          <div className="mt-6">
            <Dropzone
              multiple
              onDrop={handleDrop}
              onReject={() => {}}
              maxSize={5 * 1024 ** 2}
              className="  border-solid border-Gray-200 border-[1px] rounded-[12px] py-4 px-6 cursor-pointer  "
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
              <div className="flex justify-between  border-solid border-Gray-200 border-[1px] rounded-[12px] py-4 px-6 cursor-pointer mt-6 ">
                <div className="flex gap-3">
                  {file.type == 'application/pdf' ? <PdfIcon /> : <JpgIcon />}

                  <div>
                    <div className="text-sm font-medium leading-5  text-Gray-700">{file?.name}</div>
                    <div className="text-sm font-normal leading-5  text-Gray-600">
                      {formatFileSize(file?.size)}{' '}
                    </div>
                  </div>
                </div>
                <Delete01 onClick={() => setFile(null)} className="text-gray-700 cursor-pointer " />
              </div>
            )}
          </div>
        </div>
      )}
      <div
        onClick={() => setOpenCoTenant(true)}
        className="bg-white border-solid mt-6  border-Gray-200  border-[1px] shadow-xs rounded-[8px] flex items-center justify-center cursor-pointer m-h-17 h-17"
      >
        <div className="flex items-center justify-center text-Gray-600 font-semibold text-lg">
          <Users01Icon className="me-3" /> Add a guarantor <PlusIcon className="ms-3" />
        </div>
      </div>
    </div>
  );
};

export default EnrollIncomeProof;
