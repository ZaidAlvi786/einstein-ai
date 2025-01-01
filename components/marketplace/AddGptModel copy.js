import { useState, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Input,
  Spinner,
  Textarea,
  Checkbox,
  Avatar,
  Tabs,
  Tab,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAddToolModelGptMutation } from "@/app/lib/features/chat/chatApi";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { EyeSlashIcon, PaperClipIcon } from "@heroicons/react/24/outline";
import PlusIconNew from "@/app/assets/svg/plusicon.svg";
import AttachFileIcon from "@/app/assets/svg/attach_file.svg";
import axiosInstance from "@/app/http/axios";
import toast from "react-hot-toast";
import ToastService from "../Toaster/toastService";

export const chatModelLists = [
  { key: "claude", label: "Claude" },
  { key: "gpt3", label: "GPT-3.5" },
  { key: "gpt4", label: "GPT-4" },
  { key: "gemini", label: "Gemini" },
  { key: "perplexity", label: "Perplexity" },
  { key: "mistral", label: "Mistral" },
];

function AddGptModel({ open, setOpen }) {
  const fileInput = useRef();
  const fileInput1 = useRef();
  const [isfileSubmitting, setIsFileSubmitting] = useState({
    open: false,
    key: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [AddToolModelGpt] = useAddToolModelGptMutation();
  const [initialValues] = useState({
    name: "",
    description: "",
    introtext: "",
    category: open?.category ?? "",
    tags: [],
    url: "",
    logo: "",
    preview_url: [],
    tool_monetization: "free",
    price: {
      monthly: 0,
      annual: 0,
      per_use: 0,
    },
    is_public: false,
    social_links: {
      website: "",
      discord: "",
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
      github: "",
    },
    support_email: "",
    context_window: [""],
    chat_model: "",
    prompt: "",
  });

  const CreateGPTsToolsValidationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .max(255, "Group name must not be greater than 255 characters.")
      .required("Group name field is required."),
    logo: Yup.mixed()
      .required("Logo image is required.")
      .test(
        "file-type-or-url",
        "Only JPG, PNG, SVG files or a valid URL are allowed",
        (value) => {
          if (!value) return true;
          if (typeof value === "string") {
            const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
            if (urlPattern.test(value)) {
              return true;
            }
          }
          return ["image/jpeg", "image/png", "image/svg+xml"].includes(
            value.type
          );
        }
      ),
    description: Yup.string()
      .required("Description is required")
      .max(1500, "Description cannot exceed 1500 characters"),
    chat_model: Yup.string().required("Chat Model field is required."),
  });

  const handleCancelPreview = () => {
    formik.setFieldValue("logo", "");
  };

  const formik = useFormik({
    initialValues,
    validationSchema: CreateGPTsToolsValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setSubmitting(true);
      const data = {
        ...values,
      };

      AddToolModelGpt(data)
        .unwrap()
        .then((response) => {
          HandleModalClose();
          resetForm();
          toast.success(response.message);
        })
        .catch((error) => {
          if (error?.data?.message) {
            toast.error(error?.data?.message);
          }
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  const HandleModalClose = () => {
    if (!submitting) {
      setOpen(false);
      formik.resetForm();
    }
  };

  const fileOrUrlSchema = Yup.object().shape({
    image: Yup.mixed()
      .required("Image is required.")
      .test(
        "file-type-or-url",
        "Only JPG, PNG, SVG files or a valid URL are allowed",
        (value) => {
          if (!value) return true; // If no value provided, validation passes
          if (typeof value === "string") {
            // Check if it's a URL
            const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
            if (urlPattern.test(value)) {
              return true;
            }
          }
          // Check if it's a file and matches the types
          return ["image/jpeg", "image/png", "image/svg+xml"].includes(
            value.type
          );
        }
      ),
  });

  const handleChangeOnWorkspaceImage = (event, key) => {
    const image = event?.target?.files[0];

    if (image) {
      fileOrUrlSchema
        .validate({ image })
        .then(({ image }) => {
          setIsFileSubmitting({ open: true, key });
          const formData = new FormData();
          formData.append("image", image);

          axiosInstance
            .post("/ai/uploadImage", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            })
            .then((response) => {
              const url = response?.data?.url;
              if (key === "logo") {
                formik.setFieldValue("logo", url);
              }
              if (key === "preview_url") {
                formik.setFieldValue("preview_url", [
                  ...formik.values.preview_url,
                  url,
                ]);
              }
            })
            .catch((error) => {
              // Handle error
              toast.error(error.message);
            })
            .finally(() => {
              setIsFileSubmitting({ open: false, key: "" });
            });
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }
  };

  const HandleAddContext = () => {
    formik.setFieldValue("context_window", [
      ...formik.values.context_window,
      "",
    ]);
  };

  return (
    <>
      <Modal
        key='create-tools-modal'
        size={"2xl"}
        isOpen={open?.open}
        onClose={() => HandleModalClose()}
        onOpenChange={() => HandleModalClose()}
        scrollBehavior='outside'
        classNames={{
          base: "text-white bg-[#171717]",
          closeButton: "hover:bg-[#232323] active:bg-[#232323]",
        }}
      >
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'>{`Create a GPT`}</ModalHeader>
          <ModalBody className='gap-[16px] pt-[34px]'>
            <div className='flex w-full flex-col'>
              <Tabs
                classNames={{
                  tabList:
                    "bg-[#2F2F2F] rounded-[12px] max-w-[407px] w-full mx-auto",
                  cursor:
                    "bg-[#212121] border-2 border-[#99C8FF] shadow-[none]",
                  tabContent: "text-[15px] font-bold text-[#9B9B9B]",
                  tab: "py-3 h-10",
                }}
                disabledKeys={["configure"]}
              >
                <Tab key='create' title='Create'>
                  <div className='pt-[60px]'>
                    <div className='flex w-full flex-col mb-[40px] gap-4'>
                      <div className='flex mx-auto'>
                        {isfileSubmitting.open &&
                        isfileSubmitting.key === "logo" ? (
                          <Spinner size='lg' color='default' />
                        ) : formik.values.logo ? (
                          <div className='flex items-center justify-center relative'>
                            <Avatar
                              className='w-[80px] h-[80px] cursor-pointer'
                              src={formik.values.logo}
                              onClick={() => fileInput.current.click()}
                              radius='full'
                            />
                            <div className='absolute -right-2 -top-2 cursor-pointer'>
                              <XCircleIcon
                                className='h-5 w-5 text-gray-400'
                                onClick={handleCancelPreview}
                              />
                            </div>
                          </div>
                        ) : (
                          <div
                            className='flex items-center justify-center border-1 border-[#424242] border-dashed rounded-full cursor-pointer w-[80px] h-[80px]'
                            onClick={() => fileInput1.current.click()}
                          >
                            <div className='flex flex-col items-center justify-center relative w-[78px] h-[78px]'>
                              <PlusIconNew />
                            </div>
                          </div>
                        )}
                        <input
                          ref={fileInput1}
                          type='file'
                          className='hidden'
                          onChange={(event) =>
                            handleChangeOnWorkspaceImage(event, "logo")
                          }
                        />
                      </div>
                      <div className='flex mx-auto'>
                        {formik.errors.logo && formik.touched.logo && (
                          <p className='text-danger font-medium'>
                            {formik.errors.logo}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className='flex w-full flex-wrap md:flex-nowrap mb-[22px]'>
                      asdasd
                      <Input
                        type='text'
                        placeholder='Name of GPT'
                        classNames={{
                          input:
                            "leading-normal !text-[#fff] placeholder:text-[#9B9B9B] font-bold font-roboto",
                          inputWrapper: "border border-[#424242] rounded-[7px]",
                          label: "text-[15px] font-bold font-roboto",
                          errorMessage: "text-sm font-medium",
                        }}
                        labelPlacement='outside'
                        label={
                          <span className='text-[15px] font-bold font-roboto'>
                            Name
                          </span>
                        }
                        name='name'
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        variant='bordered'
                        isInvalid={formik.errors.name && formik.touched.name}
                        errorMessage={
                          formik.errors.name &&
                          formik.touched.name &&
                          formik.errors.name
                        }
                      />
                    </div>
                    <div className='flex w-full flex-wrap md:flex-nowrap mb-[22px] relative'>
                      <Textarea
                        classNames={{
                          input:
                            "leading-normal text-[#9B9B9B] font-bold font-roboto",
                          inputWrapper: "border border-[#424242] rounded-[7px]",
                          label: "text-[15px] font-bold font-roboto",
                          errorMessage: "text-sm font-medium",
                        }}
                        label='Description'
                        variant='bordered'
                        labelPlacement='outside'
                        placeholder='In a few sentences'
                        minRows={3}
                        name='description'
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          formik.errors.description &&
                          formik.touched.description
                        }
                        errorMessage={
                          formik.errors.description &&
                          formik.touched.description &&
                          formik.errors.description
                        }
                      />
                    </div>
                    <div className='flex w-full flex-wrap md:flex-nowrap mb-[22px] relative'>
                      <Select
                        label={
                          <span className='text-[15px] font-bold font-roboto'>{`Select Model`}</span>
                        }
                        labelPlacement='outside'
                        placeholder='Cluade 3.5 100K'
                        classNames={{
                          trigger:
                            "bg-transparent border border-[#424242] data-[hover=true]:bg-transparent",
                          errorMessage: "text-sm font-medium",
                        }}
                        listboxProps={{
                          itemClasses: {
                            base: "data-[hover=true]:bg-[#383838] data-[hover=true]:text-white text-white",
                          },
                        }}
                        popoverProps={{
                          classNames: {
                            content: "bg-[#2F2F2F] px-1 shadow-none",
                          },
                          className: "bg-transparent",
                        }}
                        name='chat_model'
                        items={chatModelLists}
                        selectionMode='single'
                        radius='sm'
                        selectedKeys={
                          formik.values.chat_model
                            ? [formik.values.chat_model]
                            : null
                        }
                        onChange={formik.handleChange}
                        isInvalid={
                          formik.errors.chat_model && formik.touched.chat_model
                        }
                        errorMessage={
                          formik.errors.chat_model &&
                          formik.touched.chat_model &&
                          formik.errors.chat_model
                        }
                      >
                        {(item) => (
                          <SelectItem key={item.key}>{item.label}</SelectItem>
                        )}
                      </Select>
                    </div>
                    <div className='flex w-full flex-wrap md:flex-nowrap mb-[22px] relative'>
                      <Input
                        type='text'
                        placeholder='Answer questions based off the following context'
                        classNames={{
                          input:
                            "leading-normal text-[#9B9B9B] font-bold font-roboto",
                          inputWrapper: "border border-[#424242] rounded-[7px]",
                          label: "text-[15px] font-bold font-roboto",
                        }}
                        labelPlacement='outside'
                        label='Prompt'
                        name='prompt'
                        value={formik.values.prompt}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        variant='bordered'
                        isInvalid={
                          formik.errors.prompt && formik.touched.prompt
                        }
                        errorMessage={
                          formik.errors.prompt &&
                          formik.touched.prompt &&
                          formik.errors.prompt
                        }
                      />
                    </div>
                    <div className='flex flex-col w-full'>
                      <div className='flex justify-between items-center w-full mb-1.5'>
                        <label className='text-[15px] font-bold font-roboto'>{`Context`}</label>
                        <p className='text-[#9B9B9B] text-[15px] font-bold'>{`Total Tokens : 20K Token Limit : 100K`}</p>
                      </div>
                      <div className='flex w-full flex-col flex-wrap'>
                        {formik.values.context_window?.map((ele, ele_key) => (
                          <Input
                            key={ele_key}
                            type='text'
                            placeholder={`Context ${ele_key + 1}`}
                            classNames={{
                              input:
                                "leading-normal text-[#9B9B9B] font-bold font-roboto",
                              inputWrapper:
                                "border border-[#424242] rounded-[7px] mb-[18px]",
                              label: "text-[15px] font-bold font-roboto",
                            }}
                            label=''
                            labelPlacement='outside'
                            endContent={
                              <button
                                className='focus:outline-none'
                                type='button'
                              >
                                <AttachFileIcon className='cursor-pointer' />
                              </button>
                            }
                            value={ele}
                            onChange={(event) => {
                              const newValue = event.target.value;
                              if (newValue) {
                                const updatedItems = [
                                  ...formik.values.context_window,
                                ];
                                updatedItems[ele_key] = newValue;
                                formik.setFieldValue(
                                  "context_window",
                                  updatedItems
                                );
                              }
                            }}
                            variant='bordered'
                            // isInvalid={(formik.errors.introtext && formik.touched.introtext)}
                            // errorMessage={(formik.errors.introtext && formik.touched.introtext) && formik.errors.introtext}
                          />
                        ))}
                      </div>
                    </div>
                    <div className='text-center w-full mb-[20px]'>
                      <Button
                        className='p-0 bg-[transperant] h-[auto]'
                        onPress={HandleAddContext}
                      >
                        <span className='text-[15px] font-bold font-roboto'>
                          <PlusIconNew className='scale-[0.8]' />
                        </span>
                        {`Add Context box`}
                      </Button>
                    </div>
                    <div className='flex w-full'>
                      <Input
                        type='text'
                        placeholder='Coming Soon!'
                        classNames={{
                          input:
                            "leading-normal text-[#9B9B9B] font-bold font-roboto",
                          inputWrapper:
                            "border border-[#424242] bg-transparent",
                          label: "text-[15px] font-bold font-roboto",
                        }}
                        labelPlacement='outside'
                        label='Monetize your GPT: Set Your Cost Per Token'
                        radius='sm'
                        // variant="bordered"
                        // name="introtext"
                        // value={formik.values.introtext}
                        // onChange={formik.handleChange}
                        // onBlur={formik.handleBlur}
                        // isInvalid={(formik.errors.introtext && formik.touched.introtext)}
                        // errorMessage={(formik.errors.introtext && formik.touched.introtext) && formik.errors.introtext}
                      />
                    </div>
                    <div className='text-[16px] text-[#9B9B9B] font-bold font-roboto mb-5 mt-1'>
                      {`Revenue will be credited to your account at the beginning of each month. Please note that there will be a 10% fee from all revenue accrued.`}
                    </div>
                    <div className='mb-12'>
                      <div className='text-[15px] font-bold font-roboto mb-[9px]'>{`Capabilities`}</div>
                      <Checkbox
                        color='default'
                        isSelected={formik.values.is_public}
                        onValueChange={(checked) =>
                          formik.setFieldValue("is_public", checked)
                        }
                      >
                        {`Public`}
                      </Checkbox>
                    </div>
                    <div className='flex justify-center w-full mb-6'>
                      <Button
                        color='default'
                        variant='bordered'
                        radius='full'
                        isLoading={submitting}
                        onPress={formik.handleSubmit}
                      >
                        {"Create GPT"}
                      </Button>
                    </div>
                  </div>
                </Tab>
                <Tab key='configure' title='Configure'>
                  <div className='flex justify-center items-center mt-1.5 mb-3'>
                    {`Configure`}
                  </div>
                </Tab>
              </Tabs>
            </div>
          </ModalBody>
        </ModalContent>
        <ToastService />
      </Modal>
    </>
  );
}

export default AddGptModel;
