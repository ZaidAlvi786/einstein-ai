import { Button, Group, Checkbox, Anchor, Text, Image } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { GoogleIcon } from '@assets/iconComponents';
import { loginSchema } from '@components/Auth/schemas';
import { CustomInput } from '@utils/CustomInput';
import { createRequest, getGoogleUrl } from '@api/Base.api';
import { APP_PATHS } from '@routes/app-paths';
import { Link, createSearchParams, useNavigate } from 'react-router-dom';
import { LoaderCircle } from '@components/LoaderCircle';
import { useEffect, useState } from 'react';
import { storagekeysEnum } from '@enums/storage.enum';
import { setNonObjectItemStorage } from '@helpers/storage.helper';
import slider1 from '@assets/img/loginSlider.png';
import PaginationSlider from '@utils/SliderPagination';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import '@css/slider.scss'; // Import your CSS file for styling
import { API } from '@constants/api.constant';
import { setUserLoginData } from '@helpers/global.helper';
import { useDispatch } from 'react-redux';
import { setSignUpData } from '@stores/authSlice';
import logo from '@assets/img/logo.png';

interface LoginData {
  email: string;
  password: string;
}

export function LoginPage() {
  const SECRET_KEY = import.meta.env.VITE_APP_SECRET_KEY; // Load the secret key from environment

  const navigate = useNavigate();
  const sliderData = [slider1, slider1, slider1, slider1];

  const [visible, setVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [sliderImg, setSliderimg] = useState(sliderData[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();


  const onPageChange = (index: number) => {
    setCurrentIndex(index);
    setSliderimg(sliderData[index]);
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    window.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);        
        // if (data?.fresh_user) {
        //   dispatch(setSignUpData({ ...data, user_id: data?.id, isGoogleSignIn: true }));
        //   navigate({
        //     pathname: APP_PATHS.signup.get(),
        //     search: createSearchParams({
        //       google_signin: "true"
        //     }).toString()
        //   });
        // } else {
          setNonObjectItemStorage(storagekeysEnum.AUTH_TOKEN, data?.token);
          navigate(APP_PATHS.properties.get());

        // }  
      } catch (error) {
      }
    });
  }, []);

  useEffect(() => {
    setUserLoginData(setRememberMe, setValue);
  }, [setRememberMe, setValue]);

  const onSubmit = (values: LoginData) => {
    setVisible(true);
    const params = new URLSearchParams();
    params.append('username', values.email);
    params.append('password', values.password);

    createRequest(API.LOGIN, 'POST', params, 'application/x-www-form-urlencoded')
      .then((res) => {
        setNonObjectItemStorage(storagekeysEnum.AUTH_TOKEN, res?.access_token);
        setVisible(false);
        navigate(APP_PATHS.properties.get());
        if (rememberMe) {
          const encryptedEmail = CryptoJS.AES.encrypt(values.email, SECRET_KEY).toString();
          const encryptedPassword = CryptoJS.AES.encrypt(values.password, SECRET_KEY).toString();
          Cookies.set('email', encryptedEmail, { expires: 30 });
          Cookies.set('password', encryptedPassword, { expires: 30 });
        } else {
          Cookies.remove('email');
          Cookies.remove('password');
        }
      })
      .catch((error) => {
        setVisible(false);
        setErrorMsg(error?.response?.data?.detail);
      });
  };

  const signInWithGoogle = () => {
    let newWindow: any = null;
    setVisible(true);
    getGoogleUrl().then((res) => {
      setVisible(false);
      const popupWidth = 700;
      const popupHeight = 500;
      if (window.top !== null) {
        const top = window?.top?.outerHeight / 2 + window.top.screenY - (popupHeight / 2);
        let left = window?.top?.outerWidth / 2 + window.top.screenX - (popupWidth / 2);
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
    }).catch((err) => { })
  }


  return (
    <>
      <div className="flex items-center min-h-screen relative">
        <LoaderCircle visible={visible} />
        <div className="basis-6/12 mt-12 justify-evenly flex p-0 flex-col content-center items-center flex-0 self-stretch">
          {errorMsg !== '' && <div className="text-rose-600 mt-5 text-base">{errorMsg + '*'}</div>}
          <div className="flex flex-col items-center justify-center flex-0 self-stretch flex-wrap px-8 content-center">
            <div className="flex flex-col items-start flex-wrap content-center gap-16	self-stretch max-w-xs w-full">
              <div className="flex w-34 content-center items-start gap-2.5">
                <Image src={logo} alt="missing logo" />
              </div>
              <div className="flex flex-col items-start gap-8 w-full">
                <div className="flex gap-3 flex-col items-start self-stretch">
                  <Text className="leading11 text-gray-900 text-4xl	font-semibold tracking-sm">
                    Log in
                  </Text>
                  <Text className="text-gray-600 text-base font-normal	">
                    Welcome back! Please enter your details.
                  </Text>
                </div>
                <div className="flex flex-col items-start self-stretch gap-6">
                  <div className="flex flex-col items-start self-stretch gap-5">
                    <CustomInput
                      onMouseDown={() => {
                        setErrorMsg('');
                      }}
                      size="md"
                      placeholder="Enter your email"
                      label="Email"
                      type="text"
                      error={errors.email?.message}
                      className={`${errors.email?.message && 'my-2'} w-full`}
                      {...register('email')}
                    />

                    <CustomInput
                      onMouseDown={() => {
                        setErrorMsg('');
                      }}
                      size="md"
                      placeholder="••••••••"
                      label="Password"
                      type="password"
                      error={errors.password?.message}
                      className={`${errors.password?.message && 'my-2'} w-full`}
                      {...register('password')}
                    />
                  </div>

                  <div className="w-full">
                    <Group className=" w-full" justify="space-between">
                      <Checkbox
                        size="sm"
                        className="text-sm-medium text-gray-700 "
                        label="Remember for 30 days"
                        classNames={{ label: 'p-0', body: 'gap-2' }}
                        onChange={(e) => setRememberMe(e.currentTarget.checked)}
                        checked={rememberMe}
                      />
                      <Anchor
                        component="button"
                        size="sm"
                        className="text-sm-semibold text-[#363F72]"
                      >
                        <Link className="text-[#363F72]" to={APP_PATHS.forgotPassword.get()}>
                          Forgot password
                        </Link>
                      </Anchor>
                    </Group>
                  </div>
                  <div className="flex flex-col items-start self-stretch gap-4">
                    <Button
                      className="w-full bg-brand-970 border-solid border-brand-970	 hover:bg-brand-960 text-base font-semibold rounded-lg"
                      onClick={handleSubmit(onSubmit)}
                    >
                      Sign in
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      onClick={signInWithGoogle}
                      leftSection={<GoogleIcon />}
                      variant="default"
                      className="rounded-lg w-full text-base text-[#344054]"
                    >
                      Sign in with Google
                    </Button>
                  </div>
                </div>
                <div className="flex items-baseline justify-center w-full gap-1">
                  <Text className="leading-5 text-gray-600 text-sm font-normal">
                    Don’t have an account?
                  </Text>
                  <Link
                    className="text-[#363F72] text-sm font-semibold leading-5"
                    to={APP_PATHS.signup.get()}
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="flex p-8 items-end self-stretch h-24">
            <p className="text-gray-600 text-sm font-normal	leading-5">© Untitled UI 2077</p>
          </div>
        </div>
        <div className="basis-6/12 flex  bg-gradient-multiple-svgs self-stretch">
          <div className="justify-center flex flex-wrap flex-col content-center items-center gap-12	pt-3 pe-8 ps-24">
            <div>
              <div className="carousel">
                <div className="slides">
                  {sliderData.map((item, index) => (
                    <div
                      key={index}
                      className={`slide ${index === currentIndex ? 'active fade-in-out' : ''}`}
                      style={{ transform: `translateX(${index * 100}%)` }}
                    >
                      <Image src={sliderImg} alt="" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Text className="text-white text-center leading-xxl text-xl	font-medium	">
                Welcome to your new dashboard
              </Text>
              <Text className="text-center text-base text-brand-110	font-medium">
                Sign in to explore changes we’ve made.
              </Text>
            </div>
            <div>
              <PaginationSlider total={sliderData.length} onPageChange={onPageChange} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
