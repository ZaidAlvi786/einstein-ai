import {
  Delete01,
  JpgIcon,
  PdfIcon,
  SkipInfoIcon,
  SvgDefaultUser01,
  UploadCloud02Icon,
} from '@assets/iconComponents';
import { Badge, Button, Modal } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { useForm } from 'react-hook-form';
import { incomeVerificationIdSchema } from './schema';
import { yupResolver } from '@hookform/resolvers/yup';

interface Props {
  open: boolean;
  close: (value: boolean) => void;
}

const initialValues = {
  documents: [],
};

function VerifyId({ open, close }: Props) {
  const {
    watch,
    setValue,
    clearErrors,
  } = useForm({
    resolver: yupResolver(incomeVerificationIdSchema),
    defaultValues: initialValues,
  });
  const documents = watch(`documents`);

  const formatFileSize = (bytes: number | undefined): string => {
    if (bytes && bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    } else if (bytes) {
      return (bytes / 1024).toFixed(2) + ' KB';
    } else {
      return '';
    }
  };

  const handleDrop = () => (files: File[]) => {
    const acceptedTypes = [
      'image/png',
      'image/jpeg',
      'image/gif',
      'image/svg+xml',
      'application/pdf',
    ];
    const filteredFiles = files.filter((file) => acceptedTypes.includes(file.type));

    if (filteredFiles.length > 0) {
      clearErrors(`documents`);
      const updatedFiles = [...(watch(`documents`) || []), ...filteredFiles];
      setValue(`documents`, updatedFiles);
    }
  };

  const handleDelete = (file: File | undefined) => {
    if (file) {
      const updatedFiles = (watch(`documents`) || []).filter(
        (value: File | undefined) => value?.name !== file.name
      );
      setValue(`documents`, updatedFiles);
    }
  };

  return (
    <div>
      <Modal
        size={'lg'}
        classNames={{
          title: 'text-brand-960 font-semibold text-lg',
          content: 'rounded-xl modal-scroll',
          header: 'w-24 float-right bg-transparent absolute top-0 right-0',
          body: 'px-8 pb-5 h-full',
          close: 'text-gray-400 ',
        }}
        opened={open}
        onClose={() => close(false)}
      >
        <div className="w-full max-w-full  bg-[url(/src/assets/patterns/linesbg.svg)]  bg-no-repeat relative bg-top">
          <div className="text-center pt-6">
            <SkipInfoIcon className="mt-1" />
          </div>
          <div className="text-2xl font-semibold text-center mt-6">Verify ID</div>
          <div className="border-solid border border-gray-960  border-[1px] rounded-[12px] p-4  h-30 m-h-30 mt-6">
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
          <div className="">
            <div className="text-sm font-normal text-Gray-600 text-center px-12 leading-5 my-6">
              Upload last 2 paystubs or any other recent proof of income showing monthly income *2
              of rent
            </div>

            <Dropzone
              multiple={true}
              onDrop={handleDrop()}
              onReject={() => {}}
              maxSize={5 * 1024 ** 2}
              className="border border-solid border-gray-960 border-[2px] rounded-[12px] py-4 px-6 cursor-pointer"
            >
              <div className="flex items-center justify-center">
                <div className="flex items-center justify-center border-gray-960 rounded-[8px] border-solid border border-[1px] w-10 h-10 me-2.5">
                  <UploadCloud02Icon className="!w-4 !h-4 !color-Gray-600" />
                </div>
                <div>
                  <div>
                    <span className="text-sm font-semibold text-Brand-700 leading-5">
                      Click to upload
                    </span>{' '}
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

            {documents && (
              <div className="grid-cols-2 grid gap-6 my-6">
                {documents.length > 0 &&
                  documents.map(
                    (file: File | undefined, index: number, array: (File | undefined)[]) => (
                      <div
                        key={file?.name}
                        className="flex justify-between border border-solid border-gray-960 border-[2px] rounded-[12px] py-4 px-6 cursor-pointer"
                      >
                        <div className="flex gap-3">
                          {file?.type === 'application/pdf' ? <PdfIcon /> : <JpgIcon />}
                          <div>
                            <div className="text-sm font-medium leading-5 text-Gray-700">
                              {file?.name}
                            </div>
                            <div className="text-sm font-normal leading-5 text-Gray-600">
                              {formatFileSize(file?.size)}
                            </div>
                          </div>
                        </div>
                        <Delete01
                          onClick={() => handleDelete(file)}
                          className="text-gray-700 cursor-pointer"
                        />
                      </div>
                    )
                  )}
              </div>
            )}
          </div>


          <div className="border-solid border border-gray-960  border-[1px] rounded-[12px] p-4  h-30 m-h-30 mt-6">
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
          <div className="">
            <div className="text-sm font-normal text-Gray-600 text-center px-12 leading-5 my-6">
              Upload last 2 paystubs or any other recent proof of income showing monthly income *2
              of rent
            </div>

            <Dropzone
              multiple={true}
              onDrop={handleDrop()}
              onReject={() => {}}
              maxSize={5 * 1024 ** 2}
              className="border border-solid border-gray-960 border-[2px] rounded-[12px] py-4 px-6 cursor-pointer"
            >
              <div className="flex items-center justify-center">
                <div className="flex items-center justify-center border-gray-960 rounded-[8px] border-solid border border-[1px] w-10 h-10 me-2.5">
                  <UploadCloud02Icon className="!w-4 !h-4 !color-Gray-600" />
                </div>
                <div>
                  <div>
                    <span className="text-sm font-semibold text-Brand-700 leading-5">
                      Click to upload
                    </span>{' '}
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

            {documents && (
              <div className="grid-cols-2 grid gap-6 my-6">
                {documents.length > 0 &&
                  documents.map(
                    (file: File | undefined, index: number, array: (File | undefined)[]) => (
                      <div
                        key={file?.name}
                        className="flex justify-between border border-solid border-gray-960 border-[2px] rounded-[12px] py-4 px-6 cursor-pointer"
                      >
                        <div className="flex gap-3">
                          {file?.type === 'application/pdf' ? <PdfIcon /> : <JpgIcon />}
                          <div>
                            <div className="text-sm font-medium leading-5 text-Gray-700">
                              {file?.name}
                            </div>
                            <div className="text-sm font-normal leading-5 text-Gray-600">
                              {formatFileSize(file?.size)}
                            </div>
                          </div>
                        </div>
                        <Delete01
                          onClick={() => handleDelete(file)}
                          className="text-gray-700 cursor-pointer"
                        />
                      </div>
                    )
                  )}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center mt-10">
          <Button
            variant="outline"
            className=" w-48	border-gray-300 text-gray-700 rounded-lg h-10"
            onClick={() => close(false)}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            className="border-gray-300 ms-3 w-52	 text-gray-700 rounded-lg h-10"
          >
            Send link to prospect
          </Button>
          <Button className="w-48	 rounded-[8px] hover:bg-brand-970 bg-brand-960 text-base font-semibold ms-3 h-10">
            Verify
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default VerifyId;
