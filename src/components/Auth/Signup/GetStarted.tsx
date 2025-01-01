import { Avatar, Button, Group, Image, Input, Rating, Text } from '@mantine/core';
import { CustomInput } from '@utils/CustomInput';
import { Controller, useForm } from 'react-hook-form';
import { AlertCircleIcon, GoogleIcon } from '@assets/iconComponents';
import { useEffect, useState } from 'react';
import { LoaderCircle } from '@components/LoaderCircle';
import { Link, useNavigate } from 'react-router-dom';
import { APP_PATHS } from '@routes/app-paths';
import logo from '@assets/img/logo.png';
import { IRegister } from '@interfaces/register.interface';
import SvgStars01 from '@assets/iconComponents/Stars01';
import avatar1 from '@assets/img/avatar/01.png';
import avatar2 from '@assets/img/avatar/02.png';
import avatar3 from '@assets/img/avatar/03.png';
import avatar4 from '@assets/img/avatar/04.png';
import avatar5 from '@assets/img/avatar/05.png';
import { createRequest, getGoogleUrl } from '@api/Base.api';
import { API } from '@constants/api.constant';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { setSignUpData } from '@stores/authSlice';
import { registerSchema } from '../schemas';
import { IMaskInput } from 'react-imask';
import clsx from 'clsx';

interface props {
  handlers: {
    increment: () => void;
    decrement: () => void;
    set: (value: number) => void;
  };
}

const initialValues = {
  name: '',
  email: '',
  phone: '',
  password: '',
  cpassword: '',
};

