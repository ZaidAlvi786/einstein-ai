import { ArrowDown, Edit01Icon, EmailIcon02, SvgDefaultUser01 } from '@assets/iconComponents';
import { statesList } from '@constants/app.constant';
import { yupResolver } from '@hookform/resolvers/yup';
import { Badge, Button, Checkbox, Select } from '@mantine/core';
import CustomInput from '@utils/CustomInput';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CoApplicantDetailsForm, coApplicantchema } from '../schema';
interface Props {
  coteanantForm: boolean;
  setCoteanantForm: (value: boolean) => void;
  showCotenatFields: boolean;
  setshowcotenentfields: (value: boolean) => void;
}

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  coApplicant: false,
  guarantor: false,
  residents: false,
};

const CoApplicantsInputs = ({
  coteanantForm,
  setCoteanantForm,
  showCotenatFields,
  setshowcotenentfields,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    ...form
  } = useForm({
    resolver: yupResolver(coApplicantchema),
    defaultValues: initialValues,
  });

  const [conApplicantCheck, setConApplicantCheck] = useState(true);
  const [guarantor, setGuarantor] = useState(false);
  const [residents, setResidents] = useState(false);
  const [coApplicantList, setCoApplicantList] = useState<CoApplicantDetailsForm[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const onSubmit = (values: CoApplicantDetailsForm) => {
    reset();
    if (editIndex !== null) {
      const updatedList = [...coApplicantList];
      updatedList[editIndex] = values;
      setCoApplicantList(updatedList);
      setEditIndex(null);
    } else {
      setCoApplicantList([...coApplicantList, values]);
    }
    setshowcotenentfields(false);
  };
  const handleEdit = (index: number) => {
    const coApplicant = coApplicantList[index];
    setEditIndex(index);
    setshowcotenentfields(true);
    reset(coApplicant);
  };
  const handleCancel = () => {
    if (coApplicantList.length === 0) {
      setCoteanantForm(false);
    } else {
      setshowcotenentfields(false);
    }
  };
  return (
    <>
      {coteanantForm && (
        <div
          className={clsx(
            'grid gap-5 bg-white border border-solid border-Gray-200  border-[1px] rounded-[12px] p-6'
          )}
        >
          <div className="grid gap-5">
            <div className="text-sm	font-medium rounded-[8px]	leading-5	flex items-center justify-center text-center text-gray-600 bg-gray-50 p-2">
              Co-appilcant
            </div>
          </div>

          {coApplicantList?.length > 0 &&
            coApplicantList.map((coApplicant, index) => (
              <div
                className="border-solid border border-gray-300  border-[1px] rounded-[12px] p-4  h-30 m-h-30"
                key={index}
              >
                <div className="flex justify-between">
                  <div className="flex">
                    <div className="items-center self-center me-4">
                      <SvgDefaultUser01 className="col-span-1 " />
                    </div>
                    <div className="self-center">
                      <div className="text-base	font-medium	leading-6	text-gray-700  flex items-center ">
                        <span className="text-ellipsis max-w-32 whitespace-nowrap overflow-hidden">
                          {coApplicant?.firstName} {coApplicant.lastName}
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
                          Co-Apllicant
                        </Badge>
                      </div>
                      <div className="font-normal	text-base	leading-6	text-gray-600">
                        {coApplicant.phoneNumber}
                      </div>
                      <div className="font-normal	text-base	leading-6 text-gray-600 mt-0.5">
                        {coApplicant.email}
                      </div>
                    </div>
                  </div>
                  <div className="pe-1 py-1">
                    <Edit01Icon
                      className="text-gray-700 cursor-pointer h-5 w-5"
                      onClick={() => {
                        handleEdit(index);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          {showCotenatFields && (
            <>
              <div className="grid gap-5">
                <div className="flex  gap-3">
                  <Checkbox
                    checked={conApplicantCheck}
                    onClick={() => setConApplicantCheck(!conApplicantCheck)}
                    classNames={{
                      label: 'text-gray-700 font-medium	text-base	',
                      body: 'items-center',
                      input: clsx(
                        '!rounded-[6px]',
                        conApplicantCheck && '!bg-brand-970 !border-brand-970'
                      ),
                    }}
                    className="mt-1"
                  />
                  <div>
                    <div className="text-Gray-700 text-base font-medium">Co-applicant</div>
                    <div className="mt-0.5 text-Gray-600 text-base font-normal">
                      Will be residing at property and will share financial responsibilities
                    </div>
                  </div>
                </div>
                <div className="flex  gap-3">
                  <Checkbox
                    checked={guarantor}
                    onClick={() => setGuarantor(!guarantor)}
                    classNames={{
                      label: 'text-gray-700 font-medium	text-base	',
                      body: 'items-center',
                      input: clsx(
                        '!rounded-[6px]',
                        guarantor && '!bg-brand-970 !border-brand-970'
                      ),
                    }}
                    className="mt-1"
                  />
                  <div>
                    <div className="text-Gray-700 text-base font-medium">guarantor</div>
                    <div className="mt-0.5 text-Gray-600 text-base font-normal">
                      Takes on financial responsibilities - not residing at the property.
                    </div>
                  </div>
                </div>

                <div className="flex  gap-3">
                  <Checkbox
                    checked={residents}
                    onClick={() => setResidents(!residents)}
                    classNames={{
                      label: 'text-gray-700 font-medium	text-base	',
                      body: 'items-center',
                      input: clsx(
                        '!rounded-[6px]',
                        residents && '!bg-brand-970 !border-brand-970'
                      ),
                    }}
                    className="mt-1"
                  />
                  <div>
                    <div className="text-Gray-700 text-base font-medium">Additional residents</div>
                    <div className="mt-0.5 text-Gray-600 text-base font-normal">
                      Residing at property without financial obligations
                    </div>
                  </div>
                </div>
              </div>
              <fieldset className="grid-cols-2 grid gap-5 ">
                <CustomInput
                  label="First name*"
                  placeholder="First name"
                  {...register('firstName')}
                  error={errors.firstName?.message}
                  onBlur={() => form.trigger('firstName')}
                />
                <CustomInput
                  label="Last name* "
                  placeholder="Last name"
                  {...register('lastName')}
                  error={errors.lastName?.message}
                  onBlur={() => form.trigger('lastName')}
                />
                <CustomInput
                  leftSection={<EmailIcon02 className="size-5" />}
                  label="Email address"
                  placeholder="Enter email address"
                  {...register('email')}
                  error={errors.email?.message}
                  onBlur={() => form.trigger('email')}
                />
                <CustomInput
                  label="Phone number"
                  placeholder="Enter phone number"
                  {...register('phoneNumber')}
                  error={errors.phoneNumber?.message}
                  onBlur={() => form.trigger('phoneNumber')}
                />
              </fieldset>

              <div className="flex justify-end ">
                <Button variant="subtle" className="text-Brand-700" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  variant="subtle"
                  className="text-Brand-700"
                  onClick={handleSubmit(onSubmit)}
                >
                  Add
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default CoApplicantsInputs;
