import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";
import React, { useMemo, useState } from "react";
import MailIcon from "@/app/assets/svg/mail.svg";
import {
  CalendarDaysIcon,
  CreditCardIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import moment from "moment";
import { useAttachPaymentMethodToCustomerMutation } from "@/app/lib/features/payment/paymentApi";
import { useFormik } from "formik";
import { useAuth } from "@/app/authContext/auth";
import * as Yup from "yup";
import { STRIPE_PUBLISHABLE_KEY } from "@/config";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axiosInstance from "@/app/http/axios";
import { useEffect } from "react";
import toast from "react-hot-toast";
import ToastService from "../Toaster/toastService";
import ReactCountryDropdown from "react-country-dropdown";

// Replace with your actual publishable key
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({
  OpenCardModal,
  setOpenCardModal,
  closeModel,
  isSubmitting,
  setSubmitting,
  afterSubscribe,
  setIsOpenSubsribeModal,
}) => {
  const auth = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [AttachPaymentMethodToCustomer] =
    useAttachPaymentMethodToCustomerMutation();
  const [initialValues, setInitialValues] = useState({
    card_holder_name: "",
    email: "",
    street: "",
    city: "",
    country: "",
    zip_code: "",
  });
  const [selectCountry, setSelectcountry] = useState("US");
  console.log("selectCountry: ", selectCountry);

  const paymentCardSchema = Yup.object().shape({
    card_holder_name: Yup.string()
      .trim()
      .required("Card Holder name is required"),
    email: Yup.string()
      .trim()
      .email("Invalid email address")
      .required("Email is required"),
    street: Yup.string().trim().required("Street is required"),
    city: Yup.string().trim().required("City is required"),
    // country: Yup.string()
    //   .trim()
    //   .required("Country is required")
    //   .matches(
    //     /^[A-Z]{2,3}$/,
    //     "Please enter a country code consisting of 2 to 3 uppercase letters."
    //   ),
    zip_code: Yup.string()
      .trim()
      .matches(/^\d{4,6}(-\d{4})?$/, "Zip code must be 4 to 6 digits.")
      .required("Zip code is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: paymentCardSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setSubmitting(true);

      if (!stripe || !elements) {
        setSubmitting(false);
        return;
      }

      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        setSubmitting(false);
        return;
      }

      try {
        // Step 1: Get the client_secret
        const Info = await axiosInstance.get(
          `/stripe/get-user-card-setup-intent`
        );

        // Step 2: Confirm the card setup
        const result = await stripe.confirmCardSetup(
          Info?.data?.client_secret,
          {
            payment_method: {
              card: cardElement,
              billing_details: {
                email: values.email,
                name: values.card_holder_name,
                address: {
                  line1: values.street,
                  city: values.city,
                  postal_code: values.zip_code,
                  country: selectCountry,
                },
              },
            },
          }
        );

        if (result.error) {
          toast.error(result.error.message);
          return;
        }

        // Step 3: Send payment_method_id to AttachPaymentMethodToCustomer API
        const paymentMethodId = result.setupIntent?.payment_method ?? "";
        const data = { params: { payment_method_id: paymentMethodId } };

        const response = await AttachPaymentMethodToCustomer(data).unwrap();
        toast.success("Card Added Successfully.");
        if (afterSubscribe) {
          setIsOpenSubsribeModal(true);
        }
        setOpenCardModal({ open: false, mode: "", card_details: null });
        closeModel();
        resetForm();
      } catch (error) {
        console.log("####_Error_#### ", error);
        if (error?.data?.message) {
          toast.error(error.data.message);
          window.location.reload();
        } else {
          toast.error("An unexpected error occurred. Please try again");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (OpenCardModal?.open) {
      if (OpenCardModal?.mode === "edit" && OpenCardModal?.card_details) {
        setInitialValues({
          card_holder_name: OpenCardModal?.card_details?.card_holder_name ?? "",
          email: OpenCardModal?.card_details?.email ?? "",
          street: OpenCardModal?.card_details?.street ?? "",
          city: OpenCardModal?.card_details?.city ?? "",
          country: OpenCardModal?.card_details?.country ?? "",
          zip_code: OpenCardModal?.card_details?.zip_code ?? "",
        });
      } else if (OpenCardModal?.mode === "add") {
        setInitialValues({
          card_holder_name: auth?.user?.fullname ?? "",
          email: auth?.user?.email ?? "",
          street: "",
          city: "",
          country: "",
          zip_code: "",
        });
      }
    }
  }, [OpenCardModal?.open, OpenCardModal?.mode]);

  return (
    <>
      <form onSubmit={formik.handleSubmit} noValidate>
        <div className="grid grid-cols-1 gap-4">
          <div className="...">
            <Input
              type="text"
              label=""
              labelPlacement="outside"
              placeholder="Card Holder Name"
              name="card_holder_name"
              classNames={{
                input:
                  "bg-[#0D0D0D] placeholder:text-[#818181] text-[16px] font-normal",
                inputWrapper:
                  "bg-[#0D0D0D] rounded-[5px] data-[hover=true]:bg-[#0D0D0D] group-data-[focus=true]:bg-[#0D0D0D] px-2.5",
              }}
              startContent={
                <UserCircleIcon className="h-[22px] w-[22px] pointer-events-none flex-shrink-0 text-[#B0B0B0]" />
              }
              value={formik.values.card_holder_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.errors.card_holder_name &&
                formik.touched.card_holder_name
              }
              errorMessage={
                formik.errors.card_holder_name &&
                formik.touched.card_holder_name &&
                formik.errors.card_holder_name
              }
            />
          </div>
          <div className="...">
            <Input
              type="email"
              label=""
              labelPlacement="outside"
              placeholder="Email Address"
              name="email"
              classNames={{
                input:
                  "bg-[#0D0D0D] placeholder:text-[#818181] text-[16px] font-normal",
                inputWrapper:
                  "bg-[#0D0D0D] rounded-[5px] data-[hover=true]:bg-[#0D0D0D] group-data-[focus=true]:bg-[#0D0D0D]",
              }}
              startContent={
                <MailIcon className="text-2xl pointer-events-none flex-shrink-0 text-[#B0B0B0]" />
              }
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.errors.email && formik.touched.email}
              errorMessage={
                formik.errors.email &&
                formik.touched.email &&
                formik.errors.email
              }
            />
          </div>
          <div className="">
            <CardElement
              className="p-3 bg-[#0D0D0D] rounded-md"
              options={{
                hidePostalCode: true,
                style: {
                  base: {
                    color: "#fff",
                  },
                },
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="...">
              <Input
                type="text"
                label=""
                labelPlacement="outside"
                placeholder="Street"
                name="street"
                classNames={{
                  input:
                    "bg-[#0D0D0D] placeholder:text-[#818181] text-[16px] font-normal",
                  inputWrapper:
                    "bg-[#0D0D0D] rounded-[5px] data-[hover=true]:bg-[#0D0D0D] group-data-[focus=true]:bg-[#0D0D0D]",
                }}
                value={formik.values.street}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.errors.street && formik.touched.street}
                errorMessage={
                  formik.errors.street &&
                  formik.touched.street &&
                  formik.errors.street
                }
              />
            </div>
            <div className="...">
              <Input
                type="text"
                label=""
                labelPlacement="outside"
                placeholder="City"
                name="city"
                classNames={{
                  input:
                    "bg-[#0D0D0D] placeholder:text-[#818181] text-[16px] font-normal",
                  inputWrapper:
                    "bg-[#0D0D0D] rounded-[5px] data-[hover=true]:bg-[#0D0D0D] group-data-[focus=true]:bg-[#0D0D0D]",
                }}
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.errors.city && formik.touched.city}
                errorMessage={
                  formik.errors.city &&
                  formik.touched.city &&
                  formik.errors.city
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="country-dropdown-add-card">
              <ReactCountryDropdown
                defaultCountry="US"
                onSelect={(country) => setSelectcountry(country.code)}
              />
            </div>
            <div className="...">
              <Input
                type="text"
                label=""
                labelPlacement="outside"
                placeholder="Zipcode"
                name="zip_code"
                classNames={{
                  input:
                    "bg-[#0D0D0D] placeholder:text-[#818181] text-[16px] font-normal",
                  inputWrapper:
                    "bg-[#0D0D0D] rounded-[5px] data-[hover=true]:bg-[#0D0D0D] group-data-[focus=true]:bg-[#0D0D0D]",
                }}
                value={formik.values.zip_code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.errors.zip_code && formik.touched.zip_code}
                errorMessage={
                  formik.errors.zip_code &&
                  formik.touched.zip_code &&
                  formik.errors.zip_code
                }
              />
            </div>
          </div>
          <div className="mb-2">
            <Button
              fullWidth
              type="submit"
              color="primary"
              isLoading={isSubmitting}
              isDisabled={!stripe}
            >
              {OpenCardModal?.mode === "add"
                ? isSubmitting
                  ? "Adding"
                  : "Add"
                : isSubmitting
                ? "Changing"
                : "Change"}
            </Button>
          </div>
        </div>
      </form>
      <ToastService />
    </>
  );
};

const CardFormModal = ({
  OpenCardModal,
  setOpenCardModal,
  afterSubscribe,
  setIsOpenSubsribeModal,
}) => {
  const [isSubmitting, setSubmitting] = useState(false);

  const HandleModalClose = () => {
    if (!isSubmitting) {
      setOpenCardModal({ open: false, mode: "", card_details: null });
    }
  };

  return (
    <>
      <Modal
        isOpen={OpenCardModal?.open}
        key={`${OpenCardModal?.mode}-card-modal`}
        size={"md"}
        onClose={HandleModalClose}
        onOpenChange={HandleModalClose}
        classNames={{
          base: "text-white",
          closeButton: "hover:bg-[#232323] active:bg-[#232323] mt-2 mr-2",
        }}
      >
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader className="flex flex-col gap-1 text-white">{`${
            OpenCardModal?.mode === "edit" ? "Change" : "Add"
          } Card`}</ModalHeader>
          <ModalBody>
            <Elements stripe={stripePromise}>
              <PaymentForm
                OpenCardModal={OpenCardModal}
                setOpenCardModal={setOpenCardModal}
                closeModel={HandleModalClose}
                isSubmitting={isSubmitting}
                setSubmitting={setSubmitting}
                afterSubscribe={afterSubscribe}
                setIsOpenSubsribeModal={setIsOpenSubsribeModal}
              />
            </Elements>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CardFormModal;
