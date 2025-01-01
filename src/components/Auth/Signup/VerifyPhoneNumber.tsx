import { createRequest } from '@api/Base.api';
import { AlertCircleIcon, Phone01 } from '@assets/iconComponents';
import { LoaderCircle } from '@components/LoaderCircle';
import { API } from '@constants/api.constant';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Checkbox, Input } from '@mantine/core';
import { selectSignupData } from '@stores/authSlice';
import clsx from 'clsx';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import { useSelector } from 'react-redux';
import * as yup from 'yup';

interface props {
  onClose: () => void;
}

export function VerifyPhoneNumber({ onClose }: props) {
  const userData = useSelector(selectSignupData);
  const [visible, setVisible] = useState(false);

  let schema = yup.object().shape({
    isVerify: yup.boolean().oneOf([true], 'Field is required').required(),
    phone_no: yup.string(),
  });

  if (userData?.isGoogleSignIn) {
    schema = yup.object().shape({
      isVerify: yup.boolean().oneOf([true], 'Field is required').required(),
      phone_no: yup
        .string()
        .required('Phone number is required')
        .matches(/^\+1 \d{3}-\d{3}-\d{4}$/, 'Phone number is not valid'),
    });
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    ...form
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (values: { phone_no?: string; isVerify: boolean }) => {
    setVisible(true);
    try {
      if (userData?.isGoogleSignIn) {
        await createRequest(`${API.SIGNUP.ADD_PHONE_NUMBER}`, 'POST', {
          user_id: userData?.user_id,
          phone_no: values.phone_no,
        });
      }
      createRequest(`${API.SIGNUP.PHONE_RESEND_OTP}?user_id=${userData?.user_id}`, 'POST')
        .then((res) => {
          onClose();
          setVisible(false);
        })
        .catch((err) => {
          setVisible(false);
        });
    } catch (e) {
      setVisible(false);
    }
  };
  return (
    <>
      <div className="bg-no-repeat bg-[url(/src/assets/patterns/radial-lines2.svg)] bg-top">
        <LoaderCircle visible={visible} />

        <div className="flex flex-col items-center self-stretch p-6">
          <div>
            <Phone01 />
          </div>
          <div className="flex flex-col items-center self-stretch gap-1 py-3">
            <div className="text-gray-900 text-center text-lg font-semibold leading-7">
              Verify your phone number.
            </div>
            <div className="text-gray-600 text-center font-normal text-sm leading-5">
              Before we get you started we need to verify your phone number, please select the
              verification method below.
            </div>
          </div>

          {userData?.isGoogleSignIn && (
            <div className="w-full">
              <Input.Wrapper
                classNames={{
                  label: 'text-sm-medium text-gray-700',
                }}
                label="Phone Number*"
                className="w-full mt-1"
              >
                <Controller
                  name="phone_no"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      size="md"
                      radius="md"
                      error={errors.phone_no?.message}
                      className="w-full"
                      classNames={{
                        input: clsx(
                          'pe-11 !h-9 placeholder:text-gray-500',
                          errors.phone_no?.message && 'border-error-600 focus:shadow-error'
                        ),
                      }}
                      rightSection={
                        errors.phone_no?.message ? (
                          <AlertCircleIcon className="size-4 text-error-500 me-2.5" />
                        ) : (
                          ''
                        )
                      }
                      type="text"
                      component={IMaskInput}
                      onChange={(e) => {
                        field.onChange(e);
                        form.setValue('phone_no', e.currentTarget.value);
                        if (!form.getFieldState('phone_no').invalid) {
                          form.clearErrors('phone_no');
                        }
                      }}
                      mask="+1 000-000-0000"
                      placeholder="Enter your phone number"
                    />
                  )}
                />

                {errors.phone_no?.message && (
                  <p className="text-error-600 text-sm !mt-0.5 -mb-3">
                    {' '}
                    {errors.phone_no?.message}
                  </p>
                )}
              </Input.Wrapper>
            </div>
          )}
          <div className="flex flex-col items-start mt-6">
            <Checkbox
              {...register('isVerify')}
              name="isVerify"
              error={errors.isVerify?.message}
              className={`${errors.isVerify?.message && 'my-2'} w-full `}
              classNames={{
                label: 'text-gray-700 font-medium text-sm leading-5	',
                description: 'text-gray-600 font-normal text-sm leading-5',
              }}
              size="xs"
              label={`Six-digit verification code sent by SMS to the number ending in  ${userData?.phone?.substr(-4)}.`}
              description="Standard rates may apply."
            />
          </div>
          <div className="pt-8 w-full">
            <Button
              onClick={handleSubmit(onSubmit)}
              size="md"
              className="bg-brand-970 w-full hover:bg-brand-960 text-base font-semibold rounded-lg"
            >
              Verify
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
