import { Button, Box, Anchor, Text, PasswordInput } from '@mantine/core';
import { set, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { passwordSchema } from '@components/Auth/schemas';
import { LoaderCircle } from '@components/LoaderCircle';
import { useState } from 'react';
import { ArrowNarrowLeftIcon, CheckIcon, CheckIcon01, LockIcon } from '@assets/iconComponents';
import { Link, useNavigate } from 'react-router-dom';
import { APP_PATHS } from '@routes/app-paths';
import { useDisclosure } from '@mantine/hooks';
import clsx from 'clsx';
import { CustomInput } from '@utils/CustomInput';
import { createRequest } from '@api/Base.api';
import { getItemStorage, setNonObjectItemStorage } from '@helpers/storage.helper';
import { storagekeysEnum } from '@enums/storage.enum';
import linesBg from '@assets/patterns/transparent-lines.svg';
interface ResetPasswordData {
  code: string;
  password: string;
}
interface props {
  handlers: {
    increment: () => void;
    decrement: () => void;
  };
}
export function CheckEmail({ handlers }: props) {
  const [visible, setVisible] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [visiblePassword, { toggle }] = useDisclosure(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: { code: '', password: '', confirmPassword: '' },
  });

  const onSubmit = (values: ResetPasswordData) => {
    const email = getItemStorage(storagekeysEnum.userEmail) ?? '';

    if (resetPassword) {
      setVisible(true);
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', values.password);
      createRequest(`/api/v1/users/login`, 'POST', params)
        .then((res) => {
          setNonObjectItemStorage(storagekeysEnum.AUTH_TOKEN, res?.access_token);
          setVisible(false);
          navigate(APP_PATHS.properties.get());
        })
        .catch((error) => {
          setVisible(false);
        });
      return;
    } else {
      const email = getItemStorage(storagekeysEnum.userEmail);
      setVisible(true);
      createRequest(
        `/api/v1/users/forgot-password/verify-otp?email=${email}&code=${values.code}&new_password=${values.password}`,
        'POST'
      )
        .then((res) => {
          handlers.increment();
          setVisible(false);
          setResetPassword(true);
        })
        .catch((error) => {
          setVisible(false);
        });
    }
  };
  return (
    <>
      <div className="flex justify-center relative">
        <img src={linesBg.toString()} alt="lines-bg" className="absolute" />
        <div className="flex flex-col bg-white rounded-xl sm:w-full sm:max-w-md py-10">
          <Box pos="relative" className="mt-98">
            <LoaderCircle visible={visible} />
            <div className="self-center w-full p-6 text-center">
              <div className="flex justify-center">
                <span className="border w-14 border-gray-960 border-solid flex justify-center items-center rounded-xl p-3 bg-white">
                  {resetPassword ? <CheckIcon01 /> : <LockIcon className="text-gray-700 size-6" />}
                </span>
              </div>
              <h4 className="max-w-xs text-3xl font-semibold leading-xxxl mt-6 text-gray-900">
                {resetPassword ? 'Password reset' : 'Set new password'}
              </h4>
              <p className="max-w-xs text-base-regular text-center leading-6	text-gray-600 mt-4">
                {resetPassword
                  ? 'Your password has been successfully reset. Click below to log in magically.'
                  : 'Your new password must be different to previously used passwords.'}
              </p>
              {errorMsg !== '' && (
                <div className="text-rose-600 mt-5 text-base">{errorMsg + '*'}</div>
              )}
            </div>

            <div className="px-6 pb-6 flex flex-col gap-6">
              {!resetPassword && (
                <>
                  <CustomInput
                    size="md"
                    placeholder="Enter your OTP"
                    label="OTP"
                    type="number" 
                    error={errors.code?.message}
                    className={`${errors.code?.message && 'my-2'} w-full`}
                    {...register('code')}
                  />
                  <CustomInput
                    size="md"
                    placeholder="Enter your new password"
                    label="Password"
                    type="password"
                    error={errors.password?.message}
                    className={`${errors.password?.message && 'my-2'} w-full`}
                    {...register('password')}
                  />
                  <CustomInput
                    size="md"
                    placeholder="Re-enter your new password"
                    label="Confirm password"
                    type="password"
                    error={errors.confirmPassword?.message}
                    className={`${errors.confirmPassword?.message && 'my-2'} w-full`}
                    {...register('confirmPassword')}
                  />
                  <div className="flex flex-col items-start self-stretch gap-3">
                    <div className="text-sm font-normal text-gray-600 flex items-center leading-5">
                      <span
                        className={clsx(
                          ' rounded-full w-5 h-5 me-2 text-center flex justify-center items-center bg-gray-300'
                        )}
                      >
                        <CheckIcon />
                      </span>
                      Must be at least 8 characters
                    </div>
                    <div className="text-sm font-normal text-gray-600 flex items-center leading-5	">
                      <span
                        className={clsx(
                          'rounded-full w-5 h-5 me-2 text-center flex justify-center items-center bg-gray-300'
                        )}
                      >
                        <CheckIcon />
                      </span>
                      Must contain one special character
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="px-6 flex flex-col gap-8">
              <Button
                size="lg"
                className="w-full bg-brand-970 hover:bg-brand-960 text-base font-semibold rounded-lg mt-3"
                onClick={handleSubmit(onSubmit)}
              >
                {resetPassword ? 'Continue' : 'Reset password'}
              </Button>
              <Link to={APP_PATHS.login.get()} className="flex justify-center">
                <ArrowNarrowLeftIcon className="text-gray-600 me-2" />
                <div className="text-sm-semibold text-gray-600">Back to login</div>
              </Link>
            </div>
          </Box>
        </div>
      </div>
    </>
  );
}
