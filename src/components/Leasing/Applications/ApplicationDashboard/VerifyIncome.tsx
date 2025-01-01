import {
  ArrowDown,
  CheckIcon03,
  Delete01,
  Edit01Icon,
  JpgIcon,
  PdfIcon,
  SkipInfoIcon,
  SvgDefaultUser01,
  UploadCloud02Icon,
  SaveIcon,
} from '@assets/iconComponents';
import { Badge, Button, Modal, Select } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import CustomInput from '@utils/CustomInput';
import { useForm, } from 'react-hook-form';
import { incomeVerificationSchema } from './schema';
import { yupResolver } from '@hookform/resolvers/yup';
import {  useState } from 'react';

interface Props {
  open: boolean;
  close: (value: boolean) => void;
}

interface Verification {
  monthlyIncome: string;
  sourceOfIncome: string;
  documents: File[];
}

const initialValues = {
  monthlyIncome: '',
  sourceOfIncome: '',
  documents: [],
};

function VerifyIncome({ open, close }: Props) {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
    reset,
    clearErrors,
  } = useForm({
    resolver: yupResolver(incomeVerificationSchema),
    defaultValues: initialValues,
  });

  const documents = watch(`documents`);
  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedVerifications = [...verifications];
    updatedVerifications[index] = {
      ...updatedVerifications[index],
      [field]: value,
    };
    setVerifications(updatedVerifications);
  };
  const handleEditClick = (index: number) => {
    setEditingIndex(index);
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

  const addField = async () => {
    await handleSubmit(onSubmit)();
  };
  const onSubmit = async () => {
    const isValid = await trigger();
    if (!isValid) {
      return;
    }
    const data = watch();

    const newVerification = {
      monthlyIncome: data.monthlyIncome,
      sourceOfIncome: data.sourceOfIncome,
      documents: (watch(`documents`) || []).filter((file) => file !== undefined) as File[],
    };
    setVerifications([...verifications, newVerification]);
    reset();
  };

  const handleDropForIndex = (index: number) => (acceptedFiles: File[]) => {
    const updatedVerifications = [...verifications];
    updatedVerifications[index] = {
      ...updatedVerifications[index],
      documents: [...updatedVerifications[index].documents, ...acceptedFiles],
    };
    setVerifications(updatedVerifications);
  };

  const handleDeleteForIndex = (index: number) => (file: File) => {
    const updatedVerifications = [...verifications];
    updatedVerifications[index] = {
      ...updatedVerifications[index],
      documents: updatedVerifications[index].documents.filter(
        (value: File) => value.name !== file.name
      ),
    };
    setVerifications(updatedVerifications);
  };
  return (
    <div>
      <Modal
        size={'lg'}
        classNames={{
          title: 'text-brand-960 font-semibold text-lg',
          content: 'rounded-xl modal-scroll h-full',
          header: 'w-24 float-right bg-transparent absolute top-0 right-0',
          body: 'px-8 pb-5 ',
          close: 'text-gray-400 ',
        }}
        opened={open}
        onClose={() => close(false)}
      >
      <div className="w-full max-w-full  bg-[url(/src/assets/patterns/linesbg.svg)]  bg-no-repeat relative bg-top">
          <div className="text-center pt-6">
            <SkipInfoIcon className="mt-1" />
          </div>
          <div className="text-2xl font-semibold text-center mt-6">Verify income</div>
          {verifications.map((data, index) => (
            <div
              key={index}
              className={`border-solid border ${
                data.sourceOfIncome === 'Select1'
                  ? ' border-success-600'
                  : data.sourceOfIncome === 'Select2'
                    ? 'border-error-600'
                    : 'border-[#DC6803]'
              } border-[1px] rounded-[12px] p-4 mt-6`}
            >
              <div className="flex justify-between">
                <div className="flex">
                  <div className="items-center self-center me-4">
                    <SvgDefaultUser01 className="col-span-1" />
                  </div>
                  <div className="self-center">
                    <div className="text-base font-medium leading-6 text-gray-700 flex items-center">
                      <span className="text-ellipsis max-w-32 whitespace-nowrap overflow-hidden">
                        Calvin Brown
                      </span>
                      <Badge
                        classNames={{
                          root: 'ms-1 bg-Gray-200 rounded-[6px] border border-gray-300 border-solid border-[1px] drop-shadow-xs',
                          label:
                            'text-xs font-medium leading-11 text-gray-700 capitalize whitespace-nowrap overflow-hidden',
                        }}
                        variant="light"
                        className="h-3.2"
                      >
                        Primary tenant
                      </Badge>
                    </div>
                    <div className="font-normal text-base leading-6 text-gray-600">
                      212-212-1100
                    </div>
                    <div className="font-normal text-base leading-6 text-gray-600 mt-0.5">
                      calvin@email.com
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-700">
                    Monthly income: {data.monthlyIncome}
                  </div>
                  <div className="flex items-center mt-2 justify-end">
                   {data.sourceOfIncome === 'Select1' && <CheckIcon03 className="size-5" />}
                    {data.sourceOfIncome === 'Select1' ? (
                      <div className="text-success-700 text-sm ms-2 font-semibold">Verified</div>
                    ) : data.sourceOfIncome === 'Select2' ? (
                      <div className="text-error-700 text-sm ms-2 font-semibold">Verification failled</div>
                    ) : (
                      <div className="text-[#B54708] text-sm ms-2 font-semibold">Unverified</div>
                    )}
                  </div>
                  <div className="text-end mt-2">
                    {editingIndex === index ? (
                      <SaveIcon
                        className="cursor-pointer"
                        onClick={() => {
                          setEditingIndex(null);
                        }}
                      />
                    ) : (
                      <Edit01Icon
                        className="text-gray-700 cursor-pointer h-5 w-5"
                        onClick={() => handleEditClick(index)}
                      />
                    )}
                  </div>
                </div>
              </div>
              {editingIndex === index && (
                <>
                  <div className="text-sm font-medium rounded-[8px] leading-5 flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
                    Update income
                  </div>
                  <fieldset className="mt-6 grid-cols-2 grid gap-6">
                    <div>
                      <CustomInput
                        label="Monthly income*"
                        placeholder="Enter income"
                        value={data?.monthlyIncome || ''}
                        onChange={(e) => handleInputChange(index, 'monthlyIncome', e.target.value)}
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
                        value={data?.sourceOfIncome || ''}
                        onChange={(value) =>
                          handleInputChange(index, 'sourceOfIncome', value ?? '')
                        }
                        onBlur={() => trigger('sourceOfIncome')}
                        error={errors.sourceOfIncome?.message}
                      />
                    </div>
                  </fieldset>

                  <div className="text-sm font-normal text-Gray-600 text-center px-12 leading-5 my-6">
                    Upload last 2 paystubs or any other recent proof of income showing monthly
                    income *2 of rent
                  </div>

                  <Dropzone
                    multiple={true}
                    onDrop={handleDropForIndex(index)}
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
                          </span>
                          <span className="text-sm font-normal text-Gray-600 leading-5">
                            {' '}
                            or drag and drop
                          </span>
                        </div>
                        <div className="text-xs font-normal text-Gray-600 leading-5">
                          SVG, PNG, JPG or GIF (max. 800x400px)
                        </div>
                      </div>
                    </div>
                  </Dropzone>

                  {data.documents && (
                    <div className="grid-cols-2 grid gap-6 mt-6">
                      {data.documents.length > 0 &&
                        data.documents.map((file: File | undefined, docIndex: number) => (
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
                            {file && (
                              <Delete01
                                onClick={() => handleDeleteForIndex(index)(file)}
                                className="text-gray-700 cursor-pointer"
                              />
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

          <div className="">
            <fieldset className="mt-6 grid-cols-2 grid gap-6">
              <div>
                <CustomInput
                  label="Monthly income*"
                  placeholder="Enter income"
                  {...register(`monthlyIncome`)}
                  error={errors.monthlyIncome?.message}
                  onBlur={() => trigger('monthlyIncome')}
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
                  {...register(`sourceOfIncome`)}
                  error={errors.sourceOfIncome?.message}
                  onBlur={() => trigger('sourceOfIncome')}
                  onChange={(value) => {
                    setValue(`sourceOfIncome`, value || '');
                    clearErrors(`sourceOfIncome`);
                  }}
                />
              </div>
            </fieldset>

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
                    </span>
                    <span className="text-sm font-normal text-Gray-600 leading-5">
                      {' '}
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
              <div className="grid-cols-2 grid gap-6 mt-2">
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
            <div className="flex justify-end mb-2">
              <Button onClick={addField} variant="subtle" className="text-Brand-700">
                Add
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center ">
            <Button
              variant="outline"
              className=" w-48 border-gray-300 text-gray-700 rounded-lg h-10"
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
        </div>
      </Modal>
    </div>
  );
}

export default VerifyIncome;
