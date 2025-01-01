import { useAuth } from '@/app/authContext/auth';
import { useAddLikeOnToolMutation, useDeactivateToolLikeMutation } from '@/app/lib/features/chat/chatApi';
import { Button } from '@nextui-org/react';
import { useFormik } from 'formik';
import Link from 'next/link';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import ToastService from '../Toaster/toastService';

const ToolsLikesComponent = ({ tool_id, isAlreadyLiked }) => {

    const auth = useAuth();
    const [isSubmitting, setSubmitting] = useState(false);
    const [like, setLike] = useState(isAlreadyLiked ?? false);
    const [AddLikeOnTool] = useAddLikeOnToolMutation();
    const [DeactivateToolLike] = useDeactivateToolLikeMutation();

    const addToolsLikesFormik = useFormik({
        initialValues: { tool_id: tool_id ?? "" },
        onSubmit: async (values, { resetForm }) => {
            setSubmitting(true);

            const data = { ...values };

            AddLikeOnTool(data).unwrap()
                .then((response) => {
                    resetForm();
                    setLike(pre => !pre);
                    toast.success(response.message);
                })
                .catch((error) => {
                    setLike(pre => pre);
                    toast.error((error?.data?.message ?? error?.message) || "Something went wrong");
                })
                .finally(() => {
                    setSubmitting(false);
                });
        },
    });

    const removeToolsLikesFormik = useFormik({
        initialValues: { tool_id: tool_id ?? "" },
        onSubmit: async (values, { resetForm }) => {
            setSubmitting(true);

            const data = { ...values };

            DeactivateToolLike(data).unwrap()
                .then((response) => {
                    resetForm();
                    setLike(pre => !pre);
                    toast.success(response?.message);
                })
                .catch((error) => {
                    setLike(pre => pre);
                    toast.error((error?.data?.message ?? error?.message) || "Something went wrong");
                })
                .finally(() => {
                    setSubmitting(false);
                });
        },
    });

    return (<>
        {(auth?.user?.email && auth?.user?.fullname) ? (
            <Button
                className={`h-auto w-auto bg-transparent min-w-6 p-0`}
                onPress={like ? removeToolsLikesFormik.handleSubmit : addToolsLikesFormik.handleSubmit}
                isLoading={isSubmitting}
            >
                {!isSubmitting && (
                    <div className='cursor-pointer' style={{ position: 'relative', width: '24px', height: '24px' }}>
                        <svg
                            className={`transition-opacity duration-300 ease-in-out ${like ? 'opacity-100' : 'opacity-0'}`}
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            style={{ position: 'absolute', top: 0, left: 0 }}
                        >
                            <path d="M22.1 9.1C22 5.7 19.3 3 15.9 3C14.8 3 13.1 3.8 12.4 5.1C12.3 5.4 11.9 5.4 11.8 5.1C11 3.9 9.4 3.1 8.2 3.1C4.9 3.1 2.1 5.8 2 9.1V9.3C2 11 2.7 12.6 3.9 13.8C3.9 13.8 3.9 13.8 3.9 13.9C4 14 8.8 18.2 11 20.1C11.6 20.6 12.5 20.6 13.1 20.1C15.3 18.2 20 14 20.2 13.9C20.2 13.9 20.2 13.9 20.2 13.8C21.4 12.7 22.1 11.1 22.1 9.3V9.1Z" fill="white" />
                        </svg>
                        <svg
                            className={`transition-opacity duration-300 ease-in-out ${like ? 'opacity-0' : 'opacity-100'}`}
                            xmlns="http://www.w3.org/2000/svg"
                            width="23"
                            height="23"
                            viewBox="0 0 23 23"
                            fill="none"
                            style={{ position: 'absolute', top: 0, left: 0 }}
                        >
                            <path d="M11.2746 19.3823C10.8087 19.3823 10.2496 19.1959 9.87692 18.8232C3.8201 13.5118 3.72692 13.4186 3.72692 13.3254L3.63373 13.2323C2.51555 12.1141 1.86328 10.53 1.86328 8.9459V8.75953C1.95646 5.40499 4.65873 2.7959 8.01328 2.7959C9.03828 2.7959 10.436 3.35499 11.2746 4.47317C12.1133 3.35499 13.6042 2.7959 14.6292 2.7959C17.9837 2.7959 20.5928 5.40499 20.7792 8.75953V8.9459C20.7792 10.6232 20.1269 12.1141 19.0087 13.3254L18.9156 13.4186C18.8224 13.5118 18.0769 14.1641 12.7656 18.9164C12.2996 19.1959 11.8337 19.3823 11.2746 19.3823ZM5.12464 13.0459C5.49737 13.4186 7.36101 14.7232 10.8087 17.705C11.0883 17.9845 11.461 17.9845 11.7406 17.705C15.2815 14.5368 17.3315 12.7664 17.7974 12.3936L17.8906 12.3004C18.8224 11.3686 19.2883 10.1573 19.2883 8.9459V8.75953C19.1951 6.15044 17.1451 4.19363 14.536 4.19363C13.8837 4.19363 12.5792 4.65953 12.1133 5.68453C11.9269 6.05726 11.5542 6.24363 11.1815 6.24363C10.8087 6.24363 10.436 6.05726 10.2496 5.68453C9.78374 4.75272 8.57237 4.19363 7.82692 4.19363C5.31101 4.19363 3.16783 6.24363 3.07464 8.75953V9.03908C3.07464 10.2504 3.63374 11.4618 4.47237 12.3004L5.12464 13.0459Z" fill="white" />
                        </svg>
                    </div>
                )}
            </Button>
        ) : (
            <Button
                as={Link}
                href='/signin'
                className={`h-auto w-auto bg-transparent min-w-6 p-0`}
            >
                <div className='cursor-pointer' style={{ position: 'relative', width: '24px', height: '24px' }}>
                    <svg
                        className={`transition-opacity duration-300 ease-in-out ${like ? 'opacity-100' : 'opacity-0'}`}
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        style={{ position: 'absolute', top: 0, left: 0 }}
                    >
                        <path d="M22.1 9.1C22 5.7 19.3 3 15.9 3C14.8 3 13.1 3.8 12.4 5.1C12.3 5.4 11.9 5.4 11.8 5.1C11 3.9 9.4 3.1 8.2 3.1C4.9 3.1 2.1 5.8 2 9.1V9.3C2 11 2.7 12.6 3.9 13.8C3.9 13.8 3.9 13.8 3.9 13.9C4 14 8.8 18.2 11 20.1C11.6 20.6 12.5 20.6 13.1 20.1C15.3 18.2 20 14 20.2 13.9C20.2 13.9 20.2 13.9 20.2 13.8C21.4 12.7 22.1 11.1 22.1 9.3V9.1Z" fill="white" />
                    </svg>
                    <svg
                        className={`transition-opacity duration-300 ease-in-out ${like ? 'opacity-0' : 'opacity-100'}`}
                        xmlns="http://www.w3.org/2000/svg"
                        width="23"
                        height="23"
                        viewBox="0 0 23 23"
                        fill="none"
                        style={{ position: 'absolute', top: 0, left: 0 }}
                    >
                        <path d="M11.2746 19.3823C10.8087 19.3823 10.2496 19.1959 9.87692 18.8232C3.8201 13.5118 3.72692 13.4186 3.72692 13.3254L3.63373 13.2323C2.51555 12.1141 1.86328 10.53 1.86328 8.9459V8.75953C1.95646 5.40499 4.65873 2.7959 8.01328 2.7959C9.03828 2.7959 10.436 3.35499 11.2746 4.47317C12.1133 3.35499 13.6042 2.7959 14.6292 2.7959C17.9837 2.7959 20.5928 5.40499 20.7792 8.75953V8.9459C20.7792 10.6232 20.1269 12.1141 19.0087 13.3254L18.9156 13.4186C18.8224 13.5118 18.0769 14.1641 12.7656 18.9164C12.2996 19.1959 11.8337 19.3823 11.2746 19.3823ZM5.12464 13.0459C5.49737 13.4186 7.36101 14.7232 10.8087 17.705C11.0883 17.9845 11.461 17.9845 11.7406 17.705C15.2815 14.5368 17.3315 12.7664 17.7974 12.3936L17.8906 12.3004C18.8224 11.3686 19.2883 10.1573 19.2883 8.9459V8.75953C19.1951 6.15044 17.1451 4.19363 14.536 4.19363C13.8837 4.19363 12.5792 4.65953 12.1133 5.68453C11.9269 6.05726 11.5542 6.24363 11.1815 6.24363C10.8087 6.24363 10.436 6.05726 10.2496 5.68453C9.78374 4.75272 8.57237 4.19363 7.82692 4.19363C5.31101 4.19363 3.16783 6.24363 3.07464 8.75953V9.03908C3.07464 10.2504 3.63374 11.4618 4.47237 12.3004L5.12464 13.0459Z" fill="white" />
                    </svg>
                </div>
            </Button>
        )}
        <ToastService />
    </>);
}

export default ToolsLikesComponent