import React from 'react';
import PlusIconCreate from "@/app/assets/svg/plusiconCreate.svg";
import { Avatar, Button, Input, Spinner } from '@nextui-org/react';
import { useRef } from 'react';
import axiosInstance from '@/app/http/axios';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { useEffect } from 'react';
import { useAuth } from '@/app/authContext/auth';
import { useAddWorkspaceMutation } from '@/app/lib/features/workspace/workspaceApi';
import toast from 'react-hot-toast';
import ToastService from '@/components/Toaster/toastService';

const CreateWorkspaceUsingInput = ({ updateCurrentWorkspace }) => {

    const auth = useAuth();
    const fileInput = useRef();
    const [addWorkspace] = useAddWorkspaceMutation();
    const [isfileSubmitting, setIsFileSubmitting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const CreateWorkSpaceValidationSchema = Yup.object({
        name: Yup.string().trim().max(255, "Workspace name must not be greater than 255 characters.").required("Workspace name field is required.")
    });

    const HandleWorkspaceClose = () => {
        if (!isSubmitting) {
            formik.resetForm();
            setIsEditing(false);
        }
    };

    const formik = useFormik({
        initialValues: { name: "", members: [], logo_url: "" },
        validationSchema: CreateWorkSpaceValidationSchema,
        onSubmit: async (values, { resetForm }) => {
            setIsSubmitting(true);

            const data = {
                user_id: auth?.user?.userID,
                members: values.members,
                name: values?.name?.trim(),
                logo_url: values?.logo_url,
            };

            addWorkspace(data).unwrap()
                .then((response) => {
                    if (!!response.id) {
                        resetForm();
                        HandleWorkspaceClose();
                        if (updateCurrentWorkspace) {
                            updateCurrentWorkspace(response?.id, null);
                        }
                        toast.success(response.message);
                    }
                })
                .catch((error) => {
                    toast.error(error?.data?.message ?? error?.message);
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        },
    });

    const fileOrUrlSchema = Yup.object().shape({
        image: Yup.mixed().required("Image is required.")
            .test("file-type-or-url", "Only JPG, PNG, SVG files or a valid URL are allowed", (value) => {
                if (!value) return true; // If no value provided, validation passes
                if (typeof value === "string") {
                    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
                    if (urlPattern.test(value)) {
                        return true;
                    }
                }
                return ["image/jpeg", "image/png", "image/svg+xml"].includes(value.type);
            }),
    });

    const handleChangeOnWorkspaceImage = (event) => {
        const image = event?.target?.files[0];

        if (image) {
            fileOrUrlSchema.validate({ image }).then(({ image }) => {
                setIsFileSubmitting(true);
                const formData = new FormData();
                formData.append("image", image);

                axiosInstance
                    .post("/ai/uploadImage", formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                    })
                    .then((response) => {
                        const url = response?.data?.url;
                        formik.setFieldValue("logo_url", url);
                    })
                    .catch((error) => {
                        toast.error(error.message);
                    })
                    .finally(() => {
                        setIsFileSubmitting(false);
                    });
            }).catch((error) => {
                toast.error(error.message);
            });
        }
    };

    useEffect(() => {
        const getUserData = (userEmail) => {
            axiosInstance.post(`/auth/getuser`,
                { email: userEmail },
                { headers: { "Content-Type": "application/json" } }
            )
                .then((response) => {
                    formik.setFieldValue("members", [
                        {
                            full_name: response?.data?.data?.full_name ?? "",
                            email: response?.data?.data?.email ?? "",
                            user_id: response?.data?.data?._id ?? "",
                            profile_picture_url: response?.data?.data?.profile_picture_url ?? "",
                            role: "owner",
                            status: "active",
                        },
                    ]);
                })
                .catch((err) => {
        toast.error((err?.message ??  err?.data?.message) || "Something went wrong!")

                });
        };
        const userEmail = auth?.user?.email;
        if (!!userEmail) getUserData(userEmail);
    }, [auth, isEditing]);

    return (<>
        <div className="cursor-pointer">
            {isEditing ? (
                <div className="px-1.5 py-1.5">
                    <Input
                        className="border-none after:hidden"
                        type="text"
                        placeholder="Typing"
                        variant="underlined"
                        classNames={{
                            inputWrapper: "border-none after:hidden m-0 !p-0 !h-[auto] min-h-[0] shadow-none",
                            innerWrapper: "!h-[auto] pb-0",
                            input: "font-bold mb-0 text-[#585858] text-sm font-helvetica caret-white data-[has-start-content=true]:ps-2.5",
                        }}
                        name="name"
                        startContent={<>
                            {isfileSubmitting ? (
                                <Spinner size='sm' color="default" />
                            ) : (
                                <Avatar
                                    src={formik.values.logo_url}
                                    className="w-[27px] h-[24px] cursor-pointer"
                                    onClick={() => fileInput.current.click()}
                                />
                            )}

                            <input ref={fileInput} type="file" className="hidden" onChange={handleChangeOnWorkspaceImage} />
                        </>}
                        endContent={<div className='ms-0.5 me-1 cursor-pointer'>
                            {isSubmitting ? (
                                <Spinner size='sm' color="default" />
                            ) : isEditing ? (
                                <svg onClick={HandleWorkspaceClose} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 18 18" fill="none">
                                    <path fill="#6A6A6A" d="M10.1665 9.00805L17.762 1.43822C18.0793 1.11791 18.0793 0.598995 17.762 0.278681C17.4503 -0.0473594 16.9355 -0.0571515 16.6118 0.256802L9.01628 7.82663L1.51839 0.256802C1.36467 0.0928811 1.15078 0 0.927025 0C0.703266 0 0.489378 0.0928811 0.335658 0.256802C0.0543006 0.566276 0.0543006 1.04123 0.335658 1.35071L7.83354 8.9096L0.238001 16.4685C-0.0793336 16.7888 -0.0793336 17.3077 0.238001 17.628C0.389074 17.784 0.596845 17.871 0.813092 17.8687C1.03351 17.8867 1.25202 17.8159 1.42074 17.6718L9.01628 10.102L16.6118 17.7593C16.7629 17.9153 16.9707 18.0022 17.1869 18C17.4029 18.001 17.6102 17.9142 17.762 17.7593C18.0793 17.439 18.0793 16.9201 17.762 16.5998L10.1665 9.00805Z" />
                                </svg>
                            ) : (<></>)}
                        </div>}
                        value={formik.values?.name?.trimStart()}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        onKeyDown={(e) => {
                            if (e?.key === "Enter") {
                                formik.handleSubmit();
                            }
                        }}
                        disabled={isSubmitting}
                        autoFocus
                    />
                </div>
            ) : (
                <div className="text-gray-700 px-1.5 py-2 flex flex-row border-[#313535] items-center gap-3 rounded-lg group" onClick={() => setIsEditing(true)}>
                    <div className="min-w-6 h-6 rounded-[3px] bg-[#505050] flex items-center justify-center group-hover:bg-[#A5A5A5]">
                        <PlusIconCreate className="w-3.5 h-3.5" />
                    </div>
                    <div className="w-full">
                        <div className="flex items-center justify-between w-full">
                            <p className="flex flex-1 flex-col w-full text-sm text-[#999999] font-helvetica font-normal group-hover:text-[#DBDBDB]">{`Create workspace`}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </>);
}

export default CreateWorkspaceUsingInput;