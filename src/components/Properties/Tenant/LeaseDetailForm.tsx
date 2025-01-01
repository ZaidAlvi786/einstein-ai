import {
  ArrowDown,
  DateIcon,
  Delete01,
  JpgIcon,
  PdfIcon,
  UploadCloud02Icon,
} from '@assets/iconComponents';
import { Checkbox, Radio, Select, Switch } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import CustomInput from '@utils/CustomInput';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { leaseDetailSchema } from './schema';
import { useSelector } from 'react-redux';
import { RootState } from '@stores/index';
import StepButtons from './StepButtons';
import { yupResolver } from '@hookform/resolvers/yup';
import { formatFileSize } from '@utils/formatFileSize';

interface Props {
  step: number;
  handlers: {
    increment: () => void;
    decrement: () => void;
  };
}

const initialValues={ 
  enterleaseDetails:true,
  type:"",
  startDay:"",
  endDay: "",
  rent:"",
  moveInDate:"",
};
const LeaseDetailForm = ({  step, handlers }: Props) => {

  const  {newTenent}=useSelector((state:RootState)=>state?.addTenent);
  const [file, setFile] = useState<File | null>(null);
  const [qualityTenant, setQualityTenant] = useState(false);
  const [securityDeposit, setSecurityDeposit] = useState(false);
  const [applyFee, setApplyFee] = useState(false);
  const [moveInNow, setMoveInNow] = useState(true);
  const [enterLeaseDetail, setEnterLeaseDetail] = useState(true);
  const methods = useForm({
    resolver: yupResolver(leaseDetailSchema),
    defaultValues: initialValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    getValues,
    reset,
    ...form
  } = methods;
  const handleContinue = async () => {
    // handlers.increment();

    await handleSubmit(onSubmit)();
  };
  
  const onSubmit = async (data: any) => {
    if (!isValid) {
      return;
    }
    handlers.increment();
    console.log(data, 'data step2');
  };

  const handleCancel = () => {
    form.clearErrors();
      handlers.decrement();
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

  return (
    <div>
    <div className=" grid gap-6 p-6"> 
    {newTenent===true &&
      <div className="grid-cols-2 grid gap-5 ">
        <div
          onClick={() => {
            setMoveInNow(true);
            form.setValue("enterleaseDetails",true)
            form.clearErrors();
          }}
          className={clsx(
            'border border-solid border-Gray-200 border-[2px] rounded-[12px] p-4 cursor-pointer',
            moveInNow && '!border-brand-970 border-2'
          )}
        >
          <div className="flex  gap-3">
              <Radio
                checked={moveInNow}
                className="mt-1"
                classNames={{
                  body: 'items-center',
                  radio: clsx(moveInNow && '!bg-brand-970 !border-brand-970'),
                }}
              />
            <div>
              <div className="text-Gray-700 text-base font-medium">Move in now</div>
              <div className="mt-0.5 text-Gray-600 text-base font-normal">
                Tenant to be schlued to move in on property
              </div>
            </div>
          </div>
        </div>
        <div
          onClick={() => {
            setMoveInNow(false);
          }}
          className={clsx(
            ' border border-solid border-Gray-200 border-[2px] rounded-[12px] p-4 cursor-pointer',
            !moveInNow && '!border-brand-970 border-2'
          )}
        >
          <div className="flex  gap-3">
              <Radio
                checked={!moveInNow}
                className="mt-1"
                classNames={{
                  body: 'items-center',
                  radio: clsx(!moveInNow && '!bg-brand-970 !border-brand-970'),
                }}
              />
            <div>
              <div className="text-Gray-700 text-base font-medium">Scheduel move in</div>
              <div className="mt-0.5 text-Gray-600 text-base font-normal">
                Tenant is alredy resding at properrty
              </div>
            </div>
          </div>
        </div>
      </div>
}

      <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
        Lease details
      </div>
      {!moveInNow && (
        <div className="grid gap-5">
          <Switch
            classNames={{ track: 'h-5 w-9' }}
            onChange={() => {
              setEnterLeaseDetail(!enterLeaseDetail);
              form.setValue("enterleaseDetails",!enterLeaseDetail)
              form.clearErrors()
            }}
            checked={enterLeaseDetail}
            defaultChecked={enterLeaseDetail}
            label="Enter lease detailes"
          />
        </div>
      )}
      {!moveInNow && !enterLeaseDetail ? (
        <fieldset className="grid-cols-2 grid gap-6 ">
          <div>
            <CustomInput
              leftSection={<DateIcon className="size-5" />}
              label="Move in date"
              placeholder="Enter Date"
              {...register('moveInDate')}
              error={errors.moveInDate?.message}
            />
            <div
                className={clsx(
                  errors.moveInDate?.message ? 'mt-5' : 'mt-2',
                  'text-sm font-normal text-Gray-600 leading-5 '
                )}
              >
              [not the lease start day!]
            </div>
          </div>
        </fieldset>
      ) : (
        <>
          <fieldset className="grid-cols-3 grid gap-6 ">
            <div>
              <Select
                classNames={{
                  option: 'mb-0.5 rounded-[8px]',
                  dropdown: 'rounded-[8px] drop-shadow-lg shadow-lg',
                }}
                label="Lease type*"
                placeholder="Select"
                checkIconPosition="right"
                comboboxProps={{ dropdownPadding: 0 }}
                rightSection={<ArrowDown />}
                data={['Select1', 'Select2', 'Select3']}
                {...register('type')}
                onChange={(_value, option) => {
                  form.clearErrors('type');
                  form.setValue('type', option.value);
                }}
                error={errors.type?.message}
                onBlur={() => form.trigger('type')}
              />
              <div
                className={clsx(
                  errors.type?.message ? 'mt-5' : 'mt-2',
                  'text-sm font-normal text-Gray-600 leading-5 '
                )}
              >
                This is a hint text to help user.
              </div>
            </div>
            <div>
              <CustomInput
                leftSection={<DateIcon className="size-5" />}
                label="Lease start day*"
                placeholder="Enter Date"
                {...register('startDay')}
                error={errors.startDay?.message}
              />
              <div
                className={clsx(
                  errors.startDay?.message ? 'mt-5' : 'mt-2',
                  'text-sm font-normal text-Gray-600 leading-5 '
                )}
              >
                This is a hint text to help user.
              </div>
            </div>
            <div>
              <CustomInput
                leftSection={<DateIcon className="size-5" />}
                label="Lease end day*"
                placeholder="Enter Date"
                {...register('endDay')}
                error={errors.endDay?.message}
              />
              <div
                className={clsx(
                  errors.endDay?.message ? 'mt-5' : 'mt-2',
                  'text-sm font-normal text-Gray-600 leading-5 '
                )}
              >
                This is a hint text to help user.
              </div>
            </div>
          </fieldset>
          <fieldset className="grid-cols-2 grid gap-6 ">
            <div>
              <CustomInput
                label="Monthly rent*"
                placeholder="$000"
                {...register('rent')}
                error={errors.rent?.message}
              />
              <div
                className={clsx(
                  errors.rent?.message ? 'mt-5' : 'mt-2',
                  'text-sm font-normal text-Gray-600 leading-5 '
                )}
              >
                [Amount comited on lease - monthly rent can’t exseed *2 of prooved monthly income].
              </div>
            </div>
            <div>
              <CustomInput
                leftSection={<DateIcon className="size-5" />}
                label="Move in date"
                placeholder="Enter Date"
                {...register('moveInDate')}
                error={errors.moveInDate?.message}
              />
              <div
                className={clsx(
                  errors.moveInDate?.message ? 'mt-5' : 'mt-2',
                  'text-sm font-normal text-Gray-600 leading-5 '
                )}
              >
                [not the lease start day!]
              </div>
            </div>
          </fieldset>
          {newTenent===true &&
          <div className="grid-cols-1 grid gap-5 ">
            <div
              className={clsx(
                'border border-solid border-Gray-200 shadow-xs border-[2px] rounded-[12px] p-4 cursor-pointer',
                (qualityTenant || applyFee || securityDeposit) && '!border-brand-970 border-2'
              )}
            >
              <div
                className="flex gap-3"
                onClick={() => {
                  setQualityTenant(!qualityTenant);
                }}
              >
                <Checkbox
                  checked={qualityTenant}
                  className="mt-1"
                  classNames={{
                    label: 'text-gray-700 font-medium	text-base	',
                    body: 'items-center',
                    input: clsx(
                      'rounded-[6px]',
                      qualityTenant && '!bg-brand-970 !border-brand-970'
                    ),
                  }}
                />
                <div>
                  <div className="text-Gray-700 text-base font-medium">
                    Quality Tenant Guarantee
                    <span className="font-medium text-sm leading-5 ms-2 text-gray-600">
                      %4 of monthly rent/month
                    </span>
                  </div>
                  <div className="mt-0.5 text-gray-600 text-base font-normal">
                    12 months rent guaranteed (up to $100,000), rent payment reporting, eviction
                    filing fees, eviction legal fees (up to $1,000), leasing assistance (up to half
                    months rent).
                  </div>
                </div>
              </div>

              <div
                className="flex mt-3 gap-3"
                onClick={() => {
                  setApplyFee(!applyFee);
                }}
              >
                <Checkbox
                  checked={applyFee}
                  className="mt-1"
                  classNames={{
                    label: 'text-gray-700 font-medium	text-base	',
                    body: 'items-center',
                    input: clsx('rounded-[6px]', applyFee && '!bg-brand-970 !border-brand-970'),
                  }}
                />
                <div>
                  <div className="text-Gray-700 text-base font-medium">
                    Security deposit waiver add on
                    <span className="font-medium text-sm leading-5 ms-2 text-gray-600">
                      %1 of monthly rent/month
                    </span>
                  </div>
                  <div className="mt-0.5 text-gray-600 text-base font-normal">
                    Waive the security deposit requirement from tenant, in case of tenant damage we
                    will cover up to 1 months rent.
                  </div>
                </div>
              </div>

              <div className="flex mt-3 gap-3">
                <Checkbox
                  checked={securityDeposit}
                  className="mt-1"
                  classNames={{
                    label: 'text-gray-700 font-medium	text-base	',
                    body: 'items-center',
                    input: clsx(
                      'rounded-[6px] cursor-pointer',
                      securityDeposit && '!bg-brand-970 !border-brand-970'
                    ),
                  }}
                  onClick={() => {
                    setSecurityDeposit(!securityDeposit);
                  }}
                />
                <div className="text-Gray-700 text-base font-medium">
                  Apply fee to tenant
               
                    <CustomInput
                  leftSection={
                    <CustomInput
                    type='number'
                    max={99}
                      classNames={{
                        input: 'p-0 !rounded-none !text-center !border-y-0	m-1 !border-l-0 !h-10',
                      }}
                      placeholder="0 "
                      className=""
                    />
                  }
                  classNames={{
                    input: '!ps-10 !bg-gray-50',
                  }}
                  placeholder="% of monthly rent"
                  className="mt-2"
                />
                </div>
                <div className="text-Gray-700 text-base font-medium">
                  Your fee
                  <CustomInput placeholder="% of monthly rent" className="mt-2" />
                </div>
                <div className="text-Gray-700 text-base font-medium">
                  Total monthly rent
                  <CustomInput placeholder="$000" className="mt-2" />
                </div>
              </div>
            </div>
          </div>
}
          <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
            Lease agrrement
          </div>
          <div className="text-sm font-normal text-Gray-600 text-center ">
            Upload a copy of singed lease agreement
          </div>

          <Dropzone
            multiple={false}
            // accept={IMAGE_MIME_TYPE}
            onDrop={handleDrop}
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
          {file && (
            <div className="flex justify-between border border-solid border-Gray-200 border-[1px] rounded-[12px] py-4 px-6 cursor-pointer ">
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
              <Delete01 onClick={() => setFile(null)} className="text-gray-700 cursor-pointer " />
            </div>
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
    </div>
  );
};

export default LeaseDetailForm;
