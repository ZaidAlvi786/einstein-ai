"use client";
import { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
} from "@nextui-org/react";
import { useDropzone } from "react-dropzone";
import { ArrowUpTrayIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "@/app/http/axios";
import { useUploadImageMutation } from "@/app/lib/features/chat/chatApi";
import toast from "react-hot-toast";
import ToastService from "@/components/Toaster/toastService";

const UploadProfilePictureModal = ({ isOpen, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null); // State to store selected file
  const [previewSource, setPreviewSource] = useState(""); // State for image preview
  const [UploadImage] = useUploadImageMutation();

  // Define Yup schema for file validation
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

  // useFormik hook to handle form state and submission
  const formik = useFormik({
    initialValues: { image: null },
    validationSchema: fileOrUrlSchema,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      if (selectedFile) {
        setSubmitting(true);
        const formData = new FormData();
        formData.append("image", values.image);

        UploadImage(formData)
          .unwrap()
          .then((response) => {
            const url = response?.url;
            setSelectedFile(url);
            setPreviewSource(url);
            onUpload(url);
            formik.setFieldValue("image", url);
            toast.success("Profile picture updated successfully!");
          })
          .catch((error) => {
            // Handle error
            toast.error(error.message);
            setSelectedFile(null);
            setPreviewSource("");
            formik.resetForm();
          })
          .finally(() => {
            setSubmitting(false);
          });
      }
    },
  });

  // Handle file drop
  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      formik.setFieldValue("image", file);
      previewFile(file);
      setSelectedFile(file);
    }
  };

  // Setup react-dropzone
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png, image/svg+xml",
    onDrop,
    maxFiles: 1,
  });

  // Function to preview the selected file
  const previewFile = (file) => {
      const maxSizeInKB = 900; // Maximum size in KB
      const maxSizeInBytes = maxSizeInKB * 1024;

      if (file.size > maxSizeInBytes) {
        toast.error(`Image size should be less than ${maxSizeInKB} KB.`);
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPreviewSource(reader.result);
      };
  };

  // Function to handle closing the preview
  const handleCancelPreview = () => {
    setSelectedFile(null);
    setPreviewSource("");
    formik.setFieldValue("image", null);
  };

  return (
    <Modal
      key="profile-pic-modal"
      size={"md"}
      isOpen={isOpen}
      onClose={onClose}
      classNames={{
        base: "text-white",
        closeButton: "hover:bg-[#232323] active:bg-[#232323]",
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Upload Profile Picture
            </ModalHeader>
            <ModalBody>
              <div
                className="flex items-center justify-center w-full"
                {...getRootProps({
                  className:
                    "border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-[#232323]",
                })}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center pt-5 pb-6 relative">
                  {selectedFile && (
                    <div className="absolute right-3 top-3">
                      <XCircleIcon
                        className="h-5 w-5 text-gray-400"
                        onClick={handleCancelPreview}
                      />
                    </div>
                  )}
                  {!previewSource && (
                    <>
                      <ArrowUpTrayIcon className="h-8 w-8 m-5 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG or JPG
                      </p>
                    </>
                  )}
                  {previewSource && (
                    <img
                      src={previewSource}
                      alt="Preview"
                      className="max-h-64 max-w-full object-contain mb-4"
                    />
                  )}
                </div>
              </div>
              {formik.errors.image && formik.touched.image && (
                <div className="text-red-500">{formik.errors.image}</div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                color="success"
                disabled={!formik.isValid || !selectedFile}
                onPress={formik.handleSubmit}
              >
                {formik.isSubmitting ? "Uploading..." : "Upload"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
      <ToastService />
    </Modal>
  );
};

export default UploadProfilePictureModal;
