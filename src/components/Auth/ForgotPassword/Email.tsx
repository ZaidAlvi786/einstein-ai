import { Button, Box, Image } from '@mantine/core';
import { set, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { forgotPasswordSchema } from '@components/Auth/schemas';
import { CustomInput } from '@utils/CustomInput';
import { LoaderCircle } from '@components/LoaderCircle';
import { useState } from 'react';
import { ArrowNarrowLeftIcon, KeyIcon } from '@assets/iconComponents';
import { Link } from 'react-router-dom';
import { APP_PATHS } from '@routes/app-paths';
import { createRequest } from '@api/Base.api';
import { setNonObjectItemStorage } from '@helpers/storage.helper';
import { storagekeysEnum } from '@enums/storage.enum';
import linesBg from '@assets/patterns/transparent-lines.svg';

interface ForgotPasswordData {
  email: string;
}
interface props {
  handlers: {
    increment: () => void;
    decrement: () => void;
  };
}
export function Email({ handlers }: props) {
  const [visible, setVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });
  const onSubmit = (values: ForgotPasswordData) => {
    setVisible(true);
    createRequest(`/api/v1/users/forgot-password/send-otp?user_email=${values.email}`, 'POST')
      .then((res) => {
        setNonObjectItemStorage(storagekeysEnum.userEmail, values.email);
        handlers.increment();
        setVisible(false);
      })
      .catch((error) => {
        setVisible(false);
      });
  };
  return (
    <>
      <div className="flex justify-center relative">
        <img src={linesBg.toString()} alt="lines-bg" className="absolute" />

        <div className="flex flex-col bg-white rounded-xl sm:w-full sm:max-w-md py-10">
          <Box pos="relative" className="mt-97">
            <LoaderCircle visible={visible} />
            <div className="self-center w-full p-6 text-center">
              <div className="flex justify-center">
                <span className="border w-14 border-gray-960 border-solid flex justify-center items-center rounded-xl p-3 bg-white">
                  <KeyIcon />
                </span>
              </div>
              <h4 className="text-3xl font-semibold leading-xxxl mt-5 pt-1 text-gray-900">
                Forgot password?
              </h4>
              <p className="text-base-regular text-gray-600 mt-3 leading-6">
                No worries, we’ll send you reset instructions.
              </p>
              {errorMsg !== '' && (
                <div className="text-rose-600 mt-5 text-base">{errorMsg + '*'}</div>
              )}
            </div>

            <div className="px-10 pb-6 flex flex-col gap-3 ">
              <CustomInput
                onMouseDown={() => {
                  setErrorMsg('');
                }}
                size="md"
                placeholder="Enter your email"
                label="Email"
                type="text"
                error={errors.email?.message}
                className={`${errors.email?.message && 'my-2'} my-5`}
                {...register('email')}
              />
              <Button
                size="lg"
                className="w-full bg-brand-970 hover:bg-brand-960 text-base font-semibold rounded-lg"
                onClick={handleSubmit(onSubmit)}
              >
                Reset password
              </Button>
              <Link to={APP_PATHS.login.get()} className="flex justify-center mt-3 ">
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
