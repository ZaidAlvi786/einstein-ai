// addToolModel.js

import { useState, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Spinner,
  Textarea,
  Checkbox,
  Avatar,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useAddToolModelGptMutation,
  useAddToolPluginWidgetMutation,
} from "@/app/lib/features/chat/chatApi";
import { XCircleIcon } from "@heroicons/react/20/solid";
import PlusIconNew from "@/app/assets/svg/plusicon.svg";
import Trashicon from "@/app/assets/svg/trash-icon.svg";
import axiosInstance from "@/app/http/axios";
import toast from "react-hot-toast";
import ToastService from "../Toaster/toastService";

function CreateToolsModel({ open, setOpen }) {
  const fileInput = useRef();
  const fileInput1 = useRef();
  const [isfileSubmitting, setIsFileSubmitting] = useState({
    open: false,
    key: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [AddToolPluginWidget] = useAddToolPluginWidgetMutation();
  const [addToolModelGpt] = useAddToolModelGptMutation();
  const [initialValues] = useState({
    name: "",
    description: "",
    introtext: "",
    category: open?.category,
    url: "",
    logo: "",
    preview_url: [],
    tool_monetization: "",
    price: [{ value: 0, type: "monthly" }],
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
    context_window: [],
    tags: [],
    chat_model: "gpt4",
  });

  const CreateToolsValidationSchema = Yup.object({
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
    introtext: Yup.string().max(250, "Intro text cannot exceed 250 characters"),
    url: Yup.string().url("Must be a valid URL").required("URL is required"),
    preview_url: Yup.array()
      .min(1, "At least one preview image is required.")
      .of(Yup.string().url("Must be a valid URL")),
    price: Yup.array().of(
      Yup.object().shape({
        value: Yup.number()
          .required("Price is required.")
          .test(
            "is-valid-value",
            "Price must be greater than 0 and at least 1 dollar.",
            function (value) {
              const { type } = this.parent;
              if (type === "free") {
                return value === 0 || value === "";
              } else {
                return value > 0;
              }
            }
          ),
        type: Yup.string()
          .oneOf(["free", "monthly", "annual", "per_use"])
          .required("Type is required"),
      })
    ),
    social_links: Yup.object().shape({
      website: Yup.string().url("Invalid Website URL"),
      discord: Yup.string().url("Invalid Discord URL"),
      facebook: Yup.string().url("Invalid Facebook URL"),
      twitter: Yup.string().url("Invalid Twitter URL"),
      instagram: Yup.string().url("Invalid Instagram URL"),
      linkedin: Yup.string().url("Invalid Linkedin URL"),
      github: Yup.string().url("Invalid Github URL"),
    }),
    support_email: Yup.string()
      .email("Must be a valid email")
      .required("Support email is required"),
  });

  const handleCancelPreview = () => {
    formik.setFieldValue("logo", "");
  };

  const paid_type = [
    { label: "Free", value: "free" },
    { label: "Per Use", value: "per_use" },
    { label: "Monthly", value: "monthly" },
    { label: "Annual", value: "annual" },
  ];

  const formik = useFormik({
    initialValues,
    validationSchema: CreateToolsValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setSubmitting(true);
      const data = {
        ...values,
        tool_monetization:
          values.price?.filter(
            (item) =>
              item.type === "per_use" ||
              item.type === "monthly" ||
              item.type === "annual"
          ).length > 0
            ? "subscription"
            : "free",
        price: {
          monthly:
            Number(
              values?.price?.find((item) => item?.type === "monthly")?.value ??
              0
            ) ?? 0,
          annual:
            Number(
              values?.price?.find((item) => item?.type === "annual")?.value ?? 0
            ) ?? 0,
          per_use:
            Number(
              values?.price?.find((item) => item?.type === "per_use")?.value ??
              0
            ) ?? 0,
        },
        category: open?.category,
      };

      if (open?.category !== "model") {
        AddToolPluginWidget(data)
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
      } else {
        addToolModelGpt(data)
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
      }
    },
  });

  const HandleModalClose = () => {
    if (!submitting) {
      setOpen({ open: false, category: "" });
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

  const RemovePreviewImage = (preview_img_index) => {
    const filteredArray = formik?.values?.preview_url?.filter(
      (_, index) => index !== preview_img_index
    );
    formik.setFieldValue("preview_url", filteredArray);
  };

  const AddAlternativePricingModel = () => {
    const hasPaidOption = formik.values.price.some(
      (item) =>
        item.type === "per_use" ||
        item.type === "monthly" ||
        item.type === "annual"
    );

    const maxLength = hasPaidOption ? 3 : 1;

    if (formik.values.price.length >= maxLength) return;

    const type = hasPaidOption
      ? paid_type.find((ele) =>
        formik.values.price.every(
          (item) => item.type !== ele.value && ele.value !== "free"
        )
      )?.value
      : "free";

    if (type) {
      formik.setFieldValue("price", [
        ...formik.values.price,
        { value: 0, type },
      ]);
    }
  };

  function capitalizeFirstLetter(string) {
    return string?.charAt(0)?.toUpperCase() + string?.slice(1);
  }

  return (
    <>
      <Modal
        key="create-tools-modal"
        size={"xl"}
        isOpen={open?.open}
        onClose={() => HandleModalClose()}
        onOpenChange={() => HandleModalClose()}
        classNames={{
          base: "text-white",
          closeButton: "hover:bg-[#232323] active:bg-[#232323]",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 capitalize">{`Add ${open?.category}`}</ModalHeader>
          <ModalBody className="max-h-[60vh] overflow-auto gap-[16px]">
            <div className="text-[15px]">{`Logo`}</div>
            <div className="flex w-full flex-col mb-[4px] gap-4">
              <div className="flex">
                {isfileSubmitting.open && isfileSubmitting.key === "logo" ? (
                  <Spinner size="lg" color="default" />
                ) : formik.values.logo ? (
                  <div className="flex items-center justify-center relative">
                    <Avatar
                      radius="sm"
                      src={formik.values.logo}
                      className="w-[80px] h-[80px] cursor-pointer"
                      onClick={() => fileInput.current.click()}
                    />
                    <div className="absolute -right-2 -top-2">
                      <XCircleIcon
                        className="h-5 w-5 text-gray-400"
                        onClick={handleCancelPreview}
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInput1.current.click()}
                    className="flex items-center justify-center border-1 border-[#424242] border-dashed rounded-[20px] cursor-pointer w-[80px] h-[80px]"
                  >
                    <div className="flex flex-col items-center justify-center relative w-[78px] h-[78px]">
                      <PlusIconNew />
                    </div>
                  </div>
                )}
                <input
                  ref={fileInput1}
                  type="file"
                  className="hidden"
                  onChange={(event) =>
                    handleChangeOnWorkspaceImage(event, "logo")
                  }
                />
              </div>
              {formik.errors.logo && formik.touched.logo && (
                <div className="text-danger">{formik.errors.logo}</div>
              )}
            </div>
            <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
              <Input
                type="text"
                placeholder={`Name of ${capitalizeFirstLetter(open?.category)}`}
                classNames={{ input: "leading-normal" }}
                labelPlacement="outside"
                label="Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                variant="bordered"
                isInvalid={formik.errors.name && formik.touched.name}
                errorMessage={
                  formik.errors.name &&
                  formik.touched.name &&
                  formik.errors.name
                }
              />
            </div>
            <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 relative">
              <div className="absolute right-0 top-0 text-[#9B9B9B] text-[14px]">{`max. 150 characters`}</div>
              <Input
                type="text"
                placeholder={`Short description of your ${capitalizeFirstLetter(
                  open?.category
                )}`}
                classNames={{ input: "leading-normal" }}
                labelPlacement="outside"
                label="Short Description"
                name="introtext"
                value={formik.values.introtext}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                variant="bordered"
                isInvalid={formik.errors.introtext && formik.touched.introtext}
                errorMessage={
                  formik.errors.introtext &&
                  formik.touched.introtext &&
                  formik.errors.introtext
                }
              />
            </div>
            <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4">
              <Input
                type="text"
                classNames={{ input: "leading-normal" }}
                placeholder={`App url of your ${capitalizeFirstLetter(
                  open?.category
                )}`}
                labelPlacement="outside"
                label={`${open.category === 'model' ? 'Api url' : 'App url'}`}
                name="url"
                value={formik.values.url}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                variant="bordered"
                isInvalid={formik.errors.url && formik.touched.url}
                errorMessage={
                  formik.errors.url && formik.touched.url && formik.errors.url
                }
              />
            </div>
            <div className="flex w-full flex-wrap md:flex-nowrap gap-4 relative mb-[9px]">
              <div className="absolute right-0 top-0 text-[#9B9B9B] text-[14px] ">
                max. 1500 characters
              </div>
              <Textarea
                label="About"
                variant="bordered"
                labelPlacement="outside"
                placeholder={`Describe the function of your ${capitalizeFirstLetter(
                  open?.category
                )}`}
                minRows={12}
                classNames={{ input: "leading-normal" }}
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={
                  formik.errors.description && formik.touched.description
                }
                errorMessage={
                  formik.errors.description &&
                  formik.touched.description &&
                  formik.errors.description
                }
              />
            </div>
            <div className="flex w-full flex-col mb-6 md:mb-0 gap-4">
              <div className="text-[15px]">{`Social links`}</div>
              {Object.keys(initialValues?.social_links).map((ele, index) => (
                <div className="flex flex-col w-full">
                  <Input
                    key={index}
                    type="text"
                    placeholder={ele}
                    classNames={{
                      input: "placeholder:capitalize leading-normal",
                    }}
                    value={formik?.values?.social_links[ele]}
                    onChange={(event) => {
                      const value = event?.target?.value?.trimStart();
                      formik.setFieldValue("social_links", {
                        ...formik.values.social_links,
                        [ele]: value,
                      });
                    }}
                    labelPlacement="outside"
                    label=""
                    variant="bordered"
                    fullWidth
                  />
                  {formik?.errors?.social_links?.[ele] &&
                    formik?.touched?.social_links?.[ele] && (
                      <div className="text-danger">
                        {formik?.errors?.social_links?.[ele]}
                      </div>
                    )}
                </div>
              ))}
            </div>
            <div className="text-center mb-[18px]">
              <Button className="p-0 bg-[transperant] h-[auto]">
                <span>
                  <PlusIconNew className="scale-[0.8]" />
                </span>
                {`Add social`}
              </Button>
            </div>
            <div className="flex w-full flex-wrap md:flex-nowrap mb-[29px] gap-4">
              <Input
                type="text"
                classNames={{ input: "leading-normal" }}
                placeholder="support@odesa.com"
                label="Support email"
                labelPlacement="outside"
                name="support_email"
                value={formik.values.support_email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                variant="bordered"
                isInvalid={
                  formik.errors.support_email && formik.touched.support_email
                }
                errorMessage={
                  formik.errors.support_email &&
                  formik.touched.support_email &&
                  formik.errors.support_email
                }
              />
            </div>
            <div className="flex w-full flex-col gap-4">
              <div className="text-[15px]">{`Preview Images - add up to 6 images`}</div>
              <div className="flex flex-col">
                <div className="container mx-auto mb-3">
                  <div className="grid grid-cols-3 gap-3 mx-auto">
                    {formik.values.preview_url.map((img, index) => (
                      <div
                        key={index}
                        className="w-[141px] h-[80px] border-1 border-[#636363] border-solid rounded-[10px] relative group"
                      >
                        <img
                          src={img}
                          alt="NextUI Album Cover"
                          className="w-full h-full object-cover rounded-[10px]"
                        />
                        <div
                          onClick={() => RemovePreviewImage(index)}
                          className="absolute top-[5px] right-[5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <Trashicon />
                        </div>
                      </div>
                    ))}
                    {formik.values?.preview_url?.length < 6 && (
                      <>
                        {isfileSubmitting.open &&
                          isfileSubmitting.key === "preview_url" ? (
                          <div className="flex items-center justify-center w-[80px] h-[80px]">
                            <Spinner size="lg" color="default" />
                          </div>
                        ) : (
                          <div
                            onClick={() => fileInput.current.click()}
                            className="flex items-center justify-center border-1 border-[#424242] border-dashed rounded-[20px] cursor-pointer w-[80px] h-[80px]"
                          >
                            <div className="flex flex-col items-center justify-center relative w-[78px] h-[78px]">
                              <PlusIconNew />
                            </div>
                          </div>
                        )}
                        <input
                          ref={fileInput}
                          type="file"
                          className="hidden"
                          onChange={(event) =>
                            handleChangeOnWorkspaceImage(event, "preview_url")
                          }
                        />
                      </>
                    )}
                  </div>
                </div>
                {formik.errors.preview_url && formik.touched.preview_url && (
                  <div className="text-danger">{formik.errors.preview_url}</div>
                )}
              </div>
            </div>
            <div className="flex flex-col w-full mb-6">
              {formik.values.price.map((item, index) => (
                <div key={index} className="w-full mb-1.5">
                  <div className="flex relative w-full">
                    <Input
                      type="number"
                      startContent={<span className="text-white">{`$`}</span>}
                      placeholder="Enter Price"
                      classNames={{
                        label: "text-white",
                        base: "absolute z-50 w-9/12",
                        input:
                          "!bg-[transparent] placeholder:text-[#818181] text-[14px] font-normal font-inter group-data-[has-value=true]:text-white caret-white text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                        inputWrapper:
                          "h-8 !bg-[transparent] bg-[#424242] rounded-r-none border-r-0 group-data-[focus-visible=true]:!ring-0 group-data-[focus-visible=true]:!ring-transparent group-data-[focus-visible=true]:!ring-offset-0 group-data-[focus-visible=true]:!ring-offset-transparent",
                      }}
                      value={item?.value ?? ""}
                      onChange={(event) => {
                        const value = event.target.value;
                        const newArray = formik.values.price?.map((data, key) =>
                          key === index ? { ...data, value: value } : data
                        );
                        formik.setFieldValue("price", newArray);
                      }}
                      isDisabled={item?.type === "free"}
                      onKeyDown={(event) =>
                        event?.key === "e" && event?.preventDefault()
                      }
                    />
                    {paid_type?.find((type) => type?.value === item?.type)
                      ?.label && (
                        <span className="absolute right-12 top-2 text-base text-[#ECECEC] font-roboto font-semibold">
                          {paid_type?.find((type) => type?.value === item?.type)
                            ?.label ?? ""}
                        </span>
                      )}
                    <Select
                      classNames={{
                        trigger:
                          "!bg-transparent bg-[#424242] h-8 min-h-0 h-10 border border-[#424242] after:content-[''] after:w-9 after:h-[38px] after:bg-[#0A84FF] after:absolute after:right-0  after:-z-[1] after:rounded-r-lg",
                        value:
                          "text-end text-base text-[#ECECEC] font-roboto font-semibold pr-2.5",
                        popoverContent: "bg-[#171717] border border-[#424242]",
                        selectorIcon: "w-6 h-6 -mr-[6px]",
                      }}
                      label={""}
                      aria-label="Select frequency"
                      selectionMode="single"
                      selectedKeys={item?.type ? [item?.type] : null}
                      onSelectionChange={({ currentKey }) => {
                        const selectedOption = currentKey;
                        let newArray;

                        if (selectedOption === "free") {
                          newArray = formik.values.price
                            .map((data, key) =>
                              key === index
                                ? { ...data, type: selectedOption }
                                : data
                            )
                            .filter((data) => data.type === "free");
                        } else if (
                          ["per_use", "monthly", "annual"].includes(
                            selectedOption
                          )
                        ) {
                          newArray = formik.values.price
                            .map((data, key) =>
                              key === index
                                ? { ...data, type: selectedOption }
                                : data
                            )
                            .filter((data) => data.type !== "free");
                        } else if (selectedOption === "remove") {
                          newArray = formik.values.price?.filter(
                            (_, key) => key !== index
                          );
                        } else {
                          newArray = formik.values.price.map((data, key) =>
                            key === index
                              ? { ...data, type: selectedOption }
                              : data
                          );
                        }

                        formik.setFieldValue("price", newArray);
                      }}
                    >
                      {paid_type
                        .filter((data) =>
                          formik.values.price.every(
                            (ITEM) => ITEM?.type !== data?.value
                          )
                        )
                        .map((ele) => (
                          <SelectItem
                            key={ele.value}
                            classNames={{ selectedIcon: "opacity-0" }}
                          >
                            <p className="text-[#ECECEC] text-base font-semibold text-end">
                              {ele.label}
                            </p>
                          </SelectItem>
                        ))}
                      {formik.values.price?.length > 1 && (
                        <SelectItem
                          key={"remove"}
                          classNames={{ selectedIcon: "opacity-0" }}
                        >
                          <p className="text-red-600 text-base font-semibold text-end">{`Remove`}</p>
                        </SelectItem>
                      )}
                    </Select>
                  </div>
                  {formik?.errors?.price?.[index] &&
                    formik?.touched?.price?.[index] && (
                      <div className="text-danger mt-1">
                        {formik.errors?.price?.[index]?.value}
                      </div>
                    )}
                </div>
              ))}
            </div>
            <div className="text-[16px] text-[#9B9B9B] mb-2">
              {`Revenue will be credited to your account at the beginning of each month. Please note that there will be a 10% fee from all revenue accrued.`}
            </div>
            <div className="text-center mb-2">
              <Button
                onPress={AddAlternativePricingModel}
                className="p-0 bg-[transperant] h-[auto]"
              >
                <span>
                  <PlusIconNew className="scale-[0.8]" />
                </span>
                {`Add alternative pricing model`}
              </Button>
            </div>
            <div className="mb-[63px]">
              <Checkbox
                color="default"
                isSelected={formik.values.is_public}
                onValueChange={(val) => formik.setFieldValue("is_public", val)}
              >{`Public`}</Checkbox>
            </div>
          </ModalBody>
          <ModalFooter className="justify-center">
            <Button
              className="rounded-[30px]"
              color="primary"
              disabled={submitting}
              onPress={formik.handleSubmit}
            >
              {submitting ? (
                <Spinner color="white" size="sm" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
        <ToastService />
      </Modal>
    </>
  );
}

export default CreateToolsModel;
