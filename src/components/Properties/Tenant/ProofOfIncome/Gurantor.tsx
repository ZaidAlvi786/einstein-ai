import {
  ArrowDown,
  Delete01,
  Edit01Icon,
  EmailIcon02,
  JpgIcon,
  PdfIcon,
  SvgDefaultUser01,
  UploadCloud02Icon,
} from '@assets/iconComponents';
import { Badge, Button, Select } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import CustomInput from '@utils/CustomInput';
import React, { useState } from 'react';
import { gurantor, GurantorForm } from '../schema';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { formatFileSize } from '@utils/formatFileSize';

interface Props {
  showGuarantor: boolean;
  setShowGuarantor: (value: boolean) => void;
  showGurantorFields: boolean;
  setShowGurantorFields: (value: boolean) => void;
}

const Gurantor = ({
  showGuarantor,
  setShowGuarantor,
  showGurantorFields,
  setShowGurantorFields,
}: Props) => {
  const [coTenantFiles, setCoTenantFiles] = useState<File[]>([]);
  const [cotenantList, setCoTenantList] = useState<GurantorForm[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    ...form
  } = useForm({
    resolver: yupResolver(gurantor),
    // defaultValues: initialValues,
  });

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
      if (type == 'co-tenant') {
        setCoTenantFiles((prevFiles) => [...prevFiles, ...filteredFiles]);
      }
    }
  };
  const handleDelete = ({ file, type }: any) => {
    if (type == 'co-tenant') {
      setCoTenantFiles((prevFiles) => prevFiles.filter((value) => value.name !== file.name));
    }
  };

  const onSubmit = (values: GurantorForm) => {
    reset();
    if (editIndex !== null) {
      const updatedList = [...cotenantList];
      updatedList[editIndex] = values;
      setCoTenantList(updatedList);
      setEditIndex(null);
    } else {
      setCoTenantList([...cotenantList, values]);
    }
    setShowGurantorFields(false);
  };
  const handleEdit = (index: number) => {
    const coTenant = cotenantList[index];
    setEditIndex(index);
    setShowGurantorFields(true);
    reset(coTenant);
  };

  const handleCancel = () => {
    if (cotenantList.length === 0) {
      setShowGuarantor(false);
    } else {
      setShowGurantorFields(false);
    }
  };
  return (
    <>
      <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
        Guarantor
      </div>
      {cotenantList?.length > 0 &&
        cotenantList.map((tenant, index) => (
          <div
            className="border-solid border border-Gray-200 shadow-xs  border-[1px] rounded-[12px] p-4  h-30 m-h-30"
            key={index}
          >
            <div className="flex justify-between">
              <div className="flex">
                <div className="items-center self-center me-4">
                  <SvgDefaultUser01 className="col-span-1 " />
                </div>
                <div className="self-center">
                  <div className="text-base	font-medium	leading-6	text-gray-700  flex items-center ">
                    <span className="text-ellipsis max-w-38 whitespace-nowrap overflow-hidden">
                      Sales rep
                      <span> at </span>
                      <span>T-Moible</span>
                    </span>
                    <Badge
                      classNames={{
                        root: 'ms-1 bg-Gray-200 rounded-[6px] border border-Gray-200 border-solid  border-[1px] drop-shadow-xs',
                        label:
                          'text-xs font-medium	leading-11 text-gray-700 capitalize  whitespace-nowrap overflow-hidden',
                      }}
                      variant="light"
                      className="h-3.2"
                    >
                      {tenant.sourceOfIncome}
                    </Badge>
                  </div>
                  <div className="font-normal	text-base	leading-6	text-gray-600">
                    {' '}
                    {tenant.monthlyIncome}/month - 2 years
                  </div>
                  <div className="font-normal	text-base	leading-6 text-gray-600 mt-0.5">
                    Refrence John Leaver
                  </div>
                </div>
              </div>
              <div className="pe-1 py-1">
                <Edit01Icon
                  className="text-gray-700 cursor-pointer h-5 w-5"
                  onClick={() => handleEdit(index)}
                />
              </div>
            </div>
          </div>
        ))}

      {showGurantorFields && (
        <>
          <fieldset className="grid-cols-2 grid gap-6 ">
            <CustomInput
              label="First name*"
              placeholder="Enter first name"
              {...register('firstName')}
              error={errors.firstName?.message}
            />
            <CustomInput
              label="Last name*"
              placeholder="Enter last name"
              {...register('lastName')}
              error={errors.lastName?.message}
            />
            <CustomInput
              leftSection={<EmailIcon02 className="size-5" />}
              label="Email address"
              placeholder="Email address"
              {...register('email')}
              error={errors.email?.message}
            />
            <CustomInput
              label="Phone number"
              placeholder="Enter phone number"
              {...register('phoneNumber')}
              error={errors.phoneNumber?.message}
            />
            <CustomInput
              label="Monthly income*"
              placeholder="000-00-0000"
              {...register('monthlyIncome')}
              error={errors.monthlyIncome?.message}
            />

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
              data={[
                'Full time',
                'Part time',
                'Self employed',
                'Investment',
                'Gov.benefits',
                'Others',
              ]}
              {...register('sourceOfIncome')}
                    onChange={(_value, option) => {
                      form.clearErrors('sourceOfIncome');
                      form.setValue('sourceOfIncome', option.value);
                    }}
                    error={errors.sourceOfIncome?.message}
                    onBlur={() => form.trigger('sourceOfIncome')}
            />
          </fieldset>

          <div className="text-sm font-normal text-Gray-600 text-center w-3/4  mx-auto px-6 leading-5">
            Upload last 2 paystubs or any other recent prooof of income showing monthly income *2 of
            rent
          </div>
          <Dropzone
            multiple={true}
            // accept={IMAGE_MIME_TYPE}
            onDrop={(newfiles) => handleDrop({ newfiles, type: 'co-tenant' } as any)}
            onReject={() => {}}
            maxSize={5 * 1024 ** 2}
            className=" border border-solid border-Gray-200 shadow-xs border-[2px] rounded-[12px] py-4 px-6 cursor-pointer  "
          >
            <div className="flex items-center justify-center ">
              <div className="flex items-center justify-center  border-Gray-200 shadow-xs rounded-[8px] border-solid border border-[1px] w-10 h-10 me-2.5">
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
          <div className="grid-cols-2 grid gap-5">
            {coTenantFiles.length > 0 &&
              coTenantFiles.map((file, index) => (
                <div
                  className="flex justify-between border border-solid border-Gray-200 shadow-xs border-[2px] rounded-[12px] py-4 px-6 cursor-pointer"
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

      <div className="flex justify-end ">
        <Button variant="subtle" className="text-Brand-700" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="subtle" className="text-Brand-700" onClick={handleSubmit(onSubmit)}>
          Add
        </Button>
      </div>
      </>
      )}

    </>
  );
};

export default Gurantor;
