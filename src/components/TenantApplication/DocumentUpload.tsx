import { Delete01, JpgIcon, PdfIcon, UploadCloud02Icon } from '@assets/iconComponents';
import { Dropzone } from '@mantine/dropzone';
import { formatFileSize } from '@utils/formatFileSize';
import { useState } from 'react';

export const DocumnetUpload = () => {
  const [tenantFiles, setTenantFiles] = useState<File[]>([]);
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
      <Dropzone
        multiple={true}
        // accept={IMAGE_MIME_TYPE}
        onDrop={(newfiles) => handleDrop({ newfiles, type: 'tenant' } as any)}
        onReject={() => {}}
        maxSize={5 * 1024 ** 2}
        className="border-solid border-Gray-200 shadow-xs border-[1px] rounded-[12px] py-4 px-6 cursor-pointer  "
      >
        <div className="flex items-center justify-center ">
          <div className="flex items-center justify-center border-Gray-200 shadow-xs rounded-[8px] border-solid border-[1px] w-10 h-10 me-2.5">
            <UploadCloud02Icon className="!w-4 !h-4 !color-Gray-600" />
          </div>
          <div>
            <div>
              <span className="text-sm font-semibold text-Brand-700 leading-5">
                Click to upload
              </span>
              <span className="text-sm font-normal text-Gray-600 leading-5">or drag and drop</span>
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
              className="flex justify-between border-solid border-Gray-200 border-[1px] rounded-[12px] py-4 px-6 cursor-pointer"
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
    </>
  );
};