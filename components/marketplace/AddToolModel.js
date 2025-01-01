// addToolModel.js
"use client";
import { useState, useRef, useEffect } from "react";
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
  useGetRandomImageriesQuery,
  useUpdateToolMutation,
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
  const [UpdateTool] = useUpdateToolMutation();
  const [selectedPricingType, setPricingType] = useState(["free"]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [showSocialLinksCount, setShowSocialLinksCount] = useState(2);
  const [showPriceTypeError, setShowPriceTypeError] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: "",
    description: "",
    introtext: "",
    category: open?.category,
    url: "",
    logo: "",
    preview_url: [],
    tool_monetization: "",
    price: [{ value: 0, type: "monthly" }],
    freeTrialCredits: [{ value: 0, type: "cost_basis" }],
    price_per_use: 0,
    pricing_per_yer: "",
    price_per_month: "",
    set_query_limit_month: "no_limit",
    set_query_limit_year: "no_limit",
    query_limit_per_month: "",
    query_limit_per_year: "",
    is_agree: false,
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

  const {
    data: randomImage,
    isFetching: randomImageLoading,
    refetch: refetchRandomImage,
  } = useGetRandomImageriesQuery();

  useEffect(() => {
    if (open?.isEditable) {
      const tools = open?.tool_details;
      const price = [];
      const price_key = [];
      if (Object.keys(tools?.price).length > 0) {
        const prices = tools?.price;
        const filteredPrices = [];
        Object.keys(prices).map((key) => {
          if (prices[key] != 0) {
            price.push({ value: prices[key], type: key });
            price_key.push(key);
          }
        });
      }
      if (
        tools?.price?.annual === 0 &&
        tools?.price?.monthly === 0 &&
        tools?.price?.per_use === 0
      ) {
        setPricingType(["free"]);
      } else {
        setPricingType(price_key);
      }
      if (tools?.free_trial?.cost > 0 || tools?.free_trial?.query > 0) {
        setPricingType((prev) => [...prev, "free"]);
      }
      setInitialValues({
        name: tools?.name,
        category: tools?.category,
        price: price,
        chat_model: tools?.chat_model || "gpt4",
        context_window: tools?.context_window || [],
        description: tools?.description || "",
        freeTrialCredits: [
          {
            // value: tools?.free_trial?.cost || 0,
            value:
              (tools?.free_trial?.cost > 0
                ? tools?.free_trial?.cost
                : tools?.free_trial?.query) || 0,
            type: tools?.free_trial?.query == 0 ? "cost_basis" : "query_basis",
          },
        ],
        introtext: tools?.introtext || "",
        is_agree: true,
        is_public: tools?.is_public || false,
        logo: tools?.logo || "",
        preview_url: [...tools?.preview_url],
        price_per_use: tools?.price?.per_use || "",
        pricing_per_yer: tools?.price?.annual || "",
        price_per_month: tools?.price?.monthly || "",
        set_query_limit_month:
          tools?.query_limit?.monthly > 0 ? "query_based_limit" : "no_limit",
        set_query_limit_year:
          tools?.query_limit?.annual > 0 ? "query_based_limit" : "no_limit",
        query_limit_per_month: tools?.query_limit?.monthly || 0,
        query_limit_per_year: tools?.query_limit?.annual || 0,
        tags: tools?.tags || [],
        social_links: {
          website: tools?.social_links?.website || "",
          discord: tools?.social_links?.discord || "",
          // facebook:tools.facebook || "",
          // twitter:tools.twitter || "",
          // instagram:tools.instagram || "",
          // linkedin:tools.linkedin || "",
        },
        support_email: tools?.support_email || "",
        tool_monetization: tools?.tool_monetization || "",
        url: tools?.url || "",
      });
    }
  }, [open?.isEditable]);

  const isFree = selectedPricingType.includes("free");
  const isPerUse = selectedPricingType.includes("per_use");
  const isMonthly = selectedPricingType.includes("monthly");
  const isAnnual = selectedPricingType.includes("annual");

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
    introtext: Yup.string()
      .required("Short description is required")
      .max(250, "Intro text cannot exceed 250 characters"),
    url: Yup.string().url("Must be a valid URL").required("URL is required"),
    preview_url: Yup.array()
      .min(1, "At least one preview image is required.")
      .of(Yup.string().url("Must be a valid URL")),

    // price: Yup.array().of(
    //   Yup.object().shape({
    //     value: Yup.number()
    //       .required("Price is required.")
    //       .test(
    //         "is-valid-value",
    //         "Price must be greater than 0 and at least 1 dollar.",
    //         function (value) {
    //           const { type } = this.parent;
    //           if (type === "free") {
    //             return value === 0 || value === "";
    //           } else {
    //             return value > 0;
    //           }
    //         }
    //       ),
    //     type: Yup.string()
    //       .oneOf(["free", "monthly", "annual", "per_use"])
    //       .required("Type is required"),
    //   })
    // ),
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

    freeTrialCredits: Yup.array().of(
      Yup.object({
        value: Yup.number().when([], {
          is: () => isFree,
          then: (schema) =>
            schema
              .required("Value is required")
              .min(0.0001, "Value must be greater than 0"),
          otherwise: (schema) => schema,
        }),
      })
    ),
    price_per_use: Yup.number().when([], {
      is: () => isPerUse,
      then: (schema) =>
        schema
          .required("Value is required")
          .min(0.0001, "Value must be greater than 0"),
      otherwise: (schema) => schema,
    }),
    // price_per_month: Yup.string().when([], {
    //   is: () => isMonthly,
    //   then: (schema) =>
    //     schema.required("Value is required").min(1, "Value must be at least 1"),
    //   otherwise: (schema) => schema,
    // }),
    price_per_month: Yup.number()
      // .transform((value, originalValue) => (originalValue.trim() === "" ? null : value))
      .transform((value, originalValue) => value)
      .when([], {
        is: () => isMonthly,
        then: (schema) =>
          schema
            .required("Value is required")
            .min(0.0001, "Value must be greater than 0"),
        otherwise: (schema) => schema,
      }),
    pricing_per_yer: Yup.number()
      .transform((value, originalValue) => value)
      .when([], {
        is: () => isAnnual,
        then: (schema) =>
          schema
            .required("Value is required")
            .min(0.0001, "Value must be greater than 0"),
        otherwise: (schema) => schema,
      }),
    query_limit_per_month: Yup.number()
      .transform((value, originalValue) => value)
      .when(["set_query_limit_month"], {
        is: (set_query_limit_month) =>
          isMonthly && set_query_limit_month === "query_based_limit",
        then: (schema) =>
          schema
            .required("Value is required")
            .min(1, "Value must be greater than 0"),
        otherwise: (schema) => schema,
      }),
    query_limit_per_year: Yup.number()
      .transform((value, originalValue) => value)
      .when(["set_query_limit_year"], {
        is: (set_query_limit_year) =>
          isAnnual && set_query_limit_year === "query_based_limit",
        then: (schema) =>
          schema
            .required("Value is required")
            .min(1, "Value must be greater than 0"),
        otherwise: (schema) => schema,
      }),
    is_agree: Yup.boolean()
      .oneOf([true], "You must agree to our terms and conditions")
      .required("You must agree to the terms and conditions"),
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

  const per_use_type = [
    { label: "Cost Basis", value: "cost_basis" },
    { label: "Query Basis", value: "query_basis" },
  ];

  const query_limit_options = [
    { value: "no_limit", label: "No Limit" },
    { value: "query_based_limit", label: "Query Based Limit" },
  ];

  const formik = useFormik({
    initialValues,
    validationSchema: CreateToolsValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      if (selectedPricingType?.length === 0) return setShowPriceTypeError(true);
      const isFree = selectedPricingType.includes("free");
      const isPerUse = selectedPricingType.includes("per_use");
      const isMonthly = selectedPricingType.includes("monthly");
      const isAnnual = selectedPricingType.includes("annual");

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
          monthly: Number(isMonthly ? values?.price_per_month : 0) ?? 0,
          annual: Number(isAnnual ? values?.pricing_per_yer : 0) ?? 0,
          per_use: Number(isPerUse ? values?.price_per_use : 0) ?? 0,
        },
        category: open?.category,
        free_trial: isFree ? {
          cost: values?.freeTrialCredits?.some((e) => e.type === "cost_basis")
            ? Number(values?.freeTrialCredits[0]?.value)
            : 0,
          query: values?.freeTrialCredits?.some((e) => e.type === "query_basis")
            ? Number(values?.freeTrialCredits[0]?.value)
            : 0,
        }:{
          cost:0,
          query:""
        },
        query_limit: {
          monthly:
            values.set_query_limit_month === "query_based_limit"
              ? values?.query_limit_per_month
              : 0,
          annual:
            values.set_query_limit_year === "query_based_limit"
              ? values?.query_limit_per_year
              : 0,
        },
        is_public: true,
        tool_id: open?.tool_details?.id || "",
      };

      if (open?.category !== "model") {
        const apiName = open?.isEditable ? UpdateTool : AddToolPluginWidget;
        apiName(data)
          .unwrap()
          .then((response) => {
            HandleModalClose();
            resetForm();
            toast.success(response.message);
            setTimeout(() => {
              window.location.reload()
            }, 500);
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
        const apiName = open?.isEditable ? UpdateTool : addToolModelGpt;

        apiName(data)
          .unwrap()
          .then((response) => {
            HandleModalClose();
            resetForm();
            toast.success(response.message);
            setTimeout(() => {
              window.location.reload()
            }, 500);
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

  useEffect(() => {
    if (randomImage && randomImage?.random_image) {
      if (formik?.values?.logo === "") {
        formik.setFieldValue("logo", randomImage?.random_image);
        refetchRandomImage();
      }
      formik.setFieldValue("preview_url", [randomImage?.random_image]);
    }
  }, [randomImage, open]);

  useEffect(() => {
    // Filter options to exclude the currently selected value
    setFilteredOptions(
      query_limit_options.filter(
        (opt) => opt.value !== formik.values.set_query_limit_month
      )
    );
  }, [formik.values.set_query_limit_month]);

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
      const maxSizeInKB = 900; // Maximum size in KB
      const maxSizeInBytes = maxSizeInKB * 1024;

      if (image.size > maxSizeInBytes) {
        toast.error(`Image size should be less than ${maxSizeInKB} KB.`);
        return;
      }
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

  // onClick={() => setPricingType([...selectedPricingType, type.value])}

  const handleSelectPricingType = (type) => {
    const isAvl = selectedPricingType.some((val) => val === type);
    if (isAvl) {
      const temp = selectedPricingType.filter((p) => p !== type);
      setPricingType([...temp]);
    } else {
      setPricingType([...selectedPricingType, type]);
    }
  };
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
          <ModalHeader className="flex flex-col gap-1 capitalize">{`${
            open?.isEditable
              ? `Edit ${open?.category}`
              : `Add ${open?.category}`
          }`}</ModalHeader>
          <ModalBody className="max-h-[60vh] overflow-auto gap-[16px] addModal">
            <div className="text-[15px] font-bold">{`Logo`}</div>
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
                classNames={{ input: "leading-normal", label: "boldLabel" }}
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
                label={`${open.category === "model" ? "Api url" : "App url"}`}
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
              {Object.keys(initialValues?.social_links).map(
                (ele, index) =>
                  showSocialLinksCount > index && (
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
                  )
              )}
            </div>
            <div className="text-center mb-[18px]">
              {showSocialLinksCount !== 7 && (
                <Button
                  className="p-0 bg-[transperant] h-[auto]"
                  onClick={() => setShowSocialLinksCount(7)}
                >
                  <span>
                    <PlusIconNew className="scale-[0.8]" />
                  </span>
                  {`Add social`}
                </Button>
              )}
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
            <div className="flex justify-between w-full mb-2">
              {paid_type.map((type) => {
                const isActive = selectedPricingType.some(
                  (val) => val === type.value
                );
                return (
                  <div
                    className={`w-[125px] cursor-pointer h-[95px] flex justify-center items-center rounded-[24px] ${
                      isActive ? "bg-[#0A84FF]" : "bg-[#4A4A4A]"
                    } `}
                    // onClick={() => setPricingType([...selectedPricingType, type.value])}
                    onClick={() => handleSelectPricingType(type.value)}
                  >
                    {type.label}
                  </div>
                );
              })}
            </div>
            <div>
              {showPriceTypeError && (
                <div className="text-danger text-[15px]">Select Price Type</div>
              )}
            </div>

            {selectedPricingType.some((val) => val === "free") && (
              <div>
                <div>
                  <div className="flex flex-col w-full mb-6">
                    {/* Free Trial Credits Input */}
                    <div className="text-white font-bold text-sm mb-2 mt-4">
                      Free trial credits
                    </div>
                    {formik.values.freeTrialCredits.map((item, index) => (
                      <div key={index} className="w-full mb-1.5">
                        <div className="flex relative w-full">
                          <Input
                            type="number"
                            startContent={
                              <span className="text-white">{`$`}</span>
                            }
                            placeholder="Enter Credits"
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
                              const newArray =
                                formik.values.freeTrialCredits.map(
                                  (data, key) =>
                                    key === index
                                      ? { ...data, value: value }
                                      : data
                                );
                              formik.setFieldValue(
                                "freeTrialCredits",
                                newArray
                              );
                            }}
                          />
                          {per_use_type?.find(
                            (type) => type?.value === item?.type
                          )?.label && (
                            <span className="absolute right-12 top-2 text-base text-[#ECECEC] font-roboto font-semibold">
                              {per_use_type?.find(
                                (type) => type?.value === item?.type
                              )?.label ?? ""}
                            </span>
                          )}
                          <Select
                            classNames={{
                              trigger:
                                "!bg-transparent bg-[#424242] h-8 min-h-0 h-10 border border-[#424242] after:content-[''] after:w-9 after:h-[38px] after:bg-[#0A84FF] after:absolute after:right-0  after:-z-[1] after:rounded-r-lg",
                              value:
                                "text-end text-base text-[#ECECEC] font-roboto font-semibold pr-2.5",
                              popoverContent:
                                "bg-[#171717] border border-[#424242]",
                              selectorIcon: "w-6 h-6 -mr-[6px]",
                            }}
                            label={""}
                            aria-label="Select credit basis"
                            selectionMode="single"
                            selectedKeys={item?.type ? [item?.type] : null}
                            onSelectionChange={({ currentKey }) => {
                              const selectedOption = currentKey;
                              const newArray =
                                formik.values.freeTrialCredits.map(
                                  (data, key) =>
                                    key === index
                                      ? { ...data, type: selectedOption }
                                      : data
                                );
                              formik.setFieldValue(
                                "freeTrialCredits",
                                newArray
                              );
                            }}
                          >
                            {/* Dropdown options for Free Trial Credits */}
                            {["Cost Basis", "Query Basis"].map((option) => (
                              <SelectItem
                                key={option.toLowerCase().replace(" ", "_")}
                                classNames={{ selectedIcon: "opacity-0" }}
                              >
                                <p className="text-[#ECECEC] text-base font-semibold text-end">
                                  {option}
                                </p>
                              </SelectItem>
                            ))}
                          </Select>
                        </div>

                        {/* Error display */}
                        {formik?.errors?.freeTrialCredits?.[index] &&
                          formik?.touched?.freeTrialCredits?.[index] && (
                            <div className="text-danger mt-1">
                              {formik.errors.freeTrialCredits?.[index]?.value}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-[16px] text-[#9B9B9B] mb-2 mt-[-23px]">
                  {`We track the use of your tool from individual accounts. After this threshold is reached, we will begin charging users for each use of your tool.`}
                </div>
              </div>
            )}

            {selectedPricingType.some((val) => val === "per_use") && (
              <div>
                <div className="flex w-full flex-wrap md:flex-nowrap mb-6 mt-5 md:mb-0 gap-4 relative">
                  <Input
                    type="number"
                    classNames={{ input: "leading-normal pl-[11px]" }}
                    placeholder={`0.0000`}
                    labelPlacement="outside"
                    startContent='$'
                    label={
                      <span>
                        Select pricing per use
                        <span className="absolute top-[-7px] right-0 text-[10px]">
                          1
                        </span>
                      </span>
                    }
                    name="price_per_use"
                    value={formik.values.price_per_use}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    variant="bordered"
                    isInvalid={
                      formik.errors.price_per_use &&
                      formik.touched.price_per_use
                    }
                    errorMessage={
                      formik.errors.price_per_use &&
                      formik.touched.price_per_use &&
                      formik.errors.price_per_use
                    }
                  />
                </div>
                {selectedPricingType.includes("per_use") &&
                  !selectedPricingType.includes("monthly") &&
                  !selectedPricingType.includes("annual") && (
                    <div className="text-[16px] text-[#9B9B9B] mb-2 mt-2">
                      {` Revenue will be credited to your account at the beginning of each month. Please note that there will be a 10% fee from all revenue accrued.`}
                    </div>
                  )}
              </div>
            )}

            {selectedPricingType.some((val) => val === "monthly") && (
              <div>
                <div className="flex gap-4 mt-3">
                  <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 relative">
                    <div className="absolute top-[31px] left-[10px]">$</div>
                    <Input
                      type="text"
                      classNames={{ input: "leading-normal pl-[11px]" }}
                      placeholder={`0.0000`}
                      labelPlacement="outside"
                      label={
                        <span>
                          Select pricing per month{" "}
                          <span className="absolute top-[-7px] right-0 text-[10px]">
                            1
                          </span>
                        </span>
                      }
                      name="price_per_month"
                      value={formik.values.price_per_month}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      variant="bordered"
                      isInvalid={
                        formik.errors.price_per_month &&
                        formik.touched.price_per_month
                      }
                      errorMessage={
                        formik.errors.price_per_month &&
                        formik.touched.price_per_month &&
                        formik.errors.price_per_month
                      }
                    />
                  </div>
                  <div className="flex flex-col w-full gap-1">
                    <div className="text-sm font-bold">
                      <span className="relative">
                        Set Query Limit
                        <span className="absolute top-[-7px] right-[-11px] text-[9px]">
                          2
                        </span>
                      </span>
                    </div>
                    <Select
                      variant="bordered"
                      name="set_query_limit_month"
                      placeholder={
                        formik.values.set_query_limit_month === "no_limit"
                          ? "No Limit"
                          : "Query Based Limit"
                      }
                      value={formik.values.set_query_limit_month || "no_limit"}
                      classNames={{
                        base: "bg-transparent text-white rounded-lg",
                        label: "text-white",
                        button: "leading-normal text-left px-3 text-white",
                        popover: "bg-[#333333] rounded-lg",
                        item: "text-white hover:bg-[#444444] !text-white",
                      }}
                      onChange={(value) => {
                        formik.setFieldValue(
                          "set_query_limit_month",
                          value?.target?.value || "no limit"
                        );

                        formik.setFieldValue("query_limit_per_month", 0);
                      }}
                      onBlur={formik.handleBlur}
                      isInvalid={
                        formik.errors.set_query_limit_month &&
                        formik.touched.set_query_limit_month
                      }
                      errorMessage={
                        formik.errors.set_query_limit_month &&
                        formik.touched.set_query_limit_month &&
                        formik.errors.set_query_limit_month
                      }
                    >
                      <SelectItem key="no_limit" className="text-white">
                        No Limit
                      </SelectItem>
                      <SelectItem
                        key="query_based_limit"
                        className="text-white"
                      >
                        Query Based Limit
                      </SelectItem>
                    </Select>
                    <div className="mt-2">
                      {formik.values.set_query_limit_month ===
                        "query_based_limit" && (
                        <Input
                          type="text"
                          classNames={{
                            input: "leading-normal",
                            label: "mt-2",
                          }}
                          placeholder={`0`}
                          labelPlacement="outside"
                          label={
                            <span
                              style={{ display: "block", marginBottom: "4px" }}
                            >
                              {" "}
                              Set Query Limit{" "}
                            </span>
                          }
                          name="query_limit_per_month"
                          value={formik.values.query_limit_per_month}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          variant="bordered"
                          isInvalid={
                            formik.errors.query_limit_per_month &&
                            formik.touched.query_limit_per_month
                          }
                          errorMessage={
                            formik.errors.query_limit_per_month &&
                            formik.touched.query_limit_per_month &&
                            formik.errors.query_limit_per_month
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedPricingType.some((val) => val === "annual") && (
              <div>
                <div className="flex gap-4 mt-3">
                  <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 relative">
                    <div className="absolute top-[31px] left-[10px]">$</div>
                    <Input
                      type="text"
                      classNames={{ input: "leading-normal pl-[11px]" }}
                      placeholder={`0.0000`}
                      labelPlacement="outside"
                      label={
                        <span>
                          Select pricing per year{" "}
                          <span className="absolute top-[-7px] right-0 text-[10px]">
                            1
                          </span>
                        </span>
                      }
                      name="pricing_per_yer"
                      value={formik.values.pricing_per_yer}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      variant="bordered"
                      isInvalid={
                        formik.errors.pricing_per_yer &&
                        formik.touched.pricing_per_yer
                      }
                      errorMessage={
                        formik.errors.pricing_per_yer &&
                        formik.touched.pricing_per_yer &&
                        formik.errors.pricing_per_yer
                      }
                    />
                  </div>
                  <div className="flex flex-col w-full gap-1">
                    <div className="text-sm font-bold">
                      <span className="relative">
                        Set Query Limit
                        <span className="absolute top-[-7px] right-[-11px] text-[9px]">
                          2
                        </span>
                      </span>
                    </div>
                    <Select
                      variant="bordered"
                      name="set_query_limit_year"
                      placeholder={
                        formik.values.set_query_limit_year === "no_limit"
                          ? "No Limit"
                          : "Query Based Limit"
                      }
                      value={formik.values.set_query_limit_year || "no_limit"}
                      classNames={{
                        base: "bg-transparent text-white rounded-lg",
                        label: "text-white",
                        button: "leading-normal text-left px-3 text-white",
                        popover: "bg-[#333333] rounded-lg",
                        item: "text-white hover:bg-[#444444] !text-white",
                      }}
                      onChange={(value) => {
                        formik.setFieldValue(
                          "set_query_limit_year",
                          value?.target?.value || "no limit"
                        );
                        formik.setFieldValue("query_limit_per_year", 0);
                      }}
                      onBlur={formik.handleBlur}
                      isInvalid={
                        formik.errors.set_query_limit_year &&
                        formik.touched.set_query_limit_year
                      }
                      errorMessage={
                        formik.errors.set_query_limit_year &&
                        formik.touched.set_query_limit_year &&
                        formik.errors.set_query_limit_year
                      }
                    >
                      <SelectItem key="no_limit" className="text-white">
                        No Limit
                      </SelectItem>
                      <SelectItem
                        key="query_based_limit"
                        className="text-white"
                      >
                        Query Based Limit
                      </SelectItem>
                    </Select>
                    <div className="mt-2">
                      {formik.values.set_query_limit_year ===
                        "query_based_limit" && (
                        <Input
                          type="text"
                          classNames={{
                            input: "leading-normal",
                            label: "mt-2",
                          }}
                          placeholder={`0`}
                          labelPlacement="outside"
                          label={
                            <span
                              style={{ display: "block", marginBottom: "4px" }}
                            >
                              {" "}
                              Set Query Limit{" "}
                            </span>
                          }
                          name="query_limit_per_year"
                          value={formik.values.query_limit_per_year}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          variant="bordered"
                          isInvalid={
                            formik.errors.query_limit_per_year &&
                            formik.touched.query_limit_per_year
                          }
                          errorMessage={
                            formik.errors.query_limit_per_year &&
                            formik.touched.query_limit_per_year &&
                            formik.errors.query_limit_per_year
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {(selectedPricingType.includes("monthly") ||
              selectedPricingType.includes("annual")) && (
              <div>
                <div className="text-[16px] text-[#9B9B9B] mb-2 mt-10 relative pl-2">
                  <span className="absolute top-[-2px] text-white left-[0px] text-[9px]">
                    1
                  </span>
                  {` Revenue will be credited to your account at the beginning of each month. Please note that there will be a 10% fee from all revenue accrued.`}
                </div>
                <div className="text-[16px] text-[#9B9B9B] mb-2 mt-5 relative pl-2">
                  <span className="absolute top-[-2px] text-white left-[0px] text-[9px]">
                    2
                  </span>
                  {`After limit is reached users must the per use payment method for further uses of your tool. If you do not set a per use payment method users will not be able to use your tool.`}
                </div>
              </div>
            )}

            <div className="mb-[63px] mt-4">
              {/* <Checkbox
                color="default"
                isSelected={formik.values.is_agree}
                onValueChange={(val) => formik.setFieldValue("is_agree", val)}
              >
                <div className="text-[16px]">{`Agree to Togl Creator Terms`}</div>
              </Checkbox> */}
              <Checkbox
                name="is_agree"
                color="default"
                isSelected={formik.values.is_agree}
                onValueChange={(val) => formik.setFieldValue("is_agree", val)}
                value={formik.values.is_agree}
                // onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.errors.is_agree && formik.touched.is_agree}
                errorMessage={
                  formik.errors.is_agree &&
                  formik.touched.is_agree &&
                  formik.errors.is_agree
                }
              >
                <div className="text-[16px]">{`Agree to Togl Creator Terms`}</div>
              </Checkbox>
            </div>
          </ModalBody>
          <ModalFooter className="justify-center">
            <Button
              className="h-[38px] rounded-full min-w-unit-0 text-white bg-transparent text-[16px] border-1 border-[#B7B7B7] hover:bg-white hover:text-black"
              // onClick={() => handleViewDetails(item)}
              disabled={submitting}
              onPress={formik.handleSubmit}
            >
              {submitting ? (
                <Spinner color="white" size="sm" />
              ) : (
                `${
                  open?.isEditable
                    ? `Update ${open?.category}`
                    : `Create ${open?.category}`
                }`
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
