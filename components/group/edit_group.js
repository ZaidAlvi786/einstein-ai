import React, { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEditGroupMutation } from "@/app/lib/features/chat/chatApi";
import { useAuth } from "@/app/authContext/auth";
import { useAppSelector } from "@/app/lib/hooks";
import toast from "react-hot-toast";
// import ToastService from "../Toaster/toastService";

function Edit_Group({ addOrEditGroup, setAddOrEditGroup }) {

    const auth = useAuth();
    const activeWorkspace = useAppSelector(state => state.workspace.activeWorkspace);
    const [EditGroup] = useEditGroupMutation();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const EditGroupValidationSchema = Yup.object({
        name: Yup.string().trim().max(255, "Group name must not be greater than 255 characters.").required("Group name field is required."),
    });

    const formik = useFormik({
        initialValues: { name: addOrEditGroup?.groupInfo?.name ?? "" },
        validationSchema: EditGroupValidationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { resetForm }) => {
            setIsSubmitting(true);

            const data = {
                group_id: addOrEditGroup?.groupInfo?.group_id,
                data: {
                    name: values?.name?.trim(),
                    user_id: auth?.user?.userID,
                    workspace_id: activeWorkspace?._id
                }
            };

            EditGroup(data).unwrap()
                .then((response) => {
                    setAddOrEditGroup({ mode: "", groupInfo: null });
                    resetForm();
                    toast.success("Group Renamed Successfully!");
                })
                .catch((error) => {
                    console.log("Error : ", error);
                    if (error?.data?.message) {
                        toast.error(error?.data?.message);
                    }
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        },
    });

    const HandleGroupClose = () => {
        if (isSubmitting === false) {
            setAddOrEditGroup({ mode: "", groupInfo: null });
            formik.resetForm();
        }
    }

    return (<>
        <li className={`flex gap-3 mb-1 justify-between items-center px-[8px] cursor-pointer rounded-lg transition-all`}>
            <div className="flex justify-between items-center w-full py-1">
                <Input
                    className="border-none after:hidden"
                    type="text"
                    placeholder="New Group"
                    variant="underlined"
                    classNames={{
                        inputWrapper:
                            "border-none after:hidden m-0 !p-0 !h-[auto] min-h-[0] shadow-none",
                        innerWrapper: "!h-[auto] pb-0",
                        input:
                            "font-bold mb-0 text-[#585858] text-sm font-helvetica caret-white",
                    }}
                    endContent={
                        <div className="flex justify-between items-center w-[20px] cursor-pointer" onClick={HandleGroupClose}>
                            {isSubmitting ?
                                <Button className="!p-0 !m-0 !h-[20px] !min-w-unit-5 !bg-transparent" color="default" isLoading></Button>
                                :
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 18" fill="none">
                                    <path fill="#6A6A6A" d="M10.1665 9.00805L17.762 1.43822C18.0793 1.11791 18.0793 0.598995 17.762 0.278681C17.4503 -0.0473594 16.9355 -0.0571515 16.6118 0.256802L9.01628 7.82663L1.51839 0.256802C1.36467 0.0928811 1.15078 0 0.927025 0C0.703266 0 0.489378 0.0928811 0.335658 0.256802C0.0543006 0.566276 0.0543006 1.04123 0.335658 1.35071L7.83354 8.9096L0.238001 16.4685C-0.0793336 16.7888 -0.0793336 17.3077 0.238001 17.628C0.389074 17.784 0.596845 17.871 0.813092 17.8687C1.03351 17.8867 1.25202 17.8159 1.42074 17.6718L9.01628 10.102L16.6118 17.7593C16.7629 17.9153 16.9707 18.0022 17.1869 18C17.4029 18.001 17.6102 17.9142 17.762 17.7593C18.0793 17.439 18.0793 16.9201 17.762 16.5998L10.1665 9.00805Z" />
                                </svg>
                            }

                        </div>
                    }
                    name="name"
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
        </li>
       {/* Toast is working with other service */}
      {/* <ToastService/> */}  
    </>);
}

export default Edit_Group;
