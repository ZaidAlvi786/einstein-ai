"use client";
import { useState, useRef, useEffect } from "react";
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
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useAddToolModelGptMutation,
  useGetRandomImageriesQuery,
  useGetRandomLogoImageriesQuery,
  useGetUserToolsQuery,
  useUpdateToolMutation,
} from "@/app/lib/features/chat/chatApi";
import { XCircleIcon } from "@heroicons/react/20/solid";
import AttachFileIcon from "@/app/assets/svg/attach_file.svg";
import PlusIconNew from "@/app/assets/svg/plusicon.svg";
import axiosInstance from "@/app/http/axios";
import Trashicon from "@/app/assets/svg/trash-icon.svg";
import toast from "react-hot-toast";
import ToastService from "../Toaster/toastService";
import { useRouter } from "next/navigation";
import mammoth from "mammoth";
import { useAuth } from "@/app/authContext/auth";
// import * as pdfjs from "pdfjs-dist";
// import pdfParse from "pdf-parse";
import { PDFDocument } from "pdf-lib";


export const chatModelLists = [
  { key: "claude", label: "Claude" },
  { key: "gpt3", label: "GPT-3.5" },
  { key: "gpt4", label: "GPT-4" },
  { key: "gemini", label: "Gemini" },
  { key: "perplexity", label: "Perplexity" },
  { key: "mistral", label: "Mistral" },
];

