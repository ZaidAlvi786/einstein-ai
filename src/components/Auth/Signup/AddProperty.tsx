import React, { useState } from 'react';
import { ArrowBack, ArrowDown, EmailIcon } from '@assets/iconComponents';
import { Button, Modal, Select } from '@mantine/core';
import { LoaderCircle } from '@components/LoaderCircle';
import { CustomInput } from '@utils/CustomInput';
import { useForm } from 'react-hook-form';
import { selectSignupData, setPreviousSignupState, setSignUpData } from '@stores/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { StepStatus } from './StepStatus';
import { StepPagination } from './StepPagination';
import { VerifyPhoneNumber } from './VerifyPhoneNumber';
import { VerifiedPhoneNumber } from './VerifiedPhoneNumber';
import { PhoneNumberOTP } from './PhoneNmberOTP';
import { statesList } from '@constants/app.constant';
import { propertySchema } from '../schemas';
import { yupResolver } from '@hookform/resolvers/yup';
import { IProterty } from '@interfaces/property.interface';
import { createRequestFormData } from '@api/Base.api';
import { API } from '@constants/api.constant';

interface props {
  handlers: {
    increment: () => void;
    decrement: () => void;
  };
}
const initialValues = {
  name: '',
  units: 0,
  address_1: '',
  address_2: '',
  city: '',
  state: '',
  zip_code: '',
  association_with_property: '',
};

