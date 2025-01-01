import { LoaderCircle } from '@components/LoaderCircle';
import { useState } from 'react';
import { ArrowBack, EmailIcon } from '@assets/iconComponents';
import { Anchor, Button, PinInput } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { StepPagination } from './StepPagination';
import { StepStatus } from './StepStatus';
import { createRequest } from '@api/Base.api';
import { API } from '@constants/api.constant';
import { useSelector } from 'react-redux';
import { selectSignupData } from '@stores/authSlice';

interface props {
  handlers: {
    increment: () => void;
    decrement: () => void;
  };
}

export function EmailOTP({ handlers }: props) {
  const [visible, setVisible] = useState(false);
  const userData = useSelector(selectSignupData);

  const {
    handleSubmit,
    control,
    formState: { errors },
    ...form
  } = useForm({
    resolver: yupResolver(
      yup.object({
        otp: yup.string().required('OTP is required').length(6, 'OTP is required'),
      })
    ),
  });

  const onSubmit = (values: { otp: string }) => {
    setVisible(true);
    createRequest(
      `${API.SIGNUP.VERIFY_EMAIL_CODE}?code=${values.otp}&user_id=${userData?.user_id}`,
      'POST')
      .then((res) => {
        handlers.increment();
        setVisible(false);
      })
      .catch((err) => {
        setVisible(false);
      });
  };
  const goBack = () => {
    handlers.decrement();
  };

  const resend = () => {
    setVisible(true);
    createRequest(
      `${API.SIGNUP.Email_RESEND_OTP}?user_id=${userData?.user_id}`,
      'POST')
      .then((res) => {
        setVisible(false);
      })
      .catch((err) => {
        setVisible(false);
      });
  }

  return (
    <>
      <div className="flex min-h-screen relative">
        <LoaderCircle visible={visible} />
        <div className="flex flex-col bg-contain w-full max-w-full bg-[url(/src/assets/patterns/radial-lines.svg)] bg-top-12.4  bg-no-repeat items-center justify-center relative">
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
          <div className="self-center flex flex-col items-center gap-8 px-8">
            <div className="flex flex-col gap-6 items-center self-stretch">
              <div className="w-12 h-12 border-solid flex justify-center items-center shadow-input border border-gray-300 rounded-xl">
                <EmailIcon />
              </div>

              <div className="flex flex-col items-center self-stretch gap-3">
                <div className="text-gray-900 text-3xl font-semibold leading-xxxl">Check your email</div>
                <div className="text-md-regular text-gray-600 text-center">
                  We have sent a verification code to{' '}
                  <div className="text-md-medium text-gray-600">{userData?.email}</div>
                </div>
              </div>
            </div>
            <Controller
              control={control}
              name="otp"
              render={({ field }) => (
                <PinInput
                  type="number"
                  {...field}
                  length={6}
                  size="xl"
                  gap="xl"
                  placeholder="0"
                  classNames={{
                    input:
                      'text-5xl rounded-lgMd p-2 font-medium w-20	min-h-20 active:border-brand-970  border-solid border-2 leading-lg-xl',
                    pinInput: 'gap-2 flex border-0 mr-2',
                  }}
                />
              )}
            />
            <div className="text-xs text-error-500 self-start">
              {errors.otp && <p>{errors.otp.message}</p>}
            </div>
            <div className="flex justify-center items-center gap-1.5 self-stretch py-2.5 px-4">
              <Button
                size="md"
                className="max-w-xs bg-brand-970 w-full hover:bg-brand-960 text-base font-semibold rounded-lg"
                onClick={handleSubmit(onSubmit)}
              >
                Verify email
              </Button>
            </div>

            <div className="flex items-start justify-center gap-1 self-stretch">
              <p className="text-sm-regular text-gray-600 text-center">Didn’t receive the code?</p>
              <Anchor className="text-sm-semibold text-brand-960" onClick={resend}>Click to resend</Anchor>
            </div>

            <div className="h-1"></div>
          </div>

          <div className="flex justify-center w-full absolute bottom-12">
            <StepPagination />
          </div>
        </div>

        <div className="flex max-w-lgSm flex-col w-full">
          <StepStatus />
        </div>
      </div>
    </>
  );
}