function AddGptModel({ open, setOpen, generateRandomImage }) {
  console.log("open: ", open);
  const auth = useAuth();
  const router = useRouter;
  const fileInput = useRef();
  const fileInput1 = useRef();

  const [isfileSubmitting, setIsFileSubmitting] = useState({
    open: false,
    key: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [AddToolModelGpt] = useAddToolModelGptMutation();
  const [UpdateTool] = useUpdateToolMutation();
  const [totalTokens, setTotalTokens] = useState(0);
  //   const [contextFiles, setContextFiles] = useState({}); // { contextIndex: [fileInfo, ...] }
  const [contextFiles, setContextFiles] = useState({});
  const maxTokens = 100000; // 100k
  const [lastValidContext, setLastValidContext] = useState([]);
  const [isSelected, setIsSelected] = useState(true);
  const [initialValues, setInitialValues] = useState({
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
    context_window: [""],
    chat_model: "claude",
    prompt: "",
  });

  const {
    data: randomImage,
    isFetching: randomImageLoading,
    refetch: refetchRandomImage,
  } = useGetRandomImageriesQuery();
  const {
    data: Logo_randomImage,
    isFetching: Logo_randomImageLoading,
    refetch: Logo_refetchRandomImage,
  } = useGetRandomLogoImageriesQuery();
  const [usersubscribedModels, setusersubscribedModels] = useState([])

  const { data: getUserToolsData } = useGetUserToolsQuery(
    {},
    { skip: !(auth?.user?.email && auth?.user?.fullname) }
  );

  const filteredModelsAndGptsData = (data) => {
    return data?.reduce(
      (acc, tool) => {
        if (tool?.category === "model") {
          acc?.model?.push(tool);
        } else if (tool?.category === "gpt") {
          acc?.gpt?.push(tool);
        }
        return acc;
      },
      { model: [], gpt: [] }
    );
  };


  useEffect(() => {
    const result = filteredModelsAndGptsData(
      getUserToolsData?.subscribed_tools ?? []
    );
    if(result?.model?.length > 0){
      setusersubscribedModels(result?.model)
    }
  }, [getUserToolsData])

  useEffect(() => {
    if (open?.isEditable && open?.tool_details) {
      const tools = open?.tool_details;
      setInitialValues({
        name: tools?.name,
        description: tools?.description || "",
        introtext: tools?.introtext || "",
        category: tools?.category,
        tags: tools?.tags || [],
        url: tools?.url || "",
        logo: tools?.logo || "",
        tool_monetization: tools?.tool_monetization || "",
        price: tools?.price,
        preview_url: tools?.preview_url ? [...tools?.preview_url] : [],
        is_agree: true,
        is_public: tools?.is_public || false,
        social_links: {
          website: tools?.social_links?.website || "",
          discord: tools?.social_links?.discord || "",
          facebook: tools?.facebook || "",
          twitter: tools?.twitter || "",
          instagram: tools?.instagram || "",
          linkedin: tools?.linkedin || "",
          github: tools?.github || "",
        },
        support_email: tools?.support_email || "",
        context_window: tools?.context_window || [],
        chat_model: tools?.chat_model || "claude",
        prompt: tools?.prompt || "",
      });
    }
  }, [open?.isEditable, open?.tool_details, setOpen]);

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
    introtext: Yup.string().max(250, "Intro text cannot exceed 250 characters"),
    social_links: Yup.object().shape({
      website: Yup.string().url("Invalid Website URL"),
      discord: Yup.string().url("Invalid Discord URL"),
      facebook: Yup.string().url("Invalid Facebook URL"),
      twitter: Yup.string().url("Invalid Twitter URL"),
      instagram: Yup.string().url("Invalid Instagram URL"),
      linkedin: Yup.string().url("Invalid Linkedin URL"),
      github: Yup.string().url("Invalid Github URL"),
    }),
    chat_model: Yup.string().required("Chat Model field is required."),
    preview_url: Yup.array()
      .min(1, "At least one preview image is required.")
      .of(Yup.string().url("Must be a valid URL")),
    is_agree: Yup.boolean()
      .oneOf([true], "You must agree to our terms and conditions")
      .required("You must agree to the terms and conditions"),
  });
  //   const CreateGPTsToolsValidationSchema = Yup.object({
  //     name: Yup.string()
  //       .trim()
  //       .max(255, "Group name must not be greater than 255 characters.")
  //       .required("Group name field is required."),
  //     logo: Yup.mixed()
  //       .required("Logo image is required.")
  //       .test(
  //         "file-type-or-url",
  //         "Only JPG, PNG, SVG files or a valid URL are allowed",
  //         (value) => {
  //           if (!value) return true;
  //           if (typeof value === "string") {
  //             const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
  //             if (urlPattern.test(value)) {
  //               return true;
  //             }
  //           }
  //           return ["image/jpeg", "image/png", "image/svg+xml"].includes(
  //             value.type
  //           );
  //         }
  //       ),
  //     description: Yup.string()
  //       .required("Description is required")
  //       .max(1500, "Description cannot exceed 1500 characters"),
  //     // chat_model: Yup.string().required("Chat Model field is required."), //TODO- Remove comment
  //     // Add validation for total tokens
  //     context_window: Yup.array().of(
  //       Yup.string().test(
  //         "context-token-limit",
  //         `Total tokens exceed the limit of ${maxTokens}`,
  //         function () {
  //           return totalTokens <= maxTokens;
  //         }
  //       )
  //     ),
  //     context_window: Yup.array()
  //       .of(
  //         Yup.string()
  //           .trim()
  //           .required("Context name is required")
  //           .max(255, "Context name must not exceed 255 characters")
  //       )
  //       .test("unique", "Context names must be unique", (contextNames) => {
  //         const names = contextNames.map((name) => name.toLowerCase());
  //         return names.length === new Set(names).size;
  //       })
  //       .test(
  //         "token-limit",
  //         `Total tokens exceed the limit of ${maxTokens}`,
  //         function () {
  //           return totalTokens <= maxTokens;
  //         }
  //       ),
  //   });

  const handleCancelPreview = () => {
    formik.setFieldValue("logo", "");
  };

  const formik = useFormik({
    initialValues,
    validationSchema: CreateGPTsToolsValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setSubmitting(true);
      // Initialize the context window array
      const contextWindowArray = [];
      if (values.prompt.length > 0) {
        contextWindowArray.push(values.prompt);
      }

      // Iterate over formik values context_window
      values.context_window.forEach((contextName) => {
        const inputLength = contextName.length;

        // Add context name directly to the array
        contextWindowArray.push(contextName);

        // Count tokens from attached files
        if (contextFiles[contextName]) {
          contextFiles[contextName].forEach((file) => {
            if (file.content) {
              contextWindowArray.push(file.content); // Add the file content to context window
            }
          });
        }
      });

      const data = {
        ...values,
        tool_monetization: values.tool_monetization,
        price: values.price,
        category: open?.category,
        context_window:
          contextWindowArray?.length > 0
            ? contextWindowArray.filter((context) => context !== "")
            : [],
        preview_url: values.preview_url,
        tool_id: open?.tool_details?.id,
      };
      console.log('data: ', data);

      try {
        const apiName = open?.isEditable ? UpdateTool : AddToolModelGpt;

        const response = await apiName(data).unwrap();
        HandleModalClose();
        resetForm();
        setContextFiles({});
        setTotalTokens(0);
        toast.success(response.message);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } catch (error) {
        if (error?.data?.message) {
          toast.error(error?.data?.message);
        } else {
          // toast.error("An unexpected error occurred.");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });
  useEffect(() => {
    if (generateRandomImage && Logo_randomImage?.random_image) {
      formik.setFieldValue("logo", Logo_randomImage?.random_image);
    }
    if (generateRandomImage && randomImage?.random_image) {
      formik.setFieldValue("preview_url", [randomImage?.random_image]);
    }
  }, [Logo_randomImage, open, randomImage]);

  const HandleModalClose = () => {
    if (!submitting) {
      setOpen(false);
      formik.resetForm();
      setContextFiles({});
      setTotalTokens(0);
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

  const HandleAddContext = () => {
    if (totalTokens >= maxTokens) {
      toast.error(
        `Cannot add more contexts. Total tokens limit of ${maxTokens} has been reached.`
      );
      return;
    }
    formik.setFieldValue("context_window", [
      ...formik.values.context_window,
      "",
    ]);
  };

  //   const getFilesForContext = (contextIndex) => {
  //     return contextFiles[contextIndex] || [];
  //   };

  const getAllAttachedFiles = () => {
    return Object.values(contextFiles).flat();
  };

  // Usage
  const allFiles = getAllAttachedFiles();

  //   const handleAttachFiles = (event, ele_key) => {
  //     const file = event.target.files[0];
  //     if (file) {
  //       const reader = new FileReader();

  //       // Read the file as text and set the content to the corresponding input field
  //       reader.onload = (e) => {
  //         const fileContent = e.target.result;

  //         // Set file content to input field's value (context window)
  //         const updatedItems = [...formik.values.context_window];
  //         updatedItems[ele_key] = fileContent; // Set the file content as the value
  //         formik.setFieldValue("context_window", updatedItems);
  //       };

  //       // Read the file content
  //       reader.readAsText(file);
  //     }
  //   };

  // const handleAttachFiles = async (event, ele_key) => {
  //   const file = event.target.files[0];
  //   if (!file) return;
  
  //   // Validate file type
  //   const allowedFileTypes = [
  //     "application/pdf",
  //     "text/plain",
  //     "application/msword",
  //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  //   ];
  
  //   if (!allowedFileTypes.includes(file.type)) {
  //     toast.error("Invalid file type. Please upload a valid file.");
  //     return;
  //   }
  
  //   try {
  //     if (file.type === "application/pdf") {
        
  //       const arrayBuffer = await file.arrayBuffer();
  //       pdfjs.GlobalWorkerOptions.workerSrc = "pdf.worker.min.mjs";
  //       const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  
  //       let pdfText = '';
  //       for (let i = 1; i <= pdf.numPages; i++) {
  //         const page = await pdf.getPage(i);
  //         const textContent = await page.getTextContent();
  //         pdfText += textContent.items.map(item => item.str).join(' ');
  //       }
  
  //       handleFileContent(pdfText, ele_key);
  //     } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
  //       const arrayBuffer = await file.arrayBuffer();
  //       const result = await mammoth.extractRawText({ arrayBuffer });
  //       const fileContent = result.value;
  //       handleFileContent(fileContent, ele_key);
  //     } else {
  //       const reader = new FileReader();
  //       reader.onload = (e) => {
  //         const fileContent = e.target.result;
  //         handleFileContent(fileContent, ele_key);
  //       };
  //       reader.readAsText(file);
  //     }
  //   } catch (error) {
  //     console.error("Error processing file:", error);
  //     toast.error("Failed to process the file.");
  //   }
  // };


 
const handleAttachFiles = async (event, ele_key) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file type
  const allowedFileTypes = [
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedFileTypes.includes(file.type)) {
    toast.error("Invalid file type. Please upload a valid file.");
    return;
  }

  try {
    let fileContent = "";

    console.log("🚀 ~ handleAttachFiles ~ file.type:", file.type)
    if(file.type === "application/pdf"){
      toast.error("Please upload .docx or.txt file.")
      return
    }
    if (file.type === "application/pdf") {
      // Extract text from PDF using pdf-lib
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      fileContent = pages
        .map((page) => page.getTextContent()) // Extract text from each page
        .join(" ");
    } else if (
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // Extract text from DOCX
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      fileContent = result.value;
    } else {
      // Extract text from TXT
      const reader = new FileReader();
      reader.onload = (e) => {
        fileContent = e.target.result;
        handleFileContent(fileContent, ele_key);
      };
      reader.readAsText(file);
      return; // Return early to avoid duplicate processing
    }

    handleFileContent(fileContent, ele_key);
  } catch (error) {
    console.error("Error processing file:", error);
    toast.error("Failed to process the file.");
  }
};
  
  const handleFileContent = (content, ele_key) => {
    const fileTokens = content.split(/\s+/).length;
    const currentTokens = calculateTotalTokens();
    const tempTokens = currentTokens + fileTokens;
  
    if (tempTokens <= maxTokens) {
      setLastValidContext([...formik.values.context_window]);
      const updatedItems = [...formik.values.context_window];
      updatedItems[ele_key] = content;
      formik.setFieldValue("context_window", updatedItems);
    } else {
      toast.error("File attachment exceeds token limit!");
    }
  };
  

  //   const handleAttachFiles = (event, contextIndex) => {
  //     const files = Array.from(event.target.files);
  //     if (files.length === 0) return;

  //     // Get the context name based on the contextIndex
  //     const contextName = formik.values.context_window[contextIndex].trim();
  //     if (!contextName) {
  //       toast.error("Please provide a context name before attaching files.");
  //       return;
  //     }

  //     // Validate file types
  //     const allowedTypes = [
  //       "application/pdf",
  //       "text/plain",
  //       "application/msword",
  //       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  //     ];
  //     const invalidFiles = files.filter(
  //       (file) => !allowedTypes.includes(file.type)
  //     );
  //     if (invalidFiles.length > 0) {
  //       toast.error("Only PDF, TXT, DOC, DOCX files are allowed.");
  //       return;
  //     }

  //     // Read and process files
  //     const readFilePromises = files.map((file) => {
  //       return new Promise((resolve, reject) => {
  //         const reader = new FileReader();

  //         reader.onload = async (e) => {
  //           let text = "";
  //           try {
  //             if (file.type === "application/pdf") {
  //               // Handle PDF files
  //               const pdfjsLib = await import("pdfjs-dist/build/pdf");
  //               pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;
  //               const pdf = await pdfjsLib.getDocument({ data: e.target.result })
  //                 .promise;
  //               const maxPages = pdf.numPages;
  //               let countPromises = [];
  //               for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
  //                 countPromises.push(
  //                   pdf.getPage(pageNum).then((page) => page.getTextContent())
  //                 );
  //               }
  //               const pages = await Promise.all(countPromises);
  //               pages.forEach((page) => {
  //                 page.items.forEach((item) => {
  //                   text += item.str + " ";
  //                 });
  //               });
  //               resolve({ text, file });
  //             } else if (
  //               file.type === "application/msword" ||
  //               file.type ===
  //                 "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  //             ) {
  //               // Handle DOC and DOCX files using mammoth
  //               const mammoth = await import("mammoth");
  //               const result = await mammoth.extractRawText({
  //                 arrayBuffer: e.target.result,
  //               });
  //               text = result.value;
  //               resolve({ text, file });
  //             } else if (file.type === "text/plain") {
  //               // Handle TXT files
  //               text = e.target.result; // readAsText provides a string
  //               resolve({ text, file });
  //             } else {
  //               // Unsupported file type
  //               reject(`Unsupported file type: ${file.type}`);
  //             }
  //           } catch (err) {
  //             reject(`Error processing file "${file.name}": ${err.message}`);
  //           }
  //         };

  //         reader.onerror = () => {
  //           reject(`Error reading file "${file.name}".`);
  //         };

  //         // Read file based on type
  //         if (file.type === "text/plain") {
  //           reader.readAsText(file);
  //         } else {
  //           reader.readAsArrayBuffer(file);
  //         }
  //       });
  //     });

  //     Promise.all(readFilePromises)
  //       .then((results) => {
  //         const texts = results.map((res) => res.text);
  //         const filesData = results.map((res) => res.file);

  //         let combinedLength = texts.reduce((acc, curr) => acc + curr.length, 0);
  //         if (totalTokens + combinedLength > maxTokens) {
  //           toast.error(`Uploading these files exceeds the total token limit of ${maxTokens}.`);
  //           return;
  //         }

  //         // Update total tokens
  //         setTotalTokens((prev) => prev + combinedLength);

  //         // Prepare file info
  //         const newFiles = filesData.map((file, index) => ({
  //           id: uuidv4(),
  //           name: file.name,
  //           size: (file.size / 1024).toFixed(2), // in KB
  //           length: texts[index].length,
  //           file: file, // Store the actual File object
  //           text: texts[index], // Optional: for backend use
  //         }));

  //         setContextFiles((prev) => {
  //           const updated = { ...prev };
  //           if (!updated[contextName]) {
  //             updated[contextName] = [];
  //           }
  //           updated[contextName] = [...updated[contextName], ...newFiles];
  //           return updated;
  //         });
  //       })
  //       .catch((err) => {
  //         toast.error(err);
  //       });
  //   };

  // Function to remove a file
  const handleRemoveFile = (contextIndex, fileId) => {
    setContextFiles((prev) => {
      const updated = { ...prev };
      const fileToRemove = updated[contextIndex].find((f) => f.id === fileId);
      if (fileToRemove) {
        setTotalTokens((prevTokens) => prevTokens - fileToRemove.length);
        updated[contextIndex] = updated[contextIndex].filter(
          (f) => f.id !== fileId
        );
        if (updated[contextIndex].length === 0) {
          delete updated[contextIndex];
        }
      }
      return updated;
    });
  };

  const calculateTotalTokens = () => {
    let tokens = 0;

    // Count tokens from form input
    formik.values.context_window.forEach((contextName) => {
      tokens += contextName.length; // Count input length as tokens

      // Count tokens from attached files
      if (contextFiles[contextName]) {
        contextFiles[contextName].forEach((file) => {
          if (file.content) {
            tokens += file.content.split(/\s+/).length; // Count words as tokens
          }
        });
      }
    });

    return tokens;
  };

  //   useEffect(() => {
  //     const updatedTotalTokens = calculateTotalTokens();
  //     setTotalTokens(updatedTotalTokens);

  //     // Show alert if total tokens exceed maxTokens
  //     if (updatedTotalTokens > maxTokens) {
  //       alert("Token limit exceeded!");
  //     }
  //   }, [formik.values.context_window, contextFiles]);

  useEffect(() => {
    const updatedTotalTokens = calculateTotalTokens();
    setTotalTokens(updatedTotalTokens);

    // Show alert if total tokens exceed maxTokens, and reset context_window if needed
    if (updatedTotalTokens > maxTokens) {
      // alert("Token limit exceeded! Resetting to last valid state.");
      toast.error("Can't upload. Token limit exceeded!");

      // Reset to previous valid state if you want to enforce limits
      // This can be done by maintaining a previous state
      // or resetting the last valid context_window
      // Example:
      formik.setFieldValue("context_window", lastValidContext); // Ensure you maintain last valid context
    }
  }, [formik.values.context_window, contextFiles]);

  const formatTokens = (num) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`;
    }
    return num.toString();
  };

  const RemovePreviewImage = (preview_img_index) => {
    const filteredArray = formik?.values?.preview_url?.filter(
      (_, index) => index !== preview_img_index
    );
    formik.setFieldValue("preview_url", filteredArray);
  };
  return (
    <>
      <Modal
        key="create-tools-modal"
        size={"2xl"}
        isOpen={open?.open}
        onClose={() => HandleModalClose()}
        onOpenChange={() => HandleModalClose()}
        classNames={{
          base: "text-white bg-[#171717]",
          closeButton: "hover:bg-[#232323] active:bg-[#232323]",
        }}
        scrollBehavior="outside"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 mb-[18px]">
            {`${open?.isEditable ? "Update" : "Create"} a GPT`}
          </ModalHeader>
          <ModalBody className="gap-[16px] pt-6">
            <div className="flex w-full flex-col">
              <div>
                {/* Logo Upload Section */}
                <div className="flex w-full flex-col mb-[23px] gap-4">
                  <div className="flex flex-col gap-[14px] 4k:gap-[65.94px]">
                    <span className="text-[#ECECEC] text-[15px] 4k:text-[28.409px] 4k:-tracking-[1.026px] -tracking-[0.225px] font-semibold">
                      Image
                    </span>
                    {isfileSubmitting.open &&
                    isfileSubmitting.key === "logo" ? (
                      <Spinner size="lg" color="default" />
                    ) : formik.values.logo ? (
                      <div className="flex items-center relative max-w-max">
                        {/* <Avatar
                          className="w-[80px] h-[80px] cursor-pointer"
                          src={formik.values.logo}
                          onClick={() => fileInput1.current.click()}
                          radius="full"
                        /> */}
                        <img
                          src={formik.values.logo}
                          className="w-[80px] h-[80px] cursor-pointer rounded-full"
                          onClick={() => fileInput1.current.click()}
                          alt="avatar"
                        />

                        <div className="absolute -right-2 -top-2 cursor-pointer">
                          <XCircleIcon
                            className="h-5 w-5 text-gray-400"
                            onClick={handleCancelPreview}
                          />
                        </div>
                      </div>
                    ) : (
                      <div
                        className="flex items-center border border-[#424242] border-dashed rounded-[20px] 4k:rouded-[91.211px] 4k:border-[9.121px] cursor-pointer 4k:w-[364.846px] 4k:h-[364.846px] w-[80px] h-[80px]"
                        onClick={() => fileInput1.current.click()}
                      >
                        <div className="flex flex-col items-center justify-center relative w-[78px] h-[78px] 4k:h-[362.846px] 4k:[362.846px]">
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
                      accept=".jpg,.jpeg,.png,.svg"
                    />
                  </div>
                  <div className="flex mx-auto">
                    {formik.errors.logo && formik.touched.logo && (
                      <p className="text-danger font-medium">
                        {formik.errors.logo}
                      </p>
                    )}
                  </div>
                </div>

                {/* GPT Name Input */}
                <div className="flex w-full flex-wrap md:flex-nowrap mb-[22px]">
                  <Input
                    type="text"
                    placeholder="Name of GPT"
                    classNames={{
                      input:
                        "leading-normal text-[16px] 4k:text-[17.969px] text-white placeholder:text-[#9B9B9B] font-bold font-roboto",
                      inputWrapper:
                        "border border-[#424242] rounded-[7px] !min-h-[38px]",
                      label: "text-[15px] font-bold font-roboto",
                      errorMessage: "text-sm font-medium",
                    }}
                    labelPlacement="outside"
                    label={
                      <span className="text-[15px] font-bold font-roboto">
                        Name
                      </span>
                    }
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

                {/* Description Textarea */}
                <div className="flex w-full flex-wrap md:flex-nowrap mb-[22px] relative">
                  <Textarea
                    classNames={{
                      input:
                        "leading-normal text-white placeholder:text-[#9B9B9B]  text-[16px] 4k:text-[17.969px] font-normal font-roboto",
                      inputWrapper: "border border-[#424242] !min-h-[82px]",
                      label: "text-[15px] font-bold font-roboto",
                      errorMessage: "text-sm font-medium",
                    }}
                    label="Description"
                    variant="bordered"
                    labelPlacement="outside"
                    placeholder="In a few sentences"
                    minRows={3}
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

                {/* <div className="flex w-full flex-wrap md:flex-nowrap mb-[22px]">
                      <Input
                        type="text"
                        placeholder="Short description"
                        classNames={{
                          input:
                            "leading-normal text-[#9B9B9B] text-[16px] 4k:text-[17.969px] font-bold font-roboto",
                          inputWrapper: "border border-[#424242] rounded-[7px]  4k:rounded-[31.924px]",
                          label: "text-[15px] font-bold font-roboto",
                          errorMessage: "text-sm font-medium",
                        }}
                        labelPlacement="outside"
                        label={
                          <span className="text-[15px] font-bold font-roboto">
                            Short description
                          </span>
                        }
                        name="introtext"
                        value={formik.values.introtext}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        variant="bordered"
                        isInvalid={
                          formik.errors.introtext && formik.touched.introtext
                        }
                        errorMessage={
                          formik.errors.introtext &&
                          formik.touched.introtext &&
                          formik.errors.introtext
                        }
                      />
                    </div> */}

                {/* Chat Model Selection */}
                <div className="flex w-full flex-wrap md:flex-nowrap mb-[22px] relative">
                  <Select
                    label={
                      <span className="text-[15px] font-bold font-roboto">
                        Select Model
                      </span>
                    }
                    labelPlacement="outside"
                    placeholder="Claude 3.5 100K"
                    classNames={{
                      trigger:
                        "bg-transparent border border-[#424242] !min-h-[38px] 4k:min-h-[173.302px] data-[hover=true]:bg-transparent",
                      errorMessage: "text-sm font-medium",
                      value: `!font-normal !text-[16px] 4k:!text-[17.969px] ${
                        formik.values.chat_model
                          ? "text-white"
                          : "text-[#9B9B9B]"
                      }`,
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
                    name="chat_model"
                    items={usersubscribedModels}
                    selectionMode="single"
                    radius="sm"
                    selectedKeys={
                      formik.values.chat_model
                        ? [formik.values.chat_model]
                        : null
                    }
                    // onChange={(keys) => {
                    //   const selectedKey = keys[0] || "";
                    //   formik.setFieldValue("chat_model", selectedKey);
                    // }}

                    // onChange={(keys) => {
                    //     const selectedKey = Array.isArray(keys) && keys.length > 0 ? keys[0] : "";
                    //     formik.setFieldValue("chat_model", selectedKey);
                    //   }}
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
                      <SelectItem key={item.id}>{item.name}</SelectItem>
                    )}
                  </Select>
                </div>

                {/* Prompt Input */}
                <div className="flex w-full flex-col gap-[10px] flex-wrap md:flex-nowrap mb-[22px] relative">
                  <div className="flex gap-[11.5px] 4k:gap-[52.45px] items-center">
                    <span className="text-[15px] 4k:text-[28.409px] font-bold font-roboto">
                      Prompt
                    </span>
                    {/* <span className='4k:h-[55px] bg-[#ECECEC] 4k:w-[6px] 4k:rounded-[31.924px] h-[13px] w-[1px] rounded-[7px]'></span> */}
                    {/* <div className='flex items-center gap-[8px] 4k:gap-[39.64px]'>
                      <span
                        className={`text-[15px] 4k:text-[28.409px] font-bold font-roboto ${
                          isSelected ? "text-[#fff]" : "text-[#A0A0A0]"
                        }`}
                      >
                        Custom
                      </span>
                      <Switch
                        classNames={{
                          wrapper: `${
                            isSelected ? "!bg-[#5E91FF]" : "!bg-[#C8C8C8]"
                          } h-[18.957px] w-[33px] p-0`,
                          thumb: `${
                            isSelected ? "!ml-[14px]" : ""
                          } h-[18.957px] w-[18.957px]`,
                        }}
                        isSelected={isSelected}
                        onValueChange={setIsSelected}
                      ></Switch>
                    </div> */}
                  </div>
                  <Input
                    type="text"
                    placeholder={
                      formik.values.prompt
                        ? formik.values.prompt
                        : "Answer questions based off the following context"
                    }
                    classNames={{
                      input:
                        "leading-normal text-[#fff] placeholder:text-[#9B9B9B] text-[16px] 4k:text-[17.969px] font-normal font-roboto",
                      inputWrapper:
                        "border border-[#424242] !min-h-[38px] 4k:min-h-[173.302px] 4k:rounded-[31.924px] rounded-[7px]",
                      label: "text-[15px] font-bold font-roboto",
                    }}
                    labelPlacement="outside"
                    name="prompt"
                    value={formik.values.prompt}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    variant="bordered"
                    isInvalid={formik.errors.prompt && formik.touched.prompt}
                    errorMessage={
                      formik.errors.prompt &&
                      formik.touched.prompt &&
                      formik.errors.prompt
                    }
                  />
                </div>

                {/* Context Section */}
                <div className="flex flex-col w-full">
                  <div className="flex justify-between items-center w-full mb-1.5">
                    <label className="text-[15px] font-bold font-roboto">
                      Context
                    </label>
                    <p className="text-[#9B9B9B] text-[15px] font-bold">
                      {`Total Tokens: ${formatTokens(totalTokens)}`}{" "}
                      &nbsp;&nbsp;
                      {`Token Limit: ${formatTokens(maxTokens)}`}
                    </p>
                  </div>
                  <div className="flex w-full flex-col flex-wrap">
                    {formik.values.context_window?.map(
                      (contextName, ele_key) => (
                        <div key={ele_key} className="mb-4">
                          <Input
                            type="text"
                            placeholder={`Context ${ele_key + 1}`}
                            classNames={{
                              input:
                                "leading-normal text-white placeholder:text-[#9B9B9B] text-[16px] 4k:text-[17.969px] font-normal font-roboto",
                              inputWrapper:
                                "border border-[#424242] !min-h-[38px] rounded-[7px] 4k:rounded-[31.924px] 4k:min-h-[173.302px] mb-[5px]",
                              label: "text-[15px] font-bold font-roboto",
                            }}
                            label=""
                            labelPlacement="outside"
                            endContent={
                              <button
                                className="focus:outline-none"
                                type="button"
                                onClick={() => {
                                  document
                                    .getElementById(`attach-file-${ele_key}`)
                                    .click();
                                }}
                              >
                                <AttachFileIcon className="cursor-pointer" />
                              </button>
                            }
                            value={contextName}
                            onChange={(event) => {
                              const newValue = event.target.value;
                              const updatedItems = [
                                ...formik.values.context_window,
                              ];

                              // Calculate new token count if the change is applied
                              const newContextWindow = updatedItems.map(
                                (item, index) =>
                                  index === ele_key ? newValue : item
                              );
                              const newTotalTokens =
                                calculateTotalTokens(newContextWindow);

                              // Only update the state if the new total tokens are within limit
                              if (newTotalTokens <= maxTokens) {
                                updatedItems[ele_key] = newValue;
                                formik.setFieldValue(
                                  "context_window",
                                  updatedItems
                                );
                              } else {
                                toast.success(
                                  "Cannot add more tokens, limit exceeded!"
                                );
                              }
                            }}
                            variant="bordered"
                          />
                          {/* Hidden file input */}
                          <input
                            id={`attach-file-${ele_key}`}
                            type="file"
                            accept=".pdf,.txt,.doc,.docx"
                            className="hidden"
                            multiple
                            onChange={(event) =>
                              handleAttachFiles(event, ele_key)
                            }
                          />
                          {/* Display the token count */}
                          <div className="text-sm text-gray-500 ml-1">
                            Tokens:{" "}
                            {formik.values.context_window[ele_key]?.length || 0}
                          </div>
                          {/* Optional: Display file content if needed */}
                          {contextFiles[contextName] &&
                            contextFiles[contextName][0]?.content && (
                              <div className="mt-2 space-y-2 p-2 bg-[#2F2F2F] rounded">
                                <pre className="text-sm text-white whitespace-pre-wrap">
                                  {contextFiles[contextName][0].content}
                                </pre>
                              </div>
                            )}
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Add Context Button */}
                <div className="text-center w-full mb-[31px]">
                  <Button
                    className="p-0 bg-[transperant] h-[auto]"
                    onPress={HandleAddContext}
                    // disabled={totalTokens >= maxTokens}
                  >
                    <span className="text-[15px] font-bold font-roboto">
                      <PlusIconNew className="scale-[0.8]" />
                    </span>
                    {`Add Context box`}
                  </Button>
                </div>

                {/* <div className='flex w-full flex-col mb-[15px] md:mb-0 gap-4'>
                  <div className='text-[15px] font-bold font-roboto'>{`Social links`}</div>
                  {Object.keys(initialValues?.social_links).map(
                    (ele, index) => (
                      <div className='flex flex-col w-full'>
                        <Input
                          key={index}
                          type='text'
                          placeholder={ele}
                          classNames={{
                            input:
                              "placeholder:capitalize leading-normal text-[16px] 4k:text-[17.969px] font-bold",
                            innerWrapper:
                              "4k:min-h-[173.302px] !min-h-[38px] 4k:rounded-[31.924px]",
                          }}
                          value={formik?.values?.social_links[ele]}
                          onChange={(event) => {
                            const value = event?.target?.value?.trimStart();
                            formik.setFieldValue("social_links", {
                              ...formik.values.social_links,
                              [ele]: value,
                            });
                          }}
                          labelPlacement='outside'
                          label=''
                          variant='bordered'
                          fullWidth
                        />
                        {formik?.errors?.social_links?.[ele] &&
                          formik?.touched?.social_links?.[ele] && (
                            <div className='text-danger'>
                              {formik?.errors?.social_links?.[ele]}
                            </div>
                          )}
                      </div>
                    )
                  )}
                </div> */}

                {/* Preview Images section */}
                <div className="flex w-full flex-col gap-4">
                  <div className="text-[15px] font-bold font-roboto">{`Preview Images - add up to 6 images`}</div>
                  <div className="flex flex-col">
                    <div className="container mx-auto">
                      <div className="flex gap-4 items-center">
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
                                handleChangeOnWorkspaceImage(
                                  event,
                                  "preview_url"
                                )
                              }
                            />
                          </>
                        )}
                      </div>
                    </div>
                    {formik.errors.preview_url &&
                      formik.touched.preview_url && (
                        <div className="text-danger mt-[10px]">
                          {formik.errors.preview_url}
                        </div>
                      )}
                  </div>
                </div>

                {/* <div className="flex w-full flex-wrap md:flex-nowrap mb-[29px] gap-4 mt-8">
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
                          formik.errors.support_email &&
                          formik.touched.support_email
                        }
                        errorMessage={
                          formik.errors.support_email &&
                          formik.touched.support_email &&
                          formik.errors.support_email
                        }
                      />
                    </div> */}
                {/* Monetization Placeholder */}
                <div className="flex w-full mt-[35px]">
                  <Input
                    type="text"
                    placeholder="Coming Soon!"
                    classNames={{
                      input:
                        "leading-normal text-[#9B9B9B] text-[16px] 4k:text-[17.969px] font-normal font-roboto",
                      inputWrapper:
                        "border border-[#424242] !min-h-[38px] bg-transparent 4k:rounded-[31.924px] 4k:min-h-[173.302px] ",
                      label: "text-[15px] font-bold font-roboto",
                    }}
                    labelPlacement="outside"
                    label="Monetize your GPT: Set Your Cost Per Token"
                    radius="sm"
                    // variant="bordered"
                    // name="introtext"
                    // value={formik.values.introtext}
                    // onChange={formik.handleChange}
                    // onBlur={formik.handleBlur}
                    // isInvalid={(formik.errors.introtext && formik.touched.introtext)}
                    // errorMessage={(formik.errors.introtext && formik.touched.introtext) && formik.errors.introtext}
                  />
                </div>

                {/* Monetization Info */}
                <div className="text-[16px] text-[#9B9B9B] font-bold font-roboto mb-[35px] mt-1">
                  {`Revenue will be credited to your account at the beginning of each month. Please note that there will be a 10% fee from all revenue accrued.`}
                </div>

                {/* Capabilities Section */}
                <div className="mb-[31px]">
                  <div className="text-[15px] font-bold font-roboto mb-[9px]">
                    {`Add your Ego to the community page`}
                  </div>
                  <div className="flex flex-col gap-[12px]">
                    <Checkbox
                      classNames={{
                        label:
                          "text-[16px] font-bold text-[#ECECEC] 4k:text-[72.969px",
                      }}
                      color="default"
                      isSelected={formik.values.is_public}
                      onValueChange={(checked) =>
                        formik.setFieldValue("is_public", checked)
                      }
                    >
                      {`Public`}
                    </Checkbox>

                    <Checkbox
                      name="is_agree"
                      color="default"
                      isSelected={formik.values.is_agree}
                      onValueChange={(val) =>
                        formik.setFieldValue("is_agree", val)
                      }
                      value={formik.values.is_agree}
                      // onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={
                        formik.errors.is_agree && formik.touched.is_agree
                      }
                      errorMessage={
                        formik.errors.is_agree &&
                        formik.touched.is_agree &&
                        formik.errors.is_agree
                      }
                    >
                      <div className="text-[16px]">{`Agree to Togl Creator Terms`}</div>
                    </Checkbox>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center w-full mb-6">
                  <Button
                    color="default"
                    variant="bordered"
                    radius="full"
                    isLoading={submitting}
                    onPress={formik.handleSubmit}
                  >
                    {open?.isEditable ? "Update GPT" : "Create GPT"}
                  </Button>
                </div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
        <ToastService />
      </Modal>
    </>
  );
}

export default AddGptModel;