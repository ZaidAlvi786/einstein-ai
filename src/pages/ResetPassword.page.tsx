import { Button, Box, PasswordInput } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowNarrowLeftIcon, CheckIcon, CheckIcon01, LockIcon } from '@assets/iconComponents';
import { passwordSchema } from '@components/Auth/schemas';
import { APP_PATHS } from '@routes/app-paths';
import { Link, useNavigate } from 'react-router-dom';
import { LoaderCircle } from '@components/LoaderCircle';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { clsx } from 'clsx';

interface ResetPasswordData {
  password: string;
}
export function ResetPassword() {
  const [visiblePassword, { toggle }] = useDisclosure(false);
  const [visible, setVisible] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });
  const onSubmit = (values: ResetPasswordData) => {
    setResetPassword(true);
  };

  return (
    <>
      <div className='flex justify-center min-h-screen'>
        <div className="flex flex-col bg-white rounded-xl sm:w-full sm:max-w-md py-10">
          <Box pos="relative">
            <LoaderCircle visible={visible} />
            <div className=" bg-[url(/src/assets/patterns/grid-sqaure1.svg)]  bg-cover self-center w-full p-6 text-center">
              <div className="flex justify-center">
                <span className="border w-14 border-gray-960 border-solid flex justify-center items-center rounded-lg p-3 bg-white">
                  {resetPassword ? <CheckIcon01 /> : <LockIcon className="text-gray-700 size-6" />}
                </span>
              </div>
              <h4 className="text-3xl	font-semibold mt-1">
                {resetPassword ? 'Password reset' : 'Set new password'}
              </h4>
              <p className="text-base-regular text-gray-600 mt-4">

                {resetPassword
                  ? 'Your password has been successfully reset. Click below to log in magically.'
                  : 'Your new password must be different to previously used passwords.'}
              </p>
              {errorMsg !== '' && (
                <div className="text-rose-600 mt-5 text-base">{errorMsg + '*'}</div>
              )}
            </div>

            <div className="px-6 pb-6 flex flex-col gap-3">
              {!resetPassword && (
                <>
                  <PasswordInput
                    label="Password"
                    placeholder="Enter your new password"
                    visible={visiblePassword}
                    {...register('password')}
                    onVisibilityChange={toggle}
                    error={errors.password?.message}
                    classNames={{
                      input: clsx('h-11 '),
                    }}
                  />
                  <PasswordInput
                    label="Confirm password"
                    placeholder="Re-enter your new password"
                    visible={visiblePassword}
                    onVisibilityChange={toggle}
                    {...register('confirmPassword')}
                    className="mt-4"
                    classNames={{
                      input: clsx('h-11 placeholder:text-gray-500'),
                    }}
                    error={errors.confirmPassword?.message}
                  />
                  <div className="text-sm font-normal text-gray-600 mt-6 flex items-center">
                    <span
                      className={clsx(
                        ' rounded-full w-5 h-5 me-2 text-center flex justify-center items-center bg-gray-300'
                      )}
                    >
                      <CheckIcon />
                    </span>
                    Must be at least 8 characters
                  </div>
                  <div className="text-sm font-normal text-gray-600 flex items-center">
                    <span
                      className={clsx(
                        'rounded-full w-5 h-5 me-2 text-center flex justify-center items-center bg-gray-300'
                      )}
                    >
                      <CheckIcon />
                    </span>
                    Must contain one special character
                  </div>
                </>
              )}
              <Button
                size="lg"
                className="w-full bg-brand-970 hover:bg-brand-960 text-base font-semibold rounded-lg mt-3"
                onClick={handleSubmit(onSubmit)}
              >
                {resetPassword ? 'Continue' : 'Reset password'}
              </Button>
            </div>
            <Link to={APP_PATHS.login.get()} className="flex justify-center">
              <ArrowNarrowLeftIcon className="text-gray-600 me-2" />
              <div className="text-sm-semibold text-gray-600">Back to login</div>
            </Link>
          </Box>
        </div>
      </div>
    </>
  );
}