export function GetStarted({ handlers }: props) {
  const navigate = useNavigate();
  let newWindow: any = null;
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  const avatarImgArr = [avatar1, avatar2, avatar3, avatar4, avatar5];
  const {
    register,
    handleSubmit,
    formState: { errors },
    ...form
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: initialValues,
  });

  const onSubmit = (values: IRegister) => {
    setVisible(true);
    const userData = { ...values };
    delete userData.cpassword;
    createRequest(API.SIGNUP.GET_STARTED, 'POST', userData)
      .then((res) => {
        dispatch(setSignUpData({ ...userData, user_id: res?.user_id }));
        setVisible(false);
        handlers.increment();
      })
      .catch((err) => {
        setVisible(false);
      });
  };

  useEffect(() => {
    window.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        // if (data?.fresh_user) {
        dispatch(setSignUpData({ ...data, user_id: data?.id, isGoogleSignIn: true }));
        handlers.set(3);
        // } else {
        //   setNonObjectItemStorage(storagekeysEnum.AUTH_TOKEN, data?.token);
        //   navigate(APP_PATHS.properties.get());
        // }
      } catch (error) {}
    });
  }, []);

  const signUpWithGoogle = () => {
    setVisible(true);
    getGoogleUrl()
      .then((res) => {
        setVisible(false);
        const popupWidth = 700;
        const popupHeight = 500;
        if (window.top !== null) {
          const top = window?.top?.outerHeight / 2 + window.top.screenY - popupHeight / 2;
          let left = window?.top?.outerWidth / 2 + window.top.screenX - popupWidth / 2;
          if (window.screen.width > 1800) {
            left = 400;
          }
          newWindow = window.open(
            res.url,
            '_blank',
            `width=${popupWidth},height=${popupHeight},left=${left},top=${top},resizable=no,scrollbars=no,toolbar=no,location=no,status=no,menubar=no`
          );

          if (newWindow === null) {
            alert(
              'The pop-up was blocked by the browser. Please disable the pop-up blocker and try again.'
            );
          }
        }
      })
      .catch((err) => {});
  };

  return (
    <>
      <div className="flex min-h-screen relative">
        <LoaderCircle visible={visible} />
        <div className="basis-2/5 py-4 justify-evenly flex p-0 flex-col content-center items-center flex-0 self-stretch">
          <div className="flex flex-col items-start flex-wrap content-center self-stretch px-10">
            <div className="flex max-w-xs w-full flex-col items-start gap-1">
              <div className="flex content-center items-start mb-3">
                <Image src={logo} alt="missing logo" className="w-12 h-12" />
              </div>
              <div className="flex gap-3 flex-col items-start self-stretch">
                <Text className="text-gray-900 text-3xl leading-xxxl font-semibold tracking-sm">
                  Sign up
                </Text>
                <Text className="text-gray-600 text-base font-normal">
                  Start your 30-day free trial.
                </Text>
              </div>
              <div className="flex flex-col items-start self-stretch gap-1.5">
                <div className="flex flex-col items-start self-stretch gap-2">
                  <CustomInput
                    size="sm"
                    placeholder="Enter your name"
                    label="Name*"
                    classNames={{ input: '!h-9' }}
                    type="text"
                    error={errors.name?.message}
                    className={`${errors.name?.message && 'mb-2'} w-full `}
                    {...register('name')}
                    onBlur={() => form.trigger('name')}
                  />
                  <CustomInput
                    size="sm"
                    placeholder="Enter your email"
                    type="text"
                    label="Email*"
                    classNames={{ input: '!h-9' }}
                    error={errors.email?.message}
                    className={`${errors.email?.message && 'mb-2'} w-full mt-1`}
                    {...register('email')}
                    onBlur={() => form.trigger('email')}
                  />

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
                          size="sm"
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
                          //   console.log("vdkjbvkjvbk", e.currentTarget.value);
                            
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

                  <div className="flex flex-col items-start self-stretch gap-1.5">
                    <CustomInput
                      classNames={{ input: '!h-9' }}
                      size="sm"
                      placeholder="Create a password"
                      label="Password*"
                      type="password"
                      error={errors.password?.message}
                      className={`${errors.password?.message && 'mb-2'} w-full mt-1`}
                      {...register('password')}
                      onChange={async(e) => {
                        form.setValue('password', e.target.value);  
                        await form.trigger('password');                      
                        if(form.getValues('cpassword')) {
                          await form.trigger('cpassword');
                        }
                      }}
                      onBlur={() => form.trigger('password')}
                    />
                    {!errors.password?.message && (
                      <div className="text-sm font-normal text-gray-600 leading-5	">
                        Must be at least 8 characters.
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-start self-stretch gap-1.5">
                    <CustomInput
                      classNames={{ input: '!h-9' }}
                      size="sm"
                      placeholder="Create a password"
                      label="Confirm password*"
                      type="password"
                      error={errors.cpassword?.message}
                      className={`${errors.cpassword?.message && 'mb-2'} w-full mt-1`}
                      {...register('cpassword')}
                      onChange={async(e) => {
                        form.setValue('cpassword', e.target.value);
                        await form.trigger('cpassword');
                      }}
                      onBlur={() => form.trigger('cpassword')}
                    />
                    {!errors.cpassword?.message && (
                      <div className="text-sm font-normal text-gray-600 leading-5	">
                        Must be at least 8 characters.
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-start self-stretch gap-2 mt-1">
                  <Button
                    size="md"
                    className={clsx(
                      'leading-6 w-full bg-brand-970 hover:bg-brand-960 text-base font-semibold rounded-lg h-9',
                      errors.cpassword?.message && 'mt-2.5'
                    )}
                    onClick={handleSubmit(onSubmit)}
                  >
                    Get started
                  </Button>

                  <Button
                    type="button"
                    size="md"
                    leftSection={<GoogleIcon />}
                    variant="default"
                    className="rounded-lg w-full h-9"
                    onClick={signUpWithGoogle}
                  >
                    Sign up with Google
                  </Button>
                </div>
              </div>
              <div className="flex items-baseline justify-center w-full gap-1 mt-1">
                <Text className="text-gray-600 text-sm font-normal leading-5">
                  Already have an account?
                </Text>
                <Link
                  className="leading-5 text-[#363F72] text-sm font-semibold	"
                  to={APP_PATHS.login.get()}
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="basis-3/5 flex flex-wrap flex-col items-center justify-center px-24 content-center p-0 min-h-screen bg-gradient-signup">
          <div></div>
          <div className="basis-8/12 self-stretch max-w-screen-sm	 flex flex-wrap flex-col items-start gap-12">
            <div>
              <SvgStars01 />
            </div>
            <div className="flex flex-col items-center gap-6 self-stretch">
              <Text className="text-white text-7xl font-semibold leading-d-xl">
                Start turning your ideas into reality.
              </Text>
              <Text className="font-medium text-xl text-brand-110 leading-xxl">
                Create a free account and get full access to all features for 30-days. No credit
                card needed. Trusted by over 4,000 professionals.
              </Text>
            </div>
            <div className="flex items-center gap-4">
              <Avatar.Group>
                {avatarImgArr.map((item, i) => (
                  <Avatar key={i} src={item} alt="it's me" />
                ))}
              </Avatar.Group>
              <div className="flex flex-col items-center gap-1">
                <div>
                  <Group className="flex gap-2">
                    <Rating
                      fractions={1}
                      defaultValue={5}
                      readOnly
                      classNames={{ symbolGroup: 'ml-1' }}
                    />
                    <div className="text-white font-semibold text-base">5.0</div>
                  </Group>
                </div>
                <div className="text-brand-110 text-base font-medium">from 200+ reviews</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
