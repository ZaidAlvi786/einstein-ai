import { Delete01, Edit01Icon, JpgIcon, PdfIcon, PlusIcon, Trash01Icon, UploadCloud02Icon, Users01Icon, Users04Icon } from '@assets/iconComponents';
import { Badge, Card } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { useState } from 'react';
import { CoTenantForm } from '../AmendLease/CoTenantFroms';
import { CoTeanantDetailsForm } from '../AmendLease/schema';

const initialValues: CoTeanantDetailsForm = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
  newTenant: false,
};
export function AddTenantDetails() {
  const [file, setFile] = useState<File | null>(null);
  // const { register, handleSubmit, watch, getValues, reset, ...form } = methods;
  const [coTenantForms, setCoTenantForms] = useState<CoTeanantDetailsForm[]>([initialValues]);

  const addCoTenant = () => {
    setCoTenantForms([...coTenantForms, { ...initialValues }]);
  };

  const removeCoTenant = (index: number) => {
    if (coTenantForms.length > 1) {
      setCoTenantForms(coTenantForms.filter((_, i) => i !== index));
    }
  };

  const handleFormSubmit = (index: number, data: CoTeanantDetailsForm) => {
    const updatedForms = [...coTenantForms];
    updatedForms[index] = data;
    setCoTenantForms(updatedForms);
  };

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
     {coTenantForms.map((formValues, index) => (
        <CoTenantForm
          key={index}
          formData={formValues}
          onSubmit={(data: CoTeanantDetailsForm) => handleFormSubmit(index, data)}
          onCancel={() => removeCoTenant(index)}
        />
      ))}
      <div
          className="bg-white w-full border-solid border border-[#D0D5DD]  border-[1px] shadow-xs rounded-[8px] flex items-center justify-center cursor-pointer m-h-17 h-17"
         
        >
          <div className="flex items-center justify-center text-brand-960 font-semibold text-lg" onClick={addCoTenant}>
            <Users01Icon className="me-3" /> Add co-tenant{' '}
            <PlusIcon className="ms-3" />
          </div>
        </div>
        <div className="text-sm	font-medium rounded-[8px] w-full leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
           Update lease agrrement
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
            <div className="flex items-center justify-center border-gray-960 rounded-[8px] border-solid border border-[1px] w-10 h-10 me-2.5">
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
          <div className="flex w-full justify-between border-solid border-gray-960 border-[2px] rounded-[12px] py-4 px-6 cursor-pointer">
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
