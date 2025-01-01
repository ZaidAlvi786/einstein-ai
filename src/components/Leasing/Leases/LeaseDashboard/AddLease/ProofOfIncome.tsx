import React, { useEffect, useState } from 'react';
// import { StepButtons } from './StepButtons';
import CustomInput from '@utils/CustomInput';
import {
  AlertErrorIcon,
  ArrowDown,
  DateIcon,
  Delete01,
  Edit01Icon,
  EmailIcon02,
  JpgIcon,
  Notificationicon,
  PdfIcon,
  PlusIcon,
  SvgDefaultUser01,
  UploadCloud02Icon,
  Users01Icon,
} from '@assets/iconComponents';
import { Dropzone } from '@mantine/dropzone';
import { useSelector } from 'react-redux';
import { RootState } from '@stores/index';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Badge, Button, Checkbox, Select } from '@mantine/core';
import clsx from 'clsx';
import StepButtons from './StepButtons';
// import { proofOfIncome, ProofOfIncomeLandlord, tenantIdentification } from './schema';
// import Gurantor from './ProofOfIncome/Gurantor';
// import LandLordStates from './ProofOfIncome/LandLordStates';
import { formatFileSize } from '@utils/formatFileSize';
import { proofOfIncome } from './schema';

interface Props {
  step: number;
  handlers: {
    increment: () => void;
    decrement: () => void;
  };
}
interface TenantForm {
  tenantMonthlyIncome: string;
  tenantSourceOfIncom: string;
}
interface CoTenantForm {
  cotenantMonthlyIncome: string;
  cotenantSourceOfIncom: string;
}
const ProofOfIncome = ({ step, handlers }: Props) => {
  const { newTenent } = useSelector((state: RootState) => state?.addTenent);
  const [landLordStatement, setLandlordStatemet] = useState(false);
  const [showGuarantor, setShowGuarantor] = useState(false);
  const [showGurantorFields, setShowGurantorFields] = useState(false);

  const [tenantFiles, setTenantFiles] = useState<File[]>([]);
  const [coTenantFiles, setCoTenantFiles] = useState<File[]>([]);

  const [tenantList, setTenantList] = useState<TenantForm[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showFields, setshowfields] = useState(true);
  const [cotenantList, setCoTenantList] = useState<CoTenantForm[]>([]);
  const [editIndexCotenent, setEditIndexCotenant] = useState<number | null>(null);
  const [showCotenetFields, setShowCotenentFields] = useState(true);

  const methods = useForm({
    resolver: yupResolver(proofOfIncome),
    // defaultValues: initialValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    getValues,
    ...form
  } = methods;


  const handleEdit = (index: number) => {
    const tenant = tenantList[index];
    setEditIndex(index);
    setshowfields(true);
    // form.reset(tenant);
  };

  const handleContinue = async () => {
    await handleSubmit(onSubmit)();
    // handlers.increment();
  };

  const onSubmit = async (data: any) => {
    if (!isValid) {
      return;
    }
    handlers.increment();
    console.log(data, 'data step3');
  };

  const handleCancel = () => {
    form.clearErrors();
    handlers.decrement();
  };

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
      <div className=" grid gap-6 p-6">
        <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
          Proof of income
        </div>
        <div className="flex justify-revert items-center border border-solid border-error-300 border-[1px] rounded-[12px] cursor-pointer h-13 font-semibold text-sm p-1.5">
          <AlertErrorIcon className="me-3" /> Monthly income is not yet verified, in order to
          proceed with the QTG, income must be verified
        </div>

        {!landLordStatement && (
          <>
            {tenantList?.length > 0 &&
              tenantList.map((tenant, index) => (
                <div
                  className="border-solid borderborder-gray-200 shadow-xs  border-[1px] rounded-[12px] p-4  h-30 m-h-30"
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
                            {tenant.tenantSourceOfIncom}
                          </Badge>
                        </div>
                        <div className="font-normal	text-base	leading-6	text-gray-600">
                          {' '}
                          {tenant.tenantMonthlyIncome}/month - 2 years
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
            {showFields && (
              <>
                <fieldset className="grid-cols-2 grid gap-6 ">
                  <CustomInput
                    label="Monthly income*"
                    placeholder="000-00-0000"
                    {...register('monthlyIncome')}
                    error={errors.monthlyIncome?.message}
                    onBlur={() => form.trigger('monthlyIncome')}
                    onChange={(e) => {
                      form.clearErrors('monthlyIncome');
                      form.setValue('monthlyIncome', e.target.value);
                    }}
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
                    {...register('sourceOfIncom')}
                    onChange={(_value, option) => {
                      form.clearErrors('sourceOfIncom');
                      form.setValue('sourceOfIncom', option.value);
                    }}
                    error={errors.sourceOfIncom?.message}
                    onBlur={() => form.trigger('sourceOfIncom')}
                  />
                </fieldset>
                <div className="text-sm font-normal text-Gray-600 text-center w-3/4  mx-auto px-6 leading-5">
                  Upload last 2 paystubs or any other recent prooof of income showing monthly income
                  *2 of rent
                </div>

                <Dropzone
                  multiple={true}
                  // accept={IMAGE_MIME_TYPE}
                  onDrop={(newfiles) => handleDrop({ newfiles, type: 'tenant' } as any)}
                  onReject={() => {}}
                  maxSize={5 * 1024 ** 2}
                  className=" border border-solid border-Gray-200 shadow-xs border-[1px] rounded-[12px] py-4 px-6 cursor-pointer  "
                >
                  <div className="flex items-center justify-center ">
                    <div className="flex items-center justify-center border-Gray-200 shadow-xs rounded-[8px] border-solid border border-[1px] w-10 h-10 me-2.5">
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
                  {tenantFiles.length > 0 &&
                    tenantFiles.map((file, index) => (
                      <div
                        className="flex justify-between border border-solid border-Gray-200 border-[1px] rounded-[12px] py-4 px-6 cursor-pointer"
                        key={index}
                      >
                        <div className="flex gap-3">
                          {/* {file.type=="image/jpeg" && <JpgIcon />} */}
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
                            handleDelete({ file, type: 'tenant' });
                          }}
                        />
                      </div>
                    ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
      <StepButtons
        step={step}
        handlers={handlers}
        handleContinue={handleContinue}
        handleCancel={handleCancel}
      />
    </>
  );
};

export default ProofOfIncome;
