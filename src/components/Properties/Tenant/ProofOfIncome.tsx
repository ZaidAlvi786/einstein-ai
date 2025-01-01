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
import { proofOfIncome, ProofOfIncomeLandlord, tenantIdentification } from './schema';
import Gurantor from './ProofOfIncome/Gurantor';
import LandLordStates from './ProofOfIncome/LandLordStates';
import { formatFileSize } from '@utils/formatFileSize';

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

  useEffect(()=>{
form.setValue('landlordStatement',landLordStatement)
  },[landLordStatement]);
  
  const handleAddTenant = async () => {
    const tenantMonthlyIncome = watch('tenantMonthlyIncome');
    const tenantSourceOfIncom = watch('tenantSourceOfIncom');
    if (!tenantMonthlyIncome) {
      form.setError('tenantMonthlyIncome', {
        type: 'manual',
        message: 'Monthly income is required',
      });
      return;
    }
    if (!tenantSourceOfIncom) {
      form.setError('tenantSourceOfIncom', {
        type: 'manual',
        message: 'Source of income is required',
      });
      return;
    }
    const values = { tenantMonthlyIncome, tenantSourceOfIncom };
    setshowfields(false);
    if (editIndex !== null) {
      const updatedList = [...tenantList];
      updatedList[editIndex] = values;
      setTenantList(updatedList);
      setEditIndex(null);
    } else {
      setTenantList([...tenantList, values]);
    }
    console.log(tenantMonthlyIncome, 'mmmmmmmmmmmmmmmmmmmmmmmm', tenantSourceOfIncom);
  };
  const handleEdit = (index: number) => {
    const tenant = tenantList[index];
    setEditIndex(index);
    setshowfields(true);
    // form.reset(tenant);
  };

  const handleAddCoTenant = async () => {
    const cotenantMonthlyIncome = watch('cotenantMonthlyIncome');
    const cotenantSourceOfIncom = watch('cotenantSourceOfIncom');
    if (!cotenantMonthlyIncome) {
      form.setError('cotenantMonthlyIncome', {
        type: 'manual',
        message: 'Monthly income is required',
      });
      return;
    }
    if (!cotenantSourceOfIncom) {
      form.setError('cotenantSourceOfIncom', {
        type: 'manual',
        message: 'Source of income is required',
      });
      return;
    }
    const values = { cotenantMonthlyIncome, cotenantSourceOfIncom };
    if (editIndexCotenent !== null) {
      const updatedList = [...cotenantList];
      updatedList[editIndexCotenent] = values;
      setCoTenantList(updatedList);
      setEditIndexCotenant(null);
    } else {
      setCoTenantList([...cotenantList, values]);
    }
    setShowCotenentFields(false);
  };

  const handleCotenentEdit = (index: number) => {
    const cotenant = cotenantList[index];
    setEditIndexCotenant(index);
    setShowCotenentFields(true);
    // form.reset(cotenant);
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
        {newTenent && (
          <div className="flex justify-revert items-center border border-solid border-error-300 border-[1px] rounded-[12px] cursor-pointer h-13 font-semibold text-sm p-1.5">
            <AlertErrorIcon className="me-3" /> Monthly income is not yet verified, in order to
            proceed with the QTG, income must be verified
          </div>
        )}
        <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
          Proof of income
        </div>

        <div className="bg-white border border-solid border-[1px] border-Gray-blue-300 rounded-[12px] flex ">
          <div className="p-2.5 pe-2">
            <Notificationicon className="" />
          </div>
          <div className=" grid gap-3  py-4 pe-4 ps-0">
            <div>
              <div className="text-Gray-700 text-sm font-semibold leading-5">
                Veify monthly income
              </div>
              <div className="mt-0.5 text-Gray-600 text-sm  font-normal  leading-5">
                Tenant is resding on property 3 months or less. In odred to be enrolled in the QTG
                program, you need to submit proof of income of 2* on monthly rent.
              </div>
            </div>
          </div>
        </div>

        {landLordStatement && <LandLordStates
        methods={methods}
        />
        }
        {!landLordStatement && (
          <>
            <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
              Primary tenant
            </div>
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
                    {...register('tenantMonthlyIncome')}
                    error={errors.tenantMonthlyIncome?.message}
                    onBlur={() => form.trigger('tenantMonthlyIncome')}
                    onChange={(e) => {
                      form.clearErrors('tenantMonthlyIncome');
                      form.setValue('tenantMonthlyIncome', e.target.value);
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
                    {...register('tenantSourceOfIncom')}
                    onChange={(_value, option) => {
                      form.clearErrors('tenantSourceOfIncom');
                      form.setValue('tenantSourceOfIncom', option.value);
                    }}
                    error={errors.tenantSourceOfIncom?.message}
                    onBlur={() => form.trigger('tenantSourceOfIncom')}
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
                <div className="flex justify-end ">
                  <Button variant="subtle" className="text-Brand-700" onClick={handleAddTenant}>
                    Add
                  </Button>
                </div>
              </>
            )}

            <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
              Co-tenant
            </div>
            {cotenantList?.length > 0 &&
              cotenantList.map((tenant, index) => (
                <div
                  className="border-solid border border-Gray-200 shadow-xs border-[1px] rounded-[12px] p-4  h-30 m-h-30"
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
                            {tenant.cotenantSourceOfIncom}
                          </Badge>
                        </div>
                        <div className="font-normal	text-base	leading-6	text-gray-600">
                          {' '}
                          {tenant.cotenantMonthlyIncome}/month - 2 years
                        </div>
                        <div className="font-normal	text-base	leading-6 text-gray-600 mt-0.5">
                          Refrence John Leaver
                        </div>
                      </div>
                    </div>
                    <div className="pe-1 py-1">
                      <Edit01Icon
                        className="text-gray-700 cursor-pointer h-5 w-5"
                        onClick={() => handleCotenentEdit(index)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            {showCotenetFields && (
              <>
                <fieldset className="grid-cols-2 grid gap-6 ">
                  <CustomInput
                    label="Monthly income*"
                    placeholder="000-00-0000"
                    {...register('cotenantMonthlyIncome')}
                    error={errors.cotenantMonthlyIncome?.message}
                    onBlur={() => form.trigger('cotenantMonthlyIncome')}
                    onChange={(e) => {
                      form.clearErrors('cotenantMonthlyIncome');
                      form.setValue('cotenantMonthlyIncome', e.target.value);
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
                    {...register('cotenantSourceOfIncom')}
                    onChange={(_value, option) => {
                      form.clearErrors('cotenantSourceOfIncom');
                      form.setValue('cotenantSourceOfIncom', option.value);
                    }}
                    error={errors.cotenantSourceOfIncom?.message}
                    onBlur={() => form.trigger('cotenantSourceOfIncom')}
                  />
                </fieldset>

                <div className="text-sm font-normal text-Gray-600 text-center w-3/4  mx-auto px-6 leading-5">
                  Upload last 2 paystubs or any other recent prooof of income showing monthly income
                  *2 of rent
                </div>

                <Dropzone
                  multiple={true}
                  // accept={IMAGE_MIME_TYPE}
                  onDrop={(newfiles) => handleDrop({ newfiles, type: 'co-tenant' } as any)}
                  onReject={() => {}}
                  maxSize={5 * 1024 ** 2}
                  className=" border border-solid border-Gray-200 shadow-xs border-[1px] rounded-[12px] py-4 px-6 cursor-pointer  "
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
                        className="flex justify-between border border-solid border-Gray-200 border-[1px] rounded-[12px] py-4 px-6 cursor-pointer"
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
                  <Button variant="subtle" className="text-Brand-700" onClick={handleAddCoTenant}>
                    Add
                  </Button>
                </div>
              </>
            )}
          </>
        )}

        {showGuarantor && (
          <Gurantor
            showGuarantor={showGuarantor}
            setShowGuarantor={setShowGuarantor}
            showGurantorFields={showGurantorFields}
            setShowGurantorFields={setShowGurantorFields}
          />
        )}

        <div
          className="bg-white border-solid border  border-Gray-200  border-[1px] shadow-xs rounded-[8px] flex items-center justify-center cursor-pointer m-h-17 h-17"
          onClick={() => {
            setShowGuarantor(true);
            setShowGurantorFields(true);
          }}
        >
          <div className="flex items-center justify-center text-brand-960 font-semibold text-lg">
            <Users01Icon className="me-3" /> Add a guarantor
            <PlusIcon className="ms-3" />
          </div>
        </div>
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
