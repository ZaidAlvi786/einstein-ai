import { createRequest } from "@api/Base.api";
import { Phone01 } from "@assets/iconComponents";
import { LoaderCircle } from "@components/LoaderCircle";
import { API } from "@constants/api.constant";
import { yupResolver } from "@hookform/resolvers/yup";
import { Anchor, Button, PinInput, Text } from "@mantine/core";
import { selectSignupData } from "@stores/authSlice";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import * as yup from 'yup';

interface props {
    onClose: () => void;
    onCancel: () => void;
}


export function PhoneNumberOTP({ onClose, onCancel }: props) {
    const [visible, setVisible] = useState(false);
    const userData = useSelector(selectSignupData);


    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(
            yup.object({
                otp: yup.string().required('OTP is required').length(6, 'OTP is required'),
            })
        ),
    });


    const onSubmit = (values: {otp: string}) => {
        setVisible(true);
        createRequest(
          `${API.SIGNUP.PHONE_VERIFY_OTP}?code=${values.otp}&user_id=${userData?.user_id}`,
          'POST')
          .then((res) => {
            setVisible(false);
            onClose();
          })
          .catch((err) => {
            setVisible(false);
          });
    }

    const resend = () => {
        setVisible(true);
        createRequest(
          `${API.SIGNUP.PHONE_RESEND_OTP}?user_id=${userData?.user_id}`,
          'POST')
          .then((res) => {
            setVisible(false);
          })
          .catch((err) => {
            setVisible(false);
          });
      }

    return (<>
        <div className="relative bg-no-repeat bg-[url(/src/assets/patterns/radial-lines2.svg)] bg-top">
            <LoaderCircle visible={visible} />
            <div className="flex flex-col items-center self-stretch px-6 pt-6">
                <div>
                    <Phone01 />
                </div>
                <div className="flex flex-col items-center self-stretch gap-1 py-6">
                    <div className="text-gray-900 text-center text-lg font-semibold leading-7">
                        Please check your phone number.
                    </div>
                    <div className="text-gray-600 text-center font-normal text-sm leading-5">
                        We've sent a six-digit SMS code to <span className="font-semibold leading-5">{userData?.phone}</span>
                    </div>
                </div>
                <div className="flex flex-col items-start mt-3 gap-1.5	">
                    <Controller
                        control={control}
                        name="otp"
                        render={({ field }) => (
                            <PinInput
                                length={6}
                                type="number"
                                {...field}
                                size="xl"
                                gap="xl"
                                placeholder="0"
                                classNames={{
                                    input: 'text-5xl rounded-lgMd p-2 font-medium w-20	min-h-20 active:border-[#3E4784]  border-solid border-2',
                                }}
                            />
                        )}
                    />
                    {errors.otp && (
                        <p className="mt-4 text-xs text-error-500 self-start">{errors.otp.message}</p>
                    )}
                    <div>

                        <Text className="pt-6 text-sm text-gray-600 leading-5">
                            Didn’t get a code?{' '}
                            <Anchor onClick={resend} className="leading-5 text-sm text-gray-600 underline">
                                Click to resend.
                            </Anchor>
                        </Text>
                    </div>
                </div>

                <div className="pt-8 w-full gap-3 flex self-stretch">
                    <Button
                        size="md"
                        variant="outline"
                        className="bg-white w-1/2 border-gray-300 text-gray-700 text-base font-semibold rounded-lg"
                        onClick={onCancel}
                        classNames={{label: 'text-gray-700'}}
                    >
                        Cancel
                    </Button>
                    <Button
                        size="md"
                        className="bg-brand-970 w-1/2 hover:bg-brand-960 text-base font-semibold rounded-lg"
                        onClick={handleSubmit(onSubmit)}
                    >
                        Verify
                    </Button>
                </div>
            </div>
        </div>
    </>);
}