import { Delete01, Edit01Icon, JpgIcon, PdfIcon, PlusIcon, Trash01Icon, UploadCloud02Icon, Users01Icon, Users04Icon } from '@assets/iconComponents';
import { Badge, Card } from '@mantine/core';
import { CoTenantForm } from './CoTenantFroms';
import { Dropzone } from '@mantine/dropzone';
import { useState } from 'react';
import { CoTeanantDetailsForm } from './schema';

const tenantData = [
  {
    name: 'Corey Smith',
    email: 'corey@email.com',
    phone: '212-111-2323',
    badge: 'Primary tenant',
  },
  {
    name: 'Corey Smith',
    email: 'corey@email.com',
    phone: '212-111-2323',
    badge: 'Co-tanent',
  },
];
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
export function TenantDetails() {
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
      {tenantData.map((property) => (
        <Card
          classNames={{
            root: 'flex px-4 gap-1 w-full flex-row items-start flex-0 rounded-[12px] border-[1px] border-solid border-Gray-200 bg-white drop-shadow-xs',
          }}
        >
          <div className="flex items-center gap-4 flex-0">
            <span className="flex h-14 w-14  rounded-[9999px] border-[8px] border-solid border-Brand-50 bg-Brand-100">
              <span className="h-full flex w-full p-2 ustify-center items-center flex-0">
                <Users04Icon />
              </span>
            </span>
            <div className="flex flex-col gap-0.5 items-start flex-0">
              <div className="flex gap-1.5 items-start">
                <span className="text-Gray-700 text-base font-medium leading-6">
                  {property.name}
                </span>
                <Badge
                  classNames={{
                    root: 'felx px-1.5 py-0.5 items-center rounded-[6px] border-[1px] border-solid border-Gray-200 bg-Gray-50',
                    label: 'text-Gray-700 text-center text-xs font-medium leading-18',
                  }}
                >
                  {property.badge}
                </Badge>
              </div>

              <span className="text-Gray-600 text-base font-normal leading-6">{property.phone}</span>
              <span className="text-Gray-600 text-sm font-normal leading-6">{property.email}</span>
            </div>
          </div>
          <div className="flex items-start justify-end">
            <div className="flex p-1 justify-center items-center gap-2 rounded-[8px]">
              <Edit01Icon width={20} />
            </div>
            {property.badge !== 'Primary tenant' && (
                <div className="flex p-1 justify-center items-center gap-2 rounded-[8px]">
              <Trash01Icon />
            </div>
            )}
            
          </div>
        </Card>
      ))}
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
