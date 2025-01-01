import React, { useState } from 'react';
import { LoaderCircle } from '@components/LoaderCircle';
import { CustomInput } from '@utils/CustomInput';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input } from '@mantine/core';
import { AlertCircleIcon, ArrowBack, EmailIcon, QuestionMark } from '@assets/iconComponents';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectSignupData,
  setNextSignupState,
  setPreviousSignupState,
  setSignUpData,
} from '@stores/authSlice';
import { StepPagination } from './StepPagination';
import { StepStatus } from './StepStatus';
import { yupResolver } from '@hookform/resolvers/yup';
import { portfolioSchema } from '../schemas';
import { createRequest } from '@api/Base.api';
import { API } from '@constants/api.constant';
import { IPortfolio } from '@interfaces/portfolio.interface';
import clsx from 'clsx';
import { IMaskInput } from 'react-imask';

interface props {
  handlers: {
    increment: () => void;
    decrement: () => void;
    set: (value: number) => void;
  };
}
const initialValues = {
  name: '',
  portfolio_size: 0,
  company_name: '',
  company_email: '',
  phone: '',
};

export function Portfolio({ handlers }: props) {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const userData = useSelector(selectSignupData);

  const {
    register,
    handleSubmit,
    formState: { errors },
    ...form
  } = useForm({
    resolver: yupResolver(portfolioSchema),
    defaultValues: initialValues,
  });

  const onSubmit = (values: IPortfolio) => {
    setVisible(true);
    createRequest(`${API.SIGNUP.PORTFOLIO}?id=${userData?.user_id}`, 'POST', values)
      .then((res) => {
        dispatch(setSignUpData({ ...userData, portfolio: { ...values } }));
        setVisible(false);
        handlers.increment();
        dispatch(setNextSignupState());
      })
      .catch((err) => {
        setVisible(false);
      });
  };
  const goBack = () => {
    if (userData?.isGoogleSignIn) {
      handlers.set(0);
    } else {
      handlers.decrement();
    }
    dispatch(setPreviousSignupState());
  };

  return (
    <>
      <div className="flex min-h-screen relative">
        <LoaderCircle visible={visible} />
        <div className="flex flex-wrap flex-col justify-center items-center pt-29 pb-24 content-center w-full max-w-full bg-no-repeat  bg-[url(/src/assets/patterns/radial-lines.svg)] bg-top-12.8">
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
          <div className="flex flex-col items-center gap-8 self-stretch">
            <div className="flex flex-col items-center gap-6 self-stretch">
              <div className="w-14 h-14 border-solid flex justify-center items-center shadow-input border border-gray-300 rounded-xl">
                <EmailIcon />
              </div>
              <div className="flex flex-col items-start gap-3 slef-stretch">
                <div className="text-gray-900 text-center text-3xl font-semibold leading-xxxl">
                  About your portfolio
                </div>
                <div className="text-base w-full text-center font-normal text-gray-600">
                  We sent a verification link to
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-6  slef-stretch max-w-xs">
              <div className="flex flex-col items-center self-stretch gap-6">
                <div className="flex flex-col w-full  items-center gap-1.5 slef-stretch">
                  <div className="w-full">
                    <CustomInput
                      size="md"
                      placeholder="Enter portfolio name"
                      label="Name*"
                      type="text"
                      error={errors.name?.message}
                      className={`${errors.name?.message && 'my-2'} w-full `}
                      {...register('name')}
                      withIcons
                      rightSection={<QuestionMark />}
                      onBlur={() => form.trigger('name')}
                    />
                  </div>
                  <div
                    className={`${errors.name?.message && 'mt-2'} text-sm leading-5 font-normal text-gray-600`}
                  >
                    This can be your company name or you can add a nickname.
                  </div>
                </div>
                <div className="flex flex-col w-full items-start gap-1.5 slef-stretch">
                  <div className="w-full">
                    <CustomInput
                      size="md"
                      placeholder="Enter units amount"
                      label="Portfolio size*"
                      type="text"
                      error={errors.portfolio_size?.message}
                      className={`${errors.portfolio_size?.message && 'my-2'} w-full`}
                      {...register('portfolio_size')}
                      withIcons
                      rightSection={<QuestionMark />}
                      onBlur={() => form.trigger('portfolio_size')}
                    />
                  </div>
                  <div
                    className={`${errors.portfolio_size?.message && 'mt-2'} text-sm leading-5 font-normal text-gray-600`}
                  >
                    Total units owned/managed in this portfolio.
                  </div>
                </div>
                <div className="flex flex-col w-full items-start gap-1.5 slef-stretch">
                  <div className="w-full">
                    <CustomInput
                      size="md"
                      placeholder="Enter company name"
                      label="Company name*"
                      type="text"
                      error={errors.company_name?.message}
                      className={`${errors.company_name?.message && 'my-2'} w-full`}
                      {...register('company_name')}
                      onBlur={() => form.trigger('company_name')}
                    />
                  </div>
                  <div
                    className={`${errors.company_name?.message && 'mt-2'} text-sm leading-5 font-normal text-gray-600`}
                  >
                    If owned by company
                  </div>
                </div>
                <div className="flex flex-col w-full items-start gap-1.5 slef-stretch">
                  <div className="w-full">
                    <CustomInput
                      size="md"
                      placeholder="Enter company email"
                      label="Company email*"
                      type="text"
                      error={errors.company_email?.message}
                      className={`${errors.company_email?.message && 'my-2'} w-full`}
                      {...register('company_email')}
                      onBlur={() => form.trigger('company_email')}
                    />
                  </div>
                </div>
                <div className="flex flex-col w-full items-start gap-1.5 slef-stretch">
                  <div className="w-full">
                    <Input.Wrapper
                      classNames={{
                        label: 'text-sm-medium text-gray-700',
                      }}
                      label="Phone*"
                      className="w-full mt-1"
                    >
                      <Controller
                        name="phone"
                        control={form.control}
                        render={({ field }) => (
                          <Input
                            size="md"
                            radius="md"
                            error={errors.phone?.message}
                            className="w-full"
                            classNames={{
                              input: clsx(
                                'pe-11 !h-9 placeholder:text-gray-500',
                                errors.phone?.message && 'border-error-600 focus:shadow-error'
                              ),
                            }}
                            rightSection={
                              errors.phone?.message ? (
                                <AlertCircleIcon className="size-4 text-error-500 me-2.5" />
                              ) : (
                                ''
                              )
                            }
                            type="text"
                            component={IMaskInput}
                            onAccept={(value) => {
                              field.onChange(value);
                              form.setValue('phone', value);
                              if (!form.getFieldState('phone').invalid) {
                                form.clearErrors('phone');
                              }
                            }}
                            // onChange={(e) => {
                            //   field.onChange(e);
                            //   form.setValue('phone', e.currentTarget.value);
                            //   if (!form.getFieldState('phone').invalid) {
                            //     form.clearErrors('phone');
                            //   }
                            // }}
                            onBlur={() => form.trigger('phone')}
                            mask="+1 000-000-0000"
                            placeholder="Enter your phone number"
                          />
                        )}
                      />

                      {errors.phone?.message && (
                        <p className="text-error-600 text-sm !mt-0.5 -mb-3">
                          {' '}
                          {errors.phone?.message}
                        </p>
                      )}
                    </Input.Wrapper>
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center gap-1.5 self-stretch ">
                <Button
                  onClick={handleSubmit(onSubmit)}
                  size="md"
                  className="bg-brand-970 w-full hover:bg-brand-960 text-base font-semibold rounded-lg"
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center mt-6 mb-16">
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