export function AddProperty({ handlers }: props) {
  const [verifyPhoneModalOpen, setVerifyPhoneModalOpen] = useState(false);
  const [phoneNumberOTPModalOpen, setphoneNumberOTPModalOpen] = useState(false);
  const [verifiedPhoneModalOpen, setVerifiedPhoneModalOpen] = useState(false);
  const dispatch = useDispatch();
  const userData = useSelector(selectSignupData);

  const [visible, setVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    ...form
  } = useForm({
    resolver: yupResolver(propertySchema),
    defaultValues: initialValues,
  });

  const onSubmit = (values: IProterty) => {
    setVisible(true);
    createRequestFormData(API.PROPERTY.CREATE, 'POST', values)
      .then((res) => {
        dispatch(setSignUpData({...userData, property: {...values}}));
        setVisible(false);
        finalStep('verifyPhoneNumber');
      })
      .catch((err) => {
        setVisible(false);
      });
  };
  const finalStep = (type: string) => {
    if (type === 'verifyPhoneNumber') {
      setVerifyPhoneModalOpen(true);
    } else if (type === 'phoneNumberOTP') {
      setphoneNumberOTPModalOpen(true);
    } else if (type === 'verifiedPhoneNumber') {
      setVerifiedPhoneModalOpen(true);
    }
  };
  const goBack = () => {
    handlers.decrement();
    dispatch(setPreviousSignupState());
  };

  return (
    <>
      <div className="flex min-h-screen relative">
        <LoaderCircle visible={visible} />
        <div></div>
        <div className="flex flex-col flex-wrap content-center relative items-center pt-29 pb-24 w-full max-w-full bg-no-repeat bg-[url(/src/assets/patterns/radial-lines.svg)] bg-top-12.8">
          <div className="w-full px-15">
            <Button
              onClick={goBack}
              leftSection={<ArrowBack />}
              className="hover:bg-white rounded-lg border bg-white flex gap-1.5 py-2.5 px-4 border-gray-300 border-solid shadow-sm"
            >
              {/* <ArrowBack /> */}
              <span className="text-gray-700 text-base font-semibold">Back</span>
            </Button>
          </div>
          <div className="flex flex-col items-center gap-8   max-w-mdSm">
            <div className="flex flex-col items-center gap-6 self-stretch">
              <div className="w-14 h-14 border-solid flex justify-center items-center shadow-input border border-gray-300 rounded-xl">
                <EmailIcon />
              </div>
              <div className="flex flex-col items-start gap-3 slef-stretch">
                <div className="text-gray-900 text-center text-3xl font-semibold leading-xxxl">
                  Add your first property
                </div>
                <div className="text-base w-full text-center font-normal text-gray-600">
                  We sent a verification link to
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-6 self-stretch">
              <div className="flex flex-col itemes-start gap-5 self-stretch">
                <div className="flex items-start grid grid-cols-3 content-start gap-6 self-stretch flex-wrap">
                  <div className="col-span-2">
                    <CustomInput
                      placeholder="Enter name of property"
                      label="Property name"
                      type="text"
                      className="w-full"
                      {...register('name')}
                    />
                  </div>
                  <div>
                    <CustomInput
                      placeholder="0"
                      type="text"
                      label="Number of units*"
                      error={errors.units?.message}
                      className={`w-full `}
                      {...register('units')}
                      onBlur={() => form.trigger('units')}
                    />
                  </div>
                </div>
                <div className="flex items-start grid grid-cols-2 content-start gap-6 self-stretch flex-wrap">
                  <div>
                    <CustomInput
                      placeholder="Enter address 1"
                      label="Address 1*"
                      type="text"
                      error={errors.address_1?.message}
                      className={`w-full `}
                      {...register('address_1')}
                      onBlur={() => form.trigger('address_1')}
                    />
                  </div>
                  <div>
                    <CustomInput
                      placeholder="Enter address 2"
                      label="Address 2"
                      type="text"
                      className="w-full"
                      {...register('address_2')}
                      onBlur={() => form.trigger('address_2')}
                    />
                  </div>
                </div>
                <div className="flex items-start grid grid-cols-3 content-start gap-6 self-stretch flex-wrap">
                  <div>
                    <CustomInput
                      placeholder="Enter City"
                      label="City*"
                      type="text"
                      error={errors.city?.message}
                      className={`w-full `}
                      {...register('city')}
                      onBlur={() => form.trigger('city')}
                    />
                  </div>
                  <div>
                    <Select
                      label="State*"
                      placeholder="Select State"
                      checkIconPosition="right"
                      rightSection={<ArrowDown />}
                      data={statesList}
                      error={errors.state?.message}
                      {...register('state')}
                       className={`w-full `}
                      onChange={(_value, option) => {form.clearErrors('state'); form.setValue( 'state', option.value)}}
                      onBlur={() => form.trigger('state')}
                    />
                  </div>
                  <div>
                    <CustomInput
                      placeholder="Enter Zip Code"
                      label="Zip Code*"
                      type="text"
                      error={errors.zip_code?.message}
                      className={`w-full `}
                      {...register('zip_code')}
                      onBlur={() => form.trigger('zip_code')}
                    />
                  </div>
                </div>
                <div className="flex flex-col grid grid-cols-1 items-start gap-1.5">
                  <div>
                    <CustomInput
                      placeholder="Your association with property"
                      label="Association with property*"
                      type="text"
                      error={errors.association_with_property?.message}
                      className={`${errors.association_with_property?.message && 'my-2'} w-full `}
                      {...register('association_with_property')}
                      onBlur={() => form.trigger('association_with_property')}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center gap-1.5 self-stretch ">
                <Button
                  onClick={handleSubmit(onSubmit)}
                  size="md"
                  className="bg-brand-970 w-full hover:bg-brand-960 text-base font-semibold rounded-lg"
                >
                  Finish sign up
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center absolute bottom-8 mt-24 max-w-mdSm">
            <StepPagination />
          </div>
        </div>
        <div className="flex max-w-lgSm flex-col w-full">
          <StepStatus />
        </div>
      </div>
      <Modal
        withCloseButton={false}
        opened={verifyPhoneModalOpen}
        size="md"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        onClose={() => setVerifyPhoneModalOpen(false)}
      >
        <VerifyPhoneNumber
          onClose={() => {
            setVerifyPhoneModalOpen(false);
            finalStep('phoneNumberOTP');
          }}
        />
      </Modal>

      <Modal
        withCloseButton={false}
        opened={phoneNumberOTPModalOpen}
        size="lg"
        closeOnClickOutside={false}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        onClose={() => setphoneNumberOTPModalOpen(false)}
      >
        <PhoneNumberOTP
          onCancel={() => setphoneNumberOTPModalOpen(false)}
          onClose={() => {
            setphoneNumberOTPModalOpen(false);
            finalStep('verifiedPhoneNumber');
          }}
        />
      </Modal>
      <Modal
        withCloseButton={false}
        opened={verifiedPhoneModalOpen}
        size="md"
        closeOnClickOutside={false}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        onClose={() => setVerifiedPhoneModalOpen(false)}
      >
        <VerifiedPhoneNumber onClose={() => setVerifiedPhoneModalOpen(false)} />
      </Modal>
    </>
  );
}
